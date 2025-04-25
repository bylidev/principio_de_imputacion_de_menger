# 🧩 Proyecto Open Source  
- Dejá tu MR con el JSON o fuente de datos a agregar.  
- Luego de aprobado, se sube directo a producción.
- Se pueden agregar como colaboradores
- Configurando pipeline publico para extraer dicha fuente de datos todos los dias y aplicar cambios de la comunidad
  
# increments_avg

Calcula, por sucursal, el **porcentaje promedio de incremento de precios** respecto al **precio mínimo global** de cada producto.

## ¿Qué hace?

1. Filtra productos cargados en la fecha actual (`CURRENT_DATE`).
2. Identifica el **precio mínimo** de cada producto en todas las sucursales.
3. Agrupa los productos por sucursal y comercio.
4. Calcula el **promedio del precio** de esos productos en la sucursal.
5. Compara ese promedio contra el promedio de los **precios mínimos** de esos mismos productos.
6. Devuelve el porcentaje de incremento promedio por sucursal.

---

## Ejemplo

Supongamos que los productos y precios para hoy son:

| id_producto | id_comercio | id_sucursal | precio_lista |
|-------------|-------------|-------------|--------------|
| A           | 1           | 1           | 120          |
| A           | 1           | 2           | 100          |
| B           | 1           | 1           | 210          |
| B           | 1           | 2           | 200          |

Los precios mínimos globales serían:

- Producto A → 100  
- Producto B → 200

### Sucursal 1:
- Promedio de precios: (120 + 210) / 2 = 165  
- Promedio de mínimos: (100 + 200) / 2 = 150  
- Incremento %: ((165 - 150) / 150) * 100 = **10%**

### Sucursal 2:
- Promedio de precios = (100 + 200) / 2 = 150  
- Promedio de mínimos = (100 + 200) / 2 = 150  
- Incremento % = 0%

---

## ¿Por qué es útil?

Permite detectar qué sucursales están vendiendo productos con precios significativamente más altos respecto al mínimo disponible del día.


## Fuente
datos.produccion.gob.ar/dataset/sepa-precios
