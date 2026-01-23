    import { useState } from 'react';
    import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
    import { db } from '../firebase';
    import { Trash2, Edit2, Plus, Save, X, Upload } from 'lucide-react';

    export default function AdminSkincare() {
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

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const loadProducts = async () => {
        try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'Skincare'));
        const productsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setProducts(productsData);
        showMessage(`${productsData.length} produits Skincare chargés`);
        } catch (error) {
        showMessage('Erreur lors du chargement: ' + error.message, 'error');
        } finally {
        setLoading(false);
        }
    };

    // Import automatique de VRAIS produits SKINCARE
    const importDemoProducts = async () => {
        if (!window.confirm('Voulez-vous importer 10 produits Skincare de démonstration ?')) return;
        
        setLoading(true);
        
        const demoProducts = [
        {
            name: "Crème Hydratante La Mer",
            brand: "La Mer",
            price: 185.00,
            stock: 15,
            description: "Crème hydratante luxueuse qui transforme la peau. Texture riche et nourrissante pour une hydratation intense.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=La+Mer",
            createdAt: new Date().toISOString()
        },
        {
            name: "Sérum Vitamin C",
            brand: "SkinCeuticals",
            price: 89.00,
            stock: 25,
            description: "Sérum antioxydant à la vitamine C pure. Illumine le teint et protège contre les radicaux libres.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=Vitamin+C",
            createdAt: new Date().toISOString()
        },
        {
            name: "Nettoyant Visage CeraVe",
            brand: "CeraVe",
            price: 14.99,
            stock: 50,
            description: "Nettoyant doux pour le visage aux céramides. Nettoie sans dessécher. Convient à tous les types de peau.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=CeraVe",
            createdAt: new Date().toISOString()
        },
        {
            name: "Crème Solaire SPF 50+",
            brand: "La Roche-Posay",
            price: 22.50,
            stock: 40,
            description: "Protection solaire très haute. Texture invisible non grasse. Résistante à l'eau.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=SPF+50",
            createdAt: new Date().toISOString()
        },
        {
            name: "Masque Détoxifiant",
            brand: "Origins",
            price: 35.00,
            stock: 30,
            description: "Masque au charbon actif qui purifie les pores en profondeur. Peau nette et matifiée.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=Mask",
            createdAt: new Date().toISOString()
        },
        {
            name: "Huile Démaquillante",
            brand: "DHC",
            price: 28.00,
            stock: 35,
            description: "Huile démaquillante japonaise. Élimine le maquillage waterproof en douceur. Rince à l'eau.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=DHC+Oil",
            createdAt: new Date().toISOString()
        },
        {
            name: "Crème Anti-Âge Rétinol",
            brand: "The Ordinary",
            price: 12.90,
            stock: 45,
            description: "Crème au rétinol 0.5%. Réduit les rides et ridules. Améliore la texture de la peau.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=Retinol",
            createdAt: new Date().toISOString()
        },
        {
            name: "Lotion Tonique P50",
            brand: "Biologique Recherche",
            price: 65.00,
            stock: 20,
            description: "Lotion exfoliante culte. Équilibre le pH et affine le grain de peau. Résultats visibles.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=P50",
            createdAt: new Date().toISOString()
        },
        {
            name: "Crème Contour des Yeux",
            brand: "Kiehl's",
            price: 42.00,
            stock: 28,
            description: "Soin contour des yeux à l'avocat. Hydrate et illumine le regard. Réduit les cernes.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=Eye+Cream",
            createdAt: new Date().toISOString()
        },
        {
            name: "Essence Hydratante",
            brand: "SK-II",
            price: 155.00,
            stock: 18,
            description: "Essence emblématique japonaise. Pitera™ pour une peau éclatante. Texture légère.",
            imageUrl: "https://placehold.co/300x400/blue/white?text=SK-II",
            createdAt: new Date().toISOString()
        }
        ];

        try {
        let successCount = 0;
        
        for (const product of demoProducts) {
            await addDoc(collection(db, 'Skincare'), product);
            successCount++;
        }
        
        showMessage(`✅ ${successCount} produits Skincare importés avec succès !`);
        loadProducts();
        } catch (error) {
        showMessage('❌ Erreur lors de l\'import: ' + error.message, 'error');
        } finally {
        setLoading(false);
        }
    };

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
            await updateDoc(doc(db, 'Skincare', editingProduct.id), productData);
            showMessage('✅ Produit mis à jour !');
        } else {
            await addDoc(collection(db, 'Skincare'), productData);
            showMessage('✅ Produit Skincare ajouté avec succès !');
        }

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

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Supprimer "${name}" ?`)) return;

        try {
        await deleteDoc(doc(db, 'Skincare', id));
        showMessage('🗑️ Produit supprimé');
        loadProducts();
        } catch (error) {
        showMessage('Erreur lors de la suppression', 'error');
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg shadow-lg p-8 mb-8 text-white">
            <h1 className="text-4xl font-bold mb-2">🧴 Admin Skincare Panel</h1>
            <p className="text-white/90">Interface d'administration - Gestion des produits de soin</p>
            <div className="mt-4 flex gap-4 flex-wrap">
                <button
                onClick={() => setShowForm(!showForm)}
                className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2"
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
                <button
                onClick={importDemoProducts}
                disabled={loading}
                className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-600 transition flex items-center gap-2 disabled:opacity-50"
                >
                <Upload className="w-5 h-5" />
                Importer 10 produits démo
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

            {/* Formulaire */}
            {showForm && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold mb-6">
                {editingProduct ? '✏️ Modifier le produit' : '➕ Ajouter un nouveau produit de soin'}
                </h2>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du produit *
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Crème Hydratante"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marque *
                    </label>
                    <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: La Mer, CeraVe..."
                    />
                </div>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="24.99"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                    </label>
                    <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image Cloudinary *
                    </label>
                    <input
                    type="url"
                    required
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://res.cloudinary.com/..."
                    />
                    {formData.imageUrl && (
                    <div className="mt-3">
                        <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="h-40 w-auto object-cover rounded-lg border"
                        onError={(e) => e.target.src = 'https://placehold.co/200x200/blue/white?text=Image+invalide'}
                        />
                    </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                    </label>
                    <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description du produit de soin..."
                    />
                </div>

                <div className="md:col-span-2 flex gap-4">
                    <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                    <Save className="w-5 h-5" />
                    {loading ? 'En cours...' : (editingProduct ? 'Mettre à jour' : 'Ajouter')}
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
                🧴 Produits Skincare existants ({products.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    <div className="relative h-48 bg-gray-100">
                        <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = 'https://placehold.co/300x300/blue/white?text=Skincare'}
                        />
                    </div>
                    
                    <div className="p-4">
                        <p className="text-xs text-gray-500 uppercase">{product.brand}</p>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold">{product.price} €</span>
                        <span className="text-sm text-gray-600">Stock: {product.stock}</span>
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
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">🧴 Instructions rapides :</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>🚀 Cliquez sur "Importer 10 produits démo" pour commencer rapidement</li>
                <li>OU cliquez sur "Ajouter un produit" pour ajouter manuellement</li>
                <li>Cliquez sur "Charger les produits" pour voir vos ajouts</li>
            </ol>
            <p className="mt-4 text-sm text-gray-600">
                💡 <strong>Note :</strong> Les produits importés sont des soins (crèmes, sérums, nettoyants, etc.)
            </p>
            </div>
        </div>
        </div>
    );
    }