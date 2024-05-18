import React, { useState, useEffect, createContext, useContext } from "react";
import Web3 from "web3";
import env from "../env";
import AuctionABI from "./Auction.json";
import AuctionCreatorABI from "./AuctionCreator.json";

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contracts, setContracts] = useState({
    auctionCreator: null,
    auctions: {},
  });

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const auctionCreatorContract = new web3Instance.eth.Contract(
          AuctionCreatorABI,
          env.auctionCreatorAddress
        );

        const auctions = await auctionCreatorContract.methods
          .getAuctions()
          .call();

        let newContracts = {
          auctionCreator: auctionCreatorContract,
          auctions: {},
        };
        for (let auction of auctions) {
          const auctionContract = new web3Instance.eth.Contract(
            AuctionABI,
            auction.auctionAddress
          );

          newContracts = {
            ...newContracts,
            auctions: {
              ...newContracts.auctions,
              [auction.id]: auctionContract,
            },
          };
        }

        setContracts(newContracts);
      }
    };

    initWeb3();
  }, [window.ethereum]);

  const deployAuction = async (id, title, description, urls) => {
    try {
      const auctionCreatorContract = contracts.auctionCreator;
      const transaction = await auctionCreatorContract.methods
        .createAuction(title, description, urls)
        .send({ from: accounts[0] });

      const address = await auctionCreatorContract.methods
        .getLatestAuctionAddress()
        .call();

      const auctionContract = new web3.eth.Contract(AuctionABI, address);

      setContracts({
        ...contracts,
        auctions: {
          ...contracts.auctions,
          [id]: auctionContract,
        },
      });
    } catch (error) {
      console.error("Error deploying auction contract:", error);
    }
  };

  return (
    <Web3Context.Provider value={{ web3, accounts, contracts, deployAuction }}>
      {children}
    </Web3Context.Provider>
  );
};
