const uuid = require('uuid');
const AWS = require('aws-sdk');
const config = require('../../../aws-config.json');

const docClient = new AWS.DynamoDB.DocumentClient();

// Generate unique sort key (<username>_<uuid>)
const generateSK = (parentId) => {
	return parentId ? `${parentId}_${uuid.v1()}` : `_${uuid.v1()}`;
};

let tableName = process.env.SERVICES_TABLE || config.DynamoDb.TABLE_NAME;


exports.add = async({ username, type, parentId, body}) => {
	// Add into the table
	let sk = generateSK(parentId);
	let item = {
		PK: type,
		SK: sk,
		username,
		info: body,
	};
	let params = {
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
			body: `Could not add ${type}: ${err}`,
			statusCode : 409
		}
	}
};

exports.delete = async({ username, type, id}) => {
  // Build the query to find all the services to delete
  let params = {
    TableName: tableName,
    ProjectionExpression: 'PK, SK',
    KeyConditionExpression: 'PK = :pk AND SK = :sk',
    FilterExpression: `username = :username`,
    ExpressionAttributeValues: {
      ':pk': type,
      ':sk': id,
      ':username': username,
    },
  };

  // Try to get the service from the table
  try {
    let itemsToDelete = await docClient.query(params).promise();
    if (itemsToDelete.Items.length === 0) {
			return {
				body: `Could not find ${type} with id: ${id}`,
				statusCode : 409
			}
    } else {
      itemsToDelete.Items.forEach(async (item) => {
        await docClient
          .delete({
            TableName: tableName,
            Key: {
              PK: item.PK,
              SK: item.SK,
            },
          })
          .promise();
			});
			return {
				body: `${type} deleted!`,
				statusCode : 200
			}
    }
  } catch (err) {
		return {
			body: `Could not delete ${type}: ${err}`,
			statusCode : 409
		}
  }
};

exports.get = async({username, type, id}) =>{
  // Build the query
  let params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk AND SK = :sk',
    FilterExpression: `username = :username`,
    ExpressionAttributeValues: {
      ':pk': type,
      ':sk': id,
      ':username': username,
    },
  };

  // Try to get the service from the table
  try {
    let data = await docClient.query(params).promise();
		return {
      body: JSON.stringify(data),
      statusCode: 200,
    };
  } catch (err) {
		return {
      body: `Could not get ${type}: ${err}`,
      statusCode: 409,
    };
  }
}

exports.list = async ({ username, type, parentId }) => {
  // Build the query
  let params = {
    TableName: tableName,
    KeyConditionExpression: 'PK = :pk AND begins_with ( SK , :sk )',
    FilterExpression: `username = :username`,
    ExpressionAttributeValues: {
      ':pk': type,
      ':sk': parentId ? parentId : '_',
      ':username': username,
    },
  };

  // Try to get the list from the table
  try {
    let data = await docClient.query(params).promise();
		return {
      body: JSON.stringify(data),
      statusCode: 200,
    };
  } catch (err) {
		return {
      body: `Could not get ${type}: ${err}`,
      statusCode: 409,
    };
  }
};

exports.update = async ({ username, type, id, body }) => {
  // Build the query to update the service
  let params = {
    TableName: tableName,
    Key: {
      PK: type,
      SK: id,
    },
    ConditionExpression: `username = :username`,
    FilterExpression: `username = :username`,
    ExpressionAttributeValues: {
      ':username': username,
      ':info': body,
    },
    UpdateExpression: 'set info = :info',
    ReturnValues: 'UPDATED_NEW',
  };

  // Try to get the service from the table
  try {
		await docClient.update(params).promise();
		return {
      body: `${type} updated!`,
      statusCode: 200,
    };
  } catch (err) {
		return {
      body: `Could not update ${type}: ${err}`,
      statusCode: 409,
    };
  }
};