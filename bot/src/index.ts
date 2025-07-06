import "dotenv/config";
import { client } from "./classes/Client";
import logger from "./utils/logger";

async function main() {
  await client.login();
}

main();
