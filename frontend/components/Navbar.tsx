import Link from "next/link";
import styles from "@styles/Navbar.module.css";
import { Button, HStack, Image, Text } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <HStack className={styles.navbar}>
      <Link href="/">
        {/* <Image
          src="/logo.png"
          alt="Logo"
          cursor="pointer"
          className={styles.logo}
        ></Image> */}
        <Text>JOURNEY</Text>
      </Link>
      <HStack className={styles.navLeftSection}>
        {/* <ConnectButton /> */}
        <Text>Explore</Text>
        <Text>My Profile</Text>
        <Text>Community</Text>
        <Button>Connect Wallet</Button>
      </HStack>
    </HStack>
  );
};

export default Navbar;
