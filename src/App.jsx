import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Profile from './pages/Profile'

export default function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
                    <CartProvider>
                        <BrowserRouter>
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />

                                {/* Protected Routes */}
                                <Route
                                    element={
                                        <ProtectedRoute>
                                            <Layout />
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route path="/profile" element={<Profile />} />
                                </Route>

                                {/* Default Redirect */}
                                <Route path="*" element={<Navigate to="/login" replace />} />
                            </Routes>
                        </BrowserRouter>
                    </CartProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    )
}
