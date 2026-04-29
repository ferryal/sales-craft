import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const PROOF_STATS = [
    '2,400 sales pages generated last month',
    'Average generation time: 8 seconds',
    'Used by founders in 40+ countries',
];

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Inter, sans-serif', background: '#0B0C0B' }}>

            {/* LEFT — editorial panel */}
            <div style={{
                width: '45%', background: '#0B0C0B', display: 'flex',
                flexDirection: 'column', padding: '32px 48px', flexShrink: 0,
            }}>
                {/* Logo */}
                <Link href={home()} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#F4F4F5', letterSpacing: '-0.3px' }}>SalesCraft</span>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 22 12 12 22 2 12" />
                    </svg>
                </Link>

                {/* Hero copy */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 420 }}>
                    <h1 style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: 44, fontWeight: 700, color: '#F4F4F5',
                        lineHeight: 1.08, margin: '0 0 24px', letterSpacing: '-1.5px',
                    }}>
                        Turn product info into a page that converts.
                    </h1>
                    <div style={{ width: 48, height: 1, background: '#A3E635', marginBottom: 28 }} />
                    {PROOF_STATS.map((stat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#A3E635', flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: '#71717A', lineHeight: 1.5 }}>{stat}</span>
                        </div>
                    ))}
                </div>

                <div style={{ fontSize: 11, color: '#3F3F46', letterSpacing: '0.04em' }}>SalesCraft AI v1.0 · GPT-4o</div>
            </div>

            {/* RIGHT — form panel */}
            <div style={{
                width: '55%', background: '#111311',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{ width: '100%', maxWidth: 400, padding: '0 40px' }}>
                    <h2 style={{ fontSize: 26, fontWeight: 600, color: '#F4F4F5', margin: '0 0 6px' }}>{title}</h2>
                    {description && (
                        <p style={{ fontSize: 13, color: '#71717A', margin: '0 0 24px' }}>{description}</p>
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
