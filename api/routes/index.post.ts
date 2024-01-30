import { textFormatter, audioFormatter } from "../bot/formatters";
import {
  handleCallbackQueryEvent,
  handlePreCheckoutQueryEvent,
  handleSuccessfulPaymentEvent,
} from "../bot/events";

import { commandsImplicitHandler } from "../bot/commands";

export default defineEventHandler(async (event) => {
  try {
    const { user: currentUser, message } = event.context;
    console.log("Processing message immediately...");
    await new Promise((resolve) => setTimeout(resolve, message.delay));
    // await markAsRead(message.whatsapp_id);
    await new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    processMessage(message.text, message.id, currentUser);
    return { success: true, data: [] };
  } catch (error) {
    // Log the error and return a failure response
    console.error(error);
    return { success: false, error: error.message };
  }
});

async function processMessage(text, messageId, currentUser) {
  try {
    const successfulPayment = null;
    const voice = null;
    const chatId = currentUser.phone;

    // Need to add logic that if a user sends a message while another response is queued, then it will also queue the message and send it after the response is sent

    if (text) {
      const { text: cleanedText } = await textFormatter(
        chatId,
        currentUser,
        text
      );
      const handler = commandsImplicitHandler;
      await handler(chatId, messageId, currentUser, cleanedText);
    } else if (voice) {
      const { text: cleanedText } = await audioFormatter(
        chatId,
        currentUser,
        voice
      );
      await commandsImplicitHandler(
        chatId,
        messageId,
        currentUser,
        cleanedText
      );
    }
    // } else {
    //   await handleSuccessfulPaymentEvent(
    //     chatId,
    //     messageId,
    //     currentUser,
    //     successfulPayment
    //   );
  } catch (error) {
    console.error(error);
  }
}
