import {
  VStack,
  Text,
  HStack,
  Button,
  Image,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import styles from "@styles/Quest.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";

export default function Quest() {
  const toast = useToast();

  const [isSuccessful, setSuccessful] = useState<boolean>(false);
  const router = useRouter();
  const userAddress = "";

  const { id: questId } = router.query;

  // check quest has completed
  const verifyQuest = useCallback(async () => {
    // const result = await axios.get(`quest.com/${questId}/${userAddress}`);
    const result = false;
    if (result) {
      setSuccessful(true);
      updateQuestStatus();
    } else {
      toast({
        title: "Verification failed.",
        description: "We're unable to verify your completion.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, []);

  // update user quest status
  const updateQuestStatus = () => {};

  return (
    <VStack className={styles.container}>
      <HStack>
        <VStack>
          <Image src="/sunswap_nft.jpg" alt="hi" className={styles.questNFT} />
          <Button>Claim Reward</Button>
        </VStack>
        <VStack className={styles.questContainer}>
          <HStack>
            <Image
              src="/sunswap_logo.png"
              alt="hi"
              className={styles.dappLogo}
            ></Image>
            <VStack className={styles.questTitleContainer}>
              <Text className={styles.questTitle}>Swap on Sunswap</Text>
              <Text>Make a swap of any token pair on Sunswap</Text>
            </VStack>
          </HStack>
          <HStack>
            <Text>Your progress: 0/3</Text>
            <HStack>
              <Text>17275/20000 rewarded</Text>
              <VStack className={styles.userContainer}>
                <Image
                  src="/1.jpg"
                  alt="1"
                  className={styles.userImage}
                ></Image>
                <Image
                  src="/2.jpg"
                  alt="2"
                  className={styles.userImage}
                ></Image>
                <Image
                  src="/3.jpg"
                  alt="3"
                  className={styles.userImage}
                ></Image>
                <Image
                  src="/4.jpg"
                  alt="4"
                  className={styles.userImage}
                ></Image>
              </VStack>
            </HStack>
          </HStack>
          <VStack className={styles.questStepContainer}>
            <HStack>
              <Text>STEP 1:</Text>
              <Text>
                Swap at least 10 TRX to SUN on{" "}
                <ChakraLink href="https://sunswap.com" isExternal>
                  Sunswap
                </ChakraLink>
              </Text>
            </HStack>
            <Button onClick={verifyQuest}>Verify</Button>
          </VStack>
          <VStack className={styles.questStepContainer}>
            <HStack>
              <Text>STEP 2:</Text>
              <Text>Follow sunswap on Twitter</Text>
            </HStack>
            <Button>Verify</Button>
          </VStack>
          <VStack className={styles.questStepContainer}>
            <HStack>
              <Text>STEP 3:</Text>
              <Text>Claim your 15 TRX reward</Text>
            </HStack>
            <Button>Claim</Button>
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
}
