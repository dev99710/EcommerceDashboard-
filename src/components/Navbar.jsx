import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
    const { user, logout, getTimeRemaining } = useAuth()
    const { cartCount } = useCart()
    const { darkMode, toggleDarkMode } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [timeLeft, setTimeLeft] = useState({ minutes: 5, seconds: 0 })

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeRemaining())
        }, 1000)
        return () => clearInterval(interval)
    }, [getTimeRemaining])

    useEffect(() => {
        setMobileOpen(false)
    }, [location])

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/products', label: 'Products', icon: '🛍️' },
        { path: '/cart', label: 'Cart', icon: '🛒' },
        { path: '/profile', label: 'Profile', icon: '👤' },
    ]

    const timerWarning = timeLeft.total < 60000

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/50 transition-shadow">
                                S
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent hidden sm:block">
                                ShopDash
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive(link.path)
                                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                                            : 'text-surface-700 dark:text-surface-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span>{link.icon}</span>
                                        <span>{link.label}</span>
                                        {link.path === '/cart' && cartCount > 0 && (
                                            <span className="ml-1 bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-3">
                            {/* Session Timer */}
                            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border
                ${timerWarning
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700/50 animate-pulse'
                                    : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 border-surface-200 dark:border-surface-700'
                                }`}
                            >
                                <span>⏱️</span>
                                <span>{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
                            </div>

                            {/* Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="w-9 h-9 rounded-lg flex items-center justify-center bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors border border-surface-200 dark:border-surface-700"
                                title="Toggle dark mode"
                            >
                                {darkMode ? '☀️' : '🌙'}
                            </button>

                            {/* User Avatar */}
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors border border-surface-200 dark:border-surface-700"
                            >
                                <span className="text-lg">{mobileOpen ? '✕' : '☰'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-surface-200 dark:border-surface-700/50 bg-white dark:bg-surface-900 animate-slide-up">
                        <div className="px-4 py-3 space-y-1">
                            {/* Session Timer Mobile */}
                            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-mono font-semibold
                ${timerWarning
                                    ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    : 'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200'
                                }`}
                            >
                                <span>⏱️</span>
                                <span>Session: {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
                            </div>

                            {navLinks.map(link => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive(link.path)
                                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30'
                                            : 'text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800'
                                        }`}
                                >
                                    <span>{link.icon}</span>
                                    <span>{link.label}</span>
                                    {link.path === '/cart' && cartCount > 0 && (
                                        <span className="ml-auto bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            ))}

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Spacer */}
            <div className="h-16" />
        </>
    )
}
