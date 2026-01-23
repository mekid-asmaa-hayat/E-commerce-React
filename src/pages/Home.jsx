
    import { useState, useEffect, useContext } from 'react';
    import { Link } from 'react-router-dom';
    import { collection, getDocs, query, limit } from 'firebase/firestore';
    import { db } from '../firebase';
    import { CartContext } from '../context/CartContext';
    import { FavoritesContext } from '../context/FavoritesContext';
    import { Heart, ShoppingCart, ArrowRight, Sparkles, TrendingUp, Gift } from 'lucide-react';
    import Toast from '../Components/Toast';

    function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [toast, setToast] = useState(null);

    const { ajouterAuPanier } = useContext(CartContext);
    const { toggleFavori, estFavori } = useContext(FavoritesContext);

    // Slides du hero carousel
    const heroSlides = [
        {
        id: 1,
        title: "Nouvelle Collection",
        subtitle: "Parfums d'exception 2026",
        description: "Découvrez les fragrances qui définiront l'année",
        image: "https://res.cloudinary.com/dld0kyawv/image/upload/v1768904988/photo-1765031117402-93b2e530edec_nqmhws.jpg",
        cta: "Découvrir",
        link: "/Offres",
        },
        {
        id: 2,
        title: "Offres Exclusives",
        subtitle: "Jusqu'à -30% sur une sélection",
        description: "Les plus grandes marques au meilleur prix",
        image: "https://res.cloudinary.com/dld0kyawv/image/upload/v1768907501/photo-1596462502278-27bfdc403348_o1w6uo.jpg",
        cta: "Voir les offres",
        link: "/Offres",
        },
        {
        id: 3,
        title: "Marques de Luxe",
        subtitle: "Chanel • Dior • YSL",
        description: "L'excellence des plus grands parfumeurs",
        image: "https://res.cloudinary.com/dld0kyawv/image/upload/v1768907798/photo-1763987300634-7b0822cbf390_hsntxv.jpg",
        cta: "Explorer",
        link: "/Offres",
        }
    ];

    // Catégories
    const categories = [
        {
        name: "Parfums Femme",
        image: "https://res.cloudinary.com/dld0kyawv/image/upload/v1768984672/photo-1757313171134-d4c0cce5d0a1_dzoiu9.jpg",
        link: "/Products?category=femme",
        icon: Sparkles
        },
        {
        name: "Parfums Homme",
        image: "https://res.cloudinary.com/dld0kyawv/image/upload/v1768984283/photo-1758871993077-e084cc7eca86_ghwix4.jpg",
        link: "/Products?category=homme",
        icon: TrendingUp
        },
        {
        name: "Coffrets Cadeaux",
        image: "https://res.cloudinary.com/dld0kyawv/image/upload/v1768985027/pexels-mich-graphics-420890924-15191189_vhjahy.jpg",
        link: "/Products?category=coffrets",
        icon: Gift
        }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            setLoading(true);

            // Charger les 3 collections en parallèle
            const [productsSnap, makeupSnap, skincareSnap] = await Promise.all([
            getDocs(query(collection(db, 'products'), limit(4))),
            getDocs(query(collection(db, 'makeup'), limit(4))),
            getDocs(query(collection(db, 'Skincare'), limit(4)))
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

            // Fusionner tous les produits
            const allProducts = [...productsData, ...makeupData, ...skincareData];

        
            const shuffled = allProducts.sort(() => 0.5 - Math.random());

            // Produits populaires 
            setFeaturedProducts(shuffled.slice(0, 8));
            
            // Nouveautés 
            setNewProducts(shuffled.slice(0, 4));
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
        };

        fetchProducts();
    }, []);

    // Auto-slide du carousel
    useEffect(() => {
        const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 4000);

        return () => clearInterval(timer);
    }, []);

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

    return (
        <div className="min-h-screen bg-white">
        {/* Toast */}
        {toast && (
            <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
            />
        )}

        {/* HERO CAROUSEL */}
        <section className="relative h-[600px] lg:h-[700px] overflow-hidden mt-20">
            {heroSlides.map((slide, index) => (
            <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {/* Image de fond */}
                <div className="absolute inset-0">
                <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
                </div>

                {/* Contenu */}
                <div className="relative h-full flex items-start pt-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-2xl">
                    <p className="text-black/90 text-lg mb-2 font-medium animate-fade-in">
                        {slide.subtitle}
                    </p>
                    <h1 className="text-5xl lg:text-7xl font-bold text-black mb-6 animate-slide-up">
                        {slide.title}
                    </h1>
                    <p className="text-xl text-black/90 mb-8 animate-fade-in-delay">
                        {slide.description}
                    </p>
                    <Link
                        to={slide.link}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl"
                    >
                        {slide.cta}
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    </div>
                </div>
                </div>
            </div>
            ))}

            {/* Indicateurs */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, index) => (
                <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                />
            ))}
            </div>
        </section>

        {/* BANDE PROMOTIONNELLE */}
        <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-4">
            <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-white font-semibold text-lg">
                ✨ Livraison offerte dès 35€ • Échantillons gratuits • Retours sous 30 jours
            </p>
            </div>
        </section>

        {/* CATÉGORIES */}
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Nos Catégories</h2>
                <p className="text-gray-600 text-lg">Trouvez le parfum parfait pour chaque occasion</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {categories.map((category) => (
                <Link
                    key={category.name}
                    to={category.link}
                    className="group relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                    <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <category.icon className="w-10 h-10 mb-4" />
                    <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 group-hover:gap-4 transition-all">
                        <span>Découvrir</span>
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    </div>
                </Link>
                ))}
            </div>
            </div>
        </section>

        {/* NOUVEAUTÉS */}
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
                <div>
                <h2 className="text-4xl font-bold mb-2">Nouveautés</h2>
                <p className="text-gray-600">Les dernières fragrances du moment</p>
                </div>
                <Link
                to="/Offres"
                className="hidden md:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold"
                >
                Voir tout
                <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-80 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {newProducts.map((product) => (
                    <ProductCard
                    key={`${product.category}-${product.id}`}
                    product={product}
                    onAddToCart={handleAjouterAuPanier}
                    onToggleFavorite={handleToggleFavori}
                    isFavorite={estFavori(product.id)}
                    />
                ))}
                </div>
            )}
            </div>
        </section>

        {/* BANNIÈRE PROMOTIONNELLE */}
        <section className="py-16 bg-pink-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                <div className="p-12 flex flex-col justify-center">
                    <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-semibold mb-4 w-fit">
                    Offre limitée
                    </span>
                    <h2 className="text-4xl font-bold mb-4">
                    Jusqu'à -30% sur une sélection
                    </h2>
                    <p className="text-gray-600 text-lg mb-8">
                    Profitez de nos meilleures offres sur les plus grandes marques de parfumerie
                    </p>
                    <Link
                    to="/offres"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors w-fit"
                    >
                    Voir les offres
                    <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
                <div className="relative h-64 md:h-auto">
                    <img
                    src="https://res.cloudinary.com/dld0kyawv/image/upload/v1768986329/pexels-richan-dwi-putra-88532517-12616233_dri09n.jpg"
                    alt="Offres"
                    className="w-full h-full object-cover"
                    />
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* PRODUITS POPULAIRES */}
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
                <div>
                <h2 className="text-4xl font-bold mb-2">Produits Populaires</h2>
                <p className="text-gray-600">Les coups de cœur de nos clients</p>
                </div>
                <Link
                to="/Products"
                className="hidden md:flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold"
                >
                Voir tout
                <ArrowRight className="w-5 h-5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                <ProductCard
                    key={`${product.category}-${product.id}`}
                    product={product}
                    onAddToCart={handleAjouterAuPanier}
                    onToggleFavorite={handleToggleFavori}
                    isFavorite={estFavori(product.id)}
                />
                ))}
            </div>
            </div>
        </section>

        {/* MARQUES PARTENAIRES */}
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Marques Partenaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                {['Chanel', 'Dior', 'YSL', 'Lancôme', 'Guerlain', 'Hermès'].map((brand) => (
                <div
                    key={brand}
                    className="flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all"
                >
                    <span className="text-2xl font-bold text-gray-400 hover:text-gray-900">
                    {brand}
                    </span>
                </div>
                ))}
            </div>
            </div>
        </section>

        {/* NEWSLETTER */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
                Restez informé de nos nouveautés
            </h2>
            <p className="text-white/90 text-lg mb-8">
                Recevez en exclusivité nos offres et nos nouvelles collections
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                type="submit"
                className="px-8 py-4 bg-white text-pink-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                S'inscrire
                </button>
            </form>
            </div>
        </section>
        </div>
    );
    }

    // COMPOSANT PRODUCTCARD AVEC BADGE CATÉGORIE
    
    function ProductCard({ product, onAddToCart, onToggleFavorite, isFavorite }) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
        <div className="relative">
            {/* Badge Catégorie */}
            <span className="absolute top-3 left-3 z-10 px-3 py-1 bg-black/70 text-white text-xs font-semibold rounded-full">
            {product.category || 'Parfums'}
            </span>

            {/* Badge Nouveau */}
            <span className="absolute top-3 left-24 z-10 px-3 py-1 bg-pink-600 text-white text-xs font-semibold rounded-full">
            NOUVEAU
            </span>

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
            <div className="relative h-80 bg-gray-100 overflow-hidden">
            <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => e.target.src = "https://via.placeholder.com/300x400"}
            />
            </div>
        </div>

        {/* Infos */}
        <div className="p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
            </p>
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
            {product.name}
            </h3>
            
            <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold">{product.price} €</span>
            <button
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
                className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
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
    );
    }

    export default Home;