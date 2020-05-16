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
    };

    componentDidMount() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User logged in already or has just logged in.
          this.setState({ currentUid: user.uid });
        } else {
          // User not logged in or has just logged out.
        }
      });
    }

    handleFollow = () => {
      if (this.state.currentUid != uid) {
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
          .child("/follows");
        uid = this.state.currentUid;
        ref.push({ userID: uid });
      }
    };

    isFollowing = () => {
      var idUsuario;
      var currentUser = this.state.currentUid;
      if (currentUser != null) {
        console.log("ZZZ " + currentUser);
        var ref = firebase.database().ref("social/" + currentUser + "/follows");
        ref.on(
          "value",
          function (snapshot) {
            var aux = snapshot.val();
            console.log("YYYYYYYYYY " + JSON.stringify(aux));
            let lelaso;
            for (var propss in aux) {
              lelaso = propss;
            }
            try {
              idUsuario = aux[lelaso].userID;
              console.log(idUsuario);
            } catch (error) {
              console.log(error);
            }
          },
          function (errorObject) {
            console.log("The read failed: " + errorObject.code);
          }
        );
      }
      if (uid == idUsuario) {
        return "user-check";
      } else {
        return "user-plus";
      }
      this.setState(this.state);
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
          <Icon
            name={this.isFollowing()}
            color="white"
            size={20}
            style={{ marginRight: "3%" }}
            onPress={this.handleFollow}
          />
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
