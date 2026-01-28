    import { useState } from 'react';
    import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
    import { db } from '../firebase';
    import { Trash2, Edit2, Plus, Save, X } from 'lucide-react';

    export default function AdminMakeup() {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        description: '',
        imageUrl: '',
        stock: 10
    });

    // Afficher un message temporaire
    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    // Charger tous les produits makeup
    const loadProducts = async () => {
        try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'makeup'));
        const productsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setProducts(productsData);
        showMessage(`${productsData.length} produits makeup chargés`);
        } catch (error) {
        showMessage('Erreur lors du chargement: ' + error.message, 'error');
        } finally {
        setLoading(false);
        }
    };

    // Ajouter un produit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            createdAt: new Date().toISOString()
        };

        if (editingProduct) {
            // Mise à jour
            await updateDoc(doc(db, 'makeup', editingProduct.id), productData);
            showMessage('✅ Produit mis à jour !');
        } else {
            // Ajout
            await addDoc(collection(db, 'makeup'), productData);
            showMessage('✅ Produit makeup ajouté avec succès !');
        }

        // Réinitialiser le formulaire
        setFormData({
            name: '',
            brand: '',
            price: '',
            description: '',
            imageUrl: '',
            stock: 10
        });
        setEditingProduct(null);
        setShowForm(false);
        loadProducts();
        } catch (error) {
        showMessage('❌ Erreur: ' + error.message, 'error');
        } finally {
        setLoading(false);
        }
    };

    // Supprimer un produit
    const handleDelete = async (id, name) => {
        if (!window.confirm(`Supprimer "${name}" ?`)) return;

        try {
        await deleteDoc(doc(db, 'makeup', id));
        showMessage('🗑️ Produit supprimé');
        loadProducts();
        } catch (error) {
        showMessage('Erreur lors de la suppression', 'error');
        }
    };

    // Éditer un produit
    const handleEdit = (product) => {
        setFormData({
        name: product.name,
        brand: product.brand,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        stock: product.stock
        });
        setEditingProduct(product);
        setShowForm(true);
    };

    // Annuler l'édition
    const handleCancel = () => {
        setFormData({
        name: '',
        brand: '',
        price: '',
        description: '',
        imageUrl: '',
        stock: 10
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <h1 className="text-4xl font-bold mb-2">💄 Admin Makeup Panel</h1>
            <p className="text-white/90">Interface d'administration - Gestion des produits makeup</p>
            <div className="mt-4 flex gap-4">
                <button
                onClick={() => setShowForm(!showForm)}
                className="bg-white text-pink-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                >
                <Plus className="w-5 h-5" />
                {showForm ? 'Fermer le formulaire' : 'Ajouter un produit'}
                </button>
                <button
                onClick={loadProducts}
                className="bg-white/20 backdrop-blur text-white px-6 py-2 rounded-full font-semibold hover:bg-white/30 transition"
                >
                Charger les produits ({products.length})
                </button>
            </div>
            </div>

            {/* Message Toast */}
            {message && (
            <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'error' 
                ? 'bg-red-100 text-red-800 border border-red-300' 
                : 'bg-green-100 text-green-800 border border-green-300'
            } animate-fade-in`}>
                {message.text}
            </div>
            )}

            {/* Formulaire d'ajout/édition */}
            {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                {editingProduct ? '✏️ Modifier le produit' : '➕ Ajouter un nouveau produit makeup'}
                </h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: Rouge à Lèvres Mat Longue Tenue"
                    />
                </div>

                {/* Marque */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marque *
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: MAC, Fenty Beauty, NARS..."
                    />
                </div>

                {/* Prix */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (€) *
                    </label>
                    <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="24.99"
                    />
                </div>

                {/* Stock */}
                
                

                {/* URL Image Cloudinary */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image Cloudinary *
                    </label>
                    <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://res.cloudinary.com/..."
                    />
                    {formData.imageUrl && (
                    <div className="mt-3">
                        <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="h-40 w-auto object-cover rounded-lg border"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/200x200?text=Image+invalide'}
                        />
                    </div>
                    )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                    </label>
                    <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Description du produit makeup..."
                    />
                </div>

                {/* Boutons */}
                <div className="md:col-span-2 flex gap-4">
                    <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                    <Save className="w-5 h-5" />
                    {loading ? 'En cours...' : (editingProduct ? 'Mettre à jour' : 'Ajouter le produit')}
                    </button>
                    {editingProduct && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                    >
                        <X className="w-5 h-5" />
                        Annuler
                    </button>
                    )}
                </div>
                </form>
            </div>
            )}

            {/* Liste des produits */}
            {products.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">
                💄 Produits makeup existants ({products.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <div className="relative h-48 bg-gray-100">
                        <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x300?text=Makeup'}
                        />
                    </div>
                    
                    <div className="p-4">
                        <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold">{product.price} €</span>
                        
                        </div>
                        
                        <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(product)}
                            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" />
                            Modifier
                        </button>
                        <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Instructions */}
            <div className="mt-8 bg-pink-50 border border-pink-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">💄 Instructions rapides :</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Cliquez sur "Ajouter un produit" pour ouvrir le formulaire</li>
                <li>Remplissez tous les champs obligatoires (nom, marque, prix, image)</li>
                <li>Ajoutez une description détaillée du produit</li>
                <li>Cliquez sur "Ajouter le produit"</li>
                <li>Le formulaire se vide automatiquement pour le suivant</li>
                <li>Répétez pour tous vos produits makeup ⚡</li>
            </ol>
            <p className="mt-4 text-sm text-gray-600">
                💡 <strong>Astuce :</strong> Préparez un fichier avec toutes vos URLs Cloudinary pour copier-coller rapidement !
            </p>
            </div>
        </div>
        </div>
    );
    }