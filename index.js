const app = require("./app");
const { PORT } = require("./utlis/config");
const { log } = require("./utlis/logger");

app.listen(PORT, () => {
  log("server is running");
});
