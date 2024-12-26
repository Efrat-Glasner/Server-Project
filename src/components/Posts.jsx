import { useEffect, useContext, useState } from "react";
import { CurrentUser } from "../App";
import { get } from "../js/controller";
import '../css/todo.css';
import { post } from "../js/controller";
import Post from "./Post";

function Posts() {
    const { currentUser } = useContext(CurrentUser);
    const [posts, setPosts] = useState([]); // סטייט לשמירת המשימות
    const [message, setMessage] = useState(""); // סטייט להצגת הודעה למשתמש
    const [messageTimeout, setMessageTimeout] = useState(null); // סטייט לשמירת timeout של ההודעה
    const [statePosts, setStatePosts] = useState('myPosts'); // סטייט למצב הפוסטים
    const [newPost, setNewPost] = useState({ title: "", body: "" }); // סטייט לשמירת הפוסט החדשה שהמשתמש מקיש
    const [showAddPost, setShowAddPost] = useState(false); // סטייט לקביעה אם להציג את ה-DIV להוספת פוסט

    useEffect(() => {
        const fetchposts = async () => {
            try {
                if (!currentUser) return;
                const data = statePosts === 'myPosts'
                    ? await get(`posts?userId=${currentUser.id}`)
                    : await get('posts');
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchposts();
    }, [currentUser, statePosts]);

    const togglePosts = () => {
        setStatePosts((prevState) => (prevState === 'myPosts' ? 'allPosts' : 'myPosts'));
    };

    const showMessage = (msg) => {
        // אם יש הודעה קיימת, מבצעים איפוס של timeout
        if (messageTimeout) {
            clearTimeout(messageTimeout);
        }

        setMessage(msg);

        // הגדרת timeout חדש למחיקת ההודעה
        const timeout = setTimeout(() => {
            setMessage(""); // איפוס ההודעה לאחר 2 שניות
        }, 2000);

        setMessageTimeout(timeout); // שמירת ה-timeout בסטייט
    };

    const handleAddPost = async () => {
        if (!newPost.title.trim() || !newPost.body.trim()) {
            showMessage("Please fill in both fields!");
            return;
        }

        const isDuplicate = posts.some(
            (post) =>
                post.title === newPost.title.trim() && post.body === newPost.body.trim()
        );

        if (isDuplicate) {
            showMessage("The post already exists!");
            return;
        }

        const newPostData = {
            userId: currentUser.id,
            title: newPost.title.trim(),
            body: newPost.body.trim(),
        };

        try {
            const addedPost = await post("posts", newPostData);
            setPosts((prevPosts) => [...prevPosts, addedPost]);
            setNewPost({ title: "", body: "" });
            showMessage("The post was added successfully!");
        } catch (error) {
            showMessage("Failed to add the post.");
            console.error(error);
        }
    };

    return (
        <>
            <h1>Posts</h1>

            <button onClick={() => setShowAddPost((prev) => !prev)}>
                {showAddPost ? "Cancel" : "Add Post"}
            </button>

            {showAddPost && (
                <div className="add-post-container">
                    <input
                        type="text"
                        placeholder="Enter post title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Enter post body"
                        value={newPost.body}
                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                    />
                    <button
                        onClick={handleAddPost}
                        disabled={!newPost.title || !newPost.body}
                    >
                        Submit
                    </button>
                </div>
            )}

            {message && <p style={{ color: message.includes("successfully") ? "green" : "red" }}>{message}</p>}

            <button onClick={togglePosts}>
                {statePosts === 'myPosts' ? 'All Posts' : 'My Posts'}
            </button>
            <div className="posts-container">
                {posts.map((post) => (
                    <div key={post.id}>
                        <Post post={post}
                            onDelete={(id) => {
                                setPosts((prevPosts) => prevPosts.filter((p) => p.id !== id));
                                showMessage("Task deleted successfully!");
                            }}
                            onUpdate={(id, updatedPost) => {
                                setPosts((prevPosts) =>
                                    prevPosts.map((post) =>
                                        post.id === id ? { ...post, ...updatedPost } : post
                                    )
                                );
                                showMessage("Task updated successfully!");
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}

export default Posts;
