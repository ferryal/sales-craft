import { useState } from 'react';
import Icon from '@/shared/icons/Icon';

export default function SearchInput({ value, onChange, placeholder = 'Search pages…' }) {
    const [focused, setFocused] = useState(false);

    return (
        <div style={{ position: 'relative', width: 300, flexShrink: 0 }}>
            <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Icon name="search" size={16} color="#71717A" />
            </div>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: '100%', height: 36, borderRadius: 6, background: '#111311',
                    border: `1px solid ${focused ? '#A3E635' : '#252825'}`,
                    boxShadow: focused ? '0 0 0 2px rgba(163,230,53,0.2)' : 'none',
                    color: '#F4F4F5', fontSize: 13,
                    paddingLeft: 34, paddingRight: 12,
                    fontFamily: 'Inter, sans-serif', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
            />
        </div>
    );
}
