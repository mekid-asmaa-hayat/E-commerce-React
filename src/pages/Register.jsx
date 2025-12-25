    import { useState } from "react";
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import { auth } from "../firebase";

    export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Compte créé avec succès 🎉");
        } catch (err) {
        setError(err.message);
        }
    };

    return (
        <form onSubmit={handleRegister} className="max-w-md mx-auto mt-20">
        <h2 className="text-2xl mb-4">Créer un compte</h2>

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
            S'inscrire
        </button>
        </form>
    );
    }
