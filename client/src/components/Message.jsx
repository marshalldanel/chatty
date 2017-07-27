import React, { Component } from 'react';

class Message extends Component {
  
  render() {
    console.log("<Message />");
    if (this.props.type === 'incomingMessage') {
      return (
        <div className='messages'>
          <div className='message'>
              <span className="message-username">{ this.props.username }</span>
              <span className="message-content">{ this.props.content }</span>
            </div>
          </div>
      )} else {
      return (
        <div className="message system">
          { this.props.content }
        </div>
    )}
  }
}
export default Message;