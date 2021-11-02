import React, { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

import {
  getConversation,
  sendMessage,
} from "../../store/messenger/messenger-actions";
import { useSelector, useDispatch } from "react-redux";
import { messengerActions } from "../../store/messenger/messenger-slice";

import Conversation from "./Conversation";
import Message from "./Message";
import TextArea from "../layout/TextArea";
import ChatOnline from "./ChatOnline";

import "./messenger.css";

const Messenger = ({ socket }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const messenger = useSelector((state) => state.messenger);
  const [text, setText] = useState("");
  const scrollRef = useRef();

  let currentId;
  let friends;
  if (!auth.loading) {
    currentId = auth.user.payload._id;
    friends = auth.user.payload.friends;
  }

  // submit
  const onSubmit = (e) => {
    e.preventDefault();

    if (!text) {
      return;
    }

    const receiverId = messenger.conversation.members.find(
      (m) => m._id !== currentId
    )._id;

    const message = {
      sender: currentId,
      text: text,
      conversationId: messenger.conversation._id,
      receiverId,
      createdAt: Date.now(),
    };

    socket.current.emit("sendMessage", message);

    dispatch(sendMessage(message));
    setText("");
  };

  // scroll into view
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messenger.messages]);

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
                friends={auth.user.payload.friends}
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
