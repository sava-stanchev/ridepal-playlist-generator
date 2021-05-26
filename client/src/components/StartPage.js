const StartPage = () => {
    
  return(
    <>
    <div className="genres">
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      {/* /playlists/?rock=(null/? ? ? ? ) */}
      <section className="genre-section">
        <button className="genre active">All</button>
        <button className="genre">Genre 1</button>
        <button className="genre">Genre 2</button>
        <button className="genre">Genre 3</button>
        <button className="genre">Genre 4</button>
        <button className="genre">Genre 5</button>
        <button className="genre">Genre 6</button>
        <div className="boxContainer">
          <table className = "elementsContainer">
            <tbody><tr>
              <td>
                <input type="text" placeholder="search by name" className="search" />
              </td>
              <td>
                <>
                  <i className="material-icons">search</i>
                </>
              </td>
            </tr></tbody>
          </table>
        </div>
      </section>
    </div>
    <div className="cards-container">
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">Title</h1>
            <h4 className="cover-subtitle">Subtitle</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn">Details</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">Some name</h1>
          <p className="pl-about">Some info about this</p>
        </div>
      </article>
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">Title</h1>
            <h4 className="cover-subtitle">Subtitle</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn">Details</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">Some name</h1>
          <p className="pl-about">Some info about this</p>
        </div>
      </article>
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">Title</h1>
            <h4 className="cover-subtitle">Subtitle</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn">Details</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">Some name</h1>
          <p className="pl-about">Some info about this</p>
        </div>
      </article>
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">Title</h1>
            <h4 className="cover-subtitle">Subtitle</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn">Details</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">Some name</h1>
          <p className="pl-about">Some info about this</p>
        </div>
      </article>
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">Title</h1>
            <h4 className="cover-subtitle">Subtitle</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn">Details</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">Some name</h1>
          <p className="pl-about">Some info about this</p>
        </div>
      </article>
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">Title</h1>
            <h4 className="cover-subtitle">Subtitle</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn">Details</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">Some name</h1>
          <p className="pl-about">Some info about this</p>
        </div>
      </article>
      <article className="card">
        <div className="cover">
          <div className="cover-text">
            <h1 className="cover-title">Title</h1>
            <h4 className="cover-subtitle">Subtitle</h4>
          </div>
          <div className="view-btn-wrapper">
            <button className="view-btn">Details</button>
          </div>
        </div>
        <div className="description">
          <h1 className="pl-name">Some name</h1>
          <p className="pl-about">Some info about this</p>
        </div>
      </article>
    </div>
    </>
  )    
};

export default StartPage;
