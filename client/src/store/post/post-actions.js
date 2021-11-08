import axios from "axios";

import { postActions } from "./post-slice";
import { uiActions } from "../ui/ui-slice";

import { setAlert } from "../alert/alert-actions";
import setAuthToken from "../../utils/setAuthToken";

// Add post
export const addPost =
  ({ text, postImage, socket }) =>
  async (dispatch) => {
    dispatch(uiActions.loadingTrue());
    try {
      let image;

      if (postImage) {
        const token = localStorage.token;
        setAuthToken();

        const formData = new FormData();
        formData.append("file", postImage);
        formData.append("upload_preset", "post-pictures");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkgzyvlpc/image/upload",
          formData
        );
        console.log(res);
        image = res.data.url;
        setAuthToken(token);
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({ text, image });

      const res = await axios.post("/api/posts", body, config);

      dispatch(postActions.addPost(res.data));

      // emit socket for all online users
      socket.current.emit("createPost", res.data);

      dispatch(setAlert("Post created", "success"));
      dispatch(uiActions.loadingFalse());
    } catch (err) {
      dispatch(uiActions.loadingFalse());
      dispatch(
        postActions.postError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
      dispatch(setAlert(err.response.data, "danger"));
    }
  };

// @@   Get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch(postActions.clearPost());
    dispatch(postActions.getPost(res.data));
  } catch (err) {
    dispatch(
      postActions.postError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// @@   Update a post
export const updatePost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/${id}`);

    dispatch(postActions.updatePost(res.data));
  } catch (err) {
    dispatch(
      postActions.postError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// @@   Get posts (1st batch)
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/posts");

    dispatch(postActions.getPosts(res.data));
  } catch (err) {
    dispatch(
      postActions.postError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// @@   Get posts (after 1st batch)
export const getPostsNext = (postId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/next/${postId}`);

    dispatch(postActions.getPostsNext(res.data));
  } catch (err) {
    dispatch(
      postActions.postError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// @@   Get posts for a user (1st batch)
export const getPostsByUser = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/posts/user/${userId}`);

    dispatch(postActions.getPosts(res.data));
  } catch (err) {
    dispatch(
      postActions.postError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// @@   Get posts for a user (after 1st batch)
export const getPostsByUserNext =
  ({ userId, postId }) =>
  async (dispatch) => {
    try {
      const res = await axios.get(`/api/posts/user/${userId}/next/${postId}`);

      dispatch(postActions.getPostsNext(res.data));
    } catch (err) {
      dispatch(
        postActions.postError({
          msg: err.response.statusText,
          status: err.response.status,
        })
      );
    }
  };

// @@   Add like
export const addLike = (postId, socket) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/like/${postId}`);
    dispatch(postActions.updateLikes({ postId, likes: res.data }));

    // emit socket for all online users
    socket.current.emit("updatePost", postId);
  } catch (err) {
    dispatch(
      postActions.postError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// Remove like
export const removeLike = (postId, socket) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/posts/unlike/${postId}`);
    dispatch(postActions.updateLikes({ postId, likes: res.data }));

    // emit socket for all online users
    socket.current.emit("updatePost", postId);
  } catch (err) {
    dispatch(
      postActions.postError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
  dispatch(uiActions.loadingTrue());
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch(postActions.deletePost(id));

    dispatch(setAlert("Post removed", "success"));
    dispatch(uiActions.loadingFalse());
  } catch (err) {
    dispatch(uiActions.loadingFalse());
    dispatch(
      postActions.postError({
        msg: err.response.statusText,
        status: err.response.status,
      })
    );
  }
};

// Add comment
export const addComment = (postId, formData, socket) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post(
      `/api/posts/comments/${postId}`,
      formData,
      config
    );

    dispatch(postActions.addComment({ comments: res.data, postId }));

    // emit socket for all online users
    socket.current.emit("updatePost", postId);

    dispatch(setAlert("Comment added", "success"));
  } catch (err) {
    console.log(err);
    dispatch(
      postActions.postError({
        msg: err.response,
      })
    );
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(
      `/api/posts/comments/${postId}/${commentId}`
    );

    dispatch(postActions.removeComment({ postId, comments: res.data }));
    dispatch(setAlert("Comment Removed", "success"));
  } catch (err) {
    postActions.postError({
      msg: err.response.statusText,
      status: err.response.status,
    });
  }
};
