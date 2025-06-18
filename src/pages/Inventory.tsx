import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Slider,
  Button,
  Container,
  SelectChangeEvent,
  Grid
} from '@mui/material';
import { Car } from 'lucide-react';
import api from '../services/api';

interface CarListing {
  id: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  image_url: string;
}

const Inventory: React.FC = () => {
  const [cars, setCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter states
  const [brand, setBrand] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2024]);
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');

  // Available filter options
  const [brands, setBrands] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [transmissionTypes, setTransmissionTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchCars();
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const response = await api.get('/inventory/filter-options');
      setBrands(response.data.brands);
      setFuelTypes(response.data.fuel_types);
      setTransmissionTypes(response.data.transmission_types);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory', {
        params: {
          brand,
          min_price: priceRange[0],
          max_price: priceRange[1],
          min_year: yearRange[0],
          max_year: yearRange[1],
          fuel_type: fuelType,
          transmission,
          sort_by: sortBy
        }
      });
      setCars(response.data);
    } catch (err: any) {
      setError(err.message || 'Error fetching cars');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchCars();
  };

  const handleReset = () => {
    setBrand('');
    setPriceRange([0, 1000000]);
    setYearRange([1990, 2024]);
    setFuelType('');
    setTransmission('');
    setSortBy('price_asc');
    fetchCars();
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Car Inventory
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Brand</InputLabel>
              <Select
                value={brand}
                label="Brand"
                onChange={(e: SelectChangeEvent) => setBrand(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={fuelType}
                label="Fuel Type"
                onChange={(e: SelectChangeEvent) => setFuelType(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {fuelTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Transmission</InputLabel>
              <Select
                value={transmission}
                label="Transmission"
                onChange={(e: SelectChangeEvent) => setTransmission(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {transmissionTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e: SelectChangeEvent) => setSortBy(e.target.value)}
              >
                <MenuItem value="price_asc">Price: Low to High</MenuItem>
                <MenuItem value="price_desc">Price: High to Low</MenuItem>
                <MenuItem value="year_desc">Year: Newest First</MenuItem>
                <MenuItem value="year_asc">Year: Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={0}
              max={1000000}
              step={1000}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">${priceRange[0].toLocaleString()}</Typography>
              <Typography variant="caption">${priceRange[1].toLocaleString()}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography gutterBottom>Year Range</Typography>
            <Slider
              value={yearRange}
              onChange={(_, newValue) => setYearRange(newValue as [number, number])}
              valueLabelDisplay="auto"
              min={1990}
              max={2024}
              step={1}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">{yearRange[0]}</Typography>
              <Typography variant="caption">{yearRange[1]}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleFilter} fullWidth>
                Apply Filters
              </Button>
              <Button variant="outlined" onClick={handleReset} fullWidth>
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Car Listings */}
      <Grid container spacing={3}>
        {cars.length === 0 ? (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <Typography>No cars found matching your criteria</Typography>
            </Box>
          </Grid>
        ) : (
          cars.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={car.image_url || '/placeholder-car.jpg'}
                  alt={`${car.brand} ${car.model}`}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {car.brand} {car.model}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {car.year} • {car.transmission} • {car.fuel_type}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${car.price.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {car.mileage.toLocaleString()} miles
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Inventory; 