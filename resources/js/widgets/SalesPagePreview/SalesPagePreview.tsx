export interface SalesPageOutput {
    headline: string;
    sub_headline: string;
    description: string;
    benefits: string[];
    features: { title: string; description: string }[];
    testimonials: { name: string; role: string; quote: string }[];
    pricing: { price: string; billing: string; cta_text: string; urgency: string };
    cta: { button_text: string; supporting_text: string };
}

interface Theme {
    heroBg: string;
    heroText: string;
    heroSub: string;
    accent: string;
    accentText: string;
    accentDark: string;
    sectionBg: string;
    sectionText: string;
    cardBg: string;
    cardBorder: string;
    bodyBg: string;
    bodyText: string;
    mutedText: string;
    darkBg: string;
    darkText: string;
    darkCard: string;
    darkCardBorder: string;
}

const THEMES: Record<string, Theme> = {
    dark: {
        heroBg:       'linear-gradient(160deg,#0B1A02,#1A2E05)',
        heroText:     '#F4F4F5',
        heroSub:      'rgba(244,244,245,0.7)',
        accent:       '#A3E635',
        accentText:   '#0B0C0B',
        accentDark:   '#84CC16',
        sectionBg:    '#F8F8F6',
        sectionText:  '#18181B',
        cardBg:       '#FFFFFF',
        cardBorder:   '#E4E4E7',
        bodyBg:       '#FFFFFF',
        bodyText:     '#18181B',
        mutedText:    '#71717A',
        darkBg:       '#0B1A02',
        darkText:     '#F4F4F5',
        darkCard:     '#111311',
        darkCardBorder:'#1A2E05',
    },
    light: {
        heroBg:       'linear-gradient(160deg,#EFF6FF,#DBEAFE)',
        heroText:     '#18181B',
        heroSub:      '#52525B',
        accent:       '#3B82F6',
        accentText:   '#FFFFFF',
        accentDark:   '#2563EB',
        sectionBg:    '#F8FAFC',
        sectionText:  '#18181B',
        cardBg:       '#FFFFFF',
        cardBorder:   '#E2E8F0',
        bodyBg:       '#FFFFFF',
        bodyText:     '#18181B',
        mutedText:    '#64748B',
        darkBg:       '#1E3A5F',
        darkText:     '#F0F9FF',
        darkCard:     '#1E40AF20',
        darkCardBorder:'#3B82F640',
    },
    bold: {
        heroBg:       '#09090B',
        heroText:     '#FAFAFA',
        heroSub:      '#A1A1AA',
        accent:       '#F97316',
        accentText:   '#09090B',
        accentDark:   '#EA6B00',
        sectionBg:    '#F4F4F5',
        sectionText:  '#09090B',
        cardBg:       '#FFFFFF',
        cardBorder:   '#E4E4E7',
        bodyBg:       '#FFFFFF',
        bodyText:     '#09090B',
        mutedText:    '#71717A',
        darkBg:       '#09090B',
        darkText:     '#FAFAFA',
        darkCard:     '#18181B',
        darkCardBorder:'#27272A',
    },
};

