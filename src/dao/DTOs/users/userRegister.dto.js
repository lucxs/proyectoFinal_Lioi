export default class userRegisterDTO {

    constructor(datauser){
        this.first_name= datauser.name;
        this.last_name= datauser.lastname;
        this.email= datauser.email;
        this.password= datauser.password;
        this.cart = datauser.cart,
        this.role = datauser.role
    }

}