import { Button, VStack, Image, Box, Text, Spinner } from "@chakra-ui/react";
import { handleConnect } from "@utils/web3";
import { useState } from "react";
import styles from "../styles/Home.module.css";
import { useTron } from "./TronProvider";

export function Landing() {
  const { provider, setAddress } = useTron();
  const [isLoading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles.container}>
      <main className={styles.landing}>
        <VStack gap={3} zIndex={1}>
          <VStack>
            <Box w={400}>
              <Image src="/logo.png" alt="journey" />
            </Box>
            <Text mt="-2 !important">
              Please connect your wallet to continue.
            </Text>
          </VStack>
          <Button
            onClick={() => handleConnect(setLoading, setAddress, provider)}
            className={styles.connectButton}
          >
            {isLoading ? <Spinner color="white" /> : "Connect Wallet"}
          </Button>
        </VStack>
        <Box className={styles.ellipseOne}></Box>
      </main>
    </div>
  );
}
