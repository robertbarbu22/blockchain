import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import contractABI from './json/contractABI.json';
import ContractComponent from './components/ContractComponent';

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

const AuctionApp = () => {
  const [contractInstance, setContractInstance] = useState(null);
  const [auctionsCount, setAuctionsCount] = useState(0);

  useEffect(() => {
    const initContract = async () => {
      try {
        // Adresa reală a contractului pe rețeaua Ethereum
        const ContractAddress = '0xfe4e8741b48dba7057d02532b0ce2112929b355e';
        const instance = new web3.eth.Contract(contractABI, ContractAddress);
        setContractInstance(instance);
        const count = await instance.methods.getAuctionsCount().call();
        setAuctionsCount(count);
      } catch (error) {
        console.error('Eroare la inițializarea contractului:', error);
      }
    };

    initContract();
  }, []);

  const createAuction = async () => {
    try {
      await contractInstance.methods.createAuction().send({ from: '0x9A41827b66E7c37436B1A61c0858459B5Dc880D0' });
      const count = await contractInstance.methods.getAuctionsCount().call();
      setAuctionsCount(count);
    } catch (error) {
      console.error('Eroare la crearea licitației:', error);
    }
  };

  return (
    <div>
      <h1>Interfață pentru Contractul Solidity Auction</h1>
      <p>Numărul de licitații: {auctionsCount}</p>
      <button onClick={createAuction}>Crează licitație nouă</button>
    </div>
  );
};

ReactDOM.render(<AuctionApp />, document.getElementById('root'));
