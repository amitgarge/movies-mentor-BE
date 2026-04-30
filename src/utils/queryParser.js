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

export const parseDiscoverQuery = (query = "") => {
  const normalizedQuery = query.toLowerCase();
  let genreId = null;

  Object.keys(GENRE_MAP).forEach((genre) => {
    if (normalizedQuery.includes(genre)) {
      genreId = GENRE_MAP[genre];
    }
  });

  return {
    year: normalizedQuery.match(/\b(19\d{2}|20\d{2})\b/)?.[0],
    isHindi: normalizedQuery.includes("hindi"),
    isLatest: ["latest", "new", "recent", "current"].some((word) =>
      normalizedQuery.includes(word),
    ),
    genreId,
  };
};
