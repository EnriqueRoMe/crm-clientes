(function () {

 let idCliente;

  const nombreInput = document.querySelector("#nombre");
    const emailInput = document.querySelector("#email");
    const telefonoInput = document.querySelector("#telefono");
    const empresaInput = document.querySelector("#empresa");



  document.addEventListener("DOMContentLoaded", () => {
    conectarDB();

    const parametroURL = new URLSearchParams(window.location.search);
     idCliente = parametroURL.get("id");

    if (idCliente) {
      setTimeout(() => {
        obtenerCliente(idCliente);
      }, 1000);
    }

    formulario.addEventListener('submit', actualizarCliente);
  });

 
 
  function actualizarCliente(e){
    e.preventDefault();

    if(nombreInput.value ==='' ||emailInput.value ==='' || empresaInput.value==='' || telefonoInput ===''){
        imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }
   
    //Cliente actulizado 

    const clienteActualizado = {
        id: Number(idCliente),
        nombre : nombreInput.value,
        email : emailInput.value,
        empresa : empresaInput.value,
        telefono : telefonoInput.value
    }

    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");

   objectStore.put(clienteActualizado);

    transaction.onerror = function(){
        imprimirAlerta('Error al guardar', 'error');
    }
    
    transaction.oncomplete = function(){
        imprimirAlerta('El cliente se actualizo correctamente');
    }

    
  }

  function obtenerCliente(id) {
    
    const transaction = DB.transaction(["crm"], "readonly");
    const objectStore = transaction.objectStore("crm");

    const cliente = objectStore.openCursor();

    cliente.onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        if (cursor.value.id === Number(id)) {
          llenarFormulario(cursor.value);
        }
        cursor.continue();
      }
    };
  }

  function llenarFormulario(cliente){
    const { nombre, email, telefono, empresa}= cliente;
     nombreInput.value = nombre;
     emailInput.value= email;
    telefonoInput.value= telefono;
     empresaInput.value= empresa;
  }
})();
