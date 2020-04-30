/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';

import backgroundImage from './assets/loginBackground.jpg';
import logo from './assets/logo.png';

const App: () => React$Node = () => {
  return (
      <View style={styles.container} id={"mainContainer"}>
        <ImageBackground source={backgroundImage} style={styles.image} id={"backgroundImage"}>
          <Image source={logo} style={styles.logo} id={"logoIcon"}/>
          <View id={"textInputs"}>
            <TextInput
                id={"usernameInput"}
                style={styles.userInput}
                inlineImageLeft={'usernameicon'}
                placeholder={"correo electrónico"}
            />
            <TextInput
                id={"passwordInput"}
                style={styles.userInput}
                inlineImageLeft={'passwordicon'}
                placeholder={"contraseña"}
                secureTextEntry={true}
            />
            <Text id={"forgotPassText"} style={styles.forgotPassText}>Olvidaste tu contraseña?</Text>
          </View>
          <View id={"buttons"} style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={Alert.alert("molt be pavo")}>
              <Text>Iniciar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={Alert.alert("molt be pavo")}>
              <Text>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  logo: {
    width: 200,
    height: 200,
    position: "relative",
    left: "25%",
    bottom: "20%"
  },
  userInput: {
    position: "relative",
    width: 322,
    left: "10%",
    bottom: "80%",
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
    borderColor: "#120A04",
    borderWidth: 2,
    borderStyle: "solid",
    fontSize: 24,
    marginBottom: 20,
    borderRadius: 15
  },
  forgotPassText: {
    position: "relative",
    bottom: "90%",
    left: "30%",
    //fontFamily: "Sarala",
    fontSize: 15,
    lineHeight:24,
    textDecorationLine: "underline",
    color: "#1400FF"
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    left: "40%",
    bottom: "10%",
  },
  buttons: {
    width: 30,
    height: 61,
    backgroundColor: "#3A2950",
    borderRadius: 16,
    padding: 10,
    alignItems: "center"
  }
});

export default App;
