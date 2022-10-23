const { Stack, Duration } = require('aws-cdk-lib');
const todo_service = require('../lib/todo_service')
// const sqs = require('aws-cdk-lib/aws-sqs');

class CrudApiStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    new todo_service.TodoService(this, 'Todo')
  }
}

module.exports = { CrudApiStack }
