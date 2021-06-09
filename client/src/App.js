import './App.scss';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';

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

  const updateScroll = () => {
    var element = document.getElementById("chatBox");
    element.scrollTop = element.scrollHeight;
  }

  const handleHome = e => {
    window.location.reload();
  }

  return (
    <div className="App">
      {
        !nameSet ?
        <div id="setUserName">
          <form onSubmit={submitUserName} id>
            <h1>Welcome to FastChat</h1><br></br>
            <input type="text" className="form-control" name="userName" onChange={e => setUserName(e.target.value)} value={userName} placeholder="Enter a Username"/><br></br>
            <input type="submit" className="btn btn-outline-dark" value="Set Username" />
          </form>
        </div>
        :
        !roomJoined ?
        <div>
          <div id="navbar1">
            <button type="button" className="btn btn-link" onClick={(e)=>handleHome(e)}>Back</button>
          </div>
          <div id="joinRoom">
            <form onSubmit={joinRoom}>
              <h1>Join a Room</h1><br></br>
              <input type="text" className="form-control" name="chatRoom" onChange={e => setChatRoom(e.target.value)} value={chatRoom} placeholder="Enter Room Name"/><br></br>
              <input type="submit" className="btn btn-outline-dark" value="Join" />
            </form>
          </div>
        </div>
        :
        <div>
          <div id="navbar2">
            <button type="button" className="btn btn-link" onClick={(e)=>handleDeleteChatHistory(e)}>Clear Chat Room</button>
            <button type="button" className="btn btn-link" onClick={(e)=>handleHome(e)}>Home</button>
          </div>
          <div id="sendMessage">
            <form onSubmit={submitMessage}>
              <h1>Room: {chatRoom}</h1><br></br>
              <div className="input-group mb-3">
                <input type="text" className="form-control" name="message" onChange={e => setMessage(e.target.value) } value={message} placeholder="Write a message..."/><br></br>
                <div className="input-group-append">
                  <input type="submit"className="btn btn-outline-dark" value="Send" onClick={updateScroll}/>
                </div>
              </div>
            </form>
            <div id="chatBox">
              <div id="messages">
                  {
                    chatLog.map((message, i) => 
                      <p key={i} id="message">
                        {
                          message.userName == userName ?
                          <p>
                            <p id="you"> { message.userName } (you) </p>
                            <p id="yourMessage">
                              { message.message }
                            </p>
                          </p> :
                          <p>
                            <p id="them">{ message.userName } </p>
                            <p id="theirMessage">
                              { message.message }
                            </p> 
                          </p>
                        }
                      </p>
                    ) 
                  }
                <div id="scrollPoint">...</div>
                <div id="scrollPoint">...</div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default App;