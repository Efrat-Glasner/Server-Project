/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
import { CurrentUser } from "../App";
import { get } from "../js/controller";
<<<<<<< HEAD
import '../css/post.css';
=======
import "../css/todo.css";
>>>>>>> 191171edb8ce0fd9278bfb283f5e99f9d57ef59f
import { post } from "../js/controller";
import Post from "./Post";

function Posts({ message, showMessage }) {
    const { currentUser } = useContext(CurrentUser);
    const [posts, setPosts] = useState([]);

    const [statePosts, setStatePosts] = useState("myPosts");
    const [newPost, setNewPost] = useState({ title: "", body: "" });
    const [showAddPost, setShowAddPost] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCriterion, setSearchCriterion] = useState("id");
    const [expandedPosts, setExpandedPosts] = useState({});

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (!currentUser) return;
                const data =
                    statePosts === "myPosts"
                        ? await get(`posts?userId=${currentUser.id}`)
                        : await get("posts");
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [currentUser, statePosts]);

    const togglePosts = () => {
        setStatePosts((prevState) =>
            prevState === "myPosts" ? "allPosts" : "myPosts"
        );
    };

    const filterPosts = (posts, query, criterion) => {
        if (!query) return posts;

        return posts.filter((post) => {
            switch (criterion) {
                case "id":
                    return post.id.toString().includes(query);
                case "title":
                    return post.title.toLowerCase().includes(query.toLowerCase());
                case "body":
                    return post.body.toLowerCase().includes(query.toLowerCase());
                default:
                    return posts;
            }
        });
    };

    const filteredPosts = filterPosts(posts, searchQuery, searchCriterion);


    const handleAddPost = async () => {
        if (!newPost.title.trim() || !newPost.body.trim()) {
            showMessage("Please fill in both fields!");
            return;
        }

        const isDuplicate = posts.some(
            (post) =>
                post.title === newPost.title.trim() &&
                post.body === newPost.body.trim()
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

    const togglePostExpansion = (postId) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
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
                        onChange={(e) =>
                            setNewPost({ ...newPost, title: e.target.value })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Enter post body"
                        value={newPost.body}
                        onChange={(e) =>
                            setNewPost({ ...newPost, body: e.target.value })
                        }
                    />
                    <button
                        onClick={handleAddPost}
                        disabled={!newPost.title || !newPost.body}
                    >
                        Submit
                    </button>
                </div>
            )}

            {message && (
                <p style={{ color: message.includes("successfully") ? "green" : "red" }}>
                    {message}
                </p>
            )}

            <button onClick={togglePosts}>
                {statePosts === "myPosts" ? "All Posts" : "My Posts"}
            </button>

            <div>
                <select
                    onChange={(e) => setSearchCriterion(e.target.value)}
                    value={searchCriterion}
                >
                    <option value="id">Search by ID</option>
                    <option value="title">Search by Title</option>
                    <option value="body">Search by Body</option>
                </select>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {filteredPosts.length === 0 && searchQuery && (
                <p>No posts found for the given search criteria.</p>
            )}

            <div className="posts-container">
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className={`post ${expandedPosts[post.id] ? "expanded" : ""}`}
                    >
                        <h3
                            className="post-title"
                            onClick={() => togglePostExpansion(post.id)}
                        >
                            {post.title}
                        </h3>
                        {expandedPosts[post.id] && (
                            <div>
                                <Post
                                    post={post}
                                    onDelete={(id) => {
                                        setPosts((prevPosts) =>
                                            prevPosts.filter((p) => p.id !== id)
                                        );
                                        showMessage("Post deleted successfully!");
                                    }}
                                    onUpdate={(id, updatedPost) => {
                                        setPosts((prevPosts) =>
                                            prevPosts.map((post) =>
                                                post.id === id ? { ...post, ...updatedPost } : post
                                            )
                                        );
                                        showMessage("Post updated successfully!");
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
}

export default Posts;
