import React, { useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import icons from '../../constants/icons';
import { Image } from 'react-native';
import MlkitOcr from 'react-native-mlkit-ocr';


const Home = () => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const camera = useRef(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  async function capturePhoto() {
    try{
      const options = { quality : 0.5, base64: true };
      const photo = await camera.current.takePictureAsync(options);
      setCapturedPhoto(photo.uri);
      const resultFromUri = await MlkitOcr.detectFromUri(photo.uri);
      console.log(resultFromUri);
    } catch(error){
      console.log(error)
  }
}
if (capturedPhoto) {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      {/* Parent container with flex: 1 to fill the screen */}
      <View className="flex flex-col p-4 h-full justify-center">
        {/* Image container */}
        <Image
          source={{ uri: capturedPhoto }}
          className="h-[65vh] w-full rounded-lg object-contain"
          // style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
        />
        <TouchableOpacity 
        onPress={() => setCapturedPhoto(null)}
        activeOpacity={0.7}
        className={`bg-secondary rounded-xl min-h-[55px] w-1/2 mx-auto mt-4 justify-center items-center p-2 `}>
      <Text
      className={`text-primary font-psemibold text-lg `}
      >Retake</Text>
      </TouchableOpacity>
      </View>
      {/* Retake button positioned at the bottom */}
      
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView className="bg-primary h-vh">
      <View className="flex flex-col h-full justify-center p-4">
        <View className="flex h-[65vh] rounded-lg overflow-hidden">
          <CameraView ref={camera} className="h-full flex-1" facing={facing}>
          </CameraView>
        </View>
        <TouchableOpacity 
        className="mt-10"
        onPress={capturePhoto}
        >
              <Image
                source={icons.capture}
                resizeMode="contain"
                tintColor="#FF9001"
                className="w-12 h-12 mx-auto"
              /> 
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}


export default Home;