import { useState } from 'react';
import Icon from '@/shared/icons/Icon';

export default function ExportButton({ pageId }) {
    const [hov, setHov] = useState(false);

    const handleExport = () => {
        window.location.href = `/pages/${pageId}/export`;
    };

    return (
        <button
            onClick={handleExport}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                width: '100%', height: 36, borderRadius: 6, background: 'transparent',
                border: `1px solid ${hov ? '#A3E635' : '#252825'}`,
                color: hov ? '#A3E635' : '#D4D4D8',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, padding: '0 12px', fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.15s, color 0.15s',
            }}
        >
            <Icon name="download" size={16} color={hov ? '#A3E635' : '#71717A'} />
            Export HTML
        </button>
    );
}
