/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { CurrentUser } from "./App";
import { put,deleteRequest } from "../js/controller";
function Comment({ comment, onDelete, onUpdate,showMessage }) {
    const { currentUser } = useContext(CurrentUser);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedComment, setUpdatedComment] = useState({
        name: comment.name,
        body: comment.body,
    });

    const isAuthor = comment.email === currentUser.email;

    const handleDelete = async () => {
        try {
            await deleteRequest(`comments/${comment.id}`); // קריאה לפקודת DELETE
            onDelete(comment.id); // קריאה למחיקת המשימה מהסטייט של comments
        } catch (error) {
            console.error("Error deleting the comment:", error);
            showMessage("Failed to delete the task.");
        }
    };

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
                <small>email: {comment.email}</small>
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
                <button onClick={handleDelete} disabled={!isAuthor}>
                    Delete
                </button>
            </div>
        </li>
    );
}

export default Comment;
