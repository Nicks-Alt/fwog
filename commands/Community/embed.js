const { SlashCommandBuilder , Routes, REST, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setName('embed')
		.setDescription('Creates a custom embed.')
		.addStringOption(option =>
			option
				.setName('title')
				.setDescription('Title for the embed.')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('description')
				.setDescription("Content to include in the embed. You are able to use \\n for new lines.")
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('color')
				.setDescription('What color to use. You can use either HEX or standard colors.')
				.setRequired(true),
		),
	async execute(interaction) {
		let colorError = false; // just in case someone puts something stupid like goldenrod (i might be the stupid person)
		const embed = new EmbedBuilder()
			.setTitle(interaction.options.getString('title'))
			.setDescription(interaction.options.getString('description').replace(/\\n/g, '\n'))
			.setThumbnail(interaction.guild.iconURL())
			.setTimestamp()
			.setFooter({text: interaction.member.user.globalName, iconURL: interaction.member.user.displayAvatarURL()})
			try {embed.setColor(interaction.options.getString('color').replace('#', ''))}
			catch {
				
				try {
					let initColor = interaction.options.getString('color');
					embed.setColor(initColor.toLowerCase().charAt(0).toUpperCase() + initColor.slice(1));
				}
				catch { interaction.reply(`Invalid Color. Try again.`); colorError = true;}
				
			}; // <-------- tell me why tf do i need a semicolon here. ITS JAVASCRIPT BRO.
		if (colorError) return;
		interaction.reply({embeds: [embed]})
	},
};