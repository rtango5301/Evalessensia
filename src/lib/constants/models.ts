export interface ModelOption {
  id: string;
  name: string;
}

export interface ModelGroup {
  provider: string;
  models: ModelOption[];
}

export const MODEL_GROUPS: ModelGroup[] = [
  {
    provider: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4.1', name: 'GPT-4.1' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano' },
      { id: 'o3', name: 'o3' },
      { id: 'o3-mini', name: 'o3 Mini' },
      { id: 'o4-mini', name: 'o4 Mini' },
    ],
  },
  {
    provider: 'Anthropic',
    models: [
      { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet' },
      { id: 'claude-4-opus', name: 'Claude 4 Opus' },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
      { id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku' },
    ],
  },
  {
    provider: 'Google',
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
    ],
  },
  {
    provider: 'Meta',
    models: [
      { id: 'llama-4-maverick', name: 'Llama 4 Maverick' },
      { id: 'llama-4-scout', name: 'Llama 4 Scout' },
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B' },
    ],
  },
  {
    provider: 'Mistral',
    models: [
      { id: 'mistral-large', name: 'Mistral Large' },
      { id: 'mistral-small', name: 'Mistral Small' },
      { id: 'codestral', name: 'Codestral' },
    ],
  },
  {
    provider: 'DeepSeek',
    models: [
      { id: 'deepseek-r1', name: 'DeepSeek R1' },
      { id: 'deepseek-v3', name: 'DeepSeek V3' },
    ],
  },
];

export const ALL_MODELS: ModelOption[] = MODEL_GROUPS.flatMap((g) => g.models);
