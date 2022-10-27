import { sendError } from "../util/sendError";
import { DynamoDB, SQS } from "aws-sdk";
const docClient = new DynamoDB.DocumentClient();
const sqs = new SQS();
export const handler = async (event, context, callback): Promise<any> => {
    try {
        var body = event;
        if (event.body) body = await JSON.parse(event.body);
        let now = Date.now();
        let projects: Array<string> = body.Projects!;
        projects.forEach(async (project) => {
            await docClient
                .query({
                    TableName: process.env.SCHEDULES_TABLE!.split("/")[1],
                    KeyConditionExpression:
                        "project = :pk AND ( sk BETWEEN :now AND :future )",
                    ExpressionAttributeValues: {
                        ":pk": project,
                        ":now": now.toString(),
                        ":future": (now + (15 + 1) * 60 * 1000).toString(), //15 minutes from now
                    },
                })
                .promise()
                .then((data) => {
                    if (data.Count! > 0) {
                        data.Items!.forEach(async (item) => {
                            let publishTimestamp = parseInt(
                                item.sk.split("#")[0]
                            );
                            if (isNaN(publishTimestamp)) {
                                throw new Error(
                                    "Timestamp could not be parsed"
                                );
                            }
                            //put items in sqs queue
                            console.log("Adding record to SQS: ", item);
                            sqs.sendMessage({
                                MessageBody: item.payload,
                                QueueUrl: item.QueueURL,
                                DelaySeconds: Math.max(
                                    0,
                                    Math.floor((publishTimestamp - now) / 1000)
                                ),
                            });
                            //delete record from table
                            docClient.delete({
                                Key: { project: item.project, sk: item.sk },
                                TableName:
                                    process.env.SCHEDULE_TABLE!.split("/")[1],
                            });
                        });
                    }
                });
        });
        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ Message: "Successful" }),
        });
    } catch (err) {
        sendError(err, callback);
    }
};
