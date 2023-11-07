# notion-sh

A CLI tool for managing your shell scripts and save them to your Notion account.

## Features

-

## Usage

1. Make sure you've [created a Notion integration](https://developers.notion.com/docs/getting-started) and have a secret Notion token.
2. Add your Notion token to a `.env` file at the root of this repository: `echo "NOTION_TOKEN=[your token here]" > .env`. // todo: pass in as cli args
3. Run `npm install`.
4. Edit the `database_id` in `index.ts` from FIXME to be any database currently shared with your integration.
5. Run `npm start` to run the script.

## Development

NPM scripts:

| Script              | Action                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm start`         | Run `index.ts`.                                                                                                                                                                 |
| `npm run typecheck` | Type check using the TypeScript compiler.                                                                                                                                       |
| `npm run format`    | Format using Prettier (also recommended: the [Prettier VS Code extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) if you're using VS code.) |
| `npm run build`     | Build JavaScript into the `dist/` directory. You normally shouldn't need this if you're using `npm start`.                                                                      |

This package uses [Ink](https://github.com/vadimdemedes/ink) and it emits ESM outputs. [Why?](https://github.com/vadimdemedes/ink/pull/553#issuecomment-1464867958) [How?](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c#how-can-i-make-my-typescript-project-output-esm)
