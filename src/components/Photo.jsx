/* eslint-disable react/prop-types */
import "../css/photo.css";
import Edit from "./Edit";
import Delete from "./Delete";

function Photo({ photo, setPhotos, showMessage }) {
  return (
    <div className="photo-card">
      <img src={photo.thumbnailUrl} alt={photo.title} className="photo-img" />
      <p className="photo-title">{photo.title}</p>
      <div className="photo-buttons">
        <Delete
          types={["photos"]}
          id={photo.id}
          setDetails={setPhotos}
          activity={false}
          showMessage={showMessage}
        />
        <Edit
          type="photos"
          item={photo}
          inputs={["title", "thumbnailUrl"]}
          setDetails={setPhotos}
          showMessage={showMessage}
          isAuthor={false}
        />
      </div>
    </div>
  );
}

export default Photo;
