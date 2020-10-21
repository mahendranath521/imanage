const express = require('express');
const router = express.Router();
const fs = require('fs');


// @route STORE api/stack
// @desc Store a stack size
// @access Public
router.post('/', (req,res) => {
    if(req.body.size) {
        const stackSize = {
            size: Number(req.body.size) 
        }
        let data = JSON.stringify(stackSize);
        fs.writeFile('stackSize.json', data, (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
        res.status(200).json(req.body);    
    } else {
        res.status(400).json({msg: "Stack is required"}); 
    }
});

// @route GET api/stacksize
// @desc get a stack size
// @access Public
router.get('/', (req,res) => {
    fs.readFile('stackSize.json', (err, data) => {
        if (err) {
            res.status(500).json({msg: 'inter Server error'});    
        };
        let stackSize = JSON.parse(data);
        res.status(200).json(stackSize);    
    });
});

// @route POST api/stack/pushData
// @desc post data into an array
// @access Public
router.post('/pushData/:size', (req,res) => {
    if(req.body) {
        fs.readFile('stackArray.json', (err, data) => {
            if (err) {
                res.status(500).json({msg: 'inter Server error'});    
            };
            let getData = JSON.parse(data);
                if(Number(req.params.size) > getData.length) {
                    req.body.forEach(element => {
                        getData.push(element)
                    });
                    let pushData = JSON.stringify(getData);
                    fs.writeFile('stackArray.json', pushData, (err) => {
                        if (err) throw err;
                        res.status(200).json(getData);    
                    });
                } else {
                    res.status(400).json({"msg": "Stack Size is small, to insert"})
                }
            
        });
    } else {
        res.status(400).json({msg: "Data is required to push"}); 
    }
});

// @route GET api/stack/getData
// @desc get data from an array
// @access Public
router.get('/getData',(req,res) => {
    fs.readFile('stackArray.json',(err,data) => {
        if (err) {
            res.status(500).json({msg: 'inter Server error'});    
        };
        let getData = JSON.parse(data);
        res.status(200).json(getData);    

    })
})
// @route GET api/stack/popData
// @desc pop data from an array
// @access Public
router.post('/popData', (req,res) => {
    fs.readFile('stackArray.json', (err, data) => {
        if (err) {
            res.status(500).json({msg: 'inter Server error'});    
        };
        let getData = JSON.parse(data);
        if(getData.length > 0) {
            let popData = getData.pop();
            fs.writeFile('stackArray.json', JSON.stringify(getData), (err) => {
                if (err) throw err;
                res.status(200).json(getData);    
            }); 
        } else {
            res.status(400).json({msg: "Stack is empty"})
        }
          
    });
});
module.exports = router;

