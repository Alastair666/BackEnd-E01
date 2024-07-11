exports.validarProductos = (req, res, next)=>{
    const { title, description, code, price, stock, category } = req.body
    // Validación individual
    let validacion = "Los siguientes campos son requeridos:"
    if (!title)
        validacion += "\nTitle"
    if (!description)
        validacion += "\ndescription"
    if (!code)
        validacion += "\ncode"
    if (!price)
        validacion += "\nprice"
    if (!stock)
        validacion += "\nstock"
    if (!category)
        validacion += "\ncategory"
    //Validación Final (Si algún campo incurre)
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ mensaje: validacion });
    }
    next();
}