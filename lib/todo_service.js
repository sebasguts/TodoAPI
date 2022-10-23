const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");

class TodoService extends Construct {
  constructor(scope, id) {
    super(scope, id);

    const table = new dynamodb.Table(this, "todo-items", {
        partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING}
    });

    const handler = new lambda.Function(this, "TodoHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "todo.main",
      environment: {
        TABLE: table.tableName
      }
    });

    table.grantReadWriteData(handler); 

    const api = new apigateway.RestApi(this, "todo-api", {
      restApiName: "Todo Service",
      description: "Stores and returns todo items",
      deployOptions: {
        stageName: 'v1'
      }
    });

    const getTodoIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    const todos = api.root.addResource('todo');

    todos.addMethod("GET", getTodoIntegration);
    todos.addMethod("PUT", getTodoIntegration);
    todos.addMethod("DELETE", getTodoIntegration);

    const todo = todos.addResource('{id}');

    todo.addMethod("GET", getTodoIntegration);
    todo.addMethod("PUT", getTodoIntegration);
    todo.addMethod("DELETE", getTodoIntegration);


  }
}

module.exports = { TodoService }