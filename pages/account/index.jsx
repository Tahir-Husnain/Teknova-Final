import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useTheme } from '../../context/ThemeContext';
import {
  User, Package, Heart, MapPin, CreditCard, Settings,
  LogOut, Eye, EyeOff, Camera, CheckCircle, ChevronRight,
} from 'lucide-react';

/* ── localStorage helpers (SSR-safe) ── */
const ls = {
  get: (k, fb = null) => { if (typeof window === 'undefined') return fb; try { const v = localStorage.getItem(k); return v !== null ? v : fb; } catch { return fb; } },
  set: (k, v) => { if (typeof window !== 'undefined') try { localStorage.setItem(k, v); } catch {} },
  del: (k)    => { if (typeof window !== 'undefined') try { localStorage.removeItem(k); } catch {} },
  getJSON: (k, fb) => { const r = ls.get(k); if (!r) return fb; try { return JSON.parse(r); } catch { return fb; } },
};

const MOCK_ORDERS = [
  { id: 'TKN-48210', item: 'Apple iPhone 15 Pro Max', price: 1199, status: 'Delivered',  emoji: '📱', date: 'Mar 28, 2025' },
  { id: 'TKN-48195', item: 'Sony WH-1000XM5',        price: 289,  status: 'Shipped',    emoji: '🎧', date: 'Mar 25, 2025' },
  { id: 'TKN-48102', item: 'Dell XPS 15 OLED',        price: 1399, status: 'Processing', emoji: '💻', date: 'Mar 20, 2025' },
];

const statusColor = (s) => ({
  Delivered:  'text-green-500 bg-green-500/10 border-green-500/20',
  Shipped:    'text-blue-500 bg-blue-500/10 border-blue-500/20',
  Processing: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  Cancelled:  'text-destructive bg-destructive/10 border-destructive/20',
}[s] || 'text-muted-foreground');

