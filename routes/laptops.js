const express = require('express');

const router = express.Router();

router.get('/', (req,res,next) =>{
    res.status(200).json({
        message: 'Handling GET request to /laptops'
    });
});

router.post('/', (req,res,next) =>{
    const laptop = {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        description: req.body.description

    };

    res.status(201).json({
        message: 'Handling POST request to /laptops',
        createdLaptop: laptop
    });
});

router.get('/:laptopId', (req, res, next) => {
    const id = req.params.laptopId;
    if( id === 'special') {
        res.status(200).json({
            message: 'You discover the special id',
            id: id
        });
    }
    else {
        res.status(200).json({
            message: 'You passed an id'
        });
    }
        
});

router.patch('/:laptopId', (req, res, next) =>{
    res.status(200).json({
        message: 'Updated laptop!'
    });
});

router.delete('/:laptopId', (req, res, next) => {
      res.status(200).json({
        message: 'Deleted laptop'
      });
});

module.exports = router;

