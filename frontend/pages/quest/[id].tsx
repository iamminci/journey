import {
  VStack,
  Text,
  HStack,
  Button,
  Image,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useTron } from "@components/TronProvider";
import styles from "@styles/Quest.module.css";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { CheckCircleIcon, LockIcon } from "@chakra-ui/icons";
import withTransition from "@components/withTransition";
import Error404 from "@components/404";
import Confetti from "react-confetti";
import { FaTwitter } from "react-icons/fa";

function Quest() {
  const toast = useToast();
  const [hasClaimedReward, setClaimedReward] = useState<boolean>(false);
  const [isQuestCompleted, setQuestCompleted] = useState<boolean>(false);
  const [isQuestActive, setQuestActive] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<any>(0);
  const [fetchedUser, setFetchedUser] = useState<any>();
  const [fetchedQuest, setFetchedQuest] = useState<any>();
  const [isVerifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [isStartLoading, setStartLoading] = useState<boolean>(false);
  const [isClaimLoading, setClaimLoading] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { address } = useTron();

  const { id: questId } = router.query;

  const showSuccessToast = useCallback(
    (isClaim?: boolean) => {
      toast({
        title: isClaim ? "Claim success!" : "Verification success!",
        description: isClaim
          ? "You've successfully claimed your reward."
          : "You've successfully completed your quest.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [toast]
  );

  const showFailedToast = useCallback(
    (isClaim?: boolean) => {
      toast({
        title: isClaim ? "Claim failed." : "Verification failed.",
        description: isClaim
          ? "Oops, claim failed. Please standby."
          : "We're unable to verify your completion.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
    [toast]
  );

  const updateQuestStatus = useCallback(async () => {
    if (!fetchedUser) return;

    const newQuests = JSON.parse(JSON.stringify(fetchedUser.quests));
    newQuests[questId as string].currentStep = currentStep + 1;

    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: address,
        quests: newQuests,
      }),
    };
    await fetch(`http://localhost:8888/api/users/${address}`, requestOptions);
  }, [address, currentStep, fetchedUser, questId]);

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
    setVerifyLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8888/api/verify/${questId}/${address}`
      );
      if (response.status === 200) {
        showSuccessToast();
        await updateQuestStatus();
        if (currentStep === fetchedQuest.numSteps - 1) setQuestCompleted(true);
        setCurrentStep((prev) => prev + 1);
      } else {
        showFailedToast();
      }
    } catch (err) {
      console.log(err);
    }
    setVerifyLoading(false);
  }, [
    address,
    currentStep,
    fetchedQuest,
    questId,
    showFailedToast,
    showSuccessToast,
    updateQuestStatus,
  ]);

  // update user quest status
  const startQuest = useCallback(async () => {
    setStartLoading(true);
    try {
      const newQuests = JSON.parse(JSON.stringify(fetchedUser.quests));
      newQuests[questId as string] = {
        questId: questId,
        startedAt: new Date().getTime(),
        currentStep: 0,
      };

      if (address) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address: address,
            newQuests: newQuests,
          }),
        };
        await fetch(
          `http://localhost:8888/api/users/startQuest`,
          requestOptions
        );
        setQuestActive(true);
      }
      await fetchUser();
    } catch (err) {
      console.log(err);
    }
    setStartLoading(false);
  }, [address, fetchUser, fetchedUser, questId]);

  const refreshState = useCallback(async () => {
    const user = await fetchUser();
    if (user && questId && user.quests && user.quests[questId as string]) {
      if (
        fetchedQuest &&
        user.quests[questId as string].currentStep === fetchedQuest.numSteps
      ) {
        setQuestCompleted(true);
      }

      if (
        fetchedUser &&
        fetchedUser.quests[questId as string] &&
        fetchedUser.quests[questId as string].hasClaimed
      ) {
        setClaimedReward(true);
      }
      setQuestActive(!!user.quests[questId as string]);
      setCurrentStep(Number(user.quests[questId as string].currentStep));
      console.log("state refreshed");
    }
  }, [fetchUser, fetchedQuest, fetchedUser, questId]);

  function connectTwitter(e: any) {
    e.preventDefault();
    router.push("/profile");
  }

  const claimReward = useCallback(async () => {
    setClaimLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8888/api/claim/${questId}/${address}`
      );
      if (response.status === 200) {
        showSuccessToast(true);
        setClaimedReward(true);
      } else {
        showFailedToast(true);
      }
    } catch (err) {
      console.log(err);
    }
    setClaimLoading(false);
  }, [address, questId, showFailedToast, showSuccessToast]);

  // fetches user
  useEffect(() => {
    refreshState();
  }, [address, fetchUser, questId, refreshState]);

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
        console.log("fetched quest: ", quest);
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

  const questSteps = Object.values(fetchedQuest.steps);

  return (
    <VStack className={styles.container}>
      {isQuestCompleted && (
        <Confetti width={1450} height={1000} numberOfPieces={100} />
      )}
      {fetchedQuest && (
        <HStack alignItems="flex-start">
          <VStack
            className={
              isQuestCompleted
                ? `${styles.rewardContainer} ${styles.questCompleted}`
                : styles.rewardContainer
            }
          >
            <Text className={styles.rewardTitle}>Quest Reward</Text>
            {fetchedQuest.token_reward && (
              <RewardStep
                title={`$${fetchedQuest.token_reward.amount} ${fetchedQuest.token_reward.symbol}`}
                description="Reward will be airdropped into your wallet"
                stepNum={1}
              />
            )}
            {fetchedQuest.nft_reward && (
              <RewardStep
                title={`${fetchedQuest.nft_reward.title}`}
                description={`${fetchedQuest.nft_reward.description}`}
                imageUrl={`${fetchedQuest.nft_reward.image_url}`}
                stepNum={2}
              />
            )}
            {fetchedQuest.xp && (
              <RewardStep
                title={`${fetchedQuest.xp} XP`}
                description="Collect experience points to level up!"
                stepNum={3}
              />
            )}
            <Button
              className={styles.primaryButton}
              onClick={claimReward}
              isDisabled={!isQuestCompleted || hasClaimedReward}
            >
              {hasClaimedReward ? (
                "Reward claimed"
              ) : isClaimLoading ? (
                <Spinner />
              ) : (
                "Claim Reward"
              )}
            </Button>
          </VStack>
          <VStack className={styles.questContainer}>
            <HStack pb="1rem" gap={2}>
              <Image
                src={fetchedQuest.partner.image_url}
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
              <Text>
                My progress:{" "}
                {isQuestCompleted
                  ? "Completed!"
                  : !isQuestActive
                  ? "Not Started"
                  : `${currentStep}/${questSteps.length} completed`}
              </Text>
              <HStack>
                <Text>17 rewarded</Text>
              </HStack>
            </HStack>
            <Box className={styles.divider} />
            <VStack pt=".5rem" gap={2}>
              {questSteps.map(
                ({ title: stepTitle, description, isTwitter }, stepIdx) => (
                  <QuestStep
                    key={stepIdx}
                    stepNum={stepIdx + 1}
                    title={stepTitle}
                    user={fetchedUser}
                    description={description}
                    verifyQuest={verifyQuest}
                    startQuest={startQuest}
                    connectTwitter={connectTwitter}
                    isStartLoading={isStartLoading}
                    isVerifyLoading={isVerifyLoading}
                    isCompleted={currentStep > stepIdx}
                    isLocked={currentStep < stepIdx}
                    isQuestActive={isQuestActive}
                    isTwitter={isTwitter}
                  />
                )
              )}
            </VStack>
          </VStack>
        </HStack>
      )}
    </VStack>
  );
}

export default withTransition(Quest);

type QuestStepProps = {
  stepNum: number;
  title: string;
  description: string;
  user: any;
  verifyQuest: () => {};
  startQuest: () => {};
  connectTwitter: (e: any) => void;
  isStartLoading: boolean;
  isVerifyLoading: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  isQuestActive?: boolean;
  isTwitter?: boolean;
};

function QuestStep({
  stepNum,
  title,
  description,
  user,
  verifyQuest,
  startQuest,
  connectTwitter,
  isCompleted,
  isLocked,
  isQuestActive,
  isStartLoading,
  isVerifyLoading,
  isTwitter,
}: QuestStepProps) {
  return (
    <HStack
      className={styles.questStep}
      opacity={isLocked || isCompleted ? 0.55 : 1}
    >
      <Box minWidth="20px">
        {isLocked ? (
          <LockIcon />
        ) : isCompleted ? (
          <CheckCircleIcon />
        ) : (
          <Text>{stepNum}</Text>
        )}
      </Box>
      <VStack alignItems="flex-start" width="100%">
        <Text className={styles.questStepTitle}>{title}</Text>
        <Text className={styles.questStepDesc}>{description}</Text>
      </VStack>
      <HStack w="120px">
        {!isQuestActive && stepNum === 1 ? (
          <Button
            className={styles.primaryButton}
            onClick={startQuest}
            isDisabled={isLocked}
          >
            {isStartLoading ? <Spinner /> : "Start"}
          </Button>
        ) : user && !user.twitter && isTwitter ? (
          <Button
            className={styles.twitterButton}
            onClick={connectTwitter}
            isDisabled={isLocked}
          >
            <HStack>
              <FaTwitter />
              <Text>Connect</Text>
            </HStack>
          </Button>
        ) : (
          !isCompleted && (
            <Button
              className={styles.secondaryButton}
              onClick={verifyQuest}
              isDisabled={isLocked}
            >
              {isVerifyLoading && !isCompleted && !isLocked ? (
                <Spinner />
              ) : (
                "Verify"
              )}
            </Button>
          )
        )}
      </HStack>
    </HStack>
  );
}

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
