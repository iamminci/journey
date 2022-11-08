import {
  Button,
  Input,
  Text,
  Link as ChakraLink,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useTron } from "@components/TronProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function Profile() {
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

  if (!address)
    return (
      <VStack pt="4rem">
        <Text>Please connect wallet to proceed</Text>
      </VStack>
    );

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

export default Profile;
