/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CurrentUser } from "./App";
import { get } from "../js/controller";
import "../css/component.css";
import Photos from "./Photos";
import Add from "./Add";
import Search from "./Search"; // הוספתי את קומפוננטת החיפוש

function Albums({ message, showMessage }) {
  const { currentUser } = useContext(CurrentUser);
  const [albums, setAlbums] = useState([]);
  const [filteredAlbums, setFilteredAlbums] = useState([]); // מצב חדש עבור האלבומים המסוננים
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const { albumId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await get(`albums?userId=${currentUser.id}`);
        setAlbums(data);
        setFilteredAlbums(data); // אתחל גם את האלבומים המסוננים
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };
    fetchAlbums();
  }, [currentUser]);

  useEffect(() => {
    if (selectedAlbum) {
      navigate(`/user/${currentUser.id}/albums/${selectedAlbum.id}/photos`, { replace: true });
    }
  }, [selectedAlbum]);

  useEffect(() => {
    if (albumId && albums) {
      albums.map((album) => (
        (album.id == albumId ? setSelectedAlbum(album) : null)
      ));
    }
  }, [albums, albumId]);
  const handleFilterChange = (filtered) => {
    setFilteredAlbums(filtered); // עדכון הפוסטים המסוננים
  };


  return (
    <div className="albums-wrapper">
      <div className="albums-sidebar">
        <div className="albums-header">
          <Add
            type={"albums"}
            setDetails={setAlbums}
            inputs={["title"]}
            knownFields={{ userId: currentUser.id }}
            showMessage={showMessage}
          />
          <Search
            data={albums} // נשלח את המידע המקורי
            onFilter={(filtered) => setFilteredAlbums(filtered)} // מעדכן את האלבומים המסוננים
            searchFields={["id", "title"]}
          />
        </div>

        <div className="albums-list">
          {filteredAlbums.map((album) => ( // מציג את האלבומים המסוננים
            <div
              key={album.id}
              className={`album-title ${selectedAlbum && selectedAlbum.id === album.id ? "active" : ""}`}
              onClick={() => setSelectedAlbum(album)}
            >
              <p><strong>ID:</strong> {album.id}:<br />{album.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="album-content">
        {selectedAlbum ? (
          <Photos
            album={selectedAlbum}
            setAlbums={setAlbums}
            showMessage={showMessage}
            message={message}
            setSelectedAlbum={setSelectedAlbum}
            onFilter={handleFilterChange} />
        ) : (
          <div className="placeholder">Select an album to view details</div>
        )}
      </div>
      {message && <p className="toast">{message}</p>}
    </div>
  );
}
export default Albums;
