import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/widgets/AppLayout/AppLayout';
import ProductForm from '@/features/generate-page/ui/ProductForm';
import Icon from '@/shared/icons/Icon';
import { DEFAULT_MODEL } from '@/shared/config/models';

interface Prefill {
    name?: string;
    description?: string;
    features?: string[];
    audience?: string;
    usps?: string;
    tone?: string;
    price?: string;
    model?: string;
}

export default function Generate({ prefill }: { prefill?: Prefill }) {
    const { data, setData, post, processing, errors } = useForm({
        name:        prefill?.name        ?? '',
        description: prefill?.description ?? '',
        features:    prefill?.features    ?? [] as string[],
        audience:    prefill?.audience    ?? '',
        usps:        prefill?.usps        ?? '',
        tone:        prefill?.tone        ?? 'professional',
        price:       prefill?.price       ?? '',
        model:       prefill?.model       ?? DEFAULT_MODEL,
    });

    const handleSubmit = () => post('/generate');

    return (
        <AppLayout activePage="generate">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ padding: '16px 32px 0', flexShrink: 0 }}>
                    <button onClick={() => router.visit('/dashboard')} style={{
                        background: 'none', border: 'none', color: '#71717A', cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13,
                        padding: 0, fontFamily: 'Inter, sans-serif',
                    }}>
                        <Icon name="arrow-left" size={18} color="#71717A" /> Back
                    </button>
                </div>
                <ProductForm
                    data={data}
                    setData={setData}
                    onSubmit={handleSubmit}
                    processing={processing}
                    errors={errors}
                />
            </div>
        </AppLayout>
    );
}
