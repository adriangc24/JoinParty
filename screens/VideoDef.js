/**
 *
 * @format
 * @flow strict-local
 */
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Alert,
  Button,
  Text,
} from "react-native";

import { Fab } from "native-base";

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

import Icon from "react-native-vector-icons/FontAwesome5";

const dimensions = Dimensions.get("window");
import firebaseConn from "./../Services/firebase";
import * as firebase from "firebase";
const ayylmao = new firebaseConn();

var micIconProps = {
  micIcon: "microphone",
  bgColor: "#86b300",
};

var videoIconProps = {
  videoIcon: "video",
  bgColor: "#86b300",
};

export default class VideoDef extends React.Component {
  constructor(props) {
    super(props);
    //this.setRemoteDescription = this.setRemoteDescription.bind(this);
    //this.enviarRespuesta = this.enviarRespuesta.bind(this);

    this.state = {
      localStream: null,
      remoteStream: null,
    };

    this.sdp;
    this.candidates = [];
  }

  componentDidMount = () => {
    //PROVISIONAL WEBRTC ----------------------------------------------------
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(configuration);

    var candidatess = [];

    const db = firebase.database();

    peerConnection.onicecandidate = (e) => {
      // send the candidates to the remote peer
      // see addCandidate below to be triggered on the remote peer
      console.log("WEOIWOEPIWQOPEIWQOPEIOPQ - " + e);
      if (e.candidate) {
        console.log("candidatos" + JSON.stringify(e.candidate));
        candidatess.push(e.candidate);
      }
    };

    // triggered when there is a change in connection state
    peerConnection.oniceconnectionstatechange = (e) => {
      console.log("peerConnection.oniceconnectionstatechange" + e);
    };

    peerConnection.ontrack = (e) => {
      debugger;
      this.setState({
        remoteStream: e.stream,
      });
      console.log("stream añadido");
    };

    let currentUserId = ayylmao.getCurrentUserId();

    let llamador;

    crearTrigger();

    crearTriggerRespondido();

    enviarOferta();
    let estoesUNPUTOBUG = "0";

    async function crearTrigger() {
      db.ref("calls/" + currentUserId).on("child_added", async (snapshot) => {
        llamador = snapshot.val();
        console.log("llamador: " + JSON.stringify(llamador));
        estoesUNPUTOBUG++;
        console.log("ESTOESUNPUTOBUG " + estoesUNPUTOBUG);
        if (snapshot.val().offer) {
          Alert.alert(
            "Llamada entrante de " + snapshot.val().infoUser,
            "quieres contestar?",
            [
              {
                text: "Si",
                onPress: async () => {
                  peerConnection.setRemoteDescription(
                    new RTCSessionDescription(snapshot.val().offer)
                  );
                  console.log("ofertaAaaaaaAa " + peerConnection);
                  await enviarRespuesta();
                  console.log("got peer connection");
                },
              },
              {
                text: "No",
                onPress: () => {
                  Alert.alert("has rechazado la llamada");
                },
              },
            ],
            { cancelable: false }
          );
        }
      });
    }

    async function crearTriggerRespondido() {
      db.ref("calls/" + currentUserId).on("child_added", async (snapshot) => {
        llamador = snapshot.val();
        console.log("estas respondiendo a: " + JSON.stringify(llamador));
        if (snapshot.val()) {
          Alert.alert("te han respondido hulio");
          peerConnection.setRemoteDescription(snapshot.val().answer);
        } else {
          Alert.alert("nadie te quiere " + JSON.stringify(llamador));
        }
      });
    }

    console.log("llamador FUERA: " + llamador);

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

    let userdisplay =
      currentUserId == "NrZNsYd2eKXQDBHqwxRPMBoy4Zb2"
        ? "adriangc24"
        : "juanbass";
    let elkno =
      currentUserId == "NrZNsYd2eKXQDBHqwxRPMBoy4Zb2"
        ? "juanbass"
        : "adriangc24";
    let knoId =
      currentUserId == "NrZNsYd2eKXQDBHqwxRPMBoy4Zb2"
        ? "4hwdaoqyoyRj3f1IH0hD4BXZZNT2"
        : "NrZNsYd2eKXQDBHqwxRPMBoy4Zb2";

    async function enviarOferta() {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      console.log("enviando oferta a " + knoId);

      let objetoLlamada = {
        candidates: candidatess,
        offer: offer,
        infoUser: userdisplay,
      };

      db.ref("calls/" + knoId).set({
        ofertaa: objetoLlamada,
      });

      console.log("oferta enviada a: " + elkno);
    }

    async function enviarRespuesta() {
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      console.log("ENVIANDO RESPUESTA");

      let objetoRespuesta = {
        candidates: candidatess,
        answer: answer,
        infoUser: userdisplay,
      };

      db.ref("calls/" + knoId).set({
        respuestaa: objetoRespuesta,
      });
    }

    //FIN WEBRTC ----------------------------------------------------

    const success = (stream) => {
      console.log("success" + JSON.stringify(stream));

      this.setState({
        localStream: stream,
      });
      peerConnection.addStream(stream);
    };

    const failure = (e) => {
      console.log("getUserMedia Error: ", e);
    };

    let isFront = false;
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
            minWidth: 500,
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

  muteMic() {
    this.state.localStream.getAudioTracks()[0].enabled = !this.state.localStream.getAudioTracks()[0]
      .enabled;
    if (this.state.localStream.getAudioTracks()[0].enabled) {
      micIconProps.micIcon = "microphone";
      micIconProps.bgColor = "#86b300";
    } else {
      micIconProps.micIcon = "microphone-slash";
      micIconProps.bgColor = "#b30000";
    }
  }

  disableVideo() {
    this.state.localStream.getVideoTracks()[0].enabled = !this.state.localStream.getVideoTracks()[0]
      .enabled;
    if (this.state.localStream.getVideoTracks()[0].enabled) {
      videoIconProps.videoIcon = "video";
      videoIconProps.bgColor = "#86b300";
    } else {
      videoIconProps.videoIcon = "video-slash";
      videoIconProps.bgColor = "#b30000";
    }
  }

  /*
    <RTCView
        objectFit='cover'
        style={ {width: dimensions.width,height: dimensions.height} }
        streamURL={this.state.localStream && this.state.localStream.toURL()}
    />
    */

  render() {
    const { localStream, remoteStream } = this.state;

    console.log(this.state);

    const remoteVideo =
      remoteStream && remoteStream != [] ? (
        <RTCView
          key={2}
          mirror={true}
          style={styles.remoteContainer}
          objectFit="cover"
          streamURL={remoteStream && remoteStream.toURL()}
        />
      ) : (
        <View style={styles.remoteContainer}>
          <Text style={{ fontSize: 22, textAlign: "center", color: "white" }}>
            Esperando respuesta...
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
              streamURL={
                this.state.localStream && this.state.localStream.toURL()
              }
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
/*
<RTCView
    objectFit='cover'
    style={ styles.remoteStreamContainer }
    streamURL={this.state.localStream && this.state.localStream.toURL()}
/>
*/

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
