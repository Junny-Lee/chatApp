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

  // const yourMessage = {
  //   backgroundColor: "blue"
  // }
  // const othersMessage = {
  //   backgroundColor: "white"
  // }

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

  return (
    <div className="App">
      {
        !nameSet ?
        <div id="setUserName">
          <form onSubmit={submitUserName} id>
            <h1>Welcome to Fast Chat</h1><br></br>
            <input type="text" className="form-control" name="userName" onChange={e => setUserName(e.target.value)} value={userName} placeholder="Enter a Username"/><br></br>
            <input type="submit" className="btn btn-outline-dark" value="Set Username" />
          </form>
        </div>
        :
        !roomJoined ?
        <div id="joinRoom">
          <form onSubmit={joinRoom}>
            <h1>Join a Room</h1><br></br>
            <input type="text" className="form-control" name="chatRoom" onChange={e => setChatRoom(e.target.value)} value={chatRoom} placeholder="Enter Room Name"/><br></br>
            <input type="submit" className="btn btn-outline-dark" value="Join" />
          </form>
        </div>
        :
        <div>
          <button type="button" className="btn btn-sm btn-warning" onClick={(e)=>handleDeleteChatHistory(e)}>Clear Chat Room</button>
          <div id="sendMessage">
            <form onSubmit={submitMessage}>
              <h1>{chatRoom}</h1><br></br>
              <div className="input-group mb-3">
                <input type="text" className="form-control" name="message" onChange={e => setMessage(e.target.value) } value={message} placeholder="Message"/><br></br>
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
                          <p id="yourMessage">
                            You: { message.message}
                          </p> : 
                          <p id="theirMessage">
                            { message.userName } : { message.message}
                          </p> 
                        }
                      </p>
                      // {
                      //   message.userName == userName ?
                      //   <p key={i} id="message" >
                      //     You: { message.message}
                      //   </p> :
                      //   <p key={i} id="message">
                      //     { message.userName } : { message.message}
                      //   </p> 
                      // }

                      // <p key={i} id="message">
                      //   {
                      //     message.userName == userName ?
                      //     "You" : 
                      //     message.userName
                      //   } : { message.message}
                      // </p>

                      // <p key={i} id="message">
                      //   {
                      //     message.userName == userName ?
                      //     "You" : 
                      //     message.userName
                      //   } : { message.message}
                      // </p>
                    ) 
                  }
                  <div class="left-point"></div>
                  {/* {
                    chatLog.map((message, i) => <p key={i}>{message.userName}: {message.message}</p>)
                  } */}
                <div id="scrollPoint">...</div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* <div id="messages">
        {
          chatLog.map((message, i) => <p key={i}>{message.userName}: {message.message}</p>)
        }
      </div> */}
    </div>
  );
}

export default App;