import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const addToCart = useCallback((product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id)
            if (existing) return prev // Prevent duplicates
            return [...prev, { ...product, quantity: 1 }]
        })
    }, [])

    const removeFromCart = useCallback((productId) => {
        setCart(prev => prev.filter(item => item.id !== productId))
    }, [])

    const updateQuantity = useCallback((productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id !== productId) return item
            const newQty = item.quantity + delta
            if (newQty < 1) return item
            return { ...item, quantity: newQty }
        }))
    }, [])

    const isInCart = useCallback((productId) => {
        return cart.some(item => item.id === productId)
    }, [cart])

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    const clearCart = useCallback(() => setCart([]), [])

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            isInCart,
            cartTotal,
            cartCount,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within CartProvider')
    return context
}
