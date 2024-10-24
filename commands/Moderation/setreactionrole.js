const { SlashCommandBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const variableManager = require('../../variableManager')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setreactionrole')
        .setDescription('Assign a role when a specific emoji is reacted to a message.')
        // .addChannelOption(option =>
        //     option.setName('channel')
        //         .setDescription('The channel of the message')
        //         .setRequired(true)
        //         .addChannelTypes(ChannelType.GuildText)) // Specify channel type
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message to react to')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('The emoji to react with')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign')
                .setRequired(true)),
    async execute(interaction) {
        const channel = await interaction.guild.channels.fetch(interaction.channelId);//guild.channels.cache.get(interaction.channelId);//interaction.options.getChannel('channel');
        const messageId = interaction.options.getString('message_id');
        const emoji = interaction.options.getString('emoji');
        const roleId = interaction.options.getRole('role').id;

        // Fetch the message in the specified channel
        const message = await channel.messages.fetch(messageId).catch(err => {
            return interaction.reply({ content: 'Message not found!', ephemeral: true });
        });

        if (!message) return interaction.reply({ content: 'Message not found!', ephemeral: true });

        // Add the reaction to the message
        await message.react(emoji).catch(err => {
            return interaction.reply({ content: 'Failed to react with the emoji.', ephemeral: true });
        });

        // Store the reaction role data
        let reactionRoles = { roles: [] };
        const dataFile = './reactionRoles.json';

        if (fs.existsSync(dataFile)) {
            const fileData = fs.readFileSync(dataFile);
            reactionRoles = JSON.parse(fileData);
        }

        // Check if the role already exists
        const existingRole = reactionRoles.roles.find(role => 
            role.channelId === channel.id && 
            role.messageId === messageId && 
            role.emoji === emoji
        );

        if (existingRole) {
            return interaction.reply({ content: 'This reaction role already exists!', ephemeral: true });
        }

        // Add the new role data
        reactionRoles.roles.push({
            channelId: channel.id,
            messageId: messageId,
            emoji: emoji,
            roleId: roleId
        });
        // Save the updated data back to the JSON file
        fs.writeFileSync(dataFile, JSON.stringify(reactionRoles, null, 4));
        variableManager.setVariable(reactionRoles);
        return interaction.reply({ content: 'Reaction role set up successfully!', ephemeral: true });
    },
};
