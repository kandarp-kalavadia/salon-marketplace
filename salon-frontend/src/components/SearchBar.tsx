import React from 'react';
import { Box, TextField, InputAdornment, Button, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useLocation } from 'react-router-dom';

interface SearchBarProps {
  initialSearchTerm?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  initialSearchTerm = '',
}) => {
  const [searchTerm, setSearchTerm] = React.useState(initialSearchTerm);
  const navigate = useNavigate();
  const location = useLocation();

  // Update search term from URL params on component mount or URL change
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') || initialSearchTerm;
    setSearchTerm(search);
  }, [location.search, initialSearchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
          document.getElementById('search-section')?.scrollIntoView({
                      behavior: 'smooth',
                    });
      // Always navigate to homepage with search term
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);

    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        maxWidth: 600,
        mx: 4,
        display: { xs: 'block', md: 'block' },
      }}
    >
      <Grid container spacing={0} alignItems="center">
        <Grid size={{ xs: 8, md: 10 }}>
          <TextField
            fullWidth
            placeholder="Search salons, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'grey.400' }} />
                </InputAdornment>
              ),
              sx: {
                bgcolor: 'grey.50',
                borderRadius: 3,
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: '1px solid',
                  borderColor: 'primary.main',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: '2px solid',
                  borderColor: 'primary.main',
                },
              },
            }}
            onKeyUp={(e) => {
              if (searchTerm.trim()) {
                handleSearch();
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ ml: 1, borderRadius: 3,display: { xs: 'none', md: 'block' } }}
            disabled={!searchTerm.trim()}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SearchBar;