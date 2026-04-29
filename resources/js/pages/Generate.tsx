import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/widgets/AppLayout/AppLayout';
import ProductForm from '@/features/generate-page/ui/ProductForm';
import Icon from '@/shared/icons/Icon';

export default function Generate({ prefill }) {
    const { data, setData, post, processing, errors } = useForm({
        name:        prefill?.name        || '',
        description: prefill?.description || '',
        features:    prefill?.features    || [],
        audience:    prefill?.audience    || '',
        usps:        prefill?.usps        || '',
        tone:        prefill?.tone        || 'professional',
        price:       prefill?.price       || '',
    });

    const handleSubmit = () => {
        // Serialize features array to comma-separated string for the backend
        post('/generate');
    };

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
