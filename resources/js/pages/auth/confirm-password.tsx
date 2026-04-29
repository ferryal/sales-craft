import { useState } from 'react';
import { Form, Head } from '@inertiajs/react';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    const [focused, setFocused] = useState(false);

    return (
        <>
            <Head title="Confirm password" />
            <Form {...store.form()} resetOnSuccess={['password']}>
                {({ processing, errors }: { processing: boolean; errors: Record<string, string> }) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#71717A', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
                                Password
                            </label>
                            <input
                                type="password" name="password" placeholder="Your password" autoFocus autoComplete="current-password"
                                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                                style={{
                                    width: '100%', height: 44, borderRadius: 6, background: '#181A18',
                                    border: `1px solid ${errors.password ? '#EF4444' : focused ? '#A3E635' : '#252825'}`,
                                    boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                                    color: '#F4F4F5', fontSize: 14, padding: '0 14px',
                                    fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box' as const,
                                    transition: 'border-color 0.15s, box-shadow 0.15s',
                                }}
                            />
                            {errors.password && <p style={{ fontSize: 12, color: '#EF4444', margin: '4px 0 0' }}>{errors.password}</p>}
                        </div>

                        <button type="submit" disabled={processing} style={{
                            width: '100%', height: 44, borderRadius: 6, border: 'none',
                            background: processing ? 'rgba(163,230,53,0.35)' : 'linear-gradient(135deg, #A3E635, #84CC16)',
                            color: '#0B0C0B', fontWeight: 600, fontSize: 14,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            fontFamily: 'Inter, sans-serif',
                        }}>
                            {processing ? 'Confirming…' : 'Confirm password →'}
                        </button>
                    </div>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm your password',
    description: 'This is a secure area. Please confirm your password before continuing.',
};
