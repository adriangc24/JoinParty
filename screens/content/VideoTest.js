/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import * as firebase from "firebase";
import React from "react";
import { Fab } from "native-base";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from "react-native-webrtc";

import { db } from "./../../App";

var micIconProps = {
  micIcon: "microphone",
  bgColor: "#86b300",
};

var videoIconProps = {
  videoIcon: "video",
  bgColor: "#86b300",
};

const dimensions = Dimensions.get("window");
const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
const peerConnection = new RTCPeerConnection(configuration);

import firebaseConn from "./../../Services/firebase";
const ayylmao = new firebaseConn();

let currentUserId;
let userdisplay;
let elkno;
let knoId;
//
currentUserId = ayylmao.getCurrentUserId();
userdisplay =
  currentUserId == "NrZNsYd2eKXQDBHqwxRPMBoy4Zb2" ? "adriangc24" : "juanbass";
elkno =
  currentUserId == "NrZNsYd2eKXQDBHqwxRPMBoy4Zb2" ? "juanbass" : "adriangc24";
knoId =
  currentUserId == "NrZNsYd2eKXQDBHqwxRPMBoy4Zb2"
    ? "4hwdaoqyoyRj3f1IH0hD4BXZZNT2"
    : "NrZNsYd2eKXQDBHqwxRPMBoy4Zb2";

async function makeCall() {
  db.ref("calls/" + currentUserId).on("child_added", async (snapshot) => {
    console.log(
      JSON.stringify(
        "SNAPSHOT UNDEFINED: -------------------" +
          JSON.stringify(snapshot.val())
      )
    );
    let lel = snapshot.val().respuestaa.answer;
    if (lel) {
      const remoteDesc = new RTCSessionDescription(lel);
      await peerConnection.setRemoteDescription(remoteDesc);
      console.log("got peer connection");
    }
  });
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  let objetoLlamada = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
    infoUser: userdisplay,
  };

  db.ref("calls/" + knoId)
    .push()
    .set({ ofertaa: objetoLlamada });
  console.log("oferta enviada: " + JSON.stringify(objetoLlamada));
}

function answerCall() {
  db.ref("calls/" + currentUserId)
    .once("value")
    .then(async (snapshot) => {
      let lelaso;
      for (var propss in snapshot.val()) {
        lelaso = propss;
      }

      let ofertaaa = snapshot.val()[lelaso];

      console.log(
        "MECAGOENDIOS --------------------------------------------------------------- " +
          JSON.stringify(ofertaaa)
      );
      let offer = ofertaaa.ofertaa.offer;
      console.log("OFEEEERA anserCall()" + offer);
      peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      let objetoRespuesta = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
        infoUser: userdisplay,
      };

      db.ref("calls/" + knoId)
        .push()
        .set({ respuestaa: objetoRespuesta });
      // console.log('HEMOS TERMINADO');
    });
}

function hacerAviso() {
  Alert.alert(
    "quieres llamar a " + elkno,
    "di algo perra",
    [
      {
        text: "Si",
        onPress: () => {
          makeCall();
        },
      },
      {
        text: "No",
        onPress: () => {
          Alert.alert("No has llamado");
        },
      },
    ],
    { cancelable: false }
  );
}

function crearTrigger() {
  db.ref("calls/" + currentUserId).on("child_added", (snapshot) => {
    let offer = snapshot.val().ofertaa.offer;
    if (offer) {
      Alert.alert(
        "te esta llamando " + elkno,
        "quieres contestar?",
        [
          {
            text: "Si",
            onPress: () => {
              answerCall();
            },
          },
          {
            text: "No",
            onPress: () => {
              Alert.alert("ere un mierda");
            },
          },
        ],
        { cancelable: false }
      );
    }
  });
}

