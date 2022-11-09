import { Text, VStack, HStack, Image, Box, SimpleGrid } from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import RewardPill from "./RewardPill";

type QuestCardProps = {
  title: string;
  handleClick: (e: any) => void;
  isLocked?: boolean;
};

export default function QuestCard({
  title,
  handleClick,
  isLocked,
}: QuestCardProps) {
  return (
    <HStack
      className={isLocked ? styles.lockedQuest : styles.questCard}
      onClick={handleClick}
    >
      <VStack alignItems="flex-start" gap={3} opacity={isLocked ? 0.55 : 1}>
        <HStack>
          <Box w="100px">
            <Image src="/sun.png" alt="sunswap"></Image>
          </Box>
          <VStack alignItems="flex-start">
            <Text className={styles.title}>{title}</Text>
            <Text className={styles.subtitle}>
              Make a swap of any token pair on Sunswap
            </Text>
            <HStack>
              <RewardPill imageUrl="/coin.svg" label="1 active quest" />
              <RewardPill imageUrl="/badge.svg" label="2 expired quests" />
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </HStack>
  );
}
