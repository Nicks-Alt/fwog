const fs = require('fs');
const path = require('path');

function updateEnv(key, value) {
    
    
    const envFilePath = path.join(__dirname, '.env');
    const envFileContent = fs.readFileSync(envFilePath, 'utf8');

    const regex = new RegExp(`^${key}=.*`, 'm');

    if (envFileContent.match(regex)) {
        const updatedContent = envFileContent.replace(regex, `${key}=${value}`);
        fs.writeFileSync(envFilePath, updatedContent, 'utf8');
    } else {
        fs.appendFileSync(envFilePath, `\n${key}=${value}`, 'utf8');
    }

    console.log(`Updated ${key} in .env file`);
}
let reactionRoles = { roles: []}; // Store emoji-role mappings
const filePath = path.join(__dirname, 'reactionRoles.json');
const loadReactionRoles = () => { // Load reaction roles from JSON file and store it in global var
    try {
        const data = fs.readFileSync(path.join(__dirname, 'reactionRoles.json'), 'utf-8');
        reactionRoles = JSON.parse(data);

        for (const role of reactionRoles.roles) {

        }
    } catch (error) {
        console.warn('Empty reaction roles file. Creating one...');
        fs.writeFileSync(filePath, '{\t"roles": []\n}');
    }
};
function getReactionRoles() {
    return reactionRoles;
}
const saveReactionRoles = (array) => {
    const filePath = path.join(__dirname, 'reactionRoles.json');
    try {
        // const channelEntry = reactionRoles.roles.find(channel => channel.id === array.channel.id);

        // if (channelEntry) {
        //     // Check if the message already exists in the found channel
        //     const messageEntry = channelEntry.messages.find(message => message.id === array.channel.message.id);
            
        //     if (messageEntry) {
        //         // Message already exists, you can update it if needed
        //         console.log("Message already exists:", messageEntry);
        //     } else {
        //         // Message does not exist, push the new message
        //         channelEntry.messages.push(array.channel.message);
        //         console.log("New message added to existing channel:", array.channel.message);
        //     }
        // } else {
        //     // New channel, add the entire channel object
        //     reactionRoles.roles.push({
        //         id: array.channel.id,
        //         messages: [array.channel.message] // Start with the new message
        //     })
        // }
        let channelIndex = reactionRoles.roles.findIndex(roles => roles.channel.id === array.channel.id);
        let messageIndex = reactionRoles.roles.findIndex(roles => roles.channel.message.id === array.channel.message.id);
        console.warn(channelIndex + ' | ' + messageIndex);
        if (channelIndex !== -1 && messageIndex !== -1){
            reactionRoles.roles.channel[channelIndex].message[messageIndex].data.push(array.channel.message.data) // same message and channel
            console.log("same message and channel");
        }
        else if (channelIndex !== -1 && messageIndex === -1) {
            messageIndex.push(array.channel.message) // same channel, diff message
            console.log("same channel, diff message");
        }
        else {
            reactionRoles.roles.push(array) // new channel who this?
            console.log("new channel who this");
        }
        fs.writeFileSync(filePath, JSON.stringify(reactionRoles, null, 2));
        console.log('Saved reaction roles.');
    } catch (error) { // if the file is empty
        fs.writeFileSync(filePath, '{\t"roles": []\n}');
        console.error('Error writing reaction roles file:', error);
    }
};
module.exports = { updateEnv, loadReactionRoles, saveReactionRoles, getReactionRoles };