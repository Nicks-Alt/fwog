const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for kicking')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), // Set permissions
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(user.id);

        // Check if the bot has permission to kick members
        if (!interaction.guild.members.me.permissions.has('KICK_MEMBERS')) {
            return interaction.reply('I do not have permission to kick members.');
        }

        // Check if the user is kickable
        if (!member.kickable) {
            return interaction.reply('I cannot kick this user. They may have a higher role or I lack permissions.');
        }

        try {
            await member.kick(reason);
            await interaction.reply(`Kicked ${user.tag} for: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply('I was unable to kick the user. Please try again.');
        }
    }
};
