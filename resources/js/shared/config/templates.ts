export interface Template {
    id: string;
    label: string;
    desc: string;
    preview: string[];  // 3 color swatches
}

export const TEMPLATES: Template[] = [
    {
        id:      'dark',
        label:   'Dark',
        desc:    'Bold dark with lime accents',
        preview: ['#0B1A02', '#A3E635', '#F4F4F5'],
    },
    {
        id:      'light',
        label:   'Light',
        desc:    'Clean white corporate',
        preview: ['#FFFFFF', '#3B82F6', '#18181B'],
    },
    {
        id:      'bold',
        label:   'Bold',
        desc:    'High-contrast black & orange',
        preview: ['#09090B', '#F97316', '#FAFAFA'],
    },
];

export const DEFAULT_TEMPLATE = 'dark';
