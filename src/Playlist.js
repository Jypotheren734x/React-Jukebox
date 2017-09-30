import React, {Component} from 'react';
import formatSecondsAsTime from './Helpers'
import './App.css';
import {Collection} from "react-materialize";
import Track from "./Track";

class Playlist extends Component{
    constructor(props){
        super(props);
        this.player = props.player;
        this.tracks = [];
        this.track_components = [];
        this.state = {total_time: 0};
        let self = this;
        props.tracks.forEach(function (track) {
            let current = <Track track={track} player={self.player} ref={instance => {
                self.tracks.push(instance);
                self.setState((state) => {
                    return {total_time: state.total_time + instance.duration};
                });
            }
            } />;
            self.track_components.push(current);
        });
    }
    render(){
        this.player.setQueue(this.tracks);
        return(
            <div>
                <h1>{this.props.title} {formatSecondsAsTime(Math.floor(this.state.total_time / 1000))}</h1>
                <hr/>
                <Collection z-depth={0}>
                    {this.track_components}
                </Collection>
            </div>
        );
    }
}

export default Playlist;