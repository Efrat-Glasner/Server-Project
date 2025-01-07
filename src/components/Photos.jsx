/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { get, post } from "../js/controller";
import Photo from "./Photo";

function Photos({ albumId, showMessage, message }) {
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newPhoto, setNewPhoto] = useState({ url: "", title: "" });
    const PHOTOS_PER_PAGE = 10;
    const isFetching = useRef(false);

    const fetchPhotos = async () => {
        if (isFetching.current || !hasMore) return;
        isFetching.current = true;

        try {
            const startIndex = page * PHOTOS_PER_PAGE;
            const endpoint = `photos?albumId=${albumId}&_start=${startIndex}&_limit=${PHOTOS_PER_PAGE}`;
            const data = await get(endpoint);

            setPhotos((prevPhotos) => [...prevPhotos, ...data]);
            if (data.length < PHOTOS_PER_PAGE) {
                setHasMore(false);
            } else {
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            isFetching.current = false;
        }
    };

    const handleAddPhoto = async () => {
        try {
            const newPhotoData = {
                albumId: albumId,
                title: newPhoto.title,
                thumbnailUrl: newPhoto.url,
                url:newPhoto.url
            };
            const addedPhoto = await post("photos", newPhotoData); // קריאה לפונקציית POST
            setPhotos((prevPhotos) => [addedPhoto, ...prevPhotos]); // הוספת התמונה החדשה לסטייט
            setNewPhoto({ url: "", title: "" }); // איפוס השדות
            setIsAdding(false); // סיום מצב הוספה
            showMessage("Photo added successfully!");
        } catch (error) {
            console.error("Error adding the photo:", error);
            showMessage("Failed to add the photo.");
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    return (
        <div style={{ margin: "10px", padding: "10px", border: "1px dashed blue" }}>
            <h3>Photos for Album ID: {albumId}</h3>
            {/* כפתור הוספה */}
            {!isAdding ? (
                <button onClick={() => setIsAdding(true)} style={{ marginBottom: "10px" }}>
                    Add Photo
                </button>
            ) : (
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        style={{ marginRight: "5px" }}
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                        style={{ marginRight: "5px" }}
                    />
                    <button
                        onClick={handleAddPhoto}
                        disabled={!newPhoto.url.trim() || !newPhoto.title.trim()}
                    >
                        Confirm
                    </button>
                    <button onClick={() => setIsAdding(false)} style={{ marginLeft: "5px" }}>
                        Cancel
                    </button>
                </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {photos.map((photo) => (
                    <Photo
                        key={photo.id}
                        photo={photo}
                        onDelete={(id) => {
                            setPhotos((prevPhotos) =>
                                prevPhotos.filter((photo) => photo.id !== id)
                            );
                            showMessage("Photo deleted successfully!");
                        }}
                        onUpdate={(id, updatedPhoto) => {
                            setPhotos((prevPhotos) =>
                                prevPhotos.map((photo) =>
                                    photo.id === id ? { ...photo, ...updatedPhoto } : photo
                                )
                            );
                            showMessage("Photo updated successfully!");
                        }}
                    />
                ))}
            </div>

            {/* הודעה למשתמש */}
            {message && <p className="toast">{message}</p>}

            {hasMore && (
                <button
                    onClick={fetchPhotos}
                    style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
                >
                    Load More
                </button>
            )}
        </div>
    );
}

export default Photos;
