import { convertHMS } from "../common/utils";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const PlaylistCard = ({
  playlist,
  id,
  title,
  playtime,
  rank,
  created_by,
  created_on,
  user_id,
  user,
  editPlaylist,
  deletePlaylist,
}) => {
  const history = useHistory();

  return (
    <article className="card">
      <div className="card__cover">
        <div className="card__cover-text">
          <h1 className="card__cover-text--title">{title}</h1>
          <h2 className="card__cover-text--subtitle">{convertHMS(playtime)}</h2>
        </div>
        <div className="btn-wrapper">
          <button
            className="btn-wrapper__view"
            onClick={() => history.push(`/playlists/${id}`)}
          >
            Tracklist
          </button>
          {user && (user.role === 1 || user.id === user_id) && (
            <>
              <button
                className="btn-wrapper__edit"
                onClick={() => editPlaylist(playlist)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-wrapper__delete"
                onClick={() => deletePlaylist(id)}
              >
                <FaTrashAlt />
              </button>
            </>
          )}
        </div>
      </div>
      <>
        <h1 className="card__name">Ranking: {rank}</h1>
        <p className="card__about">
          Created: {new Date(created_on).toLocaleDateString("en-US")} by{" "}
          <b>{created_by}</b>
        </p>
      </>
    </article>
  );
};

export default PlaylistCard;
