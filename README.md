## ⚠️ TODO / Pendientes

```txt
- [ ] Evaluar reemplazo de `request` (deprecated).
- [ ] Actualizar `express-openid-connect` cuando esté disponible una versión segura.
- [ ] Evitar el uso de `npm audit fix --force` por posibles incompatibilidades con `node-telegram-bot-api`.
- [ ] Todos los archivos que lo requieren tienen el BusinessId hardcodeado, se intento colocar como variable de entorno, pero no la reconocia - para pruebas quedara asi, mas adelante hay que desarrollar un flujo que recoja ese businessId desde el loguin - mientras intentare que se pueda guardar y utilizar correcatamente desde la variable de entorno
- [X] getAccessToken/mercadoLibreQuestionHandler/updateSocialMediaActiveHandler tiene el userId harcodeado, hay que cambiarlo manualmente al iniciar sesion con MeLi - para pruebas quedara asi,
- [ ] desarrollar una funcion que encuentre ese userId y ejecutarla en los archivos que este hardcodeado
- [ ] GRAPH_API_TOKEN = El token de wsp y de IG; hay que renovarlo y cambiarlo en las variables de entorno (desarrollo y produccion); hay que generar un token de larga duración (expira en 60 dias):
    1- generar un token corto de usuario en Graph API Explorer (https://developers.facebook.com/tools/explorer/)
    2- generar el token de larga duración en Postman o Thunder Client:
        -Method: GET
        -URL:https://graph.facebook.com/v21.0/oauth/access_token
        -Params:(Key/Value)
            grant_type:	fb_exchange_token
            client_id
            client_secret
            fb_exchange_token: token corto de usuario(generado en el pto1)

Luego habra que desarrollar una funcion que permita calcular la fecha de expiracion y generar un nuevo token automaticamente (para eso hay que guardar los datos en la bbd) - ver funcion comenzada en IG
-[ ] INSTAGRAM: encontrar la forma de acceder al nombre de usuario que envia el mensaje; para guardarlo y mostrarlo por nombre y no por ID (instagram webhook)
-[X] TELEGRAM: los mensajes se pisan, agregar un atributo al modelo MsgReceived para que guarde el ID externo (str, puede ser null) asi se usa en el condicional para crear un nuevo mensaje
-[ ] Reestructurar el codigo para no tener todo mezclado; quizas en conveniente armar un carpeta por cada red social y tener en ella los webhook, handlers y controllers; asi seria mas facil escalarlo


```
