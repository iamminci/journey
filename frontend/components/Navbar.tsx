import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { Button, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import { useTron } from "./TronProvider";
import { abridgeAddress } from "@utils/abridgeAddress";
import { useState } from "react";
import { handleConnect, handleDisconnect } from "@utils/web3";

const Navbar = () => {
  const { address, provider, setAddress } = useTron();
  const [isLoading, setLoading] = useState<boolean>(false);

  if (!address) return;

  return (
    <HStack className={styles.navbar}>
      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo"
          cursor="pointer"
          className={styles.logo}
        ></Image>
      </Link>
      <HStack className={styles.navLeftSection}>
        <Text>Explore</Text>
        <Link href="/profile">
          <Text>My Profile</Text>
        </Link>
        <Text>Community</Text>
        {address ? (
          <VStack
            className={styles.addressPill}
            onClick={() => handleDisconnect(setAddress)}
            cursor="pointer"
          >
            <Text>{abridgeAddress(address)}</Text>
          </VStack>
        ) : (
          <Button
            onClick={() => handleConnect(setLoading, setAddress, provider)}
            className={styles.connectButton}
          >
            {isLoading ? <Spinner color="white" /> : "Connect Wallet"}
          </Button>
        )}
      </HStack>
    </HStack>
  );
};

export default Navbar;
