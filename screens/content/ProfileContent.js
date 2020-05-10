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
var uid,
  uri,
  lastname = "Apellidos",
  name = "Nombre",
  email = "Correo electronico",
  password = "Contraseña",
  password2 = "Repita la contraseña",
  photo = null,
  displayname = "Nombre de usuario";
var src;
// Import Admin SDK
/*var admin = require("firebase-admin");
// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("/users");*/

export default class ProfileContent extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      lastname: "",
      displayname: "",
      email: "",
      photo: defaultProfile,
    };
  }
  state = {
    name: "Nombre",
    lastname: "Apellidos",
    displayname: "Nombre de usuario",
    email: "Correo electrónico",
    photo: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("user logged");
        var usuario = firebase.database().ref("/users/" + user.uid);
        usuario.once("value").then((snapshot) => {
          var usr = snapshot.val();
          console.log("-----O " + usr.email);
          console.log("-----O " + usr.name);
          console.log("-----O " + usr.lastname);
          console.log("-----O " + usr.displayname);

          this.setState({
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
                <Thumbnail source={this.state.photo} style={styles.photo} />
              </TouchableOpacity>
            </View>
            <View id={"form"} style={styles.form}>
              <View id={"textInputs"} style={styles.textInputs}>
                <TextInput
                  autoCapitalize="sentences"
                  style={styles.userInput}
                  //inlineImageLeft={"passwordicon"}
                  placeholder={this.state.name}
                  ref={"nameInput"}
                  //onChangeText={(password) => this.setState({ password })}
                  //value={this.state.password}
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
                  //inlineImageLeft={"passwordicon"}
                  placeholder={this.state.displayname}
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
                  placeholder={this.state.email}
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
      src = source;
      //setPhoto(source);
      /*this.setState.bind(this)(() => ({
        photo: source,
      }));*/
    }
  });
  /*this.setState({
    photo: src,
  });*/
};

/*setPhoto = (source) => {
  this.setState({
    photo: source,
  });
};*/

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
