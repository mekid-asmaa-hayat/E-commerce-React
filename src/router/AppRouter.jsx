    import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
    import { useContext } from "react";

    import Navbar from "../components/Navbar";
    import Home from "../pages/Home";


    import { AuthContext } from "../context/AuthContext";

    // Route protégée
    function PrivateRoute({ children }) {
    const { user } = useContext(AuthContext);
    return user ? children : <Navigate to="/login" />;
    }

    export default function AppRouter() {
    return (
        <BrowserRouter>
        <Navbar />

        {/* padding-top à cause du navbar fixed */}
        <div className="pt-28">
            <Routes>
            <Route path="/" element={<Home />} />
            

        
            </Routes>
        </div>
        </BrowserRouter>
    );
    }
