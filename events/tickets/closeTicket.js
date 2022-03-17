module.exports = {
    name: 'interactionCreate',

    /**
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'ticket-close' && interaction.channel.name.includes('ticket')) {
            const channel = interaction.channel;
            const member = interaction.guild.members.cache.get(channel.topic);

            const rowPanel = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setStyle("DANGER")
                .setEmoji("🔒")
                .setDisabled(true)
                .setCustomId("ticket-close")
            );
            
            await interaction.message.edit({ components: [rowPanel] });
            
            const rowDeleteFalse = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setStyle("DANGER")
                .setEmoji("🗑️")
                .setDisabled(true)
                .setCustomId("ticket-delete")
            );

            const rowDeleteTrue = new client.discord.MessageActionRow()
            .addComponents(
                new client.discord.MessageButton()
                .setStyle("DANGER")
                .setEmoji("🗑️")
                .setDisabled(false)
                .setCustomId("ticket-delete")
            );
            
            const embed = new client.discord.MessageEmbed()
            .setTitle("Close Ticket!")
            .setDescription(`Ticket closed by <@!${interaction.user.id}>!\n\n**Press the 🗑️ button to delete the ticket!**`)
            .setColor(client.config.embedColor)
            .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });
            
            interaction.reply({ embeds: [embed], components: [rowDeleteFalse] }).then(() => setTimeout(() => {
                interaction.channel.edit({ name: `close-${member.user.username}` });
                interaction.editReply({ components: [rowDeleteTrue] });
            }, 2000));
            
            interaction.channel.permissionOverwrites.edit(member, {
                VIEW_CHANNEL: false
            });
        }
    }
}