import * as React from "react";
import MineListItem from "./MineListItem";
import * as firebase from "firebase";
var defaultProfile = require("../../assets/defaultProfile.png");
import {
  Platform,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
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
  Item,
  Input,
  List,
  ListItem,
  Thumbnail,
  Right,
} from "native-base";
import { dynamicItem } from "./MineListItem";
var array = [];
var array2 = [];
export default class SearchContent extends React.Component {
  constructor(props) {
    super(props);

    //this.searchBarUser = this.searchBarUser.bind(this);
    this.getListItems = this.getListItems.bind(this);
  }
  state = {
    element: [],
  };

  getListItems = (avatarURL, username, description, isFollowed) => {
    return dynamicItem(avatarURL, username, description, isFollowed);
  };

  searchBarUser = (text) => {
    var ref = firebase.database().ref("users");
    console.log("000 TEXTO SEARCH BAR USER " + text);
    var query = ref
      .orderByChild("displayname")
      .startAt(text)
      .endAt(text + "\uf8ff");
    query
      .once("value", function (snapshot) {
        snapshot.forEach(function (child) {
          console.log(
            "----------------------- child value: " + child.val().displayname
          );
          array.push(child.val());
        });
      })
      .then(() => {
        var arrayPene = [];
        for (let i = 0; i < array.length; i++) {
          arrayPene.push(
            this.getListItems(
              array[i].photoUrl,
              array[i].displayname,
              array[i].description,
              true
            )
          );
        }
        this.state.element = arrayPene;
        this.setState(this.state);
        array = [];
      });
  };

  render() {
    return (
      <View id={"SearchContainerComps"} style={styles.container}>
        <Content>
          <View id={"searchContainer"}>
            <Header
              searchBar
              style={styles.header}
              containerStyle={styles.searchcontainer}
            >
              <Item style={{ borderWidth: 0 }}>
                <Icon name="ios-search" />
                <Input
                  placeholder="Quieres ver algo nuevo?"
                  onChangeText={(text) => {
                    this.searchBarUser(text);
                    this.setState(this.state);
                  }}
                />
              </Item>
            </Header>
            <Content>
              <List>{this.state.element}</List>
            </Content>
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
  footerTab: {
    backgroundColor: "black",
  },
  header: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
});
