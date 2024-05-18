import React, { useCallback, useMemo, useState } from "react";
import { useWeb3 } from "../../context/useWeb3";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Dropzone, { useDropzone } from "react-dropzone";
import cuid from "cuid";
import ImageGrid from "../../Components/AddAuction/ImageGrid";
import "./AddAuction.css";
import { uploadImageToAuctionItem } from "../../firebase";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../Components/Common/LoadingOverlay";
import GasCostModal from "../../Components/AddAuction/GasCostModal";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const AddAuction = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { web3, accounts, contracts, deployAuction } = useWeb3();
  const { auctionCreator, auctions } = contracts;
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [gasEstimateState, setGasEstimateState] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        setImages((prevState) => [
          ...prevState,
          { id: cuid(), src: e.target.result, file: file },
        ]);
      };

      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ onDrop, accept: { "image/*": [] } });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const clickHandler = async () => {
    setIsLoading(true);
    try {
      let id = await auctionCreator.methods.auctionsCount().call();

      let urls = [];
      for (let { file } of images) {
        let url = await uploadImageToAuctionItem(id, file);
        urls.push(url);
      }
      try {
        await deployAuction(id, title, description, urls);
      } catch (e) {}
      setIsLoading(false);
      toast({
        title: "Auction added",
        description: "Auction added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/auctions");
    } catch (error) {
      console.error("Error adding property:", error);
      setIsLoading(false);
      toast({
        title: "Error adding property",
        description: "Error adding property",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const estimateTransactionCost = async () => {
    if (!auctionCreator || accounts.length === 0) {
      console.error("Contract not loaded or no accounts available");
      return;
    }
    try {
      const currentBlockNumber = await web3.eth.getBlockNumber();
      const latestBlocks = await Promise.all(
        [...Array(5)].map((_, i) =>
          web3.eth.getBlock(parseInt(currentBlockNumber.toString()) - i)
        )
      );

      const averageBaseFee =
        latestBlocks.reduce(
          (acc, block) => acc + parseInt(block.baseFeePerGas),
          0
        ) / latestBlocks.length;
      const maxPriorityFeePerGas = web3.utils.toWei("2", "gwei");

      const gasEstimate = await auctionCreator.methods
        .createAuction(title, description, ["", "", ""])
        .estimateGas({
          from: accounts[0],
        });

      const estimateTransactionCostFunc = (
        gasEstimate,
        averageBaseFee,
        maxPriorityFeePerGas
      ) => {
        try {
          /* eslint-disable */
          const gasEstimateBigInt = BigInt(gasEstimate);
          /* eslint-disable */
          const averageBaseFeeBigInt = BigInt(Math.floor(averageBaseFee));
          /* eslint-disable */
          const maxPriorityFeePerGasBigInt = BigInt(maxPriorityFeePerGas);
          const totalCostWei =
            gasEstimateBigInt * averageBaseFeeBigInt +
            maxPriorityFeePerGasBigInt;

          const estimatedTransactionCost = web3.utils.fromWei(
            totalCostWei.toString(),
            "ether"
          );

          return estimatedTransactionCost;
        } catch (error) {
          console.error("Failed to estimate transaction cost:", error);
          throw error; // Re-throw the error for further handling
        }
      };
      return estimateTransactionCostFunc(
        gasEstimate,
        averageBaseFee,
        maxPriorityFeePerGas
      );
    } catch (error) {
      console.error("Transaction estimation failed:", error);
      toast({
        title: "Transaction Error",
        description:
          "Could not estimate transaction cost. Please check the input parameters and your account permissions.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex w={"100%"}>
      {web3 && auctionCreator && (
        <Box w="55%" mx="auto" p="4">
          {isLoading && <LoadingOverlay />}
          <GasCostModal
            isOpen={isOpen}
            onClose={onClose}
            clickHandler={clickHandler}
            gasEstimate={gasEstimateState}
          />
          <Box mb="4">
            <Heading size="lg" mb="2" textAlign={"center"}>
              Auction new object
            </Heading>
            <Divider />
            <FormControl mt="5">
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name"
                mb="2"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                mb="2"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Image</FormLabel>
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
              <ImageGrid images={images} />
            </FormControl>

            <Flex m="5" alignItems={"center"} justifyContent={"center"}>
              <Button
                size="lg"
                colorScheme="orange"
                onClick={async () => {
                  onOpen();
                  const estimate = await estimateTransactionCost();
                  setGasEstimateState(estimate);
                }}
              >
                Auction me
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Flex>
  );
};

export default AddAuction;
