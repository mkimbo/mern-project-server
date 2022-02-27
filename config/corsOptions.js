const allowedOrigins = require("./allowedOrigins");

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST"],
};

module.exports = corsOptions;
