const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require('dotenv').config();
const { updateEnv } = require('../../utils.js');
const { exec } = require('child_process');

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('setstreamchannel')
        .setDescription('Sets the channel for twitch announcements.')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to announce to')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.get('channel').channel;
        updateEnv('TWITCH_ANNOUNCEMENT_CHANNEL', channel.id);
        await interaction.reply(`Success! Streamer announcements will be broadcasted to <#${channel.id}>.`);
        console.log(`${interaction.member.user.globalName} ran /setstreamchannel to announce to <#${channel.id}>.`);
        await interaction.followUp(`Restarting the bot to initiate changes...`)
        exec('npm run restart', (error) => {
            if (error) {
                console.error(`Error restarting bot: ${error.message}`);
            }
        });
        process.exit(1); // Exit the current process
    }
}