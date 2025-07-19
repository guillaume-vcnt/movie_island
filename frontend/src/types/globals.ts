// Interface pour l'utilisateur :
export interface User {
  id: string;
  username: string;
  email: string;
}

// Interface pour un film :
export interface Movie {
  id: number;
  director: string;
  title: string;
  genre: string;
  year: number;
  duration: number;
  audience: string;
  poster: string;
  rating: number;
}

// Interface pour une question de quiz :
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Interface pour une collection de films :
export interface Collection {
  id: string;
  userId: string;
  name: string;
  movies: Movie[];
  createdAt: string;
}

// Interface pour la gestion des réponses API :
//Le T est une variable de type générique en TypeScript. Elle est utilisée pour rendre l'interface flexible et réutilisable, sans avoir à définir un type fixe à l'avance. Quand tu utilises ApiResponse<T>, tu remplaces T par le type dont tu as besoin. T est une convention (comme i pour une boucle for) qui signifie "Type".
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  token?: string;
  message?: string;
  error?: string;
  statusCode?: number;
}
