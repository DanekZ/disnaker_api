import "dotenv/config";

import logger from "./app/logging";
import web from "./app/web";

web.listen(3000, () => {
  logger.info("Server is running on port 3000");
});
