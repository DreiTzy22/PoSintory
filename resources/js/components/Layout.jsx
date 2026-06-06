import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Tag,
    Truck,
    Receipt,
    BarChart3,
    Users,
    Factory,
    Shield,
    Settings,
    LogOut,
    Sun,
    Moon,
    Menu
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Layout({ children }) {
    const location = useLocation();
    const [isDark, setIsDark] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDark = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const displayName = 'Admin User';
    const displayRole = 'Administrator';

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Point of Sale', path: '/pos', icon: ShoppingCart },
        { name: 'Products', path: '/products', icon: Tag },
        { name: 'Inventory', path: '/inventory', icon: Package },
        { name: 'Purchasing', path: '/purchasing', icon: Truck },
        { name: 'Sales', path: '/sales', icon: Receipt },
        { name: 'Reports', path: '/reports', icon: BarChart3 },
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Suppliers', path: '/suppliers', icon: Factory },
        { name: 'Users & Roles', path: '/users', icon: Shield },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    // If it's the login page, don't show the layout shell
    if (location.pathname === '/login') {
        return children;
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out",
                !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
            )}>
                <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
                    <span className={cn("text-xl font-bold text-indigo-600 dark:text-indigo-400", !isSidebarOpen && "lg:hidden")}>POS<span className="text-zinc-900 dark:text-zinc-100">invent</span></span>
                    {/* Compact logo for collapsed state */}
                    {!isSidebarOpen && <span className="hidden lg:block text-xl font-bold text-indigo-600 dark:text-indigo-400 mx-auto">P</span>}
                </div>
                
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path || (location.pathname === '/' && item.path === '/dashboard');
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive 
                                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100"
                                )}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className={cn(!isSidebarOpen && "lg:hidden")}>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={cn(!isSidebarOpen && "lg:hidden")}>Log out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300 ease-in-out",
                isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
            )}>
                {/* Header */}
                <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sm:px-6 z-40 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleDark}
                            className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                AD
                            </div>
                            <div className="hidden sm:block text-sm">
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">{displayName}</p>
                                <p className="text-zinc-500 dark:text-zinc-400 text-xs">{displayRole}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden p-6 sm:p-8">
                    {children}
                </main>
            </div>
            
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
