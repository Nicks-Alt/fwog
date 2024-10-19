const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription(`The user's avatar you wish to see.`)
                .setRequired(true)
        )
		.setDescription(`Grabs the mentioned user's avatar.`),
	async execute(interaction) {
        const target = interaction.options.getUser('target')
        await interaction.reply({ embeds: [
            new EmbedBuilder()
            .setColor(0x0099FF)
            .setDescription(`${target.globalName ?? target.username}'s avatar`)
            .setImage(`https://cdn.discordapp.com/avatars/${target.id}/${target.avatar}.png?size=1024`)
            .setTimestamp()
            .setFooter({ text: `Ran by ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL( {extension: 'png', size: 1024} )}
            )
        ]});
    }
};