import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { StatusBar, Text } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import { Center, HStack, Heading, NativeBaseProvider, Spinner } from 'native-base';
import MapScreen from './screens/MapScreen';
import StartScreen from './screens/StartScreen';
import Home from './screens/Home';
import ChooseLocation from './screens/ChooseLocation';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}} >
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <>
    <Stack.Navigator screenOptions={{headerShown:false}} >
      <Stack.Screen name="start" component={StartScreen} />
      <Stack.Screen name="map" component={MapScreen} />
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="chooseLocation" component={ChooseLocation} />
    </Stack.Navigator>
    </>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect( () => {
    async function fetchLoggedInUser()
    {
      const authUserData = await AsyncStorage.getItem('authUserData');
      if(authUserData)
      {
        authCtx.authenticate(JSON.parse(authUserData));
      }
      setIsTryingLogin(false);
    }
    fetchLoggedInUser()
  }, [])


  if (isTryingLogin) {
    return <NativeBaseProvider>
    <Center flex={1} px="3">
      <HStack space={2} justifyContent="center">
        <Spinner accessibilityLabel="Loading posts" />
        <Heading color="primary.500" fontSize="md">
          Loading
        </Heading>
      </HStack>
    </Center>
  </NativeBaseProvider>;
  }

  return <Navigation />;
}

export default function App() {
  
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
