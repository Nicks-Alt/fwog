const { SlashCommandBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v9');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user from the server.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The user ID to unban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const userId = interaction.options.getString('userid');

        try {
            await interaction.guild.bans.remove(userId);
            await interaction.reply(`Successfully unbanned <@${userId}>.`);
        } catch (error) {
            console.error(error);
            await interaction.reply(`Could not unban the user with ID \`${userId}\`. They may not be banned or the ID is incorrect.`);
        }
    }
};
