"use client";

import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  function handleKeyDown(key: string) {
    if (key === "Enter") {
      handleSearch(); // Si la touche appuyée est "Enter", on lance la recherche
    }
  }

  function handleSearch() {
    if (search.trim() === "") return; // Si la recherche est vide, ne rien faire
    router.push(`/searching/${search}`); // Rediriger vers la page de résultats de recherche
  }
  return (
    <div
      id="search-bar"
      className="flex items-center w-full max-w-[400px] h-[50px] p-1 border border-black rounded-full"
    >
      <input
        className="flex-1 p-2 bg-transparent text-black outline-none"
        type="text"
        placeholder="Recherche..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e.key)}
      />
      <button
        id="search-button"
        className="p-4 text-black bg-transparent cursor-pointer"
        onClick={handleSearch}
      >
        <FaSearch id="search-icon" className="text-[1.5rem]" />
      </button>
    </div>
  );
}
