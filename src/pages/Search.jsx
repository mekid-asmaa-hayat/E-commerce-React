// src/pages/Search.jsx (Version complète avec fermeture automatique)
import { useState, useEffect, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { Heart, ShoppingCart, Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react';
import Toast from '../Components/Toast';

function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const filtersRef = useRef(null);
  
  // Filtres
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });

  const { ajouterAuPanier } = useContext(CartContext);
  const { toggleFavori, estFavori } = useContext(FavoritesContext);

  // ========== NOUVEAU : FERMER LES FILTRES AU CLIC EXTÉRIEUR ==========
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowMobileFilters(false);
      }
    };

    if (showMobileFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileFilters]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowMobileFilters(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  // ================================================================

  // Fonction pour redimensionner les images Cloudinary
  const resizeCloudinaryImage = (url) => {
    if (url && url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/w_400,h_500,c_fit/');
    }
    return url;
  };

  // Charger TOUS les produits de TOUTES les collections
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        
        const [productsSnap, makeupSnap, skincareSnap] = await Promise.all([
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'makeup')),
          getDocs(collection(db, 'Skincare'))
        ]);

        const productsData = productsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          category: 'Parfums'
        }));

        const makeupData = makeupSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          category: 'Makeup'
        }));

        const skincareData = skincareSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          category: 'Soins'
        }));

        const allProductsData = [...productsData, ...makeupData, ...skincareData];
        setAllProducts(allProductsData);
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setToast({
          message: 'Erreur lors du chargement des produits',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  const allBrands = [...new Set(allProducts.map(p => p.brand))].filter(Boolean).sort();
  const allCategories = ['Parfums', 'Makeup', 'Soins'];

  // Filtrer et trier les produits
  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }

    const searchLower = query.toLowerCase();
    
    let results = allProducts.filter((product) => {
      const matchSearch = 
        product.name?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower);
      
      if (!matchSearch) return false;

      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      return true;
    });

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
      default:
        break;
    }

    setFilteredProducts(results);
  }, [query, allProducts, sortBy, selectedBrands, selectedCategories, priceRange]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
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
          <p className="text-gray-600">Chargement des produits...</p>
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

            <div className="flex gap-4 items-center">
              {/* Bouton filtres mobile */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtres
              </button>

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
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Sidebar Filtres Desktop */}
          <aside className="hidden lg:block mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5" />
                <h2 className="text-lg font-bold">Filtres</h2>
              </div>

              {/* Catégories */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold mb-3">Catégories</h3>
                <div className="space-y-2">
                  {allCategories.map(category => {
                    const count = allProducts.filter(p => p.category === category).length;
                    return (
                      <label key={category} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-pink-600 transition-colors">
                            {category}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Marques */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold mb-3">Marques</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allBrands.map(brand => {
                    const count = allProducts.filter(p => p.brand === brand).length;
                    return (
                      <label key={brand} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-pink-600 transition-colors">
                            {brand}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Prix */}
              <div className="mb-6">
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
                      className="w-full accent-pink-600"
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
                      className="w-full accent-pink-600"
                    />
                  </div>
                </div>
              </div>

              {/* Réinitialiser */}
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedCategories([]);
                  setPriceRange({ min: 0, max: 500 });
                  setSortBy('relevance');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
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
                  Aucun résultat trouvé
                </h2>
                <p className="text-gray-600 mb-4">
                  Essayez d'ajuster vos filtres ou votre recherche
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors"
                >
                  Retour à l'accueil
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={`${product.category}-${product.id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group"
                  >
                    {/* Badge Catégorie */}
                    <div className="absolute top-3 left-3 z-10 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {product.category}
                    </div>

                    {/* Bouton Favori */}
                    <button
                      onClick={() => handleToggleFavori(product)}
                      className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          estFavori(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 group-hover:text-red-500"
                        }`}
                      />
                    </button>

                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-100">
                      <img
                        src={resizeCloudinaryImage(product.imageUrl)}
                        alt={product.name}
                        className="w-full h-72 object-cover hover:scale-105 transition-transform"
                        onError={(e) => e.target.src = "https://placehold.co/300x400?text=Image"}
                      />
                      
                      {/* Badge Stock */}
                      {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute bottom-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Plus que {product.stock}
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="absolute bottom-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Rupture
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="p-4">
                      <p className="text-sm text-gray-500 uppercase mb-1">{product.brand}</p>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{product.price} €</span>
                        <button
                          onClick={() => handleAjouterAuPanier(product)}
                          disabled={product.stock === 0}
                          className={`px-4 py-2 rounded-full flex items-center gap-2 font-semibold transition-all ${
                            product.stock === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-black text-white hover:bg-gray-800 hover:scale-105'
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {product.stock === 0 ? 'Épuisé' : 'Ajouter'}
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

      {/* ========== FILTRES MOBILE (Overlay) ========== */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Fond sombre - Cliquer ici ferme les filtres */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Panel des filtres */}
          <div 
            ref={filtersRef}
            className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Filtres</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Même contenu que sidebar desktop */}
              {/* Catégories */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold mb-3">Catégories</h3>
                <div className="space-y-2">
                  {allCategories.map(category => {
                    const count = allProducts.filter(p => p.category === category).length;
                    return (
                      <label key={category} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="w-4 h-4 text-pink-600 rounded"
                          />
                          <span className="text-sm">{category}</span>
                        </div>
                        <span className="text-xs text-gray-400">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Marques */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="font-semibold mb-3">Marques</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allBrands.map(brand => {
                    const count = allProducts.filter(p => p.brand === brand).length;
                    return (
                      <label key={brand} className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandToggle(brand)}
                            className="w-4 h-4 text-pink-600 rounded"
                          />
                          <span className="text-sm">{brand}</span>
                        </div>
                        <span className="text-xs text-gray-400">({count})</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Prix */}
              <div className="mb-6">
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
                      className="w-full accent-pink-600"
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
                      className="w-full accent-pink-600"
                    />
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedCategories([]);
                    setPriceRange({ min: 0, max: 500 });
                    setSortBy('relevance');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Voir les résultats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;