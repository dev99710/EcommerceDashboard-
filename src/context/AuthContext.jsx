import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const SESSION_DURATION = 5 * 60 * 1000 // 5 minutes

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [sessionExpiry, setSessionExpiry] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check for existing session on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('session')
        if (savedSession) {
            const session = JSON.parse(savedSession)
            if (Date.now() < session.expiry) {
                setUser(session.user)
                setSessionExpiry(session.expiry)
            } else {
                localStorage.removeItem('session')
            }
        }
        setIsLoading(false)
    }, [])

    // Session timer - check every second
    useEffect(() => {
        if (!sessionExpiry) return
        const interval = setInterval(() => {
            if (Date.now() >= sessionExpiry) {
                logout()
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [sessionExpiry])

    const register = useCallback((name, email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' }
        }
        const newUser = { id: Date.now(), name, email, password }
        users.push(newUser)
        localStorage.setItem('users', JSON.stringify(users))
        return { success: true, message: 'Registration successful!' }
    }, [])

    const login = useCallback((email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const found = users.find(u => u.email === email && u.password === password)
        if (!found) {
            return { success: false, message: 'Invalid email or password' }
        }
        const expiry = Date.now() + SESSION_DURATION
        const sessionUser = { id: found.id, name: found.name, email: found.email }
        setUser(sessionUser)
        setSessionExpiry(expiry)
        localStorage.setItem('session', JSON.stringify({ user: sessionUser, expiry }))
        return { success: true }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        setSessionExpiry(null)
        localStorage.removeItem('session')
    }, [])

    const updateProfile = useCallback((updates) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const idx = users.findIndex(u => u.id === user.id)
        if (idx === -1) return { success: false, message: 'User not found' }

        // Check for email uniqueness if email changed
        if (updates.email && updates.email !== user.email) {
            if (users.find(u => u.email === updates.email && u.id !== user.id)) {
                return { success: false, message: 'Email already in use' }
            }
        }

        users[idx] = { ...users[idx], ...updates }
        localStorage.setItem('users', JSON.stringify(users))

        const updatedUser = { id: users[idx].id, name: users[idx].name, email: users[idx].email }
        setUser(updatedUser)

        // Update session
        const session = JSON.parse(localStorage.getItem('session'))
        if (session) {
            session.user = updatedUser
            localStorage.setItem('session', JSON.stringify(session))
        }

        return { success: true, message: 'Profile updated successfully!' }
    }, [user])

    const getTimeRemaining = useCallback(() => {
        if (!sessionExpiry) return { minutes: 0, seconds: 0, total: 0 }
        const total = Math.max(0, sessionExpiry - Date.now())
        return {
            minutes: Math.floor((total / 1000 / 60) % 60),
            seconds: Math.floor((total / 1000) % 60),
            total,
        }
    }, [sessionExpiry])

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            sessionExpiry,
            register,
            login,
            logout,
            updateProfile,
            getTimeRemaining,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
