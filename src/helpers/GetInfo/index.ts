import axios from "axios";
// import { MOVIES } from "@consumet/extensions";
import { API_KEY } from "../../constants";

type GetInfoType = {
  title: string;
  tmdbId: number;
  media_type: "tv" | "movie";
};

const URLS = {
  tv: "https://api.themoviedb.org/3/tv",
  movie: "https://api.themoviedb.org/3/movie",
};

export const getInfo = async ({ tmdbId, media_type, title }: GetInfoType) => {
  // const flixhq = new MOVIES.FlixHQ();
  const url = URLS[media_type];

  const [tmdb, flixHQ] = await Promise.all([
    axios({
      headers: { "accept-encoding": null },
      method: "get",
      url: `${url}/${tmdbId}?api_key=${API_KEY}`,
      responseType: "json",
    }),
    axios({
      headers: { "accept-encoding": null },
      method: "get",
      url: `https://api.consumet.org/movies/flixhq/${encodeURIComponent(
        title
      )}`,
      responseType: "json",
    }),
    // flixhq.search(decodeURIComponent(title)),
  ]);

  const flexResults = flixHQ.data.results;

  const flixRecord = flexResults.find(
    (rec) =>
      rec.title === title &&
      rec.releaseDate === tmdb.data.release_date.split("-")[0]
  );

  let flexData = null;

  if (flixRecord) {
    const res = await axios({
      headers: { "accept-encoding": null },
      method: "get",
      url: `https://api.consumet.org/movies/flixhq/info`,
      responseType: "json",
      params: {
        id: flixRecord?.id,
      },
    });
    flexData = res.data;
  }

  return { ...tmdb.data, flix: flexData };
};
