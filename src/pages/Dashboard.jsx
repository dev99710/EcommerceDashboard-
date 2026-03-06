import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Dashboard() {
    const { user, getTimeRemaining } = useAuth()
    const { cartCount } = useCart()
    const [timeLeft, setTimeLeft] = useState({ minutes: 5, seconds: 0 })

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeRemaining())
        }, 1000)
        return () => clearInterval(interval)
    }, [getTimeRemaining])

    const timerWarning = timeLeft.total < 60000

    const quickLinks = [
        { to: '/products', icon: '🛍️', title: 'Browse Products', desc: 'Explore our curated collection', color: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/20' },
        { to: '/cart', icon: '🛒', title: 'Shopping Cart', desc: `${cartCount} item${cartCount !== 1 ? 's' : ''} in cart`, color: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
        { to: '/profile', icon: '👤', title: 'My Profile', desc: 'Manage your account', color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/20' },
    ]

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 p-8 text-white shadow-xl shadow-primary-500/20">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAyMGgyMHYyMEgyMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-30" />
                <div className="relative">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                        Welcome back, {user?.name || 'User'}! 👋
                    </h1>
                    <p className="text-white/80 text-lg">
                        Ready to explore amazing products today?
                    </p>
                </div>

                {/* Session Timer */}
                <div className={`absolute top-6 right-6 px-4 py-2 rounded-xl backdrop-blur-md text-sm font-mono font-bold flex items-center gap-2
          ${timerWarning ? 'bg-red-500/40 border border-red-300/30' : 'bg-white/15 border border-white/20'}`}
                >
                    <span>⏱️</span>
                    <span>{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 p-6 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-xl ${link.shadow}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r ${link.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                            <div className="relative">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center text-2xl mb-4 shadow-lg ${link.shadow}`}>
                                    {link.icon}
                                </div>
                                <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-1">{link.title}</h3>
                                <p className="text-sm text-surface-700 dark:text-surface-200">{link.desc}</p>
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 group-hover:text-surface-700 dark:group-hover:text-surface-200 text-xl transition-all group-hover:translate-x-1">
                                →
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Session Time', value: `${timeLeft.minutes}m ${timeLeft.seconds}s`, icon: '⏱️' },
                    { label: 'Cart Items', value: cartCount, icon: '🛒' },
                    { label: 'Account', value: 'Active', icon: '✅' },
                    { label: 'Member', value: 'Free Tier', icon: '⭐' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 text-center">
                        <span className="text-2xl">{stat.icon}</span>
                        <div className="mt-2 text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</div>
                        <div className="text-xs text-surface-700 dark:text-surface-200 font-medium mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
