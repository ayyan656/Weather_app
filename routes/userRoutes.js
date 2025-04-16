const express = require('express');
const router = express.Router();
const { getUser, getUserById, signupUser, loginUser, dashboard, logoutUser, updateUser, deleteUser} = require('../controllers/userControllers');
const { validateUserCreation, validateUserUpdate } = require('../middleware/authMiddleware');
const authenticateUser = require('../middleware/authenticateUser')

// Route to get user information
router.get('/users', getUser);
router.get('/users/:id', getUserById)
router.post('/users/signup', validateUserCreation, signupUser);
router.post('/users/login', loginUser)
router.get('/users/dashboard', authenticateUser, dashboard)
router.post('/users/logout', logoutUser)
router.put('/users/:id', validateUserUpdate, updateUser);
router.delete('/users/:id', deleteUser); 



module.exports = router;