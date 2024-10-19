const { SlashCommandBuilder , REST, Routes, EmbedBuilder, PermissionFlagsBits} = require('discord.js');
const fs = require('fs');
const { permission } = require('process');
require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Useful for finding what commands are available.'),
	async execute(interaction) {
        // Start a rest client
        const rest = new REST({ version: '9' }).setToken(process.env.CLIENT_TOKEN);

        // Fetch all commands for the guild
        const commands = await rest.get(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID));
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setColor('#0099ff') // You can change the color
            .setDescription('Here are all the commands you can use:')
            .setTimestamp()
            .setFooter({ text: '/help' , iconURL: interaction.client.user.displayAvatarURL({dynamic: true, size: 1024}) })
        commands.forEach(command => {
            console.log(interaction.member.permissions);
            if (command.default_member_permissions === null) // all reg commands
                embed.addFields({name: `/${command.name}`, value: command.description, inline: false});
            else if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)){
                    embed.addFields({name: `/${command.name}`, value: command.description, inline: false});
            } // all admin commands
            else if (interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) || interaction.member.permissions.has(PermissionFlagsBits.Administrator)) // for purge 
                embed.addFields({name: `/${command.name}`, value: command.description, inline: false});
        });
		await interaction.reply({embeds: [embed]});
	},
};