import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/types/globals";

export default async function SearchingPage({
  params,
}: {
  readonly params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("recherche :", slug);
  try {
    console.log(
      "🔍 Requête envoyée :",
      `${process.env.NEXT_PUBLIC_API_URL}/movie?searching=${slug}`
    );

    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/movie?searching=${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseFetch = await data.json();
    console.log("📥 Données brutes reçues :", responseFetch);
    const movieArray: Movie[] = responseFetch.data;
    console.log("🎥", movieArray);
    if (movieArray.length === 0) {
      return (
        <div
          id="searching-error"
          className="flex justify-center mt-[1rem] mb-[1rem]"
        >
          <div className="flex flex-col">
            <p className="font-bold text-red-500">❌ No movies found</p>
            <br></br>
            <Link className="flex self-center" href="/">
              Return to home page
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div id="searching" className="flex justify-center mt-[1rem]">
        <div className="flex flex-col">
          <h1 className="self-center font-bold">Searching page</h1>
          <div id="movies" className="flex mt-[1rem] mb-[1rem] gap-5">
            {movieArray.map((movie) => (
              <div key={movie.id}>
                <Link href={`/movie/${movie.id}`}>
                  {movie.title}
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
          <Link className="self-center" href="/">
            Return to home page
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }

  return (
    <div id="loading-error" className="flex justify-center mt-[1rem] mb-[1rem]">
      <div className="flex flex-col">
        <p className=" font-bold text-red-500">
          ❌ An error occurred while loading the movies
        </p>
        <br></br>
        <Link className="flex self-center" href="/">
          Return to home page
        </Link>
      </div>
    </div>
  );
}
