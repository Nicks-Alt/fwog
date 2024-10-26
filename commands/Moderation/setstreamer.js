const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require('dotenv').config();
const { updateEnv } = require('../../utils.js');

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
            await interaction.reply({content: `Success! Streamer announcements for ${username} will be broadcasted to the designated stream announcements channel: <#${process.env.TWITCH_ANNOUNCEMENT_CHANNEL}>.`, ephemeral: true});
        else
        await interaction.reply({content: `Success! Streamer announcements for ${username} will be broadcasted.`, ephemeral: true});
        console.log(`${interaction.member.user.globalName} ran /setstreamer for twitch streamer: ${username}.`);
    }
}