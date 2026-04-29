export interface AIModel {
    id: string;
    label: string;
    provider: 'gemini' | 'groq' | 'anthropic' | 'openai';
    desc: string;
    badge: 'free' | 'cheap' | 'paid';
    icon: string;
    badgeColor: string;
}

export const AI_MODELS: AIModel[] = [
    {
        id:          'gemini-2.0-flash-exp',
        label:       'Gemini 2.0 Flash',
        provider:    'gemini',
        desc:        'Fast & free — Google AI',
        badge:       'free',
        icon:        'zap',
        badgeColor:  '#22C55E',
    },
    {
        id:          'llama-3.1-8b-instant',
        label:       'Llama 3.1 8B',
        provider:    'groq',
        desc:        'Fast & free — Meta via Groq',
        badge:       'free',
        icon:        'zap',
        badgeColor:  '#22C55E',
    },
    {
        id:          'claude-haiku-4-5-20251001',
        label:       'Claude Haiku',
        provider:    'anthropic',
        desc:        'High quality — Anthropic',
        badge:       'cheap',
        icon:        'diamond',
        badgeColor:  '#A3E635',
    },
    {
        id:          'gpt-4o-mini',
        label:       'GPT-4o Mini',
        provider:    'openai',
        desc:        'Reliable — OpenAI',
        badge:       'paid',
        icon:        'briefcase',
        badgeColor:  '#71717A',
    },
];

export const DEFAULT_MODEL = 'gemini-2.0-flash-exp';
