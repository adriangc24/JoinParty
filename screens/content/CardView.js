import * as React from "react";
import * as firebase from "firebase";
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
var defaultProfile = require("../../assets/defaultProfile.png");

var cnt = 0;
export default class CardView extends React.Component {
  constructor(props) {
    super(props);
    this.getData = this.getData.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.renderData = this.renderData.bind(this);
    this.showData = this.showData.bind(this);
  }
  state = {
    post: {
      uid: "",
      likes: 0,
      displayname: "",
      name: "",
      lastname: "",
      photoPost: null,
      photoUrl: null,
    },
    arrayPosts: [],
    arrayDisplaynames: [],
    arrayNames: [],
    arrayPhotoUrls: [],
    arrayPhotoPosts: [],
    arrayLastNames: [],
    arrayLikes: [],
    publicaciones: [
      {
        uid: "",
        likes: 0,
        displayname: "",
        name: "",
        lastname: "",
        photoPost: null,
        photoUrl: null,
      },
    ],
  };

  componentDidMount() {
    this.getData();
  }

  handleLike = () => {
    console.log("handling like");
  };

  getData = () => {
    var aux = [];
    var obj = {};
    var ref = firebase.database().ref("posts");
    var query = ref.orderByChild("displayname");
    query
      .once("value", function (snapshot) {
        var lol = JSON.stringify(snapshot);
        snapshot.forEach(function (child) {
          child.forEach(function (child2) {
            var lolaso = JSON.stringify(child2.val());
            obj = child2.val();
            aux.push(obj);
          });
        });
      })
      .then(() => {
        //console.log(aux);
        this.setState({ arrayPosts: aux });
        this.renderData();
      });
  };
  renderData = () => {
    var post3;

    for (let i = 0; i < this.state.arrayPosts.length; i++) {
      console.log(
        "XXXXXXXXX " + JSON.stringify(this.state.arrayPosts[i].photoPost)
      );
      post3 = {
        likes: this.state.arrayPosts[i].likes,
        photoPost: this.state.arrayPosts[i].photoPost,
        photoUrl: "",
      };

      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var usuario = firebase.database().ref("/users/" + user.uid);
          usuario.once("value").then((snapshot) => {
            var usr = snapshot.val();
            if (usr.photoUrl == null || usr.photoUrl == "") {
              post3.photoUrl =
                "https://firebasestorage.googleapis.com/v0/b/joinparty-4e37b.appspot.com/o/defaultProfile.png?alt=media&token=18296d12-e579-4401-bec5-22aa325ecc01";
            } else {
              post3.photoUrl = usr.photoUrl;
            }

            post3.uid = user.uid;
            (post3.displayname = usr.displayname),
              (post3.name = usr.name),
              (post3.lastname = usr.lastname),
              this.setState({
                post: post3,
              });
          });

          // User logged in already or has just logged in.
        } else {
          // User not logged in or has just logged out.
        }
      });
      this.setState({ post: post3 });
    }
  };

  showData = () => {};

  render() {
    return (
      <Card style={styles.card}>
        <CardItem>
          <Left>
            <Thumbnail
              source={{
                uri: this.state.post.photoUrl,
              }}
            />
            <Body>
              <Text>
                {this.state.post.name + " " + this.state.post.lastname}
              </Text>
              <Text note>{"@" + this.state.post.displayname}</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem cardBody>
          <Image
            source={{
              uri: this.state.post.photoPost,
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
              <Text style={styles.textLikes}>{this.state.post.likes}</Text>
            </Button>
          </Left>

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
