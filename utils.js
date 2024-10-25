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

module.exports = { updateEnv, loadReactionRoles, saveReactionRoles, getReactionRoles };