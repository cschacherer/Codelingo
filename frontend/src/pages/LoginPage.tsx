import "./css/LoginAndRegister.css";

const LoginPage = () => {
  return (
    <div className="wrapper">
      <div className="title">Login Form</div>
      <form action="#">
        <div className="field">
          <input type="text" required />
          <label>Username</label>
        </div>
        <div className="field">
          <input type="password" required />
          <label>Password</label>
        </div>
        <div className="content">
          <div className="checkbox">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <div className="pass-link">
            <a href="/forgotpassword">Forgot password?</a>
          </div>
        </div>
        <div className="field">
          <input type="submit" value="Login" />
        </div>
        <div className="signup-link">
          Not a member? <a href="/register">Sign up now</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
