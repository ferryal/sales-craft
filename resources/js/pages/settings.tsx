import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/widgets/AppLayout/AppLayout';
import Icon from '@/shared/icons/Icon';

const TONES = [
    { id: 'professional', label: 'Professional', color: '#A3E635', bg: '#1A2E05' },
    { id: 'casual',       label: 'Casual',       color: '#38BDF8', bg: '#0C2233' },
    { id: 'aggressive',   label: 'Aggressive',   color: '#EF4444', bg: '#2D0C0C' },
    { id: 'luxury',       label: 'Luxury',       color: '#E2C87A', bg: '#2A2008' },
];

const PLANS = [
    { name: 'Pro',  price: '$49',  desc: 'For serious builders', features: ['Unlimited pages', 'GPT-4o model', 'Export HTML', 'Priority support'] },
    { name: 'Team', price: '$149', desc: 'For growing teams',    features: ['Everything in Pro', 'Up to 5 seats', 'Analytics', 'Custom domain'] },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ fontSize: 11, color: '#A3E635', textTransform: 'uppercase' as const, letterSpacing: '0.1em', fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 2, height: 14, background: '#A3E635', borderRadius: 1 }} />
            {children}
        </div>
    );
}

function DarkInput({ label, value, onChange, placeholder, type = 'text', hint }: {
    label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string; type?: string; hint?: string;
}) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={{ display: 'block', fontSize: 11, color: '#71717A', textTransform: 'uppercase' as const, letterSpacing: '0.09em', marginBottom: 6 }}>{label}</label>
            <input
                type={type} value={value} onChange={onChange} placeholder={placeholder}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{
                    width: '100%', height: 42, borderRadius: 6, background: '#181A18',
                    border: `1px solid ${focused ? '#A3E635' : '#252825'}`,
                    boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                    color: '#F4F4F5', fontSize: 14, padding: '0 12px',
                    fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' as const,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
            />
            {hint && <p style={{ fontSize: 11, color: '#71717A', margin: '4px 0 0' }}>{hint}</p>}
        </div>
    );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
    return (
        <button onClick={() => onChange(!on)} style={{
            width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
            background: on ? '#A3E635' : '#252825', position: 'relative', flexShrink: 0,
            transition: 'background 0.2s',
        }}>
            <div style={{
                width: 16, height: 16, borderRadius: '50%', background: on ? '#0B0C0B' : '#71717A',
                position: 'absolute', top: 3, left: on ? 21 : 3,
                transition: 'left 0.2s, background 0.2s',
            }} />
        </button>
    );
}

