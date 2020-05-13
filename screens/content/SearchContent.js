import * as React from "react";
import MineListItem from "./MineListItem";
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

export default class SearchContent extends React.Component {
  constructor(props) {
    super(props);

    this.searchBarUser = this.searchBarUser.bind(this);
  }
  state = {
    searchBarText: null,
  };

  searchBarUser = (text) => {
    console.log(text);
    this.setState({ searchBarText: text });
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
                  }}
                />
              </Item>
            </Header>
            <Content>
              <List>
                <MineListItem />
                <MineListItem />
                <MineListItem />
                <MineListItem />
                <MineListItem />
                <MineListItem />
                <MineListItem />
                <MineListItem />
                <MineListItem />
                <MineListItem />
                <MineListItem />
              </List>
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
