import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      navbar: {
        dashboard: "Dashboard",
        virtualMirror: "Virtual Mirror",
        eyeCareCenters: "Eye Care Centers",
        eyeFacts: "Eye Facts",
        clinicalInfo: "Clinical Info",
        profile: "Profile",
        settings: "Settings",
        logout: "Logout",
        language: "Language"
      },
      dashboard: {
        welcomeBack: "Welcome back,",
        distanceWarning: "You are sitting very close to the screen. Please move back.",
        optimalHealth: "Your eye health is looking optimal today. Remember to take a break in 15 minutes.",
        blinkRate: "Blink Rate",
        perMin: " / min",
        low: "Low",
        normal: "Normal",
        screenTime: "Screen Time",
        mins: " min",
        activeSession: "Active Session",
        screenDistance: "Screen Distance",
        cm: " cm",
        tooClose: "Too Close",
        optimal: "Optimal",
        fatigueAnalysis: "Fatigue Analysis",
        estimatedStrain: "Estimated strain index & contributing factors",
        score: "Score",
        upcomingReminders: "Upcoming Reminders",
        ruleBreak: "20-20-20 Rule Break",
        hydrationPause: "Hydration Pause",
        dist: "Dist.",
        blinks: "Blinks",
        time: "Time"
      },
      settings: {
        appSettings: "App Settings",
        appearance: "Appearance",
        switchTheme: "Switch between light and dark mode",
        calibration: "Calibration",
        configureBaseline: "Configure baseline tracking limits and distance thresholds.",
        languagePreferences: "Language Preferences",
        selectLanguage: "Select your preferred language",
        english: "English",
        hindi: "हिन्दी (Hindi)"
      },
      virtualMirror: {
        title: "Virtual Mirror",
        selectFrame: "Select Frame Collection",
        subtitle: "AR Glasses Try-On Experience",
        scanningPD: "Scanning PD...",
        initializingOptics: "INITIALIZING OPTICS..."
      },
      eyeCareCenters: {
        title: "Nearby Eye Care Centers",
        subtitle: "Showing centers within 10km radius",
        liveLocation: "(Live location active)",
        locating: "Locating clinics...",
        navigate: "Navigate on Maps",
        openNow: "Open now",
        closed: "Closed",
        temporarilyClosed: "Temporarily closed",
        permanentlyClosed: "Permanently closed",
        hoursNotAvailable: "Hours not available"
      },
      clinicalInsights: {
        performanceAnalysis: "Performance Analysis",
        title: "Clinical Insights",
        description: "Your digital wellness metrics are synthesized from real-time monitoring to provide actionable ocular health scores.",
        screenTimeBreaks: "Screen Time & Breaks",
        dailyCorrelation: "Daily correlation between activity and rest",
        screen: "Screen",
        breaks: "Breaks",
        fatigueLevels: "Fatigue Levels",
        estimatedStrain: "Estimated strain index based on blinking",
        currentIndex: "Current Index",
        highStrain: "High/Strain",
        moderate: "Moderate",
        warningDistance: "Warning: You are situated dangerously close to your monitor.",
        fatiguePeaks: "Fatigue usually peaks at 3:00 PM. Schedule a mandatory 5-min walk-away then.",
        screenDist: "Screen Dist.",
        activeTime: "Active Time",
        blinkRateAnalysis: "rPPG / Heart Rate BPM",
        avgBlinks: "Simulated blood flow pulse rate",
        liveBpm: "Live BPM",
        optimal: "Optimal",
        low: "Low",
        healthStatus: "Health Status",
        vsGoal: "Vs Goal",
        aiAdvisory: "AI Clinical Advisory",
        habitIncentive: "Habit Incentive: The 20-20-20 Ritual",
        habitDescription1: "Your real-time camera data indicates active working blocks of ",
        habitDescription2: " minutes. To maintain your ",
        habitDescription3: " BPM blink rate, look at an object 20 feet away for 20 seconds.",
        applyHabit: "Apply Habit Suggestion",
        habitApplied: "Habit Applied ✓"
      },
      eyeFacts: {
        eyeCatching: "Eye-Catching ",
        facts: "Facts",
        exploreKnowledge: "Explore essential knowledge and articles to maintain optimal screen health and daily habits.",
        readMore: "Read more"
      }
    }
  },
  hi: {
    translation: {
      navbar: {
        dashboard: "डैशबोर्ड",
        virtualMirror: "वर्चुअल मिरर",
        eyeCareCenters: "नेत्र देखभाल केंद्र",
        eyeFacts: "नेत्र तथ्य",
        clinicalInfo: "नैदानिक जानकारी",
        profile: "प्रोफ़ाइल",
        settings: "सेटिंग्स",
        logout: "लॉग आउट",
        language: "भाषा"
      },
      dashboard: {
        welcomeBack: "वापसी पर स्वागत है,",
        distanceWarning: "आप स्क्रीन के बहुत करीब बैठे हैं। कृपया पीछे हटें।",
        optimalHealth: "आज आपके आँखों का स्वास्थ्य इष्टतम दिख रहा है। 15 मिनट में ब्रेक लेना न भूलें।",
        blinkRate: "पलक झपकने की दर",
        perMin: " / मिनट",
        low: "कम",
        normal: "सामान्य",
        screenTime: "स्क्रीन समय",
        mins: " मिनट",
        activeSession: "सक्रिय सत्र",
        screenDistance: "स्क्रीन दूरी",
        cm: " सेमी",
        tooClose: "बहुत करीब",
        optimal: "इष्टतम",
        fatigueAnalysis: "थकान विश्लेषण",
        estimatedStrain: "अनुमानित तनाव सूचकांक और योगदान कारक",
        score: "स्कोर",
        upcomingReminders: "आगामी अनुस्मारक",
        ruleBreak: "20-20-20 नियम ब्रेक",
        hydrationPause: "हाइड्रेशन ब्रेक",
        dist: "दूरी",
        blinks: "पलकें",
        time: "समय"
      },
      settings: {
        appSettings: "ऐप सेटिंग्स",
        appearance: "दिखावट",
        switchTheme: "लाइट और डार्क मोड के बीच स्विच करें",
        calibration: "अंशांकन",
        configureBaseline: "बेसलाइन ट्रैकिंग सीमा और दूरी सीमा कॉन्फ़िगर करें।",
        languagePreferences: "भाषा प्राथमिकताएं",
        selectLanguage: "अपनी पसंदीदा भाषा चुनें",
        english: "English",
        hindi: "हिन्दी (Hindi)"
      },
      virtualMirror: {
        title: "वर्चुअल मिरर",
        selectFrame: "फ्रेम संग्रह चुनें",
        subtitle: "एआर चश्मा ट्राई-ऑन अनुभव",
        scanningPD: "पीडी स्कैन किया जा रहा है...",
        initializingOptics: "ऑप्टिक्स आरंभ किया जा रहा है..."
      },
      eyeCareCenters: {
        title: "आसपास के नेत्र देखभाल केंद्र",
        subtitle: "10 किमी के दायरे में केंद्र दिखा रहे हैं",
        liveLocation: "(लाइव स्थान सक्रिय)",
        locating: "क्लीनिक खोज रहे हैं...",
        navigate: "मैप्स पर नेविगेट करें",
        openNow: "अभी खुला है",
        closed: "बंद है",
        temporarilyClosed: "अस्थायी रूप से बंद है",
        permanentlyClosed: "स्थायी रूप से बंद है",
        hoursNotAvailable: "समय उपलब्ध नहीं है"
      },
      clinicalInsights: {
        performanceAnalysis: "प्रदर्शन विश्लेषण",
        title: "नैदानिक जानकारी",
        description: "आपके डिजिटल वेलनेस मेट्रिक्स वास्तविक समय की निगरानी से तैयार किए गए हैं ताकि कार्रवाई योग्य नेत्र स्वास्थ्य स्कोर प्रदान किए जा सकें।",
        screenTimeBreaks: "स्क्रीन समय और ब्रेक",
        dailyCorrelation: "गतिविधि और आराम के बीच दैनिक संबंध",
        screen: "स्क्रीन",
        breaks: "ब्रेक",
        fatigueLevels: "थकान का स्तर",
        estimatedStrain: "पलक झपकने के आधार पर अनुमानित तनाव सूचकांक",
        currentIndex: "वर्तमान सूचकांक",
        highStrain: "उच्च/तनाव",
        moderate: "मध्यम",
        warningDistance: "चेतावनी: आप अपने मॉनिटर के खतरनाक रूप से करीब स्थित हैं।",
        fatiguePeaks: "थकान आमतौर पर दोपहर 3:00 बजे चरम पर होती है। तब अनिवार्य रूप से 5 मिनट टहलने का कार्यक्रम बनाएं।",
        screenDist: "स्क्रीन दूरी",
        activeTime: "सक्रिय समय",
        blinkRateAnalysis: "rPPG / हृदय गति BPM",
        avgBlinks: "सिम्युलेटेड रक्त प्रवाह पल्स दर",
        liveBpm: "लाइव BPM",
        optimal: "इष्टतम",
        low: "कम",
        healthStatus: "स्वास्थ्य स्थिति",
        vsGoal: "बनाम लक्ष्य",
        aiAdvisory: "एआई नैदानिक सलाह",
        habitIncentive: "आदत प्रोत्साहन: 20-20-20 अनुष्ठान",
        habitDescription1: "आपका वास्तविक समय कैमरा डेटा ",
        habitDescription2: " मिनट के सक्रिय कार्य ब्लॉक को इंगित करता है। अपनी ",
        habitDescription3: " BPM पलक झपकने की दर को बनाए रखने के लिए, 20 सेकंड के लिए 20 फीट दूर किसी वस्तु को देखें।",
        applyHabit: "आदत सुझाव लागू करें",
        habitApplied: "आदत लागू ✓"
      },
      eyeFacts: {
        eyeCatching: "आकर्षक ",
        facts: "तथ्य",
        exploreKnowledge: "इष्टतम स्क्रीन स्वास्थ्य और दैनिक आदतों को बनाए रखने के लिए आवश्यक ज्ञान और लेखों का अन्वेषण करें।",
        readMore: "और पढ़ें"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
