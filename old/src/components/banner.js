import { Box, Button, Heading, Spacer, Flex } from "@chakra-ui/react";

export default function Banner(props) {
  function handleLogout() {
    props.toast({
      title: "Successfully logged out.",
      description: "",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    props.logout();
  }
  return (
    <Flex 
      size="2xl"
      backgroundColor="#0CC0DF"
      paddingX="10px"
      paddingY="15px"
      textColor="white"
    >
      <Heading 
        font="sans-serif" 
        // color="#CB6CE6"
        // color="black"  
      >
        The Purple Dog Project
      </Heading>
      <Spacer/>
      {props.loggedIn ? <Button onClick={handleLogout} position="right" color="black"> Logout</Button> : <Box/>}
    </Flex>
  );
}
