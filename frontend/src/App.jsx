import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import subBtn from "./assets/send-icon.svg";
import user from "./assets/icons8-user-64.png";
import bot from "./assets/chatgpt-icon.svg";
import loadingIcon from "./assets/load.svg";
import axios from "axios"

function App() {
  const [input, setInput] = useState("")
  const [posts, setPosts] = useState([])


  useEffect(() => {
    document.querySelector(".layout").scrollTop = document.querySelector(".layout").scrollHeight
  }, [posts])
  const fetchBotResponse = async () => {
    const {data} = await axios.post("https://chatgpt-clone-app-a4tv.onrender.com", {input: input}, {
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  }
  const onClickSubmit = () => {
    if(input.trim() === "") {
      return
    }
    updateMsg(input)
    updateMsg("loading...", false, true)
    setInput("")
    fetchBotResponse().then((res) => {
      console.log(res)
      updateMsg(res.bot.trim(), true)
    })
  }
  const autoTypingBotResponse = (text) => {
    let index = 0;
        let interval = setInterval(() => {
            if (index < text.length) {
                setPosts((prevState) => {
                    let lastItem = prevState.pop();
                    if (lastItem.type !== "bot") {
                        prevState.push({
                            type: "bot",
                            post: text.charAt(index - 1),
                        });
                    } else {
                        prevState.push({
                            type: "bot",
                            post: lastItem.post + text.charAt(index - 1),
                        });
                    }
                    return [...prevState];
                });
                index++;
            } else {
                clearInterval(interval);
            }
        }, 20);
  }
  const updateMsg = (msg, isBot, isLoading) => {
    if(isBot) {
      autoTypingBotResponse(msg)
    }else {
      setPosts((prevState) => {
        return [
          ...prevState,
          {type: isLoading ? "loading" : "user", post: msg}
        ]
      })
    }
    
  }
  
  const onKeyUp =(e) => {
    if(e.key === "Enter" || e.which === 13){
      onClickSubmit()
    }
  }
  return (
    <div className="App">
      <main className='main-chat-sec'>
        <div className="chat-container">
          <div className="layout">
            {posts.map((post, index) => (
              <div className={`chat-bubble ${post.type === "bot" || post.type === "loading" ? "bot" : ""}`} key={index}>
                <div className="avatar">
                  <img src={post.type === "bot" || post.type === "loading" ? bot : user} alt="" />
                </div>
                {post.type === "loading" ? (
                  <div className="loader">
                    <img src={loadingIcon} alt="" />
                  </div>
                  ) : (
                  <div className="post">{post.post}</div>
                  )}
             </div>
            ))}
          </div>
        </div>
        <footer>
          <input type="text" className='composebar' autoFocus={true} placeholder='Send a message...' onKeyUp={onKeyUp} onChange={(e) => setInput(e.target.value)} value={input} />
          <div className="send-button" onClick={onClickSubmit}>
            <img src={subBtn} alt="" />
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
