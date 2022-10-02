const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5739068780:AAGGIhOUgrIbj5JrlMbT62P4_7j4IwjDtlY'

const bot = new TelegramApi(token, {polling:true})
const text = 'text';

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты попробуй его отгадать')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай: ', gameOptions)

}

const start = async () => {
    
bot.setMyCommands([
    {command: '/start', description: 'Первое знакомство'},
    {command: '/info', description: 'Пару слов обо мне'},
    {command: '/game', description: 'Давай неного отвлечемся? :) '}
])


bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start'){
       await bot.sendSticker(chatId, 'https://selcdn.tlgrm.app/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/192/11.webp')
       return bot.sendMessage(chatId, 'Добро пожаловать!') 
    }
    if (text === '/info'){
        return bot.sendMessage(chatId, 'Это мой первый тестовый бот, ' + msg.from.first_name + ' '+ msg.from.last_name)
    }    
    if(text === '/game'){
       return startGame(chatId);
    }    
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз! :) ')
    
    
})
    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data === '/end'){
            return bot.sendMessage(chatId, msg.from.first_name +', спасибо за игру! До встречи в следующий раз!')
        }
    
        if (data == chats[chatId]){
            return bot.sendMessage(chatId, 'Поздравляю! Вы отгадали цифру '+ chats[chatId] + ' ', againOptions)
        }else{
            return bot.sendMessage(chatId, 'К сожалению, Вы не отгадали :( я загадал цифру: '+ chats[chatId] + ' ', againOptions)
        }
          
    })
   
}

start()