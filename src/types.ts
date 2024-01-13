export type Run = {
  name: string;
  timestamp: number;
  prompt: string;
  system?: string;
  responses: Record<string, { text: string; time: number }>;
};
