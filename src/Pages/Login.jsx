import { Button, Flex, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import LoadingOverlay from "../Components/Common/LoadingOverlay";

const MetamaskLogin = () => {
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const connectToMetamask = async () => {
    try {
      setLoading(true);
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        // Request access to user's MetaMask accounts
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setLoggedIn(true);
        toast({
          title: "Logged in",
          description: "Logged in successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        localStorage.setItem("isAuth", "true");
      } else {
        setError("MetaMask is not installed");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to connect to MetaMask",
        description: "Failed to connect to MetaMask",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setError("Failed to connect to MetaMask");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex alignItems={"center"} justifyContent={"center"} w="100vh" h="70vh">
      {loggedIn ? (
        <p>You are logged in with MetaMask!</p>
      ) : (
        <Button onClick={connectToMetamask} disabled={loading}>
          {loading ? "Connecting..." : "Connect with MetaMask"}
          {loading && <LoadingOverlay />}
        </Button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Flex>
  );
};

export default MetamaskLogin;
