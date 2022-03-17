module.exports = {
    name: "send-panel",
    usage: '/send-panel <channel>',
    options: [
        {
            name: 'channel',
            description: 'Channel to send ticket panel!',
            type: 'CHANNEL',
            channelTypes: ["GUILD_TEXT"],
            required: true
        }
    ],
    category: "Tickets",
    description: "Send ticket panel to specific channel!",
    userPerms: ["ADMINISTRATOR"],
    ownerOnly: false,
    run: async (client, interaction) => {
        const channel = interaction.options.getChannel("channel");

        const row = new client.discord.MessageActionRow()
        .addComponents(
            new client.discord.MessageButton()
            .setStyle("SECONDARY")
            .setEmoji("📩")
            .setCustomId("create-ticket")
        );

        const embed = new client.discord.MessageEmbed()
        .setTitle("Create ticket")
        .setDescription("To create a ticket react with 📩")
        .setColor(client.config.embedColor)
        .setFooter({ text: `${client.config.embedfooterText}`, iconURL: `${client.user.displayAvatarURL()}` });

        interaction.reply({ content: `Ticket panel success send to ${channel}!`, ephemeral: true });
        return channel.send({ embeds: [embed], components: [row] });
    }
}