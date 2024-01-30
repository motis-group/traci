// agentAIntents.ts
import { BaseIntent } from "../../../core/types/globalIntents";

/**
 * Intent for performing a vector search in a specific dataset.
 */
type VectorSearchIntent = BaseIntent & {
  type: "VectorSearch";
  searchParameters: {
    vectorField: string; // The field to perform vector search on
    queryVector: number[]; // The vector to search for
    topK: number; // Number of top results to retrieve
  };
};

type CRMSearchIntent = BaseIntent & {
  type: "CRMSearch";
  searchParameters: {
    entity: "Contact" | "Account" | "Opportunity";
    searchQuery: string; // Query string or structured query object
    fields: string[]; // Fields to include in the results
  };
};

/**
 * Intent for searching in an ERP (Enterprise Resource Planning) system.
 */
type ERPSearchIntent = BaseIntent & {
  type: "ERPSearch";
  searchParameters: {
    module: string; // The ERP module to search in (e.g., 'Finance', 'HR')
    searchQuery: string; // Query string or structured query object
    fields: string[]; // Fields to include in the results
  };
};

// Export the types for use within Agent A.
export { VectorSearchIntent, CRMSearchIntent, ERPSearchIntent };
