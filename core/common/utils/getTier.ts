import { user_tiers } from "../../../constants";

export function getTier(currentUser) {
  let tier, nextTier, currentTierIndex;

  console.log("CURRENT USER:", currentUser);

  for (let i = user_tiers.length - 1; i >= 0; i--) {
    if (user_tiers[i].message_count <= currentUser.conversations) {
      tier = user_tiers[i];
      currentTierIndex = i;
      break;
    }
  }

  nextTier =
    currentTierIndex + 1 < user_tiers.length
      ? user_tiers[currentTierIndex + 1]
      : null;

  let messagesToUnlock = nextTier
    ? nextTier.message_count - currentUser.conversations
    : 0;
  console.log(
    "TIER:",
    tier,
    "NEXT TIER:",
    nextTier,
    "MESSAGES TO UNLOCK:",
    messagesToUnlock
  );
  return { tier, messagesToUnlock, nextTier };
}
