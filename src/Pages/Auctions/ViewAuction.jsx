import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWeb3 } from "../../context/useWeb3";
import {
  Button,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import ChakraCarousel from "../../Components/ViewAuction/Carousel";
import BidsComponent from "../../Components/ViewAuction/BidsComponent";
import { subscribeToBidPlaced } from "./observables/AuctionObserver";
import LoadingOverlay from "../../Components/Common/LoadingOverlay";

const ViewAuction = () => {
  let { id } = useParams();
  const toast = useToast();
  const { web3, accounts, contracts } = useWeb3();
  const { auctions } = contracts;
  const [auctionDetails, setAuctionDetails] = useState({ imageUrl: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (auctions && auctions[id]) {
      getAuctionDetails();

      const unsubscribe = subscribeToBidPlaced(auctions[id], getAuctionDetails);
    }
  }, [auctions]);

  useEffect(() => {
    if (auctions && auctions[id]) {
      getAuctionDetails();
    }
  }, [auctions]);

  const getAuctionDetails = async () => {
    let auction = await auctions[id].methods.getAuctionDetails().call();
    setAuctionDetails(auction);
    console.log(auction);
  };

  const placeBid = async (ammount) => {
    setIsLoading(true);
    try {
      const bidAmountWei = web3.utils.toWei(ammount.toString(), "ether");
      await auctions[id].methods.placeBid().send({
        from: accounts[0],
        value: bidAmountWei,
      });
      setIsLoading(false);
      console.log("Bid placed successfully");
      toast({
        title: "Bid placed successfully",
        description: "Bid placed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error placing bid:", error);
      setIsLoading(false);
      toast({
        title: "Bid not placed",
        description: "Error during bid placing",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cancelAuction = async () => {
    setIsLoading(true);
    try {
      await auctions[id].methods.cancelAuction().send({
        from: accounts[0],
      });

      setIsLoading(false);
      toast({
        title: "Canceled auction",
        description: "Canceled auction successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error placing bid:", error);
      setIsLoading(false);
      toast({
        title: "Error cancelling auction",
        description: "Error cancelling auction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const finishAuction = async () => {
    setIsLoading(true);
    try {
      await auctions[id].methods.finalizeAuction().send({
        from: accounts[0],
      });
      setIsLoading(false);
      toast({
        title: "Finished auction",
        description: "Finished auction successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error placing bid:", error);
      setIsLoading(false);
      toast({
        title: "Error finishing auction",
        description: "Error finishing auction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const handleAccountChange = () => {
      window.location.reload();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
    };
  }, []);

  return (
    <Flex flexDir="row" w="100%" h="100%">
      {auctionDetails && auctionDetails.auctionState && (
        <>
          {isLoading && <LoadingOverlay />}
          <Flex flexDir={"column"} w="70%" alignItems={"center"}>
            <Flex dir="row">
              <Heading fontWeight={"300"}>Auction for:</Heading>
              <Heading fontWeight={"bold"} ml="3">
                {auctionDetails.title}
              </Heading>
            </Flex>
            <Text
              mt={3}
              color="gray.500"
            >{`"${auctionDetails.description}"`}</Text>

            {auctionDetails.imageUrls &&
              auctionDetails.imageUrls.length > 0 && (
                <ChakraCarousel gap={15}>
                  {auctionDetails.imageUrls.map((url) => (
                    <Image src={url} alt="url"></Image>
                  ))}
                </ChakraCarousel>
              )}
          </Flex>
          <BidsComponent
            endBlock={auctionDetails.endBlock}
            highestBiddingBid={auctionDetails.highestBiddingBid}
            placeBid={placeBid}
            owner={auctionDetails.owner}
            cancelAuction={cancelAuction}
            finishAuction={finishAuction}
            state={parseInt(auctionDetails.auctionState.toString())}
          />
        </>
      )}
    </Flex>
  );
};

export default ViewAuction;
