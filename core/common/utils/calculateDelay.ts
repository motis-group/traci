import supabase from "../../../bot/integrations/supabase";

export async function calculateDelay(currentUser) {
  let delay = 0;

  // First we need to get user tokens
  if (currentUser.tokens <= 0) {
    delay = 28800000;
    console.log("Delayed because user has no tokens");
    return delay;
  }

  // Then we need to check if the bot is asleep based on the user's timezone
  const {
    data: [botProfile],
  } = await supabase
    .from("bots")
    .select("mood,delays,schedule")
    .eq("id", 1)
    .limit(1);

  // Get current time has to be in Italy's timezone
  const currentTime = new Date();
  const italianTime = new Date(
    currentTime.toLocaleString("en-US", { timeZone: "Australia/Melbourne" })
  );
  const currentHour = italianTime.getHours();

  // Check if the bot is sleeping
  const sleepActivity = botProfile.schedule.night.sleep;
  const sleepStart = parseInt(sleepActivity.start_time.split(":")[0]);
  const sleepEnd = parseInt(sleepActivity.end_time.split(":")[0]);

  if (currentHour >= sleepStart || currentHour < sleepEnd) {
    // Bot is sleeping, calculate delay until end of sleep
    const hoursUntilWake = (sleepEnd - currentHour + 24) % 24;
    delay = hoursUntilWake * 60 * 60 * 1000; // Convert hours to milliseconds
    console.log("Delayed because bot is sleeping");
    return delay;
  }

  // If the bot is not sleeping, continue to next steps...

  // If the user has tokens we need to first calculate the userTokenMultiplier
  const maxTokens = 50000; // Assuming 50000 is the maximum number of tokens a user can have
  // Calculate the delay multiplier based on the user's tokens
  const userDelayMultiplier =
    currentUser.tokens >= maxTokens ? 1 : 2 - currentUser.tokens / maxTokens; // Need to also handle the case where tokens are equal to or greater than 50000

  // Then the next is to look at the mood multipler from the bot profile
  const {
    mood: { multiplier: botMultiplier },
    delays: botDelays,
  } = botProfile;

  // Then we need to grab a random delay time from the bot profile and then combine it with both the user and bot multipliers
  const botDelay =
    botDelays[Math.floor(Math.random() * botDelays.length)] * 1000; // Convert seconds to milliseconds

  delay = Math.round((botDelay * userDelayMultiplier) / botMultiplier);

  console.log("Delay calculated:", delay);

  return delay;
}
