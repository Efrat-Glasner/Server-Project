/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { CurrentUser } from "./App";
import { get } from "../js/controller";
import Comment from "./Comment";
import "../css/comment.css";
import Add from "./Add";

function Comments({ postId, showMessage, message, onFilter }) {
    const { currentUser } = useContext(CurrentUser);
    const [comments, setComments] = useState([]);
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
    
    return (
        <div>
            <h3>Comments:</h3>
            <Add
                type={"comments"}
                setDetails={setComments}
                inputs={["name","body"]}
                knownFields={{postId:postId,email:currentUser.email}}
                showMessage={showMessage}
                onFilter={onFilter}
            />
            {/* הצגת התגובות */}
            <ul className="all-comment">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                        setDetails={setComments}
                        showMessage={showMessage}
                    />
                ))}
            </ul>
            {message && <p className="toast">{message}</p>}

        </div>
    );
}
export default Comments;
