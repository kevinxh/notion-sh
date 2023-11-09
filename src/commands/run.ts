import {Client} from '@notionhq/client'
import {Command} from '@oclif/core'
import Listr from 'listr'
import {Logger} from 'tslog'

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

const logger = new Logger({name: 'notion-sh', type: 'pretty'})

interface CodeBlockObject extends CodeBlockObjectResponse {
  __NOTION_SH_PARENT: ChildPageBlockObjectResponse[] | undefined
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
  parents?: ChildPageBlockObjectResponse[] | undefined,
): Promise<CodeBlockObject[] | undefined> => {
  const isPage = block.object === 'page'
  const isBlock = block.object === 'block'
  const isChildPage = isBlock && 'type' in block && block.type === 'child_page'
  if (isBlock && 'type' in block && block.type === 'code') {
    codeBlocks.push({
      ...block,
      __NOTION_SH_PARENT: parents,
      __NOTION_SH_PARENT_IDS: parents!.map(({id}) => id),
      __NOTION_SH_PARENT_TITLES: parents!.map(({child_page}) => child_page.title),
    })
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
      response.results.map((result) => recursivelyFetchAllCodeBlocks(result, notion, codeBlocks, parents)),
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
  logger.debug('searchResult', searchResult)

  if (searchResult.results.length === 0) {
    throw new Error('No script found. Please create a page called "notion-sh"')
  }

  const rootPage = searchResult.results[0]

  const results: CodeBlockObject[] = []
  await recursivelyFetchAllCodeBlocks(rootPage, notion, results)
  logger.debug('results.length', results.length)
  return results
}

export default class Run extends Command {
  static description = 'describe the command here'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const token = process.env.NOTION_TOKEN
    if (!token) {
      this.error('Notion token not found. Please set the NOTION_TOKEN environment variable.')
    }

    const notion = new Client({auth: token})
    const tasks = new Listr([
      {
        async task() {
          return fetchAllScripts({notion})
        },
        title: 'Loading scripts from your notion...',
      },
    ])

    await tasks.run()
  }
}
