import {
  Badge,
  Box,
  Flex,
  Text,
  Image,
  chakra,
  Link,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const AuctionCard = ({ auction, removeHandler }) => {
  const navigate = useNavigate();
  return (
    <Box
      bg="#edf3f8"
      _dark={{
        bg: "gray.800",
      }}
      mx={8}
      display={"flex"}
      maxW={"5xl"}
      shadow={"lg"}
      rounded={"lg"}
      w={"3xl"}
      my={8}
      _hover={{ bg: "#a5aaad", cursor: "pointer" }}
      onClick={() => navigate("/auctions/" + auction.id)}
    >
      <Box w={"30%"}>
        <Box
          h={{
            base: 64,
            lg: "full",
          }}
          rounded={{
            lg: "lg",
          }}
          bgSize="cover"
        >
          <Image
            rounded={{
              lg: "lg",
            }}
            src={auction.imageUrls[0]}
          ></Image>
        </Box>
      </Box>

      <Box
        py={12}
        px={6}
        maxW={{
          base: "xl",
          lg: "5xl",
        }}
        w={{
          lg: "50%",
        }}
      >
        <chakra.h2
          fontSize={{
            base: "2xl",
            md: "3xl",
          }}
          color="gray.800"
          _dark={{
            color: "white",
          }}
          fontWeight="bold"
        >
          {auction.title}
        </chakra.h2>
        <Text
          mt="1"
          color="gray.500"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          noOfLines={1}
        >
          {auction.description}
        </Text>
        {/* <Flex justifyContent={"space-between"}>
            <Button
              mt="3"
              onClick={() => navigate(`/viewProperty/${auction.id}`)}
            >
              View Property
            </Button>
            <Button
              colorScheme="red"
              mt="3"
              onClick={() => removeHandler(auction.id)}
            >
              Remove Property
            </Button>
          </Flex> */}
      </Box>
    </Box>
  );
};

export default AuctionCard;
