// The tasks themselves can be made up of different tools. For example, the getInvoices task can be made up of the following tools:

// task = Task(description='Generate monthly sales report', agent=sales_agent, tools=[reporting_tool])

const getInvoices = async (chatId, currentUser, prompt) => {
  return { success: true, text: "getInvoicesHandler" };
};

export default getInvoices;
