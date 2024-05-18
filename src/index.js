import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { ChakraProvider, ColorModeScript, theme } from "@chakra-ui/react";
import { Web3Provider } from "./context/useWeb3";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Web3Provider>
        <ColorModeScript />
        <App />
      </Web3Provider>
    </ChakraProvider>
  </React.StrictMode>
);
