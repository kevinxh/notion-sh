import process from "node:process";
import React, { useEffect, useState } from "react";
import { Client } from "@notionhq/client";
import { useQuery } from "react-query";
import { useStdout, Box, Text, Static } from "ink";
import Spinner from "ink-spinner";
import chalk from "chalk";
import Enquirer from "enquirer";
// @ts-ignore
const { AutoComplete } = Enquirer;

type Props = {
  token: string | undefined;
};

const getRoot = async (notion: Client) => {
  return (
    await notion.search({
      query: "notion-sh",
      filter: {
        // you can either search "page" or "database"
        // here we assume that user have created a root page called "notion-sh"
        value: "page",
        property: "object",
      },
    })
  ).results[0];
};

const recursivelyFetchAllScripts: any = async (
  block: any,
  notion: Client,
  scripts: Array<object>,
  parents: any
) => {
  if (block.type === "code") {
    scripts.push({
      ...block,
      __NOTION_SH_PARENT: parents,
      __NOTION_SH_PARENT_IDS: parents.map(({ id }: any) => id),
      __NOTION_SH_PARENT_TITLES: parents.map(
        ({ child_page }: any) => child_page.title
      ),
    });
    return;
  }

  if (block.parent.type === "workspace" && block.object === "page") {
    // This is the root page, initialize the parent
    // chain, so we can keep track of a chain of parents for every leaf.
    // the relationship structure looks like
    // [grand grandparent, grandparent, parent] in decending order.
    // This parent is added as the "__NOTION_SH_PARENT" property to the leaf.
    // This array always contain blocks with type: "child_page"
    parents = [];
  }

  if (block.type === "child_page") {
    parents = [...parents, block];
  }

  if (block.object === "page" || block.type === "child_page") {
    const response = await notion.blocks.children.list({ block_id: block.id });
    return Promise.all(
      response.results.map((result: any) =>
        recursivelyFetchAllScripts(result, notion, scripts, parents)
      )
    );
  }
};

const exit = (code: number, stdout: NodeJS.WriteStream, message: string) => {
  if (code > 0) {
    stdout.write(chalk.red(message));
  } else {
    stdout.write(message);
  }
  process.exit(code);
};

export default function App({ token }: Props) {
  const notion = new Client({ auth: token });
  const { stdout } = useStdout();
  const root = useQuery({
    queryKey: ["root"],
    queryFn: async () => {
      const root = await getRoot(notion);
      if (!root || !root.id) {
        exit(
          1,
          stdout,
          'You must create a page "notion-sh" for this tool to work.'
        );
      }
      return root;
    },
  });
  const rootPageId = root.data?.id;
  const scripts = useQuery({
    queryKey: ["scripts"],
    queryFn: async () => {
      const results: Array<object> = [];
      await recursivelyFetchAllScripts(root.data, notion, results);
      return results;
    },
    enabled: !!rootPageId,
  });

  useEffect(() => {
    if (scripts.isFetched && scripts.data?.length) {
      const prompt = new AutoComplete({
        name: "flavor",
        message: "Pick your favorite flavor",
        limit: 10,
        initial: 2,
        choices: scripts.data.map((script: any) =>
          script.__NOTION_SH_PARENT_TITLES.join(" ")
        ),
      });
      prompt.run().then((answer: any) => console.log("Answer:", answer));
    }
  }, [scripts.data]);

  return (
    <Box flexDirection="column">
      {/* @ts-ignore */}
      <Text>
        {root.isLoading && <Spinner type="dots" />}
        {root.isSuccess && <Text color="green">✅</Text>}
        <Text color="green">Loading scripts from notion database...</Text>
      </Text>
      <Static items={["123", "456"]}>{(item) => <Text>{item}</Text>}</Static>
    </Box>
  );
}
