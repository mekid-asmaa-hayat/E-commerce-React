    import { useState, useContext } from "react";
    import { AuthContext } from "../context/AuthContext";
    import { useNavigate, Link } from "react-router-dom";

    export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (password !== confirmPassword) {
        return setError("Les mots de passe ne correspondent pas");
        }

        if (password.length < 6) {
        return setError("Le mot de passe doit contenir au moins 6 caractères");
        }

        try {
        setError("");
        setLoading(true);
        await signup(email, password);
        navigate("/");
        } catch (err) {
        setError("Échec de la création du compte : " + err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-center mb-6">Créer un compte</h2>

            {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
                </label>
                <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="votre@email.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
                </label>
                <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
                </label>
                <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="••••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
            >
                {loading ? "Création..." : "Créer un compte"}
            </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-black font-medium hover:underline">
                Se connecter
            </Link>
            </p>
        </div>
        </div>
    );
    }