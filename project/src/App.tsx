import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DiaryProvider } from './context/DiaryContext';
import LoginPage from './pages/LoginPage';
import ListEntriesPage from './pages/ListEntriesPage';
import ViewEntryPage from './pages/ViewEntryPage';
import NewEntryPage from './pages/NewEntryPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // <AuthProvider>
      // <DiaryProvider>
        <Router>
          <div className="min-h-screen bg-[#1E1E1E] text-[#FFD700]">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  // <ProtectedRoute>
                    <ListEntriesPage />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/entry/:id"
                element={
                  // <ProtectedRoute>
                    <ViewEntryPage />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/new"
                element={
                  // <ProtectedRoute>
                    <NewEntryPage />
                  // </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      // </DiaryProvider>
    // </AuthProvider>
  );
}

export default App;