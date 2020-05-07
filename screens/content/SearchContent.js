import * as React from "react";
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
} from "native-base";

export default class SearchContent extends React.Component {
  render() {
    return (
      <View id={"profileComps"} style={styles.container}>
        <Content>
          <View id={"searchContainer"}>
            <Header
              searchBar
              style={styles.header}
              containerStyle={styles.searchcontainer}
            >
              <Item style={{ borderWidth: 0 }}>
                <Icon name="ios-search" />
                <Input placeholder="Quieres ver algo nuevo?" />
              </Item>
            </Header>
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
