import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Profile() {
    const { user, updateProfile } = useAuth()
    const { addToast } = useToast()
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const validate = () => {
        const errs = {}
        if (!form.name.trim()) errs.name = 'Name is required'
        if (!form.email.trim()) errs.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
        if (form.password && form.password.length < 6) errs.password = 'Password must be at least 6 characters'
        if (form.password && form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
        return errs
    }

    const handleSave = (e) => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length > 0) {
            setErrors(errs)
            return
        }
        setLoading(true)
        setErrors({})
        setTimeout(() => {
            const updates = { name: form.name, email: form.email }
            if (form.password) updates.password = form.password
            const result = updateProfile(updates)
            setLoading(false)
            if (result.success) {
                addToast('Profile updated successfully!', 'success')
                setEditing(false)
                setForm(prev => ({ ...prev, password: '', confirmPassword: '' }))
            } else {
                addToast(result.message, 'error')
            }
        }, 500)
    }

    const handleCancel = () => {
        setEditing(false)
        setForm({ name: user?.name || '', email: user?.email || '', password: '', confirmPassword: '' })
        setErrors({})
    }

    const handleChange = (field) => (e) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }))
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Profile</h1>
                <p className="text-surface-700 dark:text-surface-200 mt-1">Manage your account details</p>
            </div>

            {/* Avatar Card */}
            <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-8 text-center">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-xl shadow-primary-500/20">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-surface-900 dark:text-white">{user?.name}</h2>
                <p className="text-surface-700 dark:text-surface-200">{user?.email}</p>
                <span className="inline-block mt-3 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full">
                    Active Account
                </span>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSave} className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 sm:p-8 space-y-5">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-bold text-surface-900 dark:text-white">Account Details</h2>
                    {!editing && (
                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors border border-primary-200 dark:border-primary-700/50"
                        >
                            ✏️ Edit
                        </button>
                    )}
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Full Name</label>
                    {editing ? (
                        <>
                            <input
                                type="text"
                                value={form.name}
                                onChange={handleChange('name')}
                                className={`w-full px-4 py-3 rounded-xl border bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 transition-all
                  ${errors.name ? 'border-red-400 focus:ring-red-300' : 'border-surface-200 dark:border-surface-700 focus:ring-primary-400'}`}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </>
                    ) : (
                        <div className="px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white">
                            {user?.name}
                        </div>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Email</label>
                    {editing ? (
                        <>
                            <input
                                type="email"
                                value={form.email}
                                onChange={handleChange('email')}
                                className={`w-full px-4 py-3 rounded-xl border bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white focus:outline-none focus:ring-2 transition-all
                  ${errors.email ? 'border-red-400 focus:ring-red-300' : 'border-surface-200 dark:border-surface-700 focus:ring-primary-400'}`}
                            />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </>
                    ) : (
                        <div className="px-4 py-3 rounded-xl bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white">
                            {user?.email}
                        </div>
                    )}
                </div>

                {/* Password (only in edit mode) */}
                {editing && (
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">
                                New Password <span className="text-surface-400 font-normal">(leave blank to keep current)</span>
                            </label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={handleChange('password')}
                                placeholder="Min 6 characters"
                                className={`w-full px-4 py-3 rounded-xl border bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 transition-all
                  ${errors.password ? 'border-red-400 focus:ring-red-300' : 'border-surface-200 dark:border-surface-700 focus:ring-primary-400'}`}
                            />
                            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-surface-700 dark:text-surface-200 mb-1.5">Confirm New Password</label>
                            <input
                                type="password"
                                value={form.confirmPassword}
                                onChange={handleChange('confirmPassword')}
                                placeholder="Re-enter new password"
                                className={`w-full px-4 py-3 rounded-xl border bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 transition-all
                  ${errors.confirmPassword ? 'border-red-400 focus:ring-red-300' : 'border-surface-200 dark:border-surface-700 focus:ring-primary-400'}`}
                            />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-sm hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg shadow-primary-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-200 text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}
