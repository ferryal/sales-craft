export default function SalesPagePreview({ data }) {
    if (!data) return null;
    const { headline, sub_headline, description, benefits, features, testimonials, pricing, cta } = data;

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* HERO */}
            <div style={{ background: 'linear-gradient(160deg,#0B1A02,#1A2E05)', padding: '96px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#A3E635', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>
                    SALESCRAFT AI · GENERATED
                </div>
                <h1 style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 50, fontWeight: 700,
                    color: '#F4F4F5', maxWidth: 640, margin: '0 auto 20px',
                    lineHeight: 1.1, letterSpacing: '-1px',
                }}>{headline}</h1>
                <p style={{ fontSize: 20, color: 'rgba(244,244,245,0.7)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>
                    {sub_headline}
                </p>
                <button style={{
                    height: 50, padding: '0 36px', borderRadius: 6, border: 'none',
                    background: 'linear-gradient(135deg,#A3E635,#84CC16)',
                    color: '#0B0C0B', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                }}>{cta?.button_text || 'Get Started'} →</button>
            </div>

            {/* BENEFITS */}
            <div style={{ background: '#F8F8F6', padding: '80px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: '#71717A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>WHY IT WORKS</div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, color: '#18181B', marginBottom: 40, letterSpacing: '-0.5px' }}>
                    {description}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 860, margin: '0 auto' }}>
                    {(benefits || []).map((benefit, i) => (
                        <div key={i} style={{
                            background: '#fff', border: '1px solid #E4E4E7', borderRadius: 8,
                            padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'left',
                        }}>
                            <div style={{ width: 20, height: 20, background: '#A3E635', borderRadius: 4, marginBottom: 14 }} />
                            <div style={{ fontSize: 15, color: '#52525B', lineHeight: 1.6 }}>{benefit}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FEATURES */}
            <div style={{ background: '#fff', padding: '80px 40px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 10, color: '#A3E635', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Features</div>
                        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: '#18181B', marginBottom: 24, letterSpacing: '-0.5px' }}>
                            Everything you need
                        </h2>
                        {(features || []).map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#A3E635', flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: '#18181B' }}>{f.title}</div>
                                    <div style={{ fontSize: 14, color: '#52525B', marginTop: 2 }}>{f.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        height: 220, borderRadius: 8, border: '1px solid #E4E4E7',
                        background: 'repeating-linear-gradient(45deg,#f5f5f5 0,#f5f5f5 1px,#fafafa 1px,#fafafa 14px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: 11, color: '#A0A0A0', fontFamily: 'monospace', letterSpacing: '0.05em' }}>product screenshot</span>
                    </div>
                </div>
            </div>

            {/* TESTIMONIALS */}
            <div style={{ background: '#0B1A02', padding: '80px 40px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <div style={{ fontSize: 10, color: '#A3E635', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, textAlign: 'center' }}>What customers say</div>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: '#F4F4F5', textAlign: 'center', marginBottom: 40, letterSpacing: '-0.5px' }}>
                        Trusted by closers
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {(testimonials || []).map((t, i) => (
                            <div key={i} style={{ background: '#111311', border: '1px solid #1A2E05', borderRadius: 8, padding: 24 }}>
                                <p style={{ fontSize: 15, color: '#F4F4F5', fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 20px' }}>"{t.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%', background: '#A3E635',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 600, color: '#0B0C0B',
                                    }}>{t.name?.[0] || '?'}</div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500, color: '#F4F4F5' }}>{t.name}</div>
                                        <div style={{ fontSize: 12, color: '#71717A' }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PRICING */}
            <div style={{ background: '#F8F8F6', padding: '80px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Simple pricing</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 56, fontWeight: 700, color: '#18181B', lineHeight: 1 }}>
                    {pricing?.price || 'Contact us'}
                </div>
                <div style={{ fontSize: 14, color: '#71717A', marginTop: 8, marginBottom: 36 }}>
                    {pricing?.billing}
                </div>
                <button style={{
                    height: 50, padding: '0 40px', borderRadius: 6, border: 'none',
                    background: 'linear-gradient(135deg,#A3E635,#84CC16)',
                    color: '#0B0C0B', fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}>{pricing?.cta_text || 'Get Started'}</button>
                {pricing?.urgency && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                        <span style={{ fontSize: 13, color: '#F97316' }}>⚡ {pricing.urgency}</span>
                    </div>
                )}
            </div>

            {/* FOOTER CTA */}
            <div style={{ background: 'linear-gradient(160deg,#0B1A02,#1A2E05)', padding: '96px 40px', textAlign: 'center' }}>
                <h2 style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700,
                    color: '#F4F4F5', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.15, letterSpacing: '-0.5px',
                }}>{cta?.supporting_text || 'Ready to get started?'}</h2>
                <button style={{
                    height: 50, padding: '0 36px', borderRadius: 6,
                    background: 'transparent', border: '1px solid #A3E635',
                    color: '#A3E635', fontWeight: 600, fontSize: 15, cursor: 'pointer',
                }}>{cta?.button_text || 'Get Started'}</button>
            </div>
        </div>
    );
}
