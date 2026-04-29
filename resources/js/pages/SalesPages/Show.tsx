import { useState } from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/widgets/AppLayout/AppLayout';
import SalesPagePreview from '@/widgets/SalesPagePreview/SalesPagePreview';
import DeleteModal from '@/features/delete-page/ui/DeleteModal';
import ExportButton from '@/features/export-html/ui/ExportButton';
import Icon from '@/shared/icons/Icon';
import { TONE_META } from '@/shared/config/tones';
import { formatDate } from '@/shared/lib/utils';

interface SalesPageOutput {
    headline: string;
    sub_headline: string;
    description: string;
    benefits: string[];
    features: { title: string; description: string }[];
    testimonials: { name: string; role: string; quote: string }[];
    pricing: { price: string; billing: string; cta_text: string; urgency: string };
    cta: { button_text: string; supporting_text: string };
}

interface SalesPage {
    id: number;
    title: string;
    tone: string;
    status: string;
    created_at: string;
    output_data: SalesPageOutput;
    input_data: Record<string, unknown>;
}

function SidebarBtn({ icon, label, danger = false, onClick }: { icon: string; label: string; danger?: boolean; onClick: () => void }) {
    const [h, setH] = useState(false);
    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
            style={{
                width: '100%', height: 36, borderRadius: 6, background: 'transparent',
                border: `1px solid ${h ? (danger ? '#EF4444' : '#A3E635') : '#252825'}`,
                color: h ? (danger ? '#EF4444' : '#A3E635') : '#D4D4D8',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, padding: '0 12px', fontFamily: 'Inter, sans-serif',
                transition: 'border-color 0.15s, color 0.15s',
            }}
        >
            <Icon name={icon} size={16} color={h ? (danger ? '#EF4444' : '#A3E635') : '#71717A'} />
            {label}
        </button>
    );
}

function CopyBtn({ text, label, icon }: { text: string; label: string; icon: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            color: copied ? '#A3E635' : '#71717A', fontSize: 13,
            padding: '8px 0', fontFamily: 'Inter, sans-serif', transition: 'color 0.15s',
        }}>
            <Icon name={copied ? 'check-circle' : icon} size={16} color={copied ? '#A3E635' : '#71717A'} />
            {copied ? 'Copied!' : label}
        </button>
    );
}

export default function SalesPagesShow({ page }: { page: SalesPage }) {
    const [device, setDevice] = useState('desktop');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showDelete, setShowDelete] = useState(false);

    const tone = TONE_META[page.tone as keyof typeof TONE_META] || TONE_META.professional;

    const handleDelete = () => {
        router.delete(`/pages/${page.id}`, { onSuccess: () => router.visit('/pages') });
    };

    return (
        <AppLayout activePage="saved">
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Sidebar */}
                {sidebarOpen && (
                    <div style={{ width: 280, background: '#0B0C0B', borderRight: '1px solid #252825', padding: 20, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
                        <button onClick={() => router.visit('/pages')} style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: 0, fontFamily: 'Inter, sans-serif' }}>
                            <Icon name="arrow-left" size={16} color="#71717A" /> Pages
                        </button>

                        <div style={{ marginTop: 20 }}>
                            <div style={{ fontSize: 10, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Details</div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#F4F4F5' }}>{page.title}</div>
                            <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 500, color: tone.color, background: tone.bg, borderRadius: 4, padding: '2px 8px' }}>
                                {tone.label}
                            </span>
                            <div style={{ fontSize: 11, color: '#71717A', marginTop: 8 }}>Generated {formatDate(page.created_at)}</div>
                        </div>

                        <div style={{ height: 1, background: '#252825', margin: '20px 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <SidebarBtn icon="refresh" label="Re-generate" onClick={() => router.visit(`/pages/${page.id}/edit`)} />
                            <ExportButton pageId={page.id} />

                            {/* F5: Copy headline to clipboard */}
                            <CopyBtn
                                text={page.output_data?.headline ?? ''}
                                label="Copy headline"
                                icon="rhombus"
                            />

                            {/* Copy public preview link */}
                            <CopyBtn
                                text={`${window.location.origin}/preview/${page.id}`}
                                label="Copy preview link"
                                icon="link"
                            />

                            <SidebarBtn icon="trash" label="Delete" danger onClick={() => setShowDelete(true)} />
                        </div>

                        <div style={{ flex: 1 }} />
                        <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontFamily: 'Inter, sans-serif', padding: 0, marginTop: 16 }}>
                            <Icon name="chevron-left" size={20} color="#71717A" /> Collapse
                        </button>
                    </div>
                )}

                {/* Preview panel */}
                <div style={{ flex: 1, background: '#111311', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Toolbar */}
                    <div style={{ height: 44, borderBottom: '1px solid #252825', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0 }}>
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer', display: 'inline-flex', padding: 4 }}>
                                <Icon name="chevron-right" size={20} color="#71717A" />
                            </button>
                        )}
                        <span style={{ fontSize: 11, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preview</span>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
                            {[{ id: 'desktop', icon: 'monitor' }, { id: 'mobile', icon: 'smartphone' }].map(d => (
                                <button key={d.id} onClick={() => setDevice(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, color: device === d.id ? '#A3E635' : '#71717A', transition: 'color 0.12s' }}>
                                    <Icon name={d.icon} size={18} color={device === d.id ? '#A3E635' : '#71717A'} />
                                </button>
                            ))}
                        </div>
                        <a
                            href={`/preview/${page.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ fontSize: 12, color: '#71717A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                            <Icon name="eye" size={14} color="#71717A" /> Full page
                        </a>
                    </div>

                    {/* Browser chrome */}
                    <div style={{ height: 36, background: '#181A18', borderBottom: '1px solid #252825', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0 }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {['#EF4444','#F59E0B','#22C55E'].map(c => <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
                        </div>
                        <div style={{ flex: 1, maxWidth: 360, height: 22, background: '#111311', border: '1px solid #252825', borderRadius: 4, display: 'flex', alignItems: 'center', padding: '0 10px', overflow: 'hidden' }}>
                            <span style={{ fontSize: 11, color: '#71717A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {window.location.origin}/preview/{page.id}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: device === 'mobile' ? '24px 0' : 0, background: device === 'mobile' ? '#0D0E0D' : '#111311' }}>
                        <div style={{ width: device === 'mobile' ? 390 : '100%', maxWidth: '100%', boxShadow: device === 'mobile' ? '0 0 0 1px #252825' : 'none' }}>
                            <SalesPagePreview data={page.output_data} />
                        </div>
                    </div>
                </div>
            </div>

            <DeleteModal page={showDelete ? page : null} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
        </AppLayout>
    );
}
