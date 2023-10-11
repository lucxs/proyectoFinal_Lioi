export default class addingProdDTO{

    constructor(dataProduct){
        this.title = dataProduct.name
        this.description = dataProduct.description
        this.price = dataProduct.precio
        this.thumbnail = dataProduct.thumbnail
        this.code = dataProduct.code
        this.stock = dataProduct.stock
        this.status = dataProduct.status
        this.marca = dataProduct.marca
        this.carts = dataProduct.carts
        this.ownerAdm = dataProduct.ownerAdm
        this.owner = dataProduct.owner
    }
}