export default class VideoTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localStream: null,
      remoteStream: null,
    };

    this.sdp;
    this.socket = null;
    this.candidates = [];
  }

  componentDidMount = () => {
    hacerAviso();
    crearTrigger();

    db.ref("calls/" + currentUserId + "/candidates").on(
      "child_added",
      async (snapshot) => {
        var lel = snapshot.val().iceCandidate;
        if (lel) {
          try {
            await peerConnection.addIceCandidate(lel);
          } catch (e) {
            console.error("Error adding received ice candidate", e);
          }
        }
      }
    );

    // Listen for connectionstatechange on the local RTCPeerConnection
    peerConnection.addEventListener("connectionstatechange", (event) => {
      if (peerConnection.connectionState === "connected") {
        console.log("YOOO SOY GIGANTEEE");
      }
    });

    peerConnection.onicecandidate = (e) => {
      // send the candidates to the remote peer
      // see addCandidate below to be triggered on the remote peer

      if (e.candidate) {
        // console.log(JSON.stringify(e.candidate))
        this.sendToPeer(e.candidate);
      }
    };

    // triggered when there is a change in connection state
    peerConnection.oniceconnectionstatechange = (e) => {
      console.log("peerConnection.oniceconnectionstatechange" + e);
    };

    peerConnection.onaddstream = (e) => {
      debugger;
      this.setState({
        remoteStream: e.stream,
      });
    };

    const success = (stream) => {
      console.log("success" + stream.toURL());
      this.setState({
        localStream: stream,
      });
      peerConnection.addStream(stream);
    };

    const failure = (e) => {
      console.log("getUserMedia Error: ", e);
    };

    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == "videoinput" &&
          sourceInfo.facing == (isFront ? "front" : "environment")
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      const constraints = {
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: isFront ? "user" : "environment",
          optional: videoSourceId
            ? [
                {
                  sourceId: videoSourceId,
                },
              ]
            : [],
        },
      };

      mediaDevices.getUserMedia(constraints).then(success).catch(failure);
    });
  };
  sendToPeer = (payload) => {
    db.ref("/calls/" + knoId + "/candidates")
      .push()
      .set({
        iceCandidate: payload,
      });
  };

  createOffer = () => {
    console.log("Offer");
    makeCall();
  };

  createAnswer = () => {
    answerCall();
  };

  setRemoteDescription = () => {
    // retrieve and parse the SDP copied from the remote peer
    const desc = JSON.parse(this.sdp);

    // set sdp as remote description
    peerConnection.setRemoteDescription(new RTCSessionDescription(desc));
  };

  addCandidate = () => {
    // retrieve and parse the Candidate copied from the remote peer
    // const candidate = JSON.parse(this.textref.value)
    // console.log('Adding candidate:', candidate)

    // add the candidate to the peer connection
    // this.pc.addIceCandidate(new RTCIceCandidate(candidate))

    this.candidates.forEach((candidate) => {
      console.log(JSON.stringify(candidate));
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  };

  render() {
    const { localStream, remoteStream } = this.state;

    const remoteVideo = remoteStream ? (
      <RTCView
        key={2}
        mirror={true}
        style={styles.remoteContainer}
        objectFit="contain"
        streamURL={remoteStream && remoteStream.toURL()}
      />
    ) : (
      <View style={styles.remoteContainer}>
        <Text style={{ fontSize: 22, textAlign: "center", color: "white" }}>
          Waiting for Peer connection ...
        </Text>
      </View>
    );

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.remoteContainer}>
          <View style={styles.remoteStreamContainer}>{remoteVideo}</View>
          <Fab
            direction="down"
            position="topRight"
            active={this.state.active}
            style={{ backgroundColor: "#86b300" }}
            onPress={() => this.setState({ active: !this.state.active })}
          >
            <Icon name="phone-square" />
            <Button style={{ backgroundColor: "#b30000" }}>
              <Icon name="phone-slash" />
            </Button>
            <Button
              style={{ backgroundColor: micIconProps.bgColor }}
              onPress={() => this.muteMic()}
            >
              <Icon name={micIconProps.micIcon} />
            </Button>
            <Button
              style={{ backgroundColor: videoIconProps.bgColor }}
              onPress={() => this.disableVideo()}
            >
              <Icon name={videoIconProps.videoIcon} />
            </Button>
            <Button
              style={{ backgroundColor: "#86b300" }}
              onPress={() => this.state.localStream._tracks[1]._switchCamera()}
            >
              <Icon name="exchange-alt" />
            </Button>
          </Fab>
          <ScrollView horizontal={true} style={styles.scrollContainer}>
            <RTCView
              objectFit="cover"
              style={styles.remoteStreamContainer}
              streamURL={localStream && localStream.toURL()}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  remoteContainer: {
    width: dimensions.width,
    height: dimensions.height,
    backgroundColor: "black",
  },
  scrollContainer: {
    width: dimensions.width,
    height: dimensions.height * 0.25,
    position: "absolute",
    bottom: "4%",
  },
  remoteStreamContainer: {
    borderWidth: 2,
    backgroundColor: "red",
    width: dimensions.height * 0.55,
    width: dimensions.width * 0.25,
    margin: 10,
  },
});
