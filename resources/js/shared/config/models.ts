export interface AIModel {
    id: string;
    label: string;
    provider: 'gemini' | 'groq' | 'openrouter';
    desc: string;
    icon: string;
    color: string;
}

export const AI_MODELS: AIModel[] = [
    {
        id:       'llama-3.1-8b-instant',
        label:    'Llama 3.1 8B',
        provider: 'groq',
        desc:     'Meta · Groq · Fastest',
        icon:     'zap',
        color:    '#22C55E',
    },
    {
        id:       'gemini-2.5-flash',
        label:    'Gemini 2.5 Flash',
        provider: 'gemini',
        desc:     'Google · AI Studio',
        icon:     'diamond',
        color:    '#38BDF8',
    },
    {
        id:       'openai/gpt-oss-20b:free',
        label:    'GPT OSS 20B',
        provider: 'openrouter',
        desc:     'OpenAI · OpenRouter · Fast',
        icon:     'zap',
        color:    '#A3E635',
    },
    {
        id:       'openai/gpt-oss-120b:free',
        label:    'GPT OSS 120B',
        provider: 'openrouter',
        desc:     'OpenAI · OpenRouter · Quality',
        icon:     'briefcase',
        color:    '#E2C87A',
    },
];

export const DEFAULT_MODEL = 'llama-3.1-8b-instant';
