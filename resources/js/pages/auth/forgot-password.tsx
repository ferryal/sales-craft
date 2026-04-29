import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { email } from '@/routes/password';
import { login } from '@/routes';

export default function ForgotPassword({ status }: { status?: string }) {
    const [focused, setFocused] = useState(false);

    return (
        <>
            <Head title="Forgot password" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {status && (
                    <div style={{ padding: '10px 14px', background: '#1A2E05', border: '1px solid #A3E635', borderRadius: 6, fontSize: 13, color: '#A3E635' }}>
                        {status}
                    </div>
                )}

                <Form {...email.form()}>
                    {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#71717A', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
                                    Email address
                                </label>
                                <input
                                    type="email" name="email" placeholder="you@company.com" autoFocus
                                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                                    style={{
                                        width: '100%', height: 44, borderRadius: 6, background: '#181A18',
                                        border: `1px solid ${errors.email ? '#EF4444' : focused ? '#A3E635' : '#252825'}`,
                                        boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                                        color: '#F4F4F5', fontSize: 14, padding: '0 14px',
                                        fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' as const,
                                        transition: 'border-color 0.15s, box-shadow 0.15s',
                                    }}
                                />
                                {errors.email && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 0' }}>{errors.email}</p>}
                            </div>

                            <button type="submit" disabled={processing} style={{
                                width: '100%', height: 44, borderRadius: 6, border: 'none',
                                background: processing ? 'rgba(163,230,53,0.35)' : 'linear-gradient(135deg, #A3E635, #84CC16)',
                                color: '#0B0C0B', fontWeight: 600, fontSize: 14,
                                cursor: processing ? 'not-allowed' : 'pointer',
                                fontFamily: 'Inter, sans-serif',
                            }}>
                                {processing ? 'Sending…' : 'Email reset link →'}
                            </button>
                        </div>
                    )}
                </Form>

                <p style={{ fontSize: 13, color: '#71717A', textAlign: 'center', margin: 0 }}>
                    Remember it?{' '}
                    <Link href={login()} style={{ color: '#A3E635', textDecoration: 'none' }}>Back to sign in</Link>
                </p>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot your password?',
    description: "Enter your email and we'll send you a reset link.",
};
