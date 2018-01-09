import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from 'muicss/lib/react/button';


window.constraints = {
    audio: false,
    video: true
};

window.Video = document.querySelector('video');
class Video extends React.Component {
    constructor () {
        super();
        this.handleError = this.handleError.bind(this);
    }
    errorMsg = (msg, error) =>{

        if (typeof error !== 'undefined') {
            console.error(error);
        }
    }

    handleSuccess(stream) {
        var videoTracks = stream.getVideoTracks();
        console.log('Got stream with constraints:', window.constraints);
        console.log('Using video device: ' + videoTracks[0].label);
        stream.oninactive = function() {
            console.log('Stream inactive');
        };
        window.stream = stream; // make variable available to browser console
        window.Video.srcObject = stream;
    }
    handleError = (error) => {
        console.log(error);
        if (error.name === 'ConstraintNotSatisfiedError') {
            this.errorMsg('The resolution ' + this.constraints.video.width.exact + 'x' +
                this.constraints.video.width.exact + ' px is not supported by your device.');
        } else if (error.name === 'PermissionDeniedError') {
            this.errorMsg('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        this.errorMsg('getUserMedia error: ' + error.name, error);
    }

    openVedio(){
        navigator.mediaDevices.getUserMedia(window.constraints).
        then(this.handleSuccess).catch(this.handleError);
    }
    render (){
        return (<Button onClick={this.openVedio(this)}>打开视频</Button>) ;
    }

}

export default Video;