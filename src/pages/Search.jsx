    // src/pages/Search.jsx (Version avec filtres)
    import { useState, useEffect, useContext } from 'react';
    import { useSearchParams, Link } from 'react-router-dom';
    import { collection, getDocs } from 'firebase/firestore';
    import { db } from '../firebase';
    import { CartContext } from '../context/CartContext';
    import { FavoritesContext } from '../context/FavoritesContext';
    import { Heart, ShoppingCart, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
    import Toast from '../Components/Toast';

    function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    
    // Filtres
    const [sortBy, setSortBy] = useState('relevance'); // relevance, price-asc, price-desc, name
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });

    const { ajouterAuPanier } = useContext(CartContext);
    const { toggleFavori, estFavori } = useContext(FavoritesContext);

    // Charger tous les produits
    useEffect(() => {
        const fetchProducts = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'products'));
            const products = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
            setAllProducts(products);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

    // Obtenir toutes les marques uniques
    const allBrands = [...new Set(allProducts.map(p => p.brand))].filter(Boolean);

    // Filtrer et trier les produits
    useEffect(() => {
        if (!query.trim()) {
        setFilteredProducts([]);
        return;
        }

        const searchLower = query.toLowerCase();
        
        let results = allProducts.filter((product) => {
        // Recherche
        const matchSearch = 
            product.name?.toLowerCase().includes(searchLower) ||
            product.brand?.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower);
        
        if (!matchSearch) return false;

        // Filtrer par marque
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
            return false;
        }

        // Filtrer par prix
        if (product.price < priceRange.min || product.price > priceRange.max) {
            return false;
        }

        return true;
        });

        // Trier
        switch (sortBy) {
        case 'price-asc':
            results.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            results.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default: // relevance
            break;
        }

        setFilteredProducts(results);
    }, [query, allProducts, sortBy, selectedBrands, priceRange]);

    const handleBrandToggle = (brand) => {
        setSelectedBrands(prev => 
        prev.includes(brand) 
            ? prev.filter(b => b !== brand)
            : [...prev, brand]
        );
    };

    const handleAjouterAuPanier = (product) => {
        ajouterAuPanier(product);
        setToast({
        message: `${product.name} ajouté au panier`,
        type: 'success'
        });
    };

    const handleToggleFavori = (product) => {
        const ajout = toggleFavori(product);
        setToast({
        message: ajout 
            ? `${product.name} ajouté aux favoris ❤️` 
            : `${product.name} retiré des favoris`,
        type: 'success'
        });
    };

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Toast */}
            {toast && (
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
            />
            )}

            {/* En-tête */}
            <div className="mb-8">
            <div className="flex items-center gap-2 text-gray-600 mb-4">
                <SearchIcon className="w-5 h-5" />
                <p className="text-sm">
                Résultats pour : <span className="font-semibold text-gray-900">"{query}"</span>
                </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900">
                {filteredProducts.length} {filteredProducts.length > 1 ? 'résultats' : 'résultat'}
                </h1>

                {/* Tri */}
                <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                <option value="relevance">Plus pertinent</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name">Nom A-Z</option>
                </select>
            </div>
            </div>

            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Sidebar Filtres */}
            <aside className="hidden lg:block">
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                    <SlidersHorizontal className="w-5 h-5" />
                    <h2 className="text-lg font-bold">Filtres</h2>
                </div>

                {/* Marques */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">Marques</h3>
                    <div className="space-y-2">
                    {allBrands.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                        </label>
                    ))}
                    </div>
                </div>

                {/* Prix */}
                <div>
                    <h3 className="font-semibold mb-3">Prix</h3>
                    <div className="space-y-3">
                    <div>
                        <label className="text-sm text-gray-600">Min: {priceRange.min}€</label>
                        <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="w-full"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Max: {priceRange.max}€</label>
                        <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="w-full"
                        />
                    </div>
                    </div>
                </div>

                {/* Réinitialiser */}
                <button
                    onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange({ min: 0, max: 500 });
                    setSortBy('relevance');
                    }}
                    className="w-full mt-6 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                    Réinitialiser les filtres
                </button>
                </div>
            </aside>

            {/* Grille de produits */}
            <div className="lg:col-span-3">
                {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg">
                    <SearchIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Aucun résultat
                    </h2>
                    <p className="text-gray-600">
                    Essayez d'ajuster vos filtres
                    </p>
                </div>
                ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group"
                    >
                        {/* Produit card (même code qu'avant) */}
                        <button
                        onClick={() => handleToggleFavori(product)}
                        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                        >
                        <Heart
                            className={`w-6 h-6 ${
                            estFavori(product.id)
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                        />
                        </button>

                        <div className="relative overflow-hidden bg-gray-100">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-72 object-cover hover:scale-105 transition-transform"
                            onError={(e) => e.target.src = "https://via.placeholder.com/300x400"}
                        />
                        </div>

                        <div className="p-4">
                        <p className="text-sm text-gray-500 uppercase mb-1">{product.brand}</p>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{product.price} €</span>
                            <button
                            onClick={() => handleAjouterAuPanier(product)}
                            className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 flex items-center gap-2"
                            >
                            <ShoppingCart className="w-4 h-4" />
                            Ajouter
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    );
    }

    export default Search;