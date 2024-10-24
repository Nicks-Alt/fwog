// ================================ Global Variables ===============================
require('dotenv').config(); //initializes dotenv
const { Client, Intents, GatewayIntentBits, Routes, REST, Events, Collection, PermissionFlagsBits } = require('discord.js');
const axios = require('axios'); // for twitch API queries
const fs = require('fs'); // allows us to use the filestream
const path = require('path'); // allows us to combine file paths easy
const { updateEnv } = require('./utils'); // updates environment variable file
const exec = require('child_process').exec; // allows use of npm scripts
const variableManager = require('./variableManager'); // for accessing reaction role data
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers] }); // init client with intents
// =================================================================================

// =================================== Events ==================================
let reactionRoles = { roles: [] };
const dataFile = './reactionRoles.json';
if (fs.existsSync(dataFile)) {
    const fileData = fs.readFileSync(dataFile);
    reactionRoles = JSON.parse(fileData);
}

if (!fs.existsSync('./.env')) {
	console.warn('No env file found. Creating...');
	fs.writeFileSync('./.env',
	'CLIENT_TOKEN=\nGUILD_ID=\nCLIENT_ID=1296571395303673907\nBOT_COMMANDS_CHANNEL=\nTWITCH_CLIENT_ID=kyw23aof869yes25gj56edkmxna08l\nTWITCH_CLIENT_SECRET=4tqusid3sii2j0hsfm7lflexztn8hp\nTWITCH_USERNAME=\nTWITCH_ANNOUNCEMENT_CHANNEL=\n')
	
}

client.once('ready', async client => {
	
	console.warn(`Setting up reaction roles...`);
	await setupReactionRoles();
	if (channelId && twitchUsername) {
		checkLiveStatus();
		setInterval(checkLiveStatus, 60000);
	};
	client.guilds.cache.forEach(guild => {
		updateEnv('GUILD_ID', guild.id);
	})
	console.log('Starting command registering...');
	exec('npm run regcmds', (error) => {
		if (error) {
			console.error(`Error registering commands: ${error.message}`);
		}
	});
	console.log(`Ready! Logged in as ${client.user.tag}`);
})
client.on('guildCreate', async guild => {
	updateEnv('GUILD_ID', guild.id);
    console.log(`Joined a new guild: ${guild.name} (ID: ${guild.id})`);
})
// Event listener for interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
		if (interaction.channel.id != process.env.BOT_COMMANDS_CHANNEL) {
			if (!interaction.member.permissionsIn(interaction.channel.id).has(PermissionFlagsBits.Administrator)){
				await interaction.reply(`Please use channel <#${process.env.BOT_COMMANDS_CHANNEL}> for bot commands.`)
				return;
			}
		} 

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
			await command.execute(interaction);
});

// Event listener for message reactions
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return; // Ignore bot reactions

		const roleData = reactionRoles.roles.find(role =>
			role.channelId === reaction.message.channel.id &&
			role.messageId === reaction.message.id &&
			role.emoji === reaction.emoji.name
		);

    if (roleData) {
		try {
			const member = await reaction.message.guild.members.fetch(user.id);
        const role = await reaction.message.guild.roles.fetch(roleData.roleId);

            if (member && role) {
                await member.roles.add(role);
                console.log(`[Reaction Roles] Assigned role ${role.name} to ${member.user.tag}`);
            } else {
                console.log('Member or role not found');
    	}
		} catch (error) {
			console.error('Error adding role:', error);
		}
        
	}
});

// Event listener for message reaction removal
client.on('messageReactionRemove', async (reaction, user) => {
			if (user.bot) return; // Ignore bot reactions

			const roleData = reactionRoles.roles.find(role =>
						role.channelId === reaction.message.channel.id &&
						role.messageId === reaction.message.id &&
						role.emoji === reaction.emoji.name
				);

			if (roleData) {
				try {
					const member = await reaction.message.guild.members.fetch(user.id);
					const role = await reaction.message.guild.roles.fetch(roleData.roleId);

					if (member && role) {
						await member.roles.remove(role);
						console.log(`[Reaction Roles] Removed role ${role.name} from ${member.user.tag}`);
					} else {
						console.log('Member or role not found');
					}
				} catch (error) {
					console.error('Error removing role:', error);
				}
				
			}
});
// Event listener for reactionRoles being updated
variableManager.on('variableUpdated', (newValue) => {
	console.log(`Added a reaction role.`);
	reactionRoles = variableManager.getVariable();
})


// Function to fetch messages and set up reactions
async function setupReactionRoles() {
    for (const roleData of reactionRoles.roles) {
        const channel = await client.channels.fetch(roleData.channelId);
        if (!channel) {
            console.log(`Channel ${roleData.channelId} not found.`);
            continue;
        }

        try {
            const message = await channel.messages.fetch(roleData.messageId);
            await message.react(roleData.emoji);
            console.log(`Reacted with ${roleData.emoji} on message ${roleData.messageId} in channel ${roleData.channelId}.`);
        } catch (error) {
            console.error(`Failed to fetch message ${roleData.messageId} in channel ${roleData.channelId}:`, error);
        }
    }
}
// =================================================================================

// ================================ Command Loading ================================
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
// =================================================================================

// ============================== Twitch Stuff =====================================
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
let twitchUsername = process.env.TWITCH_USERNAME;

let channelId = process.env.TWITCH_ANNOUNCEMENT_CHANNEL;

let accessToken = '';
let wasLive = false; // Track the previous live status

async function getTwitchAccessToken() {
    console.log("Attempting to get access token...")
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
        params: {
            client_id: twitchClientId,
            client_secret: twitchClientSecret,
            grant_type: 'client_credentials',
        },
    });
    console.log("Twitch access token retrieved!")
    return response.data.access_token;
}

async function isStreamerLive() {
    if (!accessToken) {
        accessToken = await getTwitchAccessToken();
    }

    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${twitchUsername}`, {
        headers: {
            'Client-ID': twitchClientId,
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.data.data.length > 0; // Returns true if live
}

async function checkLiveStatus() {
	if (channelId !== process.env.TWITCH_ANNOUNCEMENT_CHANNEL) // in case /setstreamchannel is ran
		wasLive = false;
	channelId = process.env.TWITCH_ANNOUNCEMENT_CHANNEL // if the channel registered with /setstreamchannel is different
	twitchUsername = process.env.TWITCH_USERNAME; // for debug
    const live = await isStreamerLive();
	const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN);
    if (live && !wasLive) { // Runs if the streamer is live and it wasnt a previous request OR if its someone else that wasnt the previous streamer and they live.
		await rest.post(Routes.channelMessages(channelId), {
            body: {
                content: `@here ${twitchUsername} is now live on Twitch! https://twitch.tv/${twitchUsername}`,
            },
        });
		wasLive = true; // Update the status
    } else if (!live && wasLive) { // Runs if the streamer got off stream by live == false and also 
		await rest.post(Routes.channelMessages(channelId), {
            body: {
                content: `${twitchUsername} has gone offline.`,
            },
        });
        wasLive = false; // Update the status
    }
}
// =================================================================================
client.login(process.env.CLIENT_TOKEN); //signs the bot in with token