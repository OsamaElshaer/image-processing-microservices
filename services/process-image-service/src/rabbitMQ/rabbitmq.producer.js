const { getChannel, assertQueue } = require("../loaders/rabbitmq.js");
const { logger } = require("../utils/logger.js");

async function sendImageMessage(image) {
    try {
        const channel = getChannel();
        const queue = "processed-image";

        await assertQueue(queue, { durable: true });
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(image)), {
            persistent: true,
        });

        logger.info(
            `processed image message sent to RabbitMQ in queue ${queue}`,
            image
        );
    } catch (error) {
        logger.error(
            "Error sending processes image message to RabbitMQ:",
            error
        );
    }
}

module.exports = sendImageMessage;
