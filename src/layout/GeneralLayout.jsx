import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import { Flex } from "@chakra-ui/react";

const GeneralLayout = () => {
  return (
    <div className="flex">
      <Header />
      <Flex px={"20%"} py={20}>
        <Outlet />
      </Flex>
      
    </div>
  );
};

export default GeneralLayout;
