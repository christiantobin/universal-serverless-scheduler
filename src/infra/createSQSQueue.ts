import { SQS } from "aws-sdk";
let sqsClient = new SQS();
try {
    sqsClient
        .createQueue({ QueueName: process.argv.slice(2)[0] })
        .promise()
        .then(console.log);
} catch (e) {
    console.error("ERR: Must pass in queue name as first argument!", e);
}
