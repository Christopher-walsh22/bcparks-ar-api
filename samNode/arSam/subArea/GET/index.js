// TODO: Decouple subArea get from park get endpoint.

const { logger } = require("./opt/loggerLayer");
exports.handler = async (event, context) => {
    logger.debug("Subarea get:", event);
    return sendResponse(501, { msg: "Error: Not implemented." }, context);
  };
  