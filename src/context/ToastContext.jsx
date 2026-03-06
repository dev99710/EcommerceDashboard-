import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = ++toastId
        setToasts(prev => [...prev, { id, message, type, exiting: false }])
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, 300)
        }, duration)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 300)
    }, [])

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        className={`pointer-events-auto cursor-pointer min-w-[280px] max-w-[380px] px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border flex items-center gap-3 transition-all
              ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
              ${toast.type === 'success'
                                ? 'bg-emerald-500/90 border-emerald-400/30 text-white'
                                : toast.type === 'error'
                                    ? 'bg-red-500/90 border-red-400/30 text-white'
                                    : 'bg-blue-500/90 border-blue-400/30 text-white'
                            }`}
                    >
                        <span className="text-lg">
                            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
                        </span>
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) throw new Error('useToast must be used within ToastProvider')
    return context
}
