const { App } = require("@slack/bolt");
const { createRecord } = require("./airtable");
const { extractValues } = require("./extractValues");

const dotenv = require("dotenv");
dotenv.config();
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_BOT_TOKEN;
const port = 5000;

const app = new App({
  signingSecret: slackSigningSecret,
  token: slackToken,
});

app.command("/start", async ({ ack, body, client, logger }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,

      view: {
        type: "modal",
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Modal title",
        },
        blocks: [
          {
            block_id: "type_of_expense",
            type: "input",
            element: {
              type: "static_select",
              placeholder: {
                type: "plain_text",
                text: "Select an option",
                emoji: true,
              },
              options: [
                {
                  text: {
                    type: "plain_text",
                    text: "Business Entertainment",
                    emoji: true,
                  },
                  value: "value-0",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "IT softwares",
                    emoji: true,
                  },
                  value: "value-1",
                },
                {
                  text: {
                    type: "plain_text",
                    text: "General Expense",
                    emoji: true,
                  },
                  value: "value-2",
                },
              ],
              action_id: "static_select-action",
            },
            label: {
              type: "plain_text",
              text: "Select the Type of Expense",
              emoji: true,
            },
          },
          {
            block_id: "date",
            type: "input",
            element: {
              type: "datepicker",
              initial_date: "1990-04-28",
              placeholder: {
                type: "plain_text",
                text: "Select a date",
                emoji: true,
              },
              action_id: "datepicker-action",
            },
            label: {
              type: "plain_text",
              text: "Select the Date",
              emoji: true,
            },
          },
          {
            block_id: "Name",
            type: "input",
            element: {
              type: "plain_text_input",
              action_id: "plain_text_input-action",
            },
            label: {
              type: "plain_text",
              text: "Name of the Product",
              emoji: true,
            },
          },
          {
            block_id: "Price",
            type: "input",
            element: {
              type: "plain_text_input",
              action_id: "plain_text_input-action",
            },
            label: {
              type: "plain_text",
              text: "Price of the Product",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Click to enter upload receipt",
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click Me",
                emoji: true,
              },
              value: "click_me_123",
              url: "http://localhost:3000/",
              action_id: "button-action",
            },
          },
          {
            block_id: "Url",
            type: "input",
            element: {
              type: "plain_text_input",
              action_id: "plain_text_input-action",
            },
            label: {
              type: "plain_text",
              text: "Enter the public url",
              emoji: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
});

app.view("view_1", async ({ ack, body, view, client, logger }) => {
  await ack();
  console.log("view state values", view.state.values);
  let dataobj = extractValues(view.state.values);
  console.log(dataobj);
  const res = await createRecord("Table 1", dataobj);
  // console.log("res", res);
});

(async () => {
  await app.start(port);
  console.log("Bolt app is running");
})();
