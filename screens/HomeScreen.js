import React, {Component} from 'react';
import {View, StyleSheet} from "react-native";
import * as firebase from 'firebase';
import { Container, Header, Content, Button, Text } from "native-base";

export default class HomeScreen extends React.Component {
    state = {
        email: "",
        displayName: ""
    }

    componentDidMount(){
        const {email, displayName} = firebase.auth().currentUser;

        this.setState({email, displayName});
    };

    signOutUser = () => {
        firebase.auth().signOut();
    }

    render() {
        return (
            <View id={"homeComps"} style={styles.container}>
                <Text>Hola {this.state.email}</Text>
                <View style={{marginTop: "50%"}}>
                <Button rounded 
                  style={styles.buttons} 
                  onPress={this.signOutUser}
                  >
                    <Text>Cerrar sesión</Text>
                  </Button>
                  </View>
            </View>
        );
    }
}

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})