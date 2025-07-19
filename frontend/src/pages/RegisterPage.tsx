import "./css/LoginAndRegister.css";

const RegisterPage = () => {
  return (
    <div className="wrapper">
      <div className="title">Register Form</div>
      <form action="#">
        <div className="field">
          <input type="text" required />
          <label>Username</label>
        </div>
        <div className="field">
          <input type="password" required />
          <label>Password</label>
        </div>
        <div className="field">
          <input type="text" required />
          <label>Email (Optional)</label>
        </div>
        <div className="field">
          <input type="submit" value="Register" />
        </div>
        <div className="signup-link">
          Already a member? <a href="/login">Login now</a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
