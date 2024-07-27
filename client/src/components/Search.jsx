import { FaSearch } from "react-icons/fa";

export default function Search({ setSearch }) {
  return (
    <div className="search">
      <table className="search__container">
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                placeholder="search by name"
                className="search__input"
                onChange={(e) => setSearch(e.target.value)}
              />
            </td>
            <td>
              <FaSearch />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
