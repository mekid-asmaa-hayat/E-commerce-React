import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar"
import Products from "./Components/Products";
import TopBar from "./Components/TopBar";
import Menu from "./Components/Menu";
import Connecter from "./Components/Connecter";
import Body from "./Components/Body";

function App() {
  return (
    <>
    <TopBar/>
    <Router>
      <Navbar />

      <div className="pt-20">
        <Routes>
          
          <Route path="/Menu" element={<Menu />} />
      
        
        </Routes>
      </div>
    </Router>
    <Connecter/>
    <Body/>
    
    </>
  );
}

export default App;
