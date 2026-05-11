export const GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  science: 878,
  fiction: 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

const GENRE_ALIASES = {
  funny: "comedy",
  fun: "comedy",
  humorous: "comedy",
  hilarious: "comedy",
  scary: "horror",
  suspense: "thriller",
  romantic: "romance",
  sci: "science",
};

export const parseDiscoverQuery = (query = "") => {
  const normalizedQuery = query.toLowerCase();
  let genreId = null;

  Object.entries({ ...GENRE_MAP, ...GENRE_ALIASES }).forEach(([genre, value]) => {
    const genrePattern = new RegExp(`\\b${genre}\\b`);

    if (genrePattern.test(normalizedQuery)) {
      const genreKey = typeof value === "string" ? value : genre;
      genreId = GENRE_MAP[genreKey];
    }
  });

  return {
    year: normalizedQuery.match(/\b(19\d{2}|20\d{2})\b/)?.[0],
    isHindi: /\b(hindi|bollywood)\b/.test(normalizedQuery),
    isIndian: /\b(indian|india|bollywood)\b/.test(normalizedQuery),
    isLatest: ["latest", "new", "recent", "current"].some((word) =>
      normalizedQuery.includes(word),
    ),
    genreId,
  };
};
