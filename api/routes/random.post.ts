import { textFormatter, audioFormatter } from "../bot/formatters";
import {
  handleCallbackQueryEvent,
  handlePreCheckoutQueryEvent,
  handleSuccessfulPaymentEvent,
} from "../bot/events";

import { commandsImplicitHandler } from "../bot/commands";

import supabase from "../bot/integrations/supabase";

export default defineEventHandler(async (event) => {
  try {
    const pageSize = 1000; // Define the number of records to fetch per page
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const {
        data: userData,
        error: messageError,
        count,
      } = await supabase
        .from("users")
        .select("id,conversations(type,ts,count)")
        .eq("conversations.type", "bot_message")
        .lte("conversations.ts", Date.now() - 2 * 3600 * 1000)
        .range(page * pageSize, (page + 1) * pageSize - 1); // Use the range parameter for pagination

      if (messageError) {
        throw createError({
          status: 500,
          message: "Error finding users: " + messageError.message,
        });
      }

      await Promise.all(
        userData.map((user) => {
          let currentUser = user;
          currentUser.conversations = Math.ceil(
            currentUser.conversations[0].count / 2
          );
          return processMessage(user.conversations[0].id, "Hey, ask me a question to spur my interest", currentUser);
        })
      );

      hasMore = count > (page + 1) * pageSize;
      page++;
    }
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
});

async function processMessage(messageId, text, currentUser) {
  try {
    const successfulPayment = null;
    const voice = null;
    const chatId = currentUser.whatsapp_id;

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
    } else {
      await handleSuccessfulPaymentEvent(
        chatId,
        currentUser,
        successfulPayment
      );
    }
  } catch (error) {
    console.error(error);
  }
}
