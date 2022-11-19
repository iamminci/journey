import { Text, VStack, SimpleGrid, Spinner } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import withTransition from "@components/withTransition";
import QuestCard from "./QuestCard";
import { useEffect, useState } from "react";
import { useTron } from "./TronProvider";
import Error404 from "@components/404";

const JOURNEY_API_URL =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? process.env.NEXT_PUBLIC_API_PROD
    : process.env.NEXT_PUBLIC_API_DEV;

function Explore() {
  const [fetchedQuests, setFetchedQuests] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // fetches quest
  useEffect(() => {
    async function fetchQuests() {
      setLoading(true);
      try {
        const response = await fetch(`${JOURNEY_API_URL}/api/quests`);
        const { quests } = await response.json();
        console.log("fetched quests: ", quests);
        setFetchedQuests(quests);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    fetchQuests();
  }, []);

  function handleClick(e: any, id: string) {
    e.preventDefault();
    router.push(`/quest/${id}`);
  }

  if (isLoading)
    return (
      <VStack className={styles.loadingContainer}>
        <Spinner color="white" size="xl" />
      </VStack>
    );

  if (fetchedQuests.length === 0) return <Error404 />;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Text className={styles.title}>Explore Quests</Text>
        <SimpleGrid columns={2} gap={5} pt={10}>
          {fetchedQuests
            .sort((a, b) => a.order - b.order)
            .map(
              ({
                title,
                description,
                nft_reward,
                token_reward,
                partner,
                xp,
                id,
              }) => (
                <QuestCard
                  title={title}
                  description={description}
                  partner={partner}
                  nft_reward={nft_reward}
                  token_reward={token_reward}
                  xp={xp}
                  handleClick={(e) => handleClick(e, id)}
                  key={id}
                />
              )
            )}
        </SimpleGrid>
      </main>
    </div>
  );
}

export default withTransition(Explore);
