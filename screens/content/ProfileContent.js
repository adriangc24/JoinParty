import * as React from "react";
import * as firebase from "firebase";
import { ImagePicker } from "expo";
var defaultProfile = require("../../assets/defaultProfile.png");
import {
  Platform,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Button,
  Text,
  FooterTab,
  Footer,
  Icon,
  Left,
  Body,
  Title,
  Thumbnail,
} from "native-base";

export default class ProfileContent extends React.Component {
  componentDidMount() {
    const { email, displayName } = firebase.auth().currentUser;

    this.setState({ email, displayName });
  }
  userProps = {
    uid: null,
    uri: null,
    name: null,
    lastname: null,
    displayname: null,
    email: null,
    password1: null,
    password2: null,
  };

  signOutUser = () => {
    Alert.alert(
      "Cierre de sesión",
      "¿ Seguro que quieres cerrar la sesión ?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "Si", onPress: () => firebase.auth().signOut() },
      ],
      { cancelable: false }
    );
  };

  render() {
    return (
      <View id={"profileComps"} style={styles.container}>
        <Content>
          <View id={"profileContainer"} style={styles.profileContainer}>
            <View
              id={"profilePhotoContainer"}
              style={styles.profilePhotoContainer}
            >
              <TouchableOpacity
                onPress={() => changeProfilePhoto()}
                style={styles.profileImage}
              >
                <Thumbnail source={defaultProfile} style={styles.photo} />
              </TouchableOpacity>
            </View>
            <View id={"form"} style={styles.form}>
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
              <View id={"buttonConfirm"} styles={styles.buttonConfirmContainer}>
                <Button
                  rounded
                  style={styles.buttonConfirm}
                  onPress={this.confirm}
                >
                  <Text style={{ fontSize: 15 }}>Confirmar</Text>
                </Button>
              </View>
              <View
                id={"buttonSignOutContainer"}
                styles={styles.buttonSignOutContainer}
              >
                <Button
                  rounded
                  style={styles.buttonSignOut}
                  onPress={this.signOutUser}
                >
                  <Text style={{ fontSize: 15 }}>Cerrar sesión</Text>
                </Button>
              </View>
            </View>
          </View>
        </Content>
      </View>
    );
  }
}

function changeProfilePhoto() {
  console.log("photo clicked");
}
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log("user logged");
  } else {
    // No user is signed in.
  }
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textInputs: {
    height: 200,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20%",
  },
  userInput: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    opacity: 0.8,
    borderColor: "#120A04",
    borderWidth: 2,
    borderStyle: "solid",
    fontSize: 24,
    padding: "1.50%",
    height: 40,
    marginBottom: 15,
    borderRadius: 25,
  },
  form: {
    alignItems: "center",
  },
  buttonSignOutContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSignOut: {
    backgroundColor: "#da0446",
    marginTop: "2%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonConfirmContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonConfirm: {
    backgroundColor: "green",
    marginTop: "15%",
    justifyContent: "center",
    alignItems: "center",
  },
  footerTab: {
    backgroundColor: "black",
  },
  profilePhotoContainer: {
    marginTop: "6%",
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  profileImage: {
    borderWidth: 5,
    borderColor: "#da0446",
    padding: "15%",
    padding: "0%",
    borderRadius: 100,
  },
});
