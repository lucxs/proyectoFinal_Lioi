import cartsDAO from "../dao/carts.dao.js";
import productsDAO from "../dao/products.dao.js";
import CartsService from "../services/cart.service.js";
import ProductsServices from "../services/products.service.js";


class CartsController {
    constructor(){

        this.cartService = new CartsService(cartsDAO);
        this.prodsService = new ProductsServices(productsDAO);
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
                    
                    //Hago una lista de los id de prods que hay en el carrito
                      const IdsProdsFromCarts = cart.products.map((prod)=>{
                      
                        return  prod.product

                      })

                      //Products quantity from cart

                      const QntyProdsFromCarts = cart.products.map((prod)=>{
                      
                        return  {"id":prod.product,"quantity":prod.quantity}

                      })
                      
                          //Array de prods para ticket
                          const prodsPurcharsed = []

                          //Array de prods sin stock o que no alcanza segun la cantidad
                          const OutOfStock = []

                          for (let i = 0; i < QntyProdsFromCarts.length; i++) {
                              //guardo el id
                              let pid = QntyProdsFromCarts[i].id.toString()
                              //Guardo el valor del quantity
                              let newValue = QntyProdsFromCarts[i].quantity.toString()

                                //Se lo paso al metodo que hace el descuento del stock
                             const ResultprodsUpdated =await this.#updateStockProduct(pid, newValue)
                                // console.log(ResultprodsUpdated);

                                  //Si ResultprodsUpdated.acknowledged devuelve true lo guarda en un nuevo array para el ticket de compra
                                if (ResultprodsUpdated.acknowledged === true) {
                                        let prodFiltered = await this.prodsService.getSomeProdsById(pid)
                                        prodsPurcharsed.push(prodFiltered)
                                        req.logger.debug("Productos para el ticket de compra: ",prodsPurcharsed);

                                        //Lo saco del carrito
                                        for (let i = 0; i < array.length; i++) {
                                          const element = array[i];
                                          
                                        }
                                        this.deleteOnCartAProd(cid, pid)

                                        return prodsPurcharsed
                                }
                                  if (!ResultprodsUpdated.acknowledged === true) {
                                    let prodFiltered1 = await this.prodsService.getSomeProdsById(pid)
                                  OutOfStock.push(prodFiltered1)
                                  req.logger.warning("Prods fuera de stock:",prodFiltered1);
                                  }
                                
                            
                          }

                          
                              
                      return  QntyProdsFromCarts
                    
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