import React from 'react';
import { Link } from 'react-router-dom';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Shield, 
    BarChart3, 
    Users, 
    CheckCircle2, 
    ArrowRight,
    Building2,
    Zap,
    Lock,
    Settings,
    Store,
    PieChart,
    Truck,
    UserCircle,
    BadgeCheck,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from '../lib/useTheme';

export default function Landing() {
    const { isDark, toggleDark } = useTheme();

    const features = [
        {
            title: 'Point of Sale',
            desc: 'Lightning fast checkout experience with real-time inventory sync and multiple payment support.',
            icon: ShoppingCart,
            color: 'text-cyan-600 dark:text-cyan-400',
            bg: 'bg-cyan-100 dark:bg-cyan-900/30'
        },
        {
            title: 'Inventory Management',
            desc: 'Track stock levels, set low-stock alerts, and manage suppliers across multiple locations.',
            icon: Package,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        },
        {
            title: 'Advanced Analytics',
            desc: 'Visual dashboards for sales trends, top products, and staff performance insights.',
            icon: BarChart3,
            color: 'text-violet-600 dark:text-violet-400',
            bg: 'bg-violet-100 dark:bg-violet-900/30'
        },
        {
            title: 'Supply Chain',
            desc: 'Manage purchase orders, suppliers, and incoming stock shipments in one place.',
            icon: Truck,
            color: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-100 dark:bg-orange-900/30'
        }
    ];

    const steps = [
        {
            title: 'Contact for Inquiry',
            desc: 'Reach out to the owner to get your dedicated workspace set up.',
            icon: Building2
        },
        {
            title: 'Personalized Setup',
            desc: 'We help you configure your products, categories, and staff roles.',
            icon: Settings
        },
        {
            title: 'Start Growing',
            desc: 'Access your secure dashboard and start managing your business efficiently.',
            icon: Store
        }
    ];

    const roles = [
        {
            role: 'Super Admin',
            desc: 'Full system control, tenant management, and global health monitoring.',
            icon: Shield
        },
        {
            role: 'Tenant Admin',
            desc: 'Complete control over their business, staff, inventory, and reports.',
            icon: BadgeCheck
        },
        {
            role: 'Staff / Cashier',
            desc: 'Focused access to POS, product lookup, and customer management.',
            icon: UserCircle
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-1.5 rounded-lg">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-slate-900 dark:text-slate-50 tracking-tight">PoSintory</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">How it Works</a>
                        <a href="#roles" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Roles</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => {
                                console.log('Landing button clicked!');
                                toggleDark();
                            }}
                            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <Link 
                            to="/login" 
                            className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
                        >
                            Sign In
                        </Link>
                        <a 
                            href="mailto:deantavas02@gmail.com?subject=PoSintory Inquiry" 
                            className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-teal-500/25"
                        >   
                            Inquire Now
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full" />
                    <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full" />
                </div>
                
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-8 border border-teal-100 dark:border-teal-500/20">
                        <Zap className="w-3 h-3" />
                        Smart POS & Inventory Solution
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-slate-50 tracking-tight mb-8">
                        The ultimate engine for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">your business growth.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        Inventra combines powerful point-of-sale functionality with robust inventory management and deep analytics. Built for modern retailers who demand speed and reliability.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="mailto:owner@inventra.com?subject=Inventra Inquiry" 
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-teal-500/30"
                        >
                            Inquire Now <ArrowRight className="w-4 h-4" />
                        </a>
                        <a 
                            href="#how-it-works" 
                            className="w-full sm:w-auto px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                        >
                            Watch Demo
                        </a>
                    </div>

                    <div className="mt-20 relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-transparent to-transparent z-10" />
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-2 shadow-2xl overflow-hidden">
                            <div className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden">
                                <div className="bg-slate-100 dark:bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-3 space-y-3">
                                            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-3 flex items-center gap-3">
                                                <LayoutDashboard className="w-5 h-5 text-teal-500" />
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dashboard</span>
                                            </div>
                                            <div className="bg-white dark:bg-slate-950 rounded-lg p-3 flex items-center gap-3">
                                                <ShoppingCart className="w-5 h-5 text-slate-400" />
                                                <span className="text-sm text-slate-500 dark:text-slate-500">Point of Sale</span>
                                            </div>
                                            <div className="bg-white dark:bg-slate-950 rounded-lg p-3 flex items-center gap-3">
                                                <Package className="w-5 h-5 text-slate-400" />
                                                <span className="text-sm text-slate-500 dark:text-slate-500">Inventory</span>
                                            </div>
                                            <div className="bg-white dark:bg-slate-950 rounded-lg p-3 flex items-center gap-3">
                                                <BarChart3 className="w-5 h-5 text-slate-400" />
                                                <span className="text-sm text-slate-500 dark:text-slate-500">Analytics</span>
                                            </div>
                                        </div>
                                        <div className="col-span-9 space-y-4">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-4 border border-teal-100 dark:border-teal-800/30">
                                                    <p className="text-xs text-teal-600 dark:text-teal-400 font-medium mb-1">Total Sales</p>
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">$24,580</p>
                                                    <p className="text-xs text-teal-500 flex items-center gap-1 mt-1">
                                                        <ArrowRight className="w-3 h-3 rotate-[-45deg]" /> +12.5% this month
                                                    </p>
                                                </div>
                                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/30">
                                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">Orders</p>
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">1,247</p>
                                                    <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                                                        <ArrowRight className="w-3 h-3 rotate-[-45deg]" /> +8.3% this month
                                                    </p>
                                                </div>
                                                <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-violet-100 dark:border-violet-800/30">
                                                    <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">Products</p>
                                                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">342</p>
                                                    <p className="text-xs text-slate-500 mt-1">In stock</p>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Sales Trend</p>
                                                    <div className="flex gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-teal-500" />
                                                        <span className="text-xs text-slate-500">This Month</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-end gap-2 h-32">
                                                    {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                                                        <div key={i} className="flex-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-t-lg" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">Built for performance</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">PoSintory provides a comprehensive suite of tools designed to scale with your business needs.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f) => (
                            <div key={f.title} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className={`${f.bg} ${f.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <f.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">{f.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">Simple 3-Step Setup</h2>
                        <p className="text-slate-600 dark:text-slate-400">Get your business up and running in minutes.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2" />
                        {steps.map((step, idx) => (
                            <div key={step.title} className="bg-white dark:bg-slate-950 p-8 rounded-3xl text-center border border-slate-200 dark:border-slate-800 relative shadow-sm">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white dark:border-slate-950">
                                    {idx + 1}
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
                                    <step.icon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Multi-Role Section */}
            <section id="roles" className="py-24 bg-gradient-to-br from-teal-600 to-cyan-700 dark:from-teal-900/50 dark:to-cyan-900/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-white">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                Designed for every level of your organization.
                            </h2>
                            <p className="text-teal-100 text-lg mb-12 max-w-xl">
                                Inventra provides specialized interfaces for different team members, ensuring security and focus where it matters most.
                            </p>
                            <div className="space-y-4">
                                {[
                                    'Secure Multi-Tenant Architecture',
                                    'Role-Based Access Control (RBAC)',
                                    'Real-time Data Synchronization',
                                    'Comprehensive Activity Logging'
                                ].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <div className="bg-white/20 p-1 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="font-medium text-white/90">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full grid gap-4">
                            {roles.map((role) => (
                                <div key={role.role} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center gap-6 group hover:bg-white/20 transition-all cursor-default">
                                    <div className="bg-white p-3 rounded-xl">
                                        <role.icon className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">{role.role}</h4>
                                        <p className="text-teal-100 text-sm">{role.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose PoSintory Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-6">Why Choose PoSintory?</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">Everything you need to run your business efficiently, all in one place.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Lightning-Fast POS",
                                desc: "Process sales in seconds with our optimized point-of-sale system. Perfect for busy retail and restaurant environments.",
                                icon: ShoppingCart,
                                color: "text-teal-600 dark:text-teal-400",
                                bg: "bg-teal-100 dark:bg-teal-900/30"
                            },
                            {
                                title: "Real-Time Inventory",
                                desc: "Never run out of stock again. Track inventory levels, get low-stock alerts, and manage suppliers with ease.",
                                icon: Package,
                                color: "text-emerald-600 dark:text-emerald-400",
                                bg: "bg-emerald-100 dark:bg-emerald-900/30"
                            },
                            {
                                title: "Powerful Analytics",
                                desc: "Make data-driven decisions with beautiful dashboards and reports that show you exactly how your business is performing.",
                                icon: BarChart3,
                                color: "text-violet-600 dark:text-violet-400",
                                bg: "bg-violet-100 dark:bg-violet-900/30"
                            },
                            {
                                title: "Role-Based Access",
                                desc: "Keep your data secure with fine-grained permissions for every team member, from owners to cashiers.",
                                icon: Shield,
                                color: "text-rose-600 dark:text-rose-400",
                                bg: "bg-rose-100 dark:bg-rose-900/30"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group flex items-start gap-4">
                                <div className={`${item.bg} ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-50 mb-8 tracking-tight">Ready to take control?</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">Be a Part of Inventra to power your daily growth and operations.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="mailto:owner@inventra.com?subject=Inventra Inquiry" 
                            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-teal-500/30 flex items-center justify-center gap-2 text-lg"
                        >
                            Contact for Inquiries <ArrowRight className="w-5 h-5" />
                        </a>
                        <Link 
                            to="/login" 
                            className="w-full sm:w-auto px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-lg"
                        >
                            Existing User? Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                                <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-1.5 rounded-lg">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-xl text-slate-900 dark:text-slate-50 tracking-tight">PoSintory</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                Empowering small to medium businesses with enterprise-grade POS and inventory solutions.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-6 uppercase text-xs tracking-widest">Product</h4>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><a href="#features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">How it Works</a></li>
                                <li><a href="#roles" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Roles</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-6 uppercase text-xs tracking-widest">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-6 uppercase text-xs tracking-widest">Support</h4>
                            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <li><a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-slate-600 dark:text-slate-400 text-sm">
                            © 2026 PoSintory. Built for modern businesses.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
