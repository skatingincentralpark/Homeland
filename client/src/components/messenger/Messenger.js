import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import { useSelector, useDispatch } from "react-redux";
import {
  getConversations,
  getConversation,
  sendMessage,
} from "../../store/messenger/messenger-actions";
import { messengerActions } from "../../store/messenger/messenger-slice";

import Conversation from "./Conversation";
import Message from "./Message";
import TextArea from "../layout/TextArea";
import ChatOnline from "./ChatOnline";

import "./messenger.css";

const Messenger = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const messenger = useSelector((state) => state.messenger);
  const [text, setText] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  let currentId;
  let friends;
  if (!auth.loading) {
    currentId = auth.user.payload._id;
    friends = auth.user.payload.friends;
  }

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      messenger.conversation.members.find(
        (member) => member._id === arrivalMessage.sender
      ) &&
      dispatch(messengerActions.receiveMessage(arrivalMessage));
  }, [arrivalMessage, messenger.conversation]);

  useEffect(() => {
    if (!auth.loading) {
      socket.current.emit("addUser", currentId);
      socket.current.on("getUsers", (users) => {
        dispatch(messengerActions.setOnlineUsers(users));
      });
    }
  }, [auth.user]);

  useEffect(() => {
    socket.current.on("welcome", (message) => {
      console.log(message);
    });
  }, [socket]);

  useEffect(() => {
    if (!auth.loading) {
      dispatch(getConversations(currentId));
    }
  }, [auth.loading, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();

    const message = {
      sender: currentId,
      text: text,
      conversationId: messenger.conversation._id,
    };

    const receiverId = messenger.conversation.members.find(
      (m) => m._id !== currentId
    )._id;

    socket.current.emit("sendMessage", {
      senderId: currentId,
      receiverId,
      text: text,
    });

    dispatch(sendMessage(message));

    setText("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messenger.messages]);

  useEffect(() => {});

  return (
    <>
      {!messenger.loading && !auth.loading && (
        <div className="messenger">
          <div className="chatMenu">
            <div className="chatMenuWrapper">
              <input
                placeholder="Search for friends"
                className="chatMenuInput"
              />
              {!messenger.loading &&
                messenger.conversations.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      dispatch(getConversation(c._id));
                    }}
                  >
                    <Conversation conversation={c} currentUser={currentId} />
                  </div>
                ))}
            </div>
          </div>
          <div className="chatBox">
            <div className="chatBoxWrapper">
              {messenger.conversation ? (
                <>
                  <div className="chatBoxTop">
                    {messenger.messages.map((m) => (
                      <div ref={scrollRef} key={m._id}>
                        <Message
                          message={m}
                          own={m.sender === currentId}
                          profilepicture={
                            m.sender === currentId
                              ? auth.user.payload.profilepicture
                              : messenger.conversation.members.find(
                                  (m) => m._id !== currentId
                                ).profilepicture
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <div className="chatBoxBottom">
                    <TextArea
                      placeholder="Write something..."
                      setText={setText}
                      value={text}
                    />
                    <button
                      onClick={onSubmit}
                      className="link-button text-form"
                    >
                      Post
                    </button>
                  </div>
                </>
              ) : (
                <span className="noConvoText">
                  Open a conversation to start a chat
                </span>
              )}
            </div>
          </div>
          <div className="chatOnline">
            <div className="chatOnlineWrapper">
              <ChatOnline
                onlineUsers={messenger.onlineUsers}
                friends={friends}
                currentId={currentId}
                getConversation={getConversation}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messenger;
