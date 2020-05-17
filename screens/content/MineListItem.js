import * as React from "react";
import * as firebase from "firebase";
import Icon from "react-native-vector-icons/FontAwesome5";
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
    }
    state = {
      currentUid: null,
      isFollowing: null,
      followingArray: [],
    };

    UNSAFE_componentWillMount() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User logged in already or has just logged in.
          console.log(
            "USER LOGGEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD " + user.uid
          );
          this.setState({ currentUid: user.uid });
        } else {
          // User not logged in or has just logged out.
        }
        var currentUser = this.state.currentUid;
        console.log("UID " + uid);
        console.log("current user " + currentUser);

        var ref = firebase.database().ref("social/" + currentUser + "/follows");
        ref.on(
          "value",
          (snapshot) => {
            var aux = snapshot.val();
            let lelaso;
            for (var propss in aux) {
              lelaso = propss;
              try {
                idUsuario = aux[lelaso].userID;
                var array = this.state.followingArray;
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
      });
    }

    handleFollow = () => {
      let flag = false;
      var currentUser = this.state.currentUid;
      if (currentUser != uid) {
        for (let i = 0; i < this.state.followingArray.length; i++) {
          if (uid == this.state.followingArray[i]) {
            flag = true;
            console.log("dentroooooooooooooooooo");
            var ref = firebase.database().ref("social/" + currentUser);

            ref.child("/follows").on("value", (snapshot) => {
              console.log(snapshot);
              //////////////
              for (var propss in snapshot.val()) {
                console.log(snapshot.val()[propss]);
                console.log(snapshot.val()[propss].userID + " UID " + uid);
                if (snapshot.val()[propss].userID == uid) {
                  var ref = firebase
                    .database()
                    .ref("social/" + currentUser + "/follows");
                  ref.once("value").then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                      // if(ch){

                      // }
                      //remove each child
                      let lol = JSON.stringify(childSnapshot);
                      console.log(lol);
                      lol = lol.replace(/"}/, "");
                      lol = lol.replace(/{"userID":"/, "");

                      console.log("XXXXXXXXXXXXXXXX " + lol);
                      if (lol == uid) {
                        console.log("XDD LOL " + childSnapshot.key);
                        var ref = firebase
                          .database()
                          .ref(
                            "social/" +
                              currentUser +
                              "/follows/" +
                              childSnapshot.key
                          )
                          .remove()
                          .then(() => {
                            console.log("REMOVE OKKKKKKKKKKKKKKKKKKKKKK");
                          });
                      }
                      console.log("JAJAJJA " + JSON.stringify(childSnapshot));
                      //console.log(ref.child(childSnapshot));
                      // ref.child(childSnapshot.key).remove();
                    });
                  });
                }
                var ref = firebase.database().ref("social/" + currentUser);
                ref.child("/follows").child(uid);
              }
            });

            var ref = firebase.database().ref("social/" + uid);

            ref.child("/followed_by").child(currentUser).remove;
          }
        }
        if (!flag) {
          var ref = firebase
            .database()
            .ref("social/" + this.state.currentUid)
            .child("/follows");
          ref.push({
            userID: uid,
          });

          var ref = firebase
            .database()
            .ref("social/" + uid)
            .child("/followed_by");
          uid = this.state.currentUid;
          ref.push({ userID: uid });
        }
      }
      this.setState(this.state);
      this.forceUpdate();
    };

    isFollowing = () => {
      if (uid == this.state.currentUid) {
        return (
          <Icon
            style={{ marginRight: "3%" }}
            size={20}
            name={"user-check"}
            color="transparent"
          />
        );
      }
      for (let i = 0; i < this.state.followingArray.length; i++) {
        if (uid == this.state.followingArray[i]) {
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
      }
      return (
        <Icon
          name={"user-plus"}
          color="white"
          size={20}
          style={{ marginRight: "3%" }}
          onPress={this.handleFollow}
        />
      );
      this.setState(this.state);
      this.forceUpdate();
    };

    render() {
      return (
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={{
                uri: avatarURL,
              }}
            />
          </Left>
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
