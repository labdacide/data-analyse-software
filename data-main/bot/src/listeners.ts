import { Client } from "discord.js";

const apiUri = process.env.API_URI;

async function createEvent(name: string, from: string, properties: object) {
  const eventSlug = "twitter";
  await fetch(`${apiUri}/${eventSlug}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name,
      from,
      date: Date.now(),
      properties,
    }),
  });
}

// createEvent("Discord Joined", "achrafash", {
//   date: Date.now(),
//   server: "Human Divergence",
//   referrer: "twitter.com",
// });

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) return;
    console.log(`${client.user.username} is online`);
  });

  client.on("guildMemberAdd", async (member) => {
    // TODO: send event new member
    console.log({ member });
  });

  client.on("guildMemberAvailable", async (member) => {
    // TODO: not sure what's the difference
    console.log({ member });
  });

  client.on("guildMemberRemove", async (member) => {
    // the member left or got kicked out
    console.log({ member });
  });

  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    // new role, removed role, new nickname
    console.log({ oldMember, newMember });
  });

  client.on("messageCreate", async (message) => {
    // new message created
    console.log({ message });
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    // new message created
    console.log({ reaction, user });
  });
};
