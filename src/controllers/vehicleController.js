const Vehicle = require('../models/vehicle');

// BUSINESS LOGIC TO CREATE A NEW VEHICLE (Only authenticated users)
exports.createVehicle = async (req, res) => {
    try {
        const { brand, model, year, price, description } = req.body;

        // Thanks to our authMiddleware, we have the req.user with the ID of who made the request
        const newVehicle = new Vehicle({
            ownerId: req.user.id,
            brand,
            model,
            year,
            price,
            description
        });

        const vehicle = await newVehicle.save();
        res.status(201).json(vehicle);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al publicar el vehículo.' });
    }
};

// BUSINESS LOGIC TO GET ALL VEHICLES (Public, with filters and basic pagination)
exports.getVehicles = async (req, res) => {
    try {
        // here we receive the possible filters from the URL (ej: ?brand=Toyota&minPrice=5000)
        const { brand, minPrice, maxPrice, status, page = 1, limit = 10 } = req.query;

        // we build the query object for MongoDB
        let query = {};

        if (brand) query.brand = new RegExp(brand, 'i'); // case insensitive search
        // Explanation of RegExp: it is a regular expression that allows us to search for a 
        // string in a case insensitive way
        // 'i' is the flag for case insensitive search (this case insensitive search 
        // is used to search for a string in a case insensitive way)
        // 'g' is the flag for global search (only example)
        // 'm' is the flag for multiline search (only example)

        if (status) query.status = status;

        // Filtro de rango de precios
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice); // $gte means greater than or equal to
            if (maxPrice) query.price.$lte = Number(maxPrice); // $lte means less than or equal to
        }

        // math pagination, this is to limit the number of vehicles per page
        // (page - 1) * limit, this is to skip the number of vehicles per page
        const skip = (page - 1) * limit;

        const vehicles = await Vehicle.find(query)
            .skip(skip) // skip the number of vehicles per page
            .limit(Number(limit)) // limit the number of vehicles per page
            .sort({ createdAt: -1 }); // the most recent first

        const total = await Vehicle.countDocuments(query);

        res.json({
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit), // ceil is used to round up the number of pages
            data: vehicles // the vehicles data
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los vehículos.' });
    }
};
