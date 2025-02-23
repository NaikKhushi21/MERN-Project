// import React from 'react'
import {Button, Container, Flex, HStack, Text, useColorMode} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {PlusSquareIcon} from "@chakra-ui/icons";
import {IoMoon} from "react-icons/io5";
import {LuSun} from "react-icons/lu";
import { useProductStore } from "../store/product";

const Navbar = () => {
  const {colorMode, toggleColorMode} = useColorMode();

  return (
  <Container maxW={"1140px"} px={4}>
    <Flex 
      h={16} 
      justifyContent={"space-between"}
      alignItems={"center"}
      flexDir={{
        base: "column",
        sm: "row"
      }}
    >
      <Text
        fontSize={{base: "22", sm:"28"}}
        fontWeight={"extrabold"}
        textTransform={"uppercase"}
        textAlign={"center"}
        bgGradient={"linear(to-r, purple.600, purple.600)"}
        bgClip={"text"}
      >
        <Link to={"/"}>Product Store</Link>
      </Text>
      <HStack spacing={2} alignItems={"center"}>
        <Link to={"/create"}>
          <Button>
            <PlusSquareIcon fontSize={20}/>
          </Button>
        </Link>
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <IoMoon/> : <LuSun size="20"/>}
        </Button>      
      </HStack>
    </Flex>
  </Container>
  );
}; 

export default Navbar;
