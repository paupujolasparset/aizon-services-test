const uuid = require('uuid');
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

// Generate unique sort key (<username>_<uuid>)
const generateSK = (parentId) => {
	return parentId ? `${parentId}_${uuid.v1()}` : `_${uuid.v1()}`;
};

const tableName = process.env.SERVICES_TABLE;

exports.add = async({ username, serviceType, parentId, body}) => {
	// Add into the table
	const sk = generateSK(parentId);
	const item = {
    PK: username,
    SK: sk,
    serviceType,
    info: body,
  };
	const params = {
		TableName: tableName,
		Item: item,
	};

	// Try to insert the service to the table
	try {
		await docClient.put(params).promise();
		return {
			body: sk,
			statusCode : 201
		}
	} catch (err) {
		return {
      body: `Could not add ${serviceType}: ${err}`,
      statusCode: 409,
    };
	}
};

exports.delete = async ({ username, serviceType, id }) => {
  // Build the query to find all the services to delete
  const params = {
    TableName: tableName,
    ProjectionExpression: 'PK, SK',
    KeyConditionExpression: 'PK = :pk AND begins_with ( SK , :sk )',
    ExpressionAttributeValues: {
      ':pk': username,
      ':sk': id,
    },
  };

  // Try to get the service from the table
  try {
    const itemsToDelete = await docClient.query(params).promise();
    if (itemsToDelete.Items.length === 0) {
      return {
        body: `Could not find ${serviceType} with id: ${id}`,
        statusCode: 409,
      };
    } else {
      for (const item of itemsToDelete.Items) {
        await docClient
          .delete({
            TableName: tableName,
            Key: {
              PK: item.PK,
              SK: item.SK,
            },
          }).promise()
      };
      return {
        body: `${serviceType} deleted!`,
        statusCode: 200,
      };
    }
  } catch (err) {
    return {
      body: `Could not delete ${serviceType}: ${err}`,
      statusCode: 409,
    };
  }
};

exports.get = async ({ username, serviceType, id }) => {
  // Build the query
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk AND SK = :sk',
    FilterExpression: `serviceType = :serviceType`,
    ExpressionAttributeValues: {
      ':pk': username,
      ':sk': id,
      ':serviceType': serviceType,
    },
  };

  // Try to get the service from the table
  try {
    const data = await docClient.query(params).promise();
    return {
      body: JSON.stringify(data),
      statusCode: 200,
    };
  } catch (err) {
    return {
      body: `Could not get ${serviceType}: ${err}`,
      statusCode: 409,
    };
  }
};

exports.list = async ({ username, serviceType, parentId }) => {
  // Build the query
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk AND begins_with ( SK , :sk )',
    FilterExpression: `serviceType = :serviceType`,
    ExpressionAttributeValues: {
      ':pk': username,
      ':sk': parentId ? parentId : '_',
      ':serviceType': serviceType,
    },
  };

  // Try to get the list from the table
  try {
    const data = await docClient.query(params).promise();
    return {
      body: JSON.stringify(data),
      statusCode: 200,
    };
  } catch (err) {
    return {
      body: `Could not get ${serviceType}: ${err}`,
      statusCode: 409,
    };
  }
};

exports.update = async ({ username, serviceType, id, body }) => {
  // Build the query to update the service
  const params = {
    TableName: tableName,
    Key: {
      PK: username,
      SK: id,
    },
    ConditionExpression: `serviceType = :serviceType`,
    FilterExpression: `serviceType = :serviceType`,
    ExpressionAttributeValues: {
      ':serviceType': serviceType,
      ':info': body,
    },
    UpdateExpression: 'set info = :info',
    ReturnValues: 'UPDATED_NEW',
  };

  // Try to get the service from the table
  try {
    await docClient.update(params).promise();
    return {
      body: `${serviceType} updated!`,
      statusCode: 200,
    };
  } catch (err) {
    return {
      body: `Could not update ${serviceType}: ${err}`,
      statusCode: 409,
    };
  }
};