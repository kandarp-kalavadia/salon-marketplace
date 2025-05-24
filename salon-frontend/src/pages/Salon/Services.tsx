import { useState } from 'react';
import {
  Container, Box, Typography, Button, Grid, Card, CardContent, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl,
  InputLabel, Select, MenuItem, Chip, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  useCreateServiceOfferingMutation,
  useUpdateServiceOfferingMutation,
  useDeleteServiceOfferingMutation,
  useGetServiceOfferingsBySalonIdQuery
} from '../../store/api/serviceOfferingApi';
import { useGetCategoriesBySalonIdQuery as useGetCategories } from '../../store/api/categoryApi';
import { useGetSalonByOwnerIdQuery } from '../../store/api/salonApi';
import { ServiceOfferingResponseDto, CategoryResponseDto } from '../../types/api';
import { useAuth } from '../../auth/AuthContext';

const Services = () => {
  const { user } = useAuth()
  const ownerId = user?.profile.sub;
  const { data: salon, isLoading: salonLoading, error: salonError } = useGetSalonByOwnerIdQuery(ownerId as string, {
    skip: !ownerId,
  });
  const salonId = salon?.salonId;
  const { data: services, isLoading: servicesLoading, error: servicesError } = useGetServiceOfferingsBySalonIdQuery(salonId  as number, {
    skip: !salonId,
  });
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetCategories(salonId  as number, {
    skip: !salonId,
  });
  const [createService, { isLoading: isCreating }] = useCreateServiceOfferingMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceOfferingMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceOfferingMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [editService, setEditService] = useState<ServiceOfferingResponseDto | null>(null);
  const [serviceData, setServiceData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: '',
    categoryId: 0,
    available: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCreateService = async () => {
    try {
      await createService({
        serviceOffering: { ...serviceData, price: Number(serviceData.price) },
        image: imageFile ?? undefined
      }).unwrap();
      setOpenDialog(false);
      setServiceData({ name: '', description: '', price: 0, duration: '', categoryId: 0, available: true });
      setImageFile(null);
    } catch (error) {
      console.error('Failed to create service:', error);
    }
  };

  const handleUpdateService = async () => {
    if (!editService) return;
    try {
      await updateService({
        id: editService.id,
        serviceOffering: { ...serviceData, price: Number(serviceData.price) },
        image: imageFile ?? undefined
      }).unwrap();
      setOpenDialog(false);
      setEditService(null);
      setServiceData({ name: '', description: '', price: 0, duration: '', categoryId: 0, available: true });
      setImageFile(null);
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await deleteService(id).unwrap();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleOpenDialog = (service: ServiceOfferingResponseDto | null = null) => {
    setEditService(service);
    setServiceData(service
      ? {
          name: service.name,
          description: service.description || '',
          price: service.price,
          duration: service.duration.toString(),
          categoryId: service.categoryId,
          available: service.available,
        }
      : { name: '', description: '', price: 0, duration: '', categoryId: 0, available: true });
    setImageFile(null);
    setOpenDialog(true);
  };

  if (salonLoading || servicesLoading || categoriesLoading) {
    return (
      <Container maxWidth="lg" className="mt-6 mb-6">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (salonError || servicesError || categoriesError || !ownerId) {
    return (
      <Container maxWidth="lg" className="mt-6 mb-6">
        <Typography color="error" align="center">
          Failed to load services or categories. Please try again later.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="mt-6 mb-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-4">
        <Typography variant="h5" className="font-bold">Services</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => handleOpenDialog()}
          disabled={isCreating || isUpdating || isDeleting}
        >
          Add Service
        </Button>
      </Box>
      {services?.length === 0 ? (
        <Typography className="text-center text-gray-500 py-4">No services found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {services?.map((service: ServiceOfferingResponseDto) => (

            <Grid size={{ xs: 12, md: 6 , lg:4 }} key={service.id}>

              <Card variant="outlined" className="shadow-md rounded-lg">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" className="mb-2">
                    <Typography variant="h6" className="font-semibold">{service.name}</Typography>
                    <Box display="flex" gap={0.5}>
                      <IconButton
                        size="small"
                        className="text-blue-600"
                        onClick={() => handleOpenDialog(service)}
                        disabled={isCreating || isUpdating || isDeleting}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        className="text-red-600"
                        onClick={() => handleDeleteService(service.id)}
                        disabled={isCreating || isUpdating || isDeleting}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography className="text-gray-500 mb-2">{service.description}</Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-2">
                    <Typography className="text-blue-600 font-bold">${service.price.toFixed(2)}</Typography>
                    <Typography className="text-gray-500">{service.duration}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography className="text-gray-500">
                      Category: {categories?.find((c: CategoryResponseDto) => c.id === service.categoryId)?.name || 'N/A'}
                    </Typography>
                    <Chip
                      label={service.available ? 'Active' : 'Inactive'}
                      color={service.available ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  {service.image && (
                    <Box sx={{ mt: 2, width: '100%' }}>
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}${service.image}`}
                        alt={service.name}
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
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editService ? 'Update Service' : 'Create Service'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Service Name"
            fullWidth
            margin="normal"
            value={serviceData.name}
            onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
            disabled={isCreating || isUpdating}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={serviceData.description}
            onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
            disabled={isCreating || isUpdating}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={serviceData.price}
            onChange={(e) => setServiceData({ ...serviceData, price: Number(e.target.value) })}
            disabled={isCreating || isUpdating}
          />
          <TextField
            label="Duration (e.g., PT2H30M)"
            fullWidth
            margin="normal"
            value={serviceData.duration}
            onChange={(e) => setServiceData({ ...serviceData, duration: e.target.value })}
            disabled={isCreating || isUpdating}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={serviceData.categoryId}
              onChange={(e) => setServiceData({ ...serviceData, categoryId: Number(e.target.value) })}
              disabled={isCreating || isUpdating}
            >
              {categories?.map((category: CategoryResponseDto) => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Availability</InputLabel>
            <Select
              value={serviceData.available}
              onChange={(e) => setServiceData({ ...serviceData, available: e.target.value === 'true' })}
              disabled={isCreating || isUpdating}
            >
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
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
            onClick={editService ? handleUpdateService : handleCreateService}
            variant="contained"
            disabled={isCreating || isUpdating || !serviceData.name || !serviceData.duration || !serviceData.categoryId}
          >
            {editService ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Services;