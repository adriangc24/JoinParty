/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import LoadingScreen from './screens/LoadingScreen'
import RegisterScreen from './screens/RegisterScreen'
const cors = require('cors');
var serviceAccount = require('./functions/permissionsPrivateKey.json');
import * as firebase from 'firebase'
import { Container, Header, Content, Button, Text } from "native-base";
import {StyleSheet,View,TextInput,ImageBackground,Image,TouchableOpacity,Alert,TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,} from "react-native";
import backgroundImage from "./assets/loginBackground.jpg";
import logo from "./assets/logo.png";

firebase.initializeApp({
  apiKey: "AIzaSyBG4f03sNe_4yvzv9b8mYWe4V2_T12IX70",                             
  applicationId: "1:447130442986:web:d8190ee1660ce41efa0b93",      
  projectId: "joinparty-4e37b",               
  authDomain: "joinparty-4e37b.firebaseapp.com",  
  databaseURL: "https://joinparty-4e37b.firebaseio.com",
  storageBucket: "joinparty-4e37b.appspot.com",
  messagingSenderId: "447130442986",
  appId: "1:447130442986:web:d8190ee1660ce41efa0b93"
});

const AppStack = createStackNavigator ({
  Home: HomeScreen
}, { headerMode: 'none' });
const AuthStack = createStackNavigator ({
  Login: LoginScreen,
  Register: RegisterScreen
}, { headerMode: 'none' });

export default createAppContainer (
  createSwitchNavigator (
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "Loading"
    }
  )
);

const App: () => React$Node = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "android" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View
          style={styles.container}
          id={"mainContainer"}
          onPress={Keyboard.dismiss()}
        >
          <ImageBackground
            source={backgroundImage}
            style={styles.backgroundImage}
            id={"backgroundImage"}
          >
            <View id={"componentsContainer"}>
              <Image source={logo} style={styles.logo} id={"logoIcon"} />
              <View id={"textInputs"} style={styles.textInputs}>
                <TextInput
                  id={"usernameInput"}
                  style={styles.userInput}
                  inlineImageLeft={"usernameicon"}
                  placeholder={"Correo electrónico"}
                />
                <TextInput
                  id={"passwordInput"}
                  style={styles.userInput}
                  inlineImageLeft={"passwordicon"}
                  placeholder={"Contraseña"}
                  secureTextEntry={true}
                />
              </View>
              <View id={"buttons"} style={styles.buttonsContainer}>
                <Button rounded style={styles.buttons}>
                  <Text>Iniciar sesión</Text>
                </Button>
                <Button rounded style={styles.buttons}>
                  <Text>Registrarse</Text>
                </Button>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.forgotContainer}>
            <Text id={"forgotPassText"} style={styles.forgotPassText}>
              Olvidaste tu contraseña?
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  logo: {
    width: 200,
    height: 200,
    position: "relative",
    left: "25%",
    marginTop: "1%",
    bottom: "20%"
  },
  textInputs: {
    marginTop: "20%",
    height: 200,
    justifyContent: "center",
    alignItems: "center"
  },
  userInput: {
    position: "relative",
    width: "80%",
    bottom: "80%",
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
    borderColor: "#120A04",
    borderWidth: 2,
    borderStyle: "solid",
    fontSize: 24,
    height: "30%",
    padding: "2%",
    marginBottom: 20,
    borderRadius: 25
  },
  forgotPassText: {
    //fontFamily: "Sarala",
    fontSize: 15,
    lineHeight: 24,
    textDecorationLine: "underline",
    color: "#1400FF"
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    bottom: "10%",
    justifyContent: "center",
    alignItems: "center"
  },
  buttons: {
    marginTop: 20,
    width: "50%",
    alignItems: "center",
    backgroundColor: 'rgba(71,30,85, 0.8)',
    justifyContent: "center"
  },
  forgotContainer: {
    position: "relative",
    bottom: "10%",
    alignItems: "center",
    marginTop: '-15%'
  }
});