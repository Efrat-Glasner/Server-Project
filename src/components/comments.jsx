/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { CurrentUser } from "./App";
import { get, post } from "../js/controller";
import Comment from "./Comment";
import "../css/comment.css";

function Comments({ postId, showMessage, message }) {
    const { currentUser } = useContext(CurrentUser);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ name: "", body: "" });
    const [showAddComment, setShowAddComment] = useState(false);

    useEffect(() => {

        const fetchComments = async () => {
            try {
                if (!currentUser) return;
                const data = await get(`comments?postId=${postId}`);
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        fetchComments();
    }, [currentUser, postId]);

    const handleDeleteComment = (commentId) => {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        showMessage("The comment was deleted successfully!");

    };

    const handleUpdateComment = (commentId, updatedComment) => {
        setComments((prev) =>
            prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
        );
        showMessage("The comment was updated successfully!");

    };

    const handleAddComment = async () => {
        if (!newComment.name.trim() || !newComment.body.trim()) {
            showMessage("Please fill in both fields!");
            return;
        }

        const isDuplicate = comments.some(
            (comment) =>
                comment.name === newComment.name.trim() &&
                comment.body === newComment.body.trim()
        );

        if (isDuplicate) {
            showMessage("The comment already exists!");
            return;
        }

        const newCommentData = {
            postId: postId,
            name: newComment.name.trim(),
            body: newComment.body.trim(),
            email: currentUser.email,
        };

        try {
            const addedComment = await post("comments", newCommentData);
            setComments((prevComments) => [...prevComments, addedComment]);
            setNewComment({ name: "", body: "" });
            showMessage("The comment was added successfully!");
            setShowAddComment(false); // סגירת האינפוטים לאחר הוספה
        } catch (error) {
            showMessage("Failed to add the comment.");
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Comments:</h3>

            {/* כפתור להוספה */}
            <button onClick={() => setShowAddComment((prev) => !prev)}>
                {showAddComment ? "Cancel" : "Add Comment"}
            </button>

            {/* הצגת האינפוטים רק אם showAddComment פעיל */}
            {showAddComment && (
                <div className="add-comment">
                    <input
                        type="text"
                        placeholder="Enter comment name"
                        value={newComment.name}
                        onChange={(e) =>
                            setNewComment({ ...newComment, name: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Enter comment body"
                        value={newComment.body}
                        onChange={(e) =>
                            setNewComment({ ...newComment, body: e.target.value })
                        }
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={!newComment.name || !newComment.body}
                    >
                        Submit
                    </button>
                </div>
            )}

            {/* הצגת התגובות */}
            <ul className="all-comment">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        onDelete={handleDeleteComment}
                        onUpdate={handleUpdateComment}
                        showMessage={showMessage}
                    />
                ))}
            </ul>
        {message && <p className="toast">{message}</p>}

        </div>
    );
}

export default Comments;
