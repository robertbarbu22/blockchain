import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

const LoadingOverlay = () => {
  return (
    <Flex
      position="absolute"
      top="0"
      left="0"
      h="100vh"
      w="100vw"
      bgColor="black"
      opacity={"0.3"}
      justifyContent={"center"}
      alignItems={"center"}
      zIndex={99999999}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Flex>
  );
};

export default LoadingOverlay;
