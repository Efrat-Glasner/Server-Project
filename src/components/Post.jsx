/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import { deleteRequest, put } from "../js/controller";
import { CurrentUser } from "./App";
import { useNavigate } from "react-router-dom";
import Comments from "./Comments";

function Post({ post, onDelete, showMessage, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newPost, setNewPost] = useState({ title: post.title, body: post.body });
    const [showComments, setShowComments] = useState(false);
    const { currentUser } = useContext(CurrentUser);
    const navigate = useNavigate();

    const isAuthor = String(post.userId) === String(currentUser.id);

    useEffect(() => {
        if (showComments) {
            navigate(`/user/${currentUser.id}/posts/${post.id}/comments`, { replace: false });
        } else {
            navigate(`/user/${currentUser.id}/posts/${post.id}`, { replace: true });
        }
    }, [showComments, currentUser.id, post.id, navigate]);

    const handleDelete = async () => {
        try {
            await deleteRequest(`posts/${post.id}`);
            onDelete(post.id);
        } catch (error) {
            console.error("Error deleting the post:", error);
            showMessage("Failed to delete the post.");
        }
    };

    const handleUpdate = async (updatedData) => {
        if (newPost.title.trim() === "" || newPost.body.trim() === "") {
            showMessage("Both title and body must have valid values.");
            return;
        }
        setIsEditing(false);
        try {
            const updatedPost = await put(`posts/${post.id}`, {
                ...post,
                ...updatedData,
            });
            setNewPost({ title: updatedPost.title, body: updatedPost.body });
            onUpdate(post.id, updatedPost);
        } catch (error) {
            console.error("Error updating the post:", error);
            showMessage("Failed to update the post.");
        }
    };

    const toggleComments = () => {
        setShowComments((prev) => !prev);
    };

    return (
        <div className="post-container">
            <div className="post-details">
                <p><strong>ID:</strong> {post.id}</p>
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            placeholder="Edit Title"
                        />
                        <input
                            type="text"
                            value={newPost.body}
                            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                            placeholder="Edit Body"
                        />
                    </>
                ) : (
                    <>
                        <p><strong>TITLE:</strong> {post.title}</p>
                        <p><strong>BODY:</strong> {post.body}</p>
                    </>
                )}
            </div>
            <div className="post-actions">
                <button onClick={handleDelete} disabled={!isAuthor}>
                    Delete
                </button>
                {isEditing ? (
                    <button
                        onClick={() => handleUpdate({ title: newPost.title, body: newPost.body })}
                        disabled={!isAuthor}
                    >
                        Save
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} disabled={!isAuthor}>
                        Update
                    </button>
                )}
                <button onClick={toggleComments}>
                    {showComments ? "Hide Comments" : "Show Comments"}
                </button>
            </div>
            {showComments && <Comments postId={post.id} showMessage={showMessage} />}
        </div>
    );
}


export default Post;
