import React, { useState, useRef, useEffect } from 'react';
import { useHealth } from '../contexts/HealthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Save, X, Send, User } from 'lucide-react';
import { updateClinicalProfile, subscribeToClinicalProfile } from '../services/dbServices';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function ProfileDashboard({ isOpen, onClose, userName }) {
  const { metrics, reminders, setReminders, historicalData } = useHealth();
  
  // Profile State
  const [profile, setProfile] = useState({
    name: userName || 'Guest User',
    age: '28',
    occupation: 'Software Engineer',
    avatarFile: null,
    avatarPreview: null
  });

  // Fetch live profile data from Firestore
  useEffect(() => {
    if (isOpen) {
      const unsubscribe = subscribeToClinicalProfile((data) => {
        if (data) {
          setProfile(prev => ({
            ...prev,
            name: data.name || prev.name,
            age: data.age || prev.age,
            occupation: data.occupation || prev.occupation,
            avatarPreview: data.avatarUrl || prev.avatarPreview
          }));
        }
      });
      return () => unsubscribe();
    }
  }, [isOpen]);

  // AI Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am your Drishti AI Assistant. I have access to your real-time eye strain metrics. How can I help you today?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfile({
        ...profile,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSaveProfile = async () => {
    const btn = document.getElementById('save-btn');
    if (btn) btn.innerText = 'Saving...';
    
    await updateClinicalProfile(profile);
    
    if (btn) {
      btn.innerText = 'Saved ✓';
      setTimeout(() => btn.innerText = 'Save Profile', 2000);
    }
  };

  const toggleReminder = (id) => {
    setReminders(reminders.map(rem => 
      rem.id === id ? { ...rem, active: !rem.active } : rem
    ));
  };

  // Gemini Flash Integration
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    // Context preparation for the prompt
    const fatigueScore = Math.min(100, Math.max(0, Math.round(100 - (metrics.blinkRate * 3) + (metrics.distance < 40 ? 20 : 0))));
    const systemContext = `You are Drishti, an empathetic eye-wellness AI. The user's current screen distance is ${metrics.distance}cm and their fatigue score is ${fatigueScore}. Base your advice on this. Name: ${profile.name}, Age: ${profile.age}, Occupation: ${profile.occupation}.`;

    try {
      console.log(`Sending to Gemini API`);
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        systemInstruction: systemContext 
      });

      // Construct a conversation history string for the prompt
      const conversationContext = messages
        .filter(m => m.role !== 'system')
        .map(m => `${m.role === 'model' ? 'Drishti' : 'User'}: ${m.text}`)
        .join('\n');
        
      const fullPrompt = `${conversationContext}\nUser: ${userMessage}\nDrishti:`;

      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      
      setMessages(prev => [...prev, { role: 'model', text: text }]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'I am sorry, I am having trouble connecting to the network. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Fallback to 7 days of realistic mock data if historicalData is empty
  const chartData = historicalData && historicalData.length > 0 ? historicalData.map(d => ({
    ...d,
    score: Number.isFinite(d.score) ? d.score : 80,
    blinkRate: Number.isFinite(d.blinkRate) ? d.blinkRate : 15,
    averageScreenDistance: Number.isFinite(d.averageScreenDistance) ? d.averageScreenDistance : 40
  })) : [
    { date: 'Mon', averageScreenDistance: 42, blinkRate: 15, score: 85 },
    { date: 'Tue', averageScreenDistance: 38, blinkRate: 12, score: 72 },
    { date: 'Wed', averageScreenDistance: 45, blinkRate: 16, score: 90 },
    { date: 'Thu', averageScreenDistance: 35, blinkRate: 10, score: 65 },
    { date: 'Fri', averageScreenDistance: 40, blinkRate: 14, score: 80 },
    { date: 'Sat', averageScreenDistance: 48, blinkRate: 18, score: 95 },
    { date: 'Sun', averageScreenDistance: 44, blinkRate: 15, score: 88 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-surface border-l border-outlineVariant/20 z-50 overflow-y-auto flex flex-col shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-outlineVariant/10 sticky top-0 bg-surface/80 backdrop-blur-md z-10">
              <h2 className="text-xl font-bold text-onSurface">Profile Dashboard</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surfaceContainerHigh text-onSurfaceVariant transition-colors border-none bg-transparent cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              
              {/* Profile Header & Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-surfaceContainerHighest border border-outlineVariant/20 flex items-center justify-center overflow-hidden">
                    {profile.avatarPreview ? (
                      <img src={profile.avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={32} className="text-onSurfaceVariant" />
                    )}
                  </div>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-primary/90 transition-transform hover:scale-105">
                    <Camera size={14} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-onSurface">{profile.name}</h3>
                  <p className="text-sm text-primary font-medium">{profile.occupation}</p>
                </div>
              </div>

              {/* Personal Info Form */}
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-onSurface uppercase tracking-wider">Personal Info</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-onSurfaceVariant font-medium px-1">Name</label>
                    <input 
                      type="text" name="name" value={profile.name} onChange={handleProfileChange}
                      className="w-full bg-surfaceContainerLow border border-outlineVariant/20 rounded-xl px-4 py-2 text-sm text-onSurface outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-onSurfaceVariant font-medium px-1">Age</label>
                    <input 
                      type="number" name="age" value={profile.age} onChange={handleProfileChange}
                      className="w-full bg-surfaceContainerLow border border-outlineVariant/20 rounded-xl px-4 py-2 text-sm text-onSurface outline-none focus:border-primary"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-xs text-onSurfaceVariant font-medium px-1">Occupation</label>
                    <input 
                      type="text" name="occupation" value={profile.occupation} onChange={handleProfileChange}
                      className="w-full bg-surfaceContainerLow border border-outlineVariant/20 rounded-xl px-4 py-2 text-sm text-onSurface outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <button id="save-btn" onClick={handleSaveProfile} className="w-full py-2.5 bg-surfaceContainerHigh hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold rounded-xl border-none cursor-pointer flex justify-center items-center gap-2">
                  <Save size={16} /> Save Profile
                </button>
              </section>

              {/* Elegant Info Bar Graph */}
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-onSurface uppercase tracking-wider">Weekly Wellness Score</h4>
                <div className="h-[160px] min-h-[160px] w-full bg-surfaceContainerLow rounded-xl p-4 border border-outlineVariant/10">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(var(--outline-variant) / 0.1)" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgb(var(--on-surface-variant))' }} />
                      <YAxis hide />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'rgb(var(--surface-container-highest))', borderRadius: '8px', border: 'none' }} />
                      <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Reminders Management */}
              <section className="space-y-4">
                <h4 className="text-sm font-bold text-onSurface uppercase tracking-wider">Active Reminders</h4>
                <div className="space-y-2">
                  {reminders.map(rem => (
                    <div key={rem.id} className="flex items-center justify-between p-3 rounded-xl bg-surfaceContainerLow border border-outlineVariant/10">
                      <div>
                        <p className="text-sm font-semibold text-onSurface">{rem.label}</p>
                        <p className="text-xs text-onSurfaceVariant">Every {rem.intervalMins} mins</p>
                      </div>
                      <button 
                        onClick={() => toggleReminder(rem.id)}
                        className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer border-none ${rem.active ? 'bg-primary' : 'bg-surfaceContainerHighest'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${rem.active ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Gemini AI Assistant */}
              <section className="space-y-4 pt-4 border-t border-outlineVariant/10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <h4 className="text-sm font-bold text-onSurface uppercase tracking-wider">Drishti AI Assistant</h4>
                </div>
                
                <div className="h-64 flex flex-col bg-surfaceContainerLow rounded-xl border border-outlineVariant/20 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' ? 'bg-primary text-onPrimary rounded-br-sm' : 'bg-surfaceContainerHighest text-onSurface rounded-bl-sm'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-surfaceContainerHighest px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-onSurfaceVariant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-onSurfaceVariant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-onSurfaceVariant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  
                  <form onSubmit={handleSendMessage} className="p-2 bg-surfaceContainer relative">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask AI Assistant about your eye health..." 
                      className="w-full bg-surfaceContainerHighest border border-outlineVariant/10 rounded-xl pl-3 pr-10 py-2.5 text-sm text-onSurface outline-none focus:border-primary transition-colors"
                    />
                    <button type="submit" disabled={!chatInput.trim() || isTyping} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
