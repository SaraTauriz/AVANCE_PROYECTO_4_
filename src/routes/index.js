/* Aqui creamos las rutas 
*/

const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hello Sara');
});

module.exports = router;