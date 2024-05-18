import React, { useEffect, useState } from "react";
import { useWeb3 } from "../../context/useWeb3";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase.js";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import AuctionCard from "../../Components/Auction/AuctionCard";
import { useNavigate } from "react-router-dom";

const ListMyAuctions = () => {
  const navigate = useNavigate();
  const { web3, accounts, contracts } = useWeb3();
  const { auctionCreator, auctions } = contracts;
  const [auctionList, setAuctionList] = useState({});

  useEffect(() => {
    if (auctionCreator) {
      loadAuctions();
    }
  }, [auctionCreator]);

  const loadAuctions = async () => {
    const auctions = await auctionCreator.methods
      .getMyAuctions(accounts[0])
      .call();
    for (let auction of auctions) {
      setAuctionList((oldState) => ({
        ...oldState,
        [auction.auctionAddress]: { ...auction, title: auction.title },
      }));
    }
  };

  return (
    <Flex flexDir={"column"} w={"100%"}>
      <Flex flexDir={"column"}>
        <Heading as="h1" size="xl" textAlign={"left"}>
          My Auctions
        </Heading>
        <Text textAlign={"left"}>
          In this page you can see the auctions where you had placed a bid. If a
          auction has been canceled, you can press finish to take back your
          money !
        </Text>
      </Flex>
      <Flex justifyContent={"center"} flexDir={"column"} alignItems={"center"}>
        {Object.values(auctionList).length > 0 ? (
          Object.values(auctionList).map((auction) => {
            return <AuctionCard auction={auction} removeHandler={() => {}} />;
          })
        ) : (
          <Heading>You have not bid in any auction yet</Heading>
        )}
      </Flex>
    </Flex>
  );
};

export default ListMyAuctions;
