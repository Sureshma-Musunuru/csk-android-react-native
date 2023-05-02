import { useContext, useState } from 'react';
import { StyleSheet, View, Image, Text,Pressable, TextInput, Linking, Alert  } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../store/auth-context';
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/logo.png'
import { Box, Center, HStack, Heading, Modal, NativeBaseProvider, Spinner } from 'native-base';
import Styles from '../Style';
import { NativeBaseConfigProvider } from 'native-base/lib/typescript/core/NativeBaseContext';
function LoginScreen() {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedError, setCheckedError] = useState(true);
  function updateChecked()
  {
    setChecked(!checked);
    setCheckedError(!checkedError);
  }
  
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  var authUserData = {};
  function submitHandler() {
    //isAuthenticating(true);
    
    var emailError = false;
    var passwordError = false
    if(enteredEmail.length < 5)
    {
      emailError = true;
    }
    else
    {
      emailError = false;
    }
     if(enteredPassword.length < 4)
         {
           passwordError = true;
         }
     else
         {
           passwordError = false;
         }
       if(emailError || passwordError)
       {
         Alert.alert(
         'Please check your credentials and try again later!'
         );
       }
       else
       {
        setIsAuthenticating(true);
         axios.post("https://api.maristproject.online/api/login", {
             email: enteredEmail,
             password: enteredPassword,
           }).then((res) => {authUserData = res.data;console.log(authUserData);if(authUserData.status == "success")
           {
            authCtx.authenticate(authUserData);
           }
           else
           {
            Alert.alert(
              'Invalid credentials, Please try again!,If you dont have account, Please contact us on Whatsapp'
              );
              setIsAuthenticating(false);
           }}).catch(function (error) {
              console.log(error);
            });
         
          
          
           
           
       }
   }

  

  // if (isAuthenticating) {
  //   return <LoadingOverlay message="Logging you in..." />;
  // }

  return (
    <>
    <NativeBaseProvider>
    <Modal isOpen={isAuthenticating}>
        <Modal.Content>
         
          
          <Modal.Body>
          <Center flex={1} px="3">
        <HStack space={2} justifyContent="center">
          <Spinner accessibilityLabel="Loading posts" />
          <Heading color="primary.500" fontSize="md">
            Logging In
          </Heading>
        </HStack>
      </Center>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>

    

    <View style={Styles.container_login}>
      <Image source={logo} style={Styles.imageContainer} resizeMode='contain'/>
      <View>
        <View style={Styles.inputContainer}>
            <Text style={Styles.labelText}>Email</Text>
            <TextInput style={Styles.inputField} Value={enteredEmail} onChangeText={(val) => {setEnteredEmail(val)}}/>
        </View>
        <View style={Styles.inputContainer}>
            <Text style={Styles.labelText}>Password</Text>
            <TextInput style={Styles.inputField} secureTextEntry={true} Value={enteredPassword} onChangeText={(val) => {setEnteredPassword(val)}}/>
        </View>

        <Pressable onPress={submitHandler} style={Styles.pressable}>
          <Text style={Styles.primaryButton}>Login</Text>
        </Pressable>

        <Pressable onPress={()=>{navigation.navigate('register')}} style={Styles.pressable}>
          <Text style={Styles.primaryButton}>Register</Text>
        </Pressable>


        
      </View>
    </View>
                      
    </>
  );
}

export default LoginScreen;

