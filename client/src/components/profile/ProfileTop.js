import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Image from "react-graceful-image";
import { Link, NavLink } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  getFriendRequests,
  sendFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  acceptFriendRequest,
} from "../../store/friendRequest/friendRequest-actions";

const ProfileTop = (props) => {
  const { auth, profile, friendRequest, match } = props;
  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFriendRequests());
  }, [dispatch]);

  return (
    <div className="profile-top">
      <div className="display-picture">
        {auth.isAuthenticated &&
        auth.loading === false &&
        auth.user.payload._id === profile.user._id ? (
          <Link to="/edit-user">
            <Image src={profile.user.profilepicture} />
          </Link>
        ) : (
          <Image src={profile.user.profilepicture} />
        )}
      </div>
      <span className="item-header-title mb-05">
        <h2>{profile.user.name}</h2>
      </span>
      {profile.bio && <span className="item-header-bio">{profile.bio}</span>}
      {auth.loading === false &&
        auth.user.payload._id !== profile.user._id &&
        !auth.user.payload.friends.find(
          (friend) => friend === match.params.id
        ) && (
          <>
            {!!friendRequest.friendRequests.find(
              (request) => request.receiver === match.params.id
            ) ? (
              <button
                disabled={friendRequest.loading}
                className="link-button addFriend mt-05"
                onClick={() => {
                  const request = friendRequest.friendRequests.find(
                    (request) => request.receiver === match.params.id
                  );
                  dispatch(cancelFriendRequest(request._id));
                }}
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
                    onClick={() => {
                      dispatch(sendFriendRequest(match.params.id));
                    }}
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
        {/* <button
          onClick={() => {
            history.push(`/profile/${match.params.id}`);
          }}
          className="button-to-link"
        >
          Posts
        </button>
        <button
          onClick={() => {
            history.push(`/profile/${match.params.id}/friends`);
          }}
          className="button-to-link"
        >
          Friends
        </button>
        <button
          onClick={() => {
            history.push(`/profile/${match.params.id}/photos`);
          }}
          className="button-to-link"
        >
          Photos
        </button> */}
      </div>
    </div>
  );
};

export default ProfileTop;
