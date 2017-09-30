import React, {Component} from 'react';
import './App.css';
import formatSecondsAsTime from './Helpers'
import {Button, Card, Col, Icon, Row} from "react-materialize";

var SC = require('soundcloud');

class DurationIndicator extends Component{
    constructor(props){
        super(props);
        this.player = props.player;
        this.state = {
            duration: formatSecondsAsTime(0),
            total: formatSecondsAsTime(0)
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.timeUpdate(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    timeUpdate() {
        let self = this;
        if(self.player.audio !== undefined) {
            this.setState({
                duration: formatSecondsAsTime(Math.floor(self.player.audio.currentTime() / 1000))
            });
        }
        if(self.player.current_track !== undefined){
            this.setState({
                total: formatSecondsAsTime(Math.floor(self.player.current_track.duration / 1000))
            })
        }
    }
    render(){
        return(
            <span className="right">{this.state.duration}/{this.state.total}</span>
        );
    }
}
class Indicator extends Component{
    constructor(props){
        super(props);
        this.player = props.player;
        this.state = {duration: 0, max:0};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.timeUpdate(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    timeUpdate() {
        let self = this;
        if(self.player.audio !== undefined) {
            this.setState({
                duration: self.player.audio.currentTime(),
                max: self.player.current_track.duration
            });
        }
    }

    render(){
        return(
            <div id="indicator">
                <input type="range" value={this.state.duration} step={0.00000000001} max={this.state.max} />
            </div>
        );
    }
}
class Player extends Component {
    constructor(props) {
        super(props);
        this.jukebox = props.jukebox;
        this.queue = [];
        this.state = {
            volume: 50,
            muted: false,
            paused: true,
            shuffle: false,
            repeat: 0
        };
        let self = this;
        this.current_track = undefined;
        this.audio = undefined;
        this.indicator = <Indicator player={self}/>;
        this.duration_indicator = <DurationIndicator player={self}/>;
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    shuffleQueue() {
        let shuffle = !this.state.shuffle;
        this.setState({
            shuffle: shuffle
        });
        console.log(this.state.shuffle);
        if(this.state.shuffle) {
            this.queue.shuffle();
            if (this.current_track != undefined) {
                this.queue.swap(0, this.queue.findWithAttr("id", this.current_track.id));
            }
        }
    }
    previous() {
        if (this.queue.length > 0) {
            if (this.state.repeat < 2) {
                this.track_number--;
            } else {
                this.audio.seek(0);
            }
            if (this.track_number < 0) {
                if (this.state.repeat == 1) {
                    this.track_number = this.queue.length - 1;
                    this.changeSrc(this.queue[this.track_number]);
                } else {
                    this.audio.seek(0);
                }
            } else {
                this.changeSrc(this.queue[this.track_number]);
            }
        }
    }
    play() {
        let self = this;
        if (this.audio !== undefined) {
            if (this.state.paused) {
                this.audio.play();
                this.paused = false;
                this.setState({
                    paused: false
                });
                if(this.current_track != undefined){
                    this.current_track.play();
                }
            }
            else {
                this.audio.pause();
                this.paused = true;
                this.setState({
                    paused: true
                });
                if(this.current_track != undefined){
                    this.current_track.pause();
                }
            }
        } else {
            this.changeSrc(this.queue[0]);
        }
    }
    next() {
        if (this.queue.length > 0) {
            if (this.state.repeat < 2) {
                this.track_number++;
            } else {
                this.state.paused = true;
                this.play();
            }
            if (this.track_number >= this.queue.length) {
                if (this.shuffle) {
                    this.queue.shuffle();
                    if (this.repeat === 1) {
                        this.track_number = 0;
                        this.changeSrc(this.queue[this.track_number]);
                    } else {
                        this.stop();
                    }
                } else {
                    if (this.repeat === 1) {
                        this.track_number = 0;
                        this.changeSrc(this.queue[this.track_number]);
                    } else {
                        this.stop();
                    }
                }
            } else {
                this.changeSrc(this.queue[this.track_number]);
            }
        }
    }
    emptyQueue() {
        this.queue = [];
    }
    addToQueue(track) {
        if (!this.queue.includes(track)) {
            this.queue.push(track);
        }
    }
    setQueue(playlist) {
        this.emptyQueue();
        this.queue = playlist;
    }
    stop() {
        let self = this;
        this.audio.seek(0);
        this.play();
    }
    changeSrc(src) {
        if (this.audio !== undefined) {
            this.stop();
        }
        if(this.current_track != undefined){
            this.current_track.stop();
        }
        this.paused = true;
        let self = this;
        this.current_track = src;
        this.track_number = this.queue.indexOf(this.current_track);
        SC.stream(`/tracks/` + src.id).then(function (player) {
            self.audio = player;
            self.audio.on('finish', function () {
                self.next();
            });
            self.play();
        });
    }
    render() {
        let self = this;
        return (
            <Row>
                <Col s={12}>
                    <Card id="controls" className="pinned pin-bottom z-depth-5">
                        {self.indicator}
                        <Row>
                            <Col s={11}>
                                <Row>
                                    <Button id="queuebtn" className="transparent black-text z-depth-0"><Icon>queue_music</Icon></Button>
                                    <Button id="previousbtn" onClick={function(){self.previous();}} className="transparent black-text z-depth-0"><Icon>skip_previous</Icon></Button>
                                    <Button className="transparent black-text z-depth-0" onClick={function () {self.play();}}><i id={"playbtn"} className="material-icons" >{this.state.paused ? 'play_arrow' : 'pause'}</i></Button>
                                    <Button id="nextbtn" onClick={function(){self.next();}} className="transparent black-text z-depth-0"><Icon>skip_next</Icon></Button>
                                    <Button id="shufflebtn" onClick={function () {self.shuffleQueue()}} className={this.state.shuffle ? "transparent black-text z-depth-0 cyan-text" : "transparent black-text z-depth-0"}><Icon>shuffle</Icon></Button>
                                    <Button id="repeatbtn" className="transparent black-text z-depth-0"><Icon>repeat</Icon></Button>
                                    <Button id="volbtn" className="transparent black-text z-depth-0"><Icon>volume_up</Icon></Button>
                                    <Icon><input id="vol-control" type="range"/></Icon>
                                </Row>
                            </Col>
                            <Col s={1}>
                                {self.duration_indicator}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default Player;