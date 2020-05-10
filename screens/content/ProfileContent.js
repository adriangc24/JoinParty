import * as React from "react";
import * as firebase from "firebase";
import ImagePicker from "react-native-image-picker";
var env = require("./../../env.json");
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
var passwordEquals = false;
var uid,
  uri,
  lastname = "Apellidos",
  name = "Nombre",
  email = "Correo electronico",
  password = "Contraseña",
  password2 = "Repita la contraseña",
  photo = null,
  displayname = "Nombre de usuario";

export default class ProfileContent extends React.Component {
  state = {
    uid: null,
    name: "Nombre",
    lastname: "Apellidos",
    displayname: "Nombre de usuario",
    email: "Correo electrónico",
    photo: defaultProfile,
    password: password,
  };

  textFields = {
    name: null,
    lastname: null,
    displayname: null,
    password: null,
  };

  constructor(props) {
    super(props);

    this.changeProfilePhoto = this.changeProfilePhoto.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("user logged");
        var usuario = firebase.database().ref("/users/" + user.uid);
        usuario.once("value").then((snapshot) => {
          var usr = snapshot.val();
          console.log("-----O " + user.uid);
          console.log("-----O " + usr.email);
          console.log("-----O " + usr.name);
          console.log("-----O " + usr.lastname);
          console.log("-----O " + usr.displayname);

          this.setState({
            uid: user.uid,
            name: usr.name,
            lastname: usr.lastname,
            displayname: usr.displayname,
            email: usr.email,
          });
        });
      } else {
        console.log("user not logged");
      }
    });
  }

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
  // Confirm Button
  confirm = () => {
    console.log("CONFIRM");

    var user = firebase.auth().currentUser;
    console.log(this.state.password);
    var credential = firebase.auth.EmailAuthProvider.credential(
      firebase.auth().currentUser.email,
      this.state.password
    );
    user
      .reauthenticateWithCredential(credential)
      .then(function () {
        // User re-authenticated.
        firebase
          .database()
          .ref("users/" + this.state.uid)
          .set({
            name: this.state.name,
            lastname: this.state.lastname,
            displayname: this.state.displayname,
            photo: this.state.photo,
          });
      })
      .catch(function (error) {
        console.log(error);
        Alert.alert("Error: la contraseña no coincide !");
      });
  };

  changeProfilePhoto = () => {
    console.log("photo clicked");
    var src;
    const options = {
      title: "Selecciona la foto de perfil",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      //console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = { uri: response.uri };
        this.setState({
          photo: source,
        });
      }
    });
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
                onPress={() => this.changeProfilePhoto()}
                style={styles.profileImage}
              >
                <Thumbnail source={this.state.photo} style={styles.photo} />
              </TouchableOpacity>
            </View>
            <View id={"form"} style={styles.form}>
              <View id={"textInputs"} style={styles.textInputs}>
                <TextInput
                  autoCapitalize="sentences"
                  style={styles.userInput}
                  placeholder={this.state.name}
                  ref={"nameInput"}
                />
                <TextInput
                  autoCapitalize="sentences"
                  style={styles.userInput}
                  placeholder={this.state.lastname}
                  ref={"lastnamesInput"}
                />
                <TextInput
                  autoCapitalize="none"
                  style={styles.userInput}
                  placeholder={this.state.displayname}
                  ref={"usernameInput"}
                />
                <TextInput
                  autoCapitalize="none"
                  style={styles.userInput}
                  placeholder={this.state.password}
                  secureTextEntry={true}
                  ref={"passwordInput"}
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
