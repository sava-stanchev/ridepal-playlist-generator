const Login = () => {
    
  return(
    <section className="join-login-main-section">
      <h1 className="join-login-text">
        Welcome
        <span className="accent-text">!</span>
      </h1>
      <form className="join-login-form">
        <div className="input-group">
          <label>Name:</label>
          <input type="text"/>
        </div>
        <div className="input-group">
          <label>Password:</label>
          <input type="password"/>
        </div>
        <div className="input-group">
          <button type="submit" className="btn">Sign in</button>
        </div>
      </form>
    </section>
  )    
};
  
export default Login;
