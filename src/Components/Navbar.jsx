    import { useState, useContext, useEffect } from "react";
    import { Link, NavLink, useNavigate } from "react-router-dom";
    import { 
    Search, 
    User, 
    ShoppingCart, 
    Menu, 
    X, 
    Heart,
    LogOut,
    Package,
    Settings
    } from "lucide-react";
    import { AuthContext } from "../context/AuthContext";
    import { CartContext } from '../context/CartContext';
    import { FavoritesContext } from "../context/FavoritesContext"; // 

    export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    
    const { getTotalItems } = useContext(CartContext);
    const { getTotalFavorites } = useContext(FavoritesContext); 
    
    const totalItems = getTotalItems(); 
    const totalFavorites = getTotalFavorites(); 

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();


    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    
    useEffect(() => {
        const handleClickOutside = (e) => {
        if (!e.target.closest('.user-menu-container')) {
            setIsUserMenuOpen(false);
        }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
        await logout();
        setIsUserMenuOpen(false);
        navigate("/");
        } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
        navigate(`/search?q=${searchQuery}`);
        setIsSearchOpen(false);
        setSearchQuery("");
        }
    };

    // Navigation principale
    const mainNavLinks = [
    
        { name: "Parfums", path: "/Products" },
        { name: "Makeup", path: "/Makeup" },
        { name: "Skincare", path: "/Skincare" },
        { name: "Offres", path: "/Offres" }

        
    ];

    return (
        <>
        {/* NAVBAR PRINCIPALE */}
        <nav 
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            isScrolled 
                ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
                : 'bg-white'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                
                {/* LOGO */}
                <Link 
                to="/" 
                className="flex-shrink-0 group"
                >
                <h1 className="text-3xl text-stone-900 lg:text-4xl font-bold tracking-[0.3em] uppercase ">
                    SEPHORA
                </h1>
                </Link>

                {/* NAVIGATION DESKTOP - Centré */}
                <div className="hidden lg:flex items-center space-x-1">
                {mainNavLinks.map((link) => (
                    <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                        `px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        link.highlight
                            ? 'bg-pink-500 text-white hover:shadow-lg'
                            : isActive
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }
                    >
                    {link.name}
                    </NavLink>
                ))}
                </div>

                {/* ACTIONS - Droite */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                
                {/* BOUTON RECHERCHE */}
                <button
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Rechercher"
                >
                    <Search className="w-5 h-5 text-gray-700" />
                </button>

                {/* FAVORIS */}
                <Link
                    to="/favoris"
                    className="hidden sm:block p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                    aria-label="Favoris"
                >
                    <Heart className="w-5 h-5 text-gray-700" />
                    {totalFavorites > 0 && ( // ⬅️ AJOUTER CETTE CONDITION
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {totalFavorites} {/* ⬅️ CHANGER ICI */}
                    </span>
                    )}
                </Link>

                {/* UTILISATEUR / CONNEXION */}
                {user ? (
                    <div className="user-menu-container relative">
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        setIsUserMenuOpen(!isUserMenuOpen);
                        }}
                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <User className="w-5 h-5 text-gray-700" />
                        <span className="hidden md:inline text-sm font-medium text-gray-700 max-w-[100px] truncate">
                        {user.email?.split('@')[0]}
                        </span>
                    </button>

                    {/* DROPDOWN MENU */}
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                            Bonjour ! 
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-1">
                            {user.email}
                            </p>
                        </div>

                        <div className="py-2">
                            <Link
                            to="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                            <User className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Mon profil</span>
                            </Link>

                            <Link
                            to="/Panier"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                            <Package className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">Mes commandes</span>
                            </Link>

                            <Link
                            to="/favoris"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                            >
                            <Heart className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">
                                Mes favoris
                                {totalFavorites > 0 && ( 
                                <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">
                                    {totalFavorites}
                                </span>
                                )}
                            </span>
                            </Link>

                            
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                            <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2 w-full hover:bg-red-50 transition-colors text-red-600"
                            >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm font-medium">Déconnexion</span>
                            </button>
                        </div>
                        </div>
                    )}
                    </div>
                ) : (
                    <Link
                    to="/login"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-medium"
                    >
                    <User className="w-4 h-4" />
                    <span>Connexion</span>
                    </Link>
                )}

                {/* PANIER */}
                <Link
                    to="/Panier"
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Panier"
                >
                    <ShoppingCart className="w-5 h-5 text-gray-700" />
                    {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {totalItems}
                    </span>
                    )}
                </Link>

                {/* MENU MOBILE */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Menu"
                >
                    {isMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                    ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                    )}
                </button>
                </div>
            </div>
            </div>

            {/* BARRE DE RECHERCHE OVERLAY */}
            {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl animate-slide-down">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un parfum, une marque..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-600 text-lg"
                    autoFocus
                    />
                    <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                    <X className="w-5 h-5" />
                    </button>
                </form>

                {/* Suggestions de recherche populaire */}
                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Recherches populaires :</p>
                    <div className="flex flex-wrap gap-2">
                    {["Chanel", "Dior", "YSL", "Lancôme", "Parfum floral"].map((term) => (
                        <button
                        key={term}
                        onClick={() => {
                            setSearchQuery(term);
                            navigate(`/search?q=${term}`);
                            setIsSearchOpen(false);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                        >
                        {term}
                        </button>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            )}
        </nav>

        {/* MENU MOBILE */}
        {isMenuOpen && (
            <div className="fixed inset-0 z-40 lg:hidden">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Menu Panel */}
            <div className="absolute top-20 left-0 right-0 bg-white shadow-2xl animate-slide-down max-h-[calc(100vh-5rem)] overflow-y-auto">
                <div className="px-4 py-6 space-y-2">
                {/* Liens de navigation */}
                {mainNavLinks.map((link) => (
                    <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        link.highlight
                            ? 'bg-pink-500 text-white'
                            : isActive
                            ? 'bg-black text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`
                    }
                    >
                    {link.name}
                    </NavLink>
                ))}

                {/* Séparateur */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Boutons d'action mobile */}
                {!user && (
                    <>
                    <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 bg-black text-white rounded-xl text-center font-medium"
                    >
                        Se connecter
                    </Link>
                    <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 border-2 border-black text-black rounded-xl text-center font-medium"
                    >
                        Créer un compte
                    </Link>
                    </>
                )}

                {user && (
                    <>
                    <Link
                        to="/favoris"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 rounded-xl"
                    >
                        <div className="flex items-center space-x-3">
                        <Heart className="w-5 h-5 text-gray-600" />
                        <span>Mes favoris</span>
                        </div>
                        {totalFavorites > 0 && ( 
                        <span className="px-2 py-1 bg-pink-100 text-pink-600 text-xs font-bold rounded-full">
                            {totalFavorites}
                        </span>
                        )}
                    </Link>
                    <Link
                        to="/commandes"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-xl"
                    >
                        <Package className="w-5 h-5 text-gray-600" />
                        <span>Mes commandes</span>
                    </Link>
                    </>
                )}
                </div>
            </div>
            </div>
        )}

        <style jsx>{`
            @keyframes slide-down {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
            }

            @keyframes fade-in {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
            }

            .animate-slide-down {
            animation: slide-down 0.3s ease-out;
            }

            .animate-fade-in {
            animation: fade-in 0.2s ease-out;
            }
        `}</style>
        </>
    );
    }