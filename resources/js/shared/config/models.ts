export interface AIModel {
    id: string;
    label: string;
    provider: 'gemini' | 'groq' | 'deepseek' | 'qwen';
    desc: string;
    icon: string;
    color: string;
}

export const AI_MODELS: AIModel[] = [
    {
        id:       'llama-3.1-8b-instant',
        label:    'Llama 3.1 8B',
        provider: 'groq',
        desc:     'Meta · Fast · Free',
        icon:     'zap',
        color:    '#22C55E',
    },
    {
        id:       'gemini-2.5-flash',
        label:    'Gemini 2.5 Flash',
        provider: 'gemini',
        desc:     'Google · Smart · Free',
        icon:     'diamond',
        color:    '#38BDF8',
    },
    {
        id:       'deepseek-chat',
        label:    'DeepSeek V3',
        provider: 'deepseek',
        desc:     'DeepSeek · Sharp · Free',
        icon:     'zap',
        color:    '#A3E635',
    },
    {
        id:       'qwen-turbo',
        label:    'Qwen Turbo',
        provider: 'qwen',
        desc:     'Alibaba · Capable · Free',
        icon:     'zap',
        color:    '#F59E0B',
    },
];

export const DEFAULT_MODEL = 'llama-3.1-8b-instant';
