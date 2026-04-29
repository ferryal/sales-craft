import SalesPagePreview from '@/widgets/SalesPagePreview/SalesPagePreview';

export default function Preview({ page }) {
    if (!page || page.status !== 'completed') {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0B0C0B', fontFamily: 'Inter, sans-serif', color: '#71717A', fontSize: 14 }}>
                Page not available.
            </div>
        );
    }

    return (
        <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
            <SalesPagePreview data={page.output_data} />
        </>
    );
}
