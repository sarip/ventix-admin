// Example integration in Layout.tsx for Pages Router
// File: /src/pages/_components/Layout.tsx

import NotificationPopup from '@/components/NotificationPopup';
import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Get user ID dari cookies (sesuai dengan _app.tsx Anda)
        const id = getCookie('id');
        const key = localStorage.getItem('key');

        if (id) setUserId(Number(id));
        if (key) setToken(key);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header/Navbar */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold">BFM System</h1>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            <a href="/dashboard" className="text-gray-700 hover:text-gray-900">
                                Dashboard
                            </a>
                            <a href="/work_order" className="text-gray-700 hover:text-gray-900">
                                Work Orders
                            </a>
                            <a href="/ticket" className="text-gray-700 hover:text-gray-900">
                                Tickets
                            </a>
                        </nav>

                        {/* Right side - User info & Notifications */}
                        <div className="flex items-center gap-4">
                            {/* User info */}
                            <span className="text-sm text-gray-700">
                                {getCookie('fullname')}
                            </span>

                            {/* Notification Bell */}
                            {userId && token && (
                                <NotificationPopup
                                    userId={userId}
                                    token={token}
                                />
                            )}

                            {/* Logout button (optional) */}
                            <button className="text-red-600 hover:text-red-800 text-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Footer (optional) */}
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © 2025 BFM System. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