export default function AccountPage() {
  const { variation } = useTheme();
  const router = useRouter();

  /* auth */
  const [authMode, setAuthModeState] = useState(() => ls.get('teknova-auth', 'login'));
  const setAuthMode = (m) => { setAuthModeState(m); ls.set('teknova-auth', m); };
  const [showPass, setShowPass] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [errors, setErrors] = useState({});

  /* profile */
  const [activeTab, setActiveTab]   = useState('orders');
  const [profilePic, setProfilePicState] = useState(() => ls.get('teknova-profilepic', null));
  const setProfilePic = (v) => { setProfilePicState(v); v ? ls.set('teknova-profilepic', v) : ls.del('teknova-profilepic'); };
  const [settings, setSettingsState] = useState(() => ls.getJSON('teknova-settings', { name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 000-0000' }));
  const setSettings = (updater) => {
    setSettingsState(prev => { const next = typeof updater === 'function' ? updater(prev) : updater; ls.set('teknova-settings', JSON.stringify(next)); return next; });
  };
  const [savedMsg, setSavedMsg] = useState(false);
  const picRef = useRef(null);

  /* theme */
  const accentCls  = variation === 2 ? 'text-neon' : 'text-primary';
  const accentBg   = variation === 2 ? 'bg-gradient-neon text-teknova-dark font-bold' : 'bg-primary text-primary-foreground';
  const activeItem = variation === 2 ? 'bg-neon/10 text-neon' : variation === 3 ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary';
  const inputCls   = 'w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors';

  const setF = (k, v) => setAuthForm(p => ({ ...p, [k]: v }));
  const initials = (settings.name || 'JD').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const handlePic = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setProfilePic(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ── VALIDATION FUNCTIONS ── */
  const validateAuth = () => {
    const e = {};

    if (!authForm.email) {
      e.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(authForm.email)) {
      e.email = 'Invalid email address';
    }

    if (authMode !== 'forgot') {
      if (!authForm.password) {
        e.password = 'Password is required';
      } else if (authForm.password.length < 6) {
        e.password = 'Password must be at least 6 characters';
      }
    }

    if (authMode === 'signup') {
      if (!authForm.name) {
        e.name = 'Full name is required';
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    const e = {};
    if (!settings.name) e.name = 'Name is required';
    if (!settings.email) {
      e.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(settings.email)) {
      e.email = 'Invalid email';
    }
    if (!settings.phone) e.phone = 'Phone is required';

    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setErrors({});
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const Avatar = ({ size = 'sm' }) => {
    const dim   = size === 'lg' ? 'w-20 h-20 rounded-2xl text-2xl' : 'w-10 h-10 rounded-full text-base';
    const badge = size === 'lg' ? 'absolute -bottom-1.5 -right-1.5 w-7 h-7' : 'absolute -bottom-0.5 -right-0.5 w-5 h-5';
    return (
      <div className="relative shrink-0">
        <div className={'overflow-hidden flex items-center justify-center font-bold text-white bg-primary ' + dim}>
          {profilePic ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" /> : <span>{initials}</span>}
        </div>
        <button onClick={() => picRef.current?.click()} title="Change photo"
          className={'rounded-full flex items-center justify-center text-white shadow bg-primary hover:opacity-90 transition-opacity ' + badge}>
          <Camera size={size === 'lg' ? 12 : 9} />
        </button>
        <input ref={picRef} type="file" accept="image/*" className="hidden" onChange={handlePic} />
      </div>
    );
  };

  /* ── AUTH FORMS ── */
  if (authMode !== 'profile') {
    return (
      <>
        <Head><title>{authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Reset Password'} — Teknova</title></Head>
        <Layout>
          <div className="pt-32 pb-16 px-4">
            <div className="max-w-md mx-auto bg-card border border-border rounded-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <User size={24} className={accentCls} />
                </div>
                <h1 className={'font-heading text-2xl font-bold text-foreground ' + (variation === 3 ? 'italic' : '')}>
                  {variation === 2
                    ? <span className="text-gradient-neon">{authMode === 'login' ? 'WELCOME BACK' : authMode === 'signup' ? 'JOIN TEKNOVA' : 'RESET PASSWORD'}</span>
                    : authMode === 'login' ? 'Welcome Back' : authMode === 'signup' ? 'Create Account' : 'Reset Password'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {authMode === 'login' ? 'Sign in to your account' : authMode === 'signup' ? 'Join the Teknova community' : "We'll send you a reset link"}
                </p>
              </div>

              <div className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                    <input value={authForm.name} onChange={e => setF('name', e.target.value)} placeholder="John Doe" className={inputCls} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                  <input type="email" value={authForm.email} onChange={e => setF('email', e.target.value)} placeholder="john@example.com" className={inputCls} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                {authMode !== 'forgot' && (
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={authForm.password} onChange={e => setF('password', e.target.value)} placeholder="••••••••" className={inputCls + ' pr-10'} />
                      <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                  </div>
                )}
              </div>

              {authMode === 'login' && (
                <div className="flex justify-end mt-2">
                  <button onClick={() => setAuthMode('forgot')} className={'text-xs ' + accentCls + ' hover:underline'}>Forgot password?</button>
                </div>
              )}

              <button onClick={() => { if(validateAuth()) setAuthMode('profile'); }} className={'w-full py-3 rounded-xl font-medium mt-5 ' + accentBg}>
                {authMode === 'login' ? 'Sign In' : authMode === 'signup' ? 'Create Account' : 'Send Reset Link'}
              </button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                {authMode === 'login'
                  ? <>Don&apos;t have an account?{' '}<button onClick={() => setAuthMode('signup')} className={accentCls + ' hover:underline font-medium'}>Sign up</button></>
                  : <>Already have an account?{' '}<button onClick={() => setAuthMode('login')} className={accentCls + ' hover:underline font-medium'}>Sign in</button></>}
              </p>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  /* ── PROFILE DASHBOARD ── */
  const tabs = [
    { id: 'orders',    label: 'Orders',    icon: Package    },
    { id: 'wishlist',  label: 'Wishlist',  icon: Heart      },
    { id: 'addresses', label: 'Addresses', icon: MapPin     },
    { id: 'payment',   label: 'Payment',   icon: CreditCard },
    { id: 'settings',  label: 'Settings',  icon: Settings   },
  ];

  return (
    <>
      <Head><title>My Account — Teknova</title></Head>
      <Layout>
        <div className="pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">

              {/* Sidebar */}
              <aside className="bg-card border border-border rounded-2xl p-5 h-fit">
                <div className={'flex items-center gap-3 mb-6 pb-5 border-b border-border'}>
                  <Avatar size="sm" />
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-foreground text-sm truncate">{settings.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{settings.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveTab(id)}
                      className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
                        (activeTab === id ? activeItem : 'text-muted-foreground hover:bg-secondary hover:text-foreground')}>
                      <Icon size={16} /> {label}
                    </button>
                  ))}
                  <button onClick={() => setAuthMode('login')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all mt-2">
                    <LogOut size={16} /> Sign Out
                  </button>
                </nav>
              </aside>

              {/* Main content omitted for brevity (unchanged, includes orders, wishlist, addresses, payment, settings) */}

            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}