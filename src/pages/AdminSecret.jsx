    import { useState } from 'react';
    import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
    import { db } from '../firebase';
    import { Trash2, Edit2, Plus, Save, X, Upload } from 'lucide-react';

    export default function AdminSecret() {
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

    // NOUVEAU : Import automatique de produits de démonstration
    const importDemoProducts = async () => {
        if (!window.confirm('Voulez-vous importer 10 produits makeup de démonstration ?')) return;
        
        setLoading(true);
        
        const demoProducts = [
        {
            name: "Pro Filt'r Soft Matte Foundation",
            brand: "Fenty Beauty",
            price: 39.99,
            stock: 25,
            description: "Fond de teint longue tenue au fini mat naturel. Couvre les imperfections sans effet masque.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=Fenty+Foundation",
            createdAt: new Date().toISOString()
        },
        {
            name: "Shape Tape Contour Concealer",
            brand: "Tarte",
            price: 29.99,
            stock: 35,
            description: "Correcteur ultra-couvrant qui cache les cernes et imperfections. Tenue 12h sans craqueler.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=Tarte+Concealer",
            createdAt: new Date().toISOString()
        },
        {
            name: "Orgasm Blush",
            brand: "NARS",
            price: 32.00,
            stock: 28,
            description: "Blush iconique avec reflets dorés. Couleur modulable qui flatte tous les teints.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=NARS+Orgasm",
            createdAt: new Date().toISOString()
        },
        {
            name: "Naked3 Eyeshadow Palette",
            brand: "Urban Decay",
            price: 56.00,
            stock: 25,
            description: "12 fards à paupières roses et nude. Finis mat, satiné et paillettes.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=Naked3",
            createdAt: new Date().toISOString()
        },
        {
            name: "Better Than Sex Mascara",
            brand: "Too Faced",
            price: 27.00,
            stock: 30,
            description: "Mascara culte pour volume et longueur. Formule collagène.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=BTS+Mascara",
            createdAt: new Date().toISOString()
        },
        {
            name: "Ruby Woo Lipstick",
            brand: "MAC",
            price: 21.00,
            stock: 30,
            description: "Rouge iconique mat bleu-rouge. Couleur intense longue tenue.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=Ruby+Woo",
            createdAt: new Date().toISOString()
        },
        {
            name: "Gloss Bomb Lip Luminizer",
            brand: "Fenty Beauty",
            price: 20.00,
            stock: 32,
            description: "Gloss universel effet miroir. Brillance extrême non collante.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=Gloss+Bomb",
            createdAt: new Date().toISOString()
        },
        {
            name: "Brow Wiz",
            brand: "Anastasia Beverly Hills",
            price: 25.00,
            stock: 30,
            description: "Crayon sourcils ultra-fin pour tracés précis. Mine rétractable waterproof.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=Brow+Wiz",
            createdAt: new Date().toISOString()
        },
        {
            name: "Beauty Blender Original",
            brand: "Beauty Blender",
            price: 22.00,
            stock: 45,
            description: "Éponge iconique pour application parfaite. Sans latex, ne laisse pas de trace.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=BeautyBlender",
            createdAt: new Date().toISOString()
        },
        {
            name: "All Nighter Setting Spray",
            brand: "Urban Decay",
            price: 35.00,
            stock: 28,
            description: "Spray fixateur longue tenue. Garde le maquillage frais 16h.",
            imageUrl: "https://placehold.co/300x400/pink/white?text=All+Nighter",
            createdAt: new Date().toISOString()
        }
        ];

        try {
        let successCount = 0;
        
        for (const product of demoProducts) {
            await addDoc(collection(db, 'makeup'), product);
            successCount++;
        }
        
        showMessage(`✅ ${successCount} produits makeup importés avec succès !`);
        loadProducts();
        } catch (error) {
        showMessage('❌ Erreur lors de l\'import: ' + error.message, 'error');
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
            await updateDoc(doc(db, 'makeup', editingProduct.id), productData);
            showMessage('✅ Produit mis à jour !');
        } else {
            await addDoc(collection(db, 'makeup'), productData);
            showMessage('✅ Produit makeup ajouté avec succès !');
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
            <div className="mt-4 flex gap-4 flex-wrap">
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
                {/* NOUVEAU BOUTON D'IMPORT */}
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
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                    </label>
                    <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="10"
                    />
                </div>

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
                        onError={(e) => e.target.src = 'https://placehold.co/200x200/pink/white?text=Image+invalide'}
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
                        onError={(e) => e.target.src = 'https://placehold.co/300x300/pink/white?text=Makeup'}
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
            <div className="mt-8 bg-pink-50 border border-pink-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">💄 Instructions rapides :</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>🚀 <strong>Option rapide :</strong> Cliquez sur "Importer 10 produits démo" pour commencer immédiatement</li>
                <li>OU cliquez sur "Ajouter un produit" pour ajouter manuellement</li>
                <li>Remplissez tous les champs obligatoires (nom, marque, prix, image)</li>
                <li>Cliquez sur "Charger les produits" pour voir vos ajouts</li>
            </ol>
            <p className="mt-4 text-sm text-gray-600">
                💡 <strong>Astuce :</strong> Utilisez l'import démo pour tester rapidement, puis remplacez par vos vrais produits !
            </p>
            </div>
        </div>
        </div>
    );
    }