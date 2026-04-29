import { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import Icon from '@/shared/icons/Icon';

const NAV_ITEMS = [
    { id: 'dashboard', route: '/dashboard', icon: 'dashboard',   label: 'Dashboard' },
    { id: 'generate',  route: '/generate',  icon: 'plus-circle', label: 'New Page'  },
    { id: 'saved',     route: '/pages',     icon: 'file',        label: 'My Pages'  },
    { id: 'settings',  route: '/settings',  icon: 'cog',         label: 'Settings'  },
];

function AvatarDropdown({ initials, name, email, align = 'bottom' }: {
    initials: string; name: string; email?: string; align?: 'bottom' | 'top';
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        setOpen(false);
        router.post('/logout');
    };

    const dropdownStyle: React.CSSProperties = {
        position: 'absolute',
        [align === 'bottom' ? 'top' : 'bottom']: '100%',
        right: 0,
        marginTop: align === 'bottom' ? 6 : 0,
        marginBottom: align === 'top' ? 6 : 0,
        width: 200,
        background: '#181A18',
        border: '1px solid #252825',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: 50,
        overflow: 'hidden',
    };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <div
                onClick={() => setOpen(o => !o)}
                style={{
                    width: 28, height: 28, borderRadius: '50%', background: '#A3E635',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#0B0C0B', cursor: 'pointer',
                    outline: open ? '2px solid #A3E635' : 'none',
                    outlineOffset: 2,
                    transition: 'outline 0.1s',
                }}
            >{initials}</div>

            {open && (
                <div style={dropdownStyle}>
                    {/* User info header */}
                    <div style={{ padding: '12px 14px', borderBottom: '1px solid #252825' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F4F4F5' }}>{name}</div>
                        {email && <div style={{ fontSize: 11, color: '#71717A', marginTop: 2 }}>{email}</div>}
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: '4px 0' }}>
                        {[
                            { label: 'Settings',  icon: 'cog',      action: () => { setOpen(false); router.visit('/settings'); } },
                            { label: 'Dashboard', icon: 'dashboard', action: () => { setOpen(false); router.visit('/dashboard'); } },
                        ].map(item => (
                            <DropdownItem key={item.label} label={item.label} icon={item.icon} onClick={item.action} />
                        ))}
                    </div>

                    <div style={{ height: 1, background: '#252825' }} />

                    {/* Logout */}
                    <div style={{ padding: '4px 0' }}>
                        <DropdownItem label="Sign out" icon="x" onClick={handleLogout} danger />
                    </div>
                </div>
            )}
        </div>
    );
}

function DropdownItem({ label, icon, onClick, danger = false }: {
    label: string; icon: string; onClick: () => void; danger?: boolean;
}) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                width: '100%', height: 36, display: 'flex', alignItems: 'center', gap: 10,
                padding: '0 14px', background: hov ? '#252825' : 'transparent',
                border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                fontSize: 13, color: danger ? (hov ? '#EF4444' : '#71717A') : (hov ? '#F4F4F5' : '#D4D4D8'),
                transition: 'background 0.1s, color 0.1s', textAlign: 'left',
            }}
        >
            <Icon name={icon} size={15} color={danger ? (hov ? '#EF4444' : '#71717A') : (hov ? '#F4F4F5' : '#71717A')} />
            {label}
        </button>
    );
}

function NavItem({ item, active }: { item: typeof NAV_ITEMS[0]; active: boolean }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={() => router.visit(item.route)}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{
                width: '100%', height: 44,
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0 16px 0 22px',
                background: active ? '#181A18' : hov ? '#111311' : 'transparent',
                border: 'none', cursor: 'pointer', position: 'relative',
                color: active ? '#A3E635' : '#71717A',
                fontFamily: 'Inter, sans-serif', fontSize: 14,
                transition: 'background 0.12s, color 0.12s',
            }}
        >
            {active && (
                <div style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: 2, height: 20, background: '#A3E635', borderRadius: '0 2px 2px 0',
                }} />
            )}
            <Icon name={item.icon} size={18} color={active ? '#A3E635' : hov ? '#A0A0A0' : '#71717A'} />
            <span style={{ fontWeight: active ? 500 : 400 }}>{item.label}</span>
        </button>
    );
}

function Sidebar({ activePage }: { activePage: string }) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;
    const user = auth?.user;
    const initials = user?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <div style={{
            width: 248, background: '#0B0C0B', borderRight: '1px solid #252825',
            display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%',
        }}>
            <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#F4F4F5', letterSpacing: '-0.2px' }}>SalesCraft</span>
                <Icon name="rhombus" size={14} color="#A3E635" />
            </div>

            <div style={{ height: 1, background: '#252825' }} />

            <nav style={{ flex: 1, padding: '8px 0' }}>
                {NAV_ITEMS.map(item => (
                    <NavItem key={item.id} item={item} active={activePage === item.id} />
                ))}
            </nav>

            <div style={{ height: 1, background: '#252825' }} />

            {/* User row with dropdown */}
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
                <AvatarDropdown initials={initials} name={user?.name || 'User'} email={user?.email} align="top" />
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#F4F4F5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user?.name || 'User'}
                    </div>
                </div>
                <span style={{
                    fontSize: 10, fontWeight: 600, color: '#A3E635',
                    background: '#1A2E05', borderRadius: 4, padding: '2px 7px', flexShrink: 0,
                }}>Pro</span>
            </div>
        </div>
    );
}

function Topbar({ activePage }: { activePage: string }) {
    const label = NAV_ITEMS.find(n => n.id === activePage)?.label
        || activePage?.charAt(0).toUpperCase() + activePage?.slice(1)
        || '';
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;
    const user = auth?.user;
    const initials = user?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

    return (
        <div style={{
            height: 56, background: '#0B0C0B', borderBottom: '1px solid #252825',
            display: 'flex', alignItems: 'center', padding: '0 24px',
            justifyContent: 'space-between', flexShrink: 0,
        }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: '#71717A' }}>{label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
                    <Icon name="bell" size={20} color="#71717A" />
                </button>
                <AvatarDropdown initials={initials} name={user?.name || 'User'} email={user?.email} align="bottom" />
            </div>
        </div>
    );
}

export default function AppLayout({ children, activePage }: {
    children: React.ReactNode;
    activePage: string;
}) {
    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Sidebar activePage={activePage} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                <Topbar activePage={activePage} />
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
