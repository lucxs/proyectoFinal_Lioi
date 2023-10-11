import { productsModel } from "../models/products.model.js";
class ProductsDAO{

    constructor(){
        this.model = productsModel;
    }

    async getProducts(){

        try {
            
            return await this.model.find()

        } catch (error) {

            req.logger.error("Error en la capa de persistencia. Metodo getProducts - dao -:",error);
            
        }
    }

    async getProdById(pid){

        try {
            return await this.model.findOne({_id:pid})
        } catch (error) {
            req.logger.error("Error getProdById:", error);
        }
    }

    async getSomeProdsById(data){
        try {
            return await this.model.find({_id: {$in: data}})
            
        } catch (error) {

            req.logger.error("Error getSomeProdsById capa PRODUCTS-DAO");
            
        }
    }

     async addProduct(data){

        try {

            return await this.model.create(data);

        } catch (error) {
            
                //req.logger.error("Error en el addproduct - Metodo addProduct - dao -:",error);
                console.log("Error en el addproduct - Metodo addProduct - dao -:",error);
        }

     }

     async updateProduct(id, newObject){
        try {

            return await this.model.updateOne({_id:id},{$set: newObject})
                
        } catch (error) {
            
            req.logger.error("error en metodo updateProduct - dao - ",error);
        }
}

async updateProductStock(id, newValue){
    try {

        const product = await this.model.findOne({ _id: id })

        const originalStock = product.stock;

        if (originalStock < newValue) {
            return {"Error": "Stock insufiente"}
        }else{

            const newStock = originalStock - newValue;
            return await this.model.updateOne(
                { _id: id },
                { $set: { stock: newStock } }
            );
        }


    } catch (error) {
        
        req.logger.error("error en metodo updateProduct - dao - ",error);
    }
}

    async prodsPaginated(limit, page, query, sort){

        try {

            //Si query y sort son undefined retornar sin orden y sin filtro 
      if (query == undefined && sort == undefined) {

         return await this.model.paginate({},{lean: true, limit:limit, page:page})
         

         //Si query es distinto a undefined y sort es undefined retornar sin orden y con filtro 
      }else if(query !== undefined && sort == undefined){

         return await this.model.paginate({marca: query},{ lean: true, limit:limit, page:page})

      }else if(query == undefined && sort !== undefined){

         let srt =  {price: sort}
         return await this.model.paginate({},{ lean: true, limit:limit, page:page, sort:srt})

      }else if(query !== undefined && sort !== undefined){
         let srt =  {price: sort}

         return await this.model.paginate({marca: query},{ lean: true, limit:limit, page:page, sort:srt})

      }

      
   } catch (error) {

      req.logger.error(error);
      
   }

    }

async deleteProduct(data){

        try {
            await this.model.deleteOne({_id: data.toString()})
        } catch (error) {
            
                //req.logger.error("Error delete product dao: ",error);
                console.log("Error delete product dao: ",error);
        }

}

}

const productsDAO = new ProductsDAO();

export default productsDAO