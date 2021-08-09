import React, { useState, useEffect } from "react";
import "./Home.css";
import Contact from "./Contact";
import Chat from "./Chat";
import BasePage from "./BasePage";
import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import { DonutLarge, MoreVert, Add } from "@material-ui/icons";
import NewChat from "./NewChat";
import { db } from "../services/firebase";

const getUserDetails = () => {
  // Get data from session variable
  // console.log("Fetching from session");
  return [
    sessionStorage.getItem("username"),
    sessionStorage.getItem("userId"),
    sessionStorage.getItem("email"),
  ];
};
function Home() {
  const [currentUsername, currentUserID, currentUserEmail] = getUserDetails();
  const [friendsList, setFriendsList] = useState([]);
  const [chatHistory, setChatHistory] = useState(null);
  const [newChatRequested, setNewChat] = useState(false);
  useEffect(() => {
    // Fetch data from db
    async function fetchContacts() {
      const chatsRef = db
        .collection("usersChat")
        .doc(currentUserID)
        .collection("chats");
      chatsRef.onSnapshot((snapshot) => {
        const personsList = snapshot.docs.map((doc) => {
          const data = {
            id: doc.id,
            name: doc.data().name,
          };
          console.log(data);
          return data;
        });
        // console.log(personsList);
        setFriendsList(personsList);
      });
    }
    // fetchContacts();
  }, []);
  const getChatHistory = (friend) => {
    // console.log("Fetching chat history of", friend);
    const data = { friendName: friend.name, friendUID: friend.id };
    setChatHistory(data);
  };
  const toggleNewChat = () => {
    setNewChat(!newChatRequested);
  };
  const createNewChatRoom = async (email) => {
    if (email === currentUserEmail) {
      alert("You entered your own email!");
      return;
    }
    try {
      const newPersonObj = await db.collection("users").doc(email).get();
      if (!newPersonObj.exists) {
        alert("No such user exists!");
        return;
      }
      const { name, lastSeen } = newPersonObj.data();
      db.collection("chats").add({ name });
      // db.collection("chats")
      //   .doc(currentUserID)
      //   .collection("chats")
      //   .doc(UID)
      //   .set({ name });
      // getChatHistory({ UID, name });
      toggleNewChat();
    } catch (err) {
      console.log(err);
      alert("Encountered an issue! Try again");
    }
  };
  return (
    <div className="home">
      <div className="home__left">
        <div className="home__left__userbio">
          <Avatar
            className="home__left__avatar"
            src={`https://avatars.dicebear.com/api/initials/${currentUsername}.svg?background=%230000ff`}
          />
          <p className="home__left__avatar__username">{currentUsername}</p>
          <div className="home__left__userbio__shortCuts">
            <div className="storyIcon">
              <Tooltip title="Displays Status">
                <IconButton aria-label="storyIcon">
                  <DonutLarge color="action" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="newChatIcon">
              <Tooltip title="Add New Chat">
                <IconButton aria-label="newChatIcon" onClick={toggleNewChat}>
                  <Add color="action" className="newChatIcon" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="userInfoIcon">
              <Tooltip title="Get Your Info">
                <IconButton aria-label="userInfoIcon">
                  <MoreVert color="action" className="userInfoIcon" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="home__left__chats">
          {friendsList.map((friend) => (
            <Contact
              key={friend.id}
              username={friend.name}
              onClick={() => getChatHistory(friend)}
            />
          ))}
        </div>
      </div>
      {newChatRequested && (
        <NewChat
          onClick={(e) => createNewChatRoom(e)}
          onClose={toggleNewChat}
        />
      )}
      <div className="home__right">
        {chatHistory ? (
          <Chat friendInfo={chatHistory} currentUserID={currentUserID} />
        ) : (
          <BasePage username={currentUsername} />
        )}
      </div>
    </div>
  );
}
export default Home;
