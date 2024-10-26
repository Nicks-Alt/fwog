const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require('dotenv').config();
const { updateEnv } = require('../../utils.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('setgeneralchat')
        .setDescription('Sets the channel for butter to randomly speak in i guess?')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel for butter to watch pspspsps and papasch.')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.get('channel').channel;
        updateEnv('GENERAL_CHAT', channel.id);
        await interaction.reply({ content: `General chat set to: <#${channel.id}>.`, ephemeral: true});
        console.log(process.env.GENERAL_CHAT);
        console.log(`${interaction.member.user.globalName} ran /setgeneralchat. New general chat for butter: <#${channel.id}>.`);
    }
}