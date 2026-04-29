import { useState, useRef, useEffect } from 'react';
import Icon from '@/shared/icons/Icon';
import { TONES } from '@/shared/config/tones';

const STATUS_MESSAGES = [
    'Crafting headline…', 'Writing benefits…',
    'Building feature list…', 'Finalizing CTA…', 'Polishing copy…',
];

function SectionLabel({ children, optional }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 2, height: 16, background: '#A3E635', borderRadius: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#A3E635', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {children}
            </span>
            {optional && (
                <span style={{ fontSize: 10, fontWeight: 500, border: '1px solid #252825', color: '#71717A', borderRadius: 4, padding: '1px 7px' }}>
                    Optional
                </span>
            )}
        </div>
    );
}

function FormInput({ label, helper, value, onChange, placeholder, type = 'text', name }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            {label && (
                <label style={{ display: 'block', fontSize: 11, color: '#71717A', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {label}
                </label>
            )}
            <input
                type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
                onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                style={{
                    width: '100%', height: 50, borderRadius: 6, background: '#111311',
                    border: `1px solid ${focused ? '#A3E635' : '#252825'}`,
                    boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                    color: '#F4F4F5', fontSize: 14, padding: '0 14px',
                    fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
            />
            {helper && <p style={{ fontSize: 12, color: '#71717A', margin: '4px 0 0' }}>{helper}</p>}
        </div>
    );
}

function FormTextarea({ label, value, onChange, rows = 5, maxLen, name }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            {label && (
                <label style={{ display: 'block', fontSize: 11, color: '#71717A', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative' }}>
                <textarea
                    rows={rows} name={name} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{
                        width: '100%', borderRadius: 6, background: '#111311',
                        border: `1px solid ${focused ? '#A3E635' : '#252825'}`,
                        boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                        color: '#F4F4F5', fontSize: 14, padding: '12px 14px',
                        paddingBottom: maxLen ? 28 : 12,
                        fontFamily: 'Inter, sans-serif', outline: 'none',
                        resize: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                />
                {maxLen && (
                    <span style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 11, color: '#3F3F46' }}>
                        {(value || '').length} / {maxLen}
                    </span>
                )}
            </div>
        </div>
    );
}

function TagInput({ tags, onChange }) {
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);

    const addTag = () => {
        const v = input.trim().replace(/,$/, '');
        if (v && !tags.includes(v) && tags.length < 10) { onChange([...tags, v]); setInput(''); }
    };
    const removeTag = t => onChange(tags.filter(x => x !== t));
    const handleKey = e => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
        if (e.key === 'Backspace' && !input && tags.length) removeTag(tags[tags.length - 1]);
    };

    return (
        <div>
            <label style={{ display: 'block', fontSize: 11, color: '#71717A', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 6 }}>
                KEY FEATURES
            </label>
            <div
                onClick={() => inputRef.current?.focus()}
                style={{
                    minHeight: 50, borderRadius: 6, background: '#111311',
                    border: `1px solid ${focused ? '#A3E635' : '#252825'}`,
                    boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                    padding: '8px 10px', display: 'flex', flexWrap: 'wrap',
                    gap: 6, alignItems: 'center', cursor: 'text',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
            >
                {tags.map(t => (
                    <span key={t} style={{
                        background: '#1A2E05', color: '#A3E635', borderRadius: 4,
                        fontSize: 12, fontWeight: 500, padding: '3px 8px',
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                    }}>
                        {t}
                        <span onClick={e => { e.stopPropagation(); removeTag(t); }}
                            style={{ cursor: 'pointer', opacity: 0.7, lineHeight: 1, fontSize: 14, marginTop: -1 }}>×</span>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); addTag(); }}
                    placeholder={tags.length === 0 ? 'Type a feature, press Enter' : ''}
                    style={{
                        background: 'none', border: 'none', outline: 'none',
                        color: '#F4F4F5', fontSize: 14, fontFamily: 'Inter, sans-serif',
                        flex: 1, minWidth: 120, padding: '2px 4px',
                    }}
                />
            </div>
        </div>
    );
}

const TONE_ACTIVE = { professional: '#A3E635', casual: '#38BDF8', aggressive: '#EF4444', luxury: '#E2C87A' };

function ToneCard({ tone, selected, onSelect }) {
    const [hov, setHov] = useState(false);
    const isSelected = selected === tone.id;
    const activeColor = TONE_ACTIVE[tone.id];

    return (
        <div
            onClick={() => onSelect(tone.id)}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                background: '#111311', borderRadius: 8, padding: 18, cursor: 'pointer',
                border: `1px solid ${isSelected ? activeColor : hov ? '#3F3F46' : '#252825'}`,
                transition: 'border-color 0.15s',
            }}
        >
            <Icon name={tone.icon} size={20} color={isSelected ? activeColor : '#71717A'} />
            <div style={{ fontSize: 14, fontWeight: 600, color: '#F4F4F5', marginTop: 10 }}>{tone.label}</div>
            <div style={{ fontSize: 12, color: '#71717A', marginTop: 3 }}>{tone.desc}</div>
        </div>
    );
}

export default function ProductForm({ data, setData, onSubmit, processing, errors }) {
    const [statusIdx, setStatusIdx] = useState(0);
    const [progress, setProgress] = useState(0);

    const handleSubmit = e => {
        e.preventDefault();
        onSubmit();
    };

    // Animate progress while processing
    useEffect(() => {
        if (!processing) { setProgress(0); setStatusIdx(0); return; }
        let p = 0;
        const iv = setInterval(() => {
            p += Math.random() * 8 + 3;
            if (p >= 95) { p = 95; clearInterval(iv); }
            setProgress(Math.min(p, 95));
            setStatusIdx(Math.min(Math.floor((p / 95) * (STATUS_MESSAGES.length - 1)), STATUS_MESSAGES.length - 1));
        }, 400);
        return () => clearInterval(iv);
    }, [processing]);

    return (
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 64px' }}>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>

                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 26, fontWeight: 700, color: '#F4F4F5', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                        New Sales Page
                    </h1>
                    <p style={{ fontSize: 13, color: '#71717A', margin: 0 }}>
                        Fill in your product info. More detail = sharper copy.
                    </p>
                </div>

                {/* Rate limit / concurrent error */}
                {(errors.rate_limit || errors.concurrent || errors.generation) && (
                    <div style={{ marginBottom: 20, padding: '12px 16px', background: '#181A18', border: '1px solid #EF4444', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <Icon name="alert-circle" size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 13, color: '#F4F4F5' }}>{errors.rate_limit || errors.concurrent || errors.generation}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 28 }}>
                        <SectionLabel>Product</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <FormInput label="PRODUCT NAME" name="name" placeholder="e.g. ProLead CRM"
                                value={data.name} onChange={e => setData('name', e.target.value)} />
                            {errors.name && <p style={{ fontSize: 12, color: '#EF4444', marginTop: -8 }}>{errors.name}</p>}
                            <FormTextarea label="DESCRIPTION" name="description" rows={6} maxLen={500}
                                value={data.description} onChange={e => setData('description', e.target.value)} />
                            {errors.description && <p style={{ fontSize: 12, color: '#EF4444', marginTop: -8 }}>{errors.description}</p>}
                        </div>
                    </div>

                    <div style={{ marginBottom: 28 }}>
                        <SectionLabel>Audience</SectionLabel>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <TagInput
                                tags={Array.isArray(data.features) ? data.features : []}
                                onChange={v => setData('features', v)}
                            />
                            {errors.features && <p style={{ fontSize: 12, color: '#EF4444', marginTop: -8 }}>{errors.features}</p>}
                            <FormInput label="TARGET AUDIENCE" name="audience" placeholder="e.g. B2B SaaS founders"
                                helper="Who is this for?"
                                value={data.audience} onChange={e => setData('audience', e.target.value)} />
                            {errors.audience && <p style={{ fontSize: 12, color: '#EF4444', marginTop: -8 }}>{errors.audience}</p>}
                            <FormTextarea label="UNIQUE SELLING POINTS" name="usps" rows={3}
                                value={data.usps} onChange={e => setData('usps', e.target.value)} />
                        </div>
                    </div>

                    <div style={{ marginBottom: 28 }}>
                        <SectionLabel>Tone</SectionLabel>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {TONES.map(t => (
                                <ToneCard key={t.id} tone={t} selected={data.tone} onSelect={v => setData('tone', v)} />
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <SectionLabel optional>Pricing</SectionLabel>
                        <div style={{ display: 'flex', height: 50, borderRadius: 6, overflow: 'hidden', border: '1px solid #252825' }}>
                            <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center', background: '#181A18', borderRight: '1px solid #252825', fontSize: 14, color: '#71717A', flexShrink: 0 }}>$</div>
                            <input
                                type="text" name="price" placeholder="e.g. 49" value={data.price}
                                onChange={e => setData('price', e.target.value)}
                                style={{ flex: 1, background: '#111311', border: 'none', outline: 'none', color: '#F4F4F5', fontSize: 14, padding: '0 14px', fontFamily: 'Inter, sans-serif' }}
                            />
                        </div>
                    </div>

                    <div>
                        {processing && (
                            <div style={{ height: 3, background: '#252825', borderRadius: 2, marginBottom: 12, overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: '#A3E635', borderRadius: 2, width: `${progress}%`, transition: 'width 0.35s ease' }} />
                            </div>
                        )}
                        <button type="submit" disabled={processing} style={{
                            width: '100%', height: 52, borderRadius: 6, border: 'none',
                            background: processing ? 'rgba(163,230,53,0.3)' : 'linear-gradient(135deg, #A3E635 0%, #84CC16 100%)',
                            color: '#0B0C0B', fontWeight: 700, fontSize: 15,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            fontFamily: 'Inter, sans-serif',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}>
                            {processing
                                ? <><Icon name="loader" size={18} color="#0B0C0B" spin />{STATUS_MESSAGES[statusIdx]}</>
                                : 'Generate Sales Page →'
                            }
                        </button>
                        <p style={{ fontSize: 12, color: '#71717A', textAlign: 'center', marginTop: 10 }}>⚡ ~8 seconds · GPT-4o</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
