module.exports = {
    name: "add",
    options: [
        {
            name: "user",
            description: "Write the user you want to add to the ticket!",
            type: "USER",
            required: true
        }
    ],
    category: "Tickets",
    description: "Add user to ticket!",
    userPerms: ["SEND_MESSAGES"],
    ownerOnly: false,
    run: async (client, interaction, args) => {
        let user = interaction.options.getUser("user");

        if(interaction.channel.name.includes("close") || interaction.channel.name.includes("ticket")) {
            interaction.channel.permissionOverwrites.edit(user.id, {
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            });
            
            interaction.reply({ content: `${user} was added to the ticket by ${interaction.user}` });
        } else {
            interaction.reply({ content: "This command can only be used on tickets!", ephemeral: true });
        }
    }
}