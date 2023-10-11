

 //Eliminando producto seleccionado de un cart en especifico

 function deleteProdOnCart(path){
 fetch(path, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }

  }).then(response => {
    if (response.ok) {
        
      console.log("Operacion exitosa");
      setTimeout(() => {
        location.reload();
       }, 1000);
    }else{
        console.log('La solicitud falló');
    }
    
  })
  
  .catch(error => {
    console.error('Error al enviar la solicitud', error);
  });
}
 

//update cantidad producto seleccionado de un cart en especifico

function UpdateQProdFromCart(path){
  let quantity = document.getElementById("SelectQuantity").value
  let newPath = `${path}/${quantity}`;
  console.log(newPath);


    fetch(newPath, {
       method: 'PUT',
       headers: {
         'Content-Type': 'application/json'
       }
   
     }).then(response => {
       if (response.ok) {
        console.log("Operacion exitosa");
        setTimeout(() => {
          location.reload();
         }, 1000);
       }else{
        console.log('La solicitud falló');
       }
       
     })
     
     .catch(error => {
       console.error('There was a problem with the fetch operation:', error);
     });
     
   }


   function emptyCart(path){
    console.log("La Ruta:",path);
   
      fetch(path, {
         method: 'DELETE',
         headers: {
           'Content-Type': 'application/json'
         }
     
       }).then(response => {
         if (response.ok) {
          console.log("Operacion exitosa");
          setTimeout(() => {
            location.reload();
           }, 1000);
         }else{
          console.log('La solicitud falló');
         }
         
       })
       
       .catch(error => {
         console.error('There was a problem with the fetch operation:', error);
       });
       
     }

     function purcharse(path) {

      fetch(path, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
    
      }).then(response => {
        if (response.ok) {
         console.log("Operacion exitosa");
         alert("Operación exitosa")
         setTimeout(() => {
          location.reload();
          }, 1000);
        }else{
         console.log('La solicitud falló');
        }
        
      })
      
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
      
     }