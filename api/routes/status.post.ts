
export default defineEventHandler(async (event) => {
  try {
    return { success: true, data: [] };
  } catch (error) {
    // Log the error and return a failure response
    console.error(error);
    return { success: false, error: error.message };
  }
});
