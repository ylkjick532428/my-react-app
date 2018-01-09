import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import logo from './logo.svg';
import Home from './Home';
import Login from './Login';
import Example from './Example';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import './App.css';


class App extends Component {
    renderNavLink(name, path, s) {
        return <td className="mui--appbar-height" style={s}>
            <li><Link to={path}>{name}</Link></li>
        </td>;
    }


    render() {
        let s1 = {verticalAlign: 'middle'};
        let s2 = {textAlign: 'right'};
        return (
            <Router>

                <div>

                    <h2>Welcome to React Router Tutorial</h2>
                    <table width="100%">
                        <tr style={s1}>
                            {this.renderNavLink("Home", "/", s1)};
                            {this.renderNavLink("Login", "/Login", s1)};
                            {this.renderNavLink("Example", "/Example", s1)};
                        </tr>

                    </table>
                    <Switch>
                        <Route exact path='/' component={Home}/>
                        <Route exact path='/Login' component={Login}/>
                        <Route exact path='/Example' component={Example}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

class Board extends React.Component {
    renderSquar(i) {
        return <Square value={i}/>;
    };

    render() {
        const status = 'Next player: X';
        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }


}

class Square extends React.Component {
    render() {
        return (
            <button className="square" onclick={() => alert('click')}>
                {this.props.value}
            </button>
        )
    }
}


export default App;
