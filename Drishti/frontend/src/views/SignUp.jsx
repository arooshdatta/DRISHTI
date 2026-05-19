import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function SignUp({ onLogin, onSwitchMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Initialize a blank user profile document
      await setDoc(doc(db, 'users', user.uid, 'clinicalProfile', 'latest'), {
        name: name,
        email: email,
        createdAt: new Date(),
      });
      
      // Redirect to main dashboard
      onLogin(name);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to create an account.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Shared inline styles for glassmorphism ── */
  const glassCard = {
    background: 'rgba(0, 0, 0, 0.40)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(78, 222, 163, 0.25)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(78,222,163,0.08)',
  };

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(78,222,163,0.15)',
  };

  return (
    <div
      className="text-onSurface min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-inter w-full"
      style={{ background: 'transparent' }}
    >
      {/* Main Container */}
      <main className="w-full max-w-[400px] z-10 flex-shrink-0">
        
        {/* Glassmorphism Card */}
        <div className="p-6 md:p-8 rounded-2xl" style={glassCard}>
          <header className="mb-6">
            <h2 className="text-xl font-bold text-white">Secure Sign Up</h2>
            <p className="text-sm text-white/50 mt-1">Start your journey to better vision.</p>
          </header>

          {error && (
            <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}
          
          <form className="space-y-3" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/80 block px-1" htmlFor="name">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors">person</span>
                </div>
                <input 
                  className="w-full h-14 rounded-xl pl-12 pr-4 text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary transition-all outline-none" 
                  style={inputStyle}
                  id="name" name="name" placeholder="e.g. Alex Rivera" type="text"
                  value={name} onChange={(e) => setName(e.target.value)} required
                />
              </div>
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/80 block px-1" htmlFor="email">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors">mail</span>
                </div>
                <input 
                  className="w-full h-14 rounded-xl pl-12 pr-4 text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary transition-all outline-none" 
                  style={inputStyle}
                  id="email" name="email" placeholder="name@example.com" type="email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white/80 block px-1" htmlFor="password">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-white/40 group-focus-within:text-primary transition-colors">lock</span>
                </div>
                <input 
                  className="w-full h-14 rounded-xl pl-12 pr-4 text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary transition-all outline-none" 
                  style={inputStyle}
                  id="password" name="password" placeholder="••••••••" type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
              </div>
            </div>
            
            {/* Submit */}
            <div className="pt-2">
              <button 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-onPrimary font-bold rounded-xl shadow-glow-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit" disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Sign Up'}
                {!isLoading && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </div>
          </form>
          
          <footer className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-white/40 leading-relaxed">
              By continuing, you agree to Drishti AI's 
              <a className="text-primary font-semibold hover:underline bg-transparent px-1" href="#/">Privacy Policy</a> and 
              <a className="text-primary font-semibold hover:underline bg-transparent px-1" href="#/">Terms of Service</a>.
            </p>
          </footer>
        </div>
        
        {/* Switch to Sign In */}
        <div className="mt-4 text-center flex flex-col gap-4">
          <p className="text-sm text-white/50">
            Already have an account? 
            <button type="button" onClick={onSwitchMode} className="text-primary font-bold hover:underline bg-transparent px-1 border-none cursor-pointer">Sign In</button>
          </p>
        </div>
      </main>
    </div>
  );
}
