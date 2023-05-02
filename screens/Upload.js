import React from 'react';
import { View, Text, Image, Button } from 'react-native';
import ImagePicker from 'react-native-image-picker';

const createFormData = (photo, body) => {
    const data = new FormData();
  
    data.append('images[]', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
    });
  
    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });
  
    return data;
  };

export default class Upload extends React.Component {
  state = {
    photo: null,
  };

  handleChoosePhoto = () => {
    const options = {
        mediaType: 'photo',
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.uri) {
        this.setState({ photo: response });
      }
    });
  };


  handleUploadPhoto = () => {
    fetch('http://10.0.2.2/api/upload', {
      method: 'POST',
      body: createFormData(this.state.photo, { userId: '123' }),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log('upload succes', response);
        alert('Upload success!');
        this.setState({ photo: null });
      })
      .catch((error) => {
        console.log('upload error', error);
        alert('Upload failed!');
      });
  };
  

  render() {
    const { photo } = this.state;
   
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {photo && (
            <React.Fragment>
              <Image
                source={{ uri: photo.uri }}
                style={{ width: 300, height: 300 }}
              />
              <Button title="Upload" onPress={this.handleUpload} />
            </React.Fragment>
          )}
          <Button title="Choose Photo" onPress={this.handleChoosePhoto} />
        </View>
      )

  }
}