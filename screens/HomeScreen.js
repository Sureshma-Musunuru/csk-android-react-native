import { Box, Center, Flex, NativeBaseProvider, Spacer } from 'native-base'
import React from 'react'

function HomeScreen() {
  return (
    <NativeBaseProvider>
        <Flex  direction="row" wrap="wrap" w="100%" h="100">
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}> 1 </Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}>2</Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}> 1 </Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}>2</Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}> 1 </Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}>2</Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}> 1 </Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}>2</Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} h={100} alignItems={"center"} justifyContent={"center"}> 1 </Box>
      <Spacer/>
      <Box w={"45%"} bg={"grey"} margin={2} marginRight={3.5} h={100} alignItems={"center"} justifyContent={"center"}>2</Box>
    </Flex>
    </NativeBaseProvider>
  )
}

export default HomeScreen