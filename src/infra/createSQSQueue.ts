import { SQS } from "aws-sdk";
let sqsClient = new SQS();
sqsClient
    .createQueue({ QueueName: process.argv.slice(2)[0] })
    .promise()
    .then(console.log)
    .catch((e: Error) => {
        if (e.name == "MissingRequiredParameter")
            console.error("ERR: Must pass in queue name as first argument!");
        else console.error(e);
    });
