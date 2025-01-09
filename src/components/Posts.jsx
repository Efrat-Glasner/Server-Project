/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { get } from "../js/controller";
import { CurrentUser } from "./App";
import Post from "./Post";
import "../css/post.css";
import Add from "./Add";

function Posts({ message, showMessage }) {
    const { currentUser } = useContext(CurrentUser);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showAddPost, setShowAddPost] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchCriterion, setSearchCriterion] = useState("id");
    const [showAllPosts, setShowAllPosts] = useState(false);
    const { postId } = useParams();
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const url = showAllPosts ? "posts" : `posts?userId=${currentUser.id}`;
                const data = await get(url);
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [currentUser, showAllPosts]);
    useEffect(() => {
        if (postId && posts) {
            posts.map((post) => (
                (post.id == postId ? setSelectedPost(post) : null)
            ))
        }
    }, [posts, postId]);
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


    // const handleAddPost = async () => {
    //     if (!newPost.title.trim() || !newPost.body.trim()) {
    //         showMessage("Please fill in both fields!");
    //         return;
    //     }

    //     const newPostData = {
    //         userId: currentUser.id,
    //         title: newPost.title.trim(),
    //         body: newPost.body.trim(),
    //     };

    //     try {
    //         const addedPost = await post("posts", newPostData);
    //         setPosts((prevPosts) => [...prevPosts, addedPost]);
    //         setNewPost({ title: "", body: "" });
    //         showMessage("The post was added successfully!");
    //     } catch (error) {
    //         showMessage("Failed to add the post.");
    //         console.error(error);
    //     }
    // };

    const getPlaceholderText = () => {
        switch (searchCriterion) {
            case "id":
                return "Search by ID";
            case "title":
                return "Search by Title";
            case "body":
                return "Search by Body";
            default:
                return "Search";
        }
    };

    return (
        <div className="posts-wrapper">
            {/* Sidebar */}
            <div className="posts-sidebar">
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            placeholder={getPlaceholderText()}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select
                            className="search-dropdown"
                            value={searchCriterion}
                            onChange={(e) => setSearchCriterion(e.target.value)}
                        >
                            <option value="id">ID</option>
                            <option value="title">Title</option>
                            <option value="body">Body</option>
                        </select>
                    </div>
                </div>
                 <button onClick={() => setShowAddPost((prev) => !prev)}>
                    {showAddPost ? "Cancel" : "Add Post"}
                </button>
                <button onClick={() => setShowAllPosts((prev) => !prev)}>
                    {showAllPosts ? "Show My Posts" : "Show All Posts"}
                </button>

                {showAddPost && (
                     <Add
                     type={"posts"}
                     setDetails={setPosts}
                     inputs={["title","body"]}
                     knownFields={{userId:currentUser.id}}
                     showMessage={showMessage}
 
                 />
                )} 
                {filteredPosts.map((post) => (
                    <div
                        key={post.id}
                        className={`post-title ${selectedPost?.id === post.id ? "active" : ""}`}
                        onClick={() => setSelectedPost(post)}
                    >
                        <p> <strong> ID:</strong> {post.id}:<br></br> {post.title}</p>

                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="post-content">
                {selectedPost ? (
                    <Post
                        post={selectedPost}
                        showMessage={showMessage}
                        setSelectedPost={setSelectedPost}
                        setPosts={setPosts}
                        onUpdate={(id, updatedPost) => {
                            setPosts((prevPosts) =>
                                prevPosts.map((post) =>
                                    post.id === id ? { ...post, ...updatedPost } : post
                                )
                            );
                            showMessage("Post updated successfully!");
                        }}
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
