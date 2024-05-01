import React from 'react';

const ContractComponent = ({ contractInstance }) => {
  // Funcție pentru a crea o licitație nouă
  const createAuction = async () => {
    try {
      await contractInstance.methods.createAuction().send({ from: '0x9A41827b66E7c37436B1A61c0858459B5Dc880D0' });
      const count = await contractInstance.methods.getAuctionsCount().call();
      setAuctionsCount(count);
    } catch (error) {
      console.error('Eroare la crearea licitației:', error);
    }
  };

  // Funcție pentru a obține numărul de licitații
  const getAuctionsCount = async () => {
    try {
      const count = await contractInstance.methods.getAuctionsCount().call();
      console.log('Numărul de licitații:', count);
    } catch (error) {
      console.error('Eroare la obținerea numărului de licitații:', error);
    }
  };

  // Funcție pentru afișarea formularului de creare a unei noi licitații
  const renderCreateAuctionForm = () => {
    return (
      <div>
        <h3>Creare licitație nouă</h3>
        <button onClick={createAuction}>Crează licitație</button>
      </div>
    );
  };

  return (
    <div>
      <h2>Interacțiune cu contractul</h2>
      <button onClick={getAuctionsCount}>Obține numărul de licitații</button>
      {renderCreateAuctionForm()}
      {/* Adaugă alte funcționalități aici */}
    </div>
  );
};

export default ContractComponent;
