// Importación de dependencias, librerias, etc
const fs = require('fs')
const express = require("express")
let UrlProducts = ""
const app = express()
const PORT = 8080
// Importación de Validaciones
//const { validarProducto } = require('../scripts/validadores');
const { body, validationResult } = require('express-validator');

//Cargando Productos de BD
let productos = []
let carritos = []

async function cargaArchivosBD(){
    //FILE SYSTEM
    const fileProds = fs.readFileSync('json/products.json', 'utf8')
    const fileCarts = fs.readFileSync('json/carts.json', 'utf8')
    const prods = JSON.parse(fileProds)
    const carts = JSON.parse(fileCarts)
    productos.push(...prods)
    carritos.push(...carts)
}
cargaArchivosBD()

//Middlewares
app.use(express.json()) //Cuando se necesite enviar información a travez del BODY (POST)
app.use(express.urlencoded({ extended:true })) //Par enviar información a travez de la URL

/*********************** PRODUCTOS ***********************/
/** GET 
 * Deberá de traer todos los productos de la base (Incluyendo la limitación ?limit del desafio)
 * **/
app.get('/api/products', (req, res)=>{
    try
    {
        let limit = parseInt(req.query.limit)
        let limitedProds = [...productos]
        if (!isNaN(limit) && limit > 0){
            limitedProds = limitedProds.splice(0,limit) //limitar cantidad del parametro
        }
        res.status(202).json(limitedProds)
    }
    catch (ex){
        res.status(404).json(ex)
    }
})
/** GET 
 * Deberá de traer solo el producto con el ID especificado
 * **/
app.get('/api/products/:pid', (req, res)=>{
    const prod_id = parseInt(req.params.pid)
    const prod = productos.find((p)=> p.pid === prod_id)
    if (prod){
        res.json(prod)
    }
    else {
        res.status(404).json({ message : "Producto no encontrado" })
    }
})
/** POST 
 * Deberá agregar un nuevo producto con los campos
 * **/
app.post('/api/products', 
    [
        body('title').notEmpty().withMessage('El campo title es requerido'),
        body('description').notEmpty().withMessage('El campo description es requerido'),
        body('code').notEmpty().withMessage('El campo code es requerido'),
        body('price').notEmpty().withMessage('El campo price es requerido'),
        body('stock').notEmpty().withMessage('El campo stock es requerido'),
        body('category').notEmpty().withMessage('El campo category es requerido')
    ], (req, res)=>{
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        const { title, description, code, price, stock, category, thumbnails } = req.body

        let prod_id_new = productos.length+1
        let ban_id = true
        //Ciclo de validacion
        while (ban_id){
            const prod = productos.find((p)=> p.pid === prod_id_new)
            if (prod){
                prod_id_new = prod_id_new+1
            }
            else
                ban_id = false
        }

        //Definiendo nuevo producto
        const newProd = {
            pid : prod_id_new, //Genera ID único por Producto
            title : title, 
            description : description, 
            code : code, 
            price : price, 
            stock : stock, 
            category : category, 
            thumbnails : thumbnails || []
        }
        productos.push(newProd)
        //Devolviendo resultado obtenido
        res.status(202).json(newProd)
})
/** PUT 
 * Deberá agregar un nuevo producto con los campos
 * **/
app.put('/api/products/:pid', (req, res)=>{
    const prod_id = parseInt(req.params.pid)
    const prod = productos.find((p)=> p.pid === prod_id)
    if (prod){
        const { title, description, code, price, stock, category, thumbnails } = req.body
        //Actualizando registros
        prod.title = !title ? prod.title : title
        prod.description = !description ? prod.description : description
        prod.code = !code ? prod.code : code
        prod.price = !price ? prod.price : price
        prod.stock = !stock ? prod.stock : stock 
        prod.category = !category ? prod.category : category
        prod.thumbnails = thumbnails || []
        //Mostrando actualización
        res.status(202).json(prod)
    }
    else {
        res.status(404).json({ message : `El Producto con el ID ${prod_id} no fue localizado`})
    }
})
/** DELETE 
 * Deberá de traer solo el producto con el ID especificado
 * **/
