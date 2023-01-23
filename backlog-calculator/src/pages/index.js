import Head from "next/head";
import {
  CardListContainer,
  LoadingBubble,
  OuterSearchBarContainer,
  SearchBarContainer,
  TitleContainer,
} from "@/pages/index.styles";
import GameDisplayCard from "@/components/GameDisplayCard/GameDisplayCard";
import { useEffect, useState } from "react";
import localStorageGameListHandler from "@/util/localStorageGameListHandler";

export default function Home() {
  const [gameQuery, setGameQuery] = useState("");
  const [timeoutId, setTimeoutId] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function getGameResults() {
    const hltbFetch = await fetch(`/api/hltb?q=${gameQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const hltbJson = await hltbFetch.json();
    setSearchResults(hltbJson.response);
    setIsLoading(false);
  }

  useEffect(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsLoading(true);
    const changeQuery = setTimeout(() => {
      getGameResults();
    }, 1500);
    setTimeoutId(changeQuery);
  }, [gameQuery]);

  const handleGameList = (method, key, value) => {
    localStorageGameListHandler(method, key, value);
  };

  return (
    <>
      <Head>
        <title>Backlog estimator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Hahmlet"
          rel="stylesheet"
        />
      </Head>
      <div>
        <TitleContainer onClick={() => handleGameList("list")}>
          Backlog estimator
        </TitleContainer>

        <OuterSearchBarContainer isEmpty={gameQuery.length == 0}>
          <SearchBarContainer
            placeholder="Search for a game...."
            cols="57"
            rows="1"
            onChange={(e) => setGameQuery(e.target.value)}
          />
        </OuterSearchBarContainer>

        {!isLoading && (
          <CardListContainer>
            {searchResults.map((elem) => (
              <GameDisplayCard
                key={elem.id}
                gameInfo={elem}
                addFunc={() =>
                  handleGameList("add", elem.id, JSON.stringify(elem))
                }
              />
            ))}
          </CardListContainer>
        )}

        {isLoading && <LoadingBubble />}
      </div>
    </>
  );
}
