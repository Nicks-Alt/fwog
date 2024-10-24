const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for banning')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Set permissions
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(user.id);

        // Check if the bot has permission to ban members
        if (!interaction.guild.members.me.permissions.has('BAN_MEMBERS')) {
            return interaction.reply('I do not have permission to ban members.');
        }

        // Check if the user is bannable
        if (!member.bannable) {
            return interaction.reply('I cannot ban this user. They may have a higher role or I lack permissions.');
        }

        try {
            await member.ban({ reason });
            await interaction.reply(`Banned ${user.tag}(ID: *${user.id}*) for: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.reply('I was unable to ban the user. Please try again.');
        }
    }
};
