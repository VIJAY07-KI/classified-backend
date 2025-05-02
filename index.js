import express from 'express'
import dotenv from 'dotenv'
import configureDB from "./config/db.js"
import cors from "cors"
import { checkSchema } from 'express-validator'
import {userAuthenticate} from "./app/middlewares/userAuthenticate.js"
import { authoriseUser } from "./app/middlewares/authoriseUser.js"
const app=express()
const port =3046
dotenv.config()
app.use(express.json())
app.use(cors())
configureDB()

import userCtrl from "./app/controllers/userController.js"
import categoryCtrl from "./app/controllers/categoryController.js"
import productCtrl from "./app/controllers/productController.js"
//import userCtrl from './app/controllers/userController.js'
import { loginValidationSchema, registerValidationSchema } from "./app/validators/userValidation.js"
import idValidationSchema  from "./app/validators/idvalidation.js"
import { categoryValidationSchema } from "./app/validators/categoryvalidation.js"
import { productValidationSchema } from './app/validators/productValidation.js'

//This user routes 
app.get('/users',userAuthenticate,userCtrl.list)
app.post('/register',checkSchema(registerValidationSchema),userCtrl.register)
app.post('/login',checkSchema(loginValidationSchema),userCtrl.login)
app.get('/account',userAuthenticate,userCtrl.account) 
app.delete('/account/:id',userAuthenticate,checkSchema(idValidationSchema),userCtrl.remove)
app.put('/update/account/:id',userAuthenticate,checkSchema(idValidationSchema),userCtrl.modify)
app.put('/activation/:id',userAuthenticate,authoriseUser(['admin']),checkSchema(idValidationSchema),userCtrl.update)

//This category routes
app.get('/categories',categoryCtrl.list)
app.post('/category',userAuthenticate,authoriseUser(['admin']),checkSchema(categoryValidationSchema),categoryCtrl.create)
app.get('/category',userAuthenticate,authoriseUser(['admin']),checkSchema(idValidationSchema),categoryCtrl.show)
app.delete('/category/:id',userAuthenticate,authoriseUser(['admin']),checkSchema(idValidationSchema),categoryCtrl.remove)
app.put('/category/:id',userAuthenticate,authoriseUser(['admin']),checkSchema(idValidationSchema),checkSchema(categoryValidationSchema),categoryCtrl.update)

//This Product routes
app.get('/products',productCtrl.list)
app.post('/product',userAuthenticate,authoriseUser(['seller']),checkSchema(productValidationSchema),productCtrl.create)
app.put('/product/:id',userAuthenticate,authoriseUser(['seller']),checkSchema(idValidationSchema),productCtrl.modify)
app.delete('/product/:id',userAuthenticate,authoriseUser(['seller']),checkSchema(idValidationSchema),productCtrl.remove)
app.put('/productapprove/:id',userAuthenticate,authoriseUser(['admin']),checkSchema(idValidationSchema),productCtrl.approve)
app.get('/product',userAuthenticate,productCtrl.show)
app.get('/product/:id',checkSchema(idValidationSchema),productCtrl.showProduct)

//Enquires Routes
app.post('/addenquiry/:id',userAuthenticate,authoriseUser(['buyer']),productCtrl.addEnquiry)
app.post('/response/enquiry/:id',userAuthenticate,authoriseUser(['seller']),productCtrl.respondEnquiry)
app.delete('/remove/enquiry/:id/:enqid',userAuthenticate,authoriseUser(['buyer']),checkSchema(idValidationSchema),productCtrl.removeEnquiry)

//views
app.put('/views/:id',checkSchema(idValidationSchema),productCtrl.views)
//markAsInterested
app.post('/markinterested/:id',userAuthenticate,authoriseUser(['buyer']),checkSchema(idValidationSchema),productCtrl.markInterested)
app.delete('/mark/uninterested/:id',userAuthenticate,authoriseUser(['buyer']),checkSchema(idValidationSchema),productCtrl.removeInterested)
app.listen(port,()=>{
    console.log('server is running on port',port)
})