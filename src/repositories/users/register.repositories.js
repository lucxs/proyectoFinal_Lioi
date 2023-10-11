import userRegisterDTO from "../../dao/DTOs/users/userRegister.dto.js";

export default class UserRegisterRepository {
    constructor(dao) {
        this.dao = dao;
    }

        //User Register
    async addUser(data) {

        try {

            const user = new userRegisterDTO(data);
            return user
            
        } catch (error) {
              console.log("Error - capa de abstracción DTO:", error);      

        }
        
    }



}