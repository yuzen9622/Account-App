import React, { useContext } from "react";
import { url } from "../service";
import { useGoogleLogin } from "@react-oauth/google";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
export default function GoogleLoginButton() {
  const { setUser, setMessage } = useContext(UserContext);
  const navgate = useNavigate();
  const loginGoogleUser = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        // 把 Google 的 id_token 傳給後端驗證
        const res = await fetch(`${url}/users/auth/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: codeResponse.code,
          }),
        });
        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("account-user", JSON.stringify(data));
          navgate("/dash/");
          setUser(data);
          setMessage({ status: "success", text: "登入成功", open: true });
        } else {
          setMessage({ status: "error", text: data.error, open: true });
        }
      } catch (error) {
        console.error("Login failed", error);
      }
    },
    onError: () => console.error("Login failed"),
  });
  return (
    <button
      type="button"
      onClick={() => loginGoogleUser()}
      className="google-login-btn"
    >
      <GoogleIcon style={{ marginRight: "10px" }} />以 Google 登入
    </button>
  );
}
