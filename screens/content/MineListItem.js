import * as React from "react";
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

export default class MineListItem extends React.Component {
  constructor(props) {
    super(props);

    this.handleFollow = this.handleFollow.bind(this);
    this.isFollowing = this.isFollowing.bind(this);
  }
  state = {
    isFollowing: null,
  };

  handleFollow = () => {
    if (this.state.isFollowing == false) {
    } else if (this.state.isFollowing == true) {
    }
  };

  isFollowing = () => {
    //this.setState({ isFollowing: false });
    return "user-plus";
  };

  render() {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail
            source={{
              uri:
                "https://firebasestorage.googleapis.com/v0/b/joinparty-4e37b.appspot.com/o/adriangc24.jpeg?alt=media&token=cb84c9c2-da81-4c40-8e5f-5ea45c933987",
            }}
          />
        </Left>
        <Body>
          <Text style={styles.textUser}>Adrián González</Text>
          <Text note style={styles.textDescription}>
            Hago directos a las 20:00 todos los viernes !
          </Text>
        </Body>
        <Icon
          name={this.isFollowing()}
          color="white"
          size={20}
          style={{ marginRight: "3%" }}
          onPress={this.handleFollow()}
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
