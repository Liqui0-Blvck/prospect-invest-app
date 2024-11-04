export interface Notes {
  id?: string;
  title: string;
  content: string;
  date?: string | Date | undefined
  leadID: string | string[];
  userID: string;
}