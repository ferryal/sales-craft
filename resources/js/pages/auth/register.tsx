import { useState } from 'react';
import { Form, Head, Link } from '@inertiajs/react';
import { store } from '@/routes/register';
import { login } from '@/routes';

function DarkInput({ label, type = 'text', name, placeholder, error }: {
    label: string; type?: string; name: string; placeholder: string; error?: string;
}) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#71717A', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
                {label}
            </label>
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
            {error && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 0' }}>{error}</p>}
        </div>
    );
}

export default function Register() {
    return (
        <>
            <Head title="Create account" />
            <Form {...store.form()} resetOnSuccess={['password', 'password_confirmation']} disableWhileProcessing>
                {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <DarkInput label="Full name" name="name" placeholder="Your name" error={errors.name} />
                        <DarkInput label="Email" type="email" name="email" placeholder="you@company.com" error={errors.email} />
                        <DarkInput label="Password" type="password" name="password" placeholder="Min. 8 characters" error={errors.password} />
                        <DarkInput label="Confirm password" type="password" name="password_confirmation" placeholder="Repeat password" error={errors.password_confirmation} />

                        <button type="submit" disabled={processing} style={{
                            width: '100%', height: 44, borderRadius: 6, border: 'none', marginTop: 8,
                            background: processing ? 'rgba(163,230,53,0.35)' : 'linear-gradient(135deg, #A3E635, #84CC16)',
                            color: '#0B0C0B', fontWeight: 600, fontSize: 14,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'Inter, sans-serif',
                        }}>
                            {processing ? 'Creating account…' : 'Create account →'}
                        </button>

                        <p style={{ fontSize: 13, color: '#71717A', textAlign: 'center', margin: 0 }}>
                            Already have an account?{' '}
                            <Link href={login()} style={{ color: '#A3E635', textDecoration: 'none' }}>Sign in</Link>
                        </p>

                        <p style={{ fontSize: 11, color: '#3F3F46', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                            By signing up you agree to our Terms and Privacy Policy.
                        </p>
                    </div>
                )}
            </Form>
        </>
    );
}

Register.layout = { title: 'Create account', description: null };
