import { baseConvertUrl } from "../../../constants";

const headers = {
  "x-oc-api-key": "96cac9d7ca97963e9229cb2bad606e72",
};

export async function convert(url, options) {
  let output = null;
  let status = null;
  let error = null;
  const { id: jobId, status: jobStatus } = await $fetch(
    `${baseConvertUrl}/jobs`,
    {
      method: "post",
      headers,
      body: {
        input: [
          {
            type: "remote",
            source: url,
          },
        ],
        conversion: [
          {
            target: "ogg",
            options: {
              audio_codec: "opus",
            },
          },
        ],
      },
    }
  );

  status = jobStatus;

  while (status.code !== "completed") {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const { output: jobOutput, status: jobPollStatus } = await $fetch(
      `${baseConvertUrl}/jobs/${jobId}`,
      {
        method: "get",
        headers,
      }
    );
    if (jobPollStatus.code === "completed") {
      status = jobPollStatus;
      output = jobOutput[0].uri;
      break;
    }
    if (jobPollStatus.code === "failed") {
      output = null;
      error = jobPollStatus.info;
      break;
    }
  }

  return { output, error };
}
