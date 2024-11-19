// services/AnalyticsService.js
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

class AnalyticsService {
  constructor() {
    this.STORAGE_KEY = '@yoga_mat_analytics';
    this.analyticsRef = doc(db, 'analytics', 'yoga_mat_data'); // مرجع بيانات التحليلات في Firestore
  }

  async initializeAnalytics() {
    try {
      const analyticsSnap = await getDoc(this.analyticsRef);
      if (!analyticsSnap.exists()) {
        const initialData = {
          sessions: [],
          modes: {
            relaxation: 0,
            warmup: 0,
            breathing: 0,
            custom: 0,
          },
          totalMinutes: 0,
          lastUpdate: new Date().toISOString(),
        };
        // تخزين البيانات الأولية في Firestore
        await setDoc(this.analyticsRef, initialData);
      }
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  async recordSession(sessionData) {
    try {
      const { mode, duration } = sessionData;
      const data = await this.getAnalyticsData();
      
      // إضافة الجلسة إلى التاريخ
      data.sessions.push({
        timestamp: new Date().toISOString(),
        mode,
        duration,
      });

      // تحديث عداد الأنماط
      data.modes[mode] = (data.modes[mode] || 0) + 1;
      
      // تحديث الوقت الإجمالي
      data.totalMinutes += duration;
      
      // الاحتفاظ فقط بالجسات من آخر 30 يومًا
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      data.sessions = data.sessions.filter(session => 
        new Date(session.timestamp) > thirtyDaysAgo
      );

      // تخزين البيانات في Firestore
      await updateDoc(this.analyticsRef, data);
    } catch (error) {
      console.error('Failed to record session:', error);
    }
  }

  async getAnalyticsData() {
    try {
      const analyticsSnap = await getDoc(this.analyticsRef);
      return analyticsSnap.exists() ? analyticsSnap.data() : {};
    } catch (error) {
      console.error('Failed to get analytics data:', error);
      return {};
    }
  }

  async getWeeklySummary() {
    try {
      const data = await this.getAnalyticsData();
      const sessions = data.sessions || [];
      
      // تهيئة العدادات اليومية
      const dailyCounts = Array(7).fill(0);
      const dailyMinutes = Array(7).fill(0);
      let totalSessions = 0;
      
      // الحصول على الجلسات من آخر 7 أيام
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      sessions.forEach(session => {
        const sessionDate = new Date(session.timestamp);
        if (sessionDate > sevenDaysAgo) {
          const dayIndex = sessionDate.getDay();
          dailyCounts[dayIndex]++;
          dailyMinutes[dayIndex] += session.duration;
          totalSessions++;
        }
      });

      // حساب متوسط مدة الجلسة
      const avgSessionLength = totalSessions > 0 
        ? Math.round(data.totalMinutes / totalSessions) 
        : 0;

      return {
        sessions: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => ({
          day,
          count: dailyCounts[index],
          minutes: dailyMinutes[index],
        })),
        totalMinutes: dailyMinutes.reduce((a, b) => a + b, 0),
        averageSessionLength: avgSessionLength,
        totalSessions,
      };
    } catch (error) {
      console.error('Failed to get weekly summary:', error);
      return null;
    }
  }

  async getModeUsageStats() {
    try {
      const data = await this.getAnalyticsData();
      const modes = data.modes || {};
      const total = Object.values(modes).reduce((a, b) => a + b, 0);

      return Object.entries(modes).map(([mode, count]) => ({
        name: this.formatModeName(mode),
        count,
        percentage: total > 0 ? `${Math.round((count / total) * 100)}%` : '0%',
      })).sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Failed to get mode usage stats:', error);
      return [];
    }
  }

  formatModeName(mode) {
    return mode.charAt(0).toUpperCase() + 
           mode.slice(1).replace(/([A-Z])/g, ' $1').trim() + 
           ' Mode';
  }
}

export default new AnalyticsService();
