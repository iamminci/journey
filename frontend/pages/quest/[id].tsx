import {
  VStack,
  Text,
  HStack,
  Button,
  Image,
  Link as ChakraLink,
  useToast,
  Box,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { useTron } from "@components/TronProvider";
import styles from "@styles/Quest.module.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import withTransition from "@components/withTransition";
import Error404 from "@components/404";

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

  return (
    <VStack className={styles.container}>
      {fetchedQuest && (
        <HStack>
          <VStack className={styles.rewardContainer}>
            <Text className={styles.rewardTitle}>Quest Reward</Text>
            <RewardStep
              title="$10 in SUN Token"
              description="Reward will be airdropped into your wallet"
              stepNum={1}
            />
            <RewardStep
              title="Sunswap Quest Badge"
              description="Exclusive NFT for first 100 quest completions"
              imageUrl="/tronnaut.jpg"
              stepNum={2}
            />
            <RewardStep
              title="1000 XP"
              description="Collect experience points to level up!"
              stepNum={3}
            />
          </VStack>
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
            <VStack pt=".5rem" gap={2}>
              <QuestStep
                stepNum={1}
                title="Swap at least 10 TRX to SUN"
                description="Go to Sunswap and swap"
                secondaryCtaLabel="Verify"
                secondaryCtaAction={verifyQuest}
                primaryCtaLabel="Start"
                primaryCtaAction={startQuest}
                isCompleted={currentStep > 1}
              />
              <QuestStep
                stepNum={2}
                title="Follow sunswap on Twitter"
                description="Go to Sunswap and swap"
                secondaryCtaLabel="Verify"
                primaryCtaLabel="Start"
                isCompleted={currentStep > 2}
                isLocked={currentStep < 2}
              />
              <QuestStep
                stepNum={3}
                title="Claim your 15 TRX reward"
                description="Go to Sunswap and swap"
                primaryCtaLabel="Claim"
                isLocked={currentStep < 3}
              />
            </VStack>
          </VStack>
        </HStack>
      )}
    </VStack>
  );
}

export default withTransition(Quest);

type RewardStepProps = {
  stepNum: number;
  title: string;
  description: string;
  imageUrl?: string;
};

function RewardStep({
  stepNum,
  title,
  description,
  imageUrl,
}: RewardStepProps) {
  return (
    <HStack className={styles.rewardStep}>
      <Box minWidth="20px">
        <Text>{stepNum}</Text>
      </Box>
      <VStack alignItems="flex-start" width="100%">
        <Text className={styles.questStepTitle}>{title}</Text>
        <Text className={styles.questStepDesc}>{description}</Text>

        {imageUrl && (
          <HStack width="90%" justifyContent="center" pt="1rem">
            <Image src={imageUrl} alt="nft image" className={styles.nftImage} />
          </HStack>
        )}
      </VStack>
    </HStack>
  );
}

type QuestStepProps = {
  stepNum: number;
  title: string;
  description: string;
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
  description,
  primaryCtaLabel,
  primaryCtaAction,
  secondaryCtaLabel,
  secondaryCtaAction,
  isCompleted,
  isLocked,
}: QuestStepProps) {
  return (
    <HStack
      className={styles.questStep}
      opacity={isLocked || isCompleted ? 0.55 : 1}
      cursor={isLocked || isCompleted ? "auto" : "pointer"}
    >
      <Box minWidth="20px">
        {!isCompleted ? <Text>{stepNum}</Text> : <CheckCircleIcon />}
      </Box>
      <VStack alignItems="flex-start" width="100%">
        <Text className={styles.questStepTitle}>{title}</Text>
        <Text className={styles.questStepDesc}>{description}</Text>
      </VStack>
      <HStack width="288px">
        {secondaryCtaLabel && !isCompleted && (
          <Button
            className={styles.secondaryButton}
            onClick={secondaryCtaAction}
            isDisabled={isLocked}
          >
            {secondaryCtaLabel}
          </Button>
        )}
        {!isCompleted && (
          <Button
            className={styles.primaryButton}
            onClick={primaryCtaAction}
            isDisabled={isLocked}
          >
            {primaryCtaLabel}
          </Button>
        )}
      </HStack>
    </HStack>
  );
}
