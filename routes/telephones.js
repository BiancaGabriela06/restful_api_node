const express = require('express');
const router = express.Router();
const database = require('../database');

router.get('/', (req, res) => {
    database.query('SELECT * FROM TELEPHONES', (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            console.log(rows)
        }
    })
})

router.get('/:id', (req, res) => {
    database.query('SELECT * FROM TELEPHONES WHERE PhoneId=?', [req.params.id], (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            res.send(rows)
        }
    })
})

/*router.get('/', (req,res,next) =>{
    res.status(200).json({
        message: 'Handling GET request to /telephones'
    });
});

/*router.post('/', (req, res, next) => {
   let telephone = req.body;
    query = "Insert into telephones (PhoneId, PhoneName, PhoneBrand, PhonePrice, PhoneDesc) values (?,?,?,?,?)";
    database.query(query,[telephone.PhoneId, telephone.PhoneName, telephone.PhoneBrand, telephone.PhonePrice, telephone.PhoneDesc], (err, results) => {
        if(!err){
            return res.status(200),json({message: "Telephone Added Successfully"});
        }
        else
          return res.status(500).json(err);
    });
});
*/
router.post('/', (req,res,next) =>{
   const telephone = {
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        description: req.body.description

    };
    res.status(201).json({
        message: 'Handling POST request to /telephones',
        createdTelephone: telephone
    });
});


/*router.get('/:telephoneId', (req, res, next) => {
    const id = req.params.laptopId;
    res.status(200).json({
            message: 'You passed an telephone id',
            id: id
        });
        
});*/

router.patch('/:telephoneId', (req, res, next) =>{
    res.status(200).json({
        message: 'Updated telephone!'
    });
});

router.delete('/:telephoneId', (req, res, next) => {
      res.status(200).json({
        message: 'Deleted telephone'
      });
});

module.exports = router;

