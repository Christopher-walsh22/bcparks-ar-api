const { logger } = require("/opt/loggerLayer");

exports.handler = async (event, context) => {
    logger.debug("Variance post:", event);
    return sendResponse(501, { msg: "Error: Not implemented." }, context);
  };
  