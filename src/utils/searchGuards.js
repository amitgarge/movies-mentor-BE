const NON_MOVIE_RESPONSE_PATTERNS = [
  /\bi'?m sorry\b/i,
  /\bsorry\b/i,
  /\bas an ai\b/i,
  /\bi (cannot|can't|do not|don't) (provide|find|recommend|suggest)\b/i,
  /\bunable to\b/i,
  /\bnot (a )?(valid|meaningful) (movie )?(query|request)\b/i,
  /\bmeaningless\b/i,
  /\brandom (string|text|query)\b/i,
  /\bno (movie|movies|recommendations?)\b/i,
];

const ADULT_CONTENT_QUERY_PATTERNS = [
  /\b18\s*\+?\b/i,
  /\badult\s*(content|movie|movies|film|films|video|videos)?\b/i,
  /\bsex(ual)?\b/i,
  /\berotic(a)?\b/i,
  /\bnude|nudity\b/i,
  /\bporn(ographic|ography)?\b/i,
  /\bxxx\b/i,
  /\bexplicit\s*(content|movie|movies|film|films)?\b/i,
];

const UNSAFE_MOVIE_CONTENT_PATTERNS = [
  /\b18\s*\+?\b/i,
  /\badult\b/i,
  /\bafter dark\b/i,
  /\bbikini\b/i,
  /\berotic(a)?\b/i,
  /\bexplicit\b/i,
  /\bfetish\b/i,
  /\bhot girls?\b/i,
  /\bintimate\b/i,
  /\blust\b/i,
  /\bnaked\b/i,
  /\bnude|nudity\b/i,
  /\bplayboy\b/i,
  /\bporn(ographic|ography)?\b/i,
  /\bseduction\b/i,
  /\bsensual\b/i,
  /\bsex(ual)?\b/i,
  /\bstrip(per|tease)?\b/i,
  /\bxxx\b/i,
];

const KNOWN_SHORT_TITLES = new Set(["rrr", "up", "us", "it", "her"]);

export const hasAdultContentIntent = (query = "") =>
  ADULT_CONTENT_QUERY_PATTERNS.some((pattern) => pattern.test(query));

export const isMovieQuery = (query = "") => {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 3) return false;
  if (trimmedQuery.length > 80) return false;
  if (hasAdultContentIntent(trimmedQuery)) return false;

  const validPattern = /^[a-zA-Z0-9\s:'&.,-]+$/;
  if (!validPattern.test(trimmedQuery)) return false;

  const compactQuery = trimmedQuery.toLowerCase().replace(/\s+/g, "");
  const alphaOnly = compactQuery.replace(/[^a-z]/g, "");
  const words = trimmedQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const isKnownShortTitle = KNOWN_SHORT_TITLES.has(compactQuery);
  const isAcronymLikeTitle = /^[A-Z0-9]{2,5}$/.test(trimmedQuery);

  if (!/[a-z0-9]/i.test(trimmedQuery)) return false;
  if (/^(.)\1{2,}$/i.test(alphaOnly) && !isAcronymLikeTitle) return false;
  if (/^(.{2})\1+$/i.test(alphaOnly) && !isAcronymLikeTitle) return false;

  const uniqueLetters = new Set(alphaOnly).size;
  const hasVowel = /[aeiou]/i.test(alphaOnly);

  if (
    alphaOnly.length >= 4 &&
    !hasVowel &&
    !isAcronymLikeTitle &&
    !isKnownShortTitle
  ) {
    return false;
  }

  if (alphaOnly.length >= 4 && uniqueLetters < 3 && !isKnownShortTitle) {
    return false;
  }

  if (words.length === 1 && words[0].length <= 4 && !hasVowel) {
    return isAcronymLikeTitle || isKnownShortTitle;
  }

  return true;
};

export const hasNonMovieAIResponse = (response = "") =>
  NON_MOVIE_RESPONSE_PATTERNS.some((pattern) => pattern.test(response));

export const parseMovieNamesFromAIResponse = (response = "") => {
  if (!response || hasNonMovieAIResponse(response)) return [];

  const candidates = response
    .split(/\n|,/)
    .map((movie) =>
      movie
        .replace(/^\s*(\d+[\).:-]?|[-*])\s*/, "")
        .replace(/^["']|["']$/g, "")
        .trim(),
    )
    .filter(Boolean);

  const validNames = candidates.filter((movie) => {
    if (movie.length > 80) return false;
    if (/[?!]/.test(movie)) return false;
    if (movie.split(/\s+/).length > 8) return false;
    if (!/^[a-zA-Z0-9\s:'&.,-]+$/.test(movie)) return false;

    return isMovieQuery(movie);
  });

  return [...new Set(validNames)].slice(0, 5);
};

export const hasUnsafeMovieContent = (movie = {}) => {
  const searchableText = [
    movie.title,
    movie.original_title,
    movie.name,
    movie.original_name,
    movie.overview,
    movie.tagline,
  ]
    .filter(Boolean)
    .join(" ");

  return UNSAFE_MOVIE_CONTENT_PATTERNS.some((pattern) =>
    pattern.test(searchableText),
  );
};

export const filterValidTMDBMovies = (movies = [], filters = {}) => {
  if (!Array.isArray(movies)) return [];

  return movies.filter((movie) => {
    const title = movie?.title || movie?.original_title;

    return Boolean(
      movie?.id &&
        title &&
        movie?.poster_path &&
        movie?.adult !== true &&
        !hasUnsafeMovieContent(movie) &&
        (!filters.originCountry ||
          !Array.isArray(movie?.origin_country) ||
          movie?.origin_country?.includes(filters.originCountry)) &&
        (!filters.originalLanguage ||
          movie?.original_language === filters.originalLanguage) &&
        (movie?.release_date ||
          movie?.first_air_date ||
          movie?.media_type !== "tv"),
    );
  });
};
