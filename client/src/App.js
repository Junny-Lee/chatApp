import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { navigate } from '@reach/router';

function App() {
  const [socket] = useState(() => io(':8000'));
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [chatRoom, setChatRoom] = useState('');
  const [roomJoined, setRoomJoined] = useState(false);
  const [userName, setUserName] = useState('');
  const [nameSet, setNameSet] = useState(false);

  useEffect(() => {

    return () => socket.disconnect(true);
  }, []);

  socket.on('messageReceived', data => {
    setChatLog(data.messageLog)
  })

  socket.on('roomJoined', data => {
    setChatLog(data.messageLog)
  })

  const joinRoom = e => {
    e.preventDefault();
    socket.emit('joinRoom', chatRoom);
    setRoomJoined(true);
  }

  const submitUserName = e => {
    e.preventDefault();
    setNameSet(true);
  }

  const submitMessage = e => {
    e.preventDefault();

    socket.emit('sendMessage', {chatRoom, userName, message});
    setMessage('');
  }

  const handleDeleteChatHistory = e => {
    socket.emit('deleteChatHistory', {chatRoom, userName, message});
    // window.location.reload();
  }


  return (
    <div className="App">
      {
        !nameSet ?
        <div id="setUserName">
          <form onSubmit={submitUserName}>
            <label htmlFor="userName">Enter a Username: </label>
            <input type="text" name="userName" onChange={e => setUserName(e.target.value)} value={userName}/>
            <input type="submit" value="Set Username" />
          </form>
        </div>
        :
        !roomJoined ?
        <div id="joinRoom">
          <form onSubmit={joinRoom}>
            <label htmlFor="chatRoom">Enter a Chat Room: </label>
            <input type="text" name="chatRoom" onChange={e => setChatRoom(e.target.value)} value={chatRoom}/>
            <input type="submit" value="Join" />
          </form>
        </div>
        :
        <div id="sendMessage">
          <button type="button" className="btn btn-lg btn-warning" onClick={(e)=>handleDeleteChatHistory(e)}>Clear Chat Room</button>
          <form onSubmit={submitMessage}>
            <label htmlFor="message">Message: </label>
            <input type="text" name="message" onChange={e => setMessage(e.target.value) } value={message}/>
            <input type="submit" value="Send" />
          </form>
        </div>
      }

      {
        chatLog.map((message, i) => <p key={i}>{message.userName}: {message.message}</p>)
      }
    </div>
  );
}

export default App;