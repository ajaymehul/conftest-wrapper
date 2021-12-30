const express = require('express');

const router = express.Router();

const conftestController = require('../controllers/conftest');



router.get('/', (req,res) => {
    res.send('WU Conftest Evaluation Server Running OK');
});

router.post('/evaluate', conftestController.evaluate);

router.get('/version', conftestController.version)

module.exports = router;