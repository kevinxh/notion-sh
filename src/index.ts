import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const pageId = "0cba7fa4d6da4aec920e942522a184fb";

  const response = await notion.pages.retrieve({ page_id: pageId });
  // const response = await notion.databases.retrieve({ database_id: databaseId });
  // const response = await notion.search({
  //   query: "notion-sh",
  //   filter: {
  //     value: "database",
  //     property: "object",
  //   },
  // });

  // const response = await notion.databases.query();

  console.log("Got response:", response);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
