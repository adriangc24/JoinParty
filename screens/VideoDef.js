/**
 * Pantalla per a trucades de tot tipus
 * autor: jgomez
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Alert,
  Button
} from 'react-native';

import { Fab } from 'native-base';

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

import Icon from "react-native-vector-icons/FontAwesome5";
import firebaseConn from "./../Services/firebase";

const dimensions = Dimensions.get('window');

const ayylmao = new firebaseConn;

var micIconProps = {
  'micIcon' : 'microphone',
  'bgColor' : '#86b300'
};

var videoIconProps = {
  'videoIcon' : 'video',
  'bgColor' : '#86b300'
};

export default class VideoDef extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        localStream: null,
        remoteStream: [],
      }

      this.sdp
      this.candidates = []
    }

    componentDidMount = () => {
      const success = (stream) => {
        console.log("success" + JSON.stringify(stream));

        this.setState({
          localStream: stream
        })
      }

      const failure = (e) => {
        console.log('getUserMedia Error: ', e)
      }

      let isFront = false;
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
              minWidth: 500,
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
      this.state.localStream.getAudioTracks()[0].enabled = !this.state.localStream.getAudioTracks()[0].enabled;
      if (this.state.localStream.getAudioTracks()[0].enabled) {
        micIconProps.micIcon = 'microphone';
        micIconProps.bgColor = '#86b300';
      } else {
        micIconProps.micIcon = 'microphone-slash';
        micIconProps.bgColor = '#b30000';
      }
    }

    disableVideo() {
      this.state.localStream.getVideoTracks()[0].enabled = !this.state.localStream.getVideoTracks()[0].enabled;
      if (this.state.localStream.getVideoTracks()[0].enabled) {
        videoIconProps.videoIcon = 'video';
        videoIconProps.bgColor = '#86b300';
      } else {
        videoIconProps.videoIcon = 'video-slash';
        videoIconProps.bgColor = '#b30000';
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
        return (
            <SafeAreaView style={{ flex: 1}}>
                <View style={ styles.remoteContainer }>
                <RTCView
                    objectFit='cover'
                    style={ {width: dimensions.width,height: dimensions.height} }
                    streamURL={this.state.localStream && this.state.localStream.toURL()}
                />
                  <Fab
                    direction="down"
                    position="topRight"
                    active={this.state.active}
                    style={{backgroundColor: '#86b300'}}
                    onPress={() => this.setState({ active: !this.state.active })}>
                      <Icon name='phone-square'/>
                      <Button style={{ backgroundColor: '#b30000' }}>
                        <Icon name="phone-slash" />
                      </Button>
                      <Button style={{ backgroundColor: micIconProps.bgColor }} onPress={() => this.muteMic()}>
                        <Icon name={micIconProps.micIcon} />
                      </Button>
                      <Button style={{ backgroundColor: videoIconProps.bgColor }} onPress={() => this.disableVideo()}>
                        <Icon name={videoIconProps.videoIcon} />
                      </Button>
                      <Button style={{ backgroundColor: '#86b300' }} onPress={() => this.state.localStream._tracks[1]._switchCamera()} >
                        <Icon name="exchange-alt" />
                      </Button>
                  </Fab>
                  <ScrollView horizontal={true} style={styles.scrollContainer}>
                    <View style={ styles.remoteStreamContainer }/>
                    <View style={ styles.remoteStreamContainer }/>
                  </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
};
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
    backgroundColor: 'black',
  },
  scrollContainer: {
    width: dimensions.width,
    height: dimensions.height * .25,
    position: 'absolute',
    bottom: '4%',
  },
  remoteStreamContainer:{
    borderWidth: 2,
    backgroundColor: 'red',
    width: dimensions.height * .55,
    width: dimensions.width * .25,
    margin: 10,
  }

});
