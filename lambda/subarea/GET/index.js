const AWS = require('aws-sdk');
const { runQuery, TABLE_NAME } = require('../../dynamoUtil');
const { sendResponse } = require('../../responseUtil');

exports.handler = async (event, context) => {
  console.log('GET: Subarea', event);

  let queryObj = {
    TableName: TABLE_NAME
  };

  try {
    if (event.queryStringParameters?.orcs
        && event.queryStringParameters?.subAreaName
        && event.queryStringParameters?.activity
        && event.queryStringParameters?.date) {
      // Get the subarea details
      const orcs = event.queryStringParameters?.orcs;
      const subAreaName = event.queryStringParameters?.subAreaName;
      const activity = event.queryStringParameters?.activity;
      const date = event.queryStringParameters?.date;

      // Get me a list of this park's subarea details
      queryObj.ExpressionAttributeValues = {};
      queryObj.ExpressionAttributeValues[':pk'] = { S: `${orcs}::${subAreaName}::${activity}` };
      queryObj.ExpressionAttributeValues[':sk'] = { S: `${date}` };

      queryObj.KeyConditionExpression = 'pk =:pk AND sk =:sk';
      console.log("QUERY:", queryObj);
      // Get record (if exists)
      const parkData = await runQuery(queryObj);
      console.log("parkData:", parkData);

      // Attach current config
      let configObj = {
        TableName: TABLE_NAME,
        ExpressionAttributeValues: {
          ':pk':  { S: `${orcs}::${subAreaName}::${activity}` },
          ':sk': { S: 'config' }
        },
        KeyConditionExpression: 'pk =:pk AND sk =:sk'
      };
      console.log("QUERY:", configObj);
      const configData = await runQuery(configObj);
      console.log("configData:", configData);
      console.log("Returning:", { data: parkData, config: configData });
      return sendResponse(200, { data: parkData, config: configData }, context);
    } else {
      return sendResponse(400, { msg: 'Invalid Request' }, context);
    }
  } catch (err) {
    console.log("E:", err);
    return sendResponse(400, err, context);
  }
};