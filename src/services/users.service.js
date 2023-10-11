
export default class UserService{

        constructor(dao){

         this.dao = dao;

        }

        async getUsers(){

               return await this.dao.getUsers()

        }

        async createUser(userData){
            try {

                return await this.dao.addUser(userData);
                
            } catch (error) {

                //req.logger.error("Error en la capa de servicio metodo createUser:",error);
                console.log("Error en la capa de servicio metodo createUser:",error);
            }
    

    }

    async getAllUsers(){

        try {
                return await this.dao.getAllUsers()
            
        } catch (error) {

            req.logger.error("Error capa de servicio Getallusers: ", error);
        }
    }

    async getById(id){
        try {
                return await this.dao.getUserById(id)
        } catch (error) {

                req.logger.error("Error en la capa de servicio obteniendo userById:",error);
            
        }
    }

    async resetPassword(userEmail,Password){

        return await this.dao.resetPassword(userEmail,Password)
    }

    async updateUserRole(uid, role){
            try {
                return await this.dao.updateUserRole(uid, role)
            } catch (error) {
                req.logger.error(error)
                console.log(error);
            }
        
    }

    
}




