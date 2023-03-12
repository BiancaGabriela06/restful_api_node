const express = require('express');
const router = express.Router();
const database = require('../database');
const bodyParser = require('body-parser');
const joi = require('joi');

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());

///Validare pentru Adaugare
const telephoneObject = joi.object(
    {
        PhoneName: joi.string().required(),
        PhoneBrand: joi.string().required(),
        PhonePrice: joi.required(),
        PhoneDesc: joi.string().optional()
});

/// Validare pentru Update
const telephoneObjectUpdate = joi.object(
    {
        PhoneId: joi.required(),
        PhoneName: joi.string().required(),
        PhoneBrand: joi.string().required(),
        PhonePrice: joi.required(),
        PhoneDesc: joi.string().optional()
});

router.get('/', (req, res) => {
    var phoneId = req.query.phoneid;
    var phoneName = req.query.phonename;
    var phoneBrand = req.query.phonebrand;
    var phonePrice = req.query.phoneprice;
    var sign = req.query.sign;

    /// Daca nu avem niciun query, afisam toate telefoanele
    if(phoneId == null && phoneName == null && phoneBrand == null && phonePrice == null)
    {
        database.query('SELECT * FROM TELEPHONES', (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }

    ///Cautam dupa id unic
    else if (phoneId != null && phoneName == null && phoneBrand == null && phonePrice == null)
    {
        database.query('SELECT * FROM TELEPHONES Where PhoneId =? ', [phoneId], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }

    ///Cautam dupa nume
    else if (phoneId == null && phoneName != null && phoneBrand == null && phonePrice == null)
    {
        database.query('SELECT * FROM TELEPHONES Where PhoneName like ? ', [phoneName], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }

    ///Cautam dupa brand
    else if(phoneId == null && phoneName == null && phoneBrand != null && phonePrice == null)
    {
        database.query('SELECT * FROM TELEPHONES Where PhoneBrand like ? ', [phoneBrand], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        }) 
    }

    ///Afisare telefoane de la un brand X care au pretul mai mare/mai mic decat o valoare data
    else if(phoneId == null && phoneName == null && phoneBrand != null && phonePrice != null && sign!=null)
    {
        if(sign == '>') /// preturi mai mari
            database.query('SELECT * FROM TELEPHONES WHERE PhoneBrand like ? and PhonePrice >= ' + phonePrice, [phoneBrand], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        })

        else if(sign == '<')
        database.query('SELECT * FROM TELEPHONES WHERE PhoneBrand like ? and PhonePrice <= ' + phonePrice, [phoneBrand], (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
        })
    }
    ///Afisam telefoanele care au pretul mai mic/mai mare decat o valoare data
    else if(phoneId == null && phoneName == null && phoneBrand == null && phonePrice != null && sign!=null){
        if(sign == '>') /// preturi mai mari
            database.query('SELECT * FROM TELEPHONES WHERE PhonePrice >= ' + phonePrice, (err, rows) => {
            if(err){
                console.log(err)
            }
            else{
                res.send(rows)
            }
    })
        else if(sign == '<')
            database.query('SELECT * FROM TELEPHONES WHERE PhonePrice <= ' + phonePrice,  (err, rows) => {
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
    const {error, value} = telephoneObject.validate(req.body)
    if(error)
    {
        console.log(error);
        res.send('Invalid Request. PhoneName or PhoneBrand missing');
    }
    else{
        var tele = req.body
        
        database.query('INSERT INTO telephones(PhoneName, PhoneBrand, PhonePrice, PhoneDesc) values (?,?,?,?)',
        [tele.PhoneName, tele.PhoneBrand, tele.PhonePrice, tele.PhoneDesc], (err, rows) => {
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
                if(rows.affectedRows == 1)
                     res.send('The Telephone with id ' + req.params.telephoneId + ' was deleted')
                console.log('The Telephone was deleted')
            }
            
        }
    })
});

module.exports = router;

