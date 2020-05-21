import * as React from 'react';
import { Text, View, StyleSheet, Alert} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Title, List, ListItem, Thumbnail } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome5";
import * as firebase from "firebase";
import {navegar} from "./../HomeScreen";

export default class FriendsContent extends React.Component {
  constructor(props) {
    super(props);
    this.llamarAlColega = this.llamarAlColega.bind(this);
    this.getFriends = this.getFriends.bind(this);
    this.props = props;
  }

  getFriends = () => {
    let currentUserId = firebase.auth().currentUser.uid;
    let defaultProfile = "https://firebasestorage.googleapis.com/v0/b/joinparty-4e37b.appspot.com/o/defaultProfile.png?alt=media&token=18296d12-e579-4401-bec5-22aa325ecc01";

    let auxArr = [];
    firebase.database().ref("social/" + currentUserId + "/follows").on("value", async snapshot => {
      let valores = snapshot.val();
      for (let key in valores) {
        auxArr.push(valores[key].userID);
      }
    });

    let friendsDoc = {};
    firebase.database().ref("users/").on("value", async snapshot => {
      let users = snapshot.val();
      for (var i = 0; i < auxArr.length; i++) {
        friendsDoc[auxArr[i]] = users[auxArr[i]];
      }
    });

    let componentsArr = [];

    for (let key in friendsDoc) {

      let photo = friendsDoc[key].photoUrl ? friendsDoc[key].photoUrl : defaultProfile;

      let auxObject = (
        <ListItem avatar>
          <Left>
            <Thumbnail
              source={{
                uri : photo
              }}
            />
          </Left>
          <Body>
            <Text style={styles.textUser}>{friendsDoc[key].displayname}</Text>
            <Text note style={styles.textDescription}>
              {friendsDoc[key].description}
            </Text>
          </Body>
          <Icon
            name={"phone"}
            color="white"
            size={20}
            style={{ marginRight: "3%" }}
            onPress={() => this.llamarAlColega(key, currentUserId)}
          />
        </ListItem>);

        componentsArr.push(auxObject);
    }

    return componentsArr.map((component) => component);
  }

  componentDidMount = () => {
    this.setState(this.state);
  }

  llamarAlColega = (llamadoId, currentUserId) => {
    let data = {
      data: {
        eresQuienLlama : true,
        llamadoId : llamadoId,
        llamadorId : currentUserId
      }
    };
    console.log("data: " + JSON.stringify(data))
    this.props.navigation.navigate("CallScreen", data);
  }

  render() {
this.setState(this.state);
    return (
      <Container style={styles.mainContainer}>
        <Header style={{"backgroundColor" : "#5c041e"}}>
          <Body>
            <Title>Llama a un amigo!</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => {
              this.props.navigation.navigate("CallLab");
            }}>
              <Icon name='dice' />
            </Button>
            <Button transparent onPress={() => {
              this.forceUpdate();
            }}>
              <Icon name='redo' />
            </Button>
          </Right>
        </Header>
        <View>
          <List>
            {this.getFriends()}
          </List>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#121212",
  },
  textUser: {
    color: "white",
  },
  textDescription: {
    color: "#a7a7a7",
  },
  container: {
    flex: 1,
  }
});
