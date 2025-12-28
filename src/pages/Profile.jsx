    import { useContext } from "react";
    import { AuthContext } from "../context/AuthContext";
    import { useNavigate } from "react-router-dom";

    export default function Profile() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
        await logout();
        navigate("/login");
        } catch (err) {
        console.error("Erreur lors de la déconnexion:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6">Mon Profil</h2>

            <div className="space-y-4">
            <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium">{user?.email}</p>
            </div>

            <div>
                <p className="text-sm text-gray-600">ID Utilisateur</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                {user?.uid}
                </p>
            </div>

            <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition mt-6"
            >
                Se déconnecter
            </button>
            </div>
        </div>
        </div>
    );
    }