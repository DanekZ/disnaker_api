import "dotenv/config";

import logger from "./app/logging";
import web from "./app/web";

const PORT = Number(process.env.PORT || 4000);
web.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
