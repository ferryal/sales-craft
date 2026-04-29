import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/widgets/AppLayout/AppLayout';
import PageCard from '@/widgets/PageCard/PageCard';
import DeleteModal from '@/features/delete-page/ui/DeleteModal';
import SearchInput from '@/features/search-pages/ui/SearchInput';
import Icon from '@/shared/icons/Icon';
import { TONE_META } from '@/shared/config/tones';
import { formatDate } from '@/shared/lib/utils';

interface SalesPageSummary {
    id: number;
    title: string;
    tone: string;
    status: string;
    created_at: string;
    date?: string;
}

type ToneKey = keyof typeof TONE_META;

export default function SalesPagesIndex({ pages: initialPages }: { pages: SalesPageSummary[] }) {
    const [pages, setPages] = useState<SalesPageSummary[]>(
        (initialPages || []).map(p => ({ ...p, date: formatDate(p.created_at) }))
    );
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState<SalesPageSummary | null>(null);

    const filtered = pages.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchTone = activeFilter === 'all' || p.tone === activeFilter;
        return matchSearch && matchTone;
    });

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/pages/${deleteTarget.id}`, {
            onSuccess: () => {
                setPages(prev => prev.filter(p => p.id !== deleteTarget.id));
                setDeleteTarget(null);
            },
        });
    };

    const filters: string[] = ['all', 'professional', 'casual', 'aggressive', 'luxury'];

    return (
        <AppLayout activePage="saved">
            <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                    <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 22, fontWeight: 700, color: '#F4F4F5', margin: 0, letterSpacing: '-0.3px' }}>
                        My Pages
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, color: '#71717A', background: '#181A18', border: '1px solid #252825', borderRadius: 6, padding: '4px 12px' }}>
                            {pages.length} pages
                        </span>
                        <button onClick={() => router.visit('/generate')} style={{
                            height: 36, padding: '0 16px', borderRadius: 6, border: 'none',
                            background: 'linear-gradient(135deg,#A3E635,#84CC16)',
                            color: '#0B0C0B', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}>New Page →</button>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    <SearchInput value={search} onChange={setSearch} />
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {filters.map(f => {
                            const isActive = activeFilter === f;
                            const meta = TONE_META[f as ToneKey];
                            return (
                                <button key={f} onClick={() => setActiveFilter(f)} style={{
                                    height: 32, padding: '0 12px', borderRadius: 6, cursor: 'pointer',
                                    fontSize: 12, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                                    background: isActive ? (meta ? meta.bg : '#1A2E05') : '#111311',
                                    border: `1px solid ${isActive ? (meta ? meta.color : '#A3E635') : '#252825'}`,
                                    color: isActive ? (meta ? meta.color : '#A3E635') : '#71717A',
                                    transition: 'all 0.12s',
                                }}>
                                    {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            );
                        })}
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: '#71717A', fontSize: 13 }}>
                        Newest <Icon name="chevron-down" size={16} color="#71717A" />
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 160, height: 90, border: '1px dashed #252825', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#71717A' }}>+</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#F4F4F5', marginTop: 16 }}>
                            {search ? 'No results found.' : 'No pages yet'}
                        </div>
                        <div style={{ fontSize: 13, color: '#71717A', marginTop: 6 }}>
                            {search ? 'Try a different search or filter.' : 'Your generated pages will appear here.'}
                        </div>
                        {!search && (
                            <button onClick={() => router.visit('/generate')} style={{ marginTop: 20, height: 36, padding: '0 20px', borderRadius: 6, border: 'none', background: 'linear-gradient(135deg,#A3E635,#84CC16)', color: '#0B0C0B', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                                Generate First Page →
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="responsive-grid">
                        {filtered.map((page: SalesPageSummary) => (
                            <PageCard key={page.id} page={page}
                                onPreview={() => router.visit(`/pages/${page.id}`)}
                                onRegenerate={() => router.visit(`/pages/${page.id}/edit`)}
                                onDelete={() => setDeleteTarget(page)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <DeleteModal page={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
        </AppLayout>
    );
}
