// ConnectionScreen.js
// Part of Smart Yoga Mat Mobile Application
// Handles Bluetooth and WiFi device connections for IoT yoga mat

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
  PermissionsAndroid 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BleManager } from 'react-native-ble-plx';
import WifiManager from 'react-native-wifi-reborn';
import { useNavigation } from '@react-navigation/native';

/**
 * ConnectionScreen Component
 * 
 * Manages device connections for the smart yoga mat:
 * - Bluetooth device scanning and connection
 * - WiFi network scanning and connection
 * - Handles permissions and connection states
 */
export default function ConnectionScreen() {
  const navigation = useNavigation();
  // Initialize Bluetooth and WiFi connection managers
  const [bleManager, setBleManager] = useState(null);
  const [initError, setInitError] = useState(null);

  // Connection state management
  const [isBluetoothConnecting, setIsBluetoothConnecting] = useState(false);
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const [isWifiConnecting, setIsWifiConnecting] = useState(false);
  const [isWifiConnected, setIsWifiConnected] = useState(false);
  const [wifiNetworks, setWifiNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  // Initialize Bluetooth Manager on component mount
  useEffect(() => {
    // Ensure Bluetooth is properly initialized and permissions are handled
    const initializeBleManager = () => {
      try {
        const manager = new BleManager();
        setBleManager(manager);
      } catch (error) {
        // Handle initialization errors gracefully
        console.error('Bluetooth Initialization Error:', error);
        setInitError(error.message);
        Alert.alert(
          'Bluetooth Setup',
          'Could not initialize Bluetooth. Ensure device support and permissions.'
        );
      }
    };

    initializeBleManager();

    // Clean up Bluetooth resources when component unmounts
    return () => {
      if (bleManager) {
        bleManager.destroy();
      }
    };
  }, []);

  // Permissions and Bluetooth state verification
  useEffect(() => {
    // Verify system readiness for device connections
    const setup = async () => {
      if (!bleManager) return;
  
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted) return;
  
      try {
        const state = await bleManager.state();
        if (state !== 'PoweredOn') {
          Alert.alert('Connection Required', 'Please enable Bluetooth to connect to your yoga mat');
        }
      } catch (error) {
        console.error('Connection Setup Error:', error);
        Alert.alert('Connection Error', 'Unable to prepare device connections');
      }
    };
  
    setup();
  }, [bleManager]);

  // Request necessary mobile permissions for device scanning
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // Dynamic permission requests based on Android version
        const permissions = [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ];

        // Additional permissions for Android 12+
        if (Platform.Version >= 31) {
          permissions.push(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
          );
        }

        const granted = await PermissionsAndroid.requestMultiple(permissions);

        // Verify all required permissions are granted
        const allGranted = Object.values(granted).every(
          permission => permission === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert(
            'Permissions Needed',
            'Please grant all permissions to connect to your yoga mat'
          );
          return false;
        }
        return true;
      } catch (err) {
        console.warn('Permission Request Error:', err);
        Alert.alert('Permission Error', 'Could not request necessary permissions');
        return false;
      }
    }
    return true;
  };

  // Scan for nearby Bluetooth devices (yoga mat)
  const scanForDevices = async () => {
    if (!bleManager) {
      Alert.alert('Connection Error', 'Bluetooth not initialized');
      return;
    }

    try {
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted) return;

      setScanning(true);
      setDevices([]);

      // Start device discovery
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error('Device Scanning Error:', error);
          setScanning(false);
          Alert.alert('Scanning Failed', 'Could not scan for yoga mat');
          return;
        }

        // Add unique devices to list
        if (device?.name) {
          setDevices(prevDevices => {
            if (!prevDevices.find(d => d.id === device.id)) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });
        }
      });

      // Auto-stop scanning after 10 seconds
      setTimeout(() => {
        if (bleManager) {
          bleManager.stopDeviceScan();
          setScanning(false);
        }
      }, 10000);

    } catch (error) {
      console.error('Device Scan Error:', error);
      Alert.alert('Scan Error', 'Failed to scan for yoga mat');
      setScanning(false);
    }
  };

  // Connect to selected Bluetooth device (yoga mat)
  const connectToDevice = async (device) => {
    if (!bleManager) {
      Alert.alert('Connection Error', 'Bluetooth not ready');
      return;
    }

    try {
      setIsBluetoothConnecting(true);
      setSelectedDevice(device);

      // Establish device connection
      const connectedDevice = await bleManager.connectToDevice(device.id, {
        autoConnect: true,
        timeout: 5000,
      });
      
      console.log('Connected to Yoga Mat:', device.name);

      // Discover device services and characteristics
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log('Yoga Mat Services Discovered');
      
      // Set up disconnect listener
      connectedDevice.onDisconnected((error, disconnectedDevice) => {
        console.log('Yoga Mat Disconnected:', disconnectedDevice.name);
        setIsBluetoothConnected(false);
        setSelectedDevice(null);
      });

      setIsBluetoothConnected(true);
      setIsBluetoothConnecting(false);
      Alert.alert('Connection Success', `Connected to Yoga Mat: ${device.name}`);
      
    } catch (error) {
      console.error('Device Connection Error:', error);
      Alert.alert('Connection Failed', 'Could not connect to yoga mat');
      setIsBluetoothConnecting(false);
      setSelectedDevice(null);
    }
  };

  // Scan for available WiFi networks
  const scanForWifiNetworks = async () => {
    try {
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted) return;

      setScanning(true);
      const networks = await WifiManager.loadWifiList();
      setWifiNetworks(networks);
      setScanning(false);
    } catch (error) {
      console.error('WiFi Scan Error:', error);
      Alert.alert('WiFi Error', 'Failed to find WiFi networks');
      setScanning(false);
    }
  };

  // Connect to selected WiFi network
  const connectToWifi = async (network) => {
    try {
      setIsWifiConnecting(true);
      setSelectedNetwork(network);

      // Attempt WiFi connection
      await WifiManager.connectToProtectedSSID(
        network.SSID,
        network.password,
        false
      );
      
      setIsWifiConnected(true);
      setIsWifiConnecting(false);
      Alert.alert('WiFi Connected', `Connected to ${network.SSID}`);
      
    } catch (error) {
      console.error('WiFi Connection Error:', error);
      Alert.alert('WiFi Error', 'Could not connect to network');
      setIsWifiConnecting(false);
      setSelectedNetwork(null);
    }
  };

  // Render connection screen UI
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#6200ee" />
        </TouchableOpacity>
      {/* Connection Status Display */}
      <View style={styles.statusCard}>
        {/* Bluetooth Connection Status */}
        <View style={styles.connectionStatus}>
          <MaterialIcons 
            name={isBluetoothConnected ? "bluetooth-connected" : "bluetooth-disabled"} 
            size={30} 
            color={isBluetoothConnected ? "#4CAF50" : "#666"}
          />
          <Text style={styles.statusText}>
            Yoga Mat: {isBluetoothConnected ? "Connected" : "Not Connected"}
          </Text>
        </View>
        {/* WiFi Connection Status */}
        <View style={styles.connectionStatus}>
          <MaterialIcons 
            name={isWifiConnected ? "wifi" : "wifi-off"} 
            size={30} 
            color={isWifiConnected ? "#4CAF50" : "#666"}
          />
          <Text style={styles.statusText}>
            WiFi: {isWifiConnected ? "Connected" : "Disconnected"}
          </Text>
        </View>
      </View>

      {/* Scanning Buttons */}
      <View style={styles.scanButtons}>
        {/* Bluetooth Scan Button */}
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.bluetoothButton,
            (scanning || isBluetoothConnected) && styles.disabledButton
          ]}
          onPress={scanForDevices}
          disabled={scanning || isBluetoothConnected}
        >
          <MaterialIcons name="bluetooth-searching" size={24} color="#fff" />
          <Text style={styles.buttonText}>Find Yoga Mat</Text>
          {scanning && <ActivityIndicator color="#fff" style={{marginLeft: 10}} />}
        </TouchableOpacity>

        {/* WiFi Scan Button */}
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.wifiButton,
            (scanning || isWifiConnected) && styles.disabledButton
          ]}
          onPress={scanForWifiNetworks}
          disabled={scanning || isWifiConnected}
        >
          <MaterialIcons name="wifi-tethering" size={24} color="#fff" />
          <Text style={styles.buttonText}>Scan Networks</Text>
          {scanning && <ActivityIndicator color="#fff" style={{marginLeft: 10}} />}
        </TouchableOpacity>
      </View>

      {/* Discovered Devices Section */}
      {devices.length > 0 && (
        <View style={styles.devicesContainer}>
          <Text style={styles.sectionTitle}>Available Yoga Mats</Text>
          {devices.map((device) => (
            <TouchableOpacity
              key={device.id}
              style={[
                styles.deviceItem,
                selectedDevice?.id === device.id && styles.selectedDevice
              ]}
              onPress={() => connectToDevice(device)}
              disabled={isBluetoothConnecting}
            >
              <MaterialIcons 
                name="bluetooth" 
                size={24} 
                color={selectedDevice?.id === device.id ? "#fff" : "#6200ee"} 
              />
              <View style={styles.deviceInfo}>
                <Text style={[
                  styles.deviceName,
                  selectedDevice?.id === device.id && styles.selectedText
                ]}>
                  {device.name || 'Unnamed Yoga Mat'}
                </Text>
                <Text style={[
                  styles.deviceId,
                  selectedDevice?.id === device.id && styles.selectedText
                ]}>
                  Mat ID: {device.id}
                </Text>
              </View>
              {isBluetoothConnecting && selectedDevice?.id === device.id && (
                <ActivityIndicator color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* WiFi Networks Section */}
      {wifiNetworks.length > 0 && (
        <View style={styles.devicesContainer}>
          <Text style={styles.sectionTitle}>Available WiFi Networks</Text>
          {wifiNetworks.map((network, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.deviceItem,
                selectedNetwork?.SSID === network.SSID && styles.selectedDevice
              ]}
              onPress={() => connectToWifi(network)}
              disabled={isWifiConnecting}
            >
              <MaterialIcons 
                name="wifi" 
                size={24} 
                color={selectedNetwork?.SSID === network.SSID ? "#fff" : "#6200ee"} 
              />
              <View style={styles.deviceInfo}>
                <Text style={[
                  styles.deviceName,
                  selectedNetwork?.SSID === network.SSID && styles.selectedText
                ]}>
                  {network.SSID}
                </Text>
                <Text style={[
                  styles.deviceId,
                  selectedNetwork?.SSID === network.SSID && styles.selectedText
                ]}>
                  Signal: {network.level} dBm
                </Text>
              </View>
              {isWifiConnecting && selectedNetwork?.SSID === network.SSID && (
                <ActivityIndicator color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  scanButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    flex: 0.48,
  },
  bluetoothButton: {
    backgroundColor: '#6200ee',
  },
  wifiButton: {
    backgroundColor: '#03a9f4',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  devicesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedDevice: {
    backgroundColor: '#6200ee',
  },
  deviceInfo: {
    flex: 1,
    marginLeft: 10,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectedText: {
    color: '#fff',
  },
});

