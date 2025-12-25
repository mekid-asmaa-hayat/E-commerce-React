    import { useState } from "react";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { auth } from "../firebase";

    export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Connexion réussie ✅");
        } catch (err) {
        setError("Email ou mot de passe incorrect");
        }
    };

    return (
        <form onSubmit={handleLogin} className="max-w-md mx-auto mt-20">
        <h2 className="text-2xl mb-4">Se connecter</h2>

        <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3"
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            type="password"
            placeholder="Mot de passe"
            className="border p-2 w-full mb-3"
            onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-black text-white w-full py-2">
            Connexion
        </button>
        </form>
    );
    }
