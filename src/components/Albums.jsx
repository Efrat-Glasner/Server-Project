/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CurrentUser } from "./App";
import { get } from "../js/controller";
import "../css/album.css";
import Photos from "./Photos";
import Add from "./Add";

function Albums({ message, showMessage }) {
  const { currentUser } = useContext(CurrentUser);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
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
          <Add
            type={"albums"}
            setDetails={setAlbums}
            inputs={["title"]}
            knownFields={{ userId: currentUser.id }}
            showMessage={showMessage}
          />
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
              <p> <strong> ID:</strong> {album.id}:<br></br> {album.title}</p>
            </div>
          ))}

          {filteredAlbums.length === 0 && searchQuery && (
            <p>No albums found for the given search criteria.</p>
          )}
        </div>
      </div>
      <div className="album-content">
        {selectedAlbum ? (
          <Photos albumId={selectedAlbum.id} albumTitle={selectedAlbum.title} showMessage={showMessage} message={message} />
        ) : (
          <div className="placeholder">Select an album to view details</div>
        )}
      </div>
      {message && <p className="toast">{message}</p>}

    </div>
  );
}
export default Albums;
