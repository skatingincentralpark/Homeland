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
import Hourglass from "../layout/Hourglass";
import SkeletonText from "../skeleton/SkeletonText";

const ChatWindow = ({ socket }) => {
  const dispatch = useDispatch();
  const ui = useSelector((state) => state.ui);
  const auth = useSelector((state) => state.auth);
  const messenger = useSelector((state) => state.messenger);
  const scrollRef = useRef();
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isOnline, setIsOnline] = useState(null);

  let currentId;
  if (!auth.loading) {
    currentId = auth.user?.payload._id;
  }

  useEffect(() => {
    const recipient = messenger.conversation?.members.find(
      (m) => m._id !== currentId
    );

    setRecipient(recipient);
  }, [messenger.conversation, currentId]);

  // @@     CHECK IF RECIPIENT IS ONLINE
  // @@     CURRENT TO DO !!!
  useEffect(() => {
    if (!messenger.loading && recipient) {
      const arr = messenger.onlineUsers.map((user) => user.userId);
      if (arr.find((id) => recipient._id === id)) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    }
  }, [messenger.onlineUsers, messenger.loading, recipient]);

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
    <div className="chatWindow">
      <div className="chatBoxWrapper">
        <div className="chatWindowHeader">
          <div className="post-header-left">
            <div className="post-avatar align-items-center">
              <div className="chatOnlineImgContainer">
                <Image src={recipient?.profilepicture || ""} />
                {isOnline && <div className="chatOnlineBadge"></div>}
              </div>

              <div className="post-information">
                <span className="post-author">
                  {!recipient?.name ||
                    (ui.loading ? (
                      <SkeletonText
                        height="125"
                        width="8"
                        color="bg-gray"
                        wrapperClasses="mb-05"
                      />
                    ) : (
                      recipient.name
                    ))}
                </span>
                <span className="post-date p-0">
                  {!ui.loading ? (
                    isOnline ? (
                      "Online"
                    ) : (
                      "Offline"
                    )
                  ) : (
                    <SkeletonText height="08" color="bg-gray" width="4" />
                  )}
                </span>
              </div>
            </div>

            <div className="chatWindowControls">
              <button
                onClick={() => {
                  dispatch(messengerActions.hideWindow());
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
          {messenger.conversation && !messenger.loading && !ui.loading && (
            <InfiniteScroll
              dataLength={messenger.messages.length} //This is important field to render the next data
              next={getNextBatchMsgsHandler}
              hasMore={messenger.hasMore}
              loader={<Hourglass />}
              style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
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
          )}
        </div>
        <div className="chatBoxBottom">
          <TextArea
            placeholder="Write something..."
            setText={setText}
            value={text}
            onSubmit={onSubmit}
            buttonText="Send"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
