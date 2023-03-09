const express = require('express');
const router = express.Router();
const database = require('../database');
const bodyParser = require('body-parser');
const joi = require('joi');

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());

const laptoplObject = joi.object(
    {
        LaptopName: joi.string().required(),
        LaptopBrand: joi.string().required(),
        LaptopPrice: joi.required(),
        LaptopDesc: joi.string().optional()
});

const laptopObjectUpdate = joi.object(
    {
        LaptopId: joi.required(),
        LaptopName: joi.string().required(),
        LaptopBrand: joi.string().required(),
        LaptopPrice: joi.required(),
        LaptopDesc: joi.string().optional()
});

router.get('/', (req, res) => {
    database.query('SELECT * FROM LAPTOPS', (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            res.send(rows)
        }
    }) 
    
})

router.get('/:id', (req, res) => {
    database.query('SELECT * FROM LAPTOPS WHERE LaptopId=?', [req.params.id], (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            res.send(rows)
        }
    })
})

router.get('/search/laptopname/:name', (req,res) => {
      let laptopName = req.params.name
      database.query('SELECT * FROM laptops WHERE LaptopName Like ?',[laptopName], (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            res.send(rows)
        }
      })
})

router.get('/search/laptopbrand/:brand', (req,res) => {
    let phoneBrand = req.params.brand
    database.query('SELECT * FROM laptops WHERE LaptopBrand Like ?',[laptopBrand], (err, rows) => {
      if(err){
          console.log(err)
      }
      else{
          res.send(rows)
      }
    })
})


router.post('/', (req, res, next) => {
    const {error, value} = laptopObject.validate(req.body)
    if(error)
    {
        console.log(error);
        res.send('Invalid Request. LaptopName or LaptopBrand missing');
    }
    else{
        var laptop = req.body
        if(laptop.PhoneDesc == 0)
           {database.query('INSERT INTO laptops(LaptopName, LaptopBrand, LaptopPrice, LaptopDesc) values (?,?,?,?)', [laptop.LaptopName, laptop.LaptopBrand, laptop.LaptopPrice, laptop.LaptopDesc], (err, rows) => {
            if(err){
                res.send(err)
                console.log(err)
            }
            else{
                if(rows.affectedRows == 1)
                {
                    res.send('Laptop added')
                }
                console.log('Laptop added')
                
            }
           })
        }
    else {
        database.query('INSERT INTO laptops(PhoneName, PhoneBrand, PhonePrice, PhoneDesc) values (?,?,?,?)', [tele.PhoneName, tele.PhoneBrand, tele.PhonePrice, tele.PhoneDesc], (err, rows) => {
            if(err){
                res.send(err)
                console.log(err)
            }
            else{
                if(rows.affectedRows == 1)
                {
                    res.send('Telephone added')
                }
                console.log('Telephone added')
                
            }
        })
    }
}
    
})

router.patch('/', (req, res, next) =>{
    const {error, value} = telephoneObjectUpdate.validate(req.body)
    if(error)
    {
        console.log(error);
        res.send('Invalid Request. PhoneName or PhoneBrand missing');
    }
    else
    {
        const tele = req.body
        database.query('UPDATE telephones SET ? WHERE PhoneId = ' + tele.PhoneId, [tele], (err, rows) => {
        if(err){
                console.log(err)
            }

         else{
                if(rows.affectedRows == 1)
                      res.send('Telephone updated')
                console.log('Telephone updated')
            }
        });
    }
    
});

router.put('/', (req, res) => {
    const {error, value} = telephoneObjectUpdate.validate(req.body)
    if(error)
    {
        console.log(error);
        res.send('Invalid Request. PhoneName or PhoneBrand missing');
    }
    else
    {
        var tele = req.body
        database.query('UPDATE telephones SET ? WHERE PhoneId = ' + tele.PhoneId, [tele], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                if(rows.affectedRows == 0) {
                    database.query('INSERT INTO telephones(PhoneId, PhoneName, PhoneBrand, PhonePrice, PhoneDesc) values (?,?,?,?,?)', [tele.PhoneId, tele.PhoneName, tele.PhoneBrand, tele.PhonePrice, tele.PhoneDesc], (err, rows) => {
                        if(err){
                            console.log(err)
                        }
                        else{
                            if(rows.affectedRows == 1)
                                res.send('Telephone added')
                            console.log('Telephone added')
                        
                        }
                    })
                }
                else
                {
                    if(rows.affectedRows == 1)
                        res.send('Telephone updated')
                    console.log('Telephone updated')
                }
                
            }
        });
    }
   
})

router.delete('/:telephoneId', (req, res, next) => {
    database.query('DELETE FROM telephones where PhoneId=?', [req.params.telephoneId], (err, rows) => {
        if(err){
           
            console.log(err)
        }
        else{
            if(rows.affectedRows == 0)
                 res.send('The telephone with id ' + req.params.telephoneId + ' is not in database')
            else {
                console.log('The Telephone was deleted')
                res.send(rows)
            }
            
        }
    })
});

module.exports = router;

