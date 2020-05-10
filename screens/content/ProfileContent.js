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
} from "react-native";
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
} from "native-base";

export default class ProfileContent extends React.Component {
  componentDidMount() {
    const { email, displayName } = firebase.auth().currentUser;

    this.setState({ email, displayName });
  }

  signOutUser = () => {
    console.log("signing out");
    firebase.auth().signOut();
  };

  render() {
    return (
      <View id={"profileComps"} style={styles.container}>
        <Content>
          <Text>PROFILE PAGE</Text>
          <Button rounded style={styles.buttons} onPress={this.signOutUser}>
            <Text>SIGN OUT</Text>
          </Button>
          <Image
            source={{
              uri:
                "https://firebasestorage.googleapis.com/v0/b/joinparty-4e37b.appspot.com/o/log-out.png?alt=media&token=6cd8c5e5-0e1c-46a2-9858-dc3da738252e",
            }}
          />
        </Content>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footerTab: {
    backgroundColor: "black",
  },
});
