import React, { Component } from "react";
import { View, StyleSheet, Alert } from "react-native";
import * as firebase from "firebase";
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  Item,
  Label,
  Input,
} from "native-base";

export default class ForgotPasswordScreen extends React.Component {
  constructor() {
    super();
    this.submitEmail = this.submitEmail.bind(this);
  }
  state = {
    email: null,
  };

  submitEmail = () => {
    if (this.state.email != null) {
      firebase
        .auth()
        .sendPasswordResetEmail(this.state.email)
        .then(() => {
          Alert.alert("Revisa tu correo para cambiar la contraseña");
        })
        .catch((error) => {
          Alert.alert("Error: la dirección de correo no es válida");
        });
    } else {
      Alert.alert("Error: el campo está vacío !");
    }
  };

  render() {
    return (
      <View id={"homeComps"} style={styles.container}>
        <Text>Si has olvidado tu contraseña introduce tu correo:</Text>
        <Item floatingLabel style={styles.input}>
          <Label style={styles.labelInput}>Correo electrónico</Label>
          <Input
            style={styles.userInput}
            value={this.state.name}
            ref={"nameInput"}
            onChangeText={(text) => {
              this.setState({ email: text });
            }}
          />
        </Item>
        <View
          id={"buttonSignOutContainer"}
          styles={styles.buttonSubmitContainer}
        >
          <Button
            rounded
            style={styles.buttonSubmit}
            onPress={this.submitEmail}
          >
            <Text style={{ fontSize: 15 }}>Cambiar contraseña</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    marginTop: "20%",
  },
  container: {
    flex: 1,
    marginTop: "25%",
    marginLeft: "5%",
    marginRight: "5%",
    alignItems: "center",
  },
  buttonSubmit: {
    marginTop: "30%",
    width: "70%",
    backgroundColor: "#da0446",
    marginBottom: "5%",
  },
});
