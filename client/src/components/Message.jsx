import React, { Component } from 'react';

class Message extends Component {

  render() {
  let styles = {
    color: this.props.color
  }
    console.log('message: ', styles);
    console.log("<Message />");
    if (this.props.type === 'incomingMessage') {
      return (
        <div className='messages'>
          <div className='message'>
              <span className="message-username" style={ styles }>{ this.props.username }</span>
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