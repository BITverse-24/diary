export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  lastModified: string;
  characters: number;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => void;
  logout: () => void;
}