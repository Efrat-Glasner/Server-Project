/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { deleteRequest, put } from "../js/controller";
import { CurrentUser } from "./App";
import Comments from "./Comments";
function Post({ post, onDelete, showMessage, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newPost, setNewPost] = useState({ title: post.title, body: post.body });
    const [showComments, setShowComments] = useState(false);
    const { currentUser } = useContext(CurrentUser);

    // בדיקה אם המשתמש הנוכחי הוא המחבר של הפוסט
    const isAuthor = String(post.userId) === String(currentUser.id);
    console.log(post)
    const handleDelete = async () => {
        try {
            await deleteRequest(`posts/${post.id}`); // קריאה לפקודת DELETE
            onDelete(post.id); // קריאה למחיקת המשימה מהסטייט של posts
        } catch (error) {
            console.error("Error deleting the post:", error);
            showMessage("Failed to delete the task.");
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
                ...post, // שמירת כל שאר הנתונים מהמשימה הישנה
                ...updatedData // עדכון רק את הנתונים ששונו
            });
            setNewPost({ title: updatedPost.title, body: updatedPost.body });

            console.log(`Post with ID: ${post.id} updated!`);
            onUpdate(post.id, updatedPost); // עדכון המשימה בהצלחה
        } catch (error) {
            console.error("Error updating the post:", error);
            showMessage("Failed to update the task.");
        }
    };

    const handleShowComments = () => {
        setShowComments((prev) => !prev)
    };

    return (
        <div className="post-container">
            <div className="post-details">
                <p><strong>ID:</strong> {post.id}</p>
                { /*שדות לעריכה*/}
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
                        <p ><strong>TITLE:</strong> {post.title}</p>
                        <p><strong>BODY:</strong> {post.body}</p>
                    </>
                )}
            </div>
            <div className="post-actions">
                {/* כפתור מחיקה */}
                <button onClick={handleDelete} disabled={!isAuthor}>
                    Delete
                </button>

                {/* כפתור עדכון */}
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
                <button onClick={handleShowComments}>{showComments ? 'Hide commetns' : 'Comments'}</button>

            </div>
            {/* כפתור הצגת תגובות */}
            {showComments && <Comments postId={post.id} showMessage={showMessage} />}

        </div>
    );
}

export default Post;
