import {
  Button,
  Input,
  Text,
  Link as ChakraLink,
  VStack,
  HStack,
  Image,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import Landing from "@components/Landing";
import { useTron } from "@components/TronProvider";
import withTransition from "@components/withTransition";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "@styles/Profile.module.css";
import { abridgeAddress } from "@utils/abridgeAddress";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import RewardPill from "@components/RewardPill";

function Profile() {
  const { address } = useTron();

  if (!address) return <Landing />;

  return (
    <VStack pt="6rem">
      <VStack w="1180px" position="relative">
        <Image src="/cover.png" alt="cover"></Image>
        <HStack className={styles.profileContainer}>
          <HStack w="33%" alignItems="flex-end">
            <RewardPill imageUrl="/medal.svg" label="Platinum" />
            <RewardPill imageUrl="/sparkle.svg" label="12000 XP" />
          </HStack>
          <VStack w="33%">
            <Image
              src="/profile.png"
              alt="profile"
              className={styles.profileImage}
            ></Image>
            <Text className={styles.profileName}>journeyor</Text>
            <Text className={styles.profileAddress}>
              ({abridgeAddress(address)})
            </Text>
          </VStack>
          <HStack w="33%" justifyContent="flex-end" alignItems="flex-end">
            <VStack className={styles.socialIcon}>
              <FaDiscord />
            </VStack>
            <VStack className={styles.socialIcon}>
              <FaGithub />
            </VStack>
            <VStack className={styles.socialIcon}>
              <FaTwitter />
            </VStack>
          </HStack>
        </HStack>
      </VStack>
      <VStack pt="2rem">
        <VStack w="100%" alignItems="flex-start">
          <Text className={styles.profileName}>Badges</Text>
        </VStack>
        <SimpleGrid columns={4} gap={5}>
          {[0, 0, 0, 0].map((num) => (
            <Box w="300px" key={num}>
              <Image src="/tronnaut.jpg" borderRadius="20px"></Image>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>
    </VStack>
  );
}

export default withTransition(Profile);

function TwitterConnect() {
  const { address } = useTron();
  const [fetchedUser, setFetchedUser] = useState();
  const [tweetURL, setTweetURL] = useState("");
  const [verified, setVerified] = useState(false);
  const [uuid, setUuid] = useState("");

  useEffect(() => {
    async function fetchUser() {
      if (!address) return;
      try {
        const response = await fetch(
          `http://localhost:8888/api/users/${address}`
        );
        if (response.status === 200) {
          const user = await response.json();
          setFetchedUser(user);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchUser();
  }, [address]);

  const authLink = useMemo(() => {
    if (!fetchedUser) return "";
    return `https://twitter.com/intent/tweet?text=Verifying+uuid:${fetchedUser.uuid}`;
  }, [fetchedUser]);

  async function verifyTwitter() {
    try {
      const id = tweetURL.split("/")[5];
      const response = await fetch(
        `http://localhost:8888/api/twitter/tweet/${id}`
      );
      //   const { data } = await response.json();
      //   const fetchedId = data.text.split("uuid:")[1];
      //   if (fetchedId === uuid) {
      // setVerified(true);
      //   }
    } catch (err) {
      console.log(err);
    }
  }

  function handleURLChange(e) {
    setTweetURL(e.target.value);
  }
  return (
    <VStack pt="4rem">
      <HStack>
        <VStack>
          <Text>Step 1: Tweet verification message</Text>
          <ChakraLink href={authLink} isExternal>
            <Button>Tweet</Button>
          </ChakraLink>
        </VStack>
        <VStack>
          <Text>Step 2: Paste URL to tweet to verify</Text>
          <HStack>
            <Input onChange={handleURLChange}></Input>
            <Button onClick={verifyTwitter}>Verify Twitter</Button>
          </HStack>
        </VStack>
      </HStack>
      {verified && <Text>Verification successful!</Text>}
    </VStack>
  );
}
