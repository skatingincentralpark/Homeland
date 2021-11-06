import React, { useEffect } from "react";
import Image from "react-graceful-image";
import { Link, NavLink } from "react-router-dom";

import {
  sendFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  acceptFriendRequest,
} from "../../store/friendRequest/friendRequest-actions";
import { useDispatch, useSelector } from "react-redux";
import { getProfileByIdNoLoading } from "../../store/profile/profile-actions";

const ProfileTop = (props) => {
  const { match, socket } = props;

  const { profile } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const friendRequest = useSelector((state) => state.friendRequest);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProfileByIdNoLoading(match.params.id));
  }, [dispatch, auth.user]);

  useEffect(() => {
    if (!!socket.current) {
      socket.current.on("getFriendRequests", async () => {
        dispatch(getProfileByIdNoLoading(match.params.id));
      });
    }
  }, [socket.current]);

  const addFriend = async () => {
    await dispatch(sendFriendRequest(match.params.id));
    socket.current.emit("updateFriendRequest", match.params.id);
  };

  const cancelFriendRequst = async () => {
    const request = friendRequest.friendRequests.find(
      (request) => request.receiver === match.params.id
    );
    await dispatch(cancelFriendRequest(request._id));

    socket.current.emit("updateFriendRequest", match.params.id);
  };

  return (
    <div className="profile-top">
      <div className="display-picture">
        {auth.isAuthenticated &&
        auth.loading === false &&
        auth.user.payload._id === profile.user._id ? (
          <Link to="/edit-user">
            <img src={profile.user.profilepicture} />
          </Link>
        ) : (
          <Image src={profile.user.profilepicture} />
        )}
      </div>
      <span className="item-header-title mb-05">
        <h2>{profile.user.name}</h2>
      </span>
      {profile.bio && <span className="item-header-bio">{profile.bio}</span>}
      {!auth.loading &&
        !profile.loading &&
        !friendRequest.loading &&
        auth.user.payload._id !== profile.user._id &&
        !auth.user.payload.friends.find(
          (friend) => friend.user === match.params.id
        ) && (
          <>
            {!!friendRequest.friendRequests.find(
              (request) => request.receiver === match.params.id
            ) ? (
              <button
                disabled={friendRequest.loading}
                className="link-button addFriend mt-05"
                onClick={cancelFriendRequst}
              >
                Cancel Request
              </button>
            ) : (
              <>
                {friendRequest.friendRequests.find(
                  (request) => request.receiver === auth.user.payload._id
                ) &&
                !!friendRequest.friendRequests.find(
                  (request) => request.sender === match.params.id
                ) ? (
                  <div className="profile-request-container">
                    <span>Respond to their friend request</span>
                    <div>
                      <button
                        onClick={() => {
                          const request = friendRequest.friendRequests.find(
                            (request) => request.sender === match.params.id
                          );
                          dispatch(acceptFriendRequest(request._id));
                        }}
                        className="link-button acceptDecline bg-white"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => {
                          const request = friendRequest.friendRequests.find(
                            (request) => request.sender === match.params.id
                          );
                          dispatch(declineFriendRequest(request._id));
                        }}
                        className="link-button acceptDecline bg-white"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    disabled={
                      friendRequest.loading || !auth.user.payload.profile
                    }
                    className="link-button addFriend mt-05"
                    onClick={addFriend}
                  >
                    Add Friend
                  </button>
                )}
              </>
            )}
          </>
        )}
      <div className="profile-nav">
        <NavLink
          activeClassName="profile-nav-selected"
          exact
          to={`/profile/${match.params.id}`}
        >
          Posts
        </NavLink>
        <NavLink
          activeClassName="profile-nav-selected"
          to={`/profile/${match.params.id}/friends`}
        >
          Friends
        </NavLink>
        <NavLink
          activeClassName="profile-nav-selected"
          to={`/profile/${match.params.id}/photos`}
        >
          Photos
        </NavLink>
      </div>
    </div>
  );
};

export default ProfileTop;
