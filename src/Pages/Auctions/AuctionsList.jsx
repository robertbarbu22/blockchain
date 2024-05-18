import React, { useEffect, useState } from "react";
import { useWeb3 } from "../../context/useWeb3";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebase.js";
import { Button, Flex, Heading } from "@chakra-ui/react";
import AuctionCard from "../../Components/Auction/AuctionCard";
import { useNavigate } from "react-router-dom";

const AuctionsList = () => {
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
    const auctions = await auctionCreator.methods.getAuctions().call();
    for (let auction of auctions) {
      setAuctionList((oldState) => ({
        ...oldState,
        [auction.auctionAddress]: { ...auction, title: auction.title },
      }));
    }
  };

  return (
    <Flex flexDir={"column"} w={"100%"}>
      <Flex
        flexDir={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Heading as="h1" size="xl">
          Auctions
        </Heading>
        <Button bgColor="orange" onClick={() => navigate("/auctions/add")}>
          Add object to auction
        </Button>
      </Flex>
      <Flex justifyContent={"center"} flexDir={"column"} alignItems={"center"}>
        {Object.values(auctionList).length > 0 &&
          Object.values(auctionList).map((auction) => {
            return <AuctionCard auction={auction} removeHandler={() => {}} />;
          })}
      </Flex>
    </Flex>
  );
};

export default AuctionsList;
