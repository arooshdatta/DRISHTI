import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getBlinkStatus, getScreenDistance } from '../utils/eyeTracking';
import { updateLiveMetrics, subscribeToLiveMetrics, addHealthLog } from '../services/dbServices';
import { auth } from '../firebase';

const HealthContext = createContext();

export const useHealth = () => useContext(HealthContext);

export const HealthProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({ blinkRate: 14, distance: 45, distanceFactor: 0, screenTime: 0, breakTime: 0 });
  const [status, setStatus] = useState({ isFatigued: false, needsBreak: false, skipCount: 0 });
  const [session, setSession] = useState({ startTime: new Date(), lastBreak: new Date() });
  const [historicalData, setHistoricalData] = useState([]);

  
  // Reminders State
  const [reminders, setReminders] = useState([
    { id: '20-20-20', label: '20-20-20 Rule Break', intervalMins: 20, active: true, lastTriggered: Date.now() },
    { id: 'water', label: 'Hydration Pause', intervalMins: 60, active: true, lastTriggered: Date.now() },
    { id: 'rest', label: 'Rest Eyes', intervalMins: 120, active: true, lastTriggered: Date.now() }
  ]);

  const isCurrentlyBlinkingRef = useRef(false);
  const totalBlinksRef = useRef(0);
  const secondsElapsedRef = useRef(0);
  const breakSecondsElapsedRef = useRef(0);
  const lastDistanceUpdateRef = useRef(0);
  const isFaceDetectedRef = useRef(true);
  const rawDistanceRef = useRef(45);

  // We use refs to hold latest state for the backend interval without causing infinite timers
  const latestMetricsRef = useRef(metrics);
  const latestStatusRef = useRef(status);
  const latestRemindersRef = useRef(reminders);
  const lastSyncErrorTimeRef = useRef(0);
  
  useEffect(() => { latestMetricsRef.current = metrics; }, [metrics]);
  useEffect(() => { latestStatusRef.current = status; }, [status]);
  useEffect(() => { latestRemindersRef.current = reminders; }, [reminders]);

  // Request Notification Permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const processFaceMeshResults = useCallback((results) => {
      if (!results || !results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        isFaceDetectedRef.current = false;
        return;
      }
      isFaceDetectedRef.current = true;

      const landmarks = results.multiFaceLandmarks[0];
      const isEyesClosed = getBlinkStatus(landmarks);

      // 1. Process Blinks instantly in memory (30fps)
      if (isEyesClosed && !isCurrentlyBlinkingRef.current) {
        isCurrentlyBlinkingRef.current = true;
        totalBlinksRef.current += 1;
      } else if (!isEyesClosed && isCurrentlyBlinkingRef.current) {
        isCurrentlyBlinkingRef.current = false;
      }

      // 2. Buffer raw distance silently without triggering React state (60fps)
      const currentDistance = getScreenDistance(landmarks);
      if (currentDistance) {
        rawDistanceRef.current = currentDistance;
      }
  }, []);

  // Slower update loop (1 second ticks) - Write to Live Firestore instead of just local state
  useEffect(() => {
    const ticker = setInterval(async () => {
      if (!isFaceDetectedRef.current) {
        breakSecondsElapsedRef.current += 1;
      } else {
        secondsElapsedRef.current += 1;
      }
      
      const minutes = parseFloat((secondsElapsedRef.current / 60).toFixed(1));
      const breakMinutes = parseFloat((breakSecondsElapsedRef.current / 60).toFixed(1));
      const sessionDurationMins = Math.max(minutes, 0.1);
      const currentBlinkRate = Math.round(totalBlinksRef.current / sessionDurationMins);

      // Local UI update for buttery smoothness
      const prevMetrics = latestMetricsRef.current;
      const currentDistance = rawDistanceRef.current;
      const smoothedDistance = Math.round((prevMetrics.distance * 0.85) + (currentDistance * 0.15));
      const clampedDistance = Math.min(Math.max(smoothedDistance, 15), 100);
      const computedDistanceFactor = Math.max(0, Math.min(100, Math.round(100 - ((clampedDistance - 30) / 15) * 100)));

      const newMetrics = { 
        ...prevMetrics, 
        screenTime: minutes, 
        breakTime: breakMinutes, 
        blinkRate: currentBlinkRate,
        distance: clampedDistance,
        distanceFactor: computedDistanceFactor
      };
      setMetrics(newMetrics);
      
      // Sync live to Firestore (max 1/sec to respect quotas)
      try {
        if (auth.currentUser && auth.currentUser.uid) {
          await updateLiveMetrics(newMetrics, latestStatusRef.current, session);
        }
      } catch (error) {
        const now = Date.now();
        if (now - lastSyncErrorTimeRef.current > 10000) {
          console.warn("Drishti: Failed to sync live metrics (network/permission issue) -", error.message);
          lastSyncErrorTimeRef.current = now;
        }
      }
    }, 1000);
    return () => clearInterval(ticker);
  }, []);

  // Listen to the live snapshot (Great for multi-device sync!)
  useEffect(() => {
    const unsubscribe = subscribeToLiveMetrics((data) => {
      if (data && data.metrics && secondsElapsedRef.current === 0) {
        // If we just loaded and have remote data, sync local
        setMetrics(data.metrics);
        if (data.status) setStatus(data.status);
      }
    });
    return () => unsubscribe();
  }, []);
  
  // Real Timer Logic for Reminders (Checks every 10 seconds)
  useEffect(() => {
    const reminderTicker = setInterval(() => {
      const now = Date.now();
      let updated = false;
      
      const newReminders = latestRemindersRef.current.map(rem => {
        if (rem.active && now - rem.lastTriggered >= rem.intervalMins * 60 * 1000) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Drishti AI Reminder', {
              body: `Time for your ${rem.label}!`,
              icon: '/drishti_logo.svg',
              requireInteraction: true
            });
          }
          updated = true;
          return { ...rem, lastTriggered: now };
        }
        return rem;
      });
      
      if (updated) {
        setReminders(newReminders);
      }
    }, 10000);
    
    return () => clearInterval(reminderTicker);
  }, []);

  // Sync historical log to DB every 60 seconds (for Insights Charts)
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      if (auth.currentUser && auth.currentUser.uid) {
        await addHealthLog(latestMetricsRef.current, latestStatusRef.current, session);
      }
    }, 60000); 

    return () => clearInterval(syncInterval);
  }, [session]);

  return (
    <HealthContext.Provider value={{ 
      metrics, setMetrics, 
      status, setStatus, 
      session, setSession,
      reminders, setReminders,
      historicalData, setHistoricalData,
      processFaceMeshResults
    }}>
      {children}
    </HealthContext.Provider>
  );
};