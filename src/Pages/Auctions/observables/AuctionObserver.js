export const subscribeToBidPlaced = (contract, callback) => {
  if (!contract || !contract.events) {
    console.error("Contract not initialized or contract.events is undefined");
    return;
  }

  const eventSubscription = contract.events
    .BidPlaced({
      fromBlock: "latest",
    })
    .on("data", (event) => {
      callback(event.returnValues);
    });

  return eventSubscription;
};
