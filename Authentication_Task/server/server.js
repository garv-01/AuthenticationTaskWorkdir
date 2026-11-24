import app from "./app/app.js";
import config from "./src/config/config.js";
import ConnectDB from "./src/config/db.js";

await ConnectDB();

const port = config.port;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});