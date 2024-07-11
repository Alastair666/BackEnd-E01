# Entrega 01 - Curso Backend #70065 **CoderHouse**

Se desarrollará un servidor que contenga los endpoints y servicios necesarios para gestionar los productos y carritos de compra en el e-commerce

## Tabla de Contenidos
1. [Instalación](#instalación)
2. [Contenido](#contenido-publicado)
3. [Estructura](#estructura-del-proyecto)

## Instalación
### Requisitos minimos y deseables
- Node JS v20.14.0 (Minimo deseable)
- Visual Studio Code v1.90.0 (user setup)

## Contenido publicado
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/Alastair666/E1_JS.git
2. Se debe entregar:
   Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts. Dichos endpoints estarán implementados con el router de express.
   ```sh
   /api/products /api/carts
3. Instalación de Libreria Express (Para node_modules):
   ```sh
   npm install express
4. Instalación de Libreria Express-Validator (Para node_modules):
   ```sh
   npm install express-validator
   
## Estructura del proyecto
```
BackEnd-E01/
├── json/
│   ├── carts.json/
│   ├── products.json/
├── node_modules/
├── scripts/
│   ├── validadores.js/
├── app.js
├── package-lock.json
├── package.json
├── README.md