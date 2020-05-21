import * as React from "react";
import ProfileContent from "./content/ProfileContent";
import SearchContent from "./content/SearchContent";
import HomeContent from "./content/HomeContent";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
var defaultProfile = require("../assets/defaultProfile.png");

import {
  Platform,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert
} from "react-native";
import * as firebase from "firebase";
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
  Fab,
} from "native-base";
console.disableYellowBox = true;

var props = {
  activePage: "HomeScreen",
  email: null,
  displayName: null,
};


export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.setIconStyle = this.setIconStyle.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.setActivePage = this.setActivePage.bind(this);
    this.addPost = this.addPost.bind(this);
    this.addPostPhoto = this.addPostPhoto.bind(this);
    this.crearTriggerLlamada = this.crearTriggerLlamada.bind(this);
  }

  state = {
    uid: null,
    name: "Nombre",
    lastname: "Apellidos",
    displayname: "Nombre de usuario",
    email: "Correo electrónico",
    photoPost: defaultProfile,
    uri: undefined,
    photoUrl: null,
  };

  crearTriggerLlamada = () => {
    let currentUserId = firebase.auth().currentUser.uid;
    console.log("iniciando triggerr llamadas...")

    firebase.database().ref("calls/" + currentUserId).on("child_added", async snapshot => {
      console.log("a: " + currentUserId + " le estan llamando: " + snapshot.val())
      let aux = snapshot.val().ofertaa;
      if (aux && aux.llamadaIndividual) {

        Alert.alert(
        'Epa!',
        'Te está llamando ' + aux.infoUser + ", quieres contestar?",
        [
          {text: 'Si!', onPress: () => this.props.navigation.navigate("CallScreen", {data: {eresQuienLlama: false, llamadorId: aux.infoUser, llamadoId: currentUserId}})}
        ],
        { cancelable: true }
      );
      }
    });

  }

  componentDidMount() {
    this.crearTriggerLlamada();
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
            email: user.email,
          });
        });
      } else {
        console.log("user not logged");
      }
    });
  }

  addPost = () => {
    console.log("adding post");
    this.addPostPhoto();
  };

  setIconStyle = (page) => {
    if (page == props.activePage) {
      return {
        color: "#ffffff",
      };
    } else {
      return {
        color: "#da0446",
      };
    }
  };

  setActivePage = (page) => {
    props.activePage = page;
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
      .ref("posts")
      .child(this.state.displayname + "." + Math.random() + ".jpg");
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
        this.setState({ photoPost: url });
        console.log("--- URL PHOTICO" + url);
        firebase
          .database()
          .ref("posts/" + this.state.uid)
          .push({
            likes: 0,
            uid: this.state.uid,
            photoPost: this.state.photoPost,
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  addPostPhoto = () => {
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

  render() {
    return (
      <View id={"homeComps"} style={styles.container}>
        <Content>
          <View id={"pageToLoad"}>
            {/* Este condicional determina que pagina sera la que se cargue */}
            {props.activePage == "HomeScreen" && <HomeContent />}
            {props.activePage == "FriendsContent" && <FriendsContent />}
            {props.activePage == "SearchScreen" && <SearchContent />}
            {props.activePage == "ProfileScreen" && <ProfileContent />}
          </View>
        </Content>
        <Fab
          style={styles.fabButton}
          position="bottomRight"
          onPress={this.addPost}
        >
          <Icon name="add" />
        </Fab>
        <View id={"footerContainer"} style={styles.footerContainer}>
          <Footer style={styles.footer}>
            <FooterTab style={styles.footerTab}>
              <Button
                id={"home"}
                onPress={() => {
                  this.setActivePage("HomeScreen"), this.forceUpdate();
                }}
              >
                <Icon
                  active
                  name="home"
                  style={this.setIconStyle("HomeScreen")}
                />
              </Button>
              <Button
                id={"add"}
                onPress={() => {
                  // setActivePage("FriendsContent"), this.forceUpdate();
                  this.props.navigation.navigate("Friends");
                }}
              >
                <Icon
                  name="add-circle"
                  style={this.setIconStyle("VideoTest")}
                />
              </Button>
              <Button
                id={"search"}
                onPress={() => {
                  this.setActivePage("SearchScreen"), this.forceUpdate();
                }}
              >
                <Icon name="search" style={this.setIconStyle("SearchScreen")} />
              </Button>
              <Button
                id={"profile"}
                onPress={() => {
                  this.setActivePage("ProfileScreen"), this.forceUpdate();
                }}
              >
                <Icon
                  name="person"
                  style={this.setIconStyle("ProfileScreen")}
                />
              </Button>
            </FooterTab>
          </Footer>
        </View>
      </View>
    );
  }
}

function setIconStyle(page) {
  if (page == props.activePage) {
    return {
      color: "#ffffff",
    };
  } else {
    return {
      color: "#da0446",
    };
  }
}
function setActivePage(page) {
  props.activePage = page;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  fabButton: {
    bottom: "80%",
    right: "5%",
    backgroundColor: "#da0446",
  },
  footerTab: {
    backgroundColor: "black",
  },
  footer: {
    borderColor: "#da0446",
    borderTopWidth: 1.5,
  },
});
