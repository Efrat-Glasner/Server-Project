/* eslint-disable react/prop-types */
import { useState } from "react";
import Photos from "./Photos"; // נניח שהקומפוננטה קיימת

function Album({ album }) {
    const [showPhotos, setShowPhotos] = useState(false);

    const handleAlbumClick = () => {
        setShowPhotos(!showPhotos); // מחליף את מצב ההצגה
    };

    return (
        <>
            <div onClick={handleAlbumClick} style={{ cursor: "pointer", border: "1px solid black", margin: "10px", padding: "10px" }}>
                <p><strong>ID:</strong> {album.id}</p>
                <p><strong>Title:</strong> {album.title}</p>
            </div>
            {showPhotos && <Photos albumId={album.id} />} {/* מציג את קומפוננטת Photos */}
        </>
    );
}

export default Album;
