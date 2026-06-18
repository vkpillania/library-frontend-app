import Login from "../components/login";
import Logoff from "../components/logoff";
export default function LoginSection() {
    const isLoggedIn = localStorage.getItem("auth_token") !== null;

  if (isLoggedIn) {
    return (
      <Logoff />
    );
  }
  return (
    <Login />
  );
}
