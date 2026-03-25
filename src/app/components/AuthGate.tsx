import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

interface AuthGateProps { children: React.ReactNode; onRole: (role: string, linkedPlayerId: string | null) => void; }

export function AuthGate({ children, onRole }: AuthGateProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [needsAgreement, setNeedsAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [noAccess, setNoAccess] = useState(false);

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

  const checkRole = async (userEmail: string) => {
    const { data: roleData } = await supabase.from('user_roles').select('*').eq('email', userEmail.toLowerCase()).single();
    if (!roleData) { setNoAccess(true); return; }
    const { data: agreement } = await supabase.from('user_agreements').select('*').eq('email', userEmail.toLowerCase()).limit(1);
    if (!agreement || agreement.length === 0) { setNeedsAgreement(true); setRole(roleData.role); return; }
    setRole(roleData.role);
    onRole(roleData.role, roleData.linked_player_id);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true); setError('');
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) setError(error.message);
    else setSent(true);
    setSending(false);
  };

  const handleAgree = async () => {
    if (!agreed) return;
    const userEmail = session?.user?.email || email;
    await supabase.from('user_agreements').insert([{ email: userEmail.toLowerCase(), agreement_version: '1.0' }]);
    setNeedsAgreement(false);
    const { data: roleData } = await supabase.from('user_roles').select('*').eq('email', userEmail.toLowerCase()).single();
    if (roleData) { setRole(roleData.role); onRole(roleData.role, roleData.linked_player_id); }
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
            This application ("Premier Select Performance System") is developed and maintained by PRIME-TIME Systems. By accessing this system, you agree to the following terms:<br /><br />
            <strong>1. Confidentiality:</strong> All player performance data, statistics, coaching observations, training plans, and related information contained within this system is confidential and proprietary to Premier Select and PRIME-TIME Systems.<br /><br />
            <strong>2. No Third-Party Sharing:</strong> PRIME-TIME Systems will not sell, distribute, or share any personal or performance data with third parties under any circumstances.<br /><br />
            <strong>3. Authorized Use Only:</strong> This system is intended solely for use by authorized coaches, staff, and parents/guardians of Premier Select players. Access credentials are non-transferable.<br /><br />
            <strong>4. No Redistribution:</strong> Users may not copy, screenshot, export, share, or distribute any data, reports, or AI-generated insights from this system without express written permission from PRIME-TIME Systems or Premier Select coaching staff.<br /><br />
            <strong>5. Data Collection:</strong> This system collects player performance metrics, game statistics, training data, and coach observations for the sole purpose of player development and team management.<br /><br />
            <strong>6. Parental Access:</strong> Parent/guardian accounts are limited to viewing their own child's performance data. Team-wide coaching data, observations, and strategic information are restricted to coaching staff.<br /><br />
            <strong>7. Data Retention:</strong> Performance data is retained for the duration of the player's participation with Premier Select and may be archived for historical reference.<br /><br />
            <strong>8. Built by PRIME-TIME Systems:</strong> This application and all intellectual property therein is owned by PRIME-TIME Systems. All rights reserved.<br /><br />
            By clicking "I Agree" below, you acknowledge that you have read, understood, and agree to abide by these terms.
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
        {!sent ? (
          <form onSubmit={handleSignIn}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required style={{ width: '100%', padding: '12px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }} />
            {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px' }}>{error}</p>}
            <button type="submit" disabled={sending} style={{ width: '100%', padding: '12px', background: '#38bdf8', color: '#0a0f1a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: sending ? 'not-allowed' : 'pointer' }}>{sending ? 'Sending...' : 'Send Magic Link'}</button>
          </form>
        ) : (
          <div>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><span style={{ fontSize: '24px' }}>✉️</span></div>
            <h3 style={{ fontSize: '16px', color: '#f1f5f9', marginBottom: '8px' }}>Check Your Email</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>We sent a login link to <strong style={{ color: '#e2e8f0' }}>{email}</strong></p>
            <button onClick={() => setSent(false)} style={{ padding: '8px 16px', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Try a different email</button>
          </div>
        )}
      </div>
    </div>
  );

  if (role) return <>{children}</>;
  return <div style={{ minHeight: '100vh', background: '#0a0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#94a3b8' }}>Loading role...</p></div>;
}
