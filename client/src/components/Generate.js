const GeneratePageOne = () => {
    
    return(
      <section className="join-login-main-section">
        <h1 className="join-login-text">
          Choose your
          <span className="accent-text"> route!</span>
        </h1>
        <form className="join-login-form">
          <div className="input-group">
            <label>Travelling from:</label>
            <input type="text"/>
          </div>
          <div className="input-group">
            <label>Travelling to:</label>
            <input type="text"/>
          </div>
          <div className="input-group">
            <button type="submit" className="btn">Next</button>
          </div>
        </form>
      </section>
    )    
  };
    
  export default GeneratePageOne;
  