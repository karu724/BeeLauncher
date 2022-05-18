const axios = require('axios');

const authAccounts = ConfigManager.getAuthAccounts()
const authKeys = Object.keys(authAccounts)
const selectedUUID = ConfigManager.getSelectedAccount().uuid

let microsoftAuthAccountStr = ''
let mojangAuthAccountStr = ''

authKeys.forEach((val) => {
    const acc = authAccounts[val]
    console.log(`UUID: ${acc.uuid}`)
})