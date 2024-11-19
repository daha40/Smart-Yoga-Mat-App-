import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Modal,
  Image,
  FlatList,
  Switch
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function ControlPanel() {
  const navigation = useNavigation();
  const [activeMode, setActiveMode] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showExercises, setShowExercises] = useState(false);
  const [currentInstructions, setCurrentInstructions] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [currentExercises, setCurrentExercises] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const matModes = [
    {
      id: 'warmup',
      name: 'Warm Up Mode',
      icon: 'whatshot',
      color: '#FF9800',
      instructions: 'Gentle exercises to prepare your body for yoga practice.',
      durations: ['5 mins', '10 mins', '15 mins'],
      exercises: [
        { name: 'Neck Rolls', duration: '1 min', description: 'Gently roll your neck in circles' },
        { name: 'Shoulder Rotations', duration: '1 min', description: 'Rotate shoulders forward and backward' },
        { name: 'Wrist and Ankle Circles', duration: '1 min', description: 'Rotate wrists and ankles' },
        { name: 'Cat-Cow Stretch', duration: '2 min', description: 'Alternate between arching and rounding your back' },
        { name: 'Light Stretching', duration: '2 min', description: 'Basic full body stretches' }
      ]
    },
    {
      id: 'practice',
      name: 'Practice Mode',
      icon: 'self-improvement',
      color: '#4CAF50',
      instructions: 'Full yoga session with posture guidance and feedback.',
      durations: ['30 mins', '45 mins', '60 mins'],
      exercises: [
        { name: 'Sun Salutation', duration: '10 min', description: 'Traditional yoga warm-up sequence' },
        { name: 'Standing Poses', duration: '15 min', description: 'Various standing asanas' },
        { name: 'Balance Poses', duration: '10 min', description: 'Single leg balancing poses' },
        { name: 'Floor Poses', duration: '15 min', description: 'Seated and lying poses' },
        { name: 'Final Relaxation', duration: '10 min', description: 'Savasana' }
      ]
    },
    {
      id: 'relaxation',
      name: 'Relaxation Mode',
      icon: 'spa',
      color: '#2196F3',
      instructions: 'Calming exercises and meditation guidance.',
      durations: ['15 mins', '20 mins', '30 mins'],
      exercises: [
        { name: 'Progressive Relaxation', duration: '7 min', description: 'Systematically relax each body part' },
        { name: 'Deep Breathing', duration: '5 min', description: 'Focused breathing exercises' },
        { name: 'Body Scan', duration: '8 min', description: 'Mental scan of your body' },
        { name: 'Guided Visualization', duration: '5 min', description: 'Peaceful imagery meditation' },
        { name: 'Sound Bath', duration: '5 min', description: 'Relaxing sound therapy' }
      ]
    },
    {
      id: 'meditation',
      name: 'Meditation Mode',
      icon: 'waves',
      color: '#9C27B0',
      instructions: 'Focus on breathing and mindfulness.',
      durations: ['10 mins', '20 mins', '30 mins'],
      exercises: [
        { name: 'Breath Awareness', duration: '5 min', description: 'Focus on natural breath' },
        { name: 'Mindfulness', duration: '10 min', description: 'Present moment awareness' },
        { name: 'Loving-Kindness', duration: '7 min', description: 'Cultivating compassion' },
        { name: 'Silent Meditation', duration: '5 min', description: 'Quiet contemplation' },
        { name: 'Gratitude Practice', duration: '3 min', description: 'Focusing on thankfulness' }
      ]
    }
  ];

  const handleModeSelect = (mode) => {
    if (activeMode === mode.id) {
      stopMode();
    } else {
      setCurrentExercises(mode.exercises);
      setCurrentInstructions(mode.instructions);
      setShowInstructions(true);
    }
  };

  const startMode = (duration) => {
    const mode = matModes.find(m => m.id === activeMode);
    setSelectedDuration(duration);
    setIsTimerActive(true);
    setTimer(parseInt(duration) * 60);
    Alert.alert('Mode Started', `${mode.name} started for ${duration}`);
    setShowInstructions(false);
  };

  const stopMode = () => {
    setActiveMode(null);
    setSelectedDuration(null);
    setIsTimerActive(false);
    setTimer(0);
    Alert.alert('Mode Stopped', 'Session ended');
  };

  const handleDurationSelect = (duration) => {
    setActiveMode(matModes.find(m => m.id === activeMode).id);
    startMode(duration);
  };

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseItem}>
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text style={styles.exerciseDuration}>{item.duration}</Text>
      </View>
      <Text style={styles.exerciseDescription}>{item.description}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.arrow}>
          <MaterialIcons name="arrow-back" size={30} color="#6200ee" />
        </TouchableOpacity>
      <View style={styles.header}>
        
        <MaterialIcons name="dashboard" size={30} color="#6200ee" />
        <Text style={styles.headerText}>Mat Control Panel</Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Current Status</Text>
        <Text style={styles.statusText}>
          {activeMode ? 
            `${matModes.find(m => m.id === activeMode).name} - ${selectedDuration}` : 
            'No mode currently active'}
        </Text>
        {isTimerActive && (
          <Text style={styles.timerText}>
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </Text>
        )}
      </View>

      <View style={styles.modesGrid}>
        {matModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeCard,
              { borderColor: mode.color },
              activeMode === mode.id && styles.activeModeCard
            ]}
            onPress={() => handleModeSelect(mode)}
          >
            <View style={[styles.iconContainer, { backgroundColor: mode.color }]}>
              <MaterialIcons name={mode.icon} size={30} color="#fff" />
            </View>
            <Text style={styles.modeName}>{mode.name}</Text>
            <Text style={styles.modeDuration}>
              {mode.durations[0]} - {mode.durations[mode.durations.length - 1]}
            </Text>
            {activeMode === mode.id && (
              <View style={styles.activeIndicator}>
                <MaterialIcons name="play-circle-filled" size={24} color={mode.color} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Instructions Modal */}
      <Modal
        visible={showInstructions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowInstructions(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Duration</Text>
            <Text style={styles.modalText}>{currentInstructions}</Text>
            <View style={styles.durationContainer}>
              {matModes.find(m => m.id === activeMode)?.durations.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={styles.durationButton}
                  onPress={() => handleDurationSelect(duration)}
                >
                  <Text style={styles.durationButtonText}>{duration}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.viewExercisesButton}
              onPress={() => {
                setShowExercises(true);
                setShowInstructions(false);
              }}
            >
              <Text style={styles.viewExercisesText}>View Exercises</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Exercises Modal */}
      <Modal
        visible={showExercises}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowExercises(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Exercise Program</Text>
            <FlatList
              data={currentExercises}
              renderItem={renderExerciseItem}
              keyExtractor={(item) => item.name}
              style={styles.exercisesList}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowExercises(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:35
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  arrow:{
    marginLeft:20
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#6200ee',
  },
  statusCard: {
    margin: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    elevation: 2,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginTop: 10,
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  modeCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#eee',
    alignItems: 'center',
  },
  activeModeCard: {
    backgroundColor: '#f8f8f8',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modeName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  modeDuration: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 24,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  durationButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  durationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  viewExercisesButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6200ee',
    marginBottom: 10,
  },
  viewExercisesText: {
    color: '#6200ee',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  exercisesList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  exerciseItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  exerciseDuration: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});