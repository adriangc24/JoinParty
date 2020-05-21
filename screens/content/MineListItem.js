import * as React from "react";
import * as firebase from "firebase";
import Icon from "react-native-vector-icons/FontAwesome5";
var defaultProfile = require("./../../assets/defaultProfile.png");
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

export const dynamicItem = (
  uid,
  avatarURL,
  username,
  description,
  isFollowed
) => {
  class MineListItem extends React.Component {
    constructor(props) {
      super(props);

      this.handleFollow = this.handleFollow.bind(this);
      this.isFollowing = this.isFollowing.bind(this);
      this.unfollow = this.unfollow.bind(this);
      this.follow = this.follow.bind(this);
      this.checkFollowers = this.checkFollowers.bind(this);
      this.getPhoto = this.getPhoto.bind(this);
      this.updateFollow = this.updateFollow.bind(this);
    }
    state = {
      currentUid: null,
      followingArray: [],
    };

    UNSAFE_componentWillMount() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User logged in already or has just logged in.
          this.setState({ currentUid: user.uid });
        } else {
          // User not logged in or has just logged out.
        }
        var currentUser = this.state.currentUid;

        this.checkFollowers();
      });
    }

    checkFollowers = () => {
      var currentUser = this.state.currentUid;
      var array = this.state.followingArray;
      var ref = firebase.database().ref("social/" + currentUser + "/follows");
      ref.on(
        "value",
        (snapshot) => {
          for (var propss in snapshot.val()) {
            try {
              idUsuario = snapshot.val()[propss].userID;
              this.setState({ followingArray: [] });
              array.push(idUsuario);
              this.setState({ followingArray: array });
            } catch (error) {
              console.log(error);
            }
          }
        },
        function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        }
      );
    };

    updateFollow = (flag) => {
      var array = this.state.followingArray;
      if (flag == "follow") {
        array = array.push(uid);
      } else if (flag == "unfollow") {
        array = array.splice(array.indexOf(uid), 1);
      }
      console.log(array);
      this.setState({ followingArray: array });
    };

    handleFollow = () => {
      if (this.state.currentUid != uid) {
        if (this.state.followingArray.includes(uid)) {
          this.unfollow();
          this.updateFollow("unfollow");
        } else {
          this.follow();
          this.updateFollow("follow");
        }
      }

      this.setState(this.state);
      this.forceUpdate();
    };

    // FOLLOW METHOD
    follow = () => {
      var currentUser = this.state.currentUid;
      var ref = firebase
        .database()
        .ref("social/" + currentUser)
        .child("/follows");
      ref.push({
        userID: uid,
      });
      var ref = firebase
        .database()
        .ref("social/" + uid)
        .child("/followed_by");
      let ax = this.state.currentUid;
      ref.push({ userID: ax });
    };

    // UNFOLLOW METHOD (removes follows/uid and followed_by/uid entries)
    unfollow = () => {
      var currentUser = this.state.currentUid;
      var ref = firebase
        .database()
        .ref("social/" + currentUser)
        .child("/follows");
      ref.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          let lol = JSON.stringify(childSnapshot);
          lol = lol.replace(/"}/, "");
          lol = lol.replace(/{"userID":"/, "");

          if (lol == uid) {
            ref = firebase
              .database()
              .ref("social/" + currentUser + "/follows/" + childSnapshot.key)
              .remove();
          }
        });
      });

      var ref = firebase
        .database()
        .ref("social/" + uid)
        .child("/followed_by");
      ref.once("value").then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          let lol = JSON.stringify(childSnapshot);
          lol = lol.replace(/"}/, "");
          lol = lol.replace(/{"userID":"/, "");

          var ref = firebase
            .database()
            .ref("social/" + uid + "/followed_by/" + childSnapshot.key)
            .remove();
        });
      });
    };

    // Returns a icon which depends of the user's status followed / unfollowed / same user (icon invisible)
    isFollowing = () => {
      if (this.state.followingArray.includes(uid)) {
        return (
          <Icon
            name={"user-check"}
            color="white"
            size={20}
            style={{ marginRight: "3%" }}
            onPress={this.handleFollow}
          />
        );
      }

      if (!this.state.followingArray.includes(uid)) {
        return (
          <Icon
            name={"user-plus"}
            color="white"
            size={20}
            style={{ marginRight: "3%" }}
            onPress={this.handleFollow}
          />
        );
      }
    };

    // If user has upload photo returns it, else returns default photo
    getPhoto = () => {
      if (avatarURL == undefined) {
        return (
          <Thumbnail
            source={{
              uri:
                "https://firebasestorage.googleapis.com/v0/b/joinparty-4e37b.appspot.com/o/defaultProfile.png?alt=media&token=18296d12-e579-4401-bec5-22aa325ecc01",
            }}
          />
        );
      }
      return (
        <Thumbnail
          source={{
            uri: avatarURL,
          }}
        />
      );
    };

    render() {
      return (
        <ListItem avatar>
          <Left>{this.getPhoto()}</Left>
          <Body>
            <Text style={styles.textUser}>{username}</Text>
            <Text note style={styles.textDescription}>
              {description}
            </Text>
          </Body>
          {this.isFollowing()}
        </ListItem>
      );
    }
  }

  const styles = StyleSheet.create({
    textUser: {
      color: "white",
    },
    textDescription: {
      color: "#a7a7a7",
    },
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

  return <MineListItem />;
};
