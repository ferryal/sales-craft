import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { store } from '@/routes/login';
import { register } from '@/routes';
import { request } from '@/routes/password';

function DarkInput({ label, type = 'text', name, placeholder, error, extra }: {
    label: string; type?: string; name: string; placeholder: string;
    error?: string; extra?: React.ReactNode;
}) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: '#71717A', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                    {label}
                </label>
                {extra}
            </div>
            <input
                type={type} name={name} placeholder={placeholder}
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
            {error && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4, margin: '4px 0 0' }}>{error}</p>}
        </div>
    );
}

export default function Login({ status, canResetPassword, canRegister }: {
    status?: string; canResetPassword: boolean; canRegister: boolean;
}) {
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

                        <DarkInput label="Email" type="email" name="email" placeholder="you@company.com" error={errors.email} />

                        <DarkInput
                            label="Password" type="password" name="password" placeholder="••••••••" error={errors.password}
                            extra={canResetPassword
                                ? <Link href={request()} style={{ fontSize: 12, color: '#71717A', textDecoration: 'none' }}>Forgot password?</Link>
                                : undefined}
                        />

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
