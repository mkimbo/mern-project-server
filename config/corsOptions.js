const allowedOrigins = require("./allowedOrigins");

/* const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
} */

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST"],
};

module.exports = corsOptions;
