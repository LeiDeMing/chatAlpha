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
            document.title='Hi  '+document.getElementById('nameInput').getElementsByTagName('input')[0].value;
            document.getElementById('shadeBox').style.display = 'none';
        });
        this.socket.on('system', function (user, userCount, type) {
            var msg = user + (type === 'login' ? ' 加入' : ' 离开');
            oThis._showNewMsg('system',msg,'red');
            document.getElementById('showPeople').textContent=userCount+'用户在线';
        });
        this.socket.on('newMsg',function(user,msg,color){
            oThis._showNewMsg(user,msg,color);
        });
        this.socket.on('allUsers',function(users){
            var container=document.getElementById('allUsers');
            container.innerHTML='';
            for(var x=0;x<users.length;x++){
                var oA=document.createElement('a');
                var oP=document.createElement('p');
                oA.innerHTML=users[x];
                oA.href='javascript:;';
                oP.appendChild(oA);
                container.appendChild(oP);
            }
        });
        document.getElementById('nameBtn').addEventListener('click', function () {
            var nickname = document.getElementById('nameInput').getElementsByTagName('input')[0].value;
            if (nickname.trim().length !== 0) {
                oThis.socket.emit('login', nickname);
            } else {
                document.getElementById('nameInput').getElementsByTagName('input')[0].focus();
            }
        }, false);
        document.getElementById('sendBtn').addEventListener('click',function(){
            var msg=document.getElementById('sendMsg').value,
            color=document.getElementById('conColor').value;
            if(msg.trim().length!==0){
                oThis._showNewMsg('me',msg,color);
                oThis.socket.emit('postMsg',msg,color);
            }
            document.getElementById('sendMsg').value='';
            document.getElementById('sendMsg').focus();
            return ;
        },false)
    },
    _showNewMsg:function(users,msg,color){
        var container=document.getElementById('chatMsg'),
            msgToShow=document.createElement('p'),
            date=(new Date).toTimeString().substr(0,8);
        msgToShow.style.color=color || '#000';
        msgToShow.innerHTML=users+'  <span class=timeSpan>'+date+':</span> '+msg;
        container.appendChild(msgToShow);
        container.scrollTop=container.scrollHeight;
    }
};