export default function SalesPagePreview({ data, template = 'dark' }: { data: SalesPageOutput; template?: string }) {
    if (!data) return null;

    const t = THEMES[template] ?? THEMES.dark;
    const { headline, sub_headline, description, benefits, features, testimonials, pricing, cta } = data;

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* HERO */}
            <div style={{ background: t.heroBg, padding: '96px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: t.accent, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>
                    SALESCRAFT AI · GENERATED
                </div>
                <h1 style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 50, fontWeight: 700,
                    color: t.heroText, maxWidth: 640, margin: '0 auto 20px',
                    lineHeight: 1.1, letterSpacing: '-1px',
                }}>{headline}</h1>
                <p style={{ fontSize: 20, color: t.heroSub, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.6 }}>
                    {sub_headline}
                </p>
                <button style={{
                    height: 50, padding: '0 36px', borderRadius: 6, border: 'none',
                    background: `linear-gradient(135deg,${t.accent},${t.accentDark})`,
                    color: t.accentText, fontWeight: 700, fontSize: 16, cursor: 'pointer',
                }}>{cta?.button_text || 'Get Started'} →</button>
            </div>

            {/* BENEFITS */}
            <div style={{ background: t.sectionBg, padding: '80px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: t.mutedText, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>WHY IT WORKS</div>
                <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, color: t.sectionText, marginBottom: 40, letterSpacing: '-0.5px' }}>
                    {description}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, maxWidth: 860, margin: '0 auto' }}>
                    {(benefits || []).map((benefit, i) => (
                        <div key={i} style={{
                            background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 8,
                            padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'left',
                        }}>
                            <div style={{ width: 20, height: 20, background: t.accent, borderRadius: 4, marginBottom: 14 }} />
                            <div style={{ fontSize: 15, color: t.bodyText, lineHeight: 1.6 }}>{benefit}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FEATURES */}
            <div style={{ background: t.bodyBg, padding: '80px 40px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 10, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Features</div>
                        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: t.bodyText, marginBottom: 24, letterSpacing: '-0.5px' }}>
                            Everything you need
                        </h2>
                        {(features || []).map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                                <div style={{ width: 18, height: 18, borderRadius: '50%', background: t.accent, flexShrink: 0, marginTop: 2 }} />
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: t.bodyText }}>{f.title}</div>
                                    <div style={{ fontSize: 14, color: t.mutedText, marginTop: 2 }}>{f.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        height: 220, borderRadius: 8, border: `1px solid ${t.cardBorder}`,
                        background: 'repeating-linear-gradient(45deg,#f5f5f5 0,#f5f5f5 1px,#fafafa 1px,#fafafa 14px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ fontSize: 11, color: '#A0A0A0', fontFamily: 'monospace', letterSpacing: '0.05em' }}>product screenshot</span>
                    </div>
                </div>
            </div>

            {/* TESTIMONIALS */}
            <div style={{ background: t.darkBg, padding: '80px 40px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <div style={{ fontSize: 10, color: t.accent, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, textAlign: 'center' }}>What customers say</div>
                    <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: t.darkText, textAlign: 'center', marginBottom: 40, letterSpacing: '-0.5px' }}>
                        Trusted by closers
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                        {(testimonials || []).map((tm, i) => (
                            <div key={i} style={{ background: t.darkCard, border: `1px solid ${t.darkCardBorder}`, borderRadius: 8, padding: 24 }}>
                                <p style={{ fontSize: 15, color: t.darkText, fontStyle: 'italic', lineHeight: 1.7, margin: '0 0 20px' }}>"{tm.quote}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: '50%', background: t.accent,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 13, fontWeight: 600, color: t.accentText,
                                    }}>{tm.name?.[0] || '?'}</div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 500, color: t.darkText }}>{tm.name}</div>
                                        <div style={{ fontSize: 12, color: t.mutedText }}>{tm.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PRICING */}
            <div style={{ background: t.sectionBg, padding: '80px 40px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: t.mutedText, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Simple pricing</div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 56, fontWeight: 700, color: t.sectionText, lineHeight: 1 }}>
                    {pricing?.price || 'Contact us'}
                </div>
                <div style={{ fontSize: 14, color: t.mutedText, marginTop: 8, marginBottom: 36 }}>{pricing?.billing}</div>
                <button style={{
                    height: 50, padding: '0 40px', borderRadius: 6, border: 'none',
                    background: `linear-gradient(135deg,${t.accent},${t.accentDark})`,
                    color: t.accentText, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                }}>{pricing?.cta_text || 'Get Started'}</button>
                {pricing?.urgency && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
                        <span style={{ fontSize: 13, color: '#F97316' }}>⚡ {pricing.urgency}</span>
                    </div>
                )}
            </div>

            {/* FOOTER CTA */}
            <div style={{ background: t.heroBg, padding: '96px 40px', textAlign: 'center' }}>
                <h2 style={{
                    fontFamily: 'Space Grotesk, sans-serif', fontSize: 40, fontWeight: 700,
                    color: t.heroText, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.15, letterSpacing: '-0.5px',
                }}>{cta?.supporting_text || 'Ready to get started?'}</h2>
                <button style={{
                    height: 50, padding: '0 36px', borderRadius: 6,
                    background: 'transparent', border: `1px solid ${t.accent}`,
                    color: t.accent, fontWeight: 600, fontSize: 15, cursor: 'pointer',
                }}>{cta?.button_text || 'Get Started'}</button>
            </div>
        </div>
    );
}
