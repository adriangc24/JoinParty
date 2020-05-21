import * as React from "react";
import * as firebase from "firebase";
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
  List,
} from "native-base";

export default class HomeContent extends React.Component {
  constructor(props) {
    super(props);
    this.returnCards = this.returnCards.bind(this);
  }
  state = {
    contador: 0,
    arrayCards: [],
  };

  componentDidMount() {
    this.returnCards();
  }

  returnCards() {
    var count = 0;
    var ref = firebase.database().ref("posts");
    const snap = ref.once("value", function (snapshot) {
      snapshot.forEach(function (child) {
        child.forEach((x) => {
          count = count + 1;
        });
      });
    });
    snap.then(() => {
      var array = [];
      this.setState({ contador: count });
      for (let i = 0; i < count; i++) {
        array.push(<CardView style={styles.card} />);
      }
      this.setState({ arrayCards: array });
      console.log(this.state.arrayCards);
    });
  }

  render() {
    return (
      <View id={"profileComps"} style={styles.container}>
        <Content>
          <ScrollView>
            <View id={"cardContainer"} style={styles.cardContainer}>
              <List style={styles.list}>{this.state.arrayCards}</List>
            </View>
          </ScrollView>
        </Content>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  list: {
    width: "90%",
    alignItems: "center",
  },
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
