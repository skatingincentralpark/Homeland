import React, { useEffect, useState } from "react";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const otherUser = conversation.members.filter((m) => m._id !== currentUser);
    setUser(otherUser[0]);
  }, [conversation.members]);

  return (
    <div className="conversation mt-2">
      <div className="header-right-container">
        <div className="post-avatar med-avatar">
          <img src={user?.profilepicture} alt="user avatar" />
        </div>
        <span>{user?.name}</span>
      </div>
    </div>
  );
};

export default Conversation;
