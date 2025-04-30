import { Typography } from "@mui/material";

const Unauthorized: React.FC = () => {
  return (
    <div className="p-4">
      <Typography variant="h2">Unauthorized</Typography>
      <Typography>You do not have permission to access this page.</Typography>
    </div>
  );
};

export default Unauthorized;
