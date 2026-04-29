import { useState } from 'react';
import Icon from '@/shared/icons/Icon';
import { TONE_META, STRIP_COLORS, STRIP_HEIGHTS } from '@/shared/config/tones';

function IconBtn({ icon, hoverColor, onClick, size = 18 }) {
    const [h, setH] = useState(false);
    return (
        <button
            onClick={e => { e.stopPropagation(); onClick?.(); }}
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{
                background: 'none', border: 'none', padding: '4px 6px',
                color: h ? hoverColor : '#71717A', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', transition: 'color 0.12s', borderRadius: 4,
            }}
        >
            <Icon name={icon} size={size} color={h ? hoverColor : '#71717A'} />
        </button>
    );
}

export default function PageCard({ page, onPreview, onRegenerate, onDelete }) {
    const [hovered, setHovered] = useState(false);
    const tone = TONE_META[page.tone] || TONE_META.professional;
    const strips = STRIP_COLORS[page.tone] || STRIP_COLORS.professional;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: '#111311', borderRadius: 8, overflow: 'hidden',
                border: `1px solid ${hovered ? '#3F3F46' : '#252825'}`,
                transition: 'border-color 0.15s', cursor: 'default',
            }}
        >
            <div>
                {strips.map((c, i) => (
                    <div key={i} style={{ height: STRIP_HEIGHTS[i], background: c }} />
                ))}
            </div>

            <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#F4F4F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {page.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: tone.color, background: tone.bg, borderRadius: 4, padding: '2px 8px' }}>
                        {tone.label}
                    </span>
                    <span style={{ fontSize: 11, color: '#71717A' }}>{page.date}</span>
                </div>
                {page.status === 'processing' && (
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon name="loader" size={12} color="#A3E635" spin />
                        <span style={{ fontSize: 11, color: '#A3E635' }}>Generating…</span>
                    </div>
                )}
                {page.status === 'failed' && (
                    <div style={{ marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: '#EF4444' }}>Generation failed</span>
                    </div>
                )}
            </div>

            <div style={{
                borderTop: hovered ? '1px solid #252825' : 'none',
                padding: hovered ? '8px 10px' : '0 10px',
                maxHeight: hovered ? 44 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.2s ease, padding 0.2s ease',
                display: 'flex', gap: 2,
            }}>
                <IconBtn icon="eye"     hoverColor="#A3E635" onClick={onPreview} />
                <IconBtn icon="refresh" hoverColor="#A3E635" onClick={onRegenerate} />
                <IconBtn icon="trash"   hoverColor="#EF4444" onClick={onDelete} />
            </div>
        </div>
    );
}
