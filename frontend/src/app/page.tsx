"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { Movie, ApiResponse } from "@/types/globals";

export default function HomePage() {
  const [data, setData] = useState<Movie[]>([]); // Liste des films + Typage avec Movie[]
  const [favorites, setFavorites] = useState<number[]>([]); // Liste des favoris + Typage avec string[]
  console.log("Données reçues:", data); // Log des données pour vérifier
  console.log("Favoris reçues:", favorites); // Log des données pour vérifier

  useEffect(() => {
    // Récupérer les favoris depuis localStorage
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") ?? "[]"
    );

    // Log pour avant conversion
    console.log("Favoris type avant conversion:", storedFavorites);

    // Convertir chaque ID en nombre
    const favoriteToNumbers = storedFavorites.map((id: string) =>
      parseInt(id, 10)
    );

    // Log pour vérifier la conversion
    console.log("Favoris convertis en nombres:", favoriteToNumbers);

    // Mettre à jour l'état des favoris
    setFavorites(favoriteToNumbers);

    // Récupérer les films depuis l'API
    const fetchData = async () => {
      // Ce code s'exécute après le premier rendu du composant (équivalent à componentDidMount en class component)
      try {
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movie`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Parse la réponse en JSON.
        // Typage de la réponse API avec ApiResponse
        const response: ApiResponse<Movie[]> = await data.json();
        console.log("Données reçues:", response);

        // Mettre à jour l'état avec les données récupérées
        setData(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData(); // Appel de la fonction async pour récupérer les données
  }, []);

  // Filtrer les films favoris à partir de l'ID
  const favoriteMovies = data.filter((movie) => favorites.includes(movie.id));

  return (
    <>
      <div id="title" className="flex justify-center mt-[1rem] mb-[1rem]">
        <Link className="font-bold" href="/">
          MOVIE ISLAND HOME PAGE
        </Link>
      </div>
      <div id="search-bar" className="flex justify-center mb-[1.5rem]">
        <SearchBar />
      </div>
      <div id="filter" className="flex justify-center gap-5 mb-[1.5rem]">
        <Link className="font-bold" href={"/movie/genre/Horror"}>
          Horror
        </Link>
        <Link className="font-bold" href={"/movie/genre/Adventure"}>
          Adventure
        </Link>
        <Link className="font-bold" href={"/movie/genre/Science-Fiction"}>
          Science-Fiction
        </Link>
      </div>
      <div id="movies" className="flex justify-center gap-5">
        {data.map((movie) => (
          <div key={movie.id}>
            <Link href={`/movie/${movie.id}`}>
              <Image
                src={movie.poster}
                alt="Poster du film"
                width={100}
                height={150}
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
          </div>
        ))}
      </div>
      <h1
        id="favorite-title"
        className="flex justify-center font-bold mt-[2.5rem] mb-[1.5rem]"
      >
        ⭐ Favorites
      </h1>
      <div id="favorite-movies" className="flex justify-center gap-5">
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map((movie) => (
            <div key={movie.id}>
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={movie.poster}
                  alt="Poster du film"
                  width={100}
                  height={150}
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center">You have no movies in your favorites</p>
        )}
      </div>
    </>
  );
}
