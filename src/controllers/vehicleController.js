const Vehicle = require('../models/vehicle');

// CREATE VEHICLE (with optional image)
exports.createVehicle = async (req, res) => {
    try {
        const { brand, model, year, price, description } = req.body;

        const vehicleData = {
            ownerId: req.user.id,
            brand,
            model,
            year,
            price,
            description
        };

        // If an image was uploaded, store the path
        if (req.file) {
            vehicleData.image = '/uploads/' + req.file.filename;
        }

        const newVehicle = new Vehicle(vehicleData);
        const vehicle = await newVehicle.save();
        res.status(201).json(vehicle);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al publicar el vehiculo.' });
    }
};

// GET ALL VEHICLES (Public, with filters and pagination)
exports.getVehicles = async (req, res) => {
    try {
        const { brand, minPrice, maxPrice, status, page = 1, limit = 10 } = req.query;

        let query = {};

        if (brand) query.brand = new RegExp(brand, 'i');
        if (status) query.status = status;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const skip = (page - 1) * limit;

        const vehicles = await Vehicle.find(query)
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const total = await Vehicle.countDocuments(query);

        res.json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            data: vehicles
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los vehiculos.' });
    }
};

// GET SINGLE VEHICLE BY ID
exports.getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;

        const vehicle = await Vehicle.findById(id)
            .populate('ownerId', 'username email')
            .populate({
                path: 'questions',
                populate: [
                    { path: 'authorId', select: 'username' },
                    {
                        path: 'answerId',
                        populate: { path: 'authorId', select: 'username' }
                    }
                ]
            });

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehiculo no encontrado' });
        }

        res.json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del vehiculo.' });
    }
};
