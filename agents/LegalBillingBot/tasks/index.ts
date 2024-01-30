// Here we import all our tasks handlers and use them to handle the user's request.

import getInvoiceHandler from "./getInvoices";
import reviewLegalDocHandler from "./reviewLegalDoc";

// Then we import the intents that we want to handle.

import { main_intents, background_intents } from "../intent";

// Then we import the intent classifier to get the intent of the user's request.

import IntentAnalysis from "../../../intents/intentDefinitions";

export async function tasksHandler(
  chatId,
  messageId,
  currentUser,
  cleanedText,
  files = null
) {
  let commandId;

  const { main_intent, background_intent } = await IntentAnalysis.getIntent(
    currentUser,
    main_intents,
    background_intents,
    cleanedText
  );

  // Match up the intent with the appropriate handler below
  const mainTaskHandlers = {
    get_invoices: getInvoiceHandler,
    review_legal_doc: reviewLegalDocHandler,
  };

  const mainHandler = mainTaskHandlers[main_intent];
  if (mainHandler) {
    mainHandler(chatId, messageId, currentUser, cleanedText, files);
  } else {
    console.error(`Undefined intent: ${main_intent}`);
    return { text: `Undefined intent: ${main_intent}` };
  }

  // Handle background intents if any
  // if (background_intent && background_intent.length > 0) {
  //   for (let i = 0; i < background_intent.length; i++) {
  //     const backgroundHandler = backgroundCommandHandlers[background_intent[i]];
  //     if (backgroundHandler) {
  //       backgroundHandler(chatId, messageId, currentUser, cleanedText);
  //     }
  //   }
  // }
}
