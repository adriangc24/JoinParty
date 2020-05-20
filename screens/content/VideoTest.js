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
var llamadaIndividual = true; // si es TRUE la llamada es individual, si es FALSE es grupal
var eresQuienLlama = false; //si es TRUE eres quien llama, si es FALSE eres quien a llaman
var groupId = null; //variable por si hace falta
var llamadoId = null; //variable por si hace falta
var llamadorId = null; //variable por si hace falta
var peerConnection = {};
//--------------------------------------------------------------------------------

function comprobarLlamador(datos) {
  eresQuienLlama = datos.eresQuienLlama;

  if (eresQuienLlama) {
    llamadoId = datos.llamadoId;
    makeCallIndividual(llamadoId);
  } else {
    llamadorId = datos.llamadorId;
    answerCallIndividual();
  }
}

async function comprobarLlamada(datos) {
  //Se mira el tipo de llamada
  llamadaIndividual = datos.llamadaIndividual;
  // peerConnection.push(new RTCPeerConnection(configuration));

  if (llamadaIndividual) {
    //comprobarLlamador(datos);
  } else {
    groupId = datos.groupId;
    db.ref("groups/" + groupId + "/participants").on("value", async snapshot => {
      let aycaramba = snapshot.val();
      //console.log("ooooffer "+JSON.stringify(aycaramba));
      for (let userId in aycaramba) {
        if (aycaramba[userId] != currentUserId) {
          let aux1 = aycaramba[userId];
          console.log("adding keys: " + aux1 + " y soy: " + currentUserId);
          peerConnection[aux1] = new RTCPeerConnection(configuration);//{aycaramba[userId] : new RTCPeerConnection(configuration)}
        }
      }
    });
  }
}

// FUNCIONES
async function makeCallIndividual(llamadoId) {
  db.ref("calls/" + currentUserId).on("child_added", async snapshot => {
    console.log(JSON.stringify('SNAPSHOT UNDEFINED: -------------------' + JSON.stringify( snapshot.val())));
    let lel = snapshot.val().respuestaa.answer;
      if (lel) {
      const remoteDesc = new RTCSessionDescription(lel);
      await peerConnection[0].setRemoteDescription(remoteDesc);
      console.log("got peer connection");
    }
  });
  const offer = await peerConnection[0].createOffer();
  await peerConnection[0].setLocalDescription(offer);
  let objetoLlamada = {
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
    infoUser: userdisplay,
  };

  db.ref("calls/" + llamadoId).push().set({ofertaa: objetoLlamada});
  console.log('oferta enviada: ' + JSON.stringify(objetoLlamada));
}

async function makeCallGrupal() {
  db.ref("calls/" + currentUserId).on("child_added", async snapshot => {
    console.log('SNAPSHOT UNDEFINED: -------------------' + JSON.stringify( snapshot.val()));
    if (JSON.stringify( snapshot.val()).includes("respuestaa")) {
      let lel = snapshot.val().respuestaa;
        if (lel) {
          console.log(peerConnection[lel.infoUser] ? true: false);
          const remoteDesc = new RTCSessionDescription(lel.answer);
          await peerConnection[lel.infoUser].setRemoteDescription(remoteDesc);
          console.log("got peer connection");
        }
    }
  });

  let offers = {};
  for (let key in peerConnection) {
    console.log("using keys to offer: "  + peerConnection[key]);
    offers[key] = await peerConnection[key].createOffer();
    await peerConnection[key].setLocalDescription(offers[key]);
  }

  db.ref("groups/" + groupId + "/participants").on("value", async snapshot => {
    let aycaramba = snapshot.val();
    for (let userId in aycaramba) {
      if (aycaramba[userId] != currentUserId) {
        let offer = offers[aycaramba[userId]];
        let objetoLlamada = {
          offer: {
            type: offer.type,
            sdp: offer.sdp,
          },
          infoUser : currentUserId,
        };

        db.ref("/calls/"+ aycaramba[userId]).push().set({ofertaa: objetoLlamada});
        console.log('oferta enviada a: ' + aycaramba[userId]);
      }
    }
  });
}

async function answerCallGrupal() {
  let ofertas = {};
  db.ref("calls/" + currentUserId).on("value", async snapshot => {
    for (var propss in snapshot.val()) {
      if (JSON.stringify(snapshot.val()[propss]).includes("ofertaa")) {
        let oferta = snapshot.val()[propss].ofertaa;
        if (oferta.infoUser != currentUserId) {
          ofertas[oferta.infoUser] = oferta.offer;
          console.log("adding offer: " + JSON.stringify(ofertas))
        }
      }
    }

    for (let key in  ofertas) {
      console.log('OFEEEERA answerCallGrupal()' + JSON.stringify(ofertas[key]));
      await peerConnection[key].setRemoteDescription(new RTCSessionDescription(ofertas[key]));
      const answer = await peerConnection[key].createAnswer();
      let objetoRespuesta = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
        infoUser: currentUserId,
      };
      await peerConnection[key].setLocalDescription(new RTCSessionDescription(answer));
      db.ref("calls/" + key).push().set({respuestaa: objetoRespuesta});
    }
  });

  for (let key in peerConnection) {
    if (!peerConnection[key].localDescription) {
      makeCallGrupal();
    }
  }

}

