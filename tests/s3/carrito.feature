# language: es
Característica: Carrito de compras
  Como cliente de la tienda
  quiero agregar libros al carrito
  para comprarlos juntos al final

  Antecedentes:
    Dado que estoy en la categoría Books

  Escenario: DWS-CAR-002 · agregar dos libros distintos
    Cuando agrego "Computing and Internet" al carrito
    Entonces el carrito tiene 1 producto
    Cuando agrego "Fiction" al carrito
    Entonces el carrito tiene 2 productos

  Escenario: DWS-CAR-004 · el libro aparece dentro del carrito
    Cuando agrego "Computing and Internet" al carrito
    Y abro el carrito
    Entonces el carrito contiene "Computing and Internet"

  Esquema del escenario: DWS-CAR-003 · el precio de "<libro>" es <precio>
    Entonces el precio de "<libro>" es "<precio>"

    Ejemplos:
      | libro                  | precio |
      | Computing and Internet | 10.00  |
      | Fiction                | 24.00  |
      | Health Book            | 10.00  |
