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
  scripts: Array<object>
) => {
  if (block.type === "code") {
    scripts.push(block);
    return;
  }

  if (block.object === "page" || block.type === "child_page") {
    const response = await notion.blocks.children.list({ block_id: block.id });
    return Promise.all(
      response.results.map((result: any) =>
        recursivelyFetchAllScripts(result, notion, scripts)
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

  console.log("render");
  console.log(scripts.data);

  return (
    <Box flexDirection="column">
      <Text>
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
