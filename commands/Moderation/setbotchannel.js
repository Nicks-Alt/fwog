const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require('dotenv').config();
const { updateEnv } = require('../../utils.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('setbotchannel')
        .setDescription('Sets the channel for bot commands. Requires a channel mention (ex. #announcements).')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to use commands in.')
                .setRequired(true)),
    async execute(interaction, user) {
        const channel = interaction.options.get('channel').channel;
        updateEnv('BOT_COMMANDS_CHANNEL', channel.id);
        await interaction.reply({content: `Bot commands channel set to: <#${channel.id}>.`, ephemeral: true});
        console.log(`${interaction.member.user.globalName} ran /setbotchannel. New bot channel: <#${channel.id}>.`);
    }
}