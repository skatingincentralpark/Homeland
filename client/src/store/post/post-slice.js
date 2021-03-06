import { createSlice } from "@reduxjs/toolkit";

// @@@@ POST SLICE

// @@ INITIAL STATE
const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

// @@ REDUCER FUNCTIONS
function getPosts(state, action) {
  Object.assign(state, {
    posts: action.payload,
    loading: false,
  });
}
function getPostsNext(state, action) {
  Object.assign(state, {
    posts: [...state.posts, ...action.payload],
    loading: false,
  });
}
function getPost(state, action) {
  Object.assign(state, {
    post: action.payload,
    loading: false,
  });
}
function updatePost(state, action) {
  if (state.post?._id === action.payload._id) {
    state.post = action.payload;
  }

  const postIndex = state.posts.findIndex(
    (post) => post._id === action.payload._id
  );

  state.posts.splice(postIndex, 1, action.payload);
}
function addPost(state, action) {
  Object.assign(state, {
    posts: [action.payload, ...state.posts],
    loading: false,
  });
}
function deletePost(state, action) {
  Object.assign(state, {
    posts: state.posts.filter((post) => post._id !== action.payload),
    loading: false,
  });
}
function postError(state, action) {
  Object.assign(state, {
    error: action.payload,
    loading: false,
  });
}
function updateLikes(state, action) {
  if (state.post?._id === action.payload.postId) {
    state.post.likes = action.payload.likes;
  }

  Object.assign(state, {
    posts: state.posts.map((post) =>
      post._id === action.payload.postId
        ? { ...post, likes: action.payload.likes }
        : post
    ),
    loading: false,
  });
}
function addComment(state, action) {
  if (state.post?._id === action.payload.postId) {
    state.post.comments = action.payload.comments;
  }

  Object.assign(state, {
    posts: state.posts.map((post) =>
      post._id === action.payload.postId
        ? { ...post, comments: action.payload.comments }
        : post
    ),
    loading: false,
  });
}
function removeComment(state, action) {
  if (state.post?._id === action.payload.postId) {
    state.post.comments = action.payload.comments;
  }

  Object.assign(state, {
    posts: state.posts.map((post) =>
      post._id === action.payload.postId
        ? { ...post, comments: action.payload.comments }
        : post
    ),
    loading: false,
  });
}
function clearPosts(state, action) {
  Object.assign(state, {
    posts: [],
    post: null,
    loading: true,
  });
}
function clearPost(state, action) {
  Object.assign(state, {
    post: null,
    loading: true,
  });
}

// @@ POST REDUCER
const postSlice = createSlice({
  name: "post",
  initialState: initialState,
  reducers: {
    getPosts,
    getPostsNext,
    getPost,
    updatePost,
    addPost,
    deletePost,
    postError,
    updateLikes,
    addComment,
    removeComment,
    clearPost,
    clearPosts,
  },
});

export const postActions = postSlice.actions;
export default postSlice.reducer;
