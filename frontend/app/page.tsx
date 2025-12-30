'use client';

import UploadForm from '@/components/upload/UploadForm';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login via useAuth hook
  }

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 mb-4">
        <div className="flex justify-end">
          <button
            onClick={logout}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
      <UploadForm />
    </main>
  );
}
