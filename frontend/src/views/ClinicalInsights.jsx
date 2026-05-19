import React, { useState, useEffect, useRef } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { subscribeToHealthLogs } from '../services/dbServices';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClinicalInsights() {
  const { t } = useTranslation();
  const { metrics, session } = useHealth();
  const [feedback, setFeedback] = useState(null);

  const handleApplyHabit = () => {
    console.log("Applying habit suggestion to user profile...");
    setFeedback(t('clinicalInsights.habitApplied'));
    setTimeout(() => setFeedback(null), 2000);
  };
  
  const [logs, setLogs] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveBpm, setLiveBpm] = useState(72);
  const [notification, setNotification] = useState(null);
  const lastNotifiedTimeRef = useRef('');

  // Scheduled break times (normalised to single-digit hours where applicable, e.g. 2:00 PM)
  const SCHEDULED_BREAKS = ['10:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];

  // Global real-time clock
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Live heart rate simulator (rPPG)
  useEffect(() => {
    const bpmTimer = setInterval(() => {
      const randomBpm = Math.floor(Math.random() * (80 - 60 + 1)) + 60;
      setLiveBpm(randomBpm);
    }, 3000);
    return () => clearInterval(bpmTimer);
  }, []);

  // Check scheduled breaks using global clock
  useEffect(() => {
    let formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    // Normalize leading zeros to ensure compatibility (e.g. '02:00 PM' -> '2:00 PM')
    formattedTime = formattedTime.replace(/^0/, '').replace(/\s+/g, ' ').trim();
    if (formattedTime !== lastNotifiedTimeRef.current) {
      if (SCHEDULED_BREAKS.includes(formattedTime)) {
        lastNotifiedTimeRef.current = formattedTime;
        
        // Trigger browser notification if permission is granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Drishti Break Reminder', {
            body: `It's ${formattedTime}! Time for your scheduled break.`,
            icon: '/drishti_logo.svg'
          });
        }
        
        // Show in-app banner
        setNotification(`Scheduled Break: It's ${formattedTime}! Take a 5-minute break now.`);
      }
    }
  }, [currentTime]);

  useEffect(() => {
    return subscribeToHealthLogs(setLogs, 20); // Listen to latest 20 logs
  }, []);

  // Compute robust hourly data from Firestore logs, fallback to simulated hourly intervals
  const hourlyData = logs && logs.length >= 5 ? 
    logs.slice(0, 6).reverse().map((log, i) => {
      const logMetrics = log.metrics || {};
      const date = log.createdAt && typeof log.createdAt.toDate === 'function' ? log.createdAt.toDate() : new Date();
      let formattedHour = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
      formattedHour = formattedHour.replace(/\s+/g, ' ').trim();
      return {
        hour: formattedHour,
        screen: Number.isFinite(logMetrics.screenTime) ? Math.round(logMetrics.screenTime) : 30,
        break: Number.isFinite(logMetrics.breakTime) ? Math.round(logMetrics.breakTime) : 10
      };
    })
  : [
    { hour: '9 AM', screen: 40, break: 10 },
    { hour: '10 AM', screen: 45, break: 15 },
    { hour: '11 AM', screen: 35, break: 10 },
    { hour: '12 PM', screen: 50, break: 10 },
    { hour: '1 PM', screen: 20, break: 40 },
    { hour: '2 PM', screen: Number.isFinite(metrics?.screenTime) ? Math.round(metrics.screenTime) : 30, break: Number.isFinite(metrics?.breakTime) ? Math.round(metrics.breakTime) : 10 }
  ];

  // Generate 5-minute interval data ending at the accurate currentTime (Current Time Marker)
  const todayTrendData = [];
  for (let i = 4; i >= 0; i--) {
    const timePoint = new Date(currentTime.getTime() - i * 5 * 60 * 1000);
    const formattedTime = timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let bpmVal = 70;
    if (i === 0) {
      bpmVal = liveBpm;
    } else {
      // Create organic looking historical BPM values
      bpmVal = 65 + ((timePoint.getMinutes() * 7 + i * 11) % 15);
    }
    todayTrendData.push({
      time: formattedTime,
      bpm: bpmVal
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 max-w-6xl mx-auto">
      {/* Real-time notification banner */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-between p-4 rounded-xl bg-primaryContainer/30 border border-primary/20 text-onPrimaryContainer backdrop-blur-glass"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">alarm</span>
              <p className="text-sm font-medium">{notification}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="p-1 rounded-full hover:bg-primaryContainer/50 text-onPrimaryContainer cursor-pointer border-none bg-transparent flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Header */}
      <div className="space-y-2">
        <p className="text-primary font-semibold tracking-wider text-xs uppercase">{t('clinicalInsights.performanceAnalysis')}</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-onSurface">{t('clinicalInsights.title')}</h2>
        <p className="text-onSurfaceVariant text-md max-w-2xl leading-relaxed">
          {t('clinicalInsights.description')}
        </p>
      </div>

      {/* Bento Grid Insights */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Daily Screen Time vs Break Compliance */}
        <div className="md:col-span-8 glass-card rounded-xl p-6 shadow-[0px_8px_32px_rgba(0,0,0,0.04)] bg-surfaceContainerLowest">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-lg font-bold text-onSurface">{t('clinicalInsights.screenTimeBreaks')}</h3>
              <p className="text-sm text-onSurfaceVariant">{t('clinicalInsights.dailyCorrelation')}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold text-primary uppercase">{t('clinicalInsights.screen')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-secondary/5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
                <span className="text-[10px] font-bold text-secondary uppercase">{t('clinicalInsights.breaks')}</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-[256px] min-h-[256px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorBreak" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--secondary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="rgb(var(--secondary))" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--outline-variant) / 0.2)" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgb(var(--on-surface-variant))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgb(var(--on-surface-variant))' }} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: 'rgb(var(--surface-container-high))', borderRadius: '12px', border: 'none', color: 'rgb(var(--on-surface))' }}
                />
                <Bar dataKey="screen" stackId="a" fill="url(#colorScreen)" radius={[0, 0, 4, 4]} barSize={30} />
                <Bar dataKey="break" stackId="a" fill="url(#colorBreak)" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fatigue Trends */}
        <div className="md:col-span-4 glass-card rounded-xl p-6 bg-surfaceContainerLowest shadow-[0px_8px_32px_rgba(0,0,0,0.04)] border-none">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-onSurface">{t('clinicalInsights.fatigueLevels')}</h3>
            <p className="text-sm text-onSurfaceVariant">{t('clinicalInsights.estimatedStrain')}</p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-onSurface">{t('clinicalInsights.currentIndex')}</span>
                <span className={metrics.blinkRate < 10 ? "text-error" : "text-tertiary"}>
                  {metrics.blinkRate < 10 ? t('clinicalInsights.highStrain') : t('clinicalInsights.moderate')}
                </span>
              </div>
              <div className="h-3 w-full bg-surfaceContainerHigh rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r rounded-full transition-all duration-1000 ${metrics.blinkRate < 10 ? 'from-tertiary to-error' : 'from-secondary to-tertiary'}`} 
                  style={{ width: `${Math.max(10, 100 - (metrics.blinkRate * 5))}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-surfaceContainerLow border-none">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${metrics.distance < 30 ? 'text-error' : 'text-tertiary'}`}>
                  {metrics.distance < 30 ? 'error' : 'warning'}
                </span>
                <p className="text-xs font-medium leading-relaxed text-onSurfaceVariant">
                  {metrics.distance < 30 
                    ? t('clinicalInsights.warningDistance') 
                    : t('clinicalInsights.fatiguePeaks')}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="p-3 bg-surface text-center rounded-lg">
                <p className="text-[10px] text-outline font-bold uppercase">{t('clinicalInsights.screenDist')}</p>
                <p className={`text-lg font-bold ${metrics.distance < 30 ? 'text-error' : 'text-onSurface'}`}>{metrics.distance} cm</p>
              </div>
              <div className="p-3 bg-surface text-center rounded-lg">
                <p className="text-[10px] text-outline font-bold uppercase">{t('clinicalInsights.activeTime')}</p>
                <p className="text-lg font-bold text-onSurface">{metrics.screenTime} m</p>
              </div>
            </div>
          </div>
        </div>

        {/* Blink Rate / Heart Rate Analysis */}
        <div className="md:col-span-6 glass-card rounded-xl p-6 bg-surfaceContainerLowest shadow-[0px_8px_32px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">favorite</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-onSurface">{t('clinicalInsights.blinkRateAnalysis')}</h3>
              <p className="text-sm text-onSurfaceVariant">{t('clinicalInsights.avgBlinks')}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="relative h-[128px] min-h-[128px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={todayTrendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBlinks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--outline-variant) / 0.2)" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgb(var(--on-surface-variant))' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgb(var(--on-surface-variant))' }} domain={[50, 90]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgb(var(--surface-container-high))', borderRadius: '12px', border: 'none', color: 'rgb(var(--on-surface))' }}
                  />
                  <Area type="monotone" dataKey="bpm" stroke="rgb(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorBlinks)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-surfaceContainerHigh">
              <div className="text-center">
                <span className="block text-2xl font-extrabold text-onSurface">{liveBpm}</span>
                <span className="text-[10px] text-outline font-bold uppercase">{t('clinicalInsights.liveBpm')}</span>
              </div>
              <div className="h-8 w-[1px] bg-surfaceContainerHigh"></div>
              <div className="text-center">
                <span className="block text-2xl font-extrabold text-secondary">
                  {t('clinicalInsights.optimal')}
                </span>
                <span className="text-[10px] text-outline font-bold uppercase">{t('clinicalInsights.healthStatus')}</span>
              </div>
              <div className="h-8 w-[1px] bg-surfaceContainerHigh"></div>
              <div className="text-center">
                <span className={`block text-2xl font-extrabold ${Math.abs(liveBpm - 70) > 8 ? 'text-tertiary' : 'text-onSurface'}`}>
                  {liveBpm > 70 ? '+' : ''}{Math.round(((liveBpm - 70) / 70) * 100)}%
                </span>
                <span className="text-[10px] text-outline font-bold uppercase">{t('clinicalInsights.vsGoal')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Generated Tips (Incentive block) */}
        <div className="md:col-span-6 rounded-xl overflow-hidden relative group">
          <img 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            alt="serene morning sunbeams" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHX2Ldtu1YsuQHCmk1ypgL6WevVz04J8SyFwPSuFb0ahLOisN7sWUp3gapBj_ngJiUdZet-FihylQlMwNDNIO2HDTz4BsNfl8HHemwdPke4vU6seDHP1gklKwnrID8VB17fridrDPpADizzabsEStheNrkN7ATDgSXGHgLk29IYt1lp-0zn1urpqEnytpkv-p4fSjuHF3zHxc2yKHSRF5aCgQGh5RuyFewuqgJt9Mz2vuHZyFvcyJNEG3FXA6RU1J06gmDB_d9Lb9X"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-onSurface/90 via-onSurface/40 to-transparent"></div>
          
          <div className="relative h-full p-8 flex flex-col justify-end text-slate-900">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/10 backdrop-blur-md rounded-full w-fit mb-4 text-slate-900">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">{t('clinicalInsights.aiAdvisory')}</span>
            </div>
            
            <h4 className="text-xl font-bold mb-3 text-slate-900">{t('clinicalInsights.habitIncentive')}</h4>
            <p className="text-sm text-slate-800 leading-relaxed mb-6">
              {t('clinicalInsights.habitDescription1')}
              {metrics.screenTime}
              {t('clinicalInsights.habitDescription2')}
              {metrics.blinkRate}
              {t('clinicalInsights.habitDescription3')}
            </p>
            <button 
              onClick={handleApplyHabit}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {feedback || t('clinicalInsights.applyHabit')}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
