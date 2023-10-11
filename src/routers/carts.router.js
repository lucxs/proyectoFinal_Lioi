import  {Router} from "express";
import cartsController from "../controllers/carts.controller.js";
import { middlewareAccessToCart } from "../middlewares/auth.middleware.js";

const cartsRouter = Router();

//Ruta raiz que crea cart ok
cartsRouter.post('/', async(req, res)=>{

        const title= req.body;

        try {   
                await cartsController.createCarts(title);
                
                 res.status(201).send("Se creo correctamente el documento para el carrito");
                
                
        } catch (error) {
                
                res.status(500).send(error)
        }
        
})

//ok
cartsRouter.get('/', async(req,res)=>{


        try {
               let allCarts = await cartsController.getCarts();
                
                 res.status(200).send(allCarts);
                
        } catch (error) {

                res.status(501).send(error)
                
        }


 })


        //Listando carrito con los prods ok
cartsRouter.get('/:cid', async(req,res)=>{


        try {
               let cartProdById = await cartsController.getCartbyId(req.params.cid);
                
                 res.status(200).send(cartProdById);
                
        } catch (error) {

                res.status(501).send(error)
                
        }


 })


                //Agregando Producto a una cart segun Cart ID ok
                cartsRouter.post('/:cid/product/:pid',middlewareAccessToCart, async(req, res)=>{

                        const cid = req.params.cid;
                        const pid = req.params.pid;

                try {
                       
                        await cartsController.addProdToCard(cid, pid)
                       res.status(200).send("Producto cargado correctamente al carrito")
                        
                } catch (error) {
                        console.log(error);
                        res.status(501).send(error)
                         req.logger.error(error);
                        
                }

})

                //Actualizando lista de productos en cart ok

                cartsRouter.put('/:cid', async(req, res)=>{
                const newProds = req.body;
                 const cid = req.params.cid;
                 try {

                         let cartSelected = await cartsController.updateCart(cid, newProds);
                        res.send("carrito actualizado: "+cartSelected)
                        req.logger.debug(cartSelected);
                        
                 } catch (error) {

                        res.status(500).send(error)
                 }

                })

                //Update quantity de un producto de una cart seleccionada

                cartsRouter.put('/:cid/product/:pid/:quantity', async(req, res)=>{
                        const quantity = req.params.quantity;
                        const cid = req.params.cid;
                        const pid = req.params.pid;

                        try {
                               const result = await cartsController.updateProdQuantity(cid, pid, quantity)
                               req.logger.debug(result);
                               res.status(200).send(result)
                        } catch (error) {
                                res.status(501).send(error)
                        }

                })


                        //Proceso de compra
                cartsRouter.put('/:cid/purcharse', async(req,res)=>{

                        try {
                                const result = await cartsController.purcharseProccess(req.params.cid)
                                req.logger.debug(result.acknowledged);
                                if (result.acknowledged === true) {
                                        res.status(200).send(result) 
                                }else{
                                        res.send(result)
                                }
                                 
                                
                        } catch (error) {

                                req.logger.error("Error en cart.router purcharse:", error);
                                
                        }

                })



                //Eliminar del carrito producto seleccionado ok

                cartsRouter.delete('/:cid/product/:pid', async(req,res)=>{

                                        const cid = req.params.cid;
                                        const pid = req.params.pid;

                                try {
                                         await cartsController.deleteOnCartAProd(cid, pid)
                                         res.status(200).send("Se eliminó correctamente el producto del carrito")
                                } catch (error) {

                                        res.status(501).send(error);
                                        
                                }

                })

                        //vaciar carrito seleccionado ok
                cartsRouter.delete('/:cid', async(req, res)=>{

                                const cid = req.params.cid;

                        try {
                                await cartsController.deleteAllCard(cid)
                                res.status(200).send("Carrito vaciado")
                        } catch (error) {
                                res.status(500).send(error)
                        }

                })





export {cartsRouter}