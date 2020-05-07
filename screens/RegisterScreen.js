import React, { Component } from "react";
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
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import * as firebase from "firebase";
import backgroundImage from "./../assets/dj.jpg";
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
  Icon,
} from "native-base";

export default class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      displayName: "",
      email: "",
      password: "",
      isLoading: false,
      errorMessage: null,
    };
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  registerUser = () => {
    var email = this.refs.emailInput._lastNativeText;
    var password = this.refs.passwordInput._lastNativeText;
    var password2 = this.refs.passwordInput2._lastNativeText;
    var displayName = this.refs.usernameInput._lastNativeText;
    var name = this.refs.nameInput._lastNativeText;
    var lastname = this.refs.lastnamesInput._lastNativeText;

    this.state.email = email;
    this.state.password = password;
    this.state.password2 = password2;
    this.state.name = name;
    this.state.lastname = lastname;
    this.state.displayName = displayName;

    if (
      this.state.email == "" ||
      this.state.password == "" ||
      this.state.password2 == "" ||
      this.state.displayName == "" ||
      this.state.name == "" ||
      this.state.lastname == "" ||
      this.state.email == undefined ||
      this.state.password == undefined ||
      this.state.password2 == undefined ||
      this.state.name == undefined ||
      this.state.lastname == undefined ||
      this.state.email == undefined
    ) {
      Alert.alert("Error: 1 o más campos vacíos !");
    } else if (!(password == password2)) {
      Alert.alert("Error: las contraseñas no coinciden !");
    } else {
      email = this.refs.emailInput._lastNativeText;
      password = this.refs.passwordInput._lastNativeText;
      password2 = this.refs.passwordInput2._lastNativeText;
      displayName = this.refs.usernameInput._lastNativeText;
      name = this.refs.nameInput._lastNativeText;
      lastname = this.refs.lastnamesInput._lastNativeText;

      this.setState({
        isLoading: true,
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((res) => {
          firebase
            .auth()
            .currentUser.sendEmailVerification(actionCodeSettings)
            .then(function () {
              console.log("-- Email sent succesful");
            })
            .catch(function (error) {
              console.log("-- Email sent error");
            });

          res.user.updateProfile({
            displayName: this.state.displayName,
          });
          console.log("User registered successfully!");
          this.setState({
            isLoading: false,
            displayName: "",
            email: "",
            password: "",
          });

          this.props.navigation.navigate("Home");
        })
        .catch((error) => this.setState({ errorMessage: error.message }));
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
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
              <View id={"textInputs"} style={styles.textInputs}>
                <TextInput
                  autoCapitalize="sentences"
                  style={styles.userInput}
                  //inlineImageLeft={"passwordicon"}
                  placeholder={"Nombre"}
                  ref={"nameInput"}
                  //onChangeText={(password) => this.setState({ password })}
                  //value={this.state.password}
                />
                <TextInput
                  autoCapitalize="sentences"
                  style={styles.userInput}
                  //inlineImageLeft={"passwordicon"}
                  placeholder={"Apellidos"}
                  ref={"lastnamesInput"}
                  //onChangeText={(password) => this.setState({ password })}
                  //value={this.state.password}
                />
                <TextInput
                  autoCapitalize="none"
                  style={styles.userInput}
                  //inlineImageLeft={"passwordicon"}
                  placeholder={"Nombre de usuario"}
                  ref={"usernameInput"}
                  //value={this.state.displayName}
                  /*onChangeText={(val) =>
                    this.updateInputVal(val, "displayName")
                  }*/
                />
                <TextInput
                  autoCapitalize="none"
                  style={styles.userInput}
                  //inlineImageLeft={"passwordicon"}
                  placeholder={"Correo electrónico"}
                  ref={"emailInput"}
                  /*value={this.state.email}
                  onChangeText={(val) => this.updateInputVal(val, "email")}*/
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
                <TextInput
                  autoCapitalize="none"
                  style={styles.userInput}
                  //inlineImageLeft={"passwordicon"}
                  placeholder={"Repita la contraseña"}
                  secureTextEntry={true}
                  ref={"passwordInput2"}
                  //onChangeText={(password) => this.setState({ password })}
                  //value={this.state.password}
                />
              </View>
              <View id={"buttons"} style={styles.buttonsContainer}>
                <Button
                  rounded
                  style={styles.buttons}
                  onPress={() => this.registerUser()}
                >
                  <Text>Confirmar</Text>
                </Button>
              </View>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  header: {
    top: 0,
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
    marginTop: "50%",
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
    bottom: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    marginTop: "2%",
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
