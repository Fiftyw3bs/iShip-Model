import SessionClient from "../../lib/node-session-client/session-client"

const fs = require('fs') // for loading state

const client = new SessionClient()

const sendMessage = async (to: string, message: string, _attachments?: Array<string>) => {

    const attachments = new Array<unknown>(_attachments?.length); // = new Array<Promise<unknown>>();

    // need an image
    _attachments?.forEach(
        attachment => {
            const attachment_tmp = makeImageFromAttachment(attachment)
            attachments.push(attachment_tmp)
        }
    )

    return client.loadIdentity({
        // load recovery phrase if available
        seed: fs.existsSync('seed.txt') && fs.readFileSync('seed.txt').toString(),
        displayName: 'ShipShift',
        // path to local file
        // avatarFile: 'avatar.png',
    }).then(async () => {
        // persist place in inbox incase we restart
        client.on('updateLastHash', hash => {
            fs.writeFileSync('lastHash.txt', hash)
        })
        client.send(to, message, {
            attachments: [attachments]
        })
    })
}

const makeImageFromAttachment = async (attachment: string) => {
    return await client.makeImageAttachment(fs.readFileSync(attachment))
}

export default sendMessage;