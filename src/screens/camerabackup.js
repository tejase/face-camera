'use strict';
import React, { PureComponent } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform } from 'react-native';
import { RNCamera, FaceDetector  } from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import CameraRollExtended from 'react-native-store-photos-album'

class ExampleApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { 
      mode: RNCamera.Constants.Type.back,
      canDetectFaces: false,
     };
     
  }
  
  
  


  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={this.state.mode}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
          onFacesDetected={ this.canDetectFaces ? this.facesDetected : null }
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.gallery.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> switch </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  async checkAndroidPermission() {
      console.log('ddfdfdf')
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'My App Storage Permission',
              message: 'My App needs access to your storage ' +
                'so you can save your photos',
            },
          );
          return granted;
    } catch (error) {
      Promise.reject(error);
    }
};

 checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      await PermissionsAndroid.request(permission);
      Promise.resolve();
    } catch (error) {
      Promise.reject(error);
    }
};

savePicture = async (data) => {
    if (Platform.OS === 'android'){
      await this.checkAndroidPermission();
    }
    //CameraRoll.saveToCameraRoll(data);
};

  takePicture = async () => {
    // let data = await this.requestExternalStoragePermission();
    // console.log(data); 
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
     // const gata = await FaceDetector.onFacesDetected();
      console.log(gata)
      console.log(data.uri);

      if (Platform.OS === 'android'){
        const bata = await this.savePicture(data.uri);
        console.log('returntype', bata);
      }
      
      //CameraRoll.save(data.uri);
      CameraRollExtended.saveToCameraRoll({uri: data.uri, album: 'Test'}, 'photo')
    }
  };

  gallery = async () => {
    // let data = await this.requestExternalStoragePermission();
    // console.log(data); 
    console.log('switch');
    if(this.state.mode == RNCamera.Constants.Type.back ){
      console.log('IN back mode gotto change to front mode')
      this.setState({ mode: RNCamera.Constants.Type.front  });
    }
    else{
      console.log('IN front mode gotto change to back mode')
      this.setState({ mode: RNCamera.Constants.Type.back  });
    }
  };
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default ExampleApp;