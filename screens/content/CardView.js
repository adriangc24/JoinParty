import * as React from "react";
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

export default class CardView extends React.Component {
  constructor(props) {
    super(props);

    this.handleComment = this.handleComment.bind(this);
    this.handleLike = this.handleLike.bind(this);
  }

  handleComment = () => {
    console.log("handling comment");
  };
  handleLike = () => {
    console.log("handling like");
  };

  render() {
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Thumbnail
              source={{
                uri:
                  "https://firebasestorage.googleapis.com/v0/b/joinparty-4e37b.appspot.com/o/adriangc24.jpeg?alt=media&token=cb84c9c2-da81-4c40-8e5f-5ea45c933987",
              }}
            />
            <Body>
              <Text>Adrián González</Text>
              <Text note>@adriangc24</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image
            source={{
              uri:
                "https://firebasestorage.googleapis.com/v0/b/joinparty-4e37b.appspot.com/o/posts%2Fparty.gif?alt=media&token=b42c5c17-3e9a-45ce-8966-08bfe6c7792f",
            }}
            style={{ height: 200, width: null, flex: 1 }}
          />
        </CardItem>
        <CardItem>
          <Left>
            <Button
              transparent
              style={styles.buttonLikes}
              onPress={this.handleLike}
            >
              <Icon name="thumbs-up" style={styles.likeIcon} />
              <Text style={styles.textLikes}>0</Text>
            </Button>
          </Left>
          <Body>
            <Button
              transparent
              style={styles.buttonComments}
              onPress={this.handleComment}
            >
              <Icon name="chatbubbles" style={styles.chatIcon} />
              <Text style={styles.textComments}>0</Text>
            </Button>
          </Body>
          <Right>
            <Text>Hace 11 H.</Text>
          </Right>
        </CardItem>
      </Card>
    );
  }
}
const styles = StyleSheet.create({
  textLikes: {
    color: "#b5b5b5",
  },
  likeIcon: {
    color: "#b5b5b5",
  },
  chatIcon: {
    color: "#b5b5b5",
  },
  textComments: {
    marginLeft: "2%",
    color: "#b5b5b5",
  },
  buttonComments: {
    justifyContent: "center",
  },
  buttonLikes: {
    justifyContent: "center",
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
