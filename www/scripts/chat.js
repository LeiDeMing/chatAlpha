window.onload = function () {
    new Chat();
};

function Chat() {
    this.init();
}

Chat.prototype = {
    init: function () {
        var oThis = this;
        this.socket = io.connect();
        this.socket.on('connect', function () {
            document.getElementById('shadeBox').getElementsByTagName('p')[0].textContent = 'Please take you name!';
            document.getElementById('nameInput').style.display = 'block';
            document.getElementById('nameInput').getElementsByTagName('input')[0].focus();
        });
        this.socket.on('userExisted', function () {
            document.getElementById('shadeBox').getElementsByTagName('p')[0].textContent = 'The name is have';
            document.getElementById('nameInput').getElementsByTagName('input')[0].focus()
        });
        this.socket.on('loginSuccess', function () {
            document.title = 'Hi  ' + document.getElementById('nameInput').getElementsByTagName('input')[0].value;
            document.getElementById('shadeBox').style.display = 'none';
        });
        this.socket.on('system', function (user, userCount, type) {
            var msg = user + (type === 'login' ? ' 加入' : ' 离开');
            oThis._showNewMsg('系统', msg, 'red');
            document.getElementById('showUsers').textContent = userCount + '位用户在线';
        });
        this.socket.on('newMsg', function (user, msg, color) {
            oThis._showNewMsg(user, msg, color);
        });
        this.socket.on('newImg', function (user, img, color) {
            console.log(user, img, color);
            oThis._showNewImg(user, img, color);
        });
        this.socket.on('allUsers', function (users) {
            var containerRight = document.getElementById('allUsers');
            containerRight.innerHTML = '';
            for (var x = 0; x < users.length; x++) {
                var oA = document.createElement('a');
                var oP = document.createElement('p');
                oA.innerHTML = users[x];
                oA.href = 'javascript:;';
                oP.appendChild(oA);
                containerRight.appendChild(oP);
            }

        });
        document.getElementById('nameBtn').addEventListener('click', function () {
            oThis._name();
        }, false);
        document.getElementById('name').addEventListener('keydown',function(event){
            event=event || window.event;
            if(event.keyCode===13){
                oThis._name();
            }
        });
        document.getElementById('sendBtn').addEventListener('click', function () {
            oThis._msg();
            return;
        }, false);
        document.getElementById('sendMsg').addEventListener('keydown',function(event){
            event=event || window.event;
            if(event.ctrlKey && event.keyCode===13){
                oThis._msg();
            }
            return;
        },false);
        document.getElementById('sendImg').addEventListener('change', function () {
            // console.log(this.files);
            var that = this;
            if (that.files.length !== 0) {
                var file = that.files[0],
                    reader = new FileReader(),
                    color = document.getElementById('conColor').value;
                if (!reader) {
                    oThis._showNewMsg('系统', '!your browser doesn\'t support fileReader', 'red');
                    that.value = '';
                    return;
                }
                reader.onload = function (e) {
                    that.value = '';
                    oThis.socket.emit('postImg', e.target.result, color);
                    oThis._showNewImg('me', e.target.result, color);
                };
                reader.readAsDataURL(file);
            }
        }, false)
    },
    _name:function(){
        var nickname = document.getElementById('nameInput').getElementsByTagName('input')[0].value;
        if (nickname.trim().length !== 0) {
            this.socket.emit('login', nickname);
        } else {
            document.getElementById('nameInput').getElementsByTagName('input')[0].focus();
        }
    },
    _msg:function(){
        var msg = document.getElementById('sendMsg').value,
            color = document.getElementById('conColor').value;
        if (msg.trim().length !== 0) {
            this._showNewMsg('me', msg, color);
            this.socket.emit('postMsg', msg, color);
        }
        document.getElementById('sendMsg').value = '';
        document.getElementById('sendMsg').focus();
    },
    _showNewMsg: function (users, msg, color) {
        var container = document.getElementById('chatMsg'),
            msgToShow = document.createElement('p'),
            date = (new Date).toTimeString().substr(0, 8);
        msgToShow.style.color = color || '#000';
        msgToShow.innerHTML = users + '  <span class="timeSpan">' + date + ':</span> ' + msg;
        container.appendChild(msgToShow);
        container.scrollTop = container.scrollHeight;
    },
    _showNewImg: function (users, img, color) {
        var container = document.getElementById('chatMsg'),
            imgToShow = document.createElement('p'),
            date = (new Date()).toTimeString().substr(0, 8);
        imgToShow.style.color = color || '#000';
        imgToShow.innerHTML = users + '  <span class="timeSpan">' + date + ':</span>' +'<br />'+ '<a href="' + img + '" target="_blank"><img src="' + img + '"/></a>';
        container.appendChild(imgToShow);
        container.scrollTop = container.scrollHeight;
    }
};