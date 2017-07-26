import React, {Component} from 'react';
import ChatBar from './components/ChatBar.jsx';
import MessageList from './components/MessageList.jsx';

class App extends Component {
    
  constructor() {
    super();
    this.socket;

    this.state = {
      currentUser: {name: 'Bob'}, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [
        {
          id: 1,
          username: 'Bob',
          content: 'Has anyone seen my marbles?',
        },
        {
          id: 2,
          username: 'Anonymous',
          content: 'No, I think you lost them. You lost your marbles Bob. You lost them for good.'
        },
        {
          id: 3,
          username: 'Bob',
          content: 'Oh wait, I put them in your food yesterday.'
        }
      ], 
    }
    this.onInput = this.onInput.bind(this);
    
  }

  onInput(event) {
    if (event.key === 'Enter') {
      const message = {
        id: Math.random(),
        username: this.state.currentUser.name,
        content: event.target.value
      }
      let messages = this.state.messages.concat(message);
      this.setState({ messages });
      event.target.value = '';
    }  
  }

  componentDidMount() {
    this.socket = new WebSocket('ws://0.0.0.0:3001/');
    this.socket.onopen = (() => {
      console.log('Connected to server');
    })
  }
  
    

  render() {

    console.log("<App />");
    return (
      <div>

        <MessageList messages={ this.state.messages } />

        <ChatBar currentUser={ this.state.currentUser } onInput={ this.onInput } />
        
      </div>
      
    );
  }
}
export default App;
