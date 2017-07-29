
import React, { Component } from 'react';

class Message extends Component {

  parseType() {
    let styles = {
      color: this.props.color
    }

    switch(this.props.type)  {
      case 'incomingMessage':
        return (
        <div className='message'>
          <span className='message-username' style={ styles }>{ this.props.username }</span>
          <span className='message-content'>{ this.props.content }</span>
          </div>
        )
        break; 
      case 'incomingNotification':
        return (
          <div className='message system'>
            { this.props.content }
          </div>
        )
        break;
      case 'incomingImage':
        return (
          <div>
            <span className='message-username' style={ styles }>{ this.props.username }</span>
            <span><img src={this.props.content} /></span>
          </div>
        )
        break;
    }
  }
  
  render() {
  
    return (
      <div className='messages'>
        {this.parseType()}
      </div>
    )
  }
}

export default Message;
