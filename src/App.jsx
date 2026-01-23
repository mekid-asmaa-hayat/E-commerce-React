import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Products from "./Components/Products";
import Panier from "./Components/Panier";
import Favoris from "./pages/Favoris";
import Search from "./pages/Search";
import Offres from "./Components/Offres";
import Makeup from "./Components/Makeup";
import AdminSecret from "./pages/AdminSecret";

import AdminSkincare from "./pages/AdminSkincare";
import Skincare from './Components/Skincare';

function App() {
  return (
    <>
      <Navbar />
      
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Products" element ={<Products />} />
          <Route path="/Panier" element ={<Panier />} />
          <Route path="/Favoris" element ={<Favoris />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/Offres" element={<Offres />} />
          <Route path="/Makeup" element={<Makeup />} />
          <Route path="/Skincare" element={<Skincare />} />
          <Route path="/admin-secret-2026" element={<AdminSecret />} />
      
          <Route path="/admin-skincare" element={<AdminSkincare />} />
          
        </Routes>
      </div>
    </>
  );
}

export default App;  