import React, {Component} from 'react';
import './App.css';
import formatSecondsAsTime from './Helpers'
import {CollectionItem} from "react-materialize";

class Bars extends Component{
    render(){
        return(
            <div id="bars" style={{marginTop: "35px", marginLeft: "-50px"}}>
                <div class="playing"></div>
                <div class="playing"></div>
                <div class="playing"></div>
            </div>
        );
    }
}

class Track extends Component{
    constructor(props, player){
        super(props);
        this.player = player;
        let track = props;
        this.id = track.id;
        this.artwork = track.artwork_url;
        if (track.release_day != null && track.release_month != null && track.release_year != null) {
            this.release = track.release_month + "/" + track.release_day + "/" + track.release_year;
        }
        this.genre = track.genre;
        this.title = track.title;
        this.duration = track.duration;
        this.src_url = track.permalink_url;
        this.description = track.description;
        this.state = {isPlaying: false};
    }
    componentDidMount() {
    }

    componentWillUnmount() {
    }
    play(){
        this.setState({
            isPlaying: true
        });
    }
    render(){
        let self = this;
        return(
            <CollectionItem id={'card'+this.id} className="avatar">
                {this.state.isPlaying ? <Bars/> : <a href={'#'+this.id} onClick={function(){self.player.changeSrc(self)}} className={this.id}><img className="no-select circle" src={this.artwork != null ? this.artwork : 'https://dummyimage.com/100x100/000/fff&text='+this.title}/></a> }
                <div className="content">
                    <div className="title truncate">
                        Title: {this.title}
                    </div>
                    {this.genre != null && <p>Genre: {this.genre}</p>}
                </div>
                <div className="secondary-content">
                    {this.duration != null && <span className="black-text">{formatSecondsAsTime(Math.floor(this.duration / 1000))}</span> }
                </div>
            </CollectionItem>
        );
    }
}

export default Track;