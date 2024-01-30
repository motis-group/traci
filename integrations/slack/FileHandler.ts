// FileHandler.ts

import WebClient from "./SlackClient";

type SlackFileAttachment = {
  title: string;
  fileUrl: string;
};

class FileHandler {
  private slackClient: WebClient;

  constructor(token: string) {
    this.slackClient = new WebClient(token);
  }

  /**
   * Uploads a file to Slack and returns a reference to the file.
   * @param filePath The local path to the file.
   * @param channels The channels where the file will be shared.
   * @returns A promise that resolves to a SlackFileAttachment.
   */
  async uploadFile(
    filePath: string,
    channels: string[]
  ): Promise<SlackFileAttachment> {
    try {
      const response = await this.slackClient.files.upload({
        channels: channels.join(","),
        file: fs.createReadStream(filePath),
      });

      if (response.ok) {
        return {
          title: response.file?.title || "Uploaded File",
          fileUrl: response.file?.url_private || "",
        };
      } else {
        throw new Error(`Failed to upload file: ${response.error}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Formats a Slack message attachment to include a file.
   * @param fileAttachment The SlackFileAttachment returned by the uploadFile method.
   * @returns A Slack message attachment object.
   */
  static formatFileAttachment(fileAttachment: SlackFileAttachment) {
    return {
      title: fileAttachment.title,
      title_link: fileAttachment.fileUrl,
      text: "File uploaded to Slack",
      // Add more properties as needed for the attachment (e.g., color, pretext)
    };
  }

  // Add more methods as needed for other file operations.
}

export default FileHandler;
