require('dotenv').config()
// 引用dotenv
const linebot = require('linebot')
const rp = require('request-promise')

// 設定linebot帳密
const bot = linebot({
  // 讀取env
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})
// 機器人要監聽從哪傳來的訊息
bot.listen('/', process.env.PORT, () => {
  console.log('Linebot already start')
})

bot.on('message', event => {
  if (event.message.type === 'text') {
    const usermsg = event.message.text
    rp('https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=5')
      .then(htmlString => {
        let json = JSON.parse(htmlString)
        json = json.filter(j => {
          if (j.title === usermsg) return true
          else return false
        })
        if (json.length > 0) event.reply(json[0].webSales)
        else event.reply('No Result')
      })
      .catch(() => {
        event.reply('Error')
      })
  }
})
