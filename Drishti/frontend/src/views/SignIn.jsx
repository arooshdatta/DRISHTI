import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function SignIn({ onLogin, onSwitchMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(email.split('@')[0]);
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.');
      } else {
        setError(err.message || 'Failed to sign in.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      <main className="w-full max-w-[400px] z-10 flex-shrink-0">
        
        {/* Glassmorphism Card */}
        <div className="p-6 md:p-8 rounded-2xl" style={glassCard}>
          <header className="mb-6">
            <h2 className="text-xl font-bold text-white">Welcome Back</h2>
            <p className="text-sm text-white/50 mt-1">Sign in to your dashboard.</p>
          </header>

          {error && (
            <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-xl text-error text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}
          
          <form className="space-y-4" onSubmit={handleSubmit}>
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
              <div className="flex items-center justify-between px-1">
                <label className="text-sm font-semibold text-white/80" htmlFor="password">Password</label>
                <button type="button" className="text-xs text-primary font-medium hover:underline bg-transparent border-none cursor-pointer">Forgot?</button>
              </div>
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
                {isLoading ? 'Signing In...' : 'Sign In'}
                {!isLoading && <span className="material-symbols-outlined">login</span>}
              </button>
            </div>
          </form>
        </div>
        
        {/* Switch to Sign Up */}
        <div className="mt-6 text-center flex flex-col gap-4">
          <p className="text-sm text-white/50">
            New to Drishti? 
            <button type="button" onClick={onSwitchMode} className="text-primary font-bold hover:underline bg-transparent px-1 border-none cursor-pointer">Create Account</button>
          </p>
        </div>
      </main>
    </div>
  );
}
