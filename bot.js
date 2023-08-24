import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { groups } from "./constants.js";
dotenv.config();
const { BOT_TOKEN, ADMIN_ID, CHANNEL_ID } = process.env;
const bot = new Telegraf(BOT_TOKEN);
bot.command("start", (ctx) => {
  ctx.reply("Welcome");
});
bot.on("forward_date", (ctx) => {
  if (ctx.chat.id !== parseInt(ADMIN_ID)) {
    ctx.reply("Sorry, You are not authorized to do this ");
  } else {
    const { forward_from_chat, forward_from_message_id } = ctx.message;
    if (forward_from_chat.id !== parseInt(CHANNEL_ID)) {
      ctx.reply("Sir, you are forwarding this from a wrong channel");
    } else {
      groups.map(async (groupId) => {
        console.log(forward_from_chat);
        console.log(forward_from_message_id);
        await ctx.telegram.forwardMessage(
          groupId,
          forward_from_chat.id,
          forward_from_message_id
        );
      });
    }
  }
});
bot.launch({
  webhook: {
    domain: "https://forwarder-bot-demo.onrender.com",
    port: process.env.PORT || 5000,
  },
});
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
