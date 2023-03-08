const express = require('express');
const router = express.Router();
const database = require('../database');
const bodyParser = require('body-parser');
const joi = require('joi');

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());

const telephoneObject = joi.object(
    {
        PhoneName: joi.required(),
        PhoneBrand: joi.required(),
        PhonePrice: joi.required(),
        PhoneDesc: joi.optional()
});

router.get('/', (req, res) => {
    database.query('SELECT * FROM TELEPHONES', (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            res.send(rows)
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

router.get('/search/phonename/:name', (req,res) => {
      let phoneName = req.params.name
      database.query('SELECT * FROM telephones WHERE PhoneName Like ?',[phoneName], (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            res.send(rows)
        }
      })
})

router.get('/search/phonebrand/:brand', (req,res) => {
    let phoneBrand = req.params.brand
    database.query('SELECT * FROM telephones WHERE PhoneBrand Like ?',[phoneBrand], (err, rows) => {
      if(err){
          console.log(err)
      }
      else{
          res.send(rows)
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
        if(tele.PhoneDesc == 0)
           {database.query('INSERT INTO telephones(PhoneName, PhoneBrand, PhonePrice, PhoneDesc) values (?,?,?,?)', [tele.PhoneName, tele.PhoneBrand, tele.PhonePrice, tele.PhoneDesc], (err, rows) => {
            if(err){
                console.log('Doar 3')
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
    else {
        database.query('INSERT INTO telephones(PhoneName, PhoneBrand, PhonePrice, PhoneDesc) values (?,?,?,?)', [tele.PhoneName, tele.PhoneBrand, tele.PhonePrice, tele.PhoneDesc], (err, rows) => {
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
    var tele = req.body
    database.query('UPDATE telephones SET ? WHERE PhoneId = ' + tele.PhoneId, [tele], (err, rows) => {
        if(err){
            console.log(err)
        }
        else{
            console.log('Telephone updated')
            res.send(rows)
        }
    });
});

router.put('/', (req, res) => {
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
                        console.log('Telephone added')
                        res.send(rows)
                    }
                })
            }
            else
            {
                console.log('Telephone updated')
                res.send(rows)
            }
            
        }
    });
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

