const { App, subtype } = require("@slack/bolt");
const dotenv = require("dotenv");
const { extractTypeOfExpense, extractDate } = require("./helper/extractValues");
const { makeObj } = require("./helper/makeObj");
dotenv.config();
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET;
const slackToken = process.env.SLACK_TOKEN;
const port = 3000;

const app = new App({
  token: slackToken,
  signingSecret: slackSigningSecret,
});

const data = [];
app.message("start", async ({ message, say }) => {
  //console.log("hi");
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: "Welcome to the expense tracker",
          emoji: true,
        },
      },
      {
        type: "divider",
      },
      {
        type: "input",
        element: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select an item",
            emoji: true,
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "*this is plain_text text*",
                emoji: true,
              },
              value: "value-0",
            },
            {
              text: {
                type: "plain_text",
                text: "*this is plain_text text*",
                emoji: true,
              },
              value: "value-1",
            },
            {
              text: {
                type: "plain_text",
                text: "*this is plain_text text*",
                emoji: true,
              },
              value: "value-2",
            },
          ],
          action_id: "type_of_expense",
        },
        label: {
          type: "plain_text",
          text: "Please select the type of expense",
          emoji: true,
        },
      },
    ],
  });
});

app.action("type_of_expense", async ({ ack, say, body, client, logger }) => {
  await ack();
  // console.log(body);
  //console.log("views state values", views.state.values);
  // console.log("body state values", body.state.values);
  data.push(extractTypeOfExpense(body.state.values));
  await say({
    blocks: [
      {
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
          text: "Select the date",
          emoji: true,
        },
      },
    ],
  });
});
app.action("datepicker-action", async ({ ack, say, body, client, logger }) => {
  await ack();
  //console.log("event2", body);
  data.push(extractDate(body.state.values));
  await say(
    "Please enter the description of the product (eg Printer for Business)"
  );
  app.message(/^[a-zA-Z ]+$/, async ({ message, say }) => {
    //console.log(message);
    data.push(message.text);
    await say("Enter the price");
    // console.log(data);
    app.message(
      /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
      async ({ message, say }) => {
        //console.log(message);
        data.push(message.text);
        await say("Upload the receipt");
        makeObj(data);
      }
    );
  });
});

(async () => {
  await app.start(port);
  console.log("Bolt app is running");
})();
