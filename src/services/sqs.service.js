const { SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqsClient = require("../config/sqs");

const sendMessageToQueue = async (message) => {
  try {
    const command = new SendMessageCommand({
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(message),
    });

    const response = await sqsClient.send(command);

    console.log("✅ Message sent to SQS");
    console.log(response);

    return response;
  } catch (error) {
    console.error("❌ Error sending message to SQS:", error);
    throw error;
  }
};

module.exports = {
  sendMessageToQueue,
};