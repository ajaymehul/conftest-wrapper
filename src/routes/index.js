const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('WU Cloud Security Server Running OK');
});

module.exports = router;