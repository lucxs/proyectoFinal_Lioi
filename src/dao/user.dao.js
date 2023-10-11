import { UsersModel } from "../models/userJWT.model.js";

class UserDao{

constructor(){

     this.model = UsersModel;

}

async getUsers(){
    try {

        return await this.model.find()
        
    } catch (error) {

        //req.logger.error("Error en la capa de persistencia. Metodo getAllUsers:",error);
        console.log("Error en la capa de persistencia. Metodo getAllUsers:",error);
    }
}


async getUserById(id){

    try {
        return await this.model.findById(id)
        
    } catch (error) {

        req.logger.error("Error getUserById - Capa de persistencia(DAO)");
        
    }
}

async addUser(userData){
    try {
        
        return await this.model.create(userData);

    } catch (error) {

        //req.logger.error("Error en la capa de persistencia. Metodo addUser:",error);
        console.log("Error en la capa de persistencia. Metodo addUser:",error);
    }
}

async resetPassword(userEmail,password){

    return await this.model.updateOne({email:userEmail},{$set: {password: password}})

}

async updateUserRole(uid, role){
    try {
        
        return await this.model.updateOne({_id:uid},{$set: {role: role}})       
    } catch (error) {
        req.logger.error(error)
        console.log(error);
    }

    
}

}

const userDao = new UserDao();

export default userDao;