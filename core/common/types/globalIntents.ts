// globalIntents.ts

/**
 * Base type for all intents.
 * Extend this for specific intent types in individual agents.
 */
type BaseIntent = {
  id: string;
  name: string;
  description: string;
  parameters: {
    // Parameters required to execute the intent
    [key: string]: any; // Key-value pairs, where the key is the parameter name
  };
};

// Define other global intent structures or types that are common across agents.

export { BaseIntent };
