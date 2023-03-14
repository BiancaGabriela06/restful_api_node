const express = require('express');
const router = express.Router();
const database = require('../database');
const bodyParser = require('body-parser');
const joi = require('joi');
const querystring = require('querystring');

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

router.get('/:telephoneId', (req, res) => {
    database.query('SELECT * FROM telephones where PhoneId = ?', [req.params.telephoneId], (err, rows) => {
        if(err){
            res.send('The telephone with id ' + req.params.telephoneId + ' is not in database')
        }
        else{
               res.send(rows)
            }
            
        })
})

router.get('/', (req, res) => {
    var where = 'WHERE 1=1 '
    if(req.query.phonebrand != null)
         where += 'AND PhoneBrand Like ' + req.query.phonebrand
    if(req.query.phonename != null)
         where += 'AND PhoneName Like ' + req.query.phonename
    if(req.query.phonedesc != null)
         where += 'AND PhoneDesc Like ' + req.query.phonedesc
    if(req.query.phoneprice != null && req.query.sign == '>')
         where += 'AND PhonePrice >= ' + req.query.phoneprice
    if(req.query.phoneprice != null && req.query.sign == '<')
         where += 'AND PhonePrice <= ' + req.query.phoneprice
    if(req.query.phoneprice != null && req.query.sign == null)
         where += 'AND  PhonePrice = ' + req.query.phoneprice


    database.query('SELECT * FROM telephones ' + where, (err, rows) =>{
          if(err){
            console.log(err)
            res.send('No response from database')
          }
              
          else
          {   if(rows == 0)
                    res.send('Did not find what you were looking for')
              else
                  res.json({ entry : rows })
              
          }
    })
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

