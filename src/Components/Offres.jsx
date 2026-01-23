    import { useState, useEffect, useContext } from 'react';
    import { Link } from 'react-router-dom';
    import { collection, getDocs } from 'firebase/firestore';
    import { db } from '../firebase';
    import { CartContext } from '../context/CartContext';
    import { FavoritesContext } from '../context/FavoritesContext';
    import { Heart, ShoppingCart, Percent, Clock, Sparkles } from 'lucide-react';
    import Toast from '../Components/Toast';

    export default function Offres() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 15,
        minutes: 30,
        seconds: 0
    });

    const { ajouterAuPanier } = useContext(CartContext);
    const { toggleFavori, estFavori } = useContext(FavoritesContext);

    // Compte à rebours pour les offres
    useEffect(() => {
        const timer = setInterval(() => {
        setTimeLeft(prev => {
            let { days, hours, minutes, seconds } = prev;
            
            if (seconds > 0) {
            seconds--;
            } else {
            seconds = 59;
            if (minutes > 0) {
                minutes--;
            } else {
                minutes = 59;
                if (hours > 0) {
                hours--;
                } else {
                hours = 23;
                if (days > 0) {
                    days--;
                }
                }
            }
            }
            
            return { days, hours, minutes, seconds };
        });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Charger les produits
    useEffect(() => {
        const fetchProducts = async () => {
        try {
            setLoading(true);
            const productsRef = collection(db, 'products');
            const querySnapshot = await getDocs(productsRef);
            
            // Simuler des produits en promotion (ajouter 15-30% de réduction)
            const productsData = querySnapshot.docs.map(doc => {
            const product = { id: doc.id, ...doc.data() };
            const discount = [15, 20, 25, 30][Math.floor(Math.random() * 4)];
            const originalPrice = product.price;
            const promoPrice = (originalPrice * (1 - discount / 100)).toFixed(2);
            
            return {
                ...product,
                originalPrice,
                promoPrice: parseFloat(promoPrice),
                discount,
                isPromo: true
            };
            });
            
            setProducts(productsData);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        // Ajouter le produit avec le prix promo
        const productWithPromo = { ...product, price: product.promoPrice };
        ajouterAuPanier(productWithPromo);
        setToast({
        message: `${product.name} ajouté au panier`,
        type: 'success'
        });
    };

    const handleToggleFavorite = (product) => {
        const ajout = toggleFavori(product);
        setToast({
        message: ajout 
            ? `${product.name} ajouté aux favoris ❤️` 
            : `${product.name} retiré des favoris`,
        type: 'success'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        {toast && (
            <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            />
        )}

        {/* HERO BANNER */}
        <section className="relative bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 text-white py-20 overflow-hidden mt-16">
            {/* Éléments décoratifs animés */}
            <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6 animate-bounce">
                <Percent className="w-5 h-5" />
                <span className="font-semibold">Offres Limitées</span>
            </div>

            {/* Titre */}
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
                Jusqu'à -30% de Réduction
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
                Sur une sélection de parfums, maquillage et soins
            </p>

            {/* Compte à rebours */}
            <div className="inline-block bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8">
                <p className="text-sm uppercase tracking-wider mb-4 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                L'offre se termine dans
                </p>
                <div className="flex gap-4 justify-center">
                <CountdownBox value={timeLeft.days} label="Jours" />
                <CountdownBox value={timeLeft.hours} label="Heures" />
                <CountdownBox value={timeLeft.minutes} label="Minutes" />
                <CountdownBox value={timeLeft.seconds} label="Secondes" />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div>
                <div className="text-4xl font-bold mb-2">{products.length}+</div>
                <div className="text-white/80">Produits en promo</div>
                </div>
                <div>
                <div className="text-4xl font-bold mb-2">-30%</div>
                <div className="text-white/80">Jusqu'à</div>
                </div>
                <div>
                <div className="text-4xl font-bold mb-2">2j</div>
                <div className="text-white/80">Restants</div>
                </div>
            </div>
            </div>
        </section>

        {/* BARRE D'AVANTAGES */}
        <section className="bg-white border-b border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex items-center justify-center gap-3">
                <div className="bg-green-100 p-3 rounded-full">
                    <Percent className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-left">
                    <div className="font-semibold">Réductions exceptionnelles</div>
                    <div className="text-sm text-gray-600">Jusqu'à -30%</div>
                </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                    <div className="font-semibold">Échantillons offerts</div>
                    <div className="text-sm text-gray-600">Sur chaque commande</div>
                </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                    <div className="font-semibold">Livraison gratuite</div>
                    <div className="text-sm text-gray-600">Dès 35€ d'achat</div>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* PRODUITS EN PROMOTION */}
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">
                Toutes nos offres
                </h2>
                <p className="text-gray-600">
                {products.length} produit{products.length > 1 ? 's' : ''} en promotion
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-80 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <PromoProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={estFavori(product.id)}
                    />
                ))}
                </div>
            )}
            </div>
        </section>

        {/* BANNIÈRE FINALE */}
        <section className="py-16 bg-gradient-to-r from-amber-100 to-pink-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-pink-600" />
            <h2 className="text-4xl font-bold mb-4">Ne ratez pas ces offres !</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Profitez de réductions exceptionnelles sur vos parfums, maquillages et soins préférés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                to="/Products"
                className="px-8 py-4 bg-pink-600 text-white rounded-full font-semibold hover:bg-pink-700 transition-all shadow-lg hover:scale-105"
                >
                Voir tous les produits
                </Link>
                <Link
                to="/"
                className="px-8 py-4 bg-white text-pink-600 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-lg hover:scale-105"
                >
                Retour à l'accueil
                </Link>
            </div>
            </div>
        </section>
        </div>
    );
    }

    // Composant Countdown Box
    function CountdownBox({ value, label }) {
    return (
        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px]">
        <div className="text-4xl font-bold mb-1">
            {value.toString().padStart(2, '0')}
        </div>
        <div className="text-sm text-white/80">{label}</div>
        </div>
    );
    }

    // Composant Carte Produit en Promo
    function PromoProductCard({ product, onAddToCart, onToggleFavorite, isFavorite }) {
    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group relative">
        {/* Badge de réduction */}
        <div className="absolute top-3 left-3 z-10">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
            -{product.discount}%
            </div>
        </div>

        {/* Bouton Favori */}
        <button
            onClick={() => onToggleFavorite(product)}
            className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
        >
            <Heart
            className={`w-5 h-5 ${
                isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-400 group-hover:text-red-500"
            }`}
            />
        </button>

        {/* Image */}
        <Link to={`/product/${product.id}`}>
            <div className="relative h-80 bg-gray-100 overflow-hidden">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => e.target.src = "https://via.placeholder.com/300x400"}
            />
            
            {/* Overlay promo */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
        </Link>

        {/* Infos */}
        <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
            </p>
            <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg mb-3 line-clamp-2 min-h-[3.5rem] hover:text-pink-600 transition">
                {product.name}
            </h3>
            </Link>

            {/* Prix */}
            <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-red-600">
                {product.promoPrice} €
            </span>
            <span className="text-lg text-gray-400 line-through">
                {product.originalPrice} €
            </span>
            </div>

            {/* Badge économie */}
            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block">
            Économisez {(product.originalPrice - product.promoPrice).toFixed(2)} €
            </div>

            {/* Bouton */}
            <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                product.stock === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-pink-600 text-white hover:bg-pink-700 hover:scale-105 shadow-lg"
            }`}
            >
            <ShoppingCart className="w-5 h-5" />
            {product.stock === 0 ? "Épuisé" : "Ajouter au panier"}
            </button>
        </div>
        </div>
    );
    }