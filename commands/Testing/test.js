const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setName('test')
		.setDescription('Test'),
	async execute(interaction) {
		await interaction.reply('It is working');
	},
};