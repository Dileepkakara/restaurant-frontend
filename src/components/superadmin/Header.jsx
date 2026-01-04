// src/components/superadmin/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Menu, LogOut, ChevronDown } from "lucide-react";

const Header = ({ activeTab, setSidebarOpen }) => {
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('rb_user');
        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('rb_token');
        localStorage.removeItem('rb_user');
        window.location.href = '/admin/login'; // Redirect to admin login page
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SA';
    };

    return (
        <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4 z-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-5 h-5" />
                    </Button>
                    <h2 className="font-semibold text-lg capitalize">{activeTab}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
                    </Button>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                <span className="font-semibold text-sm text-white">
                                    {getInitials(user?.name)}
                                </span>
                            </div>
                            <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                    {user?.name || 'Super Admin'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">
                                        {user?.name || 'Super Admin'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.email || 'superadmin@example.com'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;