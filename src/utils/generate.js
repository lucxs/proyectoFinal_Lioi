import {faker} from '@faker-js/faker'

export function generateProducts(){
    const numberOfProducts = faker.string.numeric({ length: { min: 2, max: 3 } });
    const products = [];
    for(let i = 0; i < numberOfProducts; i++){
        products.push({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumnail:faker.internet.url(),
            code:faker.number.int(),
            stock:faker.number.int(50),
            status:faker.datatype.boolean(),
            marca:faker.commerce.productAdjective(),
            image: faker.image.url()
        })
}
return products
}