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
      users: ''
    }
    this.onInput = this.onInput.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  onInput(event) {
    if (event.key === 'Enter') {
      const message = {
        username: this.state.currentUser.name,
        content: event.target.value,
        type: 'postMessage'
      }
      this.socket.send(JSON.stringify(message))
      event.target.value = '';
    }
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://0.0.0.0:3001/');
    this.socket.onopen = (() => {
      console.log('Connected to server');
    })

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(event.data);
      console.log('message: ', message);
      console.log('type: ', typeof message.type);
      switch(message.type) {
      case 'incomingMessage':
        console.log('message type:', message.type);
        let newMessage = this.state.messages.concat(message);
        console.log(newMessage);
        this.setState({ messages: newMessage });
        break;
      case 'incomingNotification':
        let newNotification = this.state.messages.concat(message);
        this.setState({ messages: newNotification });
        break;
      case 'usersInRoom':
        let usersOnline = message.content;
        this.setState({ users: usersOnline })
        break;
      default:
        throw new Error('Unknown event type ' + message.type);
      }
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

  render() {

    console.log("<App />");
    return (
      <div>

        <NavBar users={ this.state.users } />
        
        <MessageList messages={ this.state.messages } />

        <ChatBar currentUser={ this.state.currentUser.name } onInput={ this.onInput } changeUser={ this.changeUser}/>
        
      </div>
      
    );
  }
}
export default App;