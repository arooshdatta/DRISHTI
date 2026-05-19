import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useHealth } from './contexts/HealthContext';
import { LayoutDashboard, UserSquare, Settings, Activity, Eye, AlertCircle, AlertTriangle, LogOut, Sun, Moon, Sparkles, BookOpen, MapPin, Camera } from 'lucide-react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Import our rich views
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';
import ClinicalInsights from './views/ClinicalInsights';
import ClinicalProfile from './views/ClinicalProfile';
import ProfileDashboard from './views/ProfileDashboard';
import EyeFacts from './views/EyeFacts';
import EyeCareCenters from './views/EyeCareCenters';
import VirtualMirror from './views/VirtualMirror';
import ParticleField from './components/ParticleField';
import IntroReveal, { EmeraldParticleBackground } from './components/IntroReveal';

function App() {
  const { metrics, status } = useHealth();
  const { t, i18n } = useTranslation();
  
  const [userName, setUserName] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email?.split('@')[0] || 'User');
      } else {
        setUserName(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Theme Toggle Logic — defaults to dark ("Visionary Calm" is dark-first)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved ? saved === 'dark' : true; // default dark
    }
    return true;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [authMode, setAuthMode] = useState('signup'); // 'signin' or 'signup'

  // App gating logic
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userName) {
    const authScreen = authMode === 'signin'
      ? <SignIn onLogin={(name) => setUserName(name || 'Guest User')} onSwitchMode={() => setAuthMode('signup')} />
      : <SignUp onLogin={(name) => setUserName(name || 'Guest User')} onSwitchMode={() => setAuthMode('signin')} />;

    return (
      <div style={{ overflowX: 'hidden', position: 'relative' }}>
        {/* Shared fixed particle background — z-0, always behind everything */}
        <EmeraldParticleBackground />
        <IntroReveal>
          {authScreen}
        </IntroReveal>
      </div>
    );
  }

  return (
    <div className="flex bg-background min-h-screen text-onSurface font-lexend">
      {/* Sidebar — Translucent Sanctuary style */}
      <aside className="w-20 md:w-64 bg-surfaceContainerLow border-r border-outlineVariant/20 flex flex-col justify-between p-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-4">
            <img src="/drishti_logo.svg" alt="Drishti Logo" className="w-10 h-10 shadow-glow-primary rounded-xl" />
            <span className="hidden md:block font-bold text-xl tracking-tight text-onSurface">Drishti</span>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem 
              icon={<LayoutDashboard size={20} />} 
              label={t('navbar.dashboard')} 
              active={activeTab === 'Dashboard'} 
              onClick={() => setActiveTab('Dashboard')}
            />
            <NavItem 
              icon={<Activity size={20} />} 
              label={t('navbar.clinicalInfo')} 
              active={activeTab === 'Insights'} 
              onClick={() => setActiveTab('Insights')}
            />
            <NavItem 
              icon={<UserSquare size={20} />} 
              label={t('navbar.profile')} 
              active={activeTab === 'Clinical Profile'} 
              onClick={() => setActiveTab('Clinical Profile')}
            />
            <NavItem 
              icon={<BookOpen size={20} />} 
              label={t('navbar.eyeFacts')} 
              active={activeTab === 'Eye Facts'} 
              onClick={() => setActiveTab('Eye Facts')}
            />
            <NavItem 
              icon={<MapPin size={20} />} 
              label={t('navbar.eyeCareCenters')} 
              active={activeTab === 'Eye Care Centers'} 
              onClick={() => setActiveTab('Eye Care Centers')}
            />
            <NavItem 
              icon={<Camera size={20} />} 
              label={t('navbar.virtualMirror')} 
              active={activeTab === 'Virtual Mirror'} 
              onClick={() => setActiveTab('Virtual Mirror')}
            />
          </nav>
        </div>
        
        <nav className="flex flex-col gap-2">
          <NavItem 
            icon={<Settings size={20} />} 
            label={t('navbar.settings')} 
            active={activeTab === 'Settings'} 
            onClick={() => setActiveTab('Settings')}
          />
          <NavItem 
            icon={<LogOut size={20} />} 
            label={t('navbar.logout')} 
            onClick={() => {
              signOut(auth);
              setUserName(null);
            }}
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Ambient particle background */}
        <ParticleField />

        {/* Top Bar — Glass header */}
        <header className="h-16 flex items-center justify-between px-8 bg-surface/60 backdrop-blur-glass sticky top-0 z-10 border-b border-outlineVariant/15 relative">
          <h1 className="text-headline-md tracking-tight text-onSurface">
            {activeTab === 'Dashboard' ? t('navbar.dashboard') : 
             activeTab === 'Insights' ? t('navbar.clinicalInfo') : 
             activeTab === 'Clinical Profile' ? t('navbar.profile') : 
             activeTab === 'Eye Facts' ? t('navbar.eyeFacts') : 
             activeTab === 'Eye Care Centers' ? t('navbar.eyeCareCenters') : 
             activeTab === 'Virtual Mirror' ? t('navbar.virtualMirror') : 
             activeTab === 'Settings' ? t('navbar.settings') : activeTab}
          </h1>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full bg-surfaceContainer hover:bg-surfaceContainerHigh text-onSurfaceVariant hover:text-primary cursor-pointer border-none"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={() => i18n.changeLanguage(i18n.language.startsWith('hi') ? 'en' : 'hi')}
              className="p-2.5 rounded-full bg-surfaceContainer hover:bg-surfaceContainerHigh text-onSurfaceVariant hover:text-primary cursor-pointer border-none flex items-center justify-center font-bold text-xs w-9 h-9"
              aria-label="Toggle Language"
            >
              {i18n.language.startsWith('hi') ? 'HI' : 'EN'}
            </button>

            {/* Health Score Pill */}
            <div className="flex items-center gap-2 bg-secondaryContainer text-onSecondaryContainer px-4 py-1.5 rounded-full text-label-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse"></span>
              Score: {metrics.screenTime > 120 ? 'Good' : 'Excellent'}
            </div>
            
            {/* Profile Avatar */}
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-9 h-9 rounded-full bg-surfaceContainerHighest border border-outlineVariant/30 flex items-center justify-center text-label-sm text-onSurface cursor-pointer hover:bg-surfaceContainer transition-colors p-0"
            >
              {userName.substring(0, 2).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-[1]">
          {activeTab === 'Dashboard' && <DashboardView userName={userName} metrics={metrics} />}
          {activeTab === 'Insights' && <ClinicalInsights />}
          {activeTab === 'Clinical Profile' && <ClinicalProfile />}
          {activeTab === 'Eye Facts' && <EyeFacts />}
          {activeTab === 'Eye Care Centers' && <EyeCareCenters />}
          {activeTab === 'Virtual Mirror' && <VirtualMirror />}
          {activeTab === 'Settings' && <SettingsView isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
        </div>
        
        {/* Profile Dashboard Modal/Drawer */}
        <ProfileDashboard 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)} 
          userName={userName} 
        />

        {/* Floating AI Chatbot Button */}
        <motion.button
          onClick={() => setIsProfileOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-surface/60 backdrop-blur-glass border border-outlineVariant/30 shadow-ambient flex items-center justify-center text-primary cursor-pointer hover:bg-surfaceContainer transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 0 0 0 rgb(var(--primary) / 0.4)",
              "0 0 0 15px rgb(var(--primary) / 0)"
            ]
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity }
          }}
          aria-label="Open AI Assistant"
        >
          <Sparkles size={24} />
        </motion.button>
      </main>
    </div>
  );
}

