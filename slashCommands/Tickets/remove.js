module.exports = {
    name: "remove",
    options: [
        {
            name: "user",
            description: "Write the user you want to remove to the ticket!",
            type: "USER",
            required: true
        }
    ],
    category: "Tickets",
    description: "Remove user to ticket!",
    userPerms: ["SEND_MESSAGES"],
    ownerOnly: false,
    run: async (client, interaction, args) => {
        let user = interaction.options.getUser("user");

        if(interaction.channel.name.includes("close") || interaction.channel.name.includes("ticket")) {
            interaction.channel.permissionOverwrites.edit(user.id, {
                ATTACH_FILES: false,
                READ_MESSAGE_HISTORY: false,
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false
            });

            interaction.reply({ content: `${user} was removed to the ticket by ${interaction.user}` });
        } else {
            interaction.reply({ content: "This command can only be used on tickets!", ephemeral: true });
        }
    }
}