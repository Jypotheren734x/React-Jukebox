import React, {Component} from 'react';
import formatSecondsAsTime from './Helpers'
import './App.css';
import {Collection} from "react-materialize";

class Playlist extends Component{
    constructor(props){
        super(props);
        this.tracks = props.tracks;
    }

    totalTime() {
        let time = 0;
        this.tracks.forEach(function (track) {
            time += track.props.track.duration;
        });
        return time;
    }
    render(){
        return(
            <div>
                <h1>{this.props.title} {formatSecondsAsTime(Math.floor(this.totalTime() / 1000))}</h1>
                <hr/>
                <Collection z-depth={0}>
                    {this.tracks}
                </Collection>
            </div>
        );
    }
}

export default Playlist;