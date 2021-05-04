import React from 'react'

import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native'

import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'

import Ionicons from 'react-native-vector-icons/Ionicons'

export const Add = ({ navigation }) => {
  const [hasCameraPermission, setHasCameraPermission] = React.useState(null)
  const [hasGalleryPermission, setHasGalleryPermission] = React.useState(null)
  const [camera, setCamera] = React.useState(null)
  const [image, setImage] = React.useState(null)
  const [type, setType] = React.useState(Camera.Constants.Type.back)
  const [imagePick, setImagePick] = React.useState(false)

  React.useEffect(() => {
    ;(async () => {
      const cameraStatus = await Camera.requestPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setHasGalleryPermission(galleryStatus.status === 'granted')
    })()
  }, [])

  const onTakePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      setImage(data.uri)
      setImagePick(true)
    }
  }

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.cancelled) {
      setImage(result.uri)
      setImagePick(true)
    }
  }

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />
  }

  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <View style={styles.text}>
        {imagePick ? (
          <Text style={{ fontSize: 25, marginTop: 30 }}>Continue?</Text>
        ) : (
          <Text style={{ fontSize: 25, marginTop: 30 }}>Take a picture!</Text>
        )}
      </View>
      {imagePick ? (
        <View style={{ width: '100%', height: '60%' }}>
          <Image source={{ uri: image }} style={{ flex: 1 }} />
        </View>
      ) : (
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.camera}
          type={type}
          ratio={'1:1'}
        />
      )}
      <View style={styles.buttonContainer}>
        {imagePick ? (
          <TouchableOpacity onPress={() => setImagePick(false)}>
            <Ionicons name="close-outline" color="black" size={40} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ marginTop: '2%' }} onPress={onPickImage}>
            <Ionicons name="image-outline" color="black" size={40} />
          </TouchableOpacity>
        )}
        {imagePick ? null : (
          <TouchableOpacity onPress={onTakePicture}>
            <View style={styles.snapButton}>
              <View style={styles.box} />
            </View>
          </TouchableOpacity>
        )}
        {imagePick ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('Save', { image })}
          >
            <Ionicons name="checkmark-outline" color="black" size={40} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ marginTop: '2%' }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }}
          >
            <Ionicons name="camera-reverse-outline" color="black" size={40} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: { height: '100%', justifyContent: 'space-around' },

  camera: {
    aspectRatio: 1,
  },

  snapButton: {
    backgroundColor: 'black',
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 0.2,
  },

  box: {
    backgroundColor: 'black',
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
  },

  buttonContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
})
