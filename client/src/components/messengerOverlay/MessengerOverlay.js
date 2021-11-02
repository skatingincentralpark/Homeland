import React, { useEffect } from "react";

import {
  getConversations,
  updateConversationsUnread,
} from "../../store/messenger/messenger-actions";
import { useSelector, useDispatch } from "react-redux";
import { messengerActions } from "../../store/messenger/messenger-slice";

import ChatWindow from "./ChatWindow";
import "./messengerOverlay.css";

const MessengerOverlay = ({ socket }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const messenger = useSelector((state) => state.messenger);

  let currentId;
  if (!auth.loading && !!auth.user) {
    currentId = auth.user.payload._id;
  }

  useEffect(() => {
    // @@      GET CONVERSATIONS
    if (!auth.loading && auth.isAuthenticated && auth.user) {
      dispatch(getConversations(currentId));
    }
  }, [auth.user, dispatch]);

  useEffect(() => {
    // @@      DISPLAY MESSENGER POPUP ITEMS
    //          Create array to be used in displaying the messenger popup items & unread count
    let count = 0;
    const arr = messenger.conversations.map((conv) => {
      let member = conv.members.find((memb) => memb._id !== currentId);
      member = {
        ...member,
        updatedAt: conv.updatedAt,
        latestMessage: conv.latestMessage,
        unread: conv.unread,
        convId: conv._id,
      };

      if (
        messenger.conversation?._id !== conv._id &&
        conv.unread == currentId
      ) {
        count++;
      }

      return member;
    });
    dispatch(messengerActions.getDisplayedConversations(arr));
    dispatch(messengerActions.getUnreadCount(count));
  }, [messenger.conversations, currentId]);

  useEffect(() => {
    // @@      ARRIVAL MESSAGE
    if (!!socket.current) {
      socket.current.on("getMessage", (data) => {
        dispatch(messengerActions.setArrivalMessage(data));
      });
    }
  }, [socket.current]);

  useEffect(() => {
    // @@      ON ARRIVAL MESSAGE
    if (messenger.arrivalMessage) {
      if (
        messenger.conversation?.members.find(
          (member) => member._id === messenger.arrivalMessage.sender
        )
      ) {
        // @@      User has conversation open
        dispatch(messengerActions.receiveMessage(messenger.arrivalMessage));
        dispatch(
          updateConversationsUnread({
            conversationId: messenger.arrivalMessage.conversationId,
            text: messenger.arrivalMessage.text,
            receiverId: messenger.arrivalMessage.receiverId,
          })
        );
      } else {
        // @@      User does not have conversation NOT open
        dispatch(
          messengerActions.updateConversations({
            conversationId: messenger.arrivalMessage.conversationId,
            text: messenger.arrivalMessage.text,
            receiverId: messenger.arrivalMessage.receiverId,
          })
        );
        dispatch(messengerActions.clearArrivalMessage());
      }
    }
  }, [messenger.arrivalMessage]);

  useEffect(() => {
    // @@      ADD CURRENT USER
    if (!!socket.current && !!currentId) {
      console.log("adding user");
      socket.current.emit("addUser", currentId);
      socket.current.on("getUsers", (users) => {
        dispatch(messengerActions.setOnlineUsers(users));
      });
    }
  }, [socket.current, currentId]);

  useEffect(() => {
    if (!!socket.current) {
      socket.current.on("welcome", (message) => {
        console.log(message);
      });
    }
  }, [socket]);

  return (
    <div className="messenger-overlay">
      {messenger.showWindow && <ChatWindow socket={socket} />}
    </div>
  );
};

export default MessengerOverlay;
