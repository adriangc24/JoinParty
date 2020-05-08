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
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      carouselItems: [
        {
          title: "Item 1",
          text: "Text 1",
        },
        {
          title: "Item 2",
          text: "Text 2",
        },
        {
          title: "Item 3",
          text: "Text 3",
        },
        {
          title: "Item 4",
          text: "Text 4",
        },
        {
          title: "Item 5",
          text: "Text 5",
        },
      ],
    };
  }

  render() {
    return (
      <View id={"profileComps"} style={styles.container}>
        <Content>
          <ScrollView>
            <View id={"cardContainer"} style={styles.cardContainer}>
              {/*  <Card style={styles.card}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{ uri: "Image URL" }} />
                    <Body>
                      <Text>NativeBase</Text>
                      <Text note>GeekyAnts</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image
                    source={{ uri: "Image URL" }}
                    style={{ height: 200, width: null, flex: 1 }}
                  />
                </CardItem>
                <CardItem>
                  <Left>
                    <Button transparent>
                      <Icon active name="thumbs-up" />
                      <Text>12 Likes</Text>
                    </Button>
                  </Left>
                  <Body>
                    <Button transparent>
                      <Icon active name="chatbubbles" />
                      <Text>4 Comments</Text>
                    </Button>
                  </Body>
                  <Right>
                    <Text>11h ago</Text>
                  </Right>
                </CardItem>
              </Card>

              <Card style={styles.card}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{ uri: "Image URL" }} />
                    <Body>
                      <Text>NativeBase</Text>
                      <Text note>GeekyAnts</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem cardBody>
                  <Image
                    source={{ uri: "Image URL" }}
                    style={{ height: 200, width: null, flex: 1 }}
                  />
                </CardItem>
                <CardItem>
                  <Left>
                    <Button transparent>
                      <Icon active name="thumbs-up" />
                      <Text>12 Likes</Text>
                    </Button>
                  </Left>
                  <Body>
                    <Button transparent>
                      <Icon active name="chatbubbles" />
                      <Text>4 Comments</Text>
                    </Button>
                  </Body>
                  <Right>
                    <Text>11h ago</Text>
                  </Right>
                </CardItem>
              </Card>*/}

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
