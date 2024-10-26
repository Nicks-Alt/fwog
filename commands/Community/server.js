const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Displays general server information.'),
    
    async execute(interaction) {
        const guild = interaction.guild;

        const embed = new EmbedBuilder()
            .setColor('#808080')
            .setTitle(`*Server Info for ${guild.name}*`)
            .addFields(
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Owner', value: `${guild.ownerId} (${guild.members.cache.get(guild.ownerId).user.tag})`, inline: false },
                { name: 'Member Count', value: guild.memberCount.toString(), inline: false },
                { name: 'Channel Count', value: guild.channels.cache.size.toString(), inline: false },
                { name: 'Role Count', value: guild.roles.cache.size.toString(), inline: false },
                { name: 'Region', value: guild.preferredLocale, inline: false },
                { name: 'Created At', value: guild.createdAt.toDateString(), inline: false },
            )
            .setThumbnail(guild.iconURL())
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
