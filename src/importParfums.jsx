import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

// 🧴 Tes parfums
const parfums = [
    {
    name: "Dior Sauvage",
    brand: "Dior",
    price: 89.99,
    category: "Homme",
    description: "Parfum frais et puissant",
    imageUrl: "https://via.placeholder.com/300",
    stock: 10
    },
    {
    name: "Chanel N°5",
    brand: "Chanel",
    price: 99.99,
    category: "Femme",
    description: "Parfum floral iconique",
    imageUrl: "https://via.placeholder.com/300",
    stock: 5
    },
    {
    name: "YSL Y",
    brand: "Yves Saint Laurent",
    price: 79.99,
    category: "Homme",
    description: "Frais et moderne",
    imageUrl: "https://via.placeholder.com/300",
    stock: 8
    }
    ];

    // 🚀 Fonction d’import
    async function importParfums() {
    const collectionRef = collection(db, "products");

    for (const parfum of parfums) {
        await addDoc(collectionRef, parfum);
        console.log("Parfum ajouté :", parfum.name);
    }

    console.log("✅ Import terminé !");
    }


importParfums();
