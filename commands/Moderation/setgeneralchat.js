const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
require('dotenv').config();
const { updateEnv } = require('../../utils.js')
const exec = require('child_process').exec

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setName('setgeneralchat')
        .setDescription('Sets the channel for butter to randomly speak in i guess?')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to use commands in.')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.get('channel').channel;
        updateEnv('GENERAL_CHAT', channel.id);
        await interaction.reply(`General chat set to: <#${channel.id}>.`);
        console.log(`${interaction.member.user.globalName} ran /setgeneralchat. New general chat for butter: <#${channel.id}>.`);
        await interaction.followUp(`Restarting the bot to initiate changes...`)
        exec('npm run restart', (error) => {
            if (error) {
                console.error(`Error restarting bot: ${error.message}`);
            }
        });
        process.exit(1); // Exit the current process
    }
}