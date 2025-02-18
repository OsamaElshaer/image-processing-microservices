const { getChannel } = require("../loaders/rabbitmq.js");
const { logger } = require("../utils/logger.js");
const { ImageProcessingService } = require("../services/sharp.js");

async function consumeImageMessages(queue) {
    try {
        const channel = getChannel();
        logger.info(`Waiting for messages in ${queue}`);
        await channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const image = JSON.parse(msg.content.toString());
                await ImageProcessingService.processImage(image);
                channel.ack(msg);
            }
        });
    } catch (error) {
        logger.error("Error consuming messages: ", error);
    }
}

module.exports = { consumeImageMessages };
