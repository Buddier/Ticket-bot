const fs = require("fs");
const chalk = require("chalk");

/**
 * Load Events
 */
const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./events");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            
            if (event.name) {
                console.log(chalk.bgBlueBright.black(` ✔️ => Event ${file} is being loaded `));
            } else {
                console.log(chalk.bgRedBright.black(` ❌ => Event ${file} missing a help.name or help.name is not in string `));
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

/**
 * Load Prefix Commands
 */
const loadCommands = async function (client) {
    const commandFolders = fs.readdirSync("./commands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            
            if (command.name) {
                client.commands.set(command.name, command);
                console.log(chalk.bgBlueBright.black(` ✔️ => Prefix Command ${file} is being loaded `));
            } else {
                console.log(chalk.bgRedBright.black(` ❌ => Prefix Command ${file} missing a help.name or help.name is not in string `));
                continue;
            }
            
            if (command.aliases && Array.isArray(command))
            command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
        }
    }
}

/**
 * Load SlashCommands
 */
const loadSlashCommands = async function (client) {
    let slash = []

    const commandFolders = fs.readdirSync("./slashCommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./slashCommands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../slashCommands/${folder}/${file}`);
            
            if (command.name) {
                client.slash.set(command.name, command);
                slash.push(command)
                console.log(chalk.bgBlueBright.black(` ✔️ => SlashCommand ${file} is being loaded `));
            } else {
                console.log(chalk.bgRedBright.black(` ❌ => SlashCommand ${file} missing a help.name or help.name is not in string `));
                continue;
            }
        }
    }

    client.on("ready", async() => {
        const guild = client.guilds.cache.get(client.config.guildID);
        await guild.commands.set(slash).then((cmd) => {
            const getRoles = (commandName) => {
                const permissions = slash.find(x => x.name == commandName).userPerms;

                if (!permissions) return null;
                return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed).first(10);
            }

            const fullPermissions = cmd.reduce((accumulator, x) => {
                const roles = getRoles(x.name);

                if (!roles) return accumulator;

                const permissions = roles.reduce((a, v) => {
                    return [
                        ...a,
                        {
                            id: v.id,
                            type: "ROLE",
                            permission: true,
                        }
                    ]
                }, []);

                return [
                    ...accumulator,
                    {
                        id: x.id,
                        permissions
                    }
                ]
            }, []);

            guild.commands.permissions.set({ fullPermissions });
        });
    });
}

module.exports = {
    loadEvents,
    loadCommands,
    loadSlashCommands
}
