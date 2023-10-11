export default class ProductsServices {

         constructor(dao){

            this.dao = dao
         }

         
          async getProducts(){
   
                  return await this.dao.getProducts();
                  
          }


          async getProdById(id){

               return await this.dao.getProdById(id);

          }

          async getSomeProdsById(data){
            return await this.dao.getSomeProdsById(data)
          }

         async addProduct(data){

               try {

                  return await this.dao.addProduct(data);
                  
               } catch (error) {

                  //req.logger.error("Error product.service metodo addProduct:", error);
                  console.log("Error product.service metodo addProduct:", error);
               }
         }  
            
   
           async updateProduct(id, newObject){
            
               try {

                  const filtro = {};
               filtro[newObject.campo] =await newObject.valor;

               return await this.dao.updateProduct(id,filtro)
                  
               } catch (error) {

                  req.logger.error("Error en products.Services: ", error);
               }
               
                  
    }

    updateStockProduct(pid, newValue){
            

      return this.dao.updateProductStock(pid, newValue)
         
}

            deleteProduct(data){

            this.dao.deleteProduct(data)

          }

          prodsPaginated(limit, page, query, sort){

             return this.dao.prodsPaginated(limit, page, query, sort)
          }


}
