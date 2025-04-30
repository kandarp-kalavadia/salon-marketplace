import { Button } from "@mui/material";
import useAuth from "../hooks/useAuth";

const Home: React.FC = () => {
  const { login, user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-3xl">Salon Marketplace</h1>
      {!user ? (
        <Button variant="contained" onClick={login} className="mt-4">
          Login
        </Button>
      ) : (
        <p>Welcome, {user.profile.preferred_username}</p>
      )}
    </div>
  );
};

export default Home;
