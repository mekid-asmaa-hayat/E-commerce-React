    import { useContext } from "react";
    import { AuthContext } from "../context/AuthContext";
    import { Link } from "react-router-dom";

    export default function Home() {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
            Bienvenue sur SEPHORA
            </h1>

            {user ? (
            <div>
                <p className="text-xl text-gray-600 mb-8">
                Bonjour, {user.email} ! 👋
                </p>
                <Link
                to="/profile"
                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                Voir mon profil
                </Link>
            </div>
            ) : (
            <div>
                <p className="text-xl text-gray-600 mb-8">
                Découvrez nos parfums et produits de beauté
                </p>
                <div className="flex gap-4 justify-center">
                <Link
                    to="/register"
                    className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                    Créer un compte
                </Link>
                <Link
                    to="/login"
                    className="bg-white text-black border-2 border-black px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                    Se connecter
                </Link>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }