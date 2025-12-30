import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Products from "./Components/Products";
import Panier from "./Components/Panier";
import Favoris from "./pages/Favoris";

function App() {
  return (
    <>
      <Navbar />
      
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Products" element ={<Products />} />
          <Route path="/Panier" element ={<Panier />} />
          <Route path="/Favoris" element ={<Favoris />} />
        </Routes>
      </div>
    </>
  );
}

export default App;  