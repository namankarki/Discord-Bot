const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  AttachmentBuilder,
} = require("discord.js");
const path = require("path");
const fs = require("fs"); // Import fs module for file checking
require("dotenv").config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Kirito phrases array (for when mentioned in messages)
const kiritoPhrases = [
  "Kirito talu valu ho muji",
  "Kiri le phone uthaudaina phone ko vibration enjoy gardai bascha",
  "Time ma aija chikne Kritoooo!!",
  "Muskan lai vandim?",
  "Kiri ko muji sano kando",
  "Dallo Maharaja",
  "Dwarf King",
  "Talu Mayalu",
  "Kirito ko nakh aujar vanda thulo cha",
  "Khate bacha kasto kirito bhalu jasto",
  "jati sano ankha teti sano lado",
];

// Array of local photo file paths
const kiritoPhotos = [
  path.join(__dirname, "./photos/kirito1.jpg"),
  path.join(__dirname, "./photos/kirito2.PNG"),
  path.join(__dirname, "./photos/kirito3.PNG"),
  path.join(__dirname, "./photos/kirito4.jpg"),
  path.join(__dirname, "./photos/kirito5.jpg"),
  path.join(__dirname, "./photos/kirito6.PNG"),
  path.join(__dirname, "./photos/kirito7.PNG"),
  path.join(__dirname, "./photos/kirito8.PNG"),
  path.join(__dirname, "./photos/kirito9.PNG"),
  path.join(__dirname, "./photos/kirito10.PNG"),
  path.join(__dirname, "./photos/kirito11.PNG"),
  path.join(__dirname, "./photos/kirito12.PNG"),
  path.join(__dirname, "./photos/kirito13.PNG"),
];

// Replace this with Kirito's actual Discord user ID
const kiritoUserId = "551998151192608778";

// Register the slash command
const commands = [
  new SlashCommandBuilder()
    .setName("kirito")
    .setDescription("Replies with a random photo of Kirito"),
].map((command) => command.toJSON());

// Setup REST API for slash commands
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    // Register commands
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });

    // Fetch registered commands
    const registeredCommands = await rest.get(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID)
    );
    console.log("Registered commands:", registeredCommands);

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
})();

// When the bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return; // Ignore bot messages

  console.log(`Message received: ${message.content}`); // Log the message content
  console.log("Mentions:", message.mentions.users); // Log the mentions

  const kirito = message.mentions.users.find(
    (user) => user.id === kiritoUserId
  );
  if (kirito) {
    const randomIndex = Math.floor(Math.random() * kiritoPhrases.length);
    message.channel.send(kiritoPhrases[randomIndex]);
  }
});

// Handle slash commands
client.on("interactionCreate", async (interaction) => {
  console.log("Received interaction:", interaction); // Log the whole interaction object
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  console.log(`Received command: ${commandName}`);

  if (commandName === "kirito") {
    console.log("Processing /kirito command");

    try {
      // Defer the reply to avoid timeout
      await interaction.deferReply();

      // Get a random photo file from the kiritoPhotos array
      const randomIndex = Math.floor(Math.random() * kiritoPhotos.length);
      const randomPhoto = kiritoPhotos[randomIndex];

      // Log the selected photo path
      console.log("Selected photo path:", randomPhoto);

      // Check if the file exists
      if (!fs.existsSync(randomPhoto)) {
        console.error("File not found:", randomPhoto);
        await interaction.followUp("The requested photo could not be found.");
        return;
      }

      // Send the local image as an attachment
      const attachment = new AttachmentBuilder(randomPhoto);
      await interaction.followUp({ files: [attachment] });
    } catch (error) {
      console.error("Error processing /kirito command:", error);
      await interaction.followUp(
        "There was an error trying to send the photo."
      );
    }
  }
});

// Login to Discord with the token from the .env file
client.login(process.env.DISCORD_TOKEN);
