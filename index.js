import app from "./src/app.js";
import { env } from "./src/config/env.js";

app.listen(env.port, env.host, () => {
  console.log(
    `MoviesMentor Backend is running at http://${env.host}:${env.port}`,
  );
});
