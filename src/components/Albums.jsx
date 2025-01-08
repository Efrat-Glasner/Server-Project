/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CurrentUser } from "./App";
import { get, post } from "../js/controller";
import "../css/album.css";
import Photos from "./Photos";

function Albums({ showMessage }) {
  const { currentUser } = useContext(CurrentUser);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newAlbum, setNewAlbum] = useState({ title: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriterion, setSearchCriterion] = useState("id");
  const { albumId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await get(`albums?userId=${currentUser.id}`);
        setAlbums(data);
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
      ))
    }
  }, [albums, albumId]);

  const handleAddAlbum = async () => {
    try {
      const newAlbumData = {
        userId: currentUser.id,
        title: newAlbum.title,
      };

      const addedAlbum = await post("albums", newAlbumData);
      setAlbums((prevAlbums) => [addedAlbum, ...prevAlbums]);
      setNewAlbum({ title: "" });
      setIsAdding(false);
      showMessage("Album added successfully!");
    } catch (error) {
      console.error("Error adding the album:", error);
      showMessage("Failed to add the album.");
    }
  };

  const filterAlbums = (albums, query, criterion) => {
    if (!query) return albums;

    return albums.filter((album) => {
      switch (criterion) {
        case "id":
          return album.id.toString().includes(query);
        case "title":
          return album.title.toLowerCase().includes(query.toLowerCase());
        default:
          return albums;
      }
    });
  };

  const filteredAlbums = filterAlbums(albums, searchQuery, searchCriterion);

  return (
    <div className="albums-wrapper">
      <div className="albums-sidebar">
        <div className="albums-header">
          {!isAdding ? (
            <button onClick={() => setIsAdding(true)}>Add Album</button>
          ) : (
            <div className="add-album">
              <input
                type="text"
                placeholder="Album Title"
                value={newAlbum.title}
                onChange={(e) => setNewAlbum({ title: e.target.value })}
              />
              <button
                onClick={handleAddAlbum}
                disabled={!newAlbum.title.trim()}
              >
                Confirm
              </button>
              <button onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          )}

          <div className="search-albums">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              onChange={(e) => setSearchCriterion(e.target.value)}
              value={searchCriterion}
            >
              <option value="id">Search by ID</option>
              <option value="title">Search by Title</option>
            </select>
          </div>
        </div>

        <div className="albums-list">
          {filteredAlbums.map((album) => (
            <div
              key={album.id}
              className={`album-title ${selectedAlbum && selectedAlbum.id === album.id ? "active" : ""
                }`}
              onClick={() => setSelectedAlbum(album)}
            >
              {album.title}
            </div>
          ))}

          {filteredAlbums.length === 0 && searchQuery && (
            <p>No albums found for the given search criteria.</p>
          )}
        </div>
      </div>

      <div className="album-content">
        {selectedAlbum ? (
          <Photos albumId={selectedAlbum.id} albumTitle={selectedAlbum.title} showMessage={showMessage} />
        ) : (
          <div className="placeholder">Select an album to view details</div>
        )}
      </div>
    </div>
  );
}

export default Albums;
