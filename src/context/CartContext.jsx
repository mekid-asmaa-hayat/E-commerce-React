    // src/context/CartContext.jsx
    import { createContext, useState, useEffect } from 'react';

    export const CartContext = createContext();

    export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [lastRemovedItem, setLastRemovedItem] = useState(null); // ⬅️ Pour le undo

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const ajouterAuPanier = (product) => {
        setCartItems((prevItems) => {
        const existingItem = prevItems.find(item => item.id === product.id);
        if (existingItem) {
            return prevItems.map(item =>
            item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
        } else {
            return [...prevItems, { ...product, quantity: 1 }];
        }
        });
    };

    // ⬅️ Retirer avec possibilité de undo
    const retirerDuPanier = (productId) => {
        const itemToRemove = cartItems.find(item => item.id === productId);
        setLastRemovedItem(itemToRemove);
        
        setCartItems((prevItems) =>
        prevItems.filter(item => item.id !== productId)
        );
    };

    // ⬅️ Fonction pour annuler la suppression
    const undoRemove = () => {
        if (lastRemovedItem) {
        setCartItems((prevItems) => [...prevItems, lastRemovedItem]);
        setLastRemovedItem(null);
        }
    };

    const augmenterQuantite = (productId) => {
        setCartItems((prevItems) =>
        prevItems.map(item =>
            item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        );
    };

    const diminuerQuantite = (productId) => {
        setCartItems((prevItems) =>
        prevItems.map(item =>
            item.id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        );
    };

    const viderPanier = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

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
            undoRemove, // ⬅️ Nouvelle fonction
            lastRemovedItem, // ⬅️ Pour savoir si on peut undo
        }}
        >
        {children}
        </CartContext.Provider>
    );
    }