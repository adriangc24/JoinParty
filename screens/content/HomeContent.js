import * as React from "react";
import CardView from "./CardView";

import {
  Platform,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Carousel from "react-native-snap-carousel";
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
  Card,
  CardItem,
  Thumbnail,
  Right,
} from "native-base";

export default class HomeContent extends React.Component {
  render() {
    return (
      <View id={"profileComps"} style={styles.container}>
        <Content>
          <ScrollView>
            <View id={"cardContainer"} style={styles.cardContainer}>
              <CardView />
              <CardView />
              <CardView />
              <CardView />
              <CardView />
            </View>
          </ScrollView>
        </Content>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  carousel: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    marginTop: "45%",
    transform: [{ rotate: "90deg" }],
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  footerTab: {
    backgroundColor: "black",
  },
  card: {
    width: "90%",
    //height: "50%",
  },
  cardContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    height: "90%",
  },
});