function answerCallIndividual() {
  db.ref("calls/" + currentUserId).once("value").then(async snapshot => {
    let lelaso;
    for (var propss in snapshot.val()) { lelaso = propss; }

    let ofertaaa = snapshot.val()[lelaso];

    console.log('MECAGOENDIOS --------------------------------------------------------------- ' + JSON.stringify(ofertaaa))
    let offer = ofertaaa.ofertaa.offer;
    console.log('OFEEEERA anserCall()' + offer);
    peerConnection[0].setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection[0].createAnswer();
    await peerConnection[0].setLocalDescription(answer);
    let objetoRespuesta = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
      infoUser: userdisplay,
    };

    db.ref("calls/" + llamadorId).push().set({respuestaa: objetoRespuesta});
    console.log('HEMOS TERMINADO');
  });
}

function sendToPeer(payload) {
  if (llamadaIndividual) {
    if (eresQuienLlama) {
      db.ref("/calls/"+ llamadoId).push().set({
        'iceCandidate': payload
      });
    } else {
      db.ref("/calls/"+ llamadorId).push().set({
        'iceCandidate': payload
      });
    }
  } else {
    db.ref("groups/" + groupId + "/participants").on("value", async snapshot => {
      let aycaramba = snapshot.val();
      console.log("ooooffer "+JSON.stringify(aycaramba));
      for (let userId in aycaramba) {
        if (aycaramba[userId] != currentUserId) {
          db.ref("/calls/"+ aycaramba[userId]+"/candidates").push().set({'iceCandidate': payload});
        }
      }
    });
  }
}

function triggerCandidates() {
  db.ref("calls/" + currentUserId + "/candidates").on("child_added", async snapshot => {
    var lel = snapshot.val().iceCandidate;
    if (lel) {
      try {
        for (let key in peerConnection) {
          console.log("AQUI ENTRAMOS 3" + lel)
          peerConnection[key].addIceCandidate(new RTCIceCandidate(lel));
        }
      } catch (e) {
        console.log('Error adding received ice candidate', e);
      }
    }
  })
}

//-----------------------------------------------------------------

// CONSTRUCTOR DE LA CALSE
export default class VideoTest extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        localStream: null,
        remoteStream: [],
        streams : []
      }

      this.sdp
      this.candidates = []
      this.data = props.navigation.state.params.data; // de esta forma pasa la info entre pantallas

    }

    componentDidMount = () => {
      currentUserId = firebase.auth().currentUser.uid;

      comprobarLlamada({ //esto es solo para pruebas
            "llamadaIndividual" : false,
            "groupId" : "groupID"
      });

      for (let key in peerConnection) {

          peerConnection[key].onaddstream = (e) => {
            debugger
            this.state.remoteStream.push(e.stream);
            console.log("TENEMOS STREAM");
            this.state.streams = [];
            console.log("ayyyyyyyyyyyyyyyyy" + this.state.remoteStream.length)
            for (var i = this.state.remoteStream.length >= 1 ? 1 : 0 ; i < this.state.remoteStream.length ; i ++) {
              let objectAux = (<RTCView
                zOrder={1}
                objectFit="cover"
                style={styles.remoteStreamContainer}
                streamURL={this.state.remoteStream[i] && this.state.remoteStream[i].toURL()}
              />);
              this.state.streams.push(objectAux);
            }
            this.setState(this.state);
          }

        peerConnection[key].onicecandidate = (e) => {
          // send the candidates to the remote peer
          // see addCandidate below to be triggered on the remote peer

          if (e.candidate) {
            // console.log(JSON.stringify(e.candidate))
            sendToPeer(e.candidate);
          }
        }

      }

      Alert.alert(
      'eiii',
      'quieres llamar?',
      [
        {text: 'Yes', onPress: () => makeCallGrupal()},
        {text: 'No', onPress: () => answerCallGrupal()},
      ],
      { cancelable: true }
    );
triggerCandidates();
      const success = (stream) => {
        console.log("success" + stream.toURL())
        this.setState({
          localStream: stream
        })
        for (let key in peerConnection) {
          peerConnection[key].addStream(stream);
        }
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
      for (var ayay in peerConnection) {
        peerConnection[ayay].setRemoteDescription(new RTCSessionDescription(desc))
      }
    }

    addCandidate = () => {
      // retrieve and parse the Candidate copied from the remote peer
      // const candidate = JSON.parse(this.textref.value)
      // console.log('Adding candidate:', candidate)

      // add the candidate to the peer connection
      // this.pc.addIceCandidate(new RTCIceCandidate(candidate))
      console.log("DIKOSAJHDIOPUASHDUIOSAHDUIASHGDUIOYSAHDGIOUYASHDUIOSAHDIUOASHDUIOSAHDUIOSAHDIUOASHDUIYASOHDIUOSAHDUIODAHUI");

      this.candidates.forEach(candidate => {
        for (let i = 0; i < peerconnection.length ; i++) {
          peerconnection[i].addIceCandidate(new RTCIceCandidate(candidate))
        }
      });
    }

    render() {
        const {
            localStream,
            remoteStream,
            streams
        } = this.state;

        const streamsList = streams.map((stream) => stream);

        const remoteVideo = remoteStream.length != 0 ? (<RTCView
          zOrder={3}
          objectFit="cover"
          style={styles.remoteContainer}
          streamURL={remoteStream[0] && remoteStream[0].toURL()}
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
                  zOrder={1}
                  objectFit="cover"
                  style={styles.remoteStreamContainer}
                  streamURL={localStream && localStream.toURL()}
                />
                {streamsList}
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
