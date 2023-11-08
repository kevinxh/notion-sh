const searchResult = {
  root: {
    results: [
      {
        object: "page",
        id: "0cba7fa4-d6da-4aec-920e-942522a184fb",
        created_time: "2023-11-07T02:04:00.000Z",
        last_edited_time: "2023-11-07T06:12:00.000Z",
        created_by: {
          object: "user",
          id: "568f941e-f27e-4c67-9f02-74a493ca405b",
        },
        last_edited_by: {
          object: "user",
          id: "568f941e-f27e-4c67-9f02-74a493ca405b",
        },
        cover: null,
        icon: {
          type: "external",
          external: {
            url: "https://www.notion.so/icons/compass_lightgray.svg",
          },
        },
        parent: { type: "workspace", workspace: true },
        archived: false,
        properties: { title: { id: "title", type: "title", title: [Array] } },
        url: "https://www.notion.so/notion-sh-0cba7fa4d6da4aec920e942522a184fb",
        public_url: null,
      },
    ],
  },
};

const blocksResult = {
  "0cba7fa4-d6da-4aec-920e-942522a184fb": {
    object: "list",
    results: [
      {
        object: "block",
        id: "06a6a502-2513-4e74-a546-f9b9ae9e6314",
        parent: [Object],
        created_time: "2023-11-07T06:11:00.000Z",
        last_edited_time: "2023-11-08T00:29:00.000Z",
        created_by: [Object],
        last_edited_by: [Object],
        has_children: true,
        archived: false,
        type: "child_page",
        child_page: [Object],
      },
      {
        object: "block",
        id: "1d752f02-4871-4943-8a35-fc09e0662f82",
        parent: [Object],
        created_time: "2023-11-07T06:12:00.000Z",
        last_edited_time: "2023-11-07T06:12:00.000Z",
        created_by: [Object],
        last_edited_by: [Object],
        has_children: false,
        archived: false,
        type: "paragraph",
        paragraph: [Object],
      },
    ],
    next_cursor: null,
    has_more: false,
    type: "block",
    block: {},
    request_id: "b6a54e01-6d84-4dd5-b884-1d8845be2aa6",
  },
  "06a6a502-2513-4e74-a546-f9b9ae9e6314": {
    object: "list",
    results: [
      {
        object: "block",
        id: "c3b3bfde-1c26-4826-8cef-91db731232f6",
        parent: [Object],
        created_time: "2023-11-07T06:12:00.000Z",
        last_edited_time: "2023-11-08T00:29:00.000Z",
        created_by: [Object],
        last_edited_by: [Object],
        has_children: false,
        archived: false,
        type: "code",
        code: {
          caption: [],
          rich_text: [
            {
              type: "text",
              text: {
                content: 'echo "123456"\ntest\nnewline\n\n""\nwhat\'sup',
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: 'echo "123456"\ntest\nnewline\n\n""\nwhat\'sup',
              href: null,
            },
          ],
          language: "bash",
        },
      },
      {
        object: "block",
        id: "ba148b3e-fc2b-4b2f-b781-43e5b4e64f27",
        parent: [Object],
        created_time: "2023-11-08T00:29:00.000Z",
        last_edited_time: "2023-11-08T00:29:00.000Z",
        created_by: [Object],
        last_edited_by: [Object],
        has_children: false,
        archived: false,
        type: "paragraph",
        paragraph: [Object],
      },
    ],
    next_cursor: null,
    has_more: false,
    type: "block",
    block: {},
    request_id: "6c5fbc81-ef33-46a2-81cf-451eb0e184d5",
  },
};

const notion = {
  search: () => {
    return searchResult.root;
  },
  blocks: {
    children: {
      list: ({ block_id }) => {
        return Promise.resolve(blocksResult[block_id]);
      },
    },
  },
};

let blocks = [];

const recursiveFetch = async (block) => {
  console.log("recursiveFetch");
  // console.log(block)
  if (block.type === "code") {
    blocks.push(block);
    return;
  }

  if (block.object === "page" || block.type === "child_page") {
    const response = await notion.blocks.children.list({ block_id: block.id });
    return Promise.all(
      response.results.map((result) => recursiveFetch(result))
    );
  }
};

const main = async () => {
  await recursiveFetch(searchResult.root.results[0]);
  console.log(blocks);
};

main();
