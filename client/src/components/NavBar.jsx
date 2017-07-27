import React, {Component} from 'react';

class NavBar extends Component {
  render() {
    console.log("<NavBar />");

    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatty</a>
        <span className='onlineUsers'>{ this.props.users }</span>
      </nav>
    );
  }
}
export default NavBar;
