import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface AuthGateProps { children: React.ReactNode; onRole: (role: string, linkedPlayerId: string | null, email?: string) => void; }

export function AuthGate({ children, onRole }: AuthGateProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [needsAgreement, setNeedsAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [noAccess, setNoAccess] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [signUpRole, setSignUpRole] = useState('parent');
  const [signUpName, setSignUpName] = useState('');
  const [signUpPlayerId, setSignUpPlayerId] = useState('');
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) checkRole(session.user.email || '');
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) checkRole(session.user.email || '');
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkRole = async (userEmail: string, retries = 0) => {
    const { data: roleData } = await supabase.from('user_roles').select('*').eq('email', userEmail.toLowerCase()).single();
    if (!roleData) {
      if (retries < 3) { await new Promise(r => setTimeout(r, 1500)); return checkRole(userEmail, retries + 1); }
      setNoAccess(true); return;
    }
    const { data: agreement } = await supabase.from('user_agreements').select('*').eq('email', userEmail.toLowerCase()).limit(1);
    if (!agreement || agreement.length === 0) { setNeedsAgreement(true); setRole(roleData.role); return; }
    setRole(roleData.role);
    onRole(roleData.role, roleData.linked_player_id, userEmail);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('Invalid login')) setError('Invalid email or password.');
      else setError(error.message);
    }
    setSending(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    if (error) setError(error.message);
    else setResetSent(true);
    setSending(false);
  };

  const handleAgree = async () => {
    if (!agreed) return;
    const userEmail = session?.user?.email || email;
    await supabase.from('user_agreements').insert([{ email: userEmail.toLowerCase(), agreement_version: '1.0' }]);
    setNeedsAgreement(false);
    const { data: roleData } = await supabase.from('user_roles').select('*').eq('email', userEmail.toLowerCase()).single();
    if (roleData) { setRole(roleData.role); onRole(roleData.role, roleData.linked_player_id, roleData.email); }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null); setRole(null); setNeedsAgreement(false); setNoAccess(false);
  };

  if (loading) return <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#94a3b8', fontSize: '14px' }}>Loading...</p></div>;

  if (noAccess) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '48px', maxWidth: '400px', width: '100%', margin: '0 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Premier Select</p>
        <h2 style={{ fontSize: '18px', color: '#f1f5f9', marginBottom: '16px' }}>Access Denied</h2>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px' }}>Your email is not authorized. Contact your coach to request access.</p>
        <button onClick={handleSignOut} style={{ padding: '10px 24px', background: '#334155', color: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Sign Out</button>
      </div>
    </div>
  );

  if (needsAgreement) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '32px', maxWidth: '600px', width: '100%', margin: '0 16px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Premier Select Performance System</p>
        <h2 style={{ fontSize: '18px', color: '#f1f5f9', marginBottom: '24px', textAlign: 'center' }}>Data Use Agreement</h2>
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '8px', marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
          <p style={{ fontSize: '11px', color: '#e2e8f0', lineHeight: '1.8' }}>
            <strong style={{ color: '#38bdf8' }}>PRIME-TIME Systems - Data Use & Privacy Policy</strong><br /><br />
            This application is developed and maintained by PRIME-TIME Systems. By accessing this system, you agree to the following:<br /><br />
            <strong>1. Confidentiality:</strong> All player performance data, statistics, coaching observations, training plans, and related information is confidential and proprietary to Premier Select and PRIME-TIME Systems.<br /><br />
            <strong>2. No Third-Party Sharing:</strong> PRIME-TIME Systems will not sell, distribute, or share any personal or performance data with third parties.<br /><br />
            <strong>3. Authorized Use Only:</strong> This system is solely for authorized coaches, staff, and parents/guardians of Premier Select players. Credentials are non-transferable.<br /><br />
            <strong>4. No Redistribution:</strong> Users may not copy, screenshot, export, share, or distribute any data, reports, or AI-generated insights without express written permission.<br /><br />
            <strong>5. Data Collection:</strong> This system collects player performance metrics, game statistics, training data, and coach observations for player development and team management.<br /><br />
            <strong>6. Parental Access:</strong> Parent/guardian accounts are limited to viewing their own child's performance data. Team-wide coaching data is restricted to coaching staff.<br /><br />
            <strong>7. Data Retention:</strong> Data is retained for the duration of participation and may be archived for historical reference.<br /><br />
            <strong>8. Built by PRIME-TIME Systems:</strong> This application and all intellectual property is owned by PRIME-TIME Systems. All rights reserved.
          </p>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', cursor: 'pointer' }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#38bdf8' }} />
          <span style={{ fontSize: '12px', color: '#e2e8f0' }}>I have read and agree to the Data Use Agreement</span>
        </label>
        <button onClick={handleAgree} disabled={!agreed} style={{ width: '100%', padding: '12px', background: agreed ? '#38bdf8' : '#334155', color: agreed ? '#0a0f1a' : '#64748b', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: agreed ? 'pointer' : 'not-allowed' }}>I Agree - Continue</button>
      </div>
    </div>
  );

  if (!session) return (
    <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, sans-serif' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '48px', maxWidth: '400px', width: '100%', margin: '0 16px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '8px' }}>Youth Performance Tracking System</p>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#f1f5f9', marginBottom: '8px' }}>PREMIER SELECT</h1>
        <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '32px' }}>Built by PRIME-TIME Systems</p>
        {isSignUpMode ? (
          signUpSuccess ? (
            <div>
              <p style={{ fontSize: '14px', color: '#10b981', marginBottom: '16px' }}>Account created!</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>You can now sign in with your email and password.</p>
              <button onClick={() => { setIsSignUpMode(false); setSignUpSuccess(false); }} style={{ width: '100%', padding: '12px', background: '#38bdf8', color: '#0a0f1a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>Go to Login</button>
            </div>
          ) : (
            <form onSubmit={async (e) => { e.preventDefault(); setSending(true); setError('');
              const { error: err } = await supabase.auth.signUp({ email, password });
              if (err) { setError(err.message); setSending(false); return; }
              const { data: existingRole } = await supabase.from('user_roles').select('id').eq('email', email.toLowerCase()).single();
              if (!existingRole) {
                await supabase.from('user_roles').insert([{ email: email.toLowerCase(), role: signUpRole === 'fan' ? 'parent' : 'parent', display_name: signUpName || email.split('@')[0] }]);
              }
              if (signUpRole !== 'fan' && signUpPlayerId) {
                await supabase.from('parent_player_links').insert([{ parent_email: email.toLowerCase(), player_id: signUpPlayerId, relationship: signUpRole }]).select();
              }
              setSignUpSuccess(true); setSending(false); }}>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px', textAlign: 'left' }}>Create your account to view player stats.</p>
              <input type='text' value={signUpName} onChange={(e) => setSignUpName(e.target.value)} placeholder='Your name' required style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }} />
              <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email address' required style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }} />
              <select value={signUpRole} onChange={(e) => { setSignUpRole(e.target.value); if (e.target.value === 'fan') setSignUpPlayerId(''); }} onFocus={loadPlayers} style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}>
                <option value='parent'>Parent / Guardian</option>
                <option value='family'>Family Member</option>
                <option value='fan'>Fan</option>
              </select>
              {signUpRole !== 'fan' && (
                <select value={signUpPlayerId} onChange={(e) => setSignUpPlayerId(e.target.value)} onFocus={loadPlayers} required style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value=''>Select your player...</option>
                  {allPlayers.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              )}
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Choose a password' required style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }} />
              {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
              <button type='submit' disabled={sending} style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: sending ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>{sending ? 'Creating...' : 'Create Account'}</button>
              <button type='button' onClick={() => setIsSignUpMode(false)} style={{ width: '100%', padding: '8px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Back to Login</button>
            </form>
          )
        ) : isResetMode ? (
          resetSent ? (
            <div>
              <p style={{ fontSize: '14px', color: '#10b981', marginBottom: '16px' }}>Password reset email sent!</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Check your inbox for a link to set your password.</p>
              <button onClick={() => { setIsResetMode(false); setResetSent(false); }} style={{ padding: '8px 16px', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Back to Login</button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword}>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px', textAlign: 'left' }}>Enter your email to receive a password reset link.</p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }} />
              {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
              <button type="submit" disabled={sending} style={{ width: '100%', padding: '12px', background: '#38bdf8', color: '#0a0f1a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: sending ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>{sending ? 'Sending...' : 'Send Reset Link'}</button>
              <button type="button" onClick={() => setIsResetMode(false)} style={{ width: '100%', padding: '8px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>Back to Login</button>
            </form>
          )
        ) : (
          <form onSubmit={handleSignIn}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }} />
            {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
            <button type="submit" disabled={sending} style={{ width: '100%', padding: '12px', background: '#38bdf8', color: '#0a0f1a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: sending ? 'not-allowed' : 'pointer', marginBottom: '12px' }}>{sending ? 'Signing in...' : 'Sign In'}</button>
            <button type="button" onClick={() => setIsResetMode(true)} style={{ width: '100%', padding: '8px', background: 'transparent', color: '#64748b', border: 'none', fontSize: '12px', cursor: 'pointer' }}>Forgot password?</button>
            <button type="button" onClick={() => setIsSignUpMode(true)} style={{ width: '100%', padding: '8px', background: 'transparent', color: '#38bdf8', border: 'none', fontSize: '12px', cursor: 'pointer', marginTop: '4px' }}>First time? Create Account</button>
          </form>
        )}
      </div>
    </div>
  );

  if (role) return <>{children}</>;
  return <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#94a3b8' }}>Loading...</p></div>;
}






