import React, { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Div100vh from "react-div-100vh";

import {
  getConversation,
  sendMessage,
  getNextBatchMsgs,
} from "../../store/messenger/messenger-actions";
import { useSelector, useDispatch } from "react-redux";

import Conversation from "./Conversation";
import Message from "./Message";
import TextArea from "../layout/TextArea";
import Hourglass from "../layout/Hourglass";
import SkeletonConversation1 from "../skeleton/SkeletonConversation1";

import "./messenger.css";

const Messenger = ({ socket }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const messenger = useSelector((state) => state.messenger);
  const [text, setText] = useState("");
  const [onlineUserArr, setOnlineUserArr] = useState([]);
  const scrollRef = useRef();

  let currentId;
  if (!auth.loading) {
    currentId = auth.user.payload._id;
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

  useEffect(() => {
    setOnlineUserArr(messenger.onlineUsers.map((user) => user.userId));
  }, [messenger.onlineUsers]);

  const getNextBatchMsgsHandler = () => {
    if (messenger.messages.length) {
      const msgArr = messenger.messages.map((msg) => msg._id);

      const lastMsgId = msgArr.reduce((prev, curr) => {
        return prev < curr ? prev : curr;
      });

      dispatch(
        getNextBatchMsgs({
          conversationId: messenger.conversation._id,
          msgId: lastMsgId,
        })
      );
    }
  };

  return (
    <Div100vh>
      <div className="messenger">
        <div className="chatMenu">
          <div className="p-1 item-header-title messenger-mob-display-none">
            <b>Messages</b>
          </div>
          <div className="chatMenuWrapper">
            {!messenger.loading && messenger.displayedConversations.length ? (
              messenger.displayedConversations.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    dispatch(getConversation(c.convId));
                  }}
                >
                  <Conversation
                    conversation={c}
                    currentUser={currentId}
                    onlineUserArr={onlineUserArr}
                  />
                </div>
              ))
            ) : (
              <>
                <SkeletonConversation1 />
              </>
            )}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {messenger.conversation ? (
              <>
                <div
                  className="chatBoxTop"
                  id="chatBoxTop"
                  style={{
                    height: "70rem",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column-reverse",
                  }}
                >
                  <InfiniteScroll
                    dataLength={messenger.messages.length} //This is important field to render the next data
                    next={getNextBatchMsgsHandler}
                    hasMore={messenger.hasMore}
                    loader={<Hourglass />}
                    style={{
                      display: "flex",
                      flexDirection: "column-reverse",
                    }} //To put endMessage and loader to the top.
                    inverse={true}
                    scrollThreshold="0px"
                    scrollableTarget="chatBoxTop"
                    endMessage=""
                  >
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
                  </InfiniteScroll>
                </div>
                <div className="chatBoxBottom">
                  <TextArea
                    placeholder="Write something..."
                    setText={setText}
                    value={text}
                    buttonText="Send"
                    onSubmit={onSubmit}
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </Div100vh>
  );
};

export default Messenger;
