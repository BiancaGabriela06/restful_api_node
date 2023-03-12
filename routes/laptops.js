const express = require('express');
const router = express.Router();
const database = require('../database');
const bodyParser = require('body-parser');
const joi = require('joi');

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());

///Validare pentru Adaugare
const laptopObject = joi.object(
    {
        LaptopName: joi.string().required(),
        LaptopBrand: joi.string().required(),
        LaptopPrice: joi.required(),
        LaptopDesc: joi.string().optional()
});

/// Validare pentru Update
const laptopObjectUpdate = joi.object(
    {
        LaptopId: joi.required(),
        LaptopName: joi.string().required(),
        LaptopBrand: joi.string().required(),
        LaptopPrice: joi.required(),
        LaptopDesc: joi.string().optional()
});

router.get('/', (req, res) => {
    var laptopId = req.query.laptopid;
    var laptopName = req.query.laptopname;
    var laptopBrand = req.query.laptopbrand;
    var laptopPrice = req.query.laptopprice;
    var sign = req.query.sign;

    /// Daca nu avem niciun query, afisam toate laptopuri
    if(laptopId == null && laptopName == null && laptopBrand == null && laptopPrice == null)
    {
        database.query('SELECT * FROM LAPTOPS', (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }

    ///Cautam dupa id unic
    else if (laptopId != null && laptopName == null && laptopBrand == null && laptopPrice == null)
    {
        database.query('SELECT * FROM LAPTOPS Where LaptopId =? ', [laptopId], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }

    ///Cautam dupa nume
    else if (laptopId == null && laptopName != null && laptopBrand == null && laptopPrice == null)
    {
        database.query('SELECT * FROM LAPTOPS Where LaptopName like ? ', [laptopName], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }

    ///Cautam dupa brand
    else if(laptopId == null && laptopName == null && laptopBrand != null && laptopPrice == null)
    {
        database.query('SELECT * FROM LAPTOPS Where LaptopBrand like ? ', [laptopBrand], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }

    ///Afisare laptopuri de la un brand X care au pretul mai mare/mai mic decat o valoare data
    else if(laptopId == null && laptopName == null && laptopBrand != null && laptopPrice != null && sign!=null)
    {
        if(sign == '>') /// preturi mai mari
            database.query('SELECT * FROM LAPTOPS WHERE LaptopBrand like ? and LaptopPrice >= ' + laptopPrice, [laptopBrand], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        })

        else if(sign == '<')
        database.query('SELECT * FROM LAPTOPS WHERE LaptopBrand like ? and LaptopPrice <= ' + laptopPrice, [laptopBrand], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        })
    }
    ///Afisam laptopurile care au pretul mai mic/mai mare decat o valoare data
    else if(laptopId == null && laptopName == null && laptopBrand == null && laptopPrice != null && sign!=null){
        if(sign == '>') /// preturi mai mari
            database.query('SELECT * FROM LAPTOPS WHERE LaptopPrice >= ' + laptopPrice, (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
    })
        else if(sign == '<')
            database.query('SELECT * FROM LAPTOPS WHERE LaptopPrice <= ' + laptopPrice,  (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        })
    }
    
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
        
        database.query('INSERT INTO LAPTOPS (LaptopName, LaptopBrand, LaptopPrice, LaptopDesc) values (?,?,?,?)',
        [laptop.LaptopName, laptop.LaptopBrand, laptop.LaptopPrice, laptop.LaptopDesc], (err, rows) => {
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
    
})

router.patch('/', (req, res, next) =>{
    const {error, value} = laptopObjectUpdate.validate(req.body)
    if(error)
    {
        console.log(error);
        res.send('Invalid Request. LaptopName or LaptopBrand missing');
    }
    else
    {
        const laptop = req.body
        database.query('UPDATE laptops SET ? WHERE LaptopId = ' + laptop.LaptopId, [laptop], (err, rows) => {
        if(err){
                console.log(err)
            }

         else{
                if(rows.affectedRows == 1)
                      res.send('Laptop updated')
                console.log('Laptop updated')
            }
        });
    }
    
});

router.put('/', (req, res) => {
    const {error, value} = laptopObjectUpdate.validate(req.body)
    if(error)
    {
        console.log(error);
        res.send('Invalid Request. LaptopName or LaptopBrand missing');
    }
    else
    {
        var laptop = req.body
        database.query('UPDATE laptops SET ? WHERE LaptopId = ' + laptop.LaptopId, [laptop], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                if(rows.affectedRows == 0) {
                    database.query('INSERT INTO laptops(LaptopId, LaptopName, LaptopBrand, LaptopPrice, LaptopDesc) values (?,?,?,?,?)',
                     [laptop.LaptopId, laptop.LaptopName, laptop.LaptopBrand, laptop.LaptopPrice, laptop.LaptopDesc], (err, rows) => {
                        if(err){
                            console.log(err)
                        }
                        else{
                            if(rows.affectedRows == 1)
                                res.send('Laptop added')
                            console.log('Laptop added')
                        
                        }
                    })
                }
                else
                {
                    if(rows.affectedRows == 1)
                        res.send('Laptop updated')
                    console.log('Laptop updated')
                }
                
            }
        });
    }
   
})

router.delete('/:laptopId', (req, res, next) => {
    database.query('DELETE FROM laptops where LaptopId=?', [req.params.laptopId], (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            if(rows.affectedRows == 0)
                 res.send('The laptop with id ' + req.params.laptopId + ' is not in database')
            else {
                if(rows.affectedRows == 1)
                   res.send('The laptop was deleted')
                console.log('The laptop was deleted')
               
            }
            
        }
    })
});

module.exports = router;

