const Register = () => {
    
    return(
      <section className="join-login-main-section">
        <h1 className="join-login-text">
          Join and
          <span className="accent-text"> generate!</span>
        </h1>
        <form className="join-login-form">
          <div className="input-group">
            <label>Name:</label>
            <input type="text"/>
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input type="email"/>
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input type="password"/>
          </div>
          <div className="input-group">
            <button type="submit" className="btn">Join Now</button>
          </div>
        </form>
      </section>
    )    
  };
    
  export default Register;
