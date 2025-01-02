/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { CurrentUser } from "./App";
import { get, post } from "../js/controller";
import Comment from "./Comment";

function Comments({ thisPost, showMessage }) {
    const { currentUser } = useContext(CurrentUser);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({ name: "", body: "" });

    useEffect(() => {
        const fetchComments = async () => {
            try {
                if (!currentUser || !thisPost) return;
                const data = await get(`comments?postId=${thisPost.id}`);
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [currentUser, thisPost]);

    const handleDeleteComment = (id) => {
        setComments((prev) => prev.filter((comment) => comment.id !== id));
    };

    const handleUpdateComment = (id, updatedComment) => {
        setComments((prev) =>
            prev.map((comment) => (comment.id === id ? updatedComment : comment))
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
        console.log(thisPost);

        const newCommentData = {
            postId: thisPost.id,
            name: newComment.name.trim(),
            body: newComment.body.trim(),
            email: currentUser.email
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
                <button onClick={handleAddComment}>
                    Add Comment
                </button>
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
