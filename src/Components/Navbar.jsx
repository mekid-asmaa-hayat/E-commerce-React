    import { NavLink } from "react-router-dom";
    import { useState } from "react";
    import { Search, UserRound, Handbag, Menu } from "lucide-react";
    import SearchOverlay from "./SearchOverlay";
    

    export default function Navbar() {
    const [openSearch, setOpenSearch] = useState(false);
    const [query, setQuery] = useState("");
    const [openResults, setOpenResults] = useState(false);
        

    return (
        <>
        {/* NAVBAR */}
        <nav className="fixed top-9 w-full z-50  border-b border-b-gray-300 px-2">
            <div className="max-w-9xl mx-auto px-2  h-16 flex items-center gap-6">
            
            {/* MENU */}
            <NavLink to="/Menu">
                <Menu size={24} />
            </NavLink>

            {/* LOGO */}
            <NavLink
                to="/"
                className="text-2xl lg:text-3xl font-medium tracking-[.35em] uppercase"
            >
                SEPHORA
            </NavLink>
<div className="flex-1">
  <div className="relative flex items-center bg-gray-100 rounded-full px-4 py-3">
    
    <Search size={18} className="text-gray-500 mr-3" />

    <input
        type="text"
        placeholder="Rechercher un parfum, une marque..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpenSearch(true)}
        className="w-full bg-transparent outline-none text-sm text-black placeholder-gray-500"
        />
    </div>
</div>


   

            {/* USER */}
            <NavLink to="/">
                <UserRound size={24} />
            </NavLink>

            {/* BAG */}
            <NavLink to="/">
                <Handbag size={24} />
            </NavLink>

            </div>
        </nav>

        {/* SEARCH OVERLAY */}
        {openSearch && (
            <SearchOverlay onClose={() => setOpenSearch(false)} />
        )}
        </>
    );
    }
