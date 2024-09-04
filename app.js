





 let saberTotal = () => {
    let precio = prompt("Ingrese el precio del producto");
    const iva = 0.21;
    let total = precio * iva + parseFloat(precio);

    console.log(`El total del producto con iva es: ${total}`)

 }


saberTotal()