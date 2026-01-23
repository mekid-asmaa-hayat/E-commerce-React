    // src/Components/Skincare.jsx
    import { useEffect, useState, useContext } from "react";
    import { collection, getDocs } from "firebase/firestore";
    import { db } from "../firebase";
    import { CartContext } from "../context/CartContext";
    import { FavoritesContext } from "../context/FavoritesContext";
    import Toast from "./Toast";
    import { Heart, ShoppingCart } from "lucide-react"; 


    function Skincare() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    
    const { ajouterAuPanier } = useContext(CartContext);
    const { toggleFavori, estFavori } = useContext(FavoritesContext);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "Skincare"));
            const list = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
            setProducts(list);
        } catch (error) {
            console.error("ERREUR FIRESTORE :", error);
            setError("Impossible de charger les produits Skincare");
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

    const handleAjouterAuPanier = (product) => {
        ajouterAuPanier(product);
        setToast({
        message: `${product.name} ajouté au panier avec succès !`,
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
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl">Chargement des produits Skincare...</div>
        </div>
        );
    }

    if (error) {
        return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="text-xl text-red-600">{error}</div>
        </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
        {/* Toast Notification */}
        {toast && (
            <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            />
        )}

        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-2">💄 Skincare</h1>
        </div>

        {products.length === 0 && (
            <div className="text-center py-20">
            <p className="text-xl text-gray-500">Aucun produit Skincare disponible</p>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
            <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden relative group"
            >
                {/* Bouton Favori avec Lucide ⬅️ */}
                <button
                onClick={() => handleToggleFavori(product)}
                className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
                >
                <Heart
                    className={`w-6 h-6 transition-colors ${
                    estFavori(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 group-hover:text-red-500"
                    }`}
                />
                </button>

                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={product.imageUrl || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                    e.target.src = "https://placehold.co/300x400/pink/white?text=Image+Non+Disponible";
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

    export default Skincare;