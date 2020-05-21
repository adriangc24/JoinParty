/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import * as firebase from "firebase";
import React from 'react';
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
  Button
} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome5";

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

import {db} from "./../../App";

// DECLARACION DE VARIABLES QUE VAMOS A USAR
var micIconProps = {
  micIcon: "microphone",
  bgColor: "#86b300",
};

var videoIconProps = {
  videoIcon: "video",
  bgColor: "#86b300",
};

const dimensions = Dimensions.get('window');
const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]};

let currentUserId;
var eresQuienLlama = false; //si es TRUE eres quien llama, si es FALSE eres quien a llaman
var llamadoId = null; //variable por si hace falta
var llamadorId = null; //variable por si hace falta
var peerConnection = new RTCPeerConnection(configuration);
//--------------------------------------------------------------------------------

function comprobarDatos(datos) {
  console.log("Datos: " + JSON.stringify(datos));
  eresQuienLlama = datos.eresQuienLlama;
  llamadoId = datos.llamadoId;
  llamadorId = datos.llamadorId;

  console.log("\n eresQuienLlama: " + eresQuienLlama + "\n llamadoId: " + llamadoId + "\n llamadorId: " + llamadorId);

  if (eresQuienLlama) {
    llamadoId = datos.llamadoId;
    makeCallIndividual();
  } else {
    llamadorId = datos.llamadorId;
    answerCallIndividual();
  }
}

// FUNCIONES
async function makeCallIndividual() {
  db.ref("calls/" + currentUserId).on("value", async snapshot => {
    for (let key in snapshot.val()) {
      // console.log('SNAPSHOT UNDEFINED: -------------------' + JSON.stringify(snapshot.val()[key]));
      if (JSON.stringify(snapshot.val()[key]).includes("respuestaa") && snapshot.val()[key].respuestaa.infoUser == llamadoId) {
        let lel = snapshot.val()[key].respuestaa.answer;
        const remoteDesc = new RTCSessionDescription(lel);
        await peerConnection.setRemoteDescription(remoteDesc);
      }
    }
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  let objetoLlamada = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
    infoUser: currentUserId,
    llamadaIndividual: true
  };

  db.ref("calls/" + llamadoId).push().set({ofertaa: objetoLlamada});
  console.log('oferta enviada: ' + JSON.stringify(objetoLlamada) + " al usuario: " + llamadoId);
}

async function answerCallIndividual() {
  db.ref("calls/" + currentUserId).on("value", async snapshot => {
    console.log("iniciando answerCallIndividual")
    for (let key in snapshot.val()) {
      if (JSON.stringify(snapshot.val()[key]).includes("ofertaa") && snapshot.val()[key].ofertaa.infoUser == llamadorId) {
        let offertaa = snapshot.val()[key].ofertaa;
        let offer = offertaa.offer;
        console.log('OFEEEERA anserCall()' + offer);
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        let objetoRespuesta = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
          infoUser: currentUserId,
        };

        db.ref("calls/" + llamadorId).push().set({respuestaa: objetoRespuesta});
        console.log('HEMOS TERMINADO');
      }
    }
  });
}

function sendToPeer(payload) {
  if (eresQuienLlama) {
    db.ref("/calls/"+ llamadoId + "/candidates").push().set({
      'iceCandidate': payload
    });
  } else {
    db.ref("/calls/"+ llamadorId + "/candidates").push().set({
      'iceCandidate': payload
    });
  }
}

function triggerCandidates() {
  db.ref("calls/" + currentUserId + "/candidates").on("child_added", async snapshot => {
    var lel = snapshot.val().iceCandidate;
    if (lel) {
      try {
        peerConnection.addIceCandidate(new RTCIceCandidate(lel));
      } catch (e) {
        console.log('Error adding received ice candidate', e);
      }
    }
  })
}

//-----------------------------------------------------------------

