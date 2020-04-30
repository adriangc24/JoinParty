/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from "react";
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
} from "react-native";

import backgroundImage from "./assets/loginBackground.jpg";
import logo from "./assets/logo.png";

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

export default App;
