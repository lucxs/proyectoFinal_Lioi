

const socket = io();

socket.on('products', async(allprods)=>{


        return await productsRender(allprods)

})


      async function productsRender(allprods){

     
     const html = await allprods.map((prod)=>{
     
         return `
         <div class="card prods__cards" style="width: 18rem;">
                    <img src="https://stylewatchio.vtexassets.com/arquivos/ids/175815/RT123591_00.jpg?v=1773371444" class="card-img-top card prods__img" alt="Gafas de sol">
                    <div class="card-body" key=${prod.id}>
                        <p class="idoculto">${prod._id}</p>
                        <h5 class="card-title">${prod.title}</h5>
                        <p class="card-text">${prod.description}</p>
                        <p class="card-text">Precio: ${prod.price}</p>
                        <p class="card-text">Stock: ${prod.stock}</p
                        <p class="card-text">Marca: ${prod.marca}</p>
                        <button class="btn btn-primary" onclick="addProductToCart('api/carts/6490d95c437c8c2412dbaf4b/product/${prod._id}')">AddToCart</button>
                    </div>
         </div>
         
         `
     }).join(' ');
     
     document.getElementById('listProductsRealTime').innerHTML = html


}
    //Funcion del onclick para agregar productos al home

function addProduct(e){
    let name = document.getElementById("name").value
    let description = document.getElementById("description").value
    let precio = document.getElementById("price").value
    let thumbnail = document.getElementById("thumbnail").value
    let code = document.getElementById("code").value
    let stock = document.getElementById("stock").value
    let status = document.getElementById("status").value
    let marca = document.getElementById("marca").value
    let dataOwner = document.getElementById("dataOwner").value
    console.log("dataOwner:", dataOwner);
    if (dataOwner === 'admin') {
        socket.emit('addingProds', {"name": name,"description":description,"precio":precio,"thumbnail":thumbnail,"code":code,"stock":stock,"status":status,"marca":marca, "ownerAdm":dataOwner})

        alert("Se agrego un nuevo producto")
    }else{
        socket.emit('addingProds', {"name": name,"description":description,"precio":precio,"thumbnail":thumbnail,"code":code,"stock":stock,"status":status,"marca":marca, "owner":dataOwner})
       
        alert("Se agrego un nuevo producto")
    }
      
     
}


//Funcion del onclick para eliminar productos del home


 function deleteProd(e){


     let idProd = document.getElementById("idprod").value
     let url = 'api/products/' + idProd;
     fetch(url,
        {
           method: 'DELETE',
           headers: {
           'Content-Type': 'application/json'
           }
       })
       .then(response => {
           if (response.ok) {
           console.log('La solicitud fue exitosa');
           alert("Producto eliminado correctamente")
           
           } else {
           console.log('La solicitud falló');
           
           }
       })
       .catch(error => {
           console.log('Error al enviar la solicitud:', error);
           
       });

}

//Restablecer password

 function restorePass(e){


    const EmailUser = prompt("Ingrese su correo para restablecer su contraseña")

     alert(EmailUser)
     console.log(EmailUser);

        const path ='api/users/sendEmail/restorePass/'+ EmailUser

     fetch(path,
        {
           method: 'POST',
           headers: {
           'Content-Type': 'application/json'
           }
       })
       .then(response => {
           if (response.ok) {
           console.log('La solicitud fue exitosa');
           alert("Verifique su casilla de correo para restablecer su contraseña")
           
           } else {
           console.log('La solicitud falló');
           
           }
       })
       .catch(error => {
           console.log('Error al enviar la solicitud:', error);
           
       });
}


//Seccion del chat

let Inputmsj = document.getElementById("msj")
let usr = document.getElementById("Title")
 
Inputmsj.addEventListener('keyup', event =>{


    if (event.key == "Enter"){
        let user = usr.getAttribute("data-firstname")
         let msj = Inputmsj.value;
         console.log("Desde el primer socket emit:",{"user":user, "msg":msj});
         if (msj.trim().length > 0){
             socket.emit("message", {"user":user,"message":msj})
             Inputmsj.value = '';
         }
    }

})

    async function chatRender(data){

        try {

            const html = await data.map((dat)=>{

                return `
                <strong>${dat.user}:</strong>
                <p>${dat.message}</p>
                
                `
                    
            })
            .join(' ');

                document.getElementById("blockText").innerHTML = html;
            
        } catch (error) {

            console.log("Algo esta mal en chatRender -->", error);
            
        }

        
}

socket.on("sendingMSGs", async(data)=>{

    try {
        return await chatRender(data)
    } catch (error) {
        console.log(error);
    }


})


