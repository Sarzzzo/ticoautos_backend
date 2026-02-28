const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const authMiddleware = require('../middleware/authMiddleware');

// ROUTES ===========================================================
// POST /api/vehicles
// Private Access
router.post('/', authMiddleware, vehicleController.createVehicle); // public one vehicle
// ===================================================================
// GET /api/vehicles
// Public Access
router.get('/', vehicleController.getVehicles); // public all vehicles  
// ===================================================================

module.exports = router;
