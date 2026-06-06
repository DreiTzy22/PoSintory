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
    BadgeCheck
} from 'lucide-react';

export default function Landing() {
    const features = [
        {
            title: 'Point of Sale',
            desc: 'Lightning fast checkout experience with real-time inventory sync and multiple payment support.',
            icon: ShoppingCart,
            color: 'text-blue-600',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            title: 'Inventory Management',
            desc: 'Track stock levels, set low-stock alerts, and manage suppliers across multiple locations.',
            icon: Package,
            color: 'text-emerald-600',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        },
        {
            title: 'Advanced Analytics',
            desc: 'Visual dashboards for sales trends, top products, and staff performance insights.',
            icon: BarChart3,
            color: 'text-purple-600',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            title: 'Supply Chain',
            desc: 'Manage purchase orders, suppliers, and incoming stock shipments in one place.',
            icon: Truck,
            color: 'text-amber-600',
            bg: 'bg-amber-100 dark:bg-amber-900/30'
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
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">PoSintory</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How it Works</a>
                        <a href="#roles" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Roles</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/login" 
                            className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
                        >
                            Sign In
                        </Link>
                        <a 
                            href="mailto:owner@posintory.com?subject=PoSintory Inquiry" 
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-500/20"
                        >
                            Inquire Now
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full" />
                </div>
                
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-8 border border-indigo-100 dark:border-indigo-500/20">
                        <Zap className="w-3 h-3" />
                        Smart POS & Inventory Solution
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-8">
                        The ultimate engine for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">your business growth.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                        PoSintory combines powerful point-of-sale functionality with robust inventory management and deep analytics. Built for modern retailers who demand speed and reliability.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="mailto:owner@posintory.com?subject=PoSintory Inquiry" 
                            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-950 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-zinc-500/20"
                        >
                            Inquire Now <ArrowRight className="w-4 h-4" />
                        </a>
                        <a 
                            href="#how-it-works" 
                            className="w-full sm:w-auto px-8 py-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all border border-zinc-200 dark:border-zinc-800"
                        >
                            Watch Demo
                        </a>
                    </div>

                    <div className="mt-20 relative max-w-5xl mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent z-10" />
                        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-2 shadow-2xl overflow-hidden">
                            <div className="bg-white dark:bg-zinc-950 rounded-2xl aspect-[16/9] flex items-center justify-center overflow-hidden">
                                <LayoutDashboard className="w-32 h-32 text-indigo-500/20 animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid grid-cols-3 gap-4 p-8 w-full h-full opacity-50">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="bg-zinc-100 dark:bg-zinc-900 rounded-xl animate-pulse" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Built for performance</h2>
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">PoSintory provides a comprehensive suite of tools designed to scale with your business needs.</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((f) => (
                            <div key={f.title} className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                                <div className={`${f.bg} ${f.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <f.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">{f.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Simple 3-Step Setup</h2>
                        <p className="text-zinc-500 dark:text-zinc-400">Get your business up and running in minutes.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-800 -z-10 -translate-y-1/2" />
                        {steps.map((step, idx) => (
                            <div key={step.title} className="bg-white dark:bg-zinc-950 p-8 rounded-3xl text-center border border-zinc-200 dark:border-zinc-800 relative shadow-sm">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-white dark:border-zinc-950">
                                    {idx + 1}
                                </div>
                                <div className="bg-zinc-100 dark:bg-zinc-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
                                    <step.icon className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">{step.title}</h3>
                                <p className="text-zinc-500 dark:text-zinc-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Multi-Role Section */}
            <section id="roles" className="py-24 bg-indigo-600 dark:bg-indigo-900/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 text-white">
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                Designed for every level of your organization.
                            </h2>
                            <p className="text-indigo-100 text-lg mb-12 max-w-xl">
                                PoSintory provides specialized interfaces for different team members, ensuring security and focus where it matters most.
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
                                        <role.icon className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg mb-1">{role.role}</h4>
                                        <p className="text-indigo-100 text-sm">{role.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-zinc-50 mb-8 tracking-tight">Ready to take control?</h2>
                    <p className="text-xl text-zinc-500 dark:text-zinc-400 mb-12">Join hundreds of businesses that use PoSintory to power their daily operations.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="mailto:owner@posintory.com?subject=PoSintory Inquiry" 
                            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 text-lg"
                        >
                            Contact for Inquiries <ArrowRight className="w-5 h-5" />
                        </a>
                        <Link 
                            to="/login" 
                            className="w-full sm:w-auto px-10 py-5 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 rounded-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all text-lg"
                        >
                            Existing User? Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                                <div className="bg-indigo-600 p-1.5 rounded-lg">
                                    <Building2 className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-bold text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">PoSintory</span>
                            </div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Empowering small to medium businesses with enterprise-grade POS and inventory solutions.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 mb-6 uppercase text-xs tracking-widest">Product</h4>
                            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
                                <li><a href="#features" className="hover:text-indigo-600 transition-colors">Features</a></li>
                                <li><a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a></li>
                                <li><a href="#roles" className="hover:text-indigo-600 transition-colors">Roles</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 mb-6 uppercase text-xs tracking-widest">Company</h4>
                            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-zinc-900 dark:text-zinc-50 mb-6 uppercase text-xs tracking-widest">Support</h4>
                            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center">
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                            © 2026 PoSintory. Built for modern businesses.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
