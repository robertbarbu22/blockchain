import React, { useState, useEffect } from "react";
import {
  Flex,
  HStack,
  Button,
  Heading,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Link,
  Grid,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const Links = [
  { text: "Home", path: "/" },
  { text: "Auctions", path: "/auctions" },
];

const NavLink = ({ children, path }) => {
  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
      }}
      href={path}
    >
      {children}
    </Link>
  );
};

export default function Header() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  return (
    <Grid
      gridTemplateColumns={"repeat(12, 1fr);"}
      px={{ md: 8, base: 2 }}
      py={4}
      bg={"orange"}
    >
      <GridItem colSpan={8}>
        <HStack spacing={8} alignItems={"center"} justifyContent={"start"}>
          <Heading size={""} _hover={{ textDecoration: "none" }}>
            Actns
          </Heading>
          <HStack
            as={"nav"}
            spacing={4}
            display={{ base: "none", md: "flex" }}
            justifyItems="center"
          >
            {Links.map((link) => (
              <NavLink key={link.text} path={link.path}>
                {link.text}
              </NavLink>
            ))}
          </HStack>
        </HStack>
      </GridItem>

      <GridItem colSpan={4}>
        <Flex alignItems={"center"} justifyContent={"end"} flexBasis="30%">
          <NavLink path={"/myAuctions"}>My auctions</NavLink>
        </Flex>
      </GridItem>
    </Grid>
  );
}
