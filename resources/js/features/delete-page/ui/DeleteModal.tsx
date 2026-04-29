import Icon from '@/shared/icons/Icon';

export default function DeleteModal({ page, onConfirm, onCancel }) {
    if (!page) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(11,12,11,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
            <div style={{
                background: '#181A18', border: '1px solid #252825', borderRadius: 8,
                padding: 28, maxWidth: 380, width: '90%', margin: '0 20px',
            }}>
                <Icon name="alert-circle" size={28} color="#A3E635" />
                <div style={{ fontSize: 18, fontWeight: 600, color: '#F4F4F5', marginTop: 12 }}>Delete this page?</div>
                <div style={{ fontSize: 13, color: '#71717A', marginTop: 6 }}>
                    "{page.title}" will be permanently removed.
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
                    <button onClick={onCancel} style={{
                        height: 36, padding: '0 16px', borderRadius: 6,
                        background: '#111311', border: '1px solid #252825', color: '#D4D4D8',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    }}>Cancel</button>
                    <button onClick={onConfirm} style={{
                        height: 36, padding: '0 16px', borderRadius: 6,
                        background: '#EF4444', border: 'none', color: '#fff',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    }}>Delete</button>
                </div>
            </div>
        </div>
    );
}
