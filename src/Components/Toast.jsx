    import { useEffect } from 'react';
    import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

    function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
        onClose();
        }, 2000); 

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
        <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
        
            <span className="text-2xl">
            {type === "success" ? (
                <FaCheckCircle className="text-white text-2xl" />
            ) : (
                <FaTimesCircle className="text-white text-2xl" />
            )}
            </span>
            
            <span className="font-semibold">{message}</span>
            
            <button
            onClick={onClose}
            className="ml-auto text-white hover:text-gray-200 font-bold text-xl"
            >
            ×
            </button>
        </div>
        </div>
    );
    }

    export default Toast;