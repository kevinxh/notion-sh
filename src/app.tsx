import React, { useEffect, useState } from "react";
import { Client } from "@notionhq/client";
import { Text } from "ink";
import Spinner from "ink-spinner";

type Props = {
  token: string | undefined;
};

export default function App({ token }: Props) {
  const [steps, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const notion = new Client({ auth: token });
    const fetchScripts = async () => {
      const response = await notion.search({
        query: "notion-sh",
        filter: {
          // you can either search "page" or "database"
          // here we assume that user have created a root page called "notion-sh"
          value: "page",
          property: "object",
        },
      });

      if (response.results.length === 0) {
        setIsLoading(false);
        setIsLoaded(true);
        return;
      }

      setIsLoading(false);
      setIsLoaded(true);
    };
    fetchScripts();
  }, []);

  return (
    <Text>
      {isLoading && <Spinner type="dots" />}
      {isLoaded && <Text color="green">✅</Text>}
      <Text color="green">Loading scripts from notion database...</Text>
    </Text>
  );
}
