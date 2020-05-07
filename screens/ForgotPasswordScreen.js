import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import * as firebase from "firebase";
import { Container, Header, Content, Button, Text } from "native-base";

export default class ForgotPasswordScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
    };
  }
  render() {
    return (
      <View id={"homeComps"} style={styles.container}>
        <Text>Forgot passs</Text>
        <View style={{ marginTop: "50%" }}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
