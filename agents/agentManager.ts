// Manages agent lifecycle and interactions

// It also handles delegating tasks to other agents and monitoring their status.

// An AgentManager is typically responsible for managing the lifecycle and operations of a single type of agent within the system. It abstracts the complexities involved in agent instantiation, task assignment, status monitoring, and other operational details.
// The AgentManager ensures that each agent performs its designated tasks effectively and provides a layer of interaction between the agents and the broader system, like the CrewManager.

// Filename: src/core/agents/AgentManager.ts

import { IAgent } from "./interfaces/IAgent";
import { ITask } from "./interfaces/ITask";
import { AgentFactory, AgentType } from "../factories/AgentFactory";

class AgentManager {
  private agents: IAgent[] = [];

  constructor(private agentType: AgentType) {
    // Initialize with a set of agents if necessary
  }

  // Method to create and add a new agent to the manager
  createAgent(...args: any[]): IAgent {
    const newAgent = AgentFactory.createAgent(this.agentType, ...args);
    this.agents.push(newAgent);
    return newAgent;
  }

  // Method to remove an agent from the manager
  removeAgent(agentId: string): void {
    this.agents = this.agents.filter((agent) => agent.id !== agentId);
  }

  // Method to assign a task to a specific agent
  assignTask(agentId: string, task: ITask): void {
    const agent = this.agents.find((agent) => agent.id === agentId);
    if (agent) {
      agent.executeTask(task.id);
    } else {
      console.error(`Agent with ID ${agentId} not found`);
    }
  }

  // Method to get an agent by ID
  getAgentById(agentId: string): IAgent | undefined {
    return this.agents.find((agent) => agent.id === agentId);
  }

  // Method to report the status of all agents managed by this AgentManager
  reportAgentsStatus(): void {
    this.agents.forEach((agent) => {
      const status = agent.reportStatus();
      console.log(
        `Agent ID: ${status.id}, Status: ${status.status}, Last Active: ${status.lastActive}`
      );
    });
  }

  // ... add other methods as needed, such as for handling inter-agent communication, etc.
}

export default AgentManager;
