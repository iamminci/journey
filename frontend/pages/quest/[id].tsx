import {
  VStack,
  Text,
  HStack,
  Button,
  Image,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import { useTron } from "@components/TronProvider";
import styles from "@styles/Quest.module.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export default function Quest() {
  const toast = useToast();

  const [currentStep, setCurrentStep] = useState<any>(1);
  const [fetchedUser, setFetchedUser] = useState<any>();
  const [fetchedQuest, setFetchedQuest] = useState<any>();
  const [isSuccessful, setSuccessful] = useState<boolean>(false);
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
      try {
        console.log("quest ID: ", questId);
        const response = await fetch(
          `http://localhost:8888/api/quests/${questId}`
        );
        const quest = await response.json();
        setFetchedQuest(quest);
      } catch (err) {
        console.log(err);
      }
    }
    fetchQuest();
  }, [questId]);

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

  return (
    <VStack className={styles.container}>
      {fetchedQuest && (
        <HStack>
          <VStack>
            <Image
              src="/sunswap_nft.jpg"
              alt="hi"
              className={styles.questNFT}
            />
            <Button>Claim Reward</Button>
          </VStack>
          <VStack className={styles.questContainer}>
            <HStack>
              <Image
                src={fetchedQuest.imageUrl}
                alt="hi"
                className={styles.dappLogo}
              ></Image>
              <VStack className={styles.questTitleContainer}>
                <Text className={styles.questTitle}>{fetchedQuest.title}</Text>
                <Text>{fetchedQuest.description}</Text>
              </VStack>
            </HStack>
            <HStack>
              <Text>Your progress: 0/3</Text>
              <HStack>
                <Text>17275/20000 rewarded</Text>
              </HStack>
            </HStack>
            <QuestStep
              stepNum={1}
              title="Swap at least 10 TRX to SUN on Sunswap"
              primaryCtaLabel="Verify"
              primaryCtaAction={verifyQuest}
              secondaryCtaLabel="Start"
              secondaryCtaAction={startQuest}
              isCompleted={currentStep > 1}
            />
            <QuestStep
              stepNum={2}
              title="Follow sunswap on Twitter"
              primaryCtaLabel="Verify"
              isCompleted={currentStep > 2}
              isLocked={currentStep < 2}
            />
            <QuestStep
              stepNum={3}
              title="Claim your 15 TRX reward"
              primaryCtaLabel="Claim"
              isLocked={currentStep < 3}
            />
          </VStack>
        </HStack>
      )}
    </VStack>
  );
}

type QuestStepProps = {
  stepNum: number;
  title: string;
  primaryCtaLabel: string;
  primaryCtaAction?: () => void;
  secondaryCtaLabel?: string;
  secondaryCtaAction?: () => void;
  isCompleted?: boolean;
  isLocked?: boolean;
};

function QuestStep({
  stepNum,
  title,
  primaryCtaLabel,
  primaryCtaAction,
  secondaryCtaLabel,
  secondaryCtaAction,
  isCompleted,
  isLocked,
}: QuestStepProps) {
  return isCompleted ? (
    <VStack className={styles.completedContainer}>
      <Text className={styles.completedText}>
        STEP {stepNum}: {title}
      </Text>
      <CheckCircleIcon />
    </VStack>
  ) : isLocked ? (
    <VStack className={styles.completedContainer}>
      <Text className={styles.completedText}>
        STEP {stepNum}: {title}
      </Text>
      <HStack>
        <Button disabled>{primaryCtaLabel}</Button>
        {secondaryCtaLabel && <Button disabled>{secondaryCtaLabel}</Button>}
      </HStack>
    </VStack>
  ) : (
    <VStack className={styles.questStepContainer}>
      <Text>
        STEP {stepNum}: {title}
      </Text>
      <HStack>
        <Button onClick={primaryCtaAction}>{primaryCtaLabel}</Button>
        {secondaryCtaLabel && (
          <Button onClick={secondaryCtaAction}>{secondaryCtaLabel}</Button>
        )}
      </HStack>
    </VStack>
  );
}
