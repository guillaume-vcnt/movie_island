import Link from "next/link";

export default async function QuizPage({
  params,
}: {
  readonly params: { id: string };
}) {
  const { id } = await params;
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/movie/${id}/quiz`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const movieQuiz = await data.json();
  console.log(movieQuiz.quiz);

  return (
    <div className="flex justify-center">
      <div id="quiz" className="flex flex-col">
        <h1 className="font-bold self-center mt-[1rem] mb-[1rem]">Quiz page</h1>
        <p className="font-bold text-red-500">Question:</p>{" "}
        {movieQuiz.quiz.question}
        <p className="font-bold text-red-500">Answers:</p>{" "}
        {movieQuiz.quiz.answers}
        <p className="font-bold text-red-500">Correct answers:</p>{" "}
        {movieQuiz.quiz.correct_answer}
        <Link className="mt-[1rem] self-center" href={`/movie/${id}`}>
          Return to movie page
        </Link>
      </div>
    </div>
  );
}
