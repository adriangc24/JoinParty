import * as React from "react";
import ProfileContent from "./content/ProfileContent";
import SearchContent from "./content/SearchContent";
import HomeContent from "./content/HomeContent";
import FriendsContent from "./content/FriendsContent";

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
} from "native-base";
console.disableYellowBox = true;

var props = {
  activePage: "HomeScreen",
  email: null,
  displayName: null,
};


export default class HomeScreen extends React.Component {

  crearTriggerLlamada = () => {
    let currentUserId = firebase.auth().currentUser.uid;

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

  componentDidMount = () => {
    this.crearTriggerLlamada();
  }

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
        <View id={"footerContainer"} style={styles.footerContainer}>
          <Footer style={styles.footer}>
            <FooterTab style={styles.footerTab}>
              <Button
                id={"home"}
                onPress={() => {
                  setActivePage("HomeScreen"), this.forceUpdate();
                }}
              >
                <Icon active name="home" style={setIconStyle("HomeScreen")} />
              </Button>
              <Button
                id={"add"}
                onPress={() => {
                  // setActivePage("FriendsContent"), this.forceUpdate();
                  this.props.navigation.navigate("Friends");
                }}
              >
                <Icon name="add-circle" style={setIconStyle("FriendsContent")} />
              </Button>
              <Button
                id={"search"}
                onPress={() => {
                  setActivePage("SearchScreen"), this.forceUpdate();
                }}
              >
                <Icon name="search" style={setIconStyle("SearchScreen")} />
              </Button>
              <Button
                id={"profile"}
                onPress={() => {
                  setActivePage("ProfileScreen"), this.forceUpdate();
                }}
              >
                <Icon name="person" style={setIconStyle("ProfileScreen")} />
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
  footerTab: {
    backgroundColor: "black",
  },
  footer: {
    borderColor: "#da0446",
    borderTopWidth: 1.5,
  },
});
