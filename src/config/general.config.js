import { config } from "dotenv";

config();

const configObject = {
  PORT: process.env.PORT,
  TOKEN: process.env.URI
}

export default configObject;
