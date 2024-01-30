import { getRating } from "../utils/getRating";
import { getProductKeywords } from "../bot/ai/getProductKeywords";
import supabase from "../bot/integrations/supabase";
import bodyFormatter from "../bot/formatters/bodyFormatter";
import { calculateDelay } from "../utils/calculateDelay";

export default defineEventHandler(async (event) => {
  try {
    const body = bodyFormatter(await readBody(event));
    const { user } = event.context;
    const { message_text, messaging_product, is_outbound } = body;

    if (body.is_outbound) return;

    if (
      body.messaging_product === "supabase" ||
      body.messaging_product === "stripe"
    ) {
      return;
    }

    const {
      data: [messageData],
      error: messageError,
    } = await supabase
      .from("conversations")
      .select("id, type, text, delay, ts, draft")
      .eq("user", user.id)
      .eq("type", "message")
      .order("ts", { ascending: false })
      .limit(1);

    if (messageError) throw messageError;

    let delay = 0;

    if (messageData && messageData.draft) {
      const { error } = await supabase
        .from("conversations")
        .update({ text: `${messageData.text}\n\n${message_text}` })
        .eq("id", messageData.id);
      delay = messageData.delay;
      if (error) throw error;
      console.log(`Latest message added to existing draft`);
    } else {
      const { rating } = await getRating(message_text);
      const { keywords, sponsors } = await getProductKeywords(
        user,
        message_text
      );

      user.rating = rating;
      user.keywords = keywords;
      user.sponsors = sponsors;
      user.conversations += 1;

      delay = await calculateDelay(user);

      const {
        data: [messageData],
        error,
      } = await supabase
        .from("conversations")
        .insert({
          text: message_text,
          type: "message",
          ts: Date.now(),
          keywords,
          sponsors,
          user: user.id,
          draft: true,
          delay,
          rating,
        })
        .select();

      if (error) throw error;
      event.context.message = messageData;
      delay >= 10000
        ? console.log(
            `Message is queued since delay of ${
              delay / 1000 / 60
            } min is greater than 1 minute`
          )
        : console.log(
            `Message is being sent immediately with delay of ${
              delay / 1000
            } seconds`
          );
    }
    if (delay >= 10000) {
      return { success: true, data: [] };
    }
  } catch (error) {
    console.error(`Error in event handler: ${error}`);
  }
});
