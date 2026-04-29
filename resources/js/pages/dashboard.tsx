import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/widgets/AppLayout/AppLayout';
import PageCard from '@/widgets/PageCard/PageCard';
import DeleteModal from '@/features/delete-page/ui/DeleteModal';
import Icon from '@/shared/icons/Icon';
import { formatDate } from '@/shared/lib/utils';

function Sparkline({ color = '#A3E635' }) {
    const pts = [0,4,2,8,5,3,8,7,10,4,13,9,16,5,19,8,22,3,25,6,28,2,32,7];
    const pairs = [];
    for (let i = 0; i < pts.length; i += 2) pairs.push([pts[i], pts[i+1]]);
    const d = pairs.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${10 - p[1]}`).join(' ');
    return (
        <svg width={32} height={10} viewBox="0 0 32 10" style={{ display: 'block' }}>
            <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function Dashboard({ recentPages, stats }) {
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/pages/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    const formatted = (recentPages || []).map(p => ({
        ...p,
        date: formatDate(p.created_at),
    }));

    return (
        <AppLayout activePage="dashboard">
            <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>

                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: '#F4F4F5', letterSpacing: '-0.3px' }}>
                    Good morning, Ferry.
                </div>
                <div style={{ fontSize: 13, color: '#71717A', marginTop: 4 }}>Here's your activity at a glance.</div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                    {[
                        { icon: 'file',     label: 'Total Pages',  value: stats?.total || 0,   sub: `+${stats?.this_week || 0} this week`, subColor: '#22C55E' },
                        { icon: 'calendar', label: 'This Month',   value: stats?.this_month || 0, sparkline: true },
                        { icon: 'zap',      label: 'Avg. Speed',   value: '8.2s', badge: true },
                    ].map(card => (
                        <div key={card.label} style={{ background: '#111311', border: '1px solid #252825', borderRadius: 8, padding: 20, flex: 1 }}>
                            <Icon name={card.icon} size={20} color="#A3E635" />
                            <div style={{ fontSize: 11, fontWeight: 500, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.09em', marginTop: 14, marginBottom: 4 }}>{card.label}</div>
                            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 700, color: '#F4F4F5', lineHeight: 1 }}>{card.value}</div>
                            {card.sparkline && <div style={{ marginTop: 8 }}><Sparkline /></div>}
                            {card.sub && <div style={{ fontSize: 12, color: card.subColor || '#71717A', marginTop: 6 }}>{card.sub}</div>}
                            {card.badge && (
                                <div style={{ marginTop: 6 }}>
                                    <span style={{ background: '#1A2E05', color: '#A3E635', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500 }}>Fast</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Recent pages */}
                <div style={{ marginTop: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <span style={{ fontSize: 15, fontWeight: 600, color: '#F4F4F5' }}>Recent Pages</span>
                        <span onClick={() => router.visit('/pages')} style={{ fontSize: 13, color: '#A3E635', cursor: 'pointer' }}>View all →</span>
                    </div>

                    {formatted.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0' }}>
                            <div style={{ width: 160, height: 90, border: '1px dashed #252825', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#71717A' }}>+</div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#F4F4F5', marginTop: 16 }}>No pages yet</div>
                            <div style={{ fontSize: 13, color: '#71717A', marginTop: 6 }}>Generate your first page in seconds.</div>
                            <button onClick={() => router.visit('/generate')} style={{ marginTop: 20, height: 36, padding: '0 20px', borderRadius: 6, border: 'none', background: 'linear-gradient(135deg,#A3E635,#84CC16)', color: '#0B0C0B', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                Create Page →
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                            {formatted.map(page => (
                                <PageCard key={page.id} page={page}
                                    onPreview={() => router.visit(`/pages/${page.id}`)}
                                    onRegenerate={() => router.visit(`/pages/${page.id}/edit`)}
                                    onDelete={() => setDeleteTarget(page)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <DeleteModal page={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        </AppLayout>
    );
}
