    // src/Components/ToastUndo.jsx
    import { useEffect, useState } from 'react';

    function ToastUndo({ message, productName, onUndo, onClose, duration = 5000 }) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        // Fermeture automatique
        const closeTimer = setTimeout(() => {
        onClose();
        }, duration);

        // Barre de progression
        const interval = setInterval(() => {
        setProgress((prev) => {
            const newProgress = prev - (100 / (duration / 100));
            return newProgress <= 0 ? 0 : newProgress;
        });
        }, 100);

        return () => {
        clearTimeout(closeTimer);
        clearInterval(interval);
        };
    }, [duration, onClose]);

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
        <div className="bg-gray-900 text-white rounded-lg shadow-2xl overflow-hidden min-w-[400px] max-w-[500px]">
            {/* Contenu */}
            <div className="px-6 py-4 flex items-center justify-between gap-4">
            {/* Icône + Message */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                </div>
                
                <div>
                <p className="font-semibold">{message}</p>
                {productName && (
                    <p className="text-sm text-gray-300">{productName}</p>
                )}
                </div>
            </div>

            {/* Bouton Annuler */}
            <button
                onClick={onUndo}
                className="bg-white text-gray-900 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
                Annuler
            </button>

            {/* Bouton fermer */}
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            </div>

            {/* Barre de progression */}
            <div className="h-1 bg-gray-700">
            <div 
                className="h-full bg-green-500 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
            ></div>
            </div>
        </div>
        </div>
    );
    }

    export default ToastUndo;