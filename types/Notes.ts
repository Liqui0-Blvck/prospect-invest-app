export interface Notes {
  id?: string;
  title: string;
  content: string;
  date?: string;
  leadId: string | string[];
  creatorId?: string;
}