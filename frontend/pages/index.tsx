import {
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import { Landing } from "@components/Landing";
import { useTron } from "@components/TronProvider";
import Link from "next/link";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { FaCoins } from "react-icons/fa";
import { useRouter } from "next/router";

const dummyQuests = [
  {
    title: "Swap on Sunswap",
  },
  {
    title: "Lend on Justlend",
  },
  {
    title: "Buy an NFT",
  },
  {
    title: "Lend on JustStables",
  },
  {
    title: "Swap on Sunswap",
  },
  {
    title: "Swap on Sunswap",
  },
];

export default function Home() {
  const { address } = useTron();
  const router = useRouter();

  if (!address) return <Landing />;

  function handleClick(e) {
    e.preventDefault();
    router.push("/quest/V2zbf8iYGGGzFnkXQ6tB");
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Text className={styles.title}>Explore Quests</Text>
        <SimpleGrid columns={2} gap={5} pt={10}>
          {dummyQuests.map(({ title }, idx) => (
            <QuestCard title={title} key={idx} handleClick={handleClick} />
          ))}
        </SimpleGrid>
      </main>
    </div>
  );
}

type QuestCardProps = {
  title: string;
  handleClick: (e: any) => void;
};

function QuestCard({ title, handleClick }: QuestCardProps) {
  return (
    <HStack className={styles.questCard} onClick={handleClick}>
      <VStack alignItems="flex-start" gap={3}>
        <VStack alignItems="flex-start">
          <HStack>
            <Box w="36px">
              <Image src="/sun.png" alt="sunswap"></Image>
            </Box>
            <Text className={styles.title}>{title}</Text>
          </HStack>
          <Text className={styles.subtitle}>
            Make a swap of any token pair on Sunswap
          </Text>
        </VStack>
        <HStack>
          <RewardPill imageUrl="/coin.svg" label="$10 SUN" />
          <RewardPill imageUrl="/badge.svg" label="NFT Badge" />
          <RewardPill imageUrl="/sparkle.svg" label="1000 XP" />
        </HStack>
      </VStack>
      <Box w={144}>
        <Image src="/tronnaut.jpg" alt="tronnaut" borderRadius={20}></Image>
      </Box>
    </HStack>
  );
}

type RewardPillProps = {
  imageUrl: string;
  label: string;
};

function RewardPill({ imageUrl, label }: RewardPillProps) {
  return (
    <HStack className={styles.rewardPill}>
      <Box w={5}>
        <Image src={imageUrl} alt="coin icon" />
      </Box>
      <Text>{label}</Text>
    </HStack>
  );
}