// ---------------------------
// VIEW COMPONENTS (Local ones not mapped to Stitch)
// ---------------------------

function DashboardView({ userName, metrics }) {
  const { processFaceMeshResults } = useHealth();
  const { t } = useTranslation();
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [isInitializing, setIsInitializing] = React.useState(true);
  
  React.useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    setIsInitializing(true);

    const faceMesh = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults((results) => {
      if (processFaceMeshResults) {
        processFaceMeshResults(results);
      }
      const canvas = canvasRef.current;
      if (!canvas || !results.image) return;
      const ctx = canvas.getContext('2d');
      canvas.width = results.image.width || 640;
      canvas.height = results.image.height || 480;
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    });

    const camera = new window.Camera(videoElement, {
      onFrame: async () => {
        if (videoRef.current) {
          await faceMesh.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480
    });

    camera.start().then(() => setIsInitializing(false))
      .catch(err => {
        console.error("Camera failed to start", err);
        setIsInitializing(false);
      });

    return () => {
      camera.stop();
      faceMesh.close();
      console.log("Successfully destroyed WebGL context in Dashboard");
    };
  }, [processFaceMeshResults]);

  // Prep for Firebase: use local state for metrics
  const [localMetrics, setLocalMetrics] = React.useState(metrics);
  
  // Keep local metrics updated with live metrics (if they exist) before Firebase is fully hooked up
  React.useEffect(() => {
    setLocalMetrics(metrics);
  }, [metrics]);

  const safeDistance = Number.isFinite(localMetrics?.distance) ? localMetrics.distance : 40;
  const safeBlinkRate = Number.isFinite(localMetrics?.blinkRate) ? localMetrics.blinkRate : 15;
  const safeScreenTime = Number.isFinite(localMetrics?.screenTime) ? localMetrics.screenTime : 0;
  
  // Strain calculations (0-100 scale, higher means worse)
  // Distance: >= 45cm is optimal (low strain), < 30cm is danger (high strain)
  const distStrain = Math.max(10, Math.min(95, Math.round(100 - ((safeDistance - 25) / 20) * 100)));
  // Blinks: >= 15 is optimal, < 10 is danger
  const blinksStrain = Math.max(10, Math.min(95, Math.round(100 - ((safeBlinkRate - 8) / 7) * 100)));
  // Time: < 30 min is optimal, >= 60 min is danger
  const timeStrain = Math.max(10, Math.min(95, Math.round((safeScreenTime / 60) * 100)));

  const fatigueScore = Math.round((distStrain + blinksStrain + timeStrain) / 3);

  // Danger Thresholds
  const isDistDanger = safeDistance < 30;
  const isBlinksDanger = safeBlinkRate < 10;
  const isTimeDanger = safeScreenTime >= 60;
  
  // Safe Thresholds
  const isDistSafe = safeDistance >= 45;
  const isBlinksSafe = safeBlinkRate >= 15;
  const isTimeSafe = safeScreenTime < 30;

  const isAnyDanger = isDistDanger || isBlinksDanger || isTimeDanger;
  const isAllSafe = isDistSafe && isBlinksSafe && isTimeSafe;

  let scoreColor = 'rgb(var(--primary))';
  if (isAnyDanger) {
    scoreColor = 'rgb(var(--error))';
  } else if (!isAllSafe) {
    scoreColor = 'rgb(var(--tertiary))';
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Hero / Welcome Section */}
      <section className="glass-card p-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-body-lg text-onSurfaceVariant mb-1">{t('dashboard.welcomeBack')}</h2>
            <div className="text-display-lg gradient-text mb-2 line-clamp-1">{userName}</div>
            <p className="text-body-md text-onSurfaceVariant max-w-md">
              {safeDistance < 30 ? t('dashboard.distanceWarning') : t('dashboard.optimalHealth')}
            </p>
          </div>
          
          {/* Webcam Preview feed */}
          <div className="relative w-32 h-24 rounded-xl overflow-hidden bg-surfaceContainerHigh border border-outlineVariant/20 shadow-ambient">
            <video ref={videoRef} style={{ display: 'none' }} playsInline></video>
            <canvas 
              ref={canvasRef} 
              className="object-cover w-full h-full no-color-transition" 
            />
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center bg-surfaceContainerHighest/80 text-label-sm text-onSurfaceVariant backdrop-blur-sm">
                Starting Camera
              </div>
            )}
            <div className="absolute top-1.5 right-1.5 flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-primary glow-primary-sm animate-gentle-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          index={0}
          title={t('dashboard.blinkRate')} 
          value={safeBlinkRate} 
          unit={t('dashboard.perMin')} 
          trend={safeBlinkRate < 10 ? t('dashboard.low') : t('dashboard.normal')}
          status={safeBlinkRate < 10 ? "warning" : "good"}
          icon={<Eye size={20} className={safeBlinkRate < 10 ? "text-tertiary" : "text-primary"} />}
        />
        
        <MetricCard 
          index={1}
          title={t('dashboard.screenTime')} 
          value={safeScreenTime} 
          unit={t('dashboard.mins')} 
          trend={t('dashboard.activeSession')}
          status="good"
        />
        
        <MetricCard 
          index={2}
          title={t('dashboard.screenDistance')} 
          value={safeDistance} 
          unit={t('dashboard.cm')} 
          trend={safeDistance < 30 ? t('dashboard.tooClose') : t('dashboard.optimal')}
          status={safeDistance < 30 ? "warning" : "good"}
          icon={<AlertCircle size={20} className={safeDistance < 30 ? "text-tertiary" : "text-primary"} />}
        />
      </section>

      {/* Expanded module */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 min-h-[300px] flex flex-col overflow-hidden">
          <h3 className="text-body-lg font-medium mb-2 text-onSurface">{t('dashboard.fatigueAnalysis')}</h3>
          <p className="text-sm text-onSurfaceVariant mb-4">{t('dashboard.estimatedStrain')}</p>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between mt-2 gap-4">
            <div className="relative w-48 h-[160px] min-h-[160px] flex-shrink-0 -mt-10">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={[
                      { name: t('dashboard.fatigueAnalysis'), value: fatigueScore },
                      { name: 'Remaining', value: 100 - fatigueScore }
                    ]}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={scoreColor} />
                    <Cell fill="rgb(var(--surface-container-highest))" />
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgb(var(--surface-container-high))', borderRadius: '8px', border: 'none', color: 'rgb(var(--on-surface))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <div className="flex items-center gap-1.5 translate-x-3">
                  <span className="text-3xl font-extrabold">{fatigueScore}</span>
                  {isAnyDanger && (
                    <AlertTriangle 
                      size={20} 
                      color={scoreColor} 
                      className="drop-shadow-md"
                    />
                  )}
                </div>
                <span className="text-xs text-onSurfaceVariant">{t('dashboard.score')}</span>
              </div>
            </div>

            <motion.div 
              className="flex-1 w-full h-[144px] min-h-[144px]"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart 
                  data={[
                    { name: t('dashboard.dist'), factor: 100 - distStrain, isDanger: isDistDanger, isSafe: isDistSafe },
                    { name: t('dashboard.blinks'), factor: 100 - blinksStrain, isDanger: isBlinksDanger, isSafe: isBlinksSafe },
                    { name: t('dashboard.time'), factor: timeStrain, isDanger: isTimeDanger, isSafe: isTimeSafe }
                  ]} 
                  layout="vertical" 
                  margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgb(var(--on-surface-variant))' }} />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgb(var(--surface-container-high))', borderRadius: '8px', border: 'none', color: 'rgb(var(--on-surface))' }}
                  />
                  <Bar dataKey="factor" radius={[0, 4, 4, 0]} barSize={14}>
                    {[
                      { name: t('dashboard.dist'), isDanger: isDistDanger, isSafe: isDistSafe },
                      { name: t('dashboard.blinks'), isDanger: isBlinksDanger, isSafe: isBlinksSafe },
                      { name: t('dashboard.time'), isDanger: isTimeDanger, isSafe: isTimeSafe }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isDanger ? 'rgb(var(--error))' : (!entry.isSafe ? 'rgb(var(--tertiary))' : 'rgb(var(--primary))')} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
        
        <div className="glass-card p-6 min-h-[300px] flex flex-col border-primary/15">
          <h3 className="text-body-lg font-medium mb-4 text-onSurface">{t('dashboard.upcomingReminders')}</h3>
          <div className="space-y-3">
            <ReminderCard time="14:30" label={t('dashboard.ruleBreak')} initialActive={true} />
            <ReminderCard time="16:00" label={t('dashboard.hydrationPause')} initialActive={false} />
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingsView({ isDarkMode, setIsDarkMode }) {
  const { t, i18n } = useTranslation();
  return (
    <div className="animate-fade-in max-w-2xl mx-auto mt-12">
      <div className="glass-card p-8">
        <div className="flex items-center gap-4 mb-6">
          <Settings size={28} className="text-primary" />
          <h2 className="text-headline-md text-onSurface">{t('settings.appSettings')}</h2>
        </div>

        <div className="space-y-6">
          {/* Theme Setting */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surfaceContainer/50 border border-outlineVariant/15">
            <div>
              <p className="text-body-md font-medium text-onSurface">{t('settings.appearance')}</p>
              <p className="text-label-md text-onSurfaceVariant">{t('settings.switchTheme')}</p>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative w-14 h-8 rounded-full cursor-pointer border-none transition-colors ${
                isDarkMode ? 'bg-primary' : 'bg-surfaceContainerHigh'
              }`}
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full bg-onPrimary shadow-sm transition-transform duration-300 ${
                isDarkMode ? 'left-7' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Calibration setting */}
          <div className="p-4 rounded-xl bg-surfaceContainer/50 border border-outlineVariant/15">
            <p className="text-body-md font-medium text-onSurface">{t('settings.calibration')}</p>
            <p className="text-label-md text-onSurfaceVariant">{t('settings.configureBaseline')}</p>
          </div>

          {/* Language Setting */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surfaceContainer/50 border border-outlineVariant/15">
            <div>
              <p className="text-body-md font-medium text-onSurface">{t('settings.languagePreferences')}</p>
              <p className="text-label-md text-onSurfaceVariant">{t('settings.selectLanguage')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => i18n.changeLanguage('en')}
                className={`px-4 py-2 rounded-lg text-label-md transition-colors ${
                  i18n.language === 'en' 
                    ? 'bg-primary text-onPrimary shadow-sm' 
                    : 'bg-surfaceContainerHigh text-onSurfaceVariant hover:bg-surfaceContainerHighest'
                }`}
              >
                {t('settings.english')}
              </button>
              <button
                onClick={() => i18n.changeLanguage('hi')}
                className={`px-4 py-2 rounded-lg text-label-md transition-colors ${
                  i18n.language === 'hi' 
                    ? 'bg-primary text-onPrimary shadow-sm' 
                    : 'bg-surfaceContainerHigh text-onSurfaceVariant hover:bg-surfaceContainerHighest'
                }`}
              >
                {t('settings.hindi')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------
// UTILITY COMPONENTS
// ---------------------------

function NavItem({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-none cursor-pointer ${
        active 
          ? 'bg-surfaceContainerHigh text-primary font-medium shadow-sm' 
          : 'text-onSurfaceVariant hover:bg-surfaceContainer bg-transparent hover:text-onSurface'
      }`}
    >
      {icon}
      <span className="hidden md:block">{label}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-primary ml-auto hidden md:block glow-primary-sm"></span>}
    </button>
  );
}

// Staggered durations so cards feel organic, not synchronised
const FLOAT_DURATIONS = [3.8, 4.4, 3.2];

function MetricCard({ index = 0, title, value, unit, trend, status, icon }) {
  return (
    <motion.div
      className="glass-card p-6 relative overflow-hidden group"
      whileHover={{ y: -6, borderColor: 'rgb(var(--primary) / 0.25)' }}
      transition={{
        duration: 0.3,
        ease: 'easeOut'
      }}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <h3 className="text-label-md text-onSurfaceVariant">{title}</h3>
        {icon}
      </div>
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-headline-lg tracking-tight text-onSurface">{value}</span>
        <span className="text-label-md text-onSurfaceVariant">{unit}</span>
      </div>
      <div className={`mt-2 text-label-md relative z-10 ${status === 'good' ? 'text-primary' : 'text-tertiary'}`}>
        {trend}
      </div>
      {/* Decorative gradient blob based on state */}
      <div className={`absolute -right-12 -bottom-12 w-32 h-32 blur-[40px] opacity-15 rounded-full no-color-transition group-hover:scale-150 ${status === 'good' ? 'bg-primary' : 'bg-error'}`}></div>
    </motion.div>
  );
}

function ReminderCard({ time, label, initialActive }) {
  const [active, setActive] = React.useState(initialActive);
  
  const toggleReminder = () => {
    console.log(`Toggling reminder for ${label} to ${!active}`);
    setActive(!active);
  };

  return (
    <button 
      onClick={toggleReminder}
      className={`w-full p-4 rounded-xl border flex items-center gap-4 cursor-pointer text-left transition-colors ${
        active ? 'bg-surfaceContainer/50 border-primary/20 shadow-sm' : 'bg-surfaceContainerLow/50 border-transparent hover:bg-surfaceContainer/30'
      }`}
    >
      <div className={`font-semibold text-body-md ${active ? 'text-primary' : 'text-onSurfaceVariant'}`}>{time}</div>
      <div className="w-px h-8 bg-outlineVariant/40"></div>
      <div className={`flex-1 text-body-md ${active ? 'text-onSurface' : 'text-onSurfaceVariant'}`}>{label}</div>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-primary' : 'bg-surfaceContainerHighest'}`}>
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
    </button>
  );
}

export default App;