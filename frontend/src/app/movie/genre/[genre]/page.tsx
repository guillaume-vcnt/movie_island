import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/types/globals";

export default async function MovieGenrePage({
  params,
}: {
  readonly params: { genre: string };
}) {
  const { genre } = params;
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movie?genre=${genre}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const genreMovie = await data.json();
  console.log("🎥", genreMovie);

  const movieArray: Movie[] = genreMovie.data;
  console.log("🎥", movieArray);

  return (
    <div id="genre" className="flex justify-center mt-[1rem]">
      <div className="flex flex-col">
        <h1 className="self-center font-bold">Page {genre}</h1>
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
}
