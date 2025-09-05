const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys')
const { state, saveState } = useSingleFileAuthState('./auth.json')

function getCurrentHour() {
  return new Date().getHours()
}

async function start() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const sender = msg.key.remoteJid
    const text = msg.message.conversation?.toLowerCase() || ''
    const hour = getCurrentHour()

    if (text.includes('hi') || text.includes('hey')) {
      await sock.sendMessage(sender, { text: 'Hello' })
    } else if (hour === 6 && text.includes('morning')) {
      await sock.sendMessage(sender, { text: 'Good Morning! 😊' })
    } else if (hour === 16 && text.includes('evening')) {
      await sock.sendMessage(sender, { text: 'Good evening 🌆' })
    } else if (hour === 22 && text.includes('good night')) {
      await sock.sendMessage(sender, { text: 'Good Night 🌙' })
    }
  })

  sock.ev.on('creds.update', saveState)
}

start()
