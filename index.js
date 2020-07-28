const Sequelize = require("sequelize");
const axios = require("axios");
const https = require("https");

const sequelize = new Sequelize(
  `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  {
    // Choose one of the logging options
    logging: (...msg) => console.log(msg), // Displays all log function call parameters
  }
);

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

setInterval(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    instance
      .post(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
          chat_id: process.env.CHAT_ID,
          text: error,
          parse_mode: "HTML",
        }
      )
      .catch((error) => {
        console.log(error);
      });
  }
}, Number(process.env.CHECK_INTERVAL));
