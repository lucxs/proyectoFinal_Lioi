import UserService from "../services/users.service.js";
import userDao from "../dao/user.dao.js";
import LoginControlsDao from "../dao/loggingsControl.dao.js";
import UserRegisterRepository from "../repositories/users/register.repositories.js";
import MailingService from "../services/mail.service.js";
import { hashPassword,comparePassword } from '../utils/encript.util.js';
class UsersController {

    constructor(){
        //Creo en el constructor el dao con filtro por DTO
        this.daoFiltered = new UserRegisterRepository(userDao)
        this.service = new UserService(userDao, LoginControlsDao);
        this.MailingService = new MailingService();
    }

    async getUsers(){

            const users = await this.service.getUsers()
           const usersFiltered = users.map((user)=>{
                  return  {
                        "first_name":user.first_name,
                        "email":user.email,
                        "role":user.role
                    }
            })

            return usersFiltered
    }

    async createUser(userData){

        try {
                    //Envio al DTO el objeto con la info del user a registrar
            const dataUserFiltered =await  this.daoFiltered.addUser(userData)

            return await this.service.createUser(dataUserFiltered);
        
        } catch (error) {

            //req.logger.error("Error en la creación del user - userController",error);
            console.log("Error en la creación del user - userController",error);
        }
    }

    async getById(id){

        return await this.service.getById(id);
    }

    async getByEmail(email){
        const allUsers =await this.service.getUsers()
                const userByEmail = allUsers.find((user)=>user.email === email)
                return userByEmail;
    }

    async updateUserRole(uid, role){
        try {
            await this.service.updateUserRole(uid, role)
        } catch (error) {
            req.logger.error(error)
            console.log(error);
        }
        

    }

    async SendResetPassword(email){

        const mailOptions = {
            from: 'Optics <lioilucas75@gmail.com>',
            to: `${email}`,
            subject:`resetPassword`,
            html: `<h1>You recently requested to reset your password. Use the button below to reset it. This password reset is only valid for the next hour.</h1>

            <div class="btn btn-info"><a href="http://localhost:8080/resetPassword/${email}">ResetPassword</a></div>
            `    
        };

       await this.MailingService.sendMail(mailOptions)

    }

    async resetPassword(userEmail,validPassword, confirmPassword){

        try {
        
            if (validPassword ==confirmPassword) {
                const user = await userController.getByEmail(userEmail)
                const comparePass = comparePassword(user, validPassword) 
                console.log("La pass desde views: ",validPassword);
                console.log(user);
                if (comparePass) {
                    const err ={'messageError':"La contraseña debe ser distinta a la anterior"};
                    return err
                }else{
                    const passwordHashed = hashPassword(validPassword)
                    return this.service.resetPassword(userEmail,passwordHashed)
                    
                }
                        
            }  else{
                const err ={'messageError':"los campos deben coincidir"}
                return err
            }
                
            } catch (error) {
                    console.log(error);
                // req.logger.error("Error en user.ccontroller -->method resetPassword")
            }
    }

            //registro y control de login

            async getloggingsControl(){

                    try {
                            return this.service.getloggingsControl()
                    } catch (error) {
                        console.log("error user.controller --> getloggingsControl: ",error);
                    }

            }

            async loggingsControl(data){
                try {
                    return await this.service.loggingsControl(data)
                } catch (error) {
                    console.log("error user.controller --> loggingsControl: ",error);
                }

            }

    async deleteUsers(data){
        try {
            return await this.service.deleteUsers(data)
        } catch (error) {
            console.log("error user.controller --> deleteUsers: ",error);
        }
       

    }

}

const userController = new UsersController();

export default userController;