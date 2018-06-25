class NodeChat {
    constructor() {
        // 昵称设置的确定按钮
        document.getElementById('loginBtn').addEventListener('click', () => {
            const nickName = document.getElementById('nicknameInput').value
            //检查昵称输入框是否为空
            if (nickName.trim()) {
                //不为空，则发起一个login事件并将输入的昵称发送到服务器
                this.socket.emit('login', nickName)
            } else {
                //否则输入框获得焦点
                document.getElementById('nicknameInput').focus()
            }
        }, false)

        document.getElementById('sendBtn').addEventListener('click', () => {
            const messageInput = document.getElementById('messageInput')
            const msg = messageInput.value
            messageInput.value = ''
            messageInput.focus()
            if (msg.trim()) {
                this.socket.emit('postMsg', msg)
                this._displayNewMsg('me', msg)
            }
        }, false)

        // 建立到服务器的socket连接
        this.socket = io.connect()
        // 监听socket的connect事件，此事件表示连接已经建立
        this.socket.on('connect', () => {
            // 连接到服务器后，显示昵称输入框
            document.getElementById('info').textContent = '输入你的昵称吧 :)'
            document.getElementById('nickWrapper').style.display = 'block'
            document.getElementById('nicknameInput').focus()
        })

        this.socket.on('nickExisted', () => {
            // 显示昵称被占用的提示
            document.getElementById('info').textContent = '昵称已存在，请重新输入'
        })

        this.socket.on('loginSuccess', () => {
            document.title = 'node-chat | ' + document.getElementById('nicknameInput').value
            // 隐藏遮罩层显聊天界面
            document.getElementById('loginWrapper').style.display = 'none'
            // 让消息输入框获得焦点
            document.getElementById('messageInput').focus()
        })

        this.socket.on('system', (nickName, userCount, type) => {
            var msg = nickName + (type == 'login' ? ' 进入' : ' 离开')
            // 指定系统消息显示为红色
            this._displayNewMsg('system ', msg, 'red')
            document.getElementById('status').textContent = userCount + '个用户在线'
        })

        // 新消息
        this.socket.on('newMsg', (user, msg) => {
            this._displayNewMsg(user, msg)
        })
    }

    _displayNewMsg(user, msg, color) {
        const container = document.getElementById('historyMsg')
        const msgToDisplay = document.createElement('p')
        const date = new Date().toTimeString().substr(0, 8)

        msgToDisplay.style.color = color || '#000'
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg
        container.appendChild(msgToDisplay)
        container.scrollTop = container.scrollHeight
    }
}

window.onload = () => {
    const nodeChat = new NodeChat()
}