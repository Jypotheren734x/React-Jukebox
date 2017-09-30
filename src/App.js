import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {Col, Icon, Navbar, NavItem, Row} from "react-materialize";
import Player from "./Player";
import Playlist from './Playlist';
import * as ReactDOM from "react-dom";

var SC = require('soundcloud');

class Jukebox extends Component {
    constructor(props){
        super(props);
        SC.initialize({
            client_id: 'DoPASlLzDUFjxJHRDESP267TmnAjyrza'
        });
        this.search_bar = <input onKeyUp={(e)=>this.search(e)} type="text" placeholder="Search by artist, title, genre, etc." className="black-text"/>;
        this.searching = false;
    }

    search(e){
        if(e.which === 13) {
            let self = this;
            self.searching = true;
            let value = e.target.value;
            SC.get(`/tracks`, {q: value, limit: 200}).then(function (tracks) {
                ReactDOM.render(<Playlist tracks={tracks} title={'Search for ' + value} player={self.player}/>, document.getElementById('tracks'));
            });
        }
    }
    render() {
        const tracksStyle = {
            marginTop: "50px",
            marginBottom: "100px"
        };
        return (
            <div className="App">
                <header className="App-header">
                    <Navbar className="white" fixed={true}>
                        <Row>
                            <Col s={5}>
                                <NavItem><img src={logo} className="App-logo" alt="logo"/></NavItem>
                                <NavItem><h4 className="black-text">Jukebox</h4></NavItem>
                            </Col>
                            <Col s={7}>
                                <Row>
                                    <Col s={1}>
                                    <Icon className="black-text" s={1}>search</Icon>
                                    </Col>
                                    <Col s={11}>
                                        {this.search_bar}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Navbar>
                </header>
                <main>
                    <div className="container" id="tracks" style={tracksStyle}>
                    </div>
                </main>
                <footer>
                    <Player jukebox={this} ref={instance => { this.player = instance; }}/>;
                </footer>
            </div>
        );
    }
}

export default Jukebox;
