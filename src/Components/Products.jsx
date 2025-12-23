    import { useEffect, useState } from "react";
    import { collection, getDocs } from "firebase/firestore";
    import { db } from "../firebase"; 

    function Products() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getDocs(collection(db, "products"))
        .then((querySnapshot) => {
            const list = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));

            setProducts(list);
        })
        .catch((error) => {
            console.error("ERREUR FIRESTORE :", error);
        });
    }, []);

    return (
        <div>
        <h1>Produits Parfum</h1>

        {products.length === 0 && <p>Aucun parfum</p>}

        {products.map((product) => (
            <div key={product.id} style={{ marginBottom: "30px" }}>
            <h3>{product.name}</h3>
            <p>{product.brand}</p>
            <p>{product.price} €</p>
            <p>{product.description}</p>
            <p>Stock : {product.stock}</p>

            <img
                src={product.imageUrl}
                alt={product.name}
                width="200"
            />
            </div>
        ))}
        </div>
    );
    }

    export default Products;
