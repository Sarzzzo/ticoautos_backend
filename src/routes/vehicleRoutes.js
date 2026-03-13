const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateToken } = require('../middleware/authMiddleware');

// ROUTES ===========================================================
// POST /api/vehicles
// Private Access
router.post('/', authenticateToken, vehicleController.createVehicle); // public one vehicle
// ===================================================================
// GET /api/vehicles
// Public Access
router.get('/', vehicleController.getVehicles); // public all vehicles  

// GET /api/vehicles/:id
// Public Access (Detail view)
router.get('/:id', vehicleController.getVehicleById); 
// ===================================================================

module.exports = router;
