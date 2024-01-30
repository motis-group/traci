import supabase from "../bot/integrations/supabase";
import bodyFormatter from "../bot/formatters/bodyFormatter";

export default defineEventHandler(async (event) => {

  const body = bodyFormatter(await readBody(event));

  if (body.is_outbound) {
    return;
  }

  if (body.messaging_product === "supabase" || body.messaging_product === "stripe") {
    return;
  }

  const { from_number } = body;

  const {
    data: [user],
    error: userError,
  } = await supabase
    .from("users")
    .select("*, conversations(count)")
    .eq("phone", from_number)
    .limit(1);

  if (userError) {
    throw createError({
      status: 500,
      message: `Error finding user: ${userError.message}`,
    });
  }

  if (user) {
    const {
      conversations: [{ count: conversations }],
    } = user;

    event.context.user = {
      ...user,
      conversations: Math.ceil(conversations / 2),
    };
  } else {
    const {
      data: [userCreate],
      error: userCreateError,
    } = await supabase.from("users").insert({ phone: from_number }).select();

    if (userCreateError) {
      throw createError({
        status: 500,
        message: `User create error: ${userCreateError.message}`,
      });
    }

    event.context.user = {
      ...userCreate,
      conversations: 0,
    };
  }
});
