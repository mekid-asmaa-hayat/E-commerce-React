    // src/context/FavoritesContext.jsx
    import { createContext, useState, useEffect } from 'react';

    export const FavoritesContext = createContext();

    export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    // Ajouter aux favoris
    const ajouterAuxFavoris = (product) => {
        setFavorites((prevFavorites) => {
        const existe = prevFavorites.find(item => item.id === product.id);
        if (!existe) {
            return [...prevFavorites, product];
        }
        return prevFavorites;
        });
    };

    // Retirer des favoris
    const retirerDesFavoris = (productId) => {
        setFavorites((prevFavorites) =>
        prevFavorites.filter(item => item.id !== productId)
        );
    };

    // Toggle favori (ajouter ou retirer)
    const toggleFavori = (product) => {
        const existe = favorites.find(item => item.id === product.id);
        if (existe) {
        retirerDesFavoris(product.id);
        return false; // Retiré
        } else {
        ajouterAuxFavoris(product);
        return true; // Ajouté
        }
    };

    // Vérifier si un produit est favori
    const estFavori = (productId) => {
        return favorites.some(item => item.id === productId);
    };

    // Nombre total de favoris
    const getTotalFavorites = () => {
        return favorites.length;
    };

    return (
        <FavoritesContext.Provider
        value={{
            favorites,
            ajouterAuxFavoris,
            retirerDesFavoris,
            toggleFavori,
            estFavori,
            getTotalFavorites,
        }}
        >
        {children}
        </FavoritesContext.Provider>
    );
    }