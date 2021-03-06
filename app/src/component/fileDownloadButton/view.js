import React from 'react';
import { NativeModules, Text, View, TouchableOpacity } from 'react-native';
import fileDownloadButtonStyle from '../../styles/fileDownloadButton';

class FileDownloadButton extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    //this.checkAvailability(nextProps.uri);
    this.restartDownload(nextProps);
  }
  
  restartDownload(props) {
    const { downloading, fileInfo, uri, restartDownload } = props;

    if (
      !downloading &&
      fileInfo &&
      !fileInfo.completed &&
      fileInfo.written_bytes !== false &&
      fileInfo.written_bytes < fileInfo.total_bytes
    ) {
      restartDownload(uri, fileInfo.outpoint);
    }
  }
  
  render() {
    const {
      fileInfo,
      downloading,
      uri,
      purchaseUri,
      costInfo,
      loading,
      doPause,
      style,
    } = this.props;

    const openFile = () => {
      //openInShell(fileInfo.download_path);
      //doPause();
    };
    
    if (loading || downloading) {
      const progress =
          fileInfo && fileInfo.written_bytes ? fileInfo.written_bytes / fileInfo.total_bytes * 100 : 0,
        label = fileInfo ? progress.toFixed(0) + '% complete' : 'Connecting...';
        
      return (
        <View style={[style, fileDownloadButtonStyle.container]}>
          <View style={{ width: `${progress}%`, backgroundColor: '#ff0000', position: 'absolute', left: 0, top: 0 }}></View>
          <Text style={fileDownloadButtonStyle.text}>{label}</Text>
        </View>
      );
    } else if (fileInfo === null && !downloading) {
      if (!costInfo) {
        return (
          <View style={[style, fileDownloadButtonStyle.container]}>
            <Text>Fetching cost info...</Text>
          </View>
        );
      }
      return (
        <TouchableOpacity style={[style, fileDownloadButtonStyle.container]} onPress={() => {
            if (NativeModules.Mixpanel) {
              NativeModules.Mixpanel.track('Purchase Uri', { Uri: uri });
            }
            purchaseUri(uri);
          }}>
          <Text style={fileDownloadButtonStyle.text}>Download</Text>
        </TouchableOpacity>
      );
    } else if (fileInfo && fileInfo.download_path) {
      return (
        <TouchableOpacity style={[style, fileDownloadButtonStyle.container]} onPress={() => openFile()}>
          <Text style={fileDownloadButtonStyle.text}>Open</Text>
        </TouchableOpacity>
      );
    }

    return null;
  }
}

export default FileDownloadButton;
