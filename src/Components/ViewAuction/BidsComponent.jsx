import {
  Flex,
  Heading,
  Button,
  Text,
  List,
  ListItem,
  UnorderedList,
  Input,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useWeb3 } from "../../context/useWeb3";

const BidsComponent = ({
  endBlock,
  highestBiddingBid,
  placeBid,
  owner,
  cancelAuction,
  finishAuction,
  state,
}) => {
  const { web3, accounts, contracts } = useWeb3();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bid, setBid] = useState(null);

  const AuctionStates = {
    canceled: 3,
    ended: 2,
    running: 1,
    started: 0,
  };

  function getStateString(state) {
    for (let key in AuctionStates) {
      if (AuctionStates[key] === state) {
        return key;
      }
    }
    return "Unknown";
  }

  const formatTime = (timeInSeconds) => {
    const days = Math.floor(timeInSeconds / 86400);
    const hours = Math.floor((timeInSeconds % 86400) / 3600);
    const minutes = Math.floor(((timeInSeconds % 86400) % 3600) / 60);
    const seconds = ((timeInSeconds % 86400) % 3600) % 60;
    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  };

  useEffect(() => {
    const updateTimer = () => {
      web3.eth.getBlockNumber().then((current) => {
        const blocksRemaining =
          parseInt(endBlock.toString()) - parseInt(current.toString());
        const timeRemainingInSeconds = blocksRemaining * 15; // Assuming 15 seconds per block
        setTimeRemaining(timeRemainingInSeconds);
      });
    };

    if (web3 && web3.eth && endBlock) {
      updateTimer();
    }

    const timerInterval = setInterval(updateTimer, 15000);

    return () => clearInterval(timerInterval);
  }, [web3, endBlock]);

  const bidHandler = () => {
    placeBid(bid);
    setBid(null);
  };

  const cancelHandler = async () => {
    await cancelAuction();
  };

  const finishHandler = async () => {
    finishAuction();
  };

  return (
    <Flex
      ml={10}
      w="30%"
      flexDir="column"
      border="1px solid black"
      p="5"
      rounded="md"
      bgColor="aliceblue"
    >
      <Heading size="lg">Bids</Heading>
      <UnorderedList mt="3" mb={5}>
        <ListItem>
          <Text fontWeight={"bold"}>State: </Text>
          <Text>{getStateString(state)}</Text>
        </ListItem>
        <ListItem>
          <Text fontWeight={"bold"}>Time remaining: </Text>
          <Text>{formatTime(timeRemaining)}</Text>
        </ListItem>
        <ListItem>
          {highestBiddingBid != undefined && (
            <Text fontWeight={"bold"}>
              Highest bid:
              <span style={{ fontWeight: "normal", margin: "0 5px" }}>
                {parseInt(highestBiddingBid.toString())}
              </span>
              wei
            </Text>
          )}
        </ListItem>
      </UnorderedList>
      <Flex justifyContent={"center"} flexDir={"column"} flex={1}>
        {accounts[0] == owner ? (
          <>
            {state != AuctionStates.canceled && (
              <Button bgColor="red" onClick={cancelHandler}>
                Cancel auction
              </Button>
            )}
          </>
        ) : (
          state != AuctionStates.canceled &&
          state != AuctionStates.ended && (
            <>
              <FormControl>
                <FormLabel>Your bid(in eth)</FormLabel>
                <Input
                  bgColor={"white"}
                  value={bid}
                  onChange={(e) => setBid(e.target.value)}
                ></Input>
              </FormControl>
              <Button mt={3} bgColor={"Highlight"} onClick={bidHandler}>
                Place bid
              </Button>
            </>
          )
        )}
        {((state == AuctionStates.canceled && accounts[0] != owner) ||
          (state == AuctionStates.ended && accounts[0] == owner)) && (
          <Button bgColor="Highlight" onClick={() => finishHandler()}>
            Finish auction
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default BidsComponent;
