import React, {Component} from 'react';

class ChatBar extends Component {

  render() {    

    const { currentUser } = this.props;

    return (
      <footer className="chatbar">
        
        <input className="chatbar-username" 
          placeholder="Your Name (Optional)"
          defaultValue={ this.props.currentUser }
          onInput={ this.props.changeUser } 
          />
        <input className="chatbar-message" 
          placeholder="Type a message and hit ENTER" 
          onKeyPress={ this.props.onInput } />
      </footer>

    );
  }
}
export default ChatBar;
