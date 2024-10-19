const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('restart')
        .setDescription('Restarts the bot'),
    async execute(interaction) {
        await interaction.reply(`Restarting the bot.`);
        console.log(__dirname);
        exec(`cd ../..`);
        exec(`node index.js`, (error) => {
            if (error) {
                console.error(`Error restarting bot: ${error.message}`);
            }
        });
        process.exit(1); // Exit the current process
    }
}