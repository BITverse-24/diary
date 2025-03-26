import React, { createContext, useContext, useState } from 'react';
import { DiaryEntry } from '../types';

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  deleteEntry: (id: string) => void;
  updateEntry: (id: string, entry: Partial<DiaryEntry>) => void;
}

const DiaryContext = createContext<DiaryContextType | null>(null);

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  const addEntry = (entry: Omit<DiaryEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setEntries([...entries, newEntry]);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const updateEntry = (id: string, updatedEntry: Partial<DiaryEntry>) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    ));
  };

  return (
    <DiaryContext.Provider value={{ entries, addEntry, deleteEntry, updateEntry }}>
      {children}
    </DiaryContext.Provider>
  );
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};