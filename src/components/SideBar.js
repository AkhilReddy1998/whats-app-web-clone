import React, { useState } from "react";
import { Avatar, IconButton, Tooltip } from "@material-ui/core";
import { DonutLarge, MoreVert, Add } from "@material-ui/icons";
import Popover from "@material-ui/core/Popover";
import Contact from "./Contact";
import "./styles/Sidebar.css";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

const handleLogout = (history) => {
  sessionStorage.clear();
  history.push("/");
};
function SideBar({
  userAvatar,
  currentUsername,
  friendsList,
  createNewChat,
  showChathistory,
}) {
  const classes = useStyles();
  const [userInfoPopup, setUserInfoPopup] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(null);
  const [userSearchText, setUserSearchText] = useState("");
  const history = useHistory();
  return (
    <div className="sidebar">
      <div className="sidebar__userbio">
        <Avatar className="sidebar__avatar" src={userAvatar} />
        <p className="sidebar__avatar__username">{currentUsername}</p>
        <div className="sidebar__userbio__shortCuts">
          <div className="storyIcon">
            <Tooltip title="Displays Status">
              <IconButton aria-label="storyIcon">
                <DonutLarge color="action" />
              </IconButton>
            </Tooltip>
          </div>
          <div className="newChatIcon">
            <Tooltip title="Add New Chat">
              <IconButton aria-label="newChatIcon" onClick={createNewChat}>
                <Add color="action" className="newChatIcon" />
              </IconButton>
            </Tooltip>
          </div>
          <div className="userInfoIcon">
            <Tooltip title="Get Your Info">
              <IconButton
                aria-label="userInfoIcon"
                onClick={(e) => setShowShortcuts(e.currentTarget)}
              >
                <MoreVert color="action" className="userInfoIcon" />
              </IconButton>
            </Tooltip>
          </div>
          <Popover
            open={Boolean(showShortcuts)}
            id={Boolean(showShortcuts) ? "simple-popover" : undefined}
            anchorEl={showShortcuts}
            onClose={() => setShowShortcuts(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <List component="nav" aria-label="secondary mailbox folders">
              <ListItem button>
                <ListItemText
                  primary="Profile"
                  onClick={() => {
                    setUserInfoPopup(true);
                    setShowShortcuts(null);
                  }}
                />
              </ListItem>
              <ListItem
                button
                className="listExpander"
                onClick={() => handleLogout(history)}
              >
                <ListItemText primary="Log Out" />
              </ListItem>
            </List>
          </Popover>
          <Backdrop className={classes.backdrop} open={userInfoPopup}>
            <div className="userInfo">
              <div className="userInfo__header">
                <div className="userInfo__prevBtn">
                  <IconButton
                    onClick={() => setUserInfoPopup(false)}
                    aria-label="prevButton"
                  >
                    <ArrowBack style={{ color: "white" }} />
                  </IconButton>
                </div>
                <div className="userInfo__text">Profile</div>
              </div>
              <div className="userInfo__body">
                <div className="userInfo__avatar">
                  <img
                    className="userInfo__image"
                    src={userAvatar}
                    alt="User"
                  />
                </div>
                <p className="userInfo__username">Name: {currentUsername}</p>
                <p className="totalChats">Total Chats: {friendsList?.length}</p>
              </div>
            </div>
          </Backdrop>
        </div>
      </div>

      <div className="sidebar__searchArea">
        <div className="searchBox__wrapper">
          {userSearchText.length === 0 ? (
            <SearchIcon
              className="searchIcon animate__animated animate__backInLeft"
              fontSize="small"
            />
          ) : (
            <ArrowBack
              onClick={() => setUserSearchText("")}
              className="arrowBack animate__animated animate__backInLeft"
              fontSize="small"
            />
          )}
          <input
            type="search"
            name="searchBox"
            className="searchBox"
            value={userSearchText}
            onChange={(e) => setUserSearchText(e.target.value)}
            placeholder="Search or start new chat"
          />
        </div>
      </div>

      <div className="sidebar__chats">
        {friendsList.map((friend) => (
          <Contact
            key={friend.email}
            username={friend.name}
            avatar={friend.avatar}
            lastSeen={friend.lastSeen}
            recentMessage={friend.recentMessage}
            isRecentMessageSender={friend.recentMessageSender}
            unReadMessagesCount={friend.unReadMessages}
            onClick={() => showChathistory(friend)}
          />
        ))}
      </div>
    </div>
  );
}

export default SideBar;
