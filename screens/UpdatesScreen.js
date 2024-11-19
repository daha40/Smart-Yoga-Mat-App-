// screens/UpdatesScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  ProgressBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import OTAService from '../services/OTAService';

export default function UpdatesScreen({ deviceId }) {
  const [currentVersion, setCurrentVersion] = useState('1.2.3');
  const [latestVersion, setLatestVersion] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, checking, downloading, installing
  const [progress, setProgress] = useState(0);
  const [updateInfo, setUpdateInfo] = useState(null);

  useEffect(() => {
    initializeDevice();
  }, []);

  const initializeDevice = async () => {
    try {
      await OTAService.initializeConnection(deviceId);
      checkForUpdates();
    } catch (error) {
      Alert.alert('Connection Error', error.message);
    }
  };

  const checkForUpdates = async () => {
    try {
      setStatus('checking');
      const info = await OTAService.checkForUpdates(currentVersion);
      setLatestVersion(info.latestVersion);
      setUpdateInfo(info);
      setStatus('idle');
    } catch (error) {
      Alert.alert('Update Check Failed', error.message);
      setStatus('idle');
    }
  };

  const startUpdate = async () => {
    try {
      // Download phase
      setStatus('downloading');
      const firmwareUri = await OTAService.downloadUpdate(
        updateInfo.downloadUrl,
        (downloadProgress) => setProgress(downloadProgress)
      );

      // Install phase
      setStatus('installing');
      setProgress(0);
      await OTAService.installUpdate(firmwareUri, (installProgress) => 
        setProgress(installProgress)
      );

      // Update complete
      setCurrentVersion(latestVersion);
      setUpdateInfo(null);
      setStatus('idle');
      Alert.alert('Success', 'Your smart yoga mat has been updated successfully!');
    } catch (error) {
      Alert.alert('Update Failed', error.message);
      setStatus('idle');
    }
  };

  const renderProgressBar = () => {
    if (status === 'downloading' || status === 'installing') {
      return (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} color="#6200ee" />
          <Text style={styles.progressText}>
            {status === 'downloading' ? 'Downloading: ' : 'Installing: '}
            {Math.round(progress * 100)}%
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.versionInfo}>
        <MaterialIcons name="system-update" size={50} color="#6200ee" />
        <Text style={styles.versionText}>
          Current Version: {currentVersion}
        </Text>
        {latestVersion && (
          <Text style={styles.versionText}>
            Latest Version: {latestVersion}
          </Text>
        )}
      </View>

      <TouchableOpacity 
        style={styles.checkButton}
        onPress={checkForUpdates}
        disabled={status !== 'idle'}
      >
        <MaterialIcons name="refresh" size={24} color="#fff" />
        <Text style={styles.buttonText}>
          {status === 'checking' ? "Checking for Updates..." : "Check for Updates"}
        </Text>
        {status === 'checking' && (
          <ActivityIndicator color="#fff" style={{marginLeft: 10}} />
        )}
      </TouchableOpacity>

      {updateInfo?.hasUpdate && status === 'idle' && (
        <View style={styles.updateCard}>
          <Text style={styles.updateTitle}>Update Available!</Text>
          <Text style={styles.updateDescription}>
            A new version of your smart yoga mat firmware is available. 
            Size: {(updateInfo.fileSize / 1024 / 1024).toFixed(1)} MB
          </Text>
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={startUpdate}
          >
            <MaterialIcons name="system-update" size={24} color="#fff" />
            <Text style={styles.buttonText}>Install Update</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderProgressBar()}

      {updateInfo?.releaseNotes && (
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Release Notes:</Text>
          <Text style={styles.noteText}>{updateInfo.releaseNotes}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... previous styles remain the same ...
  progressContainer: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  progressText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
});