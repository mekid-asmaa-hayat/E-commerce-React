    // src/pages/Favoris.jsx
    import { useContext, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { FavoritesContext } from '../context/FavoritesContext';
    import { CartContext } from '../context/CartContext';
    import { Heart, Trash2, ShoppingCart } from 'lucide-react'; 
    import Toast from '../Components/Toast';

    function Favoris() {
    const { favorites, retirerDesFavoris } = useContext(FavoritesContext);
    const { ajouterAuPanier } = useContext(CartContext);
    const [toast, setToast] = useState(null);

    const handleRetirerFavori = (product) => {
        retirerDesFavoris(product.id);
        setToast({
        message: `${product.name} retiré des favoris`,
        type: 'success'
        });
    };

    const handleAjouterAuPanier = (product) => {
        ajouterAuPanier(product);
        setToast({
        message: `${product.name} ajouté au panier`,
        type: 'success'
        });
    };

    if (favorites.length === 0) {
        return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto">
            <Heart className="text-gray-300 w-20 h-20 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Aucun favori</h1>
            <p className="text-gray-600 mb-8">
                Explorez notre collection et ajoutez vos parfums préférés à vos favoris !
            </p>
            <Link
                to="/"
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
                Découvrir nos produits
            </Link>
            </div>
        </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
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
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Heart className="text-red-500 fill-red-500 w-8 h-8" />
            Mes Favoris
            </h1>
            <p className="text-gray-600">{favorites.length} produit{favorites.length > 1 ? 's' : ''}</p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
            <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group"
            >
            
                <button
                onClick={() => handleRetirerFavori(product)}
                className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                title="Retirer des favoris"
                >
                <Trash2 className="text-red-500 w-5 h-5" />
                </button>

                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x400?text=Image";
                    }}
                />

                {/* Badge Stock */}
                {product.stock < 5 && product.stock > 0 && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Plus que {product.stock}
                    </div>
                )}
                
                {product.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Rupture
                    </div>
                )}
                </div>

                {/* Infos Produit */}
                <div className="p-4">
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                    {product.brand}
                </p>
                
                <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem]">
                    {product.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                </p>
                
                {/* Prix et Bouton */}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-black">
                    {product.price} €
                    </span>
                    
                    <button
                    onClick={() => handleAjouterAuPanier(product)}
                    disabled={product.stock === 0}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 ${
                        product.stock === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-black text-white hover:bg-gray-800 hover:scale-105"
                    }`}
                    >
                    <ShoppingCart className="w-4 h-4" />
                    {product.stock === 0 ? "Épuisé" : "Ajouter"}
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
    }

    export default Favoris;