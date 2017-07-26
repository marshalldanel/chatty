import React, {Component} from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
  render() {
    console.log("<MessageList />");

    const messages = this.props.messages.map(message => {
      return <Message 
        key={ message.id }
        username={ message.username }
        content={ message.content}
        />
    });

    return (
      <div className="messages">
        
        { messages }

      </div>
    );
  }
}
export default MessageList;

