
export default class UserService{

        constructor(dao, LoginControlsDao){

         this.dao = dao;
        this.LoginControlsDao = LoginControlsDao
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

    async getloggingsControl(){
        try {
            return await this.LoginControlsDao.getloggingsControl()
        } catch (error) {
            console.log("error user.service --> loggingsControl: ",error);
        }
    }

    async loggingsControl(data){
        try {
            return await this.LoginControlsDao.loggingsControl(data)
        } catch (error) {
            console.log("error user.service --> loggingsControl: ",error);
        }
    }

    async deleteUsers(data){
        try {
            return await this.dao.deleteUsers(data)
        } catch (error) {
            console.log("error user.service --> deleteUsers: ",error);
        }
    }
}




