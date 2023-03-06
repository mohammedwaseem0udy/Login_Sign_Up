let notifier = require('node-notifier');
let sendNotification = function(title, body) {
    notifier.notify({
        title: title,
        message: body,
        sound: true
    })
}

module.exports = {
    sendNotification: sendNotification,
}