export const getMovieCertification = (
    movie?: MovieDetails | null | undefined,
    countryCode: string = "US"
  ) => {
    const country = movie?.release_dates?.results?.find(
      (item) => item.iso_3166_1 === countryCode
    );

    const certification = country?.release_dates?.find(
      (item) => item.certification && item.certification.trim() !== ""
    )?.certification;

    return certification || "NR";
  };