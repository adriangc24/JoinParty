import React, {Component} from 'react';
import {StyleSheet,View,TextInput,ImageBackground,ActivityIndicator,Image,TouchableOpacity,Alert,TouchableWithoutFeedback,Keyboard,KeyboardAvoidingView,} from "react-native";
import { Container, Header, Content, Button, Text } from "native-base";
import * as firebase from 'firebase';

export default class LoadingScreen extends React.Component {
    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? "App" : "Auth");
        });
    }
    
    render() {
        return (
            <View style={styles.container}>
            <Text>Cargando...</Text>
            <ActivityIndicator size="large"></ActivityIndicator>
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