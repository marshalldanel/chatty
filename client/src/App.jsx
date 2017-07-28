
import React, {Component} from 'react';
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';
import NavBar from './components/NavBar.jsx';

class App extends Component {
    
  constructor(props) {
    super(props);
    this.socket;
    this.state = {
      currentUser: {name: 'Anonymous' }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      usersOnline: '',
      userColor: ''
    }
    this.onMessage = this.onMessage.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  onMessage(event) {
    if (event.key === 'Enter') {
      const message = {
        username: this.state.currentUser.name,
        content: event.target.value,
        type: 'postMessage',
        userColor: this.state.userColor
      }
      this.socket.send(JSON.stringify(message))
      event.target.value = '';
    }
  }

  changeUser(event) {
    if (event.key === 'Enter') {
      const user = {
        content: `${this.state.currentUser.name} has changed their name to ${event.target.value}`,
        type: 'postNotification'
      }
      this.socket.send(JSON.stringify(user))
      this.setState({
        currentUser: { name: event.target.value }
      });
    }
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://0.0.0.0:3001/');

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      let newState;
      switch(message.type) {
      case 'incomingMessage':
        newState = { messages: this.state.messages.concat(message) }
        break;
      case 'incomingNotification':
        newState = { messages: this.state.messages.concat(message) }
        break;
      case 'usersInRoom':
        newState = { usersOnline: message.content }
        break;
      case 'userColor':
        newState = { userColor: message.color }
        break;
      default:
        throw new Error('Unknown event type ' + message.type);
      }
      this.setState(newState);
      window.scrollTo(0, document.body.scrollHeight);
    }
  }

  render() {
    return (
      <div>

        <NavBar usersOnline={ this.state.usersOnline } />
        
        <MessageList messages={ this.state.messages } userColor={ this.state.userColor } />

        <ChatBar currentUser={ this.state.currentUser.name } onMessage={ this.onMessage } changeUser={ this.changeUser } />
        
      </div>
    );
  }
}
export default App;