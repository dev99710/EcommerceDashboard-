import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
    const { addToast } = useToast()

    const handleRemove = (item) => {
        removeFromCart(item.id)
        addToast(`${item.title.substring(0, 25)}... removed from cart`, 'info')
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="text-7xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Your cart is empty</h2>
                <p className="text-surface-700 dark:text-surface-200 mb-6">Start shopping and add some products!</p>
                <Link
                    to="/products"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg shadow-primary-500/25"
                >
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Shopping Cart</h1>
                    <p className="text-surface-700 dark:text-surface-200 mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={() => { clearCart(); addToast('Cart cleared', 'info') }}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-700/50"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map(item => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow"
                        >
                            {/* Image */}
                            <div className="w-full sm:w-24 h-32 sm:h-24 bg-white dark:bg-surface-900 rounded-xl flex items-center justify-center p-3 flex-shrink-0">
                                <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-surface-900 dark:text-white line-clamp-2 mb-1">{item.title}</h3>
                                <p className="text-xs text-surface-700 dark:text-surface-200 capitalize mb-3">{item.category}</p>

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    {/* Price */}
                                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                        ${item.price.toFixed(2)}
                                    </span>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            disabled={item.quantity <= 1}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-white hover:bg-surface-200 dark:hover:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold text-sm"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center font-semibold text-surface-900 dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-white hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors font-bold text-sm"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <span className="text-sm font-bold text-surface-900 dark:text-white">
                                        Subtotal: ${(item.price * item.quantity).toFixed(2)}
                                    </span>

                                    {/* Remove */}
                                    <button
                                        onClick={() => handleRemove(item)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                        title="Remove item"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 sticky top-24">
                        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-surface-700 dark:text-surface-200 truncate mr-2">
                                        {item.title.substring(0, 25)}... × {item.quantity}
                                    </span>
                                    <span className="font-medium text-surface-900 dark:text-white flex-shrink-0">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-surface-200 dark:border-surface-700 pt-4 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-surface-700 dark:text-surface-200">Subtotal</span>
                                <span className="font-medium text-surface-900 dark:text-white">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-surface-700 dark:text-surface-200">Shipping</span>
                                <span className="font-medium text-emerald-500">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                <span className="text-surface-900 dark:text-white">Total</span>
                                <span className="text-primary-600 dark:text-primary-400">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-sm hover:from-primary-600 hover:to-accent-600 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                            onClick={() => addToast('Checkout coming soon!', 'info')}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
