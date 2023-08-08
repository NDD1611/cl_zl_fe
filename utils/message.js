
export const addSameDayAndSameAuth = (messages) => {
    for (let i = 1; i < messages.length; i++) {
        let message = messages[i]
        let lastMessage = messages[i - 1]
        if (message.senderId === lastMessage.senderId) {
            message.sameAuth = true
        } else {
            message.sameAuth = false
        }

        let messageDate = new Date(message.date)
        let lastMessageDate = new Date(lastMessage.date)
        let messageDay = messageDate.getDate()
        let messageMonth = messageDate.getMonth()
        let messageYear = messageDate.getFullYear()
        let messageHour = messageDate.getHours()
        let messageMinute = messageDate.getMinutes()

        let lastMessageDay = lastMessageDate.getDate()
        let lastMessageMonth = lastMessageDate.getMonth()
        let lastMessageYear = lastMessageDate.getFullYear()


        if (messageDay === lastMessageDay && messageMonth === lastMessageMonth && messageYear === lastMessageYear) {
            message.sameDay = true
        } else {
            message.sameDay = false
        }
        if (messageHour < 10) {
            messageHour = '0' + messageHour
        }
        if (messageMinute < 10) {
            messageMinute = '0' + messageMinute
        }

        let dateShow = messageHour + ':' + messageMinute + ' ' + messageDay + '/' + messageMonth + '/' + messageYear
        message.dateShow = dateShow
        let hourMinute = messageHour + ':' + messageMinute
        message.hourMinute = hourMinute
    }
}

export const checkShowTimeInBottom = (messages) => {

    for (let i = 0; i < messages.length; i++) {
        let message = messages[i]
        let lastMessage = messages[i - 1]
        if (message.sameDay === false) {
            messages[i - 1].showTime = true
        }
        if (message.sameAuth === false) {
            messages[i - 1].showTime = true
        }
    }
    messages[messages.length - 1].showTime = true
}