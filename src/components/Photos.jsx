/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { get } from "../js/controller";
import Photo from "./Photo";
import "../css/photo.css";
import Add from "./Add";
function Photos({ albumId, albumTitle, showMessage }) {
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const PHOTOS_PER_PAGE = 10;
    const isFetching = useRef(false);
    // const isValidUrl = (url) => {
    //     try {
    //         new URL(url);
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // };
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
            </div>
            <Add
                type={"photos"}
                setDetails={setPhotos}
                inputs={["title", "thumbnailUrl"]}
                knownFields={{ albumId: albumId, }}
                showMessage={showMessage}
            />
            <div className="photos-list">
                {photos.map((photo) => (
                    <Photo
                        key={photo.id}
                        showMessage={showMessage}
                        photo={photo}
                        setPhotos={setPhotos}
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
