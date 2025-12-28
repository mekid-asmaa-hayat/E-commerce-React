    // src/context/CartContext.jsx
    import { createContext, useState, useEffect } from 'react';

    export const CartContext = createContext();

    export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // Charger le panier depuis localStorage au démarrage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
        setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Sauvegarder le panier dans localStorage à chaque changement
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Ajouter un produit au panier
    const ajouterAuPanier = (product) => {
        setCartItems((prevItems) => {
        // Vérifier si le produit existe déjà dans le panier
        const existingItem = prevItems.find(item => item.id === product.id);

        if (existingItem) {
            // Si le produit existe, augmenter la quantité
            return prevItems.map(item =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
        } else {
            // Si le produit n'existe pas, l'ajouter avec quantité 1
            return [...prevItems, { ...product, quantity: 1 }];
        }
        });
    };

    // Retirer un produit du panier
    const retirerDuPanier = (productId) => {
        setCartItems((prevItems) =>
        prevItems.filter(item => item.id !== productId)
        );
    };

    // Augmenter la quantité
    const augmenterQuantite = (productId) => {
        setCartItems((prevItems) =>
        prevItems.map(item =>
            item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        );
    };

    // Diminuer la quantité
    const diminuerQuantite = (productId) => {
        setCartItems((prevItems) =>
        prevItems.map(item =>
            item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        );
    };

    // Vider le panier
    const viderPanier = () => {
        setCartItems([]);
    };

    // Calculer le nombre total d'articles
    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Calculer le prix total
    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider
        value={{
            cartItems,
            ajouterAuPanier,
            retirerDuPanier,
            augmenterQuantite,
            diminuerQuantite,
            viderPanier,
            getTotalItems,
            getTotalPrice,
        }}
        >
        {children}
        </CartContext.Provider>
    );
    }