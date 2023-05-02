import React, { useContext, useState } from 'react'
import { Pressable, Text } from 'react-native'
import { AuthContext } from '../store/auth-context';
import { Box, Button, Center, Flex, NativeBaseProvider, Spacer, VStack } from 'native-base'
function StartScreen({ navigation }) {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const authCtx = useContext(AuthContext);
    
    function Logout()
    {
        console.log("logging out");
        setIsAuthenticating(true);
        authCtx.logout();
    }
  return (
    <NativeBaseProvider>
        <VStack space={4} alignItems="center" h="300px" mt="300" >
             <Button m="1.5" size={'lg'} w="200" onPress={() => navigation.navigate('map')}>Check Route</Button>
             <Button m="1.5" size={'lg'} w="200" onPress={() => navigation.navigate('home')}>Navigate Now</Button>
             <Button m="1.5" bgColor={"red.700"} w="200" size={'lg'} onPress={() => {Logout()}}>Logout</Button>
        </VStack>
    </NativeBaseProvider>
   
  )
}

export default StartScreen