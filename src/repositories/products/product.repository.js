import addingProdDTO from "../../dao/DTOs/products/product.dto.js";


export default class productRepository {
    constructor(dao) {
        this.dao = dao;
    }

        //Product register
    async checkingProduct(data) {

        try {

            const product = new addingProdDTO(data);
            return product
            
        } catch (error) {
            req.logger.error("Error - capa de abstracción DTO:", error);      
            return error
              

        }
        
    }



}