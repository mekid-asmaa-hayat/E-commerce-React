    import { X } from "lucide-react";

    export default function SearchOverlay({ onClose }) {
    return (
        <div className="fixed top-16 left-0 w-full h-screen bg-white z-40">
        
        {/* HEADER */}
        <div className="max-w-7xl mt-8 mx-auto px-6 py-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recherches populaires</h2>
            <button onClick={onClose}>
            <X size={24} />
            </button>
        </div>

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-6">
            <ul className="space-y-4 text-lg">
            <li className="hover:underline cursor-pointer">
                Idées cadeaux de Noël
            </li>
            <li className="hover:underline cursor-pointer">
                Secret Santa
            </li>
            <li className="hover:underline cursor-pointer">
                Carte Cadeau
            </li>
            <li className="hover:underline cursor-pointer">
                Korean beauty
            </li>
            <li className="hover:underline cursor-pointer">
                One/Size
            </li>
            </ul>
        </div>

        </div>
    );
    }
