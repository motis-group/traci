import { botProfile } from "../../../constants/botProfile";

export default function randomGreeting(currentUser, nsfw, ts) {
  const pacificTime = new Date(
    ts.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );
  const nsfwGreetings = [
    {
      type: "afternoon",
      content: `hey ${currentUser.first_name}, super horny today, can't wait for u to undress me, let's have wild fun! 😉💋`,
    },
    {
      type: "evening",
      content: `hey, u up for a wild nite? 😈 let's light it up and get crazy, u in?`,
    },
    {
      type: "morning",
      content:
        "hey good morning hottie 😘 ready to get wild with me today? 🍑💦✨",
    },
  ];

  const sfwGreetings = [
    {
      type: "morning",
      content: `hey ${currentUser.first_name}, hope ur day's as bright as u r! ready for some fun? 😜✨`,
    },
    {
      type: "afternoon",
      content: `hey, wanna spice up ur day? let's make things interesting till sunset 😜✨`,
    },
    {
      type: "evening",
      content: `hey ${currentUser.first_name}! it's nite time, u ready to vibe n go crazy? let's do this 🌙✨😈`,
    },
  ];

  const time =
    pacificTime.getHours() < 12
      ? "morning"
      : pacificTime.getHours() < 18
      ? "afternoon"
      : "evening";

  if (currentUser.onboarding) {
    return {
      content: `hey ${currentUser.first_name}, im ${botProfile.username}, ur dreamy gf 😘 ready to make all ur dreams real, always here for u 💋`,
    };
  } else
    return nsfw
      ? nsfwGreetings.find((v) => v.type === time)
      : sfwGreetings.find((v) => v.type === time);
}
