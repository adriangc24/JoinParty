import React, { Component } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import LoadingScreen from "./screens/LoadingScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import VideoDef from "./screens/VideoDef";

const cors = require("cors");
var serviceAccount = require("./functions/permissionsPrivateKey.json");
import * as firebase from "firebase";
import { Container, Header, Content, Button, Text } from "native-base";
import {
  StyleSheet,
  View,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import backgroundImage from "./assets/loginBackground.jpg";
import logo from "./assets/logo.png";
var env = require("./env.json");

const app = firebase.initializeApp({
  apiKey: env.apiKey,
  applicationId: env.applicationId,
  projectId: env.projectId,
  authDomain: env.authDomain,
  databaseURL: env.databaseURL,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId,
});

export const db = app.database();

const AppStack = createStackNavigator(
  {
    Home: HomeScreen,
    ForgotPass: ForgotPasswordScreen,
    CallScreen: VideoDef,
  },
  { headerMode: "none" }
);
const AuthStack = createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    ForgotPass: ForgotPasswordScreen,
  },
  { headerMode: "float" }
);

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: "Loading",
    }
  )
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  logo: {
    width: 200,
    height: 200,
    position: "relative",
    left: "25%",
    marginTop: "1%",
    bottom: "20%",
  },
  textInputs: {
    marginTop: "20%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 25,
  },
  forgotPassText: {
    //fontFamily: "Sarala",
    fontSize: 15,
    lineHeight: 24,
    textDecorationLine: "underline",
    color: "#1400FF",
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    bottom: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: 20,
    width: "50%",
    alignItems: "center",
    backgroundColor: "rgba(71,30,85, 0.8)",
    justifyContent: "center",
  },
  forgotContainer: {
    position: "relative",
    bottom: "10%",
    alignItems: "center",
    marginTop: "-15%",
  },
});
