import React, { useEffect, useState } from "react";
import { Client } from "@notionhq/client";
import { useQuery } from "react-query";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

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

export default function App({ token }: Props) {
  const notion = new Client({ auth: token });
  const root = useQuery({ queryKey: ["root"], queryFn: () => getRoot(notion) });
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

  return (
    <Box flexDirection="column">
      {/* @ts-ignore */}
      <Text scripts={scripts.data}>
        {root.isLoading && <Spinner type="dots" />}
        {root.isSuccess && <Text color="green">✅</Text>}
        <Text color="green">Loading scripts from notion database...</Text>
      </Text>
      {!rootPageId && (
        <Text color="red">
          You must create a page call "notion-sh" for this tool to work.
        </Text>
      )}
    </Box>
  );
}
