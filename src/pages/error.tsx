import { Center, Container, Heading, VStack } from "@chakra-ui/react";

import { default as ErrorIcon } from "../icons/Error";
import React from "react";

function Error() {
  return (
    <Container
      p={4}
      maxW={"container.sm"}
      height={"100vh"}
      alignItems={"center"}
      justifyContent={"center"}
      display="flex"
    >
      <VStack>
        <ErrorIcon height={90} />
        <Heading
          as="h2"
          fontSize={28}
          color="brand.error"
          p={30}
          fontWeight="semibold"
          textAlign="center"
        >
          The link is broken. Please verify the headers.
        </Heading>
      </VStack>
    </Container>
  );
}

export default Error;
