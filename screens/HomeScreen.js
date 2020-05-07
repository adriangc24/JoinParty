import * as React from "react";
import ProfileContent from "./content/ProfileContent";
import SearchContent from "./content/SearchContent";
import HomeContent from "./content/HomeContent";

import {
  Platform,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
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
};

export default class HomeScreen extends React.Component {
  render() {
    return (
      <View id={"homeComps"} style={styles.container}>
        <Content>
          <View id={"pageToLoad"}>
            {/* Este condicional determina que pagina sera la que se cargue */}
            {props.activePage == "HomeScreen" && <HomeContent />}
            {props.activePage == "ProfileScreen" && <ProfileContent />}
            {props.activePage == "SearchScreen" && <SearchContent />}
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
                onPress={() => {
                  setActivePage("AddScreen"), this.forceUpdate();
                }}
              >
                <Icon name="add-circle" style={setIconStyle("AddScreen")} />
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
  console.log("setting style to icon");
  if (page == props.activePage) {
    return {
      color: "#ffffff",
    };
  } else {
    return {
      color: "#da0446",
    };
  }
  console.log(this);
}
function setActivePage(page) {
  props.activePage = page;
  console.log(props.activePage);
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
