/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentUser } from "./App";
import { get, post } from "../js/controller";
import Comment from "./Comment";

function Comments({postId, showMessage }) {
    const { currentUser } = useContext(CurrentUser);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ name: "", body: "" });
    const navigate = useNavigate();

    useEffect(() => {
        // עדכון ה-URL לכתובת הכוללת את ה-user וה-post
        // navigate(`/user/${currentUser.id}/posts/${postId}/comments`, { replace: false });

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

    // שאר הפונקציות לא השתנו
    const handleDeleteComment = (commentId) => {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    };

    const handleUpdateComment = (commentId, updatedComment) => {
        setComments((prev) =>
            prev.map((comment) => (comment.id === commentId ? updatedComment : comment))
        );
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
        } catch (error) {
            showMessage("Failed to add the comment.");
            console.error(error);
        }
    };

    return (
        <div>
            <h3>Comments:</h3>
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
                <button onClick={handleAddComment}>Add Comment</button>
            </div>
            <ul>
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
        </div>
    );
}

export default Comments;
