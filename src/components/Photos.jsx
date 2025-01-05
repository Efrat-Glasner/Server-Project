/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { get, post } from "../js/controller";
import Photo from "./Photo";

function Photos({ albumId }) {
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
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

    const handleDelete = async (id) => {
        try {
            // מחיקה מהשרת (אם נחוץ)
            // await post(`photos/${id}`, { method: "DELETE" });

            // מחיקה מקומית
            setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== id));
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    };

    const handleUpdate = async (id, updatedPhoto) => {
        try {
            // עדכון בשרת (אם נחוץ)
            // await post(`photos/${id}`, { ...updatedPhoto });

            // עדכון מקומי
            setPhotos((prevPhotos) =>
                prevPhotos.map((photo) =>
                    photo.id === id ? { ...photo, ...updatedPhoto } : photo
                )
            );
        } catch (error) {
            console.error("Error updating photo:", error);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    return (
        <div style={{ margin: "10px", padding: "10px", border: "1px dashed blue" }}>
            <h3>Photos for Album ID: {albumId}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {photos.map((photo) => (
                    <Photo
                        key={photo.id}
                        photo={photo}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                    />
                ))}
            </div>
            {hasMore && (
                <button onClick={fetchPhotos} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
                    Load More
                </button>
            )}
        </div>
    );
}

export default Photos;
