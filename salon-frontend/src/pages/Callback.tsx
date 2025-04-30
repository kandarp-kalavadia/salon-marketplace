import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userManager } from "../oidc/UserManager";
import { ExtendedUserProfile } from "../context/AuthContextProvider";

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    userManager
      .signinRedirectCallback()
      .then((user) => {
        const roles = (user.profile as ExtendedUserProfile).roles;
        if (roles && roles.includes("CUSTOMER", 0)) {
          navigate("/customer");
        } else if (roles && roles.includes("SALON_OWNER")) {
          navigate("/salon");
        } else if (roles && roles.includes("ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Callback error:", error);
        navigate("/");
      });
  }, [navigate]);

  return <div>Processing login...</div>;
};

export default Callback;
