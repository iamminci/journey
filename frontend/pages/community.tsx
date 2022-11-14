import {
  VStack,
  Text,
  HStack,
  Button,
  Box,
  Switch,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Input,
  Image,
  filter,
  CloseButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Link as ChakraLink,
  Divider,
  Spinner,
} from "@chakra-ui/react";
import Link from "next/link";
import withTransition from "@components/withTransition";
import styles from "@styles/Community.module.css";
import { Checkbox } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Landing from "@components/Landing";
import { useTron } from "@components/TronProvider";
import { abridgeAddress } from "@utils/abridgeAddress";

const users = [
  {
    id: Math.random() * 1000,
    address: "TAFY85f6xtVNvriSbXAx1t5YDQ89f871C8",
    username: "wagmi.trx",
    tier: "Platinum",
    count: 20,
    joinedAt: "6/22/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TM7f6dspGyhbmSHQKrzeCj1ePq94Cfv2YE",
    username: "hellofrens",
    tags: ["Contributor"],
    tier: "Bronze",
    count: 3,
    joinedAt: "9/23/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TQxkA8Ttbw9f39kxS2TMuPNFK2JLzEwcqz",
    username: "sunlover",
    tags: ["Supporter"],
    tier: "Silver",
    count: 9,
    joinedAt: "6/3/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TB6BoQBe2bGpg4gnq7Kaf74Kry9NQCttBd",
    username: "0xtutu",
    tags: ["Developer"],
    tier: "Gold",
    count: 11,
    joinedAt: "8/30/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TAFY85f6xtVNvriSbXAx1t5YDQ89f871C8",
    username: "cocob.trx",
    tags: ["Developer", "Contributor"],
    tier: "Silver",
    count: 10,
    joinedAt: "9/3/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TM7f6dspGyhbmSHQKrzeCj1ePq94Cfv2YE",
    username: "yolongmi",
    tags: ["Contributor"],
    tier: "Bronze",
    count: 29,
    joinedAt: "4/30/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TQxkA8Ttbw9f39kxS2TMuPNFK2JLzEwcqz",
    username: "defimaxi",
    tags: ["Contributor"],
    tier: "Bronze",
    count: 12,
    joinedAt: "5/1/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TB6BoQBe2bGpg4gnq7Kaf74Kry9NQCttBd",
    username: "0xgucci.trx",
    tags: ["Developer", "Contributor"],
    tier: "Silver",
    count: 18,
    joinedAt: "8/12/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TM7f6dspGyhbmSHQKrzeCj1ePq94Cfv2YE",
    username: "ngmilol.trx",
    tags: ["Contributor"],
    tier: "Platinum",
    count: 23,
    joinedAt: "7/13/2022",
  },
  {
    id: Math.random() * 1000,
    address: "TAFY85f6xtVNvriSbXAx1t5YDQ89f871C8",
    username: "charliesh",
    tags: ["Supporter"],
    tier: "Platinum",
    count: 25,
    joinedAt: "3/9/2022",
  },
];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Community() {
  const { address } = useTron();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [optionsVisible, setOptionsVisible] = useState<boolean>();
  const [modalStep, setModalStep] = useState(0);

  function handleAmountChange(e) {
    setAmount(e.target.value);
  }

  function handleCheckChange(e, id) {
    if (e.target.checked) {
      setSelectedUsers((prev) => [...prev, id]);
    } else {
      const filteredUsers = selectedUsers.filter(function (value) {
        return value !== id;
      });

      setSelectedUsers(filteredUsers);
    }
  }

  function toggleTag(filter) {
    if (selectedTags.includes(filter)) {
      const filteredUsers = selectedTags.filter(function (value) {
        return value !== filter;
      });
      setSelectedTags(filteredUsers);
    } else {
      setSelectedTags((prev) => [...prev, filter]);
    }
  }

  function toggleTier(filter) {
    if (selectedTiers.includes(filter)) {
      const filteredUsers = selectedTiers.filter(function (value) {
        return value !== filter;
      });
      setSelectedTiers(filteredUsers);
    } else {
      setSelectedTiers((prev) => [...prev, filter]);
    }
  }

  const filteredUsers =
    selectedTags.length > 0 || selectedTiers.length > 0
      ? users.filter((user) => {
          return (
            user.tags.some((value) => selectedTags.includes(value)) ||
            selectedTiers.includes(user.tier)
          );
        })
      : users;

  function handleSwitchChange(e: any) {
    const filteredIds = filteredUsers.map((user) => user.id);
    if (e.target.checked) {
      setSelectedUsers([...filteredIds]);
    } else {
      setSelectedUsers([]);
    }
  }

  function handleTokenChange(name) {
    setSelectedToken(name);
    setOptionsVisible(false);
  }

  const isAirdropSuccess = false;
  const txnHash = "";

  if (!address) return <Landing />;

  if (isAirdropSuccess)
    return (
      <VStack className={styles.container}>
        <HStack className={styles.contentContainer}>
          <VStack w="100%" gap="1.5rem">
            <Image
              alt="builder dao"
              src="/cronos_coin2.png"
              className={styles.sbtImage}
            ></Image>
            <Box h="10px" />
            <Text className={styles.title}>
              Woo, you just airdropped tokens!
            </Text>
            <Text className={styles.successClaimHeader}>
              We’ve airdropped 0.1 CRO tokens to developers
            </Text>
            <HStack>
              <ChakraLink
                href={
                  txnHash
                    ? `https://cronos.org/explorer/testnet3/tx/${txnHash}`
                    : "https://cronos.org/explorer/testnet3/tx/0x73b89429e1c02520ff5cfabe28df0d8b2bd85ece3bb69e33deba314f8827e866"
                }
                isExternal
              >
                <Button className={styles.primaryBtn}>View transaction</Button>
              </ChakraLink>
              <Link href="/">
                <Button className={styles.secondaryBtn2}>Go to home</Button>
              </Link>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    );

  return (
    <VStack className={styles.container}>
      <VStack w="100%" pb="2rem">
        <Text className={styles.title}>Community Leaderboard</Text>
      </VStack>
      <HStack alignItems="flex-start" gap="1rem">
        <VStack>
          <HStack w="100%" justifyContent="flex-start" gap=".5rem">
            {selectedTags.map((filter, idx) => (
              <HStack key={idx} className={styles.filterContainer}>
                <Text>{capitalizeFirstLetter(filter)}</Text>
                <CloseButton />
              </HStack>
            ))}
            {selectedTiers.map((filter, idx) => (
              <HStack key={idx} className={styles.filterContainer}>
                <Text>{capitalizeFirstLetter(filter)}</Text>
                <CloseButton />
              </HStack>
            ))}
          </HStack>
          <HStack className={styles.tableHeaderContainer}>
            <Text className={styles.tableHeader1}>Rank</Text>
            <Text className={styles.tableHeader2}>Username</Text>
            <Text className={styles.tableHeader3}>Address</Text>
            <Text className={styles.tableHeader4}>XP</Text>
            <Text className={styles.tableHeader5}>Tier</Text>
            <Text className={styles.tableHeader6}>Date joined</Text>
          </HStack>
          {filteredUsers
            .sort((a, b) => b.count - a.count)
            .map(
              ({ username, address, tags, tier, count, joinedAt, id }, idx) => (
                <HStack key={id} className={styles.tableRowContainer}>
                  <Text className={styles.tableHeader1}>{idx}</Text>
                  <Text className={styles.tableHeader2}>{username}</Text>
                  <Text className={styles.tableHeader3}>
                    {abridgeAddress(address)}
                  </Text>
                  <Text className={styles.tableHeader4}>{count}</Text>
                  <Text className={styles.tableHeader5}>{tier}</Text>
                  <Text className={styles.tableHeader6}>{joinedAt}</Text>
                </HStack>
              )
            )}
        </VStack>
      </HStack>
    </VStack>
  );
}

export default withTransition(Community);
