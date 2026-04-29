import SalesPagePreview, { type SalesPageOutput } from '@/widgets/SalesPagePreview/SalesPagePreview';

interface PreviewPage {
    status: string;
    output_data: SalesPageOutput;
    input_data: Record<string, unknown>;
}

export default function Preview({ page }: { page: PreviewPage | null }) {
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
            <SalesPagePreview data={page.output_data} template={page.input_data?.template ?? 'dark'} />
        </>
    );
}
