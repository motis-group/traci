import supabase from "../bot/integrations/supabase";

import { textFormatter, audioFormatter } from "../bot/formatters";
import {
  handleCallbackQueryEvent,
  handlePreCheckoutQueryEvent,
  handleSuccessfulPaymentEvent,
} from "../bot/events";

import { commandsImplicitHandler } from "../bot/commands";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    switch (body.type) {
      case "checkout.session.completed":
        // Format phone number
        const { phone } = body.data.object.customer_details;
        // Remove + from phone number
        const formattedPhone = phone.replace("+", "");
        // Get amount
        const amount = body.data.object.amount_total;
        const {
          data: [userData],
        } = await supabase
          .from("users")
          .select("*,conversations(count)")
          .eq("phone", formattedPhone)
          .limit(1);

        let currentUser = userData;
        currentUser.conversations = Math.ceil(
          currentUser.conversations[0].count / 2
        );
        currentUser.rating = 1;
        // Need to add amount to existing amount of tokens
        const { error: userError } = await supabase
          .from("users")
          .update({ tokens: userData.tokens + amount })
          .eq("phone", formattedPhone);
        if (userError) {
          throw createError({
            status: 500,
            message: "Error updating tokens: " + userError.message,
          });
        }
        processMessage(
          `Ok, just sent you $${amount / 100} baby`,
          null,
          currentUser
        );
        break;
      default:
        break;
    }
    return { success: true, data: body };
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
