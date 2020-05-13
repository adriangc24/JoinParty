import React, { Component, useState } from "react";
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
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  Left,
  Body,
  Right,
  Title,
  Subtitle,
} from "native-base";
import backgroundImage from "./.././assets/loginBackground.jpg";
import logo from "./.././assets/logo.png";
import * as firebase from "firebase";

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    email: "",
    password: "",
    errorMessage: null,
  };

  handleLogin = () => {
    console.log("handling login");

    var email = this.refs.emailInput._lastNativeText;
    var password = this.refs.passwordInput._lastNativeText;

    console.log("--- " + email + " " + password);

    if (email == "" || password == "" || password == undefined || email == "") {
      Alert.alert("Error: 1 o más campos vacíos !");
    } else if (!(email.includes("@") && email.includes("."))) {
      Alert.alert("Error: correo inválido !");
    } else {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .catch((error) =>
          /*this.setState({ errorMessage: error.message })*/ Alert.alert(
            "Error: credenciales incorrectas !"
          )
        );
    }
  };

  render() {
    return (
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
                  style={styles.userInput}
                  autoCapitalize="none"
                  //inlineImageLeft={"usernameicon"}
                  placeholder={"Correo electrónico"}
                  ref={"emailInput"}
                  //onChangeText={(email) => this.setState({ email })}
                  //value={this.state.email}
                />
                <TextInput
                  autoCapitalize="none"
                  style={styles.userInput}
                  //inlineImageLeft={"passwordicon"}
                  placeholder={"Contraseña"}
                  secureTextEntry={true}
                  ref={"passwordInput"}
                  //onChangeText={(password) => this.setState({ password })}
                  //value={this.state.password}
                />
              </View>
              <View id={"buttons"} style={styles.buttonsContainer}>
                <Button
                  rounded
                  style={styles.buttons}
                  onPress={this.handleLogin}
                >
                  <Text>Iniciar sesión</Text>
                </Button>
                <Button
                  rounded
                  style={styles.buttons}
                  onPress={() => this.props.navigation.navigate("Register")}
                >
                  <Text>Registrarse</Text>
                </Button>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.forgotContainer}>
            <Button transparent>
              <Text
                success
                style={{ fontWeight: "bold" }}
                onPress={() => this.props.navigation.navigate("ForgotPass")}
              >
                Olvidaste tu contraseña ?
              </Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  errorMessage: {
    bottom: "33%",
    backgroundColor: "rgba(207, 200, 206, 0.8)",
    borderRadius: 10,
    width: "50%",
    left: "25%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
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
    width: "45%",
    height: "25%",
    left: "27%",
    marginTop: "40%",
    bottom: "20%",
  },
  textInputs: {
    marginTop: "20%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  userInput: {
    width: "80%",
    bottom: "80%",
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
    borderColor: "#120A04",
    borderWidth: 2,
    borderStyle: "solid",
    fontSize: 24,
    height: "30%",
    paddingLeft: "5%",
    padding: "1.35%",
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
    bottom: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: "2.5%",
    width: "50%",
    alignItems: "center",
    backgroundColor: "rgba(71,30,85, 0.8)",
    justifyContent: "center",
  },
  forgotContainer: {
    bottom: "10%",
    alignItems: "center",
    marginTop: "-15%",
    bottom: "4%",
  },
});
