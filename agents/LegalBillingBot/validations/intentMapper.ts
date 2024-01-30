import { Task1 } from "../tasks/task1";

class IntentMapper {
  // Method to map intents to task handlers
  mapIntentToTask(intent: string): any {
    const taskMap: { [key: string]: any } = {
      task1: Task1(),
      // Map other intents to their respective tasks
    };
    return taskMap[intent];
  }
}

// Export the IntentMapper class
export { IntentMapper };
