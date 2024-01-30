
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // const requestBody = await readBody(event);
    // console.log(requestBody)

    // const { user: currentUser } = event.context;
    // let responseData = {};

    // const {
    //   message = null,
    //   callback_query: callbackQuery = null,
    //   pre_checkout_query: preCheckoutQuery = null,
    // } = requestBody;

    // // Validate the incoming data
    // if (!currentUser || !currentUser.id) {
    //   throw new Error("Invalid user data");
    // }

    // if (message) {
    //   if (message?.text?.charAt(0) === "/") {
    //     await processMessage(message.text, message, currentUser);
    //     return { success: true, data: responseData };
    //   }

    //   const lastMessageTime =
    //     Number(lastMessageTimeCache.get(currentUser.id)) || 0;

    //   let userMessages =
    //     (messageCache.get(currentUser.id) as Array<typeof message>) || [];

    //   if (Date.now() - lastMessageTime <= TIMEOUT) {
    //     userMessages.push(message);
    //   } else {
    //     userMessages = [message];
    //   }

    //   messageCache.set(currentUser.id, userMessages);

    //   clearTimeout(processTimeout);
    //   processTimeout = setTimeout(async () => {
    //     const batchedText = userMessages
    //       .map((message) => message.text)
    //       .join(" ");
    //     await processMessage(batchedText, userMessages[0], currentUser);
    //     messageCache.del(currentUser.id);
    //     lastMessageTimeCache.set(currentUser.id, 0);
    //   }, TIMEOUT);
    //   lastMessageTimeCache.set(currentUser.id, Date.now());
    // } else if (callbackQuery) {
    //   await handleCallbackQueryEvent(currentUser, callbackQuery);
    // } else if (preCheckoutQuery) {
    //   await handlePreCheckoutQueryEvent(preCheckoutQuery, true);
    // }
    return { success: true, data: {} };
  } catch (error) {
    // Log the error and return a failure response
    console.error(error);
    return { success: false, error: error.message };
  }
});
