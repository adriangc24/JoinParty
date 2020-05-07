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
} from "native-base";

export default class ProfileContent extends React.Component {
  render() {
    return (
      <View id={"profileComps"} style={styles.container}>
        <Content>
          <Text>PROFILE PAGE</Text>
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
});
