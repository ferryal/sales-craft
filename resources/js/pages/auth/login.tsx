import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { store } from '@/routes/login';
import { register } from '@/routes';
import { request } from '@/routes/password';

const LS_EMAIL_KEY = 'salescraft_remembered_email';

function DarkEmailInput({ name, placeholder, error, value, onChange }: {
    name: string; placeholder: string; error?: string;
    value: string; onChange: (v: string) => void;
}) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#71717A', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
                Email
            </label>
            <input
                type="email" name={name} placeholder={placeholder}
                value={value} onChange={e => onChange(e.target.value)}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{
                    width: '100%', height: 44, borderRadius: 6, background: '#181A18',
                    border: `1px solid ${error ? '#EF4444' : focused ? '#A3E635' : '#252825'}`,
                    boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                    color: '#F4F4F5', fontSize: 14, padding: '0 14px',
                    fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' as const,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
            />
            {error && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 0' }}>{error}</p>}
        </div>
    );
}

function DarkPasswordInput({ label, name, placeholder, error, extra }: {
    label: string; name: string; placeholder: string; error?: string; extra?: React.ReactNode;
}) {
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: '#71717A', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                    {label}
                </label>
                {extra}
            </div>
            <div style={{ position: 'relative' }}>
                <input
                    type={visible ? 'text' : 'password'} name={name} placeholder={placeholder}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{
                        width: '100%', height: 44, borderRadius: 6, background: '#181A18',
                        border: `1px solid ${error ? '#EF4444' : focused ? '#A3E635' : '#252825'}`,
                        boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                        color: '#F4F4F5', fontSize: 14, padding: '0 42px 0 14px',
                        fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' as const,
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                />
                <button
                    type="button" onClick={() => setVisible(v => !v)}
                    title={visible ? 'Hide password' : 'Show password'}
                    style={{
                        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        display: 'flex', alignItems: 'center', color: '#71717A',
                    }}
                >
                    {visible ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    )}
                </button>
            </div>
            {error && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 0' }}>{error}</p>}
        </div>
    );
}

export default function Login({ status, canResetPassword, canRegister }: {
    status?: string; canResetPassword: boolean; canRegister: boolean;
}) {
    const savedEmail = typeof window !== 'undefined' ? (localStorage.getItem(LS_EMAIL_KEY) ?? '') : '';
    const [email, setEmail] = useState(savedEmail);
    const [rememberEmail, setRememberEmail] = useState(Boolean(savedEmail));

    const handleEmailChange = (val: string) => {
        setEmail(val);
        if (rememberEmail) localStorage.setItem(LS_EMAIL_KEY, val);
    };

    const toggleRemember = () => {
        const next = !rememberEmail;
        setRememberEmail(next);
        if (next) {
            localStorage.setItem(LS_EMAIL_KEY, email);
        } else {
            localStorage.removeItem(LS_EMAIL_KEY);
        }
    };

    return (
        <>
            <Head title="Sign in" />
            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {status && (
                            <div style={{ padding: '10px 14px', background: '#1A2E05', border: '1px solid #A3E635', borderRadius: 6, fontSize: 13, color: '#A3E635' }}>
                                {status}
                            </div>
                        )}

                        <DarkEmailInput
                            name="email" placeholder="you@company.com"
                            value={email} onChange={handleEmailChange} error={errors.email}
                        />

                        <DarkPasswordInput
                            label="Password" name="password" placeholder="••••••••" error={errors.password}
                            extra={canResetPassword
                                ? <Link href={request()} style={{ fontSize: 12, color: '#71717A', textDecoration: 'none' }}>Forgot password?</Link>
                                : undefined}
                        />

                        {/* Remember email checkbox */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' as const }}>
                            <div
                                onClick={toggleRemember}
                                style={{
                                    width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                                    border: `1.5px solid ${rememberEmail ? '#A3E635' : '#3F3F46'}`,
                                    background: rememberEmail ? '#A3E635' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.15s', cursor: 'pointer',
                                }}
                            >
                                {rememberEmail && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="#0B0C0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                            <span style={{ fontSize: 13, color: '#71717A' }}>Remember email</span>
                        </label>

                        <button type="submit" disabled={processing} style={{
                            width: '100%', height: 44, borderRadius: 6, border: 'none', marginTop: 8,
                            background: processing ? 'rgba(163,230,53,0.35)' : 'linear-gradient(135deg, #A3E635, #84CC16)',
                            color: '#0B0C0B', fontWeight: 600, fontSize: 14,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            fontFamily: 'Inter, sans-serif',
                        }}>
                            {processing ? 'Signing in…' : 'Sign in →'}
                        </button>

                        {canRegister && (
                            <p style={{ fontSize: 13, color: '#71717A', textAlign: 'center', margin: 0 }}>
                                No account?{' '}
                                <Link href={register()} style={{ color: '#A3E635', textDecoration: 'none' }}>
                                    Create a free account
                                </Link>
                            </p>
                        )}

                        <p style={{ fontSize: 11, color: '#3F3F46', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                            By signing in you agree to our Terms and Privacy Policy.
                        </p>
                    </div>
                )}
            </Form>
        </>
    );
}

Login.layout = { title: 'Welcome back', description: null };
