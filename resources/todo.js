const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE

exports.main = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json"
    };

    const key = `${event.httpMethod} ${event.resource}`

    switch (key) {
    case "DELETE /todo/{id}":
        try {
            await dynamo
                .delete({
                    TableName: tableName,
                    Key: {
                        id: event.pathParameters.id
                    }
                })
                .promise();
            body = {'message': 'To-Do object deleted successfully.'};
        }
        catch {
            statusCode = 400;
            body = {'error': 'There has been an error while deleting the To-Do object'};
        }
        break;
    case "GET /todo/{id}":
        try {
            body = await dynamo
                .get({
                    TableName: tableName,
                    Key: {
                        id: event.pathParameters.id
                    }
                })
                .promise();
        }
        catch {
            statusCode = 400;
            body = {'error': 'There was an error while fetching the To-Do object'};
        }
        break;
    case "PUT /todo/{id}":
        try {
            let requestJSON = JSON.parse(event.body);
            await dynamo
                .put({
                    TableName: tableName,
                    Key: {
                        id: event.pathParameters.id,
                        title: requestJSON.title,
                        description: requestJSON.description
                    }
                })
                .promise();
        }
        catch {
            statusCode = 400;
            body = {'error': 'There was an error while updating the To-Do object'};
        }
        break;
    case "GET /todo":
        try {
            body = await dynamo.scan({ TableName: tableName }).promise();
            body = {'items': body['Items']};
        }
        catch {
            statusCode = 400;
            body = {'error': 'There was an error loading the To-Do objects'}
        }
        break;
    case "PUT /todo":
        try {
            let requestJSON = JSON.parse(event.body);
            await dynamo
                .put({
                TableName: tableName,
                Item: {
                    id: requestJSON.id,
                    title: requestJSON.title,
                    description: requestJSON.description
                }
                })
                .promise();
            body ={'message': 'To-Do object updated successfully'};
        } catch {
            statusCode = 400;
            body = {'error': 'There was an error while updating the To-Do object.'}
        }
        break;
    default:
        throw new Error(`Unsupported route: "${key}"`);
    }

    body = JSON.stringify(body);

    return {
        statusCode,
        body,
        headers
    };
};