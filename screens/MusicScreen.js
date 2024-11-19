import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch,
  ScrollView
} from 'react-native';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';


const soundTracks = [
  { 
    id: '1', 
    name: 'Deep Breathing', 
    icon: 'air', 
    category: 'Meditation',
    audioUrl: require('../assets/sounds/deep-breathing.mp3')
  },
  { 
    id: '2', 
    name: 'Ocean Waves', 
    icon: 'waves', 
    category: 'Nature',
    audioUrl: require('../assets/sounds/ocean-waves.mp3')
  },
  { 
    id: '3', 
    name: 'Forest Ambient', 
    icon: 'forest', 
    category: 'Nature',
    audioUrl: require('../assets/sounds/forest-ambient.mp3')
  },
  { 
    id: '4', 
    name: 'Meditation Bells', 
    icon: 'music-note', 
    category: 'Meditation',
    audioUrl: require('../assets/sounds/meditation-bells.mp3')
  },
  { 
    id: '5', 
    name: 'Rain Sounds', 
    icon: 'grain', 
    category: 'Nature',
    audioUrl: require('../assets/sounds/rain-sounds.mp3')
  },
  { 
    id: '6', 
    name: 'Nature Sounds', 
    icon: 'nature', 
    category: 'Nature',
    audioUrl: require('../assets/sounds/nature-sounds.mp3')
  },
];

export default function MusicScreen() {
  const navigation = useNavigation();
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sound, setSound] = useState(null);

  const categories = ['All', ...new Set(soundTracks.map(track => track.category))];

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const toggleSound = async () => {
    setSoundEnabled(!soundEnabled);
    if (isPlaying) {
      await stopSound();
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }
    setSound(null);
    setIsPlaying(false);
    setSelectedTrack(null);
  };

  const playTrack = async (track) => {
    if (!soundEnabled) return;
    
    try {
      if (selectedTrack?.id === track.id) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        if (sound) {
          await stopSound();
        }
        
        const { sound: newSound } = await Audio.Sound.createAsync(
          track.audioUrl,
          { volume, isLooping: true }
        );
        
        setSound(newSound);
        setSelectedTrack(track);
        await newSound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const updateVolume = async (value) => {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  const handlePrevious = () => {
    if (!selectedTrack) return;
    const currentIndex = soundTracks.findIndex(track => track.id === selectedTrack.id);
    const previousIndex = (currentIndex - 1 + soundTracks.length) % soundTracks.length;
    playTrack(soundTracks[previousIndex]);
  };

  const handleNext = () => {
    if (!selectedTrack) return;
    const currentIndex = soundTracks.findIndex(track => track.id === selectedTrack.id);
    const nextIndex = (currentIndex + 1) % soundTracks.length;
    playTrack(soundTracks[nextIndex]);
  };

  const filteredTracks = selectedCategory === 'All' 
    ? soundTracks 
    : soundTracks.filter(track => track.category === selectedCategory);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#6200ee" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sound Options</Text>
        <View style={styles.soundToggle}>
          <Text style={styles.toggleText}>Enable Sounds</Text>
          <Switch
            value={soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: '#767577', true: '#6200ee' }}
            thumbColor={soundEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.trackList}>
        {filteredTracks.map((track) => (
          <TouchableOpacity
            key={track.id}
            style={[
              styles.trackItem,
              selectedTrack?.id === track.id && styles.selectedTrack
            ]}
            onPress={() => playTrack(track)}
            disabled={!soundEnabled}
          >
            <MaterialIcons 
              name={track.icon} 
              size={24} 
              color={selectedTrack?.id === track.id ? '#fff' : '#6200ee'} 
            />
            <View style={styles.trackInfo}>
              <Text style={[
                styles.trackName,
                selectedTrack?.id === track.id && styles.selectedText
              ]}>
                {track.name}
              </Text>
              <Text style={[
                styles.categoryLabel,
                selectedTrack?.id === track.id && styles.selectedText
              ]}>
                {track.category}
              </Text>
            </View>
            {selectedTrack?.id === track.id && (
              <MaterialIcons 
                name={isPlaying ? 'pause' : 'play-arrow'} 
                size={24} 
                color="#fff" 
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedTrack && (
        <View style={styles.playerControls}>
          <Text style={styles.nowPlaying}>
            Now Playing: {selectedTrack.name}
          </Text>
          <View style={styles.volumeControl}>
            <MaterialIcons name="volume-down" size={24} color="#666" />
            <Slider
              style={styles.slider}
              value={volume}
              onValueChange={updateVolume}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#6200ee"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#6200ee"
            />
            <MaterialIcons name="volume-up" size={24} color="#666" />
          </View>
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handlePrevious}
            >
              <MaterialIcons name="skip-previous" size={30} color="#6200ee" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.controlButton, styles.playButton]}
              onPress={() => playTrack(selectedTrack)}
            >
              <MaterialIcons 
                name={isPlaying ? 'pause' : 'play-arrow'} 
                size={40} 
                color="#fff" 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleNext}
            >
              <MaterialIcons name="skip-next" size={30} color="#6200ee" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:35
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  soundToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  categoryScroll: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#6200ee',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  trackList: {
    flex: 1,
    padding: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedTrack: {
    backgroundColor: '#6200ee',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 15,
  },
  trackName: {
    fontSize: 16,
    color: '#333',
  },
  categoryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedText: {
    color: '#fff',
  },
  playerControls: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  nowPlaying: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 10,
    marginHorizontal: 20,
  },
  playButton: {
    backgroundColor: '#6200ee',
    borderRadius: 30,
    padding: 15,
  },
});