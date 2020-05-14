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
  Item,
  Label,
  Input,
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

    //var email = this.refs.emailInput._lastNativeText;
    //var password = this.refs.passwordInput._lastNativeText;
    var email = this.state.email;
    var password = this.state.password;

    console.log(this.state.email + " - " + this.state.password);
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
            <View id={"componentsContainer"} style={styles.componentsContainer}>
              <Image source={logo} style={styles.logo} id={"logoIcon"} />
              <View id={"textInputs"} style={styles.textInputs}>
                <Item floatingLabel style={styles.emailInput}>
                  <Label style={styles.labelInput}>Correo electrónico</Label>
                  <Input
                    style={styles.userInput}
                    ref={"emailInput"}
                    onChangeText={(text) => {
                      this.state.email = text;
                    }}
                  />
                </Item>
                <Item floatingLabel>
                  <Label style={styles.labelInput}>Contraseña</Label>
                  <Input
                    style={styles.userInput}
                    secureTextEntry={true}
                    ref={"passwordInput"}
                    onChangeText={(text) => {
                      this.state.password = text;
                    }}
                  />
                </Item>
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
  componentsContainer: {},
  emailInput: {
    marginTop: "5%",
    paddingBottom: "2%",
    marginBottom: "20%",
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    opacity: 0.9,
  },
  logo: {
    width: "45%",
    height: "35%",
    marginBottom: "0%",
    marginTop: "-20%",
    marginLeft: "25%",
  },
  labelInput: {
    color: "white",
    fontWeight: "bold",
  },
  textInputs: {
    height: 200,
    width: "75%",
    marginTop: "1%",
    marginLeft: "12%",
    marginBottom: "12%",
    fontWeight: "bold",
  },
  userInput: {
    fontWeight: "bold",
  },
  forgotPassText: {
    fontSize: 15,
    lineHeight: 24,
    textDecorationLine: "underline",
    color: "#0f00ca",
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "0%",
  },
  buttons: {
    marginTop: "2%",
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
