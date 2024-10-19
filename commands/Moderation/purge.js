const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .setName('purge')
        .setDescription('Purges the last X number of messages. Cannot delete any messages older than 14 days.')
        .addNumberOption(option => 
            option.setName('amount')
                .setDescription('The amount of messages to delete')
                .setMinValue(1)
                .setRequired(true)),
    async execute(interaction, user) {
        const numMessages = interaction.options.get('amount').value;

        if(numMessages > 100) {
            return await interaction.reply('You cannot delete more than 100 messages at once due to Discord limitations');
        }

        await interaction.channel.bulkDelete(numMessages);
        await interaction.reply(`${numMessages} messages deleted`);
        console.log(`${numMessages} messages deleted using /purge by ${interaction.member.displayName} (${interaction.member.user.username})`);
    }
}