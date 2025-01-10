/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/post.css";
import Edit from "./Edit";
import Delete from "./Delete";
import Comments from "./Comments";
import { CurrentUser } from "./App";

function Post({ post, setPosts, showMessage, setSelectedPost }) {
    const [showComments, setShowComments] = useState(false);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthor = String(post.userId) === String(currentUser.id);

    useEffect(() => {
        if (showComments) {
            navigate(`/user/${currentUser.id}/posts/${post.id}/comments`, { replace: false });
        } else {
            navigate(`/user/${currentUser.id}/posts/${post.id}`, { replace: true });
        }
    }, [showComments, currentUser.id, post.id, navigate]);

    useEffect(() => {
        const hasCommentsPath = location.pathname.includes("/comments");
        setShowComments(hasCommentsPath);
    }, [location]);

    const toggleComments = () => {
        setShowComments((prev) => !prev);
    };

    return (
        <div className="post-card">

            {/* Display post details */}
            <div className="post-details">
                <p className="post-title">
                    <strong>Title:</strong> {post.title}
                </p>
                <p className="post-body">
                    <strong>Body:</strong> {post.body}
                </p>
            </div>

            {/* Actions for delete and comments */}
            <div className="post-buttons">
                <Delete
                    types={["comments/postId", "posts"]}
                    id={post.id}
                    setDetails={setPosts}
                    activity={!isAuthor}
                    showMessage={showMessage}
                    setSelectedItem={setSelectedPost}
                />

                {/* Edit component */}
                <Edit
                    type="posts"
                    item={post}
                    inputs={["title", "body"]}
                    setDetails={setPosts}
                    showMessage={showMessage}
                    setSelectedItem={setSelectedPost}
                    activity={!isAuthor}
                />
                <button onClick={toggleComments}>
                    {showComments ? "Hide Comments" : "Show Comments"}
                </button>
            </div>

            {/* Comments section */}
            {showComments && <Comments postId={post.id} showMessage={showMessage} />}
        </div>
    );
}

export default Post;
