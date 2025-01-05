/* eslint-disable react/prop-types */
import { useEffect, useContext, useState } from "react";
import { CurrentUser } from "./App";
import { get } from "../js/controller";
import '../css/post.css';
import { post } from "../js/controller";
import Album from "./Album";
function Albums() {
    const { currentUser } = useContext(CurrentUser);
    const [albums, setAlbums] = useState([]);
    useEffect(() => {
        const fetchAlbums = async () => {
          try {
            if (!currentUser) return;
            const data = await get(`albums?userId=${currentUser.id}`);
            setAlbums(data);
          } catch (error) {
            console.error("Error fetching todos:", error);
          }
        };
      
        fetchAlbums();
      }, [currentUser]);
    return (
        <>
            <h1>Albums</h1>
            {albums.map((album) => (
                <div key={album.id} >
                   
                <Album album={album}/>

                </div>
            ))}
        </>
    )
}
export default Albums;