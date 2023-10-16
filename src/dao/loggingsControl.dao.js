import { loggingsControlModel } from "../models/loggingsControl.model.js";

class loginControl{
    constructor(){
        this.model = loggingsControlModel;
    }

    async getloggingsControl(){
        try {
            return await this.model.find()
        } catch (error) {
            console.log("error loggingsControl.dao --> getloggingsControl: ",error);
        }
}

    async loggingsControl(data){
        try {
            return await this.model.create(data)
        } catch (error) {
            console.log("error loggingsControl.dao --> loggingsControl: ",error);
        }
}
}

const LoginControlsDao = new loginControl();

export default LoginControlsDao