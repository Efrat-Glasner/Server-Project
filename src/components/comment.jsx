/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { CurrentUser } from "./App";
import '../css/comment.css';
import { put } from "../js/controller";
import Delete from "./Delete";
function Comment({ comment, onDelete, onUpdate, showMessage }) {
    const { currentUser } = useContext(CurrentUser);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState({
        name: comment.name,
        body: comment.body,
    });

    const isAuthor = comment.email === currentUser.email;
    const handleUpdate = async (updatedData) => {
        if (updatedComment.name.trim() === "" || updatedComment.body.trim() === "") {
            showMessage("Both title and body must have valid values.");
            return;
        }
        setIsEditing(false);
        try {
            const updatedComment = await put(`comments/${comment.id}`, {
                ...comment,
                ...updatedData
            });
            setUpdatedComment({ name: updatedComment.name, body: updatedComment.body });
            onUpdate(comment.id, updatedComment);
        } catch (error) {
            console.error("Error updating the comment:", error);
            showMessage("Failed to update the comment.");
        }
    };
    return (
        <div className="comment-card">
            <li>
                <p>
                    <strong>
                        {isEditing ? (
                            <input
                                type="text"
                                value={updatedComment.name}
                                onChange={(e) =>
                                    setUpdatedComment({
                                        ...updatedComment,
                                        name: e.target.value,
                                    })
                                }
                            />
                        ) : (
                            comment.name
                        )}
                    </strong>
                    :{" "}
                    {isEditing ? (
                        <input
                            type="text"
                            value={updatedComment.body}
                            onChange={(e) =>
                                setUpdatedComment({
                                    ...updatedComment,
                                    body: e.target.value,
                                })
                            }
                        />
                    ) : (
                        comment.body
                    )}
                </p>
                <p>
                    <small><i className="fa-solid fa-user"></i> {comment.email}</small>
                </p>
                <div className="comment-actions">
                    {isEditing ? (
                        <button
                            onClick={() => handleUpdate({ name: updatedComment.name, body: updatedComment.body })}
                            disabled={!isAuthor}
                        >
                            Save
                        </button>

                    ) : (
                        <button onClick={() => setIsEditing(true)} disabled={!isAuthor}>
                            Update
                        </button>
                    )}

                    <Delete type={"comments"} id={comment.id} onDelete={onDelete} activity={!isAuthor}/>
                </div>
            </li>
        </div>
    );
}
export default Comment;
