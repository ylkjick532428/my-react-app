import React from 'react';
import $ from 'jquery';
import Appbar from 'muicss/lib/react/appbar';
import nextRTC from 'nextrtc-js-client';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import jwt from 'jsonwebtoken';

class MyWebRTC extends React.Component {
    constructor(){
        super();
        this.init();
    };

    createNextRTC = () =>{
        var wsURL =  'wss://'+ window.location.hostname+'/socket/signaling';
        console.log(wsURL);

        var tmpNextRTC = new nextRTC.NextRTC({
            wsURL : wsURL,
            wsArgs: {access_token:""},
            mediaConfig : {
                video : true,
                audio : false,
            },
            peerConfig : {
                iceServers: [
                    {urls: "turn:192.168.1.105:3478", credential: "world", username: "hello"}
                    // {urls: "stun:23.21.150.121"},
                    // {urls: "stun:stun.l.google.com:19302"},
                    // {urls: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis@mozilla.com"}
                ],
                iceTransportPolicy:'all',
                rtcpMuxPolicy:'negotiate'
            }
        });
        return tmpNextRTC;
    };

    getToken = () => {
        var token = jwt.sign({grant_type:"password",
        username:"john.doe",
        password:"jwtpass"}, 'testjwtclientid:XY7kmzoNzl100');
        return token;
    };

    init = () => {
        this.token = this.getToken();
        if (this.tmpNextRTC !== undefined){
            return;
        }
        var tmpNextRTC = this.createNextRTC();

        tmpNextRTC.on('created', function(tmpNextRTC, event) {
            console.log(JSON.stringify(event));
            console.log(tmpNextRTC.localStream);
            window.Video = document.querySelector('video');
            window.stream = tmpNextRTC.localStream; // make variable available to browser console
            window.Video.srcObject = tmpNextRTC.localStream;
            $('#log').append('<li>房间已经创建 id:  ' + event.content + ' </li>');
        });

        tmpNextRTC.on('joined', function(tmpNextRTC, event) {
            console.log(JSON.stringify(event));
            $('#log').append('<li>你已经加入视频会话 ' + event.content + '</li>');
        });

        tmpNextRTC.on('newJoined', function(tmpNextRTC, event) {
            console.log(JSON.stringify(event));

            $('#log').append('<li>会话加入新用户id:  ' + event.from + '</li>');
        });

        tmpNextRTC.on('localStream', function(member, stream) {
            var dest = $("#template").clone().prop({ id: 'local'});
            $("#container").append(dest);
            dest[0].srcObject = stream.stream;
            dest[0].muted = true;
        });

        tmpNextRTC.on('remoteStream', function(member, stream) {
            var dest = $("#template").clone().prop({ id: stream.member});
            $("#container").append(dest);
            dest[0].srcObject = stream.stream;
        });

        tmpNextRTC.on('left', function(tmpNextRTC, event) {
            tmpNextRTC.release(event.from);
            console.log(JSON.stringify(event));
            $('#' + event.from).remove();
            $('#log').append('<li>' + event.from + " 离开!</li>");
        });

        tmpNextRTC.on('error', function(tmpNextRTC, event) {
            console.log(JSON.stringify(event));
            $('#log').append('<li>很不幸, 系统出现问题,请稍后! '+ event.content +'</li>')
        });
        this.tmpNextRTC = tmpNextRTC;

    };
    uuidv4 =() =>{
        return "jick";
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    createConversation =() =>{
        var convId = this.uuidv4();
        $('#convId').val(convId);
        this.tmpNextRTC.create(convId);
    };



    createBroadcastConversation = () =>{
        var convId = this.uuidv4();
        $('#convId').val(convId);
        this.tmpNextRTC.create(convId, {type : 'BROADCAST'});
    };

    joinConversation = () =>{
        var convId = $('#convId').val();

        this.tmpNextRTC.join(convId);
    };

    leaveConversation = () =>{
        $('#container').empty();
        this.tmpNextRTC.leave();
    };

    render (){
        return (<div><div>
            房间 id:<input id="convId" type="text" value="jick"/>
            <Button onClick={this.createConversation}>创建视频</Button>
            <Button onClick={this.createBroadcastConversation}>创建广播</Button>
            <Button onClick={this.joinConversation}>加入</Button>
            <Button onClick={this.leaveConversation}>离开</Button>
        </div>
            <div>
                <ul id="log">

                </ul>
            </div>
            <div>
                <video id="template" width="320" height="240" autoPlay playsInline></video>
            </div>
            </div>) ;
    };
}


export default MyWebRTC;
