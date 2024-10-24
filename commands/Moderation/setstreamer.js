const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require('dotenv').config();
const { updateEnv } = require('../../utils.js');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setName('setstreamer')
        .setDescription('Sets the streamer for twitch announcements.')
        .addStringOption(option => 
            option.setName('username')
                .setDescription('The twitch username (handle) to get announcements from. (Do not use twitch.tv)')
                .setRequired(true)),
    async execute(interaction) {
        const username = interaction.options.getString('username');
        updateEnv('TWITCH_USERNAME', username);
        if (process.env.TWITCH_ANNOUNCEMENT_CHANNEL)
            await interaction.reply(`Success! Streamer announcements for ${username} will be broadcasted to the designated stream announcements channel: <#${process.env.TWITCH_ANNOUNCEMENT_CHANNEL}>.`);
        else
        await interaction.reply(`Success! Streamer announcements for ${username} will be broadcasted.`);
        console.log(`${interaction.member.user.globalName} ran /setstreaner for twitch streamer: ${username}.`);
        await interaction.followUp(`Restarting the bot to initiate changes...`)
        exec('npm run restart', (error) => {
            if (error) {
                console.error(`Error restarting bot: ${error.message}`);
            }
        });
        process.exit(1); // Exit the current process
    }
}