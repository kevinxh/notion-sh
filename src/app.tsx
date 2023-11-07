import React, { useEffect, useState } from "react";
import { Client } from "@notionhq/client";
import { useQuery } from "react-query";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

type Props = {
  token: string | undefined;
};

const getRoot = async (notion: Client) => {
  return await notion.search({
    query: "notion-sh",
    filter: {
      // you can either search "page" or "database"
      // here we assume that user have created a root page called "notion-sh"
      value: "page",
      property: "object",
    },
  });
};

const getPageById = async (notion: Client, pageId: string) => {
  //   return await notion.pages.retrieve({ page_id: pageId });
  return await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });
};

const getBlockDetail = async (notion: Client, blockId: string) => {
  //   return await notion.pages.retrieve({ page_id: pageId });
  return await notion.blocks.retrieve({
    block_id: blockId,
  });
};

export default function App({ token }: Props) {
  const notion = new Client({ auth: token });
  const root = useQuery({ queryKey: ["root"], queryFn: () => getRoot(notion) });
  const rootPageId = root.data?.results?.[0]?.id;
  const page = useQuery({
    queryKey: ["page", rootPageId],
    enabled: !!rootPageId,
    queryFn: () => getPageById(notion, rootPageId!),
  });
  const scriptPageId = page.data?.results[0].id;
  const scriptPage = useQuery({
    queryKey: ["page", scriptPageId],
    enabled: !!scriptPageId,
    queryFn: () => getPageById(notion, scriptPageId!),
  });
  const codePageId = scriptPage.data?.results[0].id;
  const code = useQuery({
    queryKey: ["page", codePageId],
    enabled: !!codePageId,
    queryFn: () => getBlockDetail(notion, codePageId!),
  });

  // @ts-ignore
  console.log(scriptPage.data?.results[0].code);
  //   console.log(JSON.stringify(code.data));
  return (
    <Box flexDirection="column">
      <Text>
        {root.isLoading && <Spinner type="dots" />}
        {root.isSuccess && <Text color="green">✅</Text>}
        <Text color="green">Loading scripts from notion database...</Text>
      </Text>
      {root.data?.results?.length === 0 && (
        <Text color="red">
          You must create a page call "notion-sh" for this tool to work.
        </Text>
      )}
    </Box>
  );
}
