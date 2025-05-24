import  { useState } from 'react';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesBySalonIdQuery
} from '../../store/api/categoryApi';
import { useGetSalonByOwnerIdQuery } from '../../store/api/salonApi';
import { CategoryResponseDto } from '../../types/api';
import { useAuth } from '../../auth/AuthContext';

const Categories = () => {
  const { user } = useAuth();
  const ownerId = user?.profile.sub;
  const { data: salon, isLoading: salonLoading, error: salonError } = useGetSalonByOwnerIdQuery(ownerId as string, {
    skip: !ownerId,
  });
  const salonId = salon?.salonId;
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetCategoriesBySalonIdQuery(salonId as number, {
    skip: !salonId,
  });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryResponseDto | null>(null);
  const [categoryData, setCategoryData] = useState({ name: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCreateCategory = async () => {
    try {
      await createCategory({ category: categoryData, image: imageFile ?? undefined }).unwrap();
      setOpenDialog(false);
      setCategoryData({ name: '' });
      setImageFile(null);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdateCategory = async () => {
  if (!editCategory) return;
  try {
    await updateCategory({
      id: editCategory.id,
      category: categoryData,
      image: imageFile ?? undefined, // Convert null to undefined
    }).unwrap();
    setOpenDialog(false);
    setEditCategory(null);
    setCategoryData({ name: '' });
    setImageFile(null);
  } catch (error) {
    console.error('Failed to update category:', error);
  }
};

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategory(id).unwrap();
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const handleOpenDialog = (category: CategoryResponseDto | null = null) => {
    setEditCategory(category);
    setCategoryData(category ? { name: category.name } : { name: '' });
    setImageFile(null);
    setOpenDialog(true);
  };

  if (salonLoading || categoriesLoading) {
    return (
      <Container maxWidth="lg" className="mt-6 mb-6">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (salonError || categoriesError || !ownerId) {
    return (
      <Container maxWidth="lg" className="mt-6 mb-6">
        <Typography color="error" align="center">
          Failed to load categories. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="mt-6 mb-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-4">
        <Typography variant="h5" className="font-bold">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => handleOpenDialog()}
          disabled={isCreating || isUpdating || isDeleting}
        >
          Add Category
        </Button>
      </Box>
      {categories?.length === 0 ? (
        <Typography className="text-center text-gray-500 py-4">No categories found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {categories?.map((category: CategoryResponseDto) => (
             <Grid size={{ xs: 12, md: 6 , lg:4 }} key={category.id}>
              <Card variant="outlined" className="shadow-md rounded-lg">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" className="mb-2">
                    <Typography variant="h6" className="font-semibold">{category.name}</Typography>
                    <Box display="flex" gap={0.5}>
                      <IconButton
                        size="small"
                        className="text-blue-600"
                        onClick={() => handleOpenDialog(category)}
                        disabled={isCreating || isUpdating || isDeleting}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className="text-red-600"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={isCreating || isUpdating || isDeleting}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                    <Box sx={{ mt: 2, width: '100%' }}>
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${category.image}`}
                        alt={category.name}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '200px', // Adjust this value based on your design
                          width: '100%',
                          height: 'auto',
                          objectFit: 'contain', // Ensures the entire image is visible
                          borderRadius: '8px', // Matches the card's rounded corners
                        }}
                      />
                    </Box>

                    
                
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editCategory ? 'Update Category' : 'Create Category'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={categoryData.name}
            onChange={(e) => setCategoryData({ name: e.target.value })}
            disabled={isCreating || isUpdating}
          />
          <input
            type="file"
            accept="image/jpeg"
            className="mt-2"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            disabled={isCreating || isUpdating}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={isCreating || isUpdating}>
            Cancel
          </Button>
          <Button
            onClick={editCategory ? handleUpdateCategory : handleCreateCategory}
            variant="contained"
            disabled={isCreating || isUpdating || !categoryData.name}
          >
            {editCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Categories;