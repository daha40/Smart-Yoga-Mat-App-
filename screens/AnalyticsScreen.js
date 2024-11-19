// screens/AnalyticsScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AnalyticsService from '../services/AnalyticsService';
import { useNavigation } from '@react-navigation/native';


const StatCard = ({ icon, value, unit, title, isLoading }) => (
  <View style={styles.statCard}>
    <MaterialIcons name={icon} size={24} color="#6200ee" />
    <View style={styles.statContent}>
      {isLoading ? (
        <ActivityIndicator color="#6200ee" />
      ) : (
        <>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statUnit}>{unit}</Text>
        </>
      )}
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

const SessionBar = ({ day, count, minutes, maxCount }) => {
  const barHeight = Math.max((count / maxCount) * 150, 2);
  
  return (
    <View style={styles.barContainer}>
      <View style={styles.barTooltipContainer}>
        {count > 0 && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{minutes} min</Text>
          </View>
        )}
        <View style={[styles.bar, { height: barHeight }]} />
      </View>
      <Text style={styles.barLabel}>{day}</Text>
      <Text style={styles.barCount}>{count}</Text>
    </View>
  );
};

const UsageMode = ({ name, count, percentage }) => (
  <View style={styles.usageItem}>
    <View style={styles.usageInfo}>
      <Text style={styles.usageName}>{name}</Text>
      <Text style={styles.usageCount}>
        {count} {count === 1 ? 'session' : 'sessions'}
      </Text>
    </View>
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: percentage }]} />
      <Text style={styles.progressText}>{percentage}</Text>
    </View>
  </View>
);

export default function AnalyticsScreen() {
  const navigation = useNavigation();
  const [weeklyData, setWeeklyData] = useState(null);
  const [modeStats, setModeStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      const [weekly, modes] = await Promise.all([
        AnalyticsService.getWeeklySummary(),
        AnalyticsService.getModeUsageStats()
      ]);
      setWeeklyData(weekly);
      setModeStats(modes);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadAnalytics();
  }, []);

  const maxSessions = weeklyData 
    ? Math.max(...weeklyData.sessions.map(s => s.count))
    : 0;

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#6200ee" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Summary</Text>
        <Text style={styles.headerSubtitle}>Last 7 Days Activity</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard 
          icon="fitness-center"
          value={weeklyData?.totalSessions || 0}
          unit="sessions"
          title="Total Sessions"
          isLoading={isLoading}
        />
        <StatCard 
          icon="timer"
          value={weeklyData?.totalMinutes || 0}
          unit="minutes"
          title="Total Time"
          isLoading={isLoading}
        />
        <StatCard 
          icon="av-timer"
          value={weeklyData?.averageSessionLength || 0}
          unit="minutes"
          title="Avg Session"
          isLoading={isLoading}
        />
      </View>

      {!isLoading && weeklyData && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Activity</Text>
            <View style={styles.chartContainer}>
              {weeklyData.sessions.map((data) => (
                <SessionBar 
                  key={data.day}
                  day={data.day}
                  count={data.count}
                  minutes={data.minutes}
                  maxCount={maxSessions}
                />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Used Functions</Text>
            {modeStats.map((mode, index) => (
              <UsageMode
                key={index}
                name={mode.name}
                count={mode.count}
                percentage={mode.percentage}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginTop:35
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  statUnit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barTooltipContainer: {
    alignItems: 'center',
    height: 150,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    backgroundColor: '#6200ee',
    borderRadius: 10,
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    backgroundColor: '#6200ee',
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  barCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  usageItem: {
    marginBottom: 16,
  },
  usageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  usageName: {
    fontSize: 14,
    color: '#000',
  },
  usageCount: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6200ee',
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: 8,
    fontSize: 12,
    color: '#666',
  },
});