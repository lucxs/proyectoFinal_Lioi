import { Router } from "express";
import prodsController from "../controllers/products.controller.js";
import { generateProducts } from "../utils/generate.js";
import CustomErrors from "../tools/CustomErrors.js";
import EErros from "../tools/EErrors.js";
import { middlewarePassportUserOnlyRoleAndId } from "../middlewares/auth.middleware.js";


const prodsRouter = Router();



//Mocks
prodsRouter.get('/mockingproducts', async(req,res)=>{

    
    res.send(generateProducts())
    req.logger.debug("Se generaron:",generateProducts().length," productos");

})

//Instancio el objeto de productManager

prodsRouter.get('/', async (req, res)=>{

    try {
                
        let LimitProducts = req.query.limit;
        let pageProducts = req.query.page;
        let queryProducts = req.query.marca;
        let sortProducts = req.query.sort;


            let prodsPaginated =await  prodsController.prodsPaginated(LimitProducts, pageProducts, queryProducts, sortProducts )
            
            res.status(200).send(prodsPaginated);

    } catch (error) {

        res.status.send(`El error es - ProductsRouter: ${error}`);
        
    }


})


//Filtro un producto por ID
prodsRouter.get('/:pid', async (req,res)=>{

    try {
        let id = req.params.pid;
        let filterId = await prodsController.getProductById(id);

     res.send(filterId)
    
} catch (error) {
    res.send(`El error es: ${error}`);
}

            
})

    //Creando y añadiendo productos nuevos

prodsRouter.post('/', async(req, res)=>{


        //Añado productos
                const dataProds = await req.body;
                const addingProd = await prodsController.addProduct(dataProds)

                if (addingProd.messageError) {
                    CustomErrors.createError("Product Creation Error","Existing product" ,addingProd.messageError, EErros.EXISTING_PRODUCT);
                    
                }

                res.status(200).send({"Producto agregado": addingProd})

        
})

//Actualizando Productos

prodsRouter.put('/:pid', async(req, res)=>{

try {

            //guardo en newObject lo que recibo del body para actualizar
     let newObject = await req.body;
     let pid = req.params.pid


      const result = await prodsController.updateProduct(pid, newObject);
            res.send(result)
    
} catch (error) {
    req.logger.error(error);
    res.status(500).send(error)
}

})


    //Borrando productos

prodsRouter.delete('/:pid',middlewarePassportUserOnlyRoleAndId, async(req, res)=>{
        
try {

    console.log("datos del user: ",req.user);
        console.log("id de prod: ",req.params.pid);
        let pid =req.params.pid
        let userID = req.user.id
    if (req.user.role ==='admin') {
        prodsController.deleteProduct(pid);
        res.status(200).send({"Producto de ID":pid+" eliminado"})
    }
    
    if(req.user.role ==='premium'){
        
        const allprods = await prodsController.getProds()
        const prodsWithOwner = allprods.find((prod)=>prod.owner == userID)

            if (!prodsWithOwner == undefined) {
                console.log("ESTE ES el prod con propietario:",prodsWithOwner._id.toString());

                    prodsController.deleteProduct(prodsWithOwner._id.toString());

                    console.log({"Producto de ID":pid+" eliminado"});
                    res.status(200).send({"Producto de ID":pid+" eliminado"})
            }else{
                console.log({"message":"Error, usted no puede borrar ese producto, no es de su propiedad"});
                res.status(401).send({"message":"Error, usted no puede borrar ese producto, no es de su propiedad"})
            }
        

        
    }

        
} catch (error) {

    res.status(404).send(error);
    
}


})

export {prodsRouter}