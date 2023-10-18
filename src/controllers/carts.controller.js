import cartsDAO from "../dao/carts.dao.js";
import productsDAO from "../dao/products.dao.js";
import CartsService from "../services/cart.service.js";
import ProductsServices from "../services/products.service.js";
import TicketServices from "../services/ticket.service.js";
import ticketDAO from "../dao/ticket.dao.js";


class CartsController {
    constructor(){

        this.cartService = new CartsService(cartsDAO);
        this.prodsService = new ProductsServices(productsDAO);
        this.ticketService = new TicketServices(ticketDAO)
    }


      //Creando carrito 
     createCarts(data){

            return this.cartService.createCarts(data);

    }

      //Obteniendo carritos

    async getCarts(){

        return await this.cartService.getCarts();

    }

      //Obteniendo cart por ID
    async getCartbyId(cid){

        return await this.cartService.getCartbyId(cid);
    }

        //Agregando productos al carrito seleccionado
    async addProdToCard(cid,pid){



        try {
                const cart = await this.cartService.getCartbyId(cid);
                //req.logger.debug(cart)
                if (!cart) {
                  throw new Error("No existe el carrito buscado");
                }
          
                const product = await this.prodsService.getProdById(pid);
                
          
                if (!product) {
                  throw new Error("No existe el producto buscado");
                }
          
                const index =await cart.products.findIndex((producto) => {
              
                  return producto.product.toString() === pid;
                  
                });
                if (index === -1) {
                  cart.products.push({ product: pid, quantity: 1 });
                } else {
                  cart.products[index].quantity += 1;
                }
                await cart.save();
                return cart;
              } catch (error) {
                throw new Error(`No se pudo agregar producto al carrito: ${error}`);
              }

}

                //Actualizando carrito  REVISAR
            async updateCart(){

                   return await this.cartService.updateCart(cid, newProds)

            }

//Update quantity de un producto de una cart seleccionada

async updateProdQuantity(cid,pid, quantityUpdated){

    try {
           const cart = await this.cartService.getCartbyId(cid);
           req.logger.debug(cart)
           if (!cart) {
             throw new Error("No existe el carrito buscado");
           }
     
           const product = await this.prodsService.getProdById(pid);
           req.logger.debug(product);
     
           if (!product) {
             throw new Error("No existe el producto buscado");
           }
     
           const index = cart.products.findIndex((producto) => {
             return producto.product.toString() === pid;
           });
           if (index === -1) {
             cart.products.push({ product: pid, quantity: quantityUpdated });
           } else {
             cart.products[index].quantity = quantityUpdated;
           }
           await cart.save();
           return cart;
                                  
                   } catch (error) {

                    req.logger.error("error en el updateProdQuantity:", error);
                                   
                   }

    }


    async getCartOnviews(cid)
                {

                        try {
                                const cart = await this.cartService.getCartOnviews(cid);
                                return cart;
                            }
                         catch (error)
                          {
                            req.logger.error("Error en getCartOnviews");                                                
                          }
                }

                async #updateStockProduct(pid, newValue){

                  try {
            
                    return await this.prodsService.updateStockProduct(pid, newValue)
                    
                  } catch (error) {
            
                    req.logger.debug("Error al actualizar el stock del producto: ", error);
                    
                  }
                }


                async purcharseProccess(cid){

                  try {
                    const cart = await this.cartService.getCartbyId(cid)
                  
                      //Products quantity from cart

                      const ProdsFromCarts =await cart.products.map((prod)=>{
                      
                        return  {"id":prod.product,"quantity":prod.quantity}

                      })
                         console.log(ProdsFromCarts);
                         console.log(ProdsFromCarts.length)
                          
                          //Array de prods para ticket
                          const prodsPurcharsed = []

                          //Array de prods sin stock o que no alcanza segun la cantidad
                          const OutOfStock = []

                          function generateProductCode(length) {
                            const characters = '0123456789';
                            let result = '';
                            const charactersLength = characters.length;
                            for (let i = 0; i < length; i++) {
                                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                            }
                            return result;
                        }

                          for (let i = 0; i < await ProdsFromCarts.length; i++) {
                              //guardo el id
                              let pid =await ProdsFromCarts[i].id.toString()
                              //Guardo el valor del quantity
                              let newValue =await ProdsFromCarts[i].quantity.toString()

                          //       //Se lo paso al metodo que hace el descuento del stock
                                  const ResultprodsUpdated =await this.#updateStockProduct(pid, newValue)
                                  console.log("Acá muestro el resultado del descuento del stock de los prods: ",ResultprodsUpdated);

                          //         //Si ResultprodsUpdated.acknowledged devuelve true lo guarda en un nuevo array para el ticket de compra
                                 if (ResultprodsUpdated.acknowledged === true) {
                                         let prodFiltered = await this.prodsService.getSomeProdsById(pid)
                                         const prodsPurcharsedData = prodFiltered.map((prod)=>{

                                          return {
                                                    "id":pid,
                                                    "price":prod.price,
                                                    "quantity":newValue,

                                                  }
        
                                        })
                                         prodsPurcharsed.push(prodsPurcharsedData)

                                         // req.logger.debug("Productos para el ticket de compra: ",prodsPurcharsed);
                                         console.log("Productos para el ticket de compra: ",prodsPurcharsed);
                                         //Lo saco del carrito
                          
                                        await this.deleteOnCartAProd(cid, pid)
                                 }
                                  if (!ResultprodsUpdated.acknowledged === true) {
                                    let prodFiltered1 = await this.prodsService.getSomeProdsById(pid)
                                  OutOfStock.push(prodFiltered1)
                                  // req.logger.warning("Prods fuera de stock:",prodFiltered1);
                                  console.log("Prods fuera de stock:",prodFiltered1);
                                  }
                                
                            
                           }

                           const totalSum = prodsPurcharsed.reduce((accumulator, currentArray) => {
                            const priceTimesQuantity = currentArray.reduce((acc, { price, quantity }) => acc + price * parseInt(quantity), 0);
                            return accumulator + priceTimesQuantity;

                        }, 0);
                                const uniqueCode = generateProductCode(16)
                              
                          await this.ticketService.createTicket({"code":uniqueCode, "purcharse_datatime":new Date(), "amount":totalSum})
                          //const result = await this.ticketService.getTickets(uniqueCode)

    
                      return uniqueCode
                    
                  } catch (error) {
                    req.logger.error("Error en carts.Controller - Metodo purcharseProccess:",error);
                  }

                  

                }


                  //revisar este

                  //Borrar un producto seleccionado en un carrito
              async deleteOnCartAProd(cid, pid){

                try {

                  const cartSelected = await this.cartService.getCartbyId(cid)
                          cartSelected.products = cartSelected.products.filter((product) => product.product.toString() !== pid);
                          let result = await this.cartService.updateCart(cid, cartSelected.products)
                           return result;
          } catch (error) {

                   req.logger.error("Erorr en deleteOnCartAProd: ", error);
                  
          }

              }
                //vaciando carrito
              async deleteAllCard(id){

                try {
                  return await this.cartService.deleteAllCard(id)
                 
          } catch (error) {
                  req.logger.error("error vaciando el carrito selecionado - carts.controller",error);
          }
              }



}

const cartsController = new CartsController();

export default cartsController;