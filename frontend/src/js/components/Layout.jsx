import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
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
    Menu,
    Building2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast, confirmAction } from '../lib/swal';

export default function Layout({ children }) {
    const location = useLocation();
    
    // If it's a no-layout path, return children immediately without any setup!
    const noLayoutPaths = ['/', '/login', '/register'];
    if (noLayoutPaths.includes(location.pathname)) {
        console.log('🔓 Login/landing page - skipping layout setup');
        return children;
    }

    // --- ALL LAYOUT STATE AND EFFECTS ONLY RUN WHEN NOT ON NO-LAYOUT PATHS! ---
    const [isDark, setIsDark] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [storedRole, setStoredRole] = useState(() => localStorage.getItem('user_role'));

    useEffect(() => {
        console.log('=== MOUNTING Layout ===');
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
        
        loadUser();
    }, []);

    const loadUser = async () => {
        console.log('=== loadUser CALLED ===');
        setIsLoading(true);
        
        const storedRoleBefore = localStorage.getItem('user_role');
        const storedUserBefore = localStorage.getItem('user');
        const authToken = localStorage.getItem('auth_token');
        
        console.log('Stored role before API call:', storedRoleBefore);
        console.log('Stored user before API call:', storedUserBefore ? JSON.parse(storedUserBefore) : null);
        console.log('Auth token present:', !!authToken);
        
        // First, try to use stored user data while we fetch fresh data
        let hasStoredData = false;
        if (storedUserBefore) {
            try {
                const parsedUser = JSON.parse(storedUserBefore);
                console.log('📦 Using stored user for initial state:', parsedUser);
                setUser(parsedUser);
                if (parsedUser.role) {
                    setStoredRole(parsedUser.role);
                }
                hasStoredData = true;
            } catch (e) {
                console.error('Failed to parse stored user', e);
            }
        }
        
        // Only try to fetch from API if we actually have a token
        if (authToken) {
            try {
                const res = await api.get('/user');
                console.log('✅ User API SUCCESS:', res.data);
                
                setUser(res.data);
                
                if (res.data.role) {
                    console.log('Setting stored role to:', res.data.role);
                    localStorage.setItem('user_role', res.data.role);
                    localStorage.setItem('user', JSON.stringify(res.data));
                    setStoredRole(res.data.role);
                }
            } catch (e) {
                console.error('❌ Failed to load user from API', e);
                // Only redirect to login if we don't have any stored data
                if (!hasStoredData && e.response?.status === 401) {
                    console.log('⚠️ No stored data and 401 - redirecting to login');
                    localStorage.clear();
                    setUser(null);
                    setStoredRole(null);
                    window.location.href = '/login';
                }
            }
        }
        
        console.log('Setting isLoading to false');
        setIsLoading(false);
    };

    const toggleDark = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const currentRole = user?.role || storedRole;
    console.log('💡 COMPUTED currentRole:', currentRole, '| user.role:', user?.role, '| storedRole:', storedRole);
    
    const displayName = user?.name || 'User';
    const displayRole = !currentRole 
        ? 'Loading...' 
        : (currentRole === 'super_admin' ? 'System Administrator' : (user?.tenant?.name || 'Business Owner'));

    const commonItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];

    const tenantItems = [
        { name: 'Point of Sale', path: '/tenant/pos', icon: ShoppingCart },
        { name: 'Products', path: '/tenant/products', icon: Tag },
        { name: 'Inventory', path: '/tenant/inventory', icon: Package },
        { name: 'Purchasing', path: '/tenant/purchasing', icon: Truck },
        { name: 'Sales', path: '/tenant/sales', icon: Receipt },
        { name: 'Reports', path: '/tenant/reports', icon: BarChart3 },
        { name: 'Customers', path: '/tenant/customers', icon: Users },
        { name: 'Suppliers', path: '/tenant/suppliers', icon: Factory },
        { name: 'Users & Roles', path: '/tenant/users', icon: Shield },
        { name: 'Settings', path: '/tenant/settings', icon: Settings },
        { name: 'Support', path: '/tenant/support', icon: Receipt }, // Reusing icon for now
    ];

    const cashierItems = [
        { name: 'Dashboard', path: '/cashier/dashboard', icon: LayoutDashboard },
        { name: 'Point of Sale', path: '/cashier/pos', icon: ShoppingCart },
        { name: 'Support', path: '/cashier/support', icon: Receipt },
    ];

    const adminItems = [
        { name: 'Dashboard', path: '/superadmin/dashboard', icon: LayoutDashboard },
        { name: 'Tenants', path: '/superadmin/tenants', icon: Building2 },
        { name: 'Users', path: '/superadmin/users', icon: Users },
        { name: 'Support Tickets', path: '/superadmin/tickets', icon: Receipt },
        { name: 'System Health', path: '/superadmin/health', icon: Shield },
    ];

    const navItems = useMemo(() => {
        console.log('\n========== RECALCULATING navItems ==========');
        console.log('isLoading:', isLoading);
        console.log('currentRole:', currentRole);
        console.log('user.role:', user?.role);
        console.log('storedRole:', storedRole);
        
        let items;
        
        if (isLoading) {
            items = [];
            console.log('🔄 isLoading - empty items');
        } else if (currentRole === 'super_admin') {
            items = adminItems;
            console.log('✅ Using SUPER ADMIN navItems:', items.map(i => i.name));
        } else if (currentRole === 'cashier') {
            items = cashierItems;
            console.log('✅ Using CASHIER navItems:', items.map(i => i.name));
        } else {
            items = [{ name: 'Dashboard', path: '/tenant/dashboard', icon: LayoutDashboard }, ...tenantItems];
            console.log('✅ Using TENANT navItems:', items.map(i => i.name));
        }
        
        console.log('FINAL navItems count:', items.length);
        return items;
    }, [isLoading, currentRole, user, storedRole]);

    const handleLogout = async () => {
        const result = await confirmAction({
            title: 'Log Out',
            text: 'Are you sure you want to log out of your account?'
        });
        if (!result.isConfirmed) return;

        try {
            await api.post('/logout');
        } catch (e) {
            console.error('Logout failed', e);
        }
        
        // Clear ALL localStorage data
        localStorage.clear();
        // Reset state
        setUser(null);
        setStoredRole(null);
        toast.fire({
            icon: 'success',
            title: 'Logged out successfully'
        });
        // Redirect to login
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out",
                !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
            )}>
                <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
                    <div className={cn("flex items-center gap-2", !isSidebarOpen && "lg:hidden")}>
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]">
                            {displayRole === 'System Administrator' ? 'System Console' : (user?.tenant?.name || 'POSinvent')}
                        </span>
                    </div>
                    {/* Compact logo for collapsed state */}
                    {!isSidebarOpen && (
                        <div className="hidden lg:flex items-center justify-center w-full">
                            <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                    )}
                </div>
                
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
                    {isLoading && (
                        <div className="p-4 text-center">
                            <div className="w-6 h-6 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <p className="mt-2 text-xs text-zinc-500">Loading...</p>
                        </div>
                    )}
                    
                    {!isLoading && navItems.length === 0 && (
                        <div className="p-4 text-center">
                            <p className="text-xs text-zinc-500">No menu items available</p>
                            <p className="mt-1 text-[10px] text-zinc-400">Role: {currentRole || 'not set'}</p>
                        </div>
                    )}
                    
                    {!isLoading && navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
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
                    <button 
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className={cn(!isSidebarOpen && "lg:hidden")}>Log Out</span>
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
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{displayName}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{displayRole}</p>
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Main Content */}
                <main className="p-4 sm:p-6 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
