import bcrypt from "bcrypt"

export const hashPassword = password =>{

    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const comparePassword =(user, hash)=>{

            return bcrypt.compareSync(hash, user.password)
}