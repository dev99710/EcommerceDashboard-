import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [authError, setAuthError] = useState('')
    const { login } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    const validate = () => {
        const errs = {}
        if (!form.email.trim()) errs.email = 'Email is required'
        if (!form.password) errs.password = 'Password is required'
        return errs
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setLoading(true)
        setErrors({})
        setAuthError('')
        setTimeout(() => {
            const result = login(form.email, form.password)
            setLoading(false)
            if (result.success) {
                addToast('Welcome back!', 'success')
                navigate('/dashboard')
            } else {
                setAuthError(result.message)
                addToast(result.message, 'error')
            }
        }, 500)
    }

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
        if (authError) setAuthError('')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-surface-950 dark:via-surface-900 dark:to-surface-950 px-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-xl shadow-primary-500/25">
                        S
                    </div>
                    <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Welcome Back</h1>
                    <p className="mt-2 text-surface-700 dark:text-surface-200">Sign in to your ShopDash account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl shadow-surface-200/50 dark:shadow-surface-900/50 border border-surface-200 dark:border-surface-700 p-8 space-y-5">
                    {/* Auth Error */}
                    {authError && (
                        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                            <span>⚠️</span>
                            <span>{authError}</span>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={handleChange('email')}
                            placeholder="john@example.com"
                            className={`w-full px-4 py-3 rounded-xl border bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 transition-all
                ${errors.email ? 'border-red-400 focus:ring-red-300' : 'border-surface-200 dark:border-surface-700 focus:ring-primary-400 focus:border-primary-400'}`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Password</label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={handleChange('password')}
                            placeholder="Enter your password"
                            className={`w-full px-4 py-3 rounded-xl border bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 transition-all
                ${errors.password ? 'border-red-400 focus:ring-red-300' : 'border-surface-200 dark:border-surface-700 focus:ring-primary-400 focus:border-primary-400'}`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-sm hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-sm text-surface-700 dark:text-surface-200">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-500 hover:text-primary-600 font-semibold">
                            Create Account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
