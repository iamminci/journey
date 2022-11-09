import {
  VStack,
  Text,
  HStack,
  Image,
  Link as ChakraLink,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useTron } from "@components/TronProvider";
import styles from "@styles/Journey.module.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import withTransition from "@components/withTransition";
import Error404 from "@components/404";
import QuestCard from "@components/QuestCard";
import { dummyQuests } from "@data/quests";
import RewardPill from "@components/RewardPill";

function Quest() {
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState<any>(1);
  const [fetchedUser, setFetchedUser] = useState<any>();
  const [fetchedQuest, setFetchedQuest] = useState<any>();
  const [isSuccessful, setSuccessful] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { address } = useTron();

  const { id: questId } = router.query;

  const showSuccessToast = useCallback(() => {
    toast({
      title: "Verification success!",
      description: "You've successfully completed your quest.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  const showFailedToast = useCallback(() => {
    toast({
      title: "Verification failed.",
      description: "We're unable to verify your completion.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }, [toast]);

  const updateQuestStatus = useCallback(async () => {
    if (!fetchedUser) return;

    const newQuests = JSON.parse(JSON.stringify(fetchedUser.quests));
    newQuests[questId as string].questId = questId;
    newQuests[questId as string].status = "2";

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: address,
        quests: newQuests,
      }),
    };
    await fetch(`http://localhost:8888/api/users/${address}`, requestOptions);
  }, [address, fetchedUser, questId]);

  const fetchUser = useCallback(async () => {
    if (!address) return;
    try {
      const response = await fetch(
        `http://localhost:8888/api/users/${address}`
      );
      if (response.status === 200) {
        const user = await response.json();
        console.log("successfully fetched user: ", user);
        setFetchedUser(user);
        return user;
      }
    } catch (err) {
      console.log(err);
    }
  }, [address]);

  // check quest has completed
  const verifyQuest = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:8888/api/verify/${questId}/${address}`
      );
      if (response.status === 200) {
        setSuccessful(true);
        showSuccessToast();
        await updateQuestStatus();
        setCurrentStep((prev) => prev + 1);
      } else {
        showFailedToast();
      }
    } catch (err) {
      console.log(err);
    }
  }, [address, questId, showFailedToast, showSuccessToast, updateQuestStatus]);

  // update user quest status
  const startQuest = useCallback(async () => {
    try {
      if (address && !fetchedUser) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: address,
            quests: {
              [questId as string]: {
                questId: questId,
                startedAt: new Date().getTime(),
                status: "1",
              },
            },
          }),
        };
        await fetch(`http://localhost:8888/api/users/new`, requestOptions);
      }
      await fetchUser();
    } catch (err) {
      console.log(err);
    }
  }, [address, fetchUser, fetchedUser, questId]);

  // fetches user
  useEffect(() => {
    async function refreshState() {
      const user = await fetchUser();
      if (user && questId) {
        setCurrentStep(Number(user.quests[questId as string].status));
      }
    }
    refreshState();
  }, [address, fetchUser, questId]);

  // fetches quest
  useEffect(() => {
    async function fetchQuest() {
      if (!questId) return;
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8888/api/quests/${questId}`
        );
        const quest = await response.json();
        setFetchedQuest(quest);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
    fetchQuest();
  }, [questId]);

  if (isLoading)
    return (
      <VStack className={styles.loadingContainer}>
        <Spinner color="white" size="xl" />
      </VStack>
    );

  if (!fetchedQuest) return <Error404 />;

  function handleClick(e) {
    e.preventDefault();
    router.push("/quest/V2zbf8iYGGGzFnkXQ6tB");
  }

  return (
    <VStack className={styles.container}>
      <VStack className={styles.questContainer}>
        <HStack pb="1rem" gap={2}>
          <Image
            src={fetchedQuest.imageUrl}
            alt="hi"
            className={styles.dappLogo}
          ></Image>
          <VStack className={styles.questTitleContainer}>
            <Text className={styles.questTitle}>{fetchedQuest.title}</Text>
            <Text className={styles.questSubtitle}>
              {fetchedQuest.description}
            </Text>
          </VStack>
        </HStack>
        <HStack width="100%" justifyContent="space-between" pb=".5rem">
          <Text>Your progress: 0/3</Text>
          <HStack>
            <Text>17275/20000 rewarded</Text>
          </HStack>
        </HStack>
        <Box className={styles.divider} />
      </VStack>
      <VStack gap={10}>
        {dummyQuests.slice(0, 3).map(({ title }, idx) => (
          <HStack key={idx} position="relative">
            {idx === 0 && (
              <Image
                src="/line1.png"
                alt="line1"
                className={styles.line1}
              ></Image>
            )}
            {idx % 2 && <Box w="80px"></Box>}
            <QuestCard
              title={title}
              handleClick={handleClick}
              isLocked={idx !== 0}
            />
            {!(idx % 2) && <Box w="80px"></Box>}
            {idx === 1 && (
              <Image
                src="/line2.png"
                alt="line2"
                className={styles.line2}
              ></Image>
            )}
            {idx === 2 && (
              <Image
                src="/line3.png"
                alt="line3"
                className={styles.line3}
              ></Image>
            )}
          </HStack>
        ))}
        <VStack pb="5rem">
          <RewardPill label="Achievement: Sun Expert" />
          <Box w="1" height="10px"></Box>
          <Image src="/sun.png" alt="sun" className={styles.achievementBadge} />
        </VStack>
      </VStack>
    </VStack>
  );
}

export default withTransition(Quest);
