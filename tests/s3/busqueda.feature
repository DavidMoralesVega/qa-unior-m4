# language: es
Característica: Búsqueda de productos
  Como cliente de la tienda
  quiero buscar un producto por su nombre
  para no recorrer todas las categorías

  Escenario: Busco un libro que existe
    Dado que estoy en la categoría Books
    Cuando busco "Fiction"
    Entonces veo "Fiction EX" en los resultados

  Escenario: Busco un libro que no existe
    Dado que estoy en la categoría Books
    Cuando busco "Harry Potter"
    Entonces veo el texto "No products were found"
