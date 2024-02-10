const mongoose = require("mongoose");
const { log, success, error, debug } = require("../../../../../Global/Helpers/Logger");
const System = require("../../../../../Global/Settings/System");

mongoose.connect(System.MongoURL, { useNewUrlParser: true, useUnifiedTopology: true, });

mongoose.connection.on("connected", () => {
  debug("Database bağlantısı tamamlandı!");
});
mongoose.connection.on("error", () => {
  debug("Database bağlantısı kurulamadı!");
});