// CONSTRUCTOR DE LA CALSE
export default class LlamadaIndividual extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        localStream: null,
        remoteStream: null,
        peerConnection: peerConnection
      }

      this.sdp
      this.candidates = []
      this.data = props.navigation.state.params.data; // de esta forma pasa la info entre pantallas

    }

    componentDidMount = () => {
      currentUserId = firebase.auth().currentUser.uid;
      console.log("aqui estamos lok")

      peerConnection.onaddstream = (e) => {
        debugger
        this.state.remoteStream = e.stream;
        console.log("TENEMOS STREAM");
        this.setState(this.state);
      }

      peerConnection.onicecandidate = (e) => {
        // send the candidates to the remote peer
        // see addCandidate below to be triggered on the remote peer
        if (e.candidate) {
          console.log(JSON.stringify(e.candidate))
          sendToPeer(e.candidate);
        }
      }



      const success = async (stream) => {
        console.log("success" + stream.toURL())
        this.setState({
          localStream: stream
        })
        peerConnection.addStream(stream);
        await comprobarDatos(this.data);
        triggerCandidates();
      }

      const failure = (e) => {
        console.log('getUserMedia Error: ', e)
      }

      let isFront = true;
      mediaDevices.enumerateDevices().then(sourceInfos => {
        console.log(sourceInfos);
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
          const sourceInfo = sourceInfos[i];
          if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
            videoSourceId = sourceInfo.deviceId;
          }
        }

        const constraints = {
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30
            },
            facingMode: (isFront ? "user" : "environment"),
            optional: (videoSourceId ? [{
              sourceId: videoSourceId
            }] : [])
          }
        }

        mediaDevices.getUserMedia(constraints)
          .then(success)
          .catch(failure);
      });


    }

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
      this.setState(this.state);
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
      this.setState(this.state);
    }

    setRemoteDescription = () => {
      // retrieve and parse the SDP copied from the remote peer
      const desc = JSON.parse(this.sdp)

      // set sdp as remote description
      peerConnection.setRemoteDescription(new RTCSessionDescription(desc))

    }

    addCandidate = () => {
      // retrieve and parse the Candidate copied from the remote peer
      // const candidate = JSON.parse(this.textref.value)
      // console.log('Adding candidate:', candidate)

      // add the candidate to the peer connection
      // this.pc.addIceCandidate(new RTCIceCandidate(candidate))
      console.log("DIKOSAJHDIOPUASHDUIOSAHDUIASHGDUIOYSAHDGIOUYASHDUIOSAHDIUOASHDUIOSAHDUIOSAHDIUOASHDUIYASOHDIUOSAHDUIODAHUI");

      this.candidates.forEach(candidate => {
        peerconnection.addIceCandidate(new RTCIceCandidate(candidate))
      });
    }

    render() {
        const {
            localStream,
            remoteStream,
            peerConnection
        } = this.state;

        const remoteVideo = remoteStream ? (<RTCView
          zOrder={3}
          objectFit="cover"
          style={styles.remoteContainer}
          streamURL={remoteStream && remoteStream.toURL()}
        />):
        (<View style={styles.remoteContainer}>
            <Text style={{ fontSize:22, textAlign: 'center', color: 'white' }}>Esperando respuesta...</Text>
        </View>);

        return (
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.remoteContainer}>
              <View>{remoteVideo}</View>
              <Fab
                direction="down"
                position="topRight"
                active={this.state.active}
                style={{ backgroundColor: "#86b300" }}
                onPress={() => this.setState({ active: !this.state.active })}
              >
                <Icon name="phone-square" />
                <Button
                  style={{ backgroundColor: "#b30000" }}
                  onPress={() => {
                    peerConnection.close();
                    peerConnection = new RTCPeerConnection(configuration);
                    this.props.navigation.navigate("Home");
                  }}
                >
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
                  zOrder={1}
                  objectFit="cover"
                  style={styles.remoteStreamContainer}
                  streamURL={localStream && localStream.toURL()}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
        );
    }
};

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
    backgroundColor: "black",
    width: dimensions.height * 0.55,
    width: dimensions.width * 0.25,
    margin: 10,
  },
});
