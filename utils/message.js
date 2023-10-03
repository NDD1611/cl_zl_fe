export const addSameDayAndSameAuth = (messages) => {
    for (let i = 1; i < messages.length; i++) {
        let message = messages[i]
        let lastMessage = messages[i - 1]
        if (lastMessage.typeAnnounce == 'acceptFriend') {
            message.sameAuth = false
        } else if (message.sender._id === lastMessage.sender._id) {
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

export const checkShowTimeAndStatusInBottom = (messages) => {
    if (messages.length) {
        for (let i = 0; i < messages.length; i++) {
            let message = messages[i]
            messages[i].showStatus = false
            let lastMessage = messages[i - 1]
            if (message.sameDay === false) {
                messages[i - 1].showTime = true
            }
            if (message.sameAuth === false) {
                messages[i - 1].showTime = true
            }
        }
        messages[messages.length - 1].showTime = true
        messages[messages.length - 1].showStatus = true
        let status = messages[messages.length - 1].status
        if (status == 0) {
            messages[messages.length - 1].statusText = 'đang gửi'
        }
        if (status == 1) {
            messages[messages.length - 1].statusText = 'đã gửi'
        }
        if (status == 2) {
            messages[messages.length - 1].statusText = 'đã nhận'
        }
        if (status == 3) {
            messages[messages.length - 1].statusText = 'đã xem'
        }
    }
}