import React, { useState, useEffect } from "react";

import CommentItem from "./CommentItem";

const Comments = (props) => {
  const [comments, setComments] = useState([]);
  const [counter, setCounter] = useState(1);
  const [idOfMenuOpen, setIdOfMenuOpen] = useState(null);

  const amount = counter * 3;

  useEffect(() => {
    setCounter(2);
    setComments(props.comments.slice(0, amount));
  }, [props.comments]);

  const loadMore = (e) => {
    e.preventDefault();
    setCounter((prev) => prev + 1);
    setComments(props.comments.slice(0, amount));
  };

  return (
    <div className="px-1">
      {comments &&
        comments.map((comment, i) => (
          <CommentItem
            comment={comment}
            postId={props.postId}
            key={comment._id}
            isUsersComment={props.isUsersComment}
            setIdOfMenuOpen={setIdOfMenuOpen}
            idOfMenuOpen={idOfMenuOpen}
          />
        ))}
      {!!comments.length && (
        <button className="button-to-link mb-1" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
};

export default Comments;
