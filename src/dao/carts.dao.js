import { cartModel } from "../models/cart.model.js";
import { Logger } from "../middlewares/logger.middleware.js";

class CartsDAO{

        constructor(){
            this.model= cartModel
        }

        async createCarts(data){

                try {
                        return await this.model.create(data)
    
                } catch (error) {
    
                       //await req.logger.error("error dao-carts: createCarts: ", error);
                        console.log("error dao-carts: createCarts: ", error);
                }
    
            }

        async getCarts(){

                try {
                        return await this.model.find().lean()

                } catch (error) {
                    
                        req.logger.error("error dao-carts: getcarts ", error);
                }
            
        }

        async getCartbyId(cid){
                try {
                        return await this.model.findOne({_id:cid})
                } catch (error) {
                        req.logger.error("error dao-carts: getcartById ", error);
                }       
        }

        async getCartOnviews(id){

                return await this.model.findOne({_id:id}).populate('products.product').lean();

        }

        async updateCart(cid, newProds){

            try {

                const cartSelected = await this.model.findById(cid);
                cartSelected.products = newProds;
                const updatedCart = await cartSelected.save();
                return updatedCart;
        } catch (error) {

                req.logger.error("Error en el updateCart", error);
                
        }
        }

        async emptyCart(cid){

                try {

                        return await this.model.updateOne(
                         { _id: cid },
                         { $set: { products: [] } })
                         
                         
                 } catch (error) {
 
                        req.logger.error("Se produjo un error en el vaciado del carrito:", error);
                         
                 }
        }

}

const cartsDAO = new CartsDAO();

export default cartsDAO;