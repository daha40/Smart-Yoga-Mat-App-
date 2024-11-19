import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const navigation = useNavigation();

  const matFeatures = [
    {
      icon: 'accessibility',
      title: 'Posture Enhancement',
      description: 'Smart sensors to correct yoga positions'
    },
    {
      icon: 'speed',
      title: 'Performance Tracking',
      description: 'Monitor progress and improve your practice'
    },
    {
      icon: 'lightbulb',
      title: 'Real-time Guidance',
      description: 'Audio and visual cues during exercise'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../assets/yoga-mat.png')}
          style={styles.headerImage}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome to Smart Yoga Mat</Text>
        <Text style={styles.subtitle}>Transform your practice with technology</Text>
      </View>

      {/* Connection Options */}
      <View style={styles.connectionOptions}>
        <TouchableOpacity 
          style={[styles.connectButton, styles.bluetoothButton]}
          onPress={() => navigation.navigate('Connection', { mode: 'bluetooth' })}
        >
          <MaterialIcons name="bluetooth" size={28} color="#fff" />
          <Text style={styles.connectButtonText}>Connect via Bluetooth</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.connectButton, styles.wifiButton]}
          onPress={() => navigation.navigate('Connection', { mode: 'wifi' })}
        >
          <MaterialIcons name="wifi" size={28} color="#fff" />
          <Text style={styles.connectButtonText}>Connect via WiFi</Text>
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Smart Features</Text>
        {matFeatures.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <MaterialIcons name={feature.icon} size={24} color="#6200ee" />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.featuresGrid}>
        <TouchableOpacity 
          style={styles.featureButton}
          onPress={() => navigation.navigate('ControlPanel')}
        >
          <MaterialIcons name="play-circle-filled" size={24} color="#6200ee" />
          <Text style={styles.featureText}>Start Session</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureButton}
          onPress={() => navigation.navigate('Music')}
        >
          <MaterialIcons name="music-note" size={24} color="#6200ee" />
          <Text style={styles.featureText}>Sounds</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureButton}
          onPress={() => navigation.navigate('Products')}
        >
          <MaterialIcons name="shopping-bag" size={24} color="#6200ee" />
          <Text style={styles.featureText}>Products</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureButton}
          onPress={() => navigation.navigate('Analytics')}
        >
          <MaterialIcons name="insert-chart" size={24} color="#6200ee" />
          <Text style={styles.featureText}>Analytics</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  connectionOptions: {
    padding: 20,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  bluetoothButton: {
    backgroundColor: '#6200ee',
  },
  wifiButton: {
    backgroundColor: '#03a9f4',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  featureContent: {
    marginLeft: 15,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  featureButton: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  featureText: {
    marginTop: 8,
    color: '#6200ee',
    fontWeight: '500',
  },
});