function SettingsRow({ label, meta, children }: { label: string; meta?: string; children: React.ReactNode }) {
    return (
        <div style={{ padding: '14px 0', borderBottom: '1px solid #1C1E1C', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
                <div style={{ fontSize: 14, color: '#F4F4F5', fontWeight: 500 }}>{label}</div>
                {meta && <div style={{ fontSize: 12, color: '#71717A', marginTop: 2 }}>{meta}</div>}
            </div>
            <div style={{ flexShrink: 0 }}>{children}</div>
        </div>
    );
}

export default function Settings({ auth: authProp }: { auth?: { user: { name: string; email: string } } }) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;
    const user = authProp?.user ?? auth?.user ?? { name: '', email: '' };

    const [tab, setTab]                   = useState('account');
    const [accountName, setAccountName]   = useState(user.name);
    const [email, setEmail]               = useState(user.email);
    const [workspace, setWorkspace]       = useState('My Workspace');
    const [saved, setSaved]               = useState(false);
    const [openaiKey, setOpenaiKey]       = useState('sk-••••••••••••••••••••••••TZ8K');
    const [showKey, setShowKey]           = useState(false);
    const [defaultTone, setDefaultTone]   = useState('professional');
    const [language, setLanguage]         = useState('en');
    const [notifs, setNotifs]             = useState({ email: true, browser: true, weekly: false });
    const [integrations, setIntegrations] = useState({ zapier: true, webhook: false });
    const [webhookUrl, setWebhookUrl]     = useState('');

    const initials = (accountName || user.name || 'U').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    const TABS = [
        { id: 'account',      label: 'Account',     icon: 'dashboard' },
        { id: 'billing',      label: 'Billing',      icon: 'zap' },
        { id: 'integrations', label: 'Integrations', icon: 'link' },
        { id: 'preferences',  label: 'Preferences',  icon: 'cog' },
    ];

    return (
        <>
            <Head title="Settings" />
            <AppLayout activePage="settings">
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                    {/* LEFT TABS */}
                    <div style={{ width: 200, borderRight: '1px solid #252825', padding: '24px 0', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '0 20px 16px', fontSize: 11, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Settings</div>
                        {TABS.map(t => {
                            const active = tab === t.id;
                            return (
                                <button key={t.id} onClick={() => setTab(t.id)} style={{
                                    width: '100%', height: 40, display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '0 16px 0 20px', background: active ? '#181A18' : 'none', border: 'none',
                                    color: active ? '#F4F4F5' : '#71717A', fontSize: 14, cursor: 'pointer',
                                    fontFamily: 'Inter, sans-serif', fontWeight: active ? 500 : 400,
                                    textAlign: 'left', position: 'relative', transition: 'background 0.12s, color 0.12s',
                                }}>
                                    {active && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 2, height: 18, background: '#A3E635', borderRadius: '0 2px 2px 0' }} />}
                                    <Icon name={t.icon} size={16} color={active ? '#A3E635' : '#71717A'} />
                                    {t.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* RIGHT CONTENT */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', maxWidth: 700 }}>

                        {/* ACCOUNT */}
                        {tab === 'account' && (
                            <div>
                                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#F4F4F5', marginBottom: 4, letterSpacing: '-0.3px' }}>Account</h2>
                                <p style={{ fontSize: 13, color: '#71717A', marginBottom: 28 }}>Manage your personal account and workspace.</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, padding: 20, background: '#111311', border: '1px solid #252825', borderRadius: 8 }}>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#A3E635', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: '#0B0C0B', flexShrink: 0 }}>{initials}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 15, fontWeight: 600, color: '#F4F4F5' }}>{accountName || user.name}</div>
                                        <div style={{ fontSize: 12, color: '#71717A', marginTop: 2 }}>{email || user.email}</div>
                                    </div>
                                    <button style={{ height: 32, padding: '0 14px', borderRadius: 6, border: '1px solid #252825', background: '#181A18', color: '#D4D4D8', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Change avatar</button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
                                    <DarkInput label="Full name" value={accountName} onChange={e => setAccountName(e.target.value)} />
                                    <DarkInput label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                    <DarkInput label="Workspace name" value={workspace} onChange={e => setWorkspace(e.target.value)} hint="Used for your workspace identifier." />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={handleSave} style={{
                                        height: 38, padding: '0 20px', borderRadius: 6, border: saved ? '1px solid #A3E635' : 'none',
                                        background: saved ? '#1A2E05' : 'linear-gradient(135deg,#A3E635,#84CC16)',
                                        color: saved ? '#A3E635' : '#0B0C0B',
                                        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}>
                                        {saved ? <><Icon name="check-circle" size={14} color="#A3E635" /> Saved</> : 'Save changes'}
                                    </button>
                                </div>

                                <div style={{ marginTop: 40, padding: 20, border: '1px solid #2D0C0C', borderRadius: 8, background: '#1A0808' }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: '#EF4444', marginBottom: 8 }}>Danger zone</div>
                                    <div style={{ fontSize: 13, color: '#71717A', marginBottom: 16 }}>Permanently delete your account and all associated data.</div>
                                    <button style={{ height: 34, padding: '0 16px', borderRadius: 6, background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                        Delete account
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* BILLING */}
                        {tab === 'billing' && (
                            <div>
                                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#F4F4F5', marginBottom: 4, letterSpacing: '-0.3px' }}>Billing</h2>
                                <p style={{ fontSize: 13, color: '#71717A', marginBottom: 28 }}>Manage your subscription and payment details.</p>

                                <div style={{ background: '#111311', border: '1px solid #252825', borderRadius: 8, padding: 20, marginBottom: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                                        <span style={{ fontSize: 13, color: '#71717A' }}>Pages generated this month</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#F4F4F5' }}>18 <span style={{ color: '#71717A', fontWeight: 400 }}>/ unlimited</span></span>
                                    </div>
                                    <div style={{ height: 4, background: '#252825', borderRadius: 2, overflow: 'hidden' }}>
                                        <div style={{ width: '36%', height: '100%', background: '#A3E635', borderRadius: 2 }} />
                                    </div>
                                    <div style={{ fontSize: 11, color: '#71717A', marginTop: 8 }}>Resets next month</div>
                                </div>

                                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                                    {PLANS.map((plan, i) => (
                                        <div key={plan.name} style={{ background: i === 0 ? '#111311' : '#0D0E0D', border: `1px solid ${i === 0 ? '#A3E635' : '#252825'}`, borderRadius: 8, padding: '16px 18px', position: 'relative', flex: 1 }}>
                                            {i === 0 && <span style={{ position: 'absolute', top: 12, right: 12, fontSize: 10, fontWeight: 600, color: '#0B0C0B', background: '#A3E635', borderRadius: 4, padding: '2px 7px' }}>CURRENT</span>}
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#F4F4F5' }}>{plan.name}</div>
                                            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#F4F4F5', margin: '8px 0 4px' }}>
                                                {plan.price}<span style={{ fontSize: 13, fontWeight: 400, color: '#71717A' }}>/mo</span>
                                            </div>
                                            <div style={{ fontSize: 12, color: '#71717A', marginBottom: 14 }}>{plan.desc}</div>
                                            {plan.features.map(f => (
                                                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                                    <Icon name="check-circle" size={14} color={i === 0 ? '#A3E635' : '#71717A'} />
                                                    <span style={{ fontSize: 12, color: i === 0 ? '#D4D4D8' : '#71717A' }}>{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                <SectionLabel>Payment Method</SectionLabel>
                                <div style={{ background: '#111311', border: '1px solid #252825', borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                                    <div style={{ width: 40, height: 26, background: '#181A18', border: '1px solid #252825', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: 24, height: 14, background: 'linear-gradient(135deg,#EF4444,#F59E0B)', borderRadius: 2 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, color: '#F4F4F5' }}>•••• •••• •••• 4242</div>
                                        <div style={{ fontSize: 12, color: '#71717A' }}>Expires 08/2027</div>
                                    </div>
                                    <button style={{ height: 30, padding: '0 12px', borderRadius: 6, border: '1px solid #252825', background: 'transparent', color: '#71717A', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Update</button>
                                </div>

                                <SectionLabel>Recent Invoices</SectionLabel>
                                {[{ date: 'Apr 1, 2026', amount: '$49.00' }, { date: 'Mar 1, 2026', amount: '$49.00' }, { date: 'Feb 1, 2026', amount: '$49.00' }].map(inv => (
                                    <div key={inv.date} style={{ display: 'flex', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid #1C1E1C' }}>
                                        <span style={{ flex: 1, fontSize: 13, color: '#D4D4D8' }}>{inv.date}</span>
                                        <span style={{ fontSize: 13, color: '#F4F4F5', marginRight: 20 }}>{inv.amount}</span>
                                        <span style={{ fontSize: 11, fontWeight: 500, color: '#22C55E', background: 'rgba(34,197,94,0.1)', borderRadius: 4, padding: '2px 8px', marginRight: 12 }}>Paid</span>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><Icon name="download" size={14} color="#71717A" /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* INTEGRATIONS */}
                        {tab === 'integrations' && (
                            <div>
                                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#F4F4F5', marginBottom: 4, letterSpacing: '-0.3px' }}>Integrations</h2>
                                <p style={{ fontSize: 13, color: '#71717A', marginBottom: 28 }}>Connect external services to extend SalesCraft AI.</p>

                                <div style={{ marginBottom: 24 }}>
                                    <SectionLabel>OpenAI</SectionLabel>
                                    <div style={{ background: '#111311', border: '1px solid #252825', borderRadius: 8, padding: 20 }}>
                                        <p style={{ fontSize: 13, color: '#71717A', marginBottom: 14, margin: '0 0 14px' }}>Use your own OpenAI API key. Leave blank to use SalesCraft's shared key.</p>
                                        <label style={{ display: 'block', fontSize: 11, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>API KEY</label>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <input type={showKey ? 'text' : 'password'} value={openaiKey} onChange={e => setOpenaiKey(e.target.value)}
                                                style={{ flex: 1, height: 42, borderRadius: 6, background: '#181A18', border: '1px solid #252825', color: '#F4F4F5', fontSize: 13, padding: '0 12px', fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' as const }} />
                                            <button onClick={() => setShowKey(!showKey)} style={{ height: 42, padding: '0 14px', borderRadius: 6, border: '1px solid #252825', background: '#181A18', color: '#71717A', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>
                                                {showKey ? 'Hide' : 'Show'}
                                            </button>
                                            <button style={{ height: 42, padding: '0 14px', borderRadius: 6, border: 'none', background: 'linear-gradient(135deg,#A3E635,#84CC16)', color: '#0B0C0B', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>Save</button>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                                            <span style={{ fontSize: 12, color: '#22C55E' }}>Key validated · GPT-4o active</span>
                                        </div>
                                    </div>
                                </div>

                                <SectionLabel>Connected Apps</SectionLabel>
                                {[
                                    { id: 'zapier',  name: 'Zapier',   desc: 'Automate workflows when pages are generated', icon: 'zap' },
                                    { id: 'webhook', name: 'Webhook',  desc: 'POST to your endpoint on each generation',    icon: 'link' },
                                ].map(app => (
                                    <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: '#111311', border: '1px solid #252825', borderRadius: 8, marginBottom: 8 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 8, background: '#181A18', border: '1px solid #252825', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Icon name={app.icon} size={18} color={integrations[app.id as keyof typeof integrations] ? '#A3E635' : '#71717A'} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 500, color: '#F4F4F5' }}>{app.name}</div>
                                            <div style={{ fontSize: 12, color: '#71717A', marginTop: 1 }}>{app.desc}</div>
                                        </div>
                                        {integrations[app.id as keyof typeof integrations]
                                            ? <span style={{ fontSize: 11, fontWeight: 500, color: '#22C55E', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 4, padding: '3px 10px' }}>Connected</span>
                                            : <button onClick={() => setIntegrations(i => ({ ...i, [app.id]: true }))} style={{ height: 30, padding: '0 14px', borderRadius: 6, border: '1px solid #252825', background: '#181A18', color: '#D4D4D8', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Connect</button>
                                        }
                                    </div>
                                ))}
                                {integrations.webhook && (
                                    <div style={{ marginTop: 8, marginBottom: 16, padding: '14px 16px', background: '#111311', border: '1px solid #252825', borderRadius: 8 }}>
                                        <DarkInput label="Webhook URL" placeholder="https://your-endpoint.com/hook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} />
                                        <button style={{ marginTop: 10, height: 32, padding: '0 14px', borderRadius: 6, border: 'none', background: 'linear-gradient(135deg,#A3E635,#84CC16)', color: '#0B0C0B', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Save webhook</button>
                                    </div>
                                )}

                                <div style={{ marginTop: 32 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                        <SectionLabel>Team Members</SectionLabel>
                                        <button style={{ height: 30, padding: '0 12px', borderRadius: 6, border: '1px solid #252825', background: '#181A18', color: '#D4D4D8', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <Icon name="plus" size={12} color="#D4D4D8" /> Invite
                                        </button>
                                    </div>
                                    {[
                                        { name: user.name || 'You', email: user.email, role: 'Owner', initials: initials },
                                    ].map(m => (
                                        <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #1C1E1C' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#252825', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#A3E635', flexShrink: 0 }}>{m.initials}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 14, fontWeight: 500, color: '#F4F4F5' }}>{m.name}</div>
                                                <div style={{ fontSize: 12, color: '#71717A' }}>{m.email}</div>
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 500, color: '#71717A', background: '#181A18', border: '1px solid #252825', borderRadius: 4, padding: '2px 8px' }}>{m.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PREFERENCES */}
                        {tab === 'preferences' && (
                            <div>
                                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700, color: '#F4F4F5', marginBottom: 4, letterSpacing: '-0.3px' }}>Preferences</h2>
                                <p style={{ fontSize: 13, color: '#71717A', marginBottom: 28 }}>Customise your generation defaults and notification settings.</p>

                                <div style={{ marginBottom: 28 }}>
                                    <SectionLabel>Default Tone</SectionLabel>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        {TONES.map(t => (
                                            <button key={t.id} onClick={() => setDefaultTone(t.id)} style={{
                                                padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
                                                background: defaultTone === t.id ? t.bg : '#111311',
                                                border: `1px solid ${defaultTone === t.id ? t.color : '#252825'}`,
                                                display: 'flex', alignItems: 'center', gap: 10,
                                                fontFamily: 'Inter, sans-serif', transition: 'all 0.12s',
                                            }}>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: defaultTone === t.id ? t.color : '#3F3F46', flexShrink: 0 }} />
                                                <span style={{ fontSize: 13, fontWeight: 500, color: defaultTone === t.id ? t.color : '#71717A' }}>{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: 28 }}>
                                    <SectionLabel>Language</SectionLabel>
                                    <div style={{ position: 'relative' }}>
                                        <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: '100%', height: 42, borderRadius: 6, background: '#181A18', border: '1px solid #252825', color: '#F4F4F5', fontSize: 14, padding: '0 36px 0 12px', fontFamily: 'Inter, sans-serif', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                                            <option value="en">English (US)</option>
                                            <option value="en-gb">English (UK)</option>
                                            <option value="nl">Dutch</option>
                                            <option value="de">German</option>
                                            <option value="fr">French</option>
                                            <option value="es">Spanish</option>
                                        </select>
                                        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                            <Icon name="chevron-down" size={16} color="#71717A" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <SectionLabel>Notifications</SectionLabel>
                                    <div style={{ background: '#111311', border: '1px solid #252825', borderRadius: 8, padding: '4px 16px' }}>
                                        <SettingsRow label="Email notifications" meta="Page generation confirmations">
                                            <Toggle on={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} />
                                        </SettingsRow>
                                        <SettingsRow label="Browser notifications" meta="Real-time alerts in the app">
                                            <Toggle on={notifs.browser} onChange={v => setNotifs(n => ({ ...n, browser: v }))} />
                                        </SettingsRow>
                                        <SettingsRow label="Weekly digest" meta="Summary of your usage every Monday">
                                            <Toggle on={notifs.weekly} onChange={v => setNotifs(n => ({ ...n, weekly: v }))} />
                                        </SettingsRow>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
                                    <button onClick={handleSave} style={{
                                        height: 38, padding: '0 20px', borderRadius: 6, border: saved ? '1px solid #A3E635' : 'none',
                                        background: saved ? '#1A2E05' : 'linear-gradient(135deg,#A3E635,#84CC16)',
                                        color: saved ? '#A3E635' : '#0B0C0B',
                                        fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                    }}>
                                        {saved ? <><Icon name="check-circle" size={14} color="#A3E635" /> Saved</> : 'Save preferences'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
