# Ciceri Juan Pablo 

_Proyecto de backend entrega con Mocking y manejo de errores

## El proyecto esta compuesto por las siguientes partes:

_Carpeta src, la cual a su vez reune dentro suyo a:_
```
1. Config, que guarda dentro suyo a config.js (donde se aloja dotenv). Y el Passport config
```
```
2. Controllers, figuran aqui todos los controladores que trabajaran con los servicios (auth, cart, products, user, ticket, email).
```
```
3. Dao, gracias a esta gran carpeta podemos ver organizado todo lo siguiente:
```
```
A. Carpeta fs donde estan los archivos file sistem.
```
```
B. Carpeta models, hay aqui todos los modelos necesarios para poder trabajar tanto con los usuarios como los mensajes, los carritos y los productos.
```
```
C. Junto a estas carpetas tambien encontraremos en dao a todos los managers para trabajar con los modelos nombrados anteriormente.
```
```
4. Middlewares, la que contiene los handler errors y el ingreso
```
```
5. Mocking, para generar los mocks de los productos
```
```
6. Public, la cual es otra gran carpeta que contiene a:
```
```
A. Carpeta css la cual contiene los estilos del proyecto.

```
```
B.Encontraremos dentro de si a login.js y a restore js.
Por ultimo y no en importacia tambien aqui encontraremos a los archivos: cart.js, chat.js, realTimeProducts.js, restore.js, register.js  y user.js.
```
```
7. Routes, por aqui pasaran todas las rutas para unir a la app con las vistas a los diferentes sectores de la pagina.
```
```
8. Carpeta models, hay aqui todos los modelos necesarios para poder trabajar tanto con los usuarios como los mensajes, los carritos y los productos.
```
```
9. Services, quien aloja a todos los servicios que trabajaran con los controladores.
```
_Carpeta view donde estan las vistas de la pagina, la cual contiene a layouts(donde encontraremos a main.handlebars) y tambien a las vistas de cart, products, product detail, login, register, restore, profile, chat y real time products_

_Env., quien trabaja reservando las variables para dotenv._

_App.js, donde confluyen todos para darle vida a la pagina, trabaja con express, handlebarss, socket.io, mongoose, passport, cookie-parser y los enrutadores_

_Utils js, donde se encuentra al __dirname_

