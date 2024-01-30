import { textFormatter, audioFormatter } from "../bot/formatters";
import { handleSuccessfulPaymentEvent } from "../bot/events";
import { commandsImplicitHandler } from "../bot/commands";
import supabase from "../bot/integrations/supabase";
import createError from "http-errors";

export default defineEventHandler(async (event) => {
  try {
    console.log("Processing queue...");
    const batchSize = 1000; // Define the size of each batch
    let offset = 0;

    while (true) {
      // Fetch conversations that have draft as true in batches
      const { data: messageData, error: messageError } = await supabase
        .from("conversations")
        .select("*,users(*,conversations(count))")
        .eq("draft", true)
        .order("ts", { ascending: false })
        .range(offset, offset + batchSize - 1);

      if (messageError) {
        throw createError({
          status: 500,
          message: "Error finding messages: " + messageError.message,
        });
      }

      if (messageData.length === 0) {
        break; // No more messages to process
      }

      const messages = messageData.filter((o) => o.ts + o.delay <= Date.now());

      // Process messages in parallel
      await Promise.all(
        messages.map((message) => {
          let currentUser = message.users;
          currentUser.conversations = Math.ceil(
            currentUser.conversations[0].count / 2
          );
          currentUser.rating = message.rating;
          return processMessage(message.id, message.text, currentUser);
        })
      );

      offset += batchSize;
    }
  } catch (error) {
    // Log the error and return a failure response
    console.error(error);
    return { success: false, error: error.message };
  }
});

async function processMessage(messageId, text, currentUser) {
  try {
    const successfulPayment = null;
    const voice = null;
    const chatId = currentUser.phone;

    // Logic to handle queued messages can be implemented here

    if (text) {
      const { text: cleanedText } = await textFormatter(
        chatId,
        currentUser,
        text
      );
      await commandsImplicitHandler(
        chatId,
        messageId,
        currentUser,
        cleanedText
      );
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
