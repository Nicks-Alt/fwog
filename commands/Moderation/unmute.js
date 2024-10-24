const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to unmute')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles), // Set permissions
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        let mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

        // Create the Muted role if it doesn't exist
        if (!mutedRole) {
            try {
                mutedRole = await interaction.guild.roles.create({
                    name: 'Muted',
                    permissions: [],
                    reason: 'Created Muted role for muting users',
                });

                const channels = await interaction.guild.channels.fetch();
                channels.forEach(channel => {
                    channel.permissionOverwrites.create(mutedRole, {
                        SEND_MESSAGES: false,
                        SPEAK: false,
                        ADD_REACTIONS: false,
                    });
                });

                await interaction.reply('Muted role created successfully.');
            } catch (error) {
                console.error(error);
                return interaction.reply('There was an error creating the Muted role.');
            }
        }

        // Check if the member is muted
        if (!member.roles.cache.has(mutedRole.id)) {
            return interaction.reply(`${user.tag} is not muted.`);
        }

        try {
            await member.roles.remove(mutedRole);
            await interaction.reply(`Unmuted ${user.tag}.`);
        } catch (error) {
            console.error(error);
            await interaction.reply('I was unable to unmute the user. Make sure I have the right permissions.');
        }
    }
};
