// src/integrations/slack/MessageFormatter.ts

type SlackMessage = {
  text: string;
  blocks?: Array<any>; // Slack Block Kit components
  attachments?: Array<any>; // Slack attachments
};

class MessageFormatter {
  /**
   * Formats a simple text message for Slack.
   * @param text The text of the message
   * @returns SlackMessage
   */
  static formatTextMessage(text: string): SlackMessage {
    return {
      text: text,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: text,
          },
        },
      ],
    };
  }

  /**
   * Formats a message with file attachments for Slack.
   * @param text The text of the message
   * @param files Array of URLs pointing to the files to be attached
   * @returns SlackMessage
   */
  static formatMessageWithFiles(text: string, files: string[]): SlackMessage {
    const attachments = files.map((file) => {
      return {
        title: "Attached File",
        title_link: file, // Assuming 'file' is a direct URL to the file
      };
    });

    return {
      text: text,
      attachments: attachments,
    };
  }
}

export default MessageFormatter;
