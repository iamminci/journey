import { Text, VStack, HStack, Image, Box, SimpleGrid } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import withTransition from "@components/withTransition";
import { dummyQuests } from "@data/quests";
import QuestCard from "@components/QuestCard";
import PartnerCard from "@components/PartnerCard";

function Explore() {
  const router = useRouter();

  function handleClick(e) {
    e.preventDefault();
    router.push("/journey/V2zbf8iYGGGzFnkXQ6tB");
    // router.push("/quest/V2zbf8iYGGGzFnkXQ6tB");
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Text className={styles.title}>Explore Partners</Text>
        <SimpleGrid columns={2} gap={5} pt={10}>
          {dummyQuests.map(({ title }, idx) => (
            <PartnerCard title={title} key={idx} handleClick={handleClick} />
          ))}
        </SimpleGrid>
      </main>
    </div>
  );
}

export default withTransition(Explore);
