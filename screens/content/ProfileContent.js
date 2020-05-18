import * as React from "react";
import * as firebase from "firebase";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import { GoogleSignin, GoogleSigninButton } from "react-native-google-signin";

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
  Thumbnail,
  Textarea,
  Right,
  Title,
  Subtitle,
  Item,
  Label,
  Input,
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
    description: "Introduce aquí tu descripción",
    photo: defaultProfile,
    uri: null,
    photoUrl: null,
    password: password,
    textName: null,
    textDescription: null,
    textLastName: null,
    textDisplayName: null,
    textPassword: null,
  };

  textFields = {
    name: null,
    lastname: null,
    displayname: null,
    password: null,
    description: null,
  };

  constructor(props) {
    super(props);

    this.uploadImage = this.uploadImage.bind(this);
    this.changeProfilePhoto = this.changeProfilePhoto.bind(this);
    this.confirm = this.confirm.bind(this);
    this.myPhoto = this.myPhoto.bind(this);
    this.getDescription = this.getDescription.bind(this);
    this.signOutGoogle = this.signOutGoogle.bind(this);
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("user logged");
        var usuario = firebase.database().ref("/users/" + user.uid);
        usuario.once("value").then((snapshot) => {
          var usr = snapshot.val();

          console.log("-----O UID " + user.uid);
          console.log("-----O " + user.email);
          console.log("-----O " + usr.name);
          console.log("-----O " + usr.lastname);
          console.log("-----O " + usr.displayname);
          console.log("-----O " + usr.description);
          console.log("-----O PHOTO " + usr.photoUrl);

          this.setState({
            uid: user.uid,
            name: usr.name,
            lastname: usr.lastname,
            photoUrl: usr.photoUrl,
            displayname: usr.displayname,
            description: usr.description,
            email: user.email,
          });
        });
      } else {
        console.log("user not logged");
      }
    });
  }
  // SignOut Button
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
        {
          text: "Si",
          onPress: () => {
            firebase.auth().signOut();
            this.signOutGoogle();
          },
        },
      ],
      { cancelable: false }
    );
  };
  // Confirm Button
  confirm = () => {
    if (this.state.textDescription != null) {
      this.state.description = this.state.textDescription;
    }
    if (this.state.textDisplayName != null) {
      this.state.displayname = this.state.textDisplayName;
    }
    if (this.state.textName != null) {
      this.state.name = this.state.textName;
    }
    if (this.state.textLastName != null) {
      this.state.lastname = this.state.textLastName;
    }
    if (this.state.textPassword != null) {
      this.state.password = this.state.textPassword;
    }

    console.log("CONFIRM");
    if (this.state.description != null || this.state.description != "") {
      firebase
        .database()
        .ref("users/" + this.state.uid)
        .set({
          name: this.state.name,
          lastname: this.state.lastname,
          displayname: this.state.displayname,
          description: this.state.description,
          photoUrl: this.state.photoUrl,
        })
        .catch(function (error) {
          console.log(error);
          Alert.alert("Error: la contraseña no coincide !");
        });
    }
    ////////////// ALL THE FORM /////////////
    else if (
      this.state.name == null ||
      this.state.name == null ||
      this.state.displayname == null ||
      this.state.password == null
    ) {
      Alert.alert("Error: 1 o mas campos vacíos !");
    } else {
      var user = firebase.auth().currentUser;
      console.log(this.state.textPassword);
      var credential = firebase.auth.EmailAuthProvider.credential(
        firebase.auth().currentUser.email,
        this.state.textPassword
      );
      user
        .reauthenticateWithCredential(credential)
        .then(() => {
          console.log("11111111111111111");
          console.log(this.state.textName);
          // User re-authenticated.
          firebase
            .database()
            .ref("users/" + this.state.uid)
            .set({
              name: this.state.name,
              lastname: this.state.lastName,
              displayname: this.state.displayName,
              description: this.state.description,
              photoUrl: this.state.photoUrl,
            });
        })
        .catch(function (error) {
          console.log(error);
          Alert.alert("Error: la contraseña no coincide !");
        });
    }
  };

  signOutGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  uploadImage = () => {
    console.log("-- UPLOAD IMAGE METHOD");
    console.log(this.state.uri);
    const image = this.state.uri;
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    let uploadBlob = null;
    const imageRef = firebase
      .storage()
      .ref("profilePhotos")
      .child(this.state.email + ".jpg");
    let mime = "image/jpg";
    fs.readFile(image, "base64")
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then((blob) => {
        uploadBlob = blob;
        return imageRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then((url) => {
        // URL of the image uploaded on Firebase storage
        this.setState({ photoUrl: url });
        console.log(url);
        firebase
          .database()
          .ref("users/" + this.state.uid)
          .set({
            name: this.state.name,
            lastname: this.state.lastname,
            displayname: this.state.displayname,
            description: this.state.description,
            photoUrl: this.state.photoUrl,
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // On click profile photo
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
        console.log("uri " + response.uri);
        const source = { uri: response.uri };
        console.log("source " + JSON.stringify(source));
        this.setState({
          photo: source,
          uri: response.uri,
        });
        this.uploadImage();
      }
    });
  };

  myPhoto = () => {
    if (this.state.photoUrl != null) {
      return { uri: this.state.photoUrl };
    } else {
      return this.state.photo;
    }
  };

  getDescription = () => {
    if (this.state.description == "") {
      return "Introduce aquí tu descripción";
    } else {
      return this.state.description;
    }
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
                <Thumbnail source={this.myPhoto()} style={styles.photo} />
              </TouchableOpacity>
            </View>
            <Textarea
              rowSpan={5}
              bordered
              placeholder={this.getDescription()}
              style={styles.userDescription}
              onChangeText={(text) => {
                this.setState({ textDescription: text });
              }}
            />
            <View id={"form"} style={styles.form}>
              <View id={"textInputs"} style={styles.textInputs}>
                <Item floatingLabel style={styles.input}>
                  <Label style={styles.labelInput}>Nombre</Label>
                  <Input
                    style={styles.userInput}
                    value={this.state.name}
                    ref={"nameInput"}
                    onChangeText={(text) => {
                      this.setState({ textName: text });
                    }}
                  />
                </Item>
                <Item floatingLabel style={styles.input}>
                  <Label style={styles.labelInput}>Apellidos</Label>
                  <Input
                    style={styles.userInput}
                    value={this.state.lastname}
                    ref={"lastnameInput"}
                    onChangeText={(text) => {
                      this.setState({ textLastName: text });
                    }}
                  />
                </Item>
                <Item floatingLabel style={styles.input}>
                  <Label style={styles.labelInput}>Nombre de usuario</Label>
                  <Input
                    style={styles.userInput}
                    value={this.state.displayname}
                    ref={"usernameInput"}
                    onChangeText={(text) => {
                      this.setState({ textDisplayName: text });
                    }}
                  />
                </Item>
                <Item floatingLabel style={styles.input}>
                  <Label style={styles.labelInput}>Contraseña</Label>
                  <Input
                    style={styles.userInput}
                    value={"Contraseña"}
                    secureTextEntry={true}
                    ref={"passwordInput"}
                    onChangeText={(text) => {
                      this.setState({ textPassword: text });
                    }}
                  />
                </Item>
              </View>
              <View id={"buttonsContainer"} styles={styles.buttonsContainer}>
                <View
                  id={"buttonConfirm"}
                  styles={styles.buttonConfirmContainer}
                >
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
  userDescription: {
    marginTop: "3%",
    marginBottom: "2%",
    width: "80%",
    marginLeft: "5%",
    marginRight: "5%",
    color: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textInputs: {
    height: "43%",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2%",
  },
  userInput: {
    color: "white",
    fontSize: 17,
  },
  input: {
    marginBottom: "1%",
  },
  form: {
    alignItems: "center",
  },
  buttonsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSignOut: {
    backgroundColor: "#da0446",
    justifyContent: "center",
    marginBottom: "5%",
  },
  buttonConfirm: {
    backgroundColor: "green",
    justifyContent: "center",
    marginTop: "18%",
    marginBottom: "-9%",
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
    marginTop: "2%",
    borderWidth: 5,
    borderColor: "#da0446",
    padding: "15%",
    padding: "0%",
    borderRadius: 100,
  },
});
