import mongoose from "mongoose";
import config from "./config.js";
import AppError from "../helpers/Error.js";

const connection = () => {
  mongoose.connect(config.dbUrl);
  mongoose.connection
    .on("connected", () =>
      console.log(
        `[MongoDB] : ==> default connection open to > ${config.dbUrl}`
      )
    )
    .on("error", (error) => {
      if (error) throw new AppError("Mongoose Conection Error", error.message);
    })
    .on("disconnected", () =>
      console.log(`Mongoose default connection disconnected`)
    );

  process.on("SIGINT", function () {
    mongoose.connection.close(function () {
      console.log(
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    });
  });
};

export default connection;
