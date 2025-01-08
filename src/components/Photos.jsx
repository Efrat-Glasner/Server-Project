/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { get, post } from "../js/controller";
import Photo from "./Photo";
import "../css/photo.css";
function Photos({ albumId, albumTitle, showMessage }) {
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newPhoto, setNewPhoto] = useState({ url: "", title: "" });
    const PHOTOS_PER_PAGE = 10;
    const isFetching = useRef(false);
    
    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const fetchPhotos = async (reset = false) => {
        if (isFetching.current || (!reset && !hasMore)) return;
        isFetching.current = true;

        try {
            const currentPage = reset ? 0 : page;
            const startIndex = currentPage * PHOTOS_PER_PAGE;
            const endpoint = `photos?albumId=${albumId}&_start=${startIndex}&_limit=${PHOTOS_PER_PAGE}`;
            const data = await get(endpoint);

            setPhotos((prevPhotos) => (reset ? data : [...prevPhotos, ...data]));
            setHasMore(data.length === PHOTOS_PER_PAGE);
            setPage(reset ? 1 : currentPage + 1);
        } catch (error) {
            console.error("Error fetching photos:", error);
            showMessage("Failed to load photos. Please try again.");
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
                url: newPhoto.url,
            };
            const addedPhoto = await post("photos", newPhotoData);
            setPhotos((prevPhotos) => [addedPhoto, ...prevPhotos]);
            setNewPhoto({ url: "", title: "" });
            setIsAdding(false);
            showMessage("Photo added successfully!");
        } catch (error) {
            console.error("Error adding the photo:", error);
            showMessage("Failed to add the photo.");
        }
    };

    useEffect(() => {
        setPhotos([]);
        setPage(0);
        setHasMore(true);
        fetchPhotos(true);
    }, [albumId]);

    return (
        <div className="photos-wrapper">
            <div className="album-title-wrapper">
                <h1 className="album-title">{albumTitle}</h1>
                {!isAdding ? (
                    <button onClick={() => setIsAdding(true)}>Add Photo</button>
                ) : (
                    <button onClick={() => setIsAdding(false)}>Cancel</button>
                )}
            </div>

            <div className={`add-photo ${isAdding ? 'active' : ''}`}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="URL"
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                />
                <button
                    onClick={handleAddPhoto}
                    disabled={
                        !newPhoto.url.trim() ||
                        !newPhoto.title.trim() ||
                        !isValidUrl(newPhoto.url)
                    }
                >
                    Confirm
                </button>
            </div>

            <div className="photos-list">
                {photos.map((photo) => (
                    <Photo
                        key={photo.id}
                        showMessage={showMessage}
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

            {hasMore && (
                <button onClick={() => fetchPhotos(false)}>
                    Load More
                </button>
            )}
        </div>

    );
}

export default Photos;
