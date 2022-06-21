const { Router } = require('express');
const express = require('express')
const routes = express.Router();
const controller = require('../controller/controller')

routes.route('/api/register')
   .post(controller.userRegister)
   .get(controller.fetchUserList)

routes.route('/api/login')
   .post(controller.userLogin)
   .get(controller.fetchUserDetails)

routes.route('/api/test')
   .post(controller.addProduct)





module.exports = routes