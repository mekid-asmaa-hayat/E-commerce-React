
    import { useContext, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { CartContext } from '../context/CartContext';
    import ToastWithUndo from '../Components/ToastWithUndo';

    function Panier() {
    const {
        cartItems,
        retirerDuPanier,
        augmenterQuantite,
        diminuerQuantite,
        viderPanier,
        getTotalPrice,
        getTotalItems,
        undoRemove,
        lastRemovedItem,
    } = useContext(CartContext);

    const [showToast, setShowToast] = useState(false);

    // Retirer sans confirmation
    const handleRetirer = (item) => {
        retirerDuPanier(item.id);
        setShowToast(true);
    };

    const handleUndo = () => {
        undoRemove();
        setShowToast(false);
    };

    if (cartItems.length === 0) {
        return (
        <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">
                Découvrez notre collection de parfums !
            </p>
            <Link
                to="/"
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800"
            >
                Découvrir nos produits
            </Link>
            </div>
        </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
        {/* Toast avec Undo */}
        {showToast && lastRemovedItem && (
            <ToastWithUndo
            message={`${lastRemovedItem.name} retiré du panier`}
            onUndo={handleUndo}
            onClose={() => setShowToast(false)}
            duration={5000}
            />
        )}

        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
            Mon Panier ({getTotalItems()} articles)
            </h1>
            <button
            onClick={viderPanier}
            className="text-red-600 hover:text-red-800 font-semibold"
            >
            🗑️ Vider le panier
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des produits */}
            <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
                <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4"
                >
                <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded"
                />

                <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.brand}</p>
                    <p className="text-xl font-bold">{item.price} €</p>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                    <button
                        onClick={() => diminuerQuantite(item.id)}
                        className="bg-white hover:bg-gray-200 w-8 h-8 rounded-full font-bold"
                    >
                        -
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => augmenterQuantite(item.id)}
                        className="bg-white hover:bg-gray-200 w-8 h-8 rounded-full font-bold"
                    >
                        +
                    </button>
                    </div>

                    <p className="text-xl font-bold">
                    {(item.price * item.quantity).toFixed(2)} €
                    </p>

                    {/* Bouton retirer - PAS de confirmation */}
                    <button
                    onClick={() => handleRetirer(item)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                    Retirer
                    </button>
                </div>
                </div>
            ))}
            </div>

            {/* Résumé */}
            <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-2xl font-bold mb-6">Résumé</h2>
                
                <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span>Articles ({getTotalItems()})</span>
                    <span className="font-semibold">{getTotalPrice().toFixed(2)} €</span>
                </div>
                
                <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600 font-semibold">Gratuite</span>
                </div>
                
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>{getTotalPrice().toFixed(2)} €</span>
                </div>
                </div>

                <button className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 mb-4">
                Commander
                </button>

                <Link to="/" className="block text-center text-gray-600 hover:text-black">
                ← Continuer mes achats
                </Link>
            </div>
            </div>
        </div>
        </div>
    );
    }

    export default Panier;