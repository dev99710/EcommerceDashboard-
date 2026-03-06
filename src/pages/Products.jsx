import { useState, useEffect, useRef, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

const API_URL = 'https://fakestoreapi.com/products'
const PRODUCTS_PER_PAGE = 8

export default function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('all')
    const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE)
    const { addToCart, isInCart } = useCart()
    const { addToast } = useToast()
    const loaderRef = useRef(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(API_URL)
            if (!res.ok) throw new Error('Failed to fetch products')
            const data = await res.json()
            setProducts(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Infinite scroll
    const handleObserver = useCallback((entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
            setVisibleCount(prev => prev + PRODUCTS_PER_PAGE)
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 })
        if (loaderRef.current) observer.observe(loaderRef.current)
        return () => observer.disconnect()
    }, [handleObserver])

    const categories = ['all', ...new Set(products.map(p => p.category))]

    const filtered = products.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'all' || p.category === category
        return matchSearch && matchCat
    })

    const visible = filtered.slice(0, visibleCount)
    const hasMore = visibleCount < filtered.length

    const handleAddToCart = (product) => {
        if (isInCart(product.id)) {
            addToast('Already in cart!', 'info')
            return
        }
        addToCart(product)
        addToast(`${product.title.substring(0, 30)}... added to cart!`, 'success')
    }

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 h-12 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
                    <div className="w-48 h-12 bg-surface-200 dark:bg-surface-800 rounded-xl animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                            <div className="h-56 bg-surface-200 dark:bg-surface-700 animate-pulse" />
                            <div className="p-5 space-y-3">
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse w-3/4" />
                                <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded animate-pulse w-1/2" />
                                <div className="h-10 bg-surface-200 dark:bg-surface-700 rounded-xl animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <div className="text-6xl mb-4">😞</div>
                <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Oops! Something went wrong</h2>
                <p className="text-surface-700 dark:text-surface-200 mb-6">{error}</p>
                <button
                    onClick={fetchProducts}
                    className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">Products</h1>
                <p className="text-surface-700 dark:text-surface-200 mt-1">{filtered.length} products found</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setVisibleCount(PRODUCTS_PER_PAGE) }}
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
                    />
                </div>

                {/* Category Filter */}
                <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setVisibleCount(PRODUCTS_PER_PAGE) }}
                    className="px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 capitalize cursor-pointer"
                >
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">No products found</h3>
                    <p className="text-surface-700 dark:text-surface-200">Try adjusting your search or filter</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {visible.map((product, i) => (
                            <div
                                key={product.id}
                                className="group bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden hover:shadow-xl hover:shadow-surface-200/50 dark:hover:shadow-surface-900/50 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 flex flex-col"
                                style={{ animationDelay: `${(i % PRODUCTS_PER_PAGE) * 50}ms` }}
                            >
                                {/* Image */}
                                <div className="relative h-56 bg-white dark:bg-surface-900 p-6 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 bg-surface-900/70 dark:bg-surface-700/70 backdrop-blur-md text-white text-xs font-medium rounded-lg capitalize">
                                            {product.category}
                                        </span>
                                    </div>
                                    {product.rating && (
                                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-amber-400/90 backdrop-blur-md rounded-lg">
                                            <span className="text-xs">⭐</span>
                                            <span className="text-xs font-bold text-surface-900">{product.rating.rate}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-sm font-semibold text-surface-900 dark:text-white line-clamp-2 mb-2 leading-snug">
                                        {product.title}
                                    </h3>
                                    <div className="mt-auto flex items-center justify-between pt-3">
                                        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                            ${product.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={isInCart(product.id)}
                                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5
                        ${isInCart(product.id)
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 cursor-default'
                                                    : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-95'
                                                }`}
                                        >
                                            {isInCart(product.id) ? (
                                                <>
                                                    <span>✓</span>
                                                    <span>In Cart</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>+</span>
                                                    <span>Add</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Infinite Scroll Loader */}
                    {hasMore && (
                        <div ref={loaderRef} className="flex justify-center py-8">
                            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
