#!/usr/bin/env node
import React from "react";
import { render } from "ink";
import yargs from "yargs";
import { QueryClient, QueryClientProvider } from "react-query";
import { hideBin } from "yargs/helpers";
import App from "./app.jsx";

const argv = yargs(hideBin(process.argv)).options({
  t: {
    alias: "token",
    demandOption: "Please provide a token via --token or -t",
    describe: "Auth token",
    type: "string",
  },
}).argv;

// @ts-ignore
const { token } = argv;

const queryClient = new QueryClient();

render(
  <QueryClientProvider client={queryClient}>
    <App token={token} />
  </QueryClientProvider>
);
