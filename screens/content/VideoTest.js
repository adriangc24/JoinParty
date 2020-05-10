/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import * as firebase from "firebase";
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';

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

import {
  db
} from "./../../App";

const dimensions = Dimensions.get('window');
const configuration = {
  'iceServers': [{
    'urls': 'stun:stun.l.google.com:19302'
  }]
};
const peerConnection = new RTCPeerConnection(configuration);

async function makeCall() {
  db.ref("events").on("child_added", async snapshot => {
    if (snapshot.val().answer) {
      const remoteDesc = new RTCSessionDescription(snapshot.val().answer);
      await peerConnection.setRemoteDescription(remoteDesc);
      console.log("peer connection okay");
    }
  });
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  db.ref("events").set({
    "offer": offer
  });
}

async function answerCall() {
  let ayyy = db.ref("events/offer");

  ayyy.once("value").then(async snapshot => {
    let offer = snapshot.val();
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    db.ref("events").push().set({
      'answer': answer
    });
  });
}

export default class VideoTest extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        localStream: null,
        remoteStream: null,
      }

      this.sdp
      this.socket = null
      this.candidates = []
    }

    componentDidMount = () => {

      db.ref("candidates").on("child_added", async snapshot => {
        var lel = snapshot.val().candidate;
        if (lel) {
          try {
            await peerConnection.addIceCandidate(snapshot.candidate.candidate);
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
        }
      })

      // Listen for connectionstatechange on the local RTCPeerConnection
      peerConnection.addEventListener('connectionstatechange', event => {
          if (peerConnection.connectionState === 'connected') {
              console.log('YOOO SOY GIGANTEEE')
          }
      });


      peerConnection.onicecandidate = (e) => {
        // send the candidates to the remote peer
        // see addCandidate below to be triggered on the remote peer

        if (e.candidate) {
          // console.log(JSON.stringify(e.candidate))
          this.sendToPeer(e.candidate)
        }
      }

      // triggered when there is a change in connection state
      peerConnection.oniceconnectionstatechange = (e) => {
        console.log(e)
      }

      peerConnection.onaddstream = (e) => {
        debugger
        this.setState({
          remoteStream: e.stream
        })
      }

      const success = (stream) => {
        console.log(stream.toURL())
        this.setState({
          localStream: stream
        })
        peerConnection.addStream(stream)
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
    sendToPeer = (payload) => {
      db.ref("candidates").push().set({
        'candidate': payload
      });
    }

    createOffer = () => {
      console.log('Offer')
      makeCall();
    }

    createAnswer = () => {
      answerCall();
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

      this.candidates.forEach(candidate => {
        console.log(JSON.stringify(candidate))
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      });
    }


    render() {
        const {
            localStream,
            remoteStream,
        } = this.state

        const remoteVideo = remoteStream ?
            (
                <RTCView
                    key={2}
                    mirror={true}
                    style={{ ...styles.rtcViewRemote }}
                    objectFit='contain'
                    streamURL={remoteStream && remoteStream.toURL()}
                />
            ) :
            (
                <View style={{ padding: 15, }}>
                    <Text style={{ fontSize:22, textAlign: 'center', color: 'white' }}>Waiting for Peer connection ...</Text>
                </View>
            )

        return (

            <SafeAreaView style={{ flex: 1, }}>
                <StatusBar backgroundColor="blue" barStyle={'dark-content'}/>
                <View style={{...styles.buttonsContainer}}>
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity onPress={this.createOffer}>
                            <View style={styles.button}>
                                <Text style={{ ...styles.textContent, }}>Call</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity onPress={this.createAnswer}>
                            <View style={styles.button}>
                                <Text style={{ ...styles.textContent, }}>Answer</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ ...styles.videosContainer, }}>
                    <View style={{
                        position: 'absolute',
                        zIndex: 1,
                        bottom: 10,
                        right: 10,
                        width: 100, height: 200,
                        backgroundColor: 'black', //width: '100%', height: '100%'
                    }}>
                        <View style={{flex: 1 }}>
                            <TouchableOpacity onPress={() => localStream._tracks[1]._switchCamera()}>
                                <View>
                                    <RTCView
                                        key={1}
                                        zOrder={0}
                                        objectFit='cover'
                                        style={{ ...styles.rtcView }}
                                        streamURL={localStream && localStream.toURL()}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <ScrollView style={{ ...styles.scrollView }}>
                        <View style={{
                            flex: 1,
                            width: '100%',
                            backgroundColor: 'black',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            { remoteVideo }
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    margin: 5,
    paddingVertical: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  textContent: {
    //fontFamily: 'Sarala',
    fontSize: 20,
    textAlign: 'center',
  },
  videosContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  rtcView: {
    width: 100, //dimensions.width,
    height: 200, //dimensions.height / 2,
    backgroundColor: 'black',
  },
  scrollView: {
    flex: 1,
    // flexDirection: 'row',
    backgroundColor: 'teal',
    padding: 15,
  },
  rtcViewRemote: {
    width: dimensions.width - 30,
    height: 200, //dimensions.height / 2,
    backgroundColor: 'black',
  }
});
