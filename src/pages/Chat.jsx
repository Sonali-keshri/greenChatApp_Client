import React,{useEffect, useState, useRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host } from '../utils/APIRoutes';
import Contact from '../components/Contact';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {io} from 'socket.io-client';

const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts , setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [open, setOpen] = useState(false);
  

  useEffect( ()=>{
    async function fetchData(){
    if(!localStorage.getItem('chat-app-user')){
      navigate('/login')
    }
    else{
      setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')))
      setIsLoaded(true);
      // console.log(currentUser)
    }
  }
  fetchData();
  },[])

  useEffect(()=>{
    if(currentUser){
      socket.current= io(host);
      socket.current.emit('add-user', currentUser._id);
    }
  },[currentUser])

  useEffect( ()=>{
    async function fetchData(){
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          setContacts(data.data)
        }else{
          navigate('/setAvatar')
        }
      }
  }
  fetchData();
},[currentUser])

const handleChatChange = (chat) =>{
  setCurrentChat(chat);
}

  return (
    <Container>
      <div className="container">
        <Contact contacts={contacts} currentUser={currentUser} changeChat={handleChatChange}  setContacts={setContacts} className="contactpage"/>
        {
          isLoaded && currentChat === undefined ? 
         ( <Welcome currentUser={currentUser} className="welcomepage" />):
         ( <ChatContainer currentChat={currentChat} currentUser={currentUser}  socket={socket} className="chatpage"/>)
        }
      </div>
    </Container>
  )
}

const Container = styled.div`
  height:100vh;
  width:100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  // background-color: #131324;
  // background-color: #1C6758;
  background-color: #fff;

  .container {
    width: 85%;
    height: 85%;
    // background-color: #00000076;
    background-color: #152D35;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (max-width:1007px){
      grid-template-columns: 35% 65%;
    }
    @media screen and (max-width:640px){
      width:100%;
      height:100%;
      grid-template-columns: 100% 0%;
    }
  }


`

export default Chat;

