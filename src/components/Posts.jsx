/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { get } from "../js/controller";
import { CurrentUser } from "./App";
import Post from "./Post";
import "../css/post.css";
import Add from "./Add";
import Search from "./Search";

function Posts({ message, showMessage }) {
    const { currentUser } = useContext(CurrentUser);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);

    // קריאת הערך הראשוני מ-localStorage
    const initialShowAllPosts = localStorage.getItem("showAllPosts") === "true";
    const [showAllPosts, setShowAllPosts] = useState(initialShowAllPosts);
    const { postId } = useParams(); // קריאת מזהה הפוסט מה-URL
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const url = showAllPosts ? "posts" : `posts?userId=${currentUser.id}`;
                const data = await get(url);
                setPosts(data);
                setFilteredPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [currentUser, showAllPosts]);

    // טיפול ב-URL עם מזהה פוסט
    useEffect(() => {
        if (postId && filteredPosts.length > 0) {
            const post = filteredPosts.find((post) => post.id == postId);
            if (post) setSelectedPost(post);
        }
    }, [filteredPosts, postId]);

    const handleFilterChange = (filtered) => {
        setFilteredPosts(filtered);
    };

    const toggleView = () => {
        const newView = !showAllPosts;
        setShowAllPosts(newView);
        localStorage.setItem("showAllPosts", newView);
    };

    return (
        <div className="posts-wrapper">
            <div className="posts-sidebar">
                <div className="search-container">
                    <Search
                        data={posts}
                        onFilter={handleFilterChange}
                        searchFields={["id", "title", "body"]}
                    />
                </div>
                <button onClick={toggleView}>
                    {showAllPosts ? "Show My Posts" : "Show All Posts"}
                </button>
                <Add
                    type={"posts"}
                    setDetails={setPosts}
                    inputs={["title", "body"]}
                    knownFields={{ userId: currentUser.id }}
                    showMessage={showMessage}
                />
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className={`post-title ${selectedPost?.id === post.id ? "active" : ""}`}
                        onClick={() => setSelectedPost(post)}
                    >
                        <p>
                            <strong>ID:</strong> {post.id}:<br />
                            {post.title}
                        </p>
                    </div>
                ))}
            </div>

            <div className="post-content">
                {selectedPost ? (
                    <Post
                        post={selectedPost}
                        showMessage={showMessage}
                        setSelectedPost={setSelectedPost}
                        setPosts={setFilteredPosts}
                        onFilter={handleFilterChange}
                    />
                ) : (
                    <div className="placeholder">Select a post to view details</div>
                )}
            </div>
            {message && <p className="toast">{message}</p>}
        </div>
    );
}

export default Posts;

