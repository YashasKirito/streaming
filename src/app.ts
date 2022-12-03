import Fastify from "fastify";
import request from "request";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { API_KEY, TMDB_BASE_URL, URLS } from "./constants";
import { getInfo } from "./helpers/GetInfo";

const PORT = process.env.PORT || 3030;

const fastify = Fastify({
  logger: true,
});

// Declare a route
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/search", function (req, reply) {
  const { query } = req.query as any;
  if (!query) {
    reply.code(400).send({ error: "query is required" });
  } else {
    request(
      `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${API_KEY}`,
      function (error, response) {
        if (error) {
          reply.code(500).send({ error });
        }
        const data = JSON.parse(response.body);
        reply.send({
          ...data,
          results: (data.results as Array<any>)?.filter(
            (res) => res.media_type == "movie" || res.media_type == "tv"
          ),
        });
      }
    );
  }
});

fastify.get("/info", async function (req, reply) {
  const { title, id, media_type } = req.query as any;
  const res = await getInfo({ title, tmdbId: id, media_type });

  reply.send(res);
});

// Run the server!
fastify.listen(
  { port: typeof PORT === "string" ? parseInt(PORT) : PORT },
  function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    // Server is now listening on ${address}
  }
);
