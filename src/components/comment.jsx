/* eslint-disable react/prop-types */
import { useContext } from "react";
import { CurrentUser } from "./App";
import '../css/comment.css';
import Delete from "./Delete";
import Edit from "./Edit";
function Comment({ comment, setDetails, showMessage, message }) {
    const { currentUser } = useContext(CurrentUser);
    const isAuthor = comment.email === currentUser.email;

    return (
        <div className="comment-card">
            <li><p><strong>{comment.name}</strong>:{" "}{comment.body}</p>
                <p> <small><i className="fa-solid fa-user"></i> {comment.email}</small></p>
                <div className="comment-actions">
                    <Edit
                        type={"comments"}
                        item={comment}
                        inputs={["name", "body"]}
                        setDetails={setDetails}
                        showMessage={showMessage}
                        activity={!isAuthor}
                    />
                    <Delete
                        type={"comments"}
                        id={comment.id}
                        setDetails={setDetails}
                        activity={!isAuthor}
                        showMessage={showMessage}
                        message={message}
                    />
                </div>
            </li>
        </div>
    );
}
export default Comment;
