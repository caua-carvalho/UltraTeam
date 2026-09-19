import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { Navbar } from '@/components/Navbar';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PlanningPage } from '@/pages/PlanningPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { NewActivityPage } from '@/pages/NewActivityPage';
import { EditActivityPage } from '@/pages/EditActivityPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { Loading } from '@/components/ui/Loading';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <Loading fullScreen message="AUTENTICANDO OPERADOR..." />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="bg-[#060709] text-[#e3e2e5] min-h-screen flex flex-col antialiased selection:bg-[#00FF66] selection:text-[#060709]">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <DashboardPage />
                </ProtectedLayout>
              }
            />

            <Route
              path="/planning"
              element={
                <ProtectedLayout>
                  <PlanningPage />
                </ProtectedLayout>
              }
            />

            <Route
              path="/activities"
              element={
                <ProtectedLayout>
                  <ActivitiesPage />
                </ProtectedLayout>
              }
            />

            <Route
              path="/activities/new"
              element={
                <ProtectedLayout>
                  <NewActivityPage />
                </ProtectedLayout>
              }
            />

            <Route
              path="/activities/:id"
              element={
                <ProtectedLayout>
                  <EditActivityPage />
                </ProtectedLayout>
              }
            />

            <Route
              path="/goals"
              element={
                <ProtectedLayout>
                  <GoalsPage />
                </ProtectedLayout>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};
