import {spawn} from 'node:child_process'
import {Client} from '@notionhq/client'
import {Command, Args, Flags} from '@oclif/core'
import {Logger} from 'tslog'
import Enquirer from 'enquirer'
import {oraPromise} from 'ora'
// @ts-ignore
const {AutoComplete} = Enquirer

import type {
  ChildPageBlockObjectResponse,
  CodeBlockObjectResponse,
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  DatabaseObjectResponse,
} from '../types.ts'

const logger = new Logger({name: 'notion-sh', type: process.env.NOTION_SH_DEBUG ? 'pretty' : 'hidden'})

interface CodeBlockObject extends CodeBlockObjectResponse {
  __NOTION_SH_PARENT: ChildPageBlockObjectResponse[] | undefined
  __NOTION_SH_PARENT_COMMAND: string
  __NOTION_SH_PARENT_CONTENT: string
  __NOTION_SH_PARENT_IDS: string[]
  __NOTION_SH_PARENT_TITLES: string[]
}

const recursivelyFetchAllCodeBlocks = async (
  block:
    | PartialBlockObjectResponse
    | BlockObjectResponse
    | PageObjectResponse
    | PartialPageObjectResponse
    | PartialDatabaseObjectResponse
    | DatabaseObjectResponse,
  notion: Client,
  codeBlocks: CodeBlockObject[],
  codeBlocksMap: Record<string, CodeBlockObject>,
  parents?: ChildPageBlockObjectResponse[] | undefined,
): Promise<CodeBlockObject[] | undefined> => {
  const isPage = block.object === 'page'
  const isBlock = block.object === 'block'
  const isChildPage = isBlock && 'type' in block && block.type === 'child_page'
  if (isBlock && 'type' in block && block.type === 'code') {
    const __NOTION_SH_PARENT = parents
    const __NOTION_SH_PARENT_IDS = parents!.map(({id}) => id)
    const __NOTION_SH_PARENT_TITLES = parents!.map(({child_page}) => child_page.title)
    const __NOTION_SH_PARENT_COMMAND = parents!.map(({child_page}) => child_page.title).join(' ')
    const __NOTION_SH_PARENT_CONTENT = block.code.rich_text[0].plain_text
    const codeBlock = {
      ...block,
      __NOTION_SH_PARENT,
      __NOTION_SH_PARENT_IDS,
      __NOTION_SH_PARENT_TITLES,
      __NOTION_SH_PARENT_COMMAND,
      __NOTION_SH_PARENT_CONTENT,
    }
    codeBlocks.push(codeBlock)
    codeBlocksMap[__NOTION_SH_PARENT_COMMAND] = codeBlock
  }

  if (isPage && 'parent' in block && block.parent.type === 'workspace') {
    // This is the root page, initialize the parent
    // chain, so we can keep track of a chain of parents for every leaf.
    // the relationship structure looks like
    // [grand grandparent, grandparent, parent] in decending order.
    // This parent is added as the "__NOTION_SH_PARENT" property to the leaf.
    // This array always contain blocks with type: "child_page"
    parents = []
  }

  if (isChildPage) {
    parents = parents ? [...parents, block] : [block]
  }

  if (isPage || isChildPage) {
    const response = await notion.blocks.children.list({block_id: block.id})

    // @ts-ignore
    return Promise.all(
      response.results.map((result) =>
        recursivelyFetchAllCodeBlocks(result, notion, codeBlocks, codeBlocksMap, parents),
      ),
    )
  }
}

const fetchAllScripts = async ({notion}: {notion: Client}) => {
  logger.debug('fetchAllScripts')
  const searchResult = await notion.search({
    filter: {
      property: 'object',
      // you can either search "page" or "database"
      // here we assume that user have created a root page called "notion-sh"
      value: 'page',
    },
    query: 'notion-sh',
  })

  if (searchResult.results.length === 0) {
    throw new Error('No script found. Please create a page called "notion-sh"')
  }

  const rootPage = searchResult.results[0]

  const codeBlocksArr: CodeBlockObject[] = []
  const codeBlocksMap = {}
  await recursivelyFetchAllCodeBlocks(rootPage, notion, codeBlocksArr, codeBlocksMap)
  logger.debug('results.length', codeBlocksArr.length)
  return {
    codeBlocksArr,
    codeBlocksMap,
  }
}

export default class Run extends Command {
  static description = 'describe the command here'
  static examples = ['<%= config.bin %> <%= command.id %>']
  static strict = false
  static args = {
    command: Args.string({
      name: 'command', // name of arg to show in help and reference with args[name]
      required: false, // make the arg required with `required: true`
      description: 'The command name (your Notion page name)',
      hidden: false, // hide this arg from help
    }),
  }

  // TODO: to be fixed
  static flags = {
    flags: Flags.string({
      char: 'f', // shorter flag version
      summary: 'Flags to be passed thru to command', // help summary for flag
      hidden: false, // hide from help
      multiple: true, // allow setting this flag multiple times
      required: false, // make flag required
    }),
  }

  static delimiter = ' '

  public async run(): Promise<void> {
    const token = process.env.NOTION_TOKEN
    if (!token) {
      this.error('Notion token not found. Please set the NOTION_TOKEN environment variable.')
    }

    const notion = new Client({auth: token})
    const results = await oraPromise(fetchAllScripts({notion}), {
      text: 'Loading scripts from your Notion pages...',
    })
    logger.debug(`Successfully fetched ${results.codeBlocksArr.length} scripts!`)

    const {argv, flags} = await this.parse(Run)
    logger.debug('argv', argv)
    logger.debug('flags', flags)

    let command = argv.join(Run.delimiter)
    const {flags: f} = flags

    if (!command) {
      // if no command is provided, show a list of all commands
      const prompt = new AutoComplete({
        name: 'script',
        message: 'Execute ->',
        limit: 10,
        choices: results.codeBlocksArr
          .sort((a, b) => (new Date(a.last_edited_time) < new Date(b.last_edited_time) ? 1 : -1))
          .map((script: CodeBlockObject) => script.__NOTION_SH_PARENT_COMMAND),
      })
      command = await prompt.run()
    }

    logger.debug('command', command)
    logger.debug('argv0', f?.map((flag) => `--${flag}`).join(' '))
    spawn(
      // @ts-ignore
      results.codeBlocksMap[command].__NOTION_SH_PARENT_CONTENT,
      f?.map((flag) => `--${flag}`) || [],
      {
        shell: true,
        cwd: process.cwd(),
        stdio: 'inherit',
      },
    )
  }
}
