import React, { useEffect, useState, useRef } from "react";
import Image from "react-graceful-image";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  sendMessage,
  getNextBatchMsgs,
} from "../../store/messenger/messenger-actions";
import { messengerActions } from "../../store/messenger/messenger-slice";
import { useSelector, useDispatch } from "react-redux";

import TextArea from "../layout/TextArea";
import Message from "../messenger/Message";

const ChatWindow = ({ socket }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const messenger = useSelector((state) => state.messenger);
  const scrollRef = useRef();
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    const recipient = messenger.conversation?.members.find(
      (m) => m._id !== currentId
    );

    setRecipient(recipient);
  }, [messenger.conversation]);

  let currentId;
  if (!auth.loading) {
    currentId = auth.user?.payload._id;
  }

  // @@     SUBMIT
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

  const getNextBatchMsgsHandler = () => {
    if (messenger.messages.length) {
      const msgArr = messenger.messages.map((msg) => msg._id);
      console.log(messenger.messages);

      const lastMsgId = msgArr.reduce((prev, curr) => {
        return prev < curr ? prev : curr;
      });

      console.log("LASTMSGID: " + lastMsgId);

      dispatch(
        getNextBatchMsgs({
          conversationId: messenger.conversation._id,
          msgId: lastMsgId,
        })
      );
    }
  };

  return (
    <div className="chatWindow">
      <div className="chatBoxWrapper">
        {messenger.conversation ? (
          <>
            <div className="chatWindowHeader">
              <div className="post-header-left">
                <div className="post-avatar align-items-center">
                  <Image src={recipient?.profilepicture || ""} />

                  <div className="post-information">
                    <span className="post-author">{recipient?.name}</span>
                    <span className="post-date">Online</span>
                  </div>
                </div>

                <div className="chatWindowControls">
                  <button>&#8212;</button>
                  <button
                    onClick={() => {
                      dispatch(messengerActions.clearConversation());
                    }}
                  >
                    &#10005;
                  </button>
                </div>
              </div>
            </div>
            <div
              className="chatBoxTop"
              id="chatBoxTop"
              style={{
                height: "25rem",
                overflow: "auto",
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              {/* <button onClick={getNextBatchMsgsHandler}>Get more msgs</button> */}
              <InfiniteScroll
                dataLength={messenger.messages.length} //This is important field to render the next data
                next={getNextBatchMsgsHandler}
                hasMore={true}
                loader={<h4>Loading...</h4>}
                style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
                inverse={true}
                scrollThreshold="1px"
                scrollableTarget="chatBoxTop"
                endMessage={<p></p>}
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
              />
              <button onClick={onSubmit} className="link-button text-form">
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
  );
};

export default ChatWindow;
