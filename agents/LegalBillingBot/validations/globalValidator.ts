import { Task1, Task1Input } from "../tasks/reviewLegalDoc";
// Import other tasks as needed
// import { Task2, Task2Input } from '../tasks/Task2';
// ...

// Define a type for validation results
interface ValidationResult {
  isValid: boolean;
  errors: string[]; // Array of error messages, empty if valid
}

class GlobalValidator {
  // Map or object holding input requirements for each task
  private taskInputSpecifications: { [key: string]: any } = {
    task1: Task1Input,
    // 'task2': Task2Input,
    // ...
  };

  // Method to validate inputs for a given task
  validate(taskIdentifier: string, inputs: any): ValidationResult {
    const inputSpec = this.taskInputSpecifications[taskIdentifier];
    if (!inputSpec) {
      throw new Error(
        `No input specifications defined for task: ${taskIdentifier}`
      );
    }

    // Initialize validation result
    const result: ValidationResult = {
      isValid: true,
      errors: [],
    };

    // Validate each required field in the input specification
    Object.keys(inputSpec).forEach((key) => {
      if (inputSpec[key].required && inputs[key] === undefined) {
        result.isValid = false;
        result.errors.push(`Missing required field: ${key}`);
      }
      // Add more validation logic as needed, e.g., type checking, range checking, etc.
    });

    return result;
  }
}

// Export the GlobalValidator class
export { GlobalValidator };