app.delete('/api/products/:pid', (req, res)=>{
    
    try
    {
        const prod_id = parseInt(req.params.pid)
        if (prod_id > 0){
            const prod = productos.find((p)=> p.pid === prod_id)
            if (prod){
                productos = productos.filter((p)=> p.pid !== prod_id)
                //Mostrando productos restantes
                res.status(201).json({ message : `Producto con ID:${prod_id} eliminado exitosamente`})
            }
            else
                res.status(404).json({ message : `El Producto con el ID ${prod_id} no fue localizado`})
        }
        else
            res.status(404).json({ message : `Debe establecer el ID del producto para actualizar`})
    }
    catch (ex){
        res.status(404).json({ message : `Excepcion: ${ex}`})
    }
})

/*********************** CARRITO ***********************/
/** POST 
 * Deberá crear un nuevo carrito con la siguiente estructura: cid y products
 * **/
app.post('/api/carts', (req, res)=>{
    let cart_id_new = carritos.length+1
    let ban_id = true
    //Ciclo de validacion
    while (ban_id){
        const cart = carritos.find((c)=> c.cid === cart_id_new)
        if (cart){
            cart_id_new = cart_id_new+1
        }
        else
            ban_id = false
    }
    
    //Definiendo nuevo producto
    const newCart = {
        cid : cart_id_new, //Genera ID único por Producto
        products : []
    }
    carritos.push(newCart)
    //Devolviendo resultado obtenido
    res.status(200).json(newCart)
})
/** GET 
 * Deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados
 * **/
app.get('/api/carts/:cid', (req, res)=>{
    try
    {
        const cart_id = parseInt(req.params.cid)
        const cart = carritos.find((c)=> c.cid === cart_id)
        if (cart){
            res.json({ CarritosDisponibles : cart })
        }
        else {
            res.status(404).json({ message : `Carrito con el ID: ${cart_id} no encontrado` })
        }
    }
    catch (ex){
        res.status(404).json({ message : `Excepcion: ${ex}`})
    }
})
/** POST 
 * Deberá crear un nuevo carrito con la siguiente estructura: cid y products
 * **/
app.post('/api/carts/:cid/product/:pid', (req, res)=>{
    try{
        const cart_id = parseInt(req.params.cid)
        const prod_id = parseInt(req.params.pid)
        const cart = carritos.find((c)=> c.cid === cart_id)
        const prod = productos.find((p)=> p.pid === prod_id)

        if (cart){
            if (prod){
                //Calculando Cantidad
                let cantidad = 0
                const prod_cart = cart.products.find((cp)=> cp.pid === prod.pid)
                if (prod_cart){
                    prod_cart.quantity = prod_cart.quantity+1
                    cantidad = prod_cart.quantity
                }
                else {
                    let prod_new = {
                        pid : prod.pid,
                        quantity : 1
                    }
                    cantidad = prod_new.quantity
                    cart.products.push(prod_new)
                }
                //Devolviendo resultado obtenido
                res.status(200).json({ message : `El Producto '${prod.description}' agregado al Carrito #${cart_id} ${cantidad == 1 ? '1 vez' : cantidad+' veces' } exitosamente` })
            }
            else {
                res.status(404).json({ message : `Producto con el ID: ${prod_id} no encontrado` })
            }
        }
        else {
            res.status(404).json({ message : `Carrito con el ID: ${cart_id} no encontrado` })
        }
    }
    catch (ex){
        res.status(404).json({ message : `Excepcion: ${ex}`})
    }
})

//Corriendo el servidor en el Puerto 8080
app.listen(PORT, ()=>{
    console.log(`Server running on port: ${PORT}`)
})