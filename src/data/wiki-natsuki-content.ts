/* ─── Natsuki Wiki Content ─── */
import {
  Download, RefreshCw, CircleHelp, Star, Home, User,
} from 'lucide-react';

export const natsukiWikiContent: Record<string, string> = {
  home: `## Bienvenido a la Wiki de Just Natsuki

Bienvenido a la wiki sobre ***Just Natsuki***, el mod de Doki Doki Literature Club! que te permite pasar una eternidad jugando, leyendo manga y conversando con Natsuki >-<.

Esta wiki es un recurso central para todo lo que quieras saber sobre Just Natsuki. Nos esforzamos por mantenerla actualizada con cada lanzamiento del mod, sirviendo como recurso tanto para los jugadores como para el equipo de desarrollo.

Además, tenemos todo lo nuevo traducido al español lo mas rapido posible.

Actualmente ofrecemos los siguientes artículos:
* [Instalación](https://github.com/The-Encoders-Club/Just-Natsuki-ES/wiki/1.-%F0%9F%93%A5-Instalaci%C3%B3n)
* [Actualizaciones](https://github.com/The-Encoders-Club/Just-Natsuki-ES/wiki/2.-%E2%9A%99%EF%B8%8F-Actualizaciones)
* [Preguntas Frecuentes](https://github.com/The-Encoders-Club/Just-Natsuki-ES/wiki/4.-%F0%9F%A4%94-Preguntas-frecuentes-(FAQ))
* [Características del mod](https://github.com/The-Encoders-Club/Just-Natsuki-ES/wiki/5.-%F0%9F%92%8E-Todas-las-caracter%C3%ADsticas--(spoiler))
* [Guía de atuendos](https://github.com/The-Encoders-Club/Just-Natsuki-ES/wiki/6.-%F0%9F%91%92-Gu%C3%ADa-de-ropa-y-atuendos-personalizados)`,
  instalacion: `# Instalación
Ten en cuenta que no ofrecemos soporte oficial para instalaciones que utilicen gestores de mods ni para descargas realizadas desde fuentes distintas a nuestro GitHub oficial.  
Además, dado que esta es una traducción hecha por fans y no contamos con un instalador oficial, es posible que surjan errores si el proceso no se hace con cuidado. Por ello, te recomendamos seguir las instrucciones al pie de la letra.

## Instalación (manual)
1. Descarga una copia limpia de DDLC desde el [sitio oficial](https://ddlc.moe/). **No uses la versión de Steam**.
2. Extrae/descomprime el archivo de DDLC.
3. Descarga la [última versión](https://github.com/The-Encoders-Club/Just-Natsuki-ES/releases/tag/Actualizaci%C3%B3n) del mod aquí: selecciona el archivo ZIP que empieza por jn (ej. jn-1.0.0.zip). No descargues el código fuente (Source code), ya que esto causará fallos en futuras actualizaciones.
3. Extrae/descomprime los archivos del mod JN.
4. Copia todo el contenido de la carpeta \`game\` del mod JN y pégalo dentro de la carpeta \`game\` de tu instalación de DDLC. Si se te pide reemplazar archivos, selecciona Sí.
5. Copia todo el contenido de la carpeta \`lib\` del mod JN y pégalo dentro de la carpeta \`lib\` de DDLC. Si se te pide reemplazar archivos, selecciona Sí.
6. Copia la carpeta \`update\` del mod JN y pégala dentro de la carpeta principal de DDLC.
7. Finalmente, inicia DDLC.
8. ¡Disfruta!



`,
  actualizaciones: `# Actualización

Sigue estas instrucciones si ya tienes JN instalado. Si estás ejecutando una versión BETA de JN, sigue los pasos de instalación.  
Realiza una copia de seguridad de tu archivo persistente y lee atentamente las instrucciones.

## Actualización (Manual)

1. Cierra JN, si estás jugando el mod actualmente.  
2. Descarga el último lanzamiento [aquí](https://github.com/The-Encoders-Club/Just-Natsuki-ES/releases/tag/Actualizaci%C3%B3n), selecciona el archivo ZIP que comienza con jn (por ejemplo, jn-1.0.0.zip).
Nota: No descargues el código fuente (source code), ya que esto provocará que fallen las actualizaciones futuras.
3. Extrae/descomprime los archivos de la nueva versión.
4. Copia todo el contenido de la carpeta \`game\` del mod JN y pégalo dentro de la carpeta \`game\` de tu instalación de DDLC. Si se te pide reemplazar archivos, selecciona Sí.
5. Copia todo el contenido de la carpeta \`lib\` del mod JN y pégalo dentro de la carpeta \`lib\` de DDLC. Si se te pide reemplazar archivos, selecciona Sí.
6. Copia la carpeta \`update\` del mod JN y pégala dentro de la carpeta principal de DDLC. Si se te pide reemplazar archivos, selecciona Sí.
7. Finalmente, inicia DDLC.
Solución de problemas: Si el juego no parece actualizarse o muestra una advertencia sobre archivos .rpy, significa que estás ejecutando el código fuente (archivos que terminan en .rpy) en lugar de los archivos del lanzamiento (release). Para solucionarlo: elimina todo el contenido de la carpeta game, descarga los archivos del lanzamiento (los que empiezan con jn) y actualiza usando esos.
8. Disfruta y pasa tiempo con Natsuki`,
  faq: `# Preguntas Frecuentes (FAQ)
¡Bienvenidos a la página de Preguntas Frecuentes! Aquí listamos las respuestas a las preguntas comunes que recibimos sobre la instalación del mod, el contenido y más.

## Instalación
### ¿Cómo instalo el mod?

Por favor, consulta las instrucciones listadas [aquí].

### Descargué e instalé los archivos del mod, pero el juego sigue siendo el DDLC original (vanilla).

Verifica tu instalación: recuerda que los archivos del mod deben estar extraídos/descomprimidos, al igual que los archivos del juego base de DDLC.

### Descargué e instalé los archivos del mod, pero el juego no se parece en nada a las capturas de pantalla del sitio web.

Es posible que hayas instalado la distribución descontinuada de Just Natsuki: borra tu instalación e inténtalo de nuevo siguiendo las instrucciones de arriba. Recuerda: ¡los únicos archivos oficiales del mod son los de GitHub!

### Descargué el mod, pero no desde GitHub. ¿Es legítimo?

No. Nunca distribuimos nuestro mod fuera de GitHub. Cualquier distribución o descarga de nuestro mod que no provenga del GitHub oficial de la traducción de JN no es reconocida por el equipo, y tomaremos las medidas que consideremos necesarias para eliminar dichos archivos. No hay forma de garantizar la seguridad o qué tan actualizada esté una distribución no oficial, por lo que recomendamos encarecidamente a todos los usuarios que solo descarguen los archivos del mod desde el GitHub oficial de la traducción JN.

### ¿Tengo que pagar por el mod?

No. Cualquier sitio web (como itch.io) que solicite pagos o donaciones en nuestro nombre es una estafa. Además, no hay garantía de que los archivos alojados en otros lugares estén actualizados o libres de manipulaciones por terceros. Por favor, reporta al equipo cualquier solicitud de pago que encuentres y recuerda: ¡los únicos archivos oficiales del mod son los de GitHub!

### ¿Qué sistemas operativos soporta el mod?

Ofrecemos soporte para los principales sistemas operativos de escritorio: Windows, Linux y Macintosh. Ten en cuenta que, debido a limitaciones del motor, no todas las características secundarias funcionan en todas las plataformas. En caso de errores que tienen que ver con el mod no es problema nuestro.

### ¿Hay soporte para móviles / un port para móviles?

No existe un port oficial para móviles, pero se planificara en el futuro. En caso de tener haber uno que este fuera de este GitHub, NO SE LE DARA SOPORTE.

## Actualizaciones
### ¿Cómo actualizo el mod?

Por favor, consulta las instrucciones listadas aquí.

### Descargué e instalé archivos más nuevos del mod, y ahora mi juego no inicia.

Es posible que necesites eliminar tu archivo persistente (persistent): haz una copia de seguridad primero, elimina el original y luego intenta iniciar DDLC.exe.

### ¿Hay una función de actualización automática?

No hay capacidad de actualización automática en este momento. Por ahora, todas las actualizaciones deben realizarse manualmente. apenas y pudimos con el MAS

### ¿Con qué frecuencia se lanzan las actualizaciones?

Depende de los Dev´s originales  
NOTA DE LOS DEV´S: Al ser un proyecto hecho por pasión e impulsado por la comunidad, trabajamos gratis y hacemos nuestro mejor esfuerzo para entregar contenido cuando el horario del equipo lo permite; por lo tanto, no hay un calendario fijo para las actualizaciones. Por favor, recuerda que los miembros del equipo también son personas y tienen sus propias vidas más allá del trabajo en el proyecto. ¡No les envíes mensajes directos pidiendo información!

## Copias de seguridad y restauración
### ¿Puedo hacer una copia de seguridad de mis datos de guardado? / ¿Cómo encuentro mi persistente?

Primero necesitarás localizar tu archivo persistente; la ubicación varía según el sistema operativo que estés utilizando. Para encontrar tu persistente, introduce la siguiente ruta en la barra de búsqueda de tu explorador de archivos, según tu sistema operativo:

* Windows: \`%APPDATA%/RenPy/JustNatsuki\`
* OSX: \`~/Library/RenPy/JustNatsuki\`
* Linux: \`~/.renpy/JustNatsuki\`

Una vez que hayas localizado el archivo persistente, debes copiarlo y guardarlo en una ubicación separada. Recomendamos una estrategia de copias de seguridad usando múltiples ubicaciones (por ejemplo, una memoria USB además de almacenamiento en la nube) con múltiples copias del persistente en cada ubicación de respaldo, por si acaso.

## Reportar errores y hacer sugerencias
### ¿Cómo reporto un error en el mod?

Por favor, registra un reporte de error a través de la pestaña Issues en GitHub, haciendo clic en New issue y luego seleccionando Report Bug. ¡Por favor, reporta solo un error por informe!
o en el discord oficial de (ENCODERS CLUB)[]

## Contenido del mod
### ¿Cómo progreso en el mod / desbloqueo una característica específica?

En pocas palabras: todo lo bueno toma tiempo. Visita a Natsuki a menudo, explora todas tus opciones y, lo más importante, ¡trátala bien! Por favor, recuerda: este es un mod a largo plazo, donde el progreso de la relación ocurre a lo largo de semanas y meses. Si buscas un romance instantáneo, este no es el mod para ti. Lanzamos actualizaciones siempre que podemos, así que asegúrate de visitarnos y actualizar a menudo.

### Natsuki no habla lo suficiente / Natsuki habla demasiado.

Es posible que desees ajustar la frecuencia de charla aleatoria: puedes encontrar esta opción en el menú Settings (Configuración) dentro del juego.

### Natsuki no habla en absoluto.

Si Natsuki ya no habla, y la frecuencia de charla no está configurada en Never (Nunca), es posible que se haya quedado sin temas de conversación por el momento: ella mencionará esto directamente al jugador al menos una vez si este es el caso. Ten en cuenta que se desbloquean más temas a medida que pasan tiempo juntos, la visitas repetidamente y realizas otras actividades dentro y fuera del mod, ¡así que asegúrate de mantener tus visitas! Si deseas que Natsuki siga hablando, puedes habilitar Repeat Topics (Repetir temas) en el menú Settings dentro del juego: entonces Natsuki hablará de cualquier cosa que se le venga a la mente.

### ¿Puedo ver mi afinidad/afecto? / ¿Planean añadir una forma de comprobar la afinidad/afecto?

No, no hay una forma de comprobar tu afinidad ni planes de introducir un medio para hacerlo. Como equipo, sentimos que devalúa la relación entre Natsuki y el jugador al atar las acciones a un número fijo; además, el registro (log) ya ofrece la seguridad de que las ganancias/pérdidas/cambios de límite de afinidad están ocurriendo. Al igual que con cualquier otro dato interno del juego, existe principalmente para impulsar la funcionalidad: queremos usarlo para mostrar, no contar. También queremos evitar la competencia entre jugadores comparando valores de afinidad, como se ha visto en mods similares. Disfruta tu tiempo con Natsuki: ¡una relación no es una carrera! Recuerda: siempre puedes preguntarle a Natsuki cómo se siente contigo a través del menú Talk (Hablar), y estar atento a las pistas visuales. Si le gustas, ¡lo sabrás!

### Mi registro (log) dice que la afinidad está bloqueada. ¿Qué hago?

¡Dile a Natsuki cómo te sientes!

### Tengo preocupaciones de seguridad sobre el mod. ¿Puedo ver el código fuente?

¡Sí! Como proyecto de código abierto, nos enorgullecemos de la transparencia. Eres libre de ver nuestra base de código en la pestaña Code; sin embargo, pedimos que cualquier descubrimiento sobre características, mecánicas, etc., se mantenga en privado: por favor, no arruines la experiencia del mod (no hagas spoilers) para tus compañeros jugadores. Por favor, ten en cuenta también que el equipo se reserva el derecho de negar soporte técnico a los usuarios que sospechemos que han hecho trampas. "Hacer trampas" incluye acciones/medidas diseñadas para eludir, vencer o eliminar las mecánicas previstas del juego; incluyendo, pero no limitado a: ganancia/pérdida de afecto/confianza, contenido bloqueado, consecuencias por acciones en el juego y viajes en el tiempo (cambiar la hora del sistema). Ayudar a otros usuarios a realizar las acciones listadas anteriormente también se considera hacer trampas y, como tal, está sujeto a la retirada del soporte.

### ¿Admiten submods / contenido externo?

NOTA DE LOS DESARROLLADORES: 
El soporte oficial y las herramientas para submods es algo que buscamos introducir cuando el tiempo lo permita. Sin embargo, ¡eres bienvenido a añadir tu propia ropa y conjuntos personalizados! Por favor, consulta la Guía de ropa y conjuntos personalizados. Es posible que desees hacer tus propios cambios a JN, sin embargo, ten en cuenta que no ofrecemos soporte a usuarios que modifican su propia instalación; por favor, consulta los términos de nuestra licencia para más detalles.

### Quiero modificar / ya he modificado mi instalación. ¿Me pueden ayudar si algo sale mal?

En interés de equilibrar las necesidades de soporte de la comunidad con nuestro compromiso de entregar nuevo contenido y correcciones, lamentablemente no ofrecemos soporte para usuarios que modifican su instalación. Eres bienvenido a hacerlo, pero es bajo tu propio riesgo; y por favor, ten en cuenta que distribuir herramientas/guías para hacer trampas no será tolerado. Nos reservamos el derecho de revocar nuestra oferta de soporte a los usuarios que consideremos que han hecho trampas: puedes ser vetado (blacklisted) para reportar problemas (issues), incluyendo solicitudes de nuevas características y reportes de errores.

### ¿Por qué mi juego me advierte sobre la ejecución de archivos fuente (.rpy)?

Esta advertencia se muestra cuando el juego detecta código fuente de Ren'Py no compilado en tu carpeta game: esto generalmente sucede cuando estás ejecutando el código fuente en lugar de un lanzamiento real (release), o si tienes una instalación modificada. Para descartar esta advertencia, elimina todos los archivos de código fuente (.rpy) y reinstala el mod usando los archivos distribuidos en el último lanzamiento. Por favor, ten en cuenta que no ofrecemos soporte técnico a aquellos que ejecutan instalaciones modificadas de JN. Si entiendes los riesgos asociados con modificar tu instalación y deseas descartar la advertencia de código fuente, puedes usar el siguiente fragmento de código: persistent._jn_scw = False

### ¿Cómo le regalo a Natsuki ropa nueva / un conjunto?

Por favor, consulta la Guía de ropa y conjuntos personalizados.



## Comunidad
### ¿Puedo unirme al equipo?

La invitación para unirse a nuestro equipo se basa en contribuciones visibles a Just Natsuki y/o mods relacionados de DDLC, habilidades y participación en la comunidad de DDLC, según el criterio del equipo. ¡Por favor, no pidas unirte directamente!

### ¿Tienen un servidor de Discord?

¡Sí! Puedes unirte a nosotros aquí:

<br>
<p align="center">
    <a href="https://discord.gg/WA5D9j3yRD">
        <img src="https://discordapp.com/api/guilds/1191061790835093564/widget.png?style=banner4"/>
    </a>
</p>`,
  caracteristicas: `# Todas las características

Esta página describe todas las características actualmente disponibles en *Just Natsuki*. Ten en cuenta que, por lo tanto, esta página es propensa a **spoilers**. ¡Estás advertido!

Por favor, sé considerado y usa etiquetas de spoiler en cualquier discusión sobre los temas listados aquí si deseas discutirlos en otros lugares, como en Discord.

---

## Mecánicas

### Afinidad

#### Resumen
La Afinidad (a veces referida como Afecto) es un valor interno que determina cuánto le agrada el jugador a Natsuki. No es visible durante el juego normal, y esto es intencional.

La afinidad dicta la mayoría de las acciones que el jugador puede realizar, así como la forma en que Natsuki reaccionará a esas acciones: por ejemplo, una Natsuki enamorada de su jugador responderá mucho mejor a una broma que una que está al borde de romperse.

La afinidad se gana diariamente, y existe un límite en cuanto a cuánto se puede ganar en un período de 24 horas. La mayoría de los medios para ganar afinidad están sujetos al límite, pero algunas acciones realizadas por primera vez pueden eludir esto para obtener ganancias mayores a las habituales.

La cantidad de afinidad que es posible ganar en un período de 24 horas está influenciada por la cantidad de tiempo que el jugador ha estado en una relación con Natsuki: cuanto más antigua sea la relación, mayor será el límite. Este modificador también tiene un límite, por lo que los jugadores con una relación extremadamente larga no experimentan ganancias dramáticas.

* El límite diario máximo es **8.75**.
* El jugador puede tener una idea aproximada de cómo se siente Natsuki por él a través de **Hablar -> Hablemos de... -> Tú -> ¿Qué sientes por mí?**.

#### Niveles / Rangos
Los niveles de afinidad son los siguientes, de mayor a menor:

* **LOVE (AMOR):** Natsuki está completamente loca por su jugador y no quiere nada más que su amor. ¡Las cosas no pueden ir mejor!
* **ENAMORED (ENAMORADA):** Natsuki claramente tiene sentimientos por su jugador, y los expresa tentativamente.
* **AFFECTIONATE (CARIÑOSA):** Natsuki siempre se alegra de ver a su jugador, ¡y los sentimientos comienzan a agitarse obviamente!
* **HAPPY (FELIZ):** Natsuki está animada y es amistosa, pero aún no es particularmente cariñosa. Algunas burlas.
* **NORMAL (NORMAL):** Natsuki es generalmente cordial, pero no particularmente cariñosa. Este es el estado predeterminado.
* **UPSET (MOLESTA):** Natsuki no está particularmente feliz; generalmente directa y algo fría.
* **DISTRESSED (ANGUSTIADA):** Natsuki es clara y visiblemente infeliz. Es distante, impersonal y está frustrada.
* **BROKEN (ROTA):** Natsuki está en un estado obvio de tristeza e ira. Carece de confianza en sí misma, en su jugador y en su futuro.
* **RUINED (ARRUINADA):** Natsuki está emocionalmente agotada. Apenas habla y no guarda nada más que desesperanza y resentimiento. Las cosas no pueden ir peor.

#### Formas de ganar/perder afinidad

**La afinidad se gana a través de las siguientes acciones (lista no exhaustiva):**
* Hablar con Natsuki.
* Visitas frecuentes; ausencias de menos de una semana entre visitas.
* Responder positivamente cuando se da la oportunidad en conversaciones con Natsuki.
* Asignar apodos positivos a Natsuki.
* Elogiar a Natsuki.
* Disculparse con Natsuki cuando se ha cometido una ofensa.
* Jugar minijuegos — como Snap o Blackjack — con Natsuki.
* Dar regalos (ropa nueva y/o conjuntos) a Natsuki.
* Escuchar los chistes diarios de Natsuki.

**La afinidad se pierde a través de las siguientes acciones (lista no exhaustiva):**
* Visitas infrecuentes; largos intervalos (de dos semanas o más) entre visitas sin avisar a Natsuki con antelación, o regresar más tarde de lo que Natsuki espera si se avisó.
* Responder negativamente o groseramente cuando se da la oportunidad en conversaciones con Natsuki.
* Asignar apodos insultantes o llenos de profanidades a Natsuki.
* Elegir que Natsuki llame al jugador con nombres insultantes o profanos (incluso durante la introducción).
* Negarse a disculparse directamente con Natsuki cuando se ha cometido una ofensa.
* Cerrar el juego sin decir "Adiós".
* Hacer trampas en los minijuegos.

#### Notas adicionales
* La ganancia de afinidad es generalmente **calculada**: esto significa que se otorga una cantidad fija basada en la acción, y luego se flexibiliza (modifica) según la duración de la relación y otros factores. En efecto, las ganancias individuales de afinidad suelen ser pequeñas.
* La pérdida de afinidad es generalmente **basada en porcentajes**: esto significa que se deduce una cantidad porcentual del valor de afinidad existente basada en la acción. En efecto, las pérdidas individuales de afinidad son más dramáticas. Una mala decisión puede llevar a una deducción considerable de afinidad: ¡estás advertido!

### Salir del juego (Quitting)

Al salir del juego, el jugador tiene dos opciones: puede decirle a Natsuki que se va, o puede decidir finalizar el juego forzosamente haciendo clic en la opción de salida de la ventana del juego (cualquiera que sea la forma según el sistema operativo).

* **Avisar a Natsuki que te vas** debería ser la opción preferida, ya que esto le da a Natsuki la oportunidad de despedirse adecuadamente y prepararse para el acto de finalización del juego.
* **Cerrar forzosamente** el juego es una experiencia **dolorosa** para Natsuki: hacerlo resultará en pérdida de afinidad, con la excepción del primer cierre forzoso donde, al regresar, Natsuki preguntará qué sucedió y pedirá al jugador que evite esto en el futuro.
    * El jugador puede optar por disculparse por cerrar forzosamente el juego para recuperar algo de afinidad.

Bajo algunas circunstancias, los cierres forzosos están bloqueados: esto incluye eventos, durante los menús y cuando el jugador está introduciendo texto. Este es un comportamiento intencional.

### Notificaciones y actividad del jugador

Natsuki puede alertar al jugador cuando tiene algo de qué hablar: en Windows, hará parpadear la ventana del juego y reproducirá un sonido de notificación. En Linux y OSX, solo reproducirá un sonido de notificación. Además, Natsuki también registrará la actividad del jugador internamente y reaccionará aleatoriamente a las aplicaciones que el jugador esté usando, basándose en el título/nombre de la ventana.

* Las notificaciones pueden activarse/desactivarse en **Configuración -> Notificaciones**.
* Natsuki solo notificará al jugador cuando tenga algo de qué hablar si se siente **HAPPY** (Feliz) o superior.
* Natsuki solo notificará al jugador sobre cualquier actividad que haya notado si se siente **AFFECTIONATE** (Cariñosa) o superior, con una probabilidad aleatoria de ocurrencia.

**Las actividades reconocidas por Natsuki son las siguientes:**

<details>
<summary><strong>Haz clic para ver la lista de actividades (Spoilers)</strong></summary>

* **coding (programación):** (Visual Studio, Notepad++, Atom, Brackets, Vim, Eclipse, GitHub Desktop, SourceTree)
* **discord:** (Aplicación de Discord)
* **music_applications (música):** (Spotify, Groove, iTunes, Zune)
* **gaming (juegos):** (Steam, Origin, Battle.net)
* **youtube:** (Sitio web de YouTube)
* **github_jn:** (Página oficial de GitHub de JN)
* **artwork (arte/diseño):** (Clip Studio Paint, Photoshop, Kira, Gimp, Paint.NET, Paint Tool Sai, Medibang)
* **anime_streaming:** (Crunchyroll)
* **work_applications (trabajo/oficina):** (Word, Excel, PowerPoint, OpenOffice, LibreOffice)
* **twitter:** (Sitio web de Twitter)
* **deviantart:** (Sitio web de Deviantart)
* **manga:** (Mangadex, Mangasee, Mangakot)
* **ddlc_moe:** (Sitio web DDLC.moe)
* **takeaway_food (comida a domicilio):** (Uber Eats, Dominos, Deliveroo, Doordash, etc.)
* **instagram:** (Sitio web de Instagram)
* **music_creation (creación musical):** (Cubase, F1 Studio, Reaper, Mixcraft, Studio One, Logic Pro, Garageband, Cakewalk, Pro Tools)
* **reddit:** (Sitio web de Reddit)
* **fourchan:** (Sitio web de 4chan - sin reacción; solo registro)
* **monika_after_story:** (App MAS - sin reacción; solo registro)
* **just_yuri:** (App JY - sin reacción; solo registro)
* **forever_and_ever:** (App FAE - sin reacción; solo registro)
* **video_applications (video):** (VLC)
* **e_commerce (comercio):** (Amazon, eBay)
* **recording_software (grabación):** (OBS, Bandicam, FRAPS, XSplit Broadcaster, Lightstream Studio)

Algunas actividades detectadas pueden influir en el diálogo en temas donde sea relevante.
</details>

---

## Contenido

### Secuencia de introducción

La secuencia de introducción es la primera interacción que el jugador tendrá con Natsuki. Durante el curso de la introducción, el jugador restaura a Natsuki de su eliminación (ocurrida después de que ella huyera del salón, al ver el cuerpo de Yuri), y la ayuda a adaptarse gradualmente a su nuevo entorno.

Contrario a cualquier otro punto en el juego, el jugador puede cerrar forzosamente en cualquier momento durante la secuencia de introducción sin repercusiones negativas.

La secuencia de introducción tiene las siguientes fases:
1.  **Nuevo juego/restauración:** el jugador restaura a Natsuki de la eliminación.
2.  **Primer encuentro:** Natsuki interactúa por primera vez con el jugador, aprendiendo su nombre.
3.  **Recopilando pensamientos:** Natsuki se da cuenta de su posición actual, con el apoyo del jugador.
4.  **Calmándose:** Natsuki se calma lo suficiente para describir sus sentimientos y el nuevo conocimiento desde su posición de presidenta del club *de facto*.
5.  **Aceptación:** Natsuki comienza a aceptar su situación y se prepara para aprovecharla al máximo.

Una vez que la introducción está completa, la música aparece (fade-in), el cielo con glitches se desvanece y el jugador es libre de disfrutar de *Just Natsuki* propiamente dicho.

### Temas (Topics)

El jugador puede hablar con Natsuki sobre cualquier cantidad de temas. El jugador puede preguntarle directamente a Natsuki sobre algo a través de **Hablar -> Hablemos de...**, pedirle a Natsuki que repase algo que ya ha discutido a través de **Hablar -> Cuéntame de nuevo sobre...**, o esperar a que Natsuki saque un tema ella misma (si no se ha quedado sin cosas que decir).

Los temas se desbloquean en base a cualquier combinación de lo siguiente (lista no exhaustiva):
* Afinidad, o cuánto le agrada el jugador a Natsuki.
* Tiempo total pasado con Natsuki.
* Total de visitas individuales para ver a Natsuki.
* Actividad de juego/programa/app detectada por Natsuki.
* Ver otros temas relacionados.

Una vez desbloqueados, los temas generalmente están disponibles libremente para seleccionar a gusto del jugador. Los temas pueden volver a bloquearse si el jugador ya no cumple con sus criterios de desbloqueo: por ejemplo, si al jugador ya no le agrada lo suficiente a Natsuki como para que ella quiera hablar de un tema sensible.

Los temas usualmente ofrecen diferentes ramas de conversación basadas en la afinidad: así que volver a visitar temas antiguos en niveles más altos (o más bajos) vale la pena.

### Eventos

Una vez que el jugador ha progresado más allá de la secuencia de introducción, y ha regresado a visitar a Natsuki al menos una vez, es elegible para presenciar eventos especiales que ocurren en lugar de la típica entrada normal al visitar.

Cada evento es una secuencia de una sola vez, y cada evento tiene criterios de desbloqueo específicos que determinan si puede mostrarse: muy parecido a los temas. Un evento no puede verse de nuevo si ya ha sido presenciado por el jugador.

<details>
<summary><strong>Haz clic para ver la lista de posibles eventos (Spoilers)</strong></summary>

* **Reading manga (Leyendo manga):** (Requiere NORMAL+, 2 o más días de juego) Natsuki reacciona con sorpresa al ser atrapada leyendo *Parfait Girls*.
* **Writing a poem (Escribiendo un poema):** (Requiere AFFECTIONATE+, 7 o más días de juego) Natsuki reacciona con sorpresa y nerviosismo al ser atrapada intentando escribir poemas de nuevo.
* **Relationship doubts (Dudas de la relación):** (Requiere DISTRESSED-, 5 o más días de juego) Natsuki expresa su incredulidad y frustración con la relación, si es infeliz.
* **Fiddling with the code (Jugando con el código):** (Requiere NORMAL+, 3 o más días de juego) Natsuki reacciona con sorpresa tras ser atrapada intentando jugar con el código del juego.
* **Not a morning person (No soy madrugadora):** (Requiere HAPPY+, debe ser de mañana) Natsuki lucha por levantarse en respuesta a la llegada del jugador, y es atrapada con el cabello despeinado. Desbloquea *Ahoges* como una opción de atuendo, bajo *Headgear*.
* **RenPy for dummies (RenPy para tontos):** (Requiere NORMAL+, 5 o más días de juego) Natsuki lucha por entender el código Ren'Py, incluso con la ayuda de una nueva guía.
* **A la mode:** (Requiere HAPPY+, 5 o más días de juego) Natsuki se sumerge en un nuevo manga que apela a su reina de la moda interior. Arte del manga por AlmayArt.
* **Staying hydrated (Manteniéndose hidratada):** (Requiere HAPPY+, 5 o más días de juego) Natsuki disfruta de un agradable, fresco y relajante batido de fresa... ¡hasta que llega el jugador, de todas formas!
* **Step by step (Paso a paso):** (Requiere AFFECTIONATE+, 14 o más días de juego) Natsuki adula la última adición a su repertorio de manga: ¡incluso si es sobre autoayuda! Arte del manga por TheShunBun.
* **Eyewear problems (Problemas de gafas):** (Requiere HAPPY+, atuendos personalizados desbloqueados) ¡Natsuki encuentra su viejo estuche de gafas! ¿Pero todavía le quedan...?
* **Out of juice (Sin batería/energía):** (Requiere AFFECTIONATE+, 7 días o más de juego) Natsuki descubre por qué siempre debes guardar tu juego regularmente...
* **Game over:** (Requiere AFFECTIONATE+, 14 días o más de juego) A Natsuki le iba tan bien en su juego... ¡hasta que el jugador le hace perder el ritmo!
* **Warm package (Paquete cálido):** (Requiere AFFECTIONATE+, 7 días o más de juego, atuendos personalizados desbloqueados) ¡Natsuki descubre que el salón de clases no es el lugar más cálido para estar!
* **Sanjo:** (Requiere AFFECTIONATE+, 7 días o más de juego) ¡Natsuki descubre un amigo (ligeramente espinoso)!
* **House of cards (Castillo de naipes):** (Requiere AFFECTIONATE+, Snap desbloqueado) ¡Natsuki intenta construir un castillo de naipes! ¿Qué podría salir mal?
* **Blackjack!:** (Requiere AFFECTIONATE+, Snap desbloqueado) Natsuki finalmente descubre un nuevo juego de cartas para el que solo necesita otro jugador, ¡y vas a escuchar todo al respecto!
</details>

### Festividades (Holidays)

Una vez que el jugador ha alcanzado un nivel de afinidad HAPPY (Feliz) o superior con Natsuki, ¡puede celebrar festividades con ella!
Cada festividad se celebra solo una vez al año.
Ten en cuenta que algunas festividades requieren niveles de afinidad más altos que otras para acceder, y pueden depender de que se cumplan otras condiciones.

<details>
<summary><strong>Haz clic para ver la lista de festividades (Spoilers)</strong></summary>

* **Año Nuevo** (Requiere HAPPY+).
* **Día de San Valentín** (Requiere AFFECTIONATE+).
* **Pascua** (Requiere HAPPY+).
* **Cumpleaños de Natsuki** (Requiere HAPPY+, archivo \`party_supplies.nats\` en la carpeta \`characters\`, 1 de mayo).
* **Cumpleaños del jugador** (Requiere AFFECTIONATE+, y compartir el cumpleaños del jugador con Natsuki).
* **Halloween** (Requiere HAPPY+).
* **Nochebuena** (Requiere HAPPY+).
* **Día de Navidad** (Requiere HAPPY+).
* **Víspera de Año Nuevo** (Requiere HAPPY+).
</details>

### Admisiones

Una vez que el jugador ha alcanzado un nivel de afinidad HAPPY o superior con Natsuki, se desbloquean las admisiones: se puede acceder a ellas a través de **Hablar -> Me siento...**, y permiten al jugador compartir cómo se siente actualmente con Natsuki.

Natsuki responderá según lo que el jugador le diga que siente, su nivel de afinidad y cualquier admisión previa que haya hecho.
Las admisiones repetidas pueden resultar en que Natsuki realice acciones automáticamente en un intento de cuidar la salud de su jugador: por ejemplo, un jugador que le dice repetidamente a Natsuki que está cansado puede experimentar que Natsuki cierre forzosamente el juego para que pueda descansar un poco.

### Elogios (Compliments)

Una vez que el jugador ha alcanzado un nivel de afinidad HAPPY o superior con Natsuki, se desbloquean los elogios: se puede acceder a ellos a través de **Hablar -> Quiero decirte algo...**, y permiten al jugador elogiar a Natsuki en varios aspectos de su personalidad, apariencia, etc.
Natsuki responderá según cómo se sienta con el jugador, así como si ha sido elogiada antes y otros factores.

### Disculpas

El jugador puede disculparse con Natsuki por cualquier fechoría que haya infligido a Natsuki (como llamarla por un mal apodo), o fechorías percibidas: se puede acceder a esto a través de **Hablar -> Quiero pedir perdón...**.

Cabe señalar que las disculpas para dar a Natsuki se acumulan a medida que el jugador realiza malas acciones, en lugar de ser libremente seleccionables. Por ejemplo, un jugador no puede disculparse con Natsuki por hacer trampa en un juego si no ha hecho trampa (o si hizo trampa y ya se disculpó sin reincidir).
Si el jugador ha molestado a Natsuki y elige no disculparse, o disculparse indirectamente, Natsuki llamará la atención al jugador y solicitará que se disculpe adecuadamente.

### Apodos

#### Ponerle un apodo a Natsuki
Una vez que el jugador ha alcanzado un nivel de afinidad ENAMORED (Enamorada) o superior, se desbloquean los apodos para Natsuki: el tema para darle un apodo a Natsuki se puede acceder a través de **Hablar -> Hablemos de... -> Natsuki -> ¿Puedo ponerte un apodo?**, y esto permite al jugador darle a Natsuki un apodo que se usará en menús y diálogos.

Los apodos se verifican para asegurar que:
* No sean una grosería, ni contengan una grosería.
* No sean insultos, o una burla a los problemas/rasgos de personalidad de Natsuki.

Los apodos que rompen estas restricciones incurren en una falta (*strike*) por mal apodo — estas son **persistentes** entre sesiones de juego — así como una pérdida de afinidad. Al exceder tres faltas, Natsuki eliminará **permanentemente** la capacidad de asignarle un apodo: **esto no se puede deshacer**.

#### Apodos para el jugador
Una vez que el jugador ha alcanzado un nivel de afinidad ENAMORED (Enamorada) o superior, se desbloquean los apodos para el jugador: el tema para pedirle a Natsuki que llame al jugador por un apodo se puede acceder a través de **Hablar -> Hablemos de... -> Tú -> ¿Puedes llamarme de otra forma?**, y esto permite al jugador hacer que Natsuki lo llame por un apodo que se usará en menús y diálogos.

Los apodos se verifican para asegurar que:
* No sean una grosería, ni contengan una grosería.
* No sean insultos, o autodespreciativos.
* No sean nombres que lleven una conexión desagradable con Natsuki o su pasado.

Los apodos que rompen estas restricciones incurren en una falta (*strike*) por mal apodo — estas son **persistentes** entre sesiones de juego — así como una pérdida de afinidad. Al exceder tres faltas, Natsuki eliminará **permanentemente** la capacidad del jugador de pedirle que lo llame por un apodo: **esto no se puede deshacer**.

### Música personalizada

Una vez que el jugador ha alcanzado un nivel de afinidad HAPPY o superior con Natsuki, la música personalizada está disponible para desbloquearse. Una vez desbloqueada, se puede acceder a ella a través de **Música** y permite al jugador y a Natsuki escuchar música juntos en lugar de la música de fondo (BGM) normal del juego.

El proceso de desbloqueo es el siguiente: Natsuki iniciará aleatoriamente una conversación única, donde encuentra un reproductor de música en su escritorio y explica cómo funciona la música personalizada. Después de esto, el jugador puede cambiar la música en cualquier momento, asumiendo que permanezca en el nivel de afinidad HAPPY o superior. Ten en cuenta que la frecuencia de chat **no** debe estar configurada en **Nunca** para que esto ocurra.

La música personalizada debe agregarse a la carpeta \`custom_music\` en el directorio principal, y todas las pistas deben estar en uno de los siguientes formatos para ser encontradas por Natsuki:
* MP3 (\`.mp3\`, \`.MP3\`)
* OGG (\`.ogg\`, \`.OGG\`)
* WAV (\`.wav\`, \`.WAV\`)

Ten en cuenta que cualquier archivo de música debe convertirse a los formatos anteriores usando una herramienta de conversión: simplemente renombrar el archivo no funcionará.
Si la carpeta no existía, Natsuki la creará automáticamente. Si la configuración de **Música** del jugador está actualmente en cero, Natsuki le informará de esto antes de proceder.

Junto con las pistas que el jugador agregó a la carpeta \`custom_music\`, el jugador también puede elegir entre lo siguiente:
* **Predeterminado:** Reanudar la reproducción de la BGM estándar.
* **¡Tú eliges!:** Natsuki elegirá una de las pistas de música del jugador al azar.
* **Sin música:** Natsuki detendrá cualquier música que se esté reproduciendo actualmente, dejando silencio.
* **Space Classroom:** La BGM estándar del salón espacial del Acto 3 de DDLC.

**Las siguientes pistas pueden desbloquearse a través del juego (Spoilers):**
* **Vacation!:** Después de ver y completar al menos un evento o festividad.

#### Música aleatoria
Si se ha desbloqueado la música personalizada y Natsuki está en un nivel de afinidad AFFECTIONATE o superior, ¡los jugadores también pueden pedirle a Natsuki que reproduzca música aleatoriamente!
Las opciones para pedirle a Natsuki que comience/deje de reproducir música aleatoria se pueden acceder a través de **Hablar -> Hablemos de... -> Música**.
La música aleatoria solo está disponible si existen al menos dos pistas de música en la carpeta de música personalizada.
Si se ha habilitado la música aleatoria, el juego comenzará con pistas de música aleatorias al cargar en lugar del tema predeterminado.

### Minijuegos

Los minijuegos ofrecen la oportunidad para que el jugador y Natsuki se unan a través de algunas actividades simples juntos. Los minijuegos actuales son los siguientes:

#### Snap (Juego de cartas)
El jugador y Natsuki pueden jugar el simple juego de cartas Snap juntos, donde cada jugador debe intentar recolectar todas las cartas gritando pares coincidentes cuando se colocan en la mesa.
Desbloquear Snap requiere que el jugador tenga acceso a la función de **Admisiones**: Snap se desbloquea después de que el jugador le dice a Natsuki que se siente aburrido usando el menú de admisiones.
Una vez que Snap se ha desbloqueado, se puede acceder a él a través de **Hablar -> Hablemos de... -> Juegos**.
Ganar a Natsuki consecutivamente resultará en que Natsuki aumente el esfuerzo que pone en el juego en un intento de ganar al jugador; cometerá menos errores y reaccionará más rápido con cada victoria en una racha.
Intentar hacer trampa en Snap enojará a Natsuki e incurrirá en una falta por trampa. Al exceder tres faltas, Natsuki pondrá fin al juego y se negará a jugar de nuevo hasta que se haga una disculpa.

#### Blackjack
El jugador y Natsuki pueden jugar el juego de cartas más avanzado de Blackjack juntos, donde ambos jugadores deben obtener una mano con una suma total de 21 sin pasarse.
Blackjack se desbloquea después de experimentar el evento de introducción de Blackjack, que a su vez se ve aleatoriamente al cargar el juego después de alcanzar al menos AFFECTIONATE o superior y haber desbloqueado ya Snap.
Una vez que Blackjack se ha desbloqueado, se puede acceder a él a través de **Hablar -> Hablemos de... -> Juegos**.
Los juegos de Blackjack se repetirán sin fin hasta que el jugador decida detenerse: no se da penalización por detener un juego antes de tiempo a menos que el jugador ya se haya comprometido a un movimiento, lo cual se considera una pérdida (rendirse).
Blackjack no presenta apuestas — en cambio, Natsuki mantiene un registro permanente de las puntuaciones en su libreta, así como una nota mental de cualquier racha ganadora, ya sea del jugador o de ella misma.
Es posible alternar si se muestra una suma de cada mano (menos la primera carta de Natsuki) usando la opción **Total de la mano** bajo **Blackjack** en el menú de configuración.

### Poemas

En circunstancias específicas, ¡Natsuki puede considerar apropiado mostrar o regalar un poema al jugador!
Si el jugador ha visto al menos un poema, y Natsuki está al menos en afinidad NORMAL o superior, entonces el jugador puede solicitar ver la lista de poemas desbloqueados y seleccionar uno para leer de nuevo. Se puede acceder a los poemas desbloqueados a través de **Hablar -> Hablemos de... -> ¿Puedo ver un poema que escribiste para mí?**.

Ten en cuenta que actualmente no se presentan ni desbloquean poemas del DDLC original (vanilla) o DDLC+.

<details>
<summary><strong>Haz clic para ver la lista de poemas desbloqueables (Spoilers)</strong></summary>

* **Cakes and Candles (Pasteles y Velas):** Desbloqueado vía evento festivo \`holiday_player_birthday\` (requiere AFFECTIONATE+).
* **Sakura in Bloom (Sakuras en Flor):** Desbloqueado vía evento festivo \`holiday_easter\` (requiere HAPPY+).
* **Evergreen:** Desbloqueado vía evento festivo \`holiday_christmas_day\` (requiere HAPPY+).
* **Gingerbread House (Casa de Jengibre):** Desbloqueado vía evento festivo \`holiday_christmas_day\` (requiere HAPPY+).
* **Flight (Vuelo):** Desbloqueado vía evento festivo \`holiday_natsuki_birthday\` (requiere ENAMORED+, \`party_supplies.nats\` en carpeta de personajes).
* **Hallow's End:** Desbloqueado vía evento festivo \`holiday_halloween\` (requiere LOVE+).
</details>

### Clima

*Just Natsuki* presenta un sistema de clima dinámico y un ciclo día/noche: el salón de clases y el clima exterior cambiarán según las preferencias del jugador, así como la hora actual.
Si está habilitado y configurado, el clima también puede cambiar según la ubicación del jugador.

#### Configuración del clima
* **Disabled (Desactivado):** El clima exterior no cambiará, fuera de los ciclos día/noche.
* **Random (Aleatorio):** El clima exterior cambiará aleatoriamente, según cómo se sienta Natsuki con el jugador.
* **Real-time (Tiempo real):** El clima exterior cambiará según la ubicación del jugador. Esta opción solo está disponible después de que Natsuki saque el tema sobre configurar el clima.

#### Desbloqueando el clima en tiempo real
Si Natsuki está en afinidad HAPPY o superior, puede sacar aleatoriamente la posibilidad de tener el clima en su mundo coincidiendo con el mundo del jugador, a través del uso de la API OpenWeatherMap.
Una vez desbloqueado, este tema se puede acceder a través de **Hablar -> Cuéntame de nuevo sobre... -> Configuración -> Configurando el clima**.
Natsuki guiará al jugador a través de la configuración del clima, usando el sitio OpenWeatherMap, Google Maps y/o preguntas de latitud y longitud, así como la solución de problemas.
Ten en cuenta que esta característica requiere una conexión a internet para funcionar.

### Chistes diarios

Si Natsuki está en afinidad HAPPY o superior, descubrirá el viejo libro de chistes de su salón — y está más que dispuesta a compartir algo de humor de alta calidad: ¡desbloqueando la función de chistes diarios!
Una vez desbloqueada, Natsuki contará un nuevo chiste una vez cada veinticuatro horas, a menos que se le pida que no lo haga.
Además, también se le puede pedir a Natsuki que le cuente al jugador un chiste visto anteriormente. Sin embargo, no le contará al jugador chistes nuevos a pedido.
Las solicitudes para que Natsuki comience/deje de contar chistes diarios o para recordar un chiste antiguo se pueden acceder a través de **Hablemos de... -> Chistes**.

<details>
<summary><strong>Haz clic para ver la lista de chistes desbloqueables (Spoilers)</strong></summary>

* Action (Acción)
* Anime
* Atomic theory (Teoría atómica)
* Author pulled over (Autor detenido)
* Bakers (Panaderos)
* Baking and baseball (Hornear y béisbol)
* Ball sports (Deportes de pelota)
* Barista
* Basic chemistry (Química básica)
* Befriending sharks (Haciendo amigos tiburones)
* Burned tongues (Lenguas quemadas)
* Cannery (Fábrica de conservas)
* Cinderella (Cenicienta)
* Clock and the watch (El reloj de pared y el de pulsera)
* Con-crete (Concreto/Hormigón)
* Cover story (Historia de portada)
* Cows and stairs (Vacas y escaleras)
* Cults (Cultos)
* Cute chicks (Pollitos lindos)
* Developers (Desarrolladores)
* Dishwashing (Lavado de platos)
* Dog walkers (Paseadores de perros)
* Eating clocks (Comiendo relojes)
* Eight-legged cat (Gato de ocho patas)
* Entomology (Entomología)
* Escape artist (Artista del escape)
* Ex-press (Ex-preso)
* Fish eyesight (Vista de pez)
* Fishermen video calls (Videollamadas de pescadores)
* Guitarist (Guitarrista)
* Horse hairstyles (Peinados de caballo)
* Hot air (Aire caliente)
* Instant coffee (Café instantáneo)
* Keymakers (Fabricantes de llaves)
* Lighthouse keeper (Farero)
* Logging out (Cerrar sesión)
* Lumberjacks (Leñadores)
* Measuring snakes (Midiendo serpientes)
* Meeting walls (Paredes que se encuentran)
* Mountain climbers (Alpinistas)
* Movie theater (Cine)
* Multiple choice (Opción múltiple)
* Nailed it (Lo clavó)
* Neutrons (Neutrones)
* No bell (Sin campana/Nobel)
* Ocean greetings (Saludos del océano)
* Out of control (Fuera de control)
* Packaging (Embalaje)
* Pencils (Lápices)
* Pirate hygiene (Higiene pirata)
* Pizza
* Plans (Planes)
* Psychic meals (Comidas psíquicas)
* Rabbit lottery (Lotería de conejos)
* Ravioli
* Scarecrows (Espantapájaros)
* School (Escuela)
* Shark literature (Literatura de tiburones)
* Shaving as a skater (Afeitarse como patinador)
* Shoemakers (Zapateros)
* Skeletal communication (Comunicación esquelética)
* Skeletal music (Música esquelética)
* Snake mathematics (Matemáticas de serpientes)
* Sound tracks (Pistas de sonido)
* Spices (Especias)
* Tallest building (Edificio más alto)
* Tentacles (Tentáculos)
* The drill (El taladro)
* Tiger's stripes (Rayas de tigre)
* Tofu
* Tractor-trailer (Tractor-remolque)
* Tube cuisine (Cocina de tubo)
* Typists (Mecanógrafos)
* Upsetting a cat (Molestando a un gato)
* Vegetarian moods (Humor vegetariano)
</details>

### Idles (Inactividad)

Natsuki participará en una serie de actividades por sí misma si no se interactúa con ella durante un período prolongado de tiempo, si está habilitado en la Configuración.
Los Idles solo están activos en afinidad NORMAL o superior.

Los siguientes idles están desbloqueados por defecto:
* \`idle_daydreaming\` (soñar despierta)
* \`idle_whistling\` (silbar)

**Los siguientes idles son desbloqueables a través del juego (Spoilers):**

<details>
<summary><strong>Haz clic para ver la lista de Idles (Spoilers)</strong></summary>

* \`idle_twitch_playing\` (Requiere haber visto los eventos \`event_wintendo_twitch_battery_dead\` o \`event_wintendo_twitch_game_over\`)
* \`idle_reading_parfait_girls\` (Requiere haber visto el evento \`event_caught_reading_manga\`)
* \`idle_reading_renpy_for_dummies\` (Requiere haber visto el evento \`event_renpy_for_dummies\`)
* \`idle_reading_a_la_mode\` (Requiere haber visto el evento \`event_reading_a_la_mode\`)
* \`idle_reading_step_by_step\` (Requiere haber visto el evento \`event_step_by_step_manga\`)
* \`idle_poetry_attempts\` (Requiere haber visto el evento \`event_caught_writing_poetry\`)
* \`idle_naptime\` (Requiere AFFECTIONATE+)
* \`idle_vibing_headphones\` (Requiere HAPPY+ y música personalizada desbloqueada)
* \`idle_laptop\` (Requiere HAPPY+)
* \`idle_math_attempts\` (Requiere NORMAL+ y haber visto el tema \`talk_favorite_subject\` al menos una vez)
* \`idle_plantcare\` (Requiere AFFECTIONATE+ y haber visto el evento \`event_sanjo\`)
</details>

### Atuendos personalizados

Si Natsuki está en afinidad HAPPY o superior, puede sacar aleatoriamente la posibilidad de usar ropa diferente a la que ha usado anteriormente en el club (su uniforme, ropa casual y pijama): esto desbloqueará la función de Atuendos Personalizados.

Las funciones de atuendos personalizados se pueden acceder a través de **Hablar -> Sobre tu ropa...**.
Existen las siguientes opciones:
* **¿Puedes ponerte algo nuevo?:** Permite al jugador pedirle a Natsuki que use un atuendo específico, o uno aleatorio.
* **¿Puedo sugerir un nuevo atuendo?:** Permite al jugador diseñar y guardar un atuendo para que Natsuki lo use.
* **¿Puedo quitar un atuendo que sugerí?:** Permite al jugador eliminar un atuendo personalizado.
* **¿Puedes buscar de nuevo nuevos atuendos?:** Natsuki buscará nuevos atuendos e intentará cargar cualquiera nuevo/recargar antiguos que puedan haber fallado al cargar.

Para obtener información sobre cómo agregar ropa y atuendos personalizados, o cómo regalarle a Natsuki ropa y atuendos prefabricados, consulta la **Guía de ropa y conjuntos personalizados**.

Además, *Just Natsuki* presenta un sistema de atuendos dinámico: Natsuki cambiará su atuendo según la hora del día, el día de la semana y su afinidad con el jugador, siempre que la opción **Auto Change** (Cambio Automático) esté habilitada en la **Configuración**.
Si **Auto Change** está habilitado, el horario de vestimenta de Natsuki sigue el de un estudiante típico: usará su uniforme durante el horario escolar entre semana, y cambiará a ropa más casual por la tarde. Los fines de semana, usará ropa casual todo el día. En niveles de afinidad más altos, los jugadores pueden tener el placer de ver a Natsuki en su pijama durante la tarde-noche, o temprano en la mañana.

Al guardar un atuendo, ¡los jugadores también pueden optar por guardar uno como un atuendo temporal! Natsuki solo usará estos hasta que decida ponerse otra cosa (como con la función de **Auto Change**, por solicitud del jugador o a través del juego), o se reinicie el juego.

---

## Extras

### Headpats (Acariciar la cabeza)

¡Desde la afinidad LOVE, los jugadores finalmente pueden darle a Natsuki las caricias en la cabeza que se merece!
La función de headpats se puede acceder a través de **Extras -> Headpats**.

Natsuki se sentirá lentamente más cómoda con las caricias a medida que reciba más, con diálogos en hitos específicos.
Para darle headpats a Natsuki, mueve tu mouse en círculos/movimientos constantes sobre el cabello de Natsuki arriba de su frente: **no** haciendo clic. Esto debe hacerse **mientras** estás en la interacción de headpat; no se puede hacer mientras Natsuki está inactiva o en el menú **Hablar**.

Si tu mouse está en el área general correcta para las caricias, cambiará a un gráfico especial para indicarlo.
Se muestra un recuento total de headpats cuando estás en la vista de headpat.`,
  ropa: `# Guía de ropa y atuendos personalizados

Esta página detalla cómo utilizar las funciones de atuendos personalizados y prendas incluidas en *Just Natsuki*, desde la versión **1.0.0** en adelante.

> **Nota:** Esta función requiere una afinidad de **HAPPY** (Feliz) o superior, y que Natsuki haya mencionado (y por tanto desbloqueado) las funciones de atuendos personalizados.

## Creación de nueva ropa personalizada

Esta sección es para aquellos interesados en crear **nueva** ropa personalizada para JN. Si buscas instrucciones sobre cómo añadir una prenda personalizada ya hecha, consulta la sección **Añadir ropa personalizada prefabricada**.

¡Por favor, echa un vistazo al pack de ropa para creadores en la última versión [aquí]!

### Resumen

La ropa (también conocida como **wearable** o prenda) se define como cualquier artículo individual que Natsuki puede llevar en uno de sus espacios de vestuario.

Cualquier pieza de ropa personalizada tiene dos partes:
1.  **Definición de la ropa:** Un único archivo \`.json\` que describe la ropa para que pueda registrarse y cargarse en el juego.
2.  **Activos de la ropa (Assets):** Archivos \`.png\` que contienen los gráficos del atuendo. Un atuendo debe tener activos para cada pose que tenga Natsuki en la versión actual del juego.

### Archivo de definición de ropa

La definición de la ropa es un archivo \`.json\` que describe al juego una pieza de ropa existente, cómo se llama y otra información necesaria para cargarla.

La información contenida en una definición de ropa **debe** incluir lo siguiente:

* \`reference_name\`: Un nombre único para la ropa para manejar los datos de guardado, uso en atuendos, etc. Debes proporcionar un nombre de referencia que incluya tu nombre/apodo, con las palabras separadas por guiones bajos (_). Un nombre de referencia **no puede** usar el prefijo \`jn_\`, ya que está **reservado**. El nombre de referencia no debe cambiarse una vez añadido al juego.
* \`display_name\`: El nombre que Natsuki le da a la ropa, y como se refiere a ella en los menús del juego, etc.
* \`unlocked\`: Si esta ropa está bloqueada o desbloqueada por defecto. A menos que planees hacer un submod y desbloquear esta ropa como parte de tu contenido, esto **siempre** debe ser \`true\` (verdadero).
* \`category\`: Define en qué espacio usa Natsuki esta prenda, y **debe** ser uno de los siguientes:
    * \`hairstyle\`: Un peinado para Natsuki, como sus coletas.
    * \`eyewear\`: Un artículo que Natsuki usa sobre sus ojos, como gafas.
    * \`accessory\`: Un artículo que Natsuki usa sobre su cabello, como un broche o cintas.
    * \`clothes\`: Un artículo que Natsuki usa para cubrir su cuerpo, como una camiseta.
    * \`headgear\`: Un artículo que Natsuki usa encima de su cabeza, como un gorro.
    * \`necklace\`: Un artículo que Natsuki usa alrededor de su cuello, como un relicario.
    * \`facewear\`: Un artículo que Natsuki usa en su cara, como pegatinas.
    * \`back\`: Un artículo que Natsuki usa en su espalda, como una capa.

El archivo de definición debe guardarse con un nombre de archivo igual al \`reference_name\`; por ejemplo \`blizzardsev_amazing_hairpin.json\`.

Los archivos de definición son cargados por JN bajo el directorio \`custom_wearables\` en la carpeta \`DDLC\`.

#### Ejemplo de definición de ropa JSON

\`blizzardsev_amazing_hairpin.json\`:

\`\`\`json
{
    "reference_name": "blizzardsev_amazing_hairpin",
    "display_name": "Increíble horquilla de Blizzardsev",
    "unlocked": true,
    "category": "accessory"
}
\`\`\`

### Activos de la ropa (Assets)

Los activos de la ropa son lo que el jugador realmente verá a Natsuki usando, y corresponden con una definición de ropa: los activos sin una definición no son detectados por el juego.

Los activos de la ropa deben obedecer los siguientes criterios:

* El tipo de archivo de cualquier activo debe ser .png.
* Cualquier activo debe tener 1280 píxeles de ancho y 720 píxeles de alto, para estar correctamente alineado con el cuerpo de Natsuki.
* Deben existir suficientes activos para cubrir todas las poses que Natsuki tiene en la versión del juego, ya que cada pose requiere un activo coincidente para que la ropa se cargue. Por ejemplo, los activos para la v1.0.0 solo requieren un activo *sitting* (sentada), ya que esta es la única pose que existe: por favor, consulta la lista completa a continuación.
* Cada archivo de activo debe ser guardado bajo una carpeta que coincida con el nombre de referencia (reference_name) de la ropa a la que corresponde, y ser nombrado según la pose a la que corresponde; por ejemplo \`accessory/blizzardsev_amazing_hairpin/sitting.png\` para la pose sitting.
* Al crear activos de mods, deberías trabajar en ellos en una carpeta fuera de tu instalación de JN. Los activos de ropa deben guardarse bajo \`mod_assets/natsuki\` en tu carpeta de creación, para ser copiados en la carpeta \`game/mod_assets\` de JN cuando estén listos para añadirse.

### Lista actual de poses

| Pose | Descripción |
|------|-------------|
| \`sitting\` | Pose por defecto de Natsuki. |
| \`arms_crossed_body\` | Natsuki tiene los brazos cruzados sobre su cuerpo, pero detrás de su escritorio. |
| \`arms_crossed_desk\` | Natsuki tiene los brazos cruzados, y sobre el escritorio. |
| \`fingers_on_desk\` | Natsuki descansa sus dedos sobre el escritorio. |
| \`finger_touching\` | Natsuki presiona sus dedos índices juntos detrás de su escritorio. |
| \`pointy_finger\` | Natsuki descansa un brazo sobre la mesa, señalando con confianza al aire con su mano libre. |
| \`hand_on_chin\` | Natsuki descansa un brazo sobre la mesa, apoyando su barbilla con su mano libre. |

### ¿Qué sprites necesito para una prenda específica?

| Categoría | Sprites requeridos |
|-----------|-------------------|
| **Accessory** | Se requiere un solo sprite. |
| **Back** | Se requiere un solo sprite. |
| **Clothes** | La ropa ahora se divide en dos conjuntos: ropa (clothes) y mangas (sleeves). Ambos conjuntos deben tener un sprite para cada pose. |
| **Eyewear** | Se requiere un solo sprite. |
| **Facewear** | Se requiere un solo sprite. |
| **Hair** | Se requieren dos sprites, parte delantera y trasera del cabello. |
| **Headgear** | Se requiere un solo sprite. |
| **Necklace** | Se requiere un solo sprite. |

### ¿Cómo organizo los sprites en la carpeta mod_assets?

Como antes, todos los sprites se mantienen bajo la carpeta \`game/mod_assets/natsuki\`, pero diferentes prendas deben colocarse basándose en su tipo (*category*) dado en su archivo de definición (json).

**Accessory:**
\`\`\`
mod_assets/natsuki/accessory/nombre_de_tu_prenda/sitting.png
\`\`\`

**Back:**
\`\`\`
mod_assets/natsuki/back/nombre_de_tu_prenda/sitting.png
\`\`\`

**Clothes:**
\`\`\`
mod_assets/natsuki/clothes/nombre_de_tu_prenda/sitting.png
mod_assets/natsuki/clothes/nombre_de_tu_prenda/arms_crossed_body.png
mod_assets/natsuki/clothes/nombre_de_tu_prenda/arms_crossed_desk.png
mod_assets/natsuki/clothes/nombre_de_tu_prenda/fingers_on_desk.png
mod_assets/natsuki/clothes/nombre_de_tu_prenda/finger_touching.png
mod_assets/natsuki/clothes/nombre_de_tu_prenda/pointy_finger.png
mod_assets/natsuki/clothes/nombre_de_tu_prenda/hand_on_chin.png

mod_assets/natsuki/sleeves/nombre_de_tu_prenda/sitting.png
mod_assets/natsuki/sleeves/nombre_de_tu_prenda/arms_crossed_body.png
mod_assets/natsuki/sleeves/nombre_de_tu_prenda/arms_crossed_desk.png
mod_assets/natsuki/sleeves/nombre_de_tu_prenda/fingers_on_desk.png
mod_assets/natsuki/sleeves/nombre_de_tu_prenda/finger_touching.png
mod_assets/natsuki/sleeves/nombre_de_tu_prenda/pointy_finger.png
mod_assets/natsuki/sleeves/nombre_de_tu_prenda/hand_on_chin.png
\`\`\`

**Eyewear:**
\`\`\`
mod_assets/natsuki/eyewear/nombre_de_tu_prenda/sitting.png
\`\`\`

**Facewear:**
\`\`\`
mod_assets/natsuki/facewear/nombre_de_tu_prenda/sitting.png
\`\`\`

**Hair:**
\`\`\`
mod_assets/natsuki/hair/nombre_de_tu_prenda/sitting/bangs.png
mod_assets/natsuki/hair/nombre_de_tu_prenda/sitting/back.png
\`\`\`

**Headgear:**
\`\`\`
mod_assets/natsuki/headgear/nombre_de_tu_prenda/sitting.png
\`\`\`

**Necklace:**
\`\`\`
mod_assets/natsuki/necklace/nombre_de_tu_prenda/sitting.png
\`\`\`

### Ejemplo de estructura/lista de activos

Donde \`/\` indica una carpeta:

\`\`\`
mod_assets/
    natsuki/
        accessory/
            blizzardsev_amazing_hairpin/
                sitting.png
\`\`\`

### Paso a paso

1. **Configura tu carpeta de creación de atuendos:** Crea una nueva carpeta fuera de tu instalación de JN, y nómbrala como la ropa que estás creando.
2. **Crea tu definición de ropa:** Crea un archivo .json, cuidando de seguir el formato bajo la sección *Definición de ropa*.
3. **Crea tus activos de ropa:** Crea una imagen .png de 1280x720 para cada pose que exista en la versión actual de JN, cuidando de guardarla siguiendo la estructura bajo la sección *Ejemplo de estructura/lista de activos*.
4. **Verifica tu definición y activos:** Asegúrate de que coincidan con los requisitos listados en todas las secciones anteriores.

### Ejemplo de resultado de pack de ropa

Deberías tener una carpeta que se parezca a la siguiente estructura (donde \`/\` indica una carpeta):

\`\`\`
Blizzardsev's amazing hairpin/
    blizzardsev_amazing_hairpin.json
    mod_assets/
        natsuki/
            accessory/
                blizzardsev_amazing_hairpin/
                    sitting.png
\`\`\`

¡Ahora estás listo para añadir el atuendo personalizado a JN!

---

## Creación de nuevos atuendos personalizados (Outfits)

Esta sección es para aquellos interesados en crear nuevos atuendos personalizados para JN: si buscas instrucciones sobre cómo añadir un atuendo prefabricado, consulta la sección **Añadir atuendos personalizados prefabricados**.

### Resumen

Un atuendo se define como una combinación de ropa/prendas que constituyen un vestuario completo que se le puede pedir a Natsuki que use. Los atuendos creados por los jugadores en el juego hablando con Natsuki pueden compartirse entre jugadores, aunque esto requiere que cualquier jugador que añada el atuendo tenga desbloqueada toda la ropa incluida en el mismo. Los atuendos pueden consistir en ropa vanilla (del juego base) de JN, ropa personalizada, o una combinación de ambas.

### Archivo de definición de atuendo

El archivo de definición de atuendo es un único archivo \`.json\` que describe al juego un atuendo que existe, cómo se llama, la ropa que involucra y otra información requerida para que el juego lo cargue.

La información contenida en una definición de atuendo **debe** incluir lo siguiente:

* \`reference_name\`: Un nombre único para el atuendo para manejar los datos de guardado. Debes proporcionar un nombre de referencia que incluya tu nombre/apodo, con las palabras separados por guiones bajos (_). Un nombre de referencia **no puede** usar el prefijo \`jn_\`, ya que está **reservado**. El nombre de referencia no debe cambiarse una vez añadido al juego.
* \`display_name\`: El nombre dado al atuendo por Natsuki, y referido en el juego por menús, etc.
* \`unlocked\`: Si este atuendo está bloqueado o desbloqueado por defecto. A menos que planees hacer un submod y desbloquear esta ropa como parte de tu contenido, esto **siempre** debe ser \`true\`.
* \`hairstyle\`: El reference_name de un peinado para Natsuki.
* \`clothes\`: El reference_name de un artículo que Natsuki usa para cubrir su cuerpo.

Los siguientes son opcionales:

* \`eyewear\`: El reference_name de un artículo para los ojos (gafas).
* \`accessory\`: El reference_name de un accesorio para el cabello.
* \`headgear\`: El reference_name de un artículo para la cabeza (sombrero).
* \`necklace\`: El reference_name de un artículo para el cuello.
* \`facewear\`: El reference_name de un artículo para la cara.
* \`back\`: El reference_name de un artículo para la espalda.

> Ten en cuenta que las prendas vanilla de JN no pueden ser desbloqueadas a través de atuendos personalizados.

### Ejemplo de definición de atuendo JSON

\`blizzardsev_devilish_outfit.json\`:

\`\`\`json
{
    "reference_name": "blizzardsev_devilish_outfit",
    "display_name": "Atuendo diabólico de Blizzardsev",
    "unlocked": true,
    "clothes": "blizzardsev_awesome_tshirt",
    "hairstyle": "jn_hair_ponytail",
    "accessory": "blizzardsev_amazing_hairpin",
    "eyewear": "blizzardsev_fantastic_glasses",
    "headgear": "blizzardsev_stylish_beanie_hat",
    "necklace": "blizzardsev_stunning_necklace"
}
\`\`\`

### Ítems Vanilla desbloqueados

Los siguientes son los nombres de referencia de las prendas vanilla desbloqueadas por defecto: puedes desear usarlos al diseñar tus propios atuendos personalizados.

**Clothing (Ropa)**

* \`jn_clothes_bunny_pajamas\`
* \`jn_clothes_casual\`
* \`jn_clothes_hoodie_not_cute\`
* \`jn_clothes_hoodie_turtleneck\`
* \`jn_clothes_nya_sweater\`
* \`jn_clothes_qeeb_sweater\`
* \`jn_clothes_qt_sweater\`
* \`jn_clothes_school_uniform\`
* \`jn_clothes_star_pajamas\`

**Hairstyles (Peinados)**

* \`jn_hair_bedhead\`
* \`jn_hair_bun\`
* \`jn_hair_down_long\`
* \`jn_hair_down\`
* \`jn_hair_low_bun\`
* \`jn_hair_messy_bun\`
* \`jn_hair_pigtails\`
* \`jn_hair_pixie_cut\`
* \`jn_hair_ponytail\`
* \`jn_hair_princess_braids\`
* \`jn_hair_twin_buns\`
* \`jn_hair_twintails_braided\`
* \`jn_hair_twintails_down\`
* \`jn_hair_twintails_long\`
* \`jn_hair_twintails\`

**Accessories (Accesorios)**

* \`jn_accessory_hairband_cat\`
* \`jn_accessory_hairband_gray\`
* \`jn_accessory_hairband_green\`
* \`jn_accessory_hairband_hot_pink\`
* \`jn_accessory_hairband_purple\`
* \`jn_accessory_hairband_red\`
* \`jn_accessory_hairband_white\`

**Headgear (Sombreros/Cabeza)**

* \`jn_headgear_basic_white_headband\`
* \`jn_headgear_black_beanie\`
* \`jn_headgear_cat_headband\`
* \`jn_headgear_sleep_mask\`

**Necklaces (Collares)**

* \`jn_necklace_bell_collar\`
* \`jn_necklace_black_choker\`
* \`jn_necklace_plain_choker\`

**Eyewear / Facewear / Back:** No hay ítems desbloqueados por defecto actualmente.

### Ítems Vanilla desbloqueables (Spoilers)

Los siguientes son los nombres de referencia de prendas vanilla desbloqueadas al experimentar ciertos eventos en el juego, realizar ciertas acciones, u otros criterios.

**Clothing**

* \`jn_clothes_autumn_off_shoulder_sweater\`: Desbloqueado vía tema talk_favourite_season (Happy+ requerido)
* \`jn_clothes_bee_off_shoulder_sweater\`: Desbloqueado vía tema talk_favourite_season (Happy+ requerido)
* \`jn_clothes_chocolate_plaid_dress\`: Desbloqueado vía tema talk_chocolate_preference (Affectionate+ requerido)
* \`jn_clothes_cosy_cardigan\`: Desbloqueado vía evento de introducción event_warm_package
* \`jn_clothes_creamsicle_off_shoulder_sweater\`: Desbloqueado vía tema talk_favourite_season (Happy+ requerido)
* \`jn_clothes_nightbloom_off_shoulder_sweater\`: Desbloqueado vía tema talk_favourite_season (Happy+ requerido)
* \`jn_clothes_sango_cosplay\`: Desbloqueado vía tema talk_are_you_into_cosplay (Affectionate+ requerido)
* \`jn_clothes_skater_shirt\`: Desbloqueado vía tema talk_skateboarding (Affectionate+ requerido)
* \`jn_clothes_trainer_cosplay\`: Desbloqueado vía tema talk_are_you_into_cosplay (Affectionate+ requerido)
* \`jn_clothes_lolita_christmas_dress\`: Desbloqueado vía evento festivo holiday_christmas_day (Happy+ requerido)
* \`jn_clothes_ruffle_neck_sweater\`: Desbloqueado vía evento festivo holiday_valentines_day (Affectionate+ requerido)
* \`jn_clothes_heart_sweater\`: Desbloqueado vía evento festivo holiday_valentines_day (Love requerido)
* \`jn_clothes_chick_dress\`: Desbloqueado vía evento festivo holiday_easter (Happy+ requerido)
* \`jn_clothes_cherry_blossom_dress\`: Desbloqueado vía evento festivo holiday_easter (Happy+ requerido)
* \`jn_clothes_pastel_goth_overalls\`: Desbloqueado vía tema talk_fitting_clothing (Affectionate+ requerido)
* \`jn_clothes_office_blazer\`: Desbloqueado vía tema talk_work_experience (Enamored+)
* \`jn_clothes_magical_girl\`: Desbloqueado vía evento festivo holiday_halloween (Happy+)

**Hairstyles**

* \`jn_hair_super_messy\`: Desbloqueado vía evento de introducción event_not_ready_yet
* \`jn_hair_twintails_white_ribbons\`: Desbloqueado vía tema talk_skateboarding (Affectionate+ requerido)
* \`jn_hair_wavy\`: Desbloqueado vía tema talk_work_experience (Enamored+)

**Accessories**

* \`jn_accessory_double_white_hairbands\`: Desbloqueado vía tema talk_skateboarding (Affectionate+ requerido)
* \`jn_accessory_fried_egg_hairpin\`: Desbloqueado vía evento festivo holiday_easter (Happy requerido)
* \`jn_accessory_cherry_blossom_hairpin\`: Desbloqueado vía evento festivo holiday_easter (Happy requerido)
* \`jn_accessory_gold_star_hairpin\`: Desbloqueado vía evento festivo holiday_natsuki_birthday (HAPPY+ requerido, party_supplies.nats en carpeta characters - 50/50 probabilidad entre rosa/oro)
* \`jn_accessory_pink_star_hairpin\`: Desbloqueado vía evento festivo holiday_natsuki_birthday (HAPPY+ requerido, party_supplies.nats en carpeta characters - 50/50 probabilidad entre rosa/oro)
* \`jn_accessory_hairband_stars\`: Desbloqueado vía evento festivo holiday_halloween (Happy+)

**Eyewear**

Varios tipos de gafas (rectangular, round, sunglasses): Desbloqueados vía evento de introducción event_eyewear_problems.

**Headgear**

Varios ahoge: Desbloqueados vía evento de introducción event_not_ready_yet.
* \`jn_headgear_chocolate_plaid_bow\`: Desbloqueado vía tema talk_chocolate_preference (Affectionate+ requerido).
* \`jn_headgear_teddy_hairpins\`: Desbloqueado vía evento de introducción event_warm_package.
* \`jn_headgear_trainer_hat\`: Desbloqueado vía tema talk_are_you_into_cosplay (Affectionate+ requerido).
* \`jn_headgear_santa_hat\`: Desbloqueado vía evento festivo holiday_christmas_eve (Happy+ requerido).
* \`jn_headgear_pompoms\`: Desbloqueado vía evento festivo holiday_christmas_day (Happy+ requerido).
* \`jn_headgear_new_year_headband\`: Desbloqueado vía evento festivo holiday_new_years_day (Happy+ requerido).
* \`jn_headgear_classic_party_hat\`: Desbloqueado vía evento festivo holiday_player_birthday (Affectionate+ requerido).
* \`jn_headgear_spiked_headband\`: Desbloqueado vía tema talk_fitting_clothing (Affectionate+ requerido).
* \`jn_headgear_hairtie\`: Desbloqueado vía evento festivo holiday_halloween (Happy+).

**Necklaces**

* \`jn_necklace_golden_necklace\`: Desbloqueado vía tema talk_chocolate_preference (Affectionate+ requerido).
* \`jn_necklace_pink_scarf\`: Desbloqueado vía tema talk_are_you_into_cosplay (Affectionate+ requerido).
* \`jn_necklace_sango_choker\`: Desbloqueado vía tema talk_are_you_into_cosplay (Affectionate+ requerido).
* \`jn_necklace_twirled_choker\`: Desbloqueado vía tema talk_are_you_into_cosplay (Affectionate+ requerido).
* \`jn_necklace_bunny_necklace\`: Desbloqueado vía evento festivo holiday_easter (Happy requerido).
* \`jn_necklace_spiked_choker\`: Desbloqueado vía tema talk_fitting_clothing (Affectionate+ requerido).
* \`jn_necklace_formal_necktie\`: Desbloqueado vía tema talk_work_experience (Enamored+).

**Facewear**

* \`jn_facewear_plasters\`: Desbloqueado vía tema talk_skateboarding (Affectionate+ requerido).
* \`jn_facewear_sprinkles\`: Desbloqueado vía tema talk_fitting_clothing (Affectionate+ requerido).

---

## Añadir ropa personalizada prefabricada

Para añadir un pack de ropa prefabricada:

1. Copia el archivo \`.json\` de definición de ropa del pack de ropa en la carpeta \`custom_wearables\` de tu instalación de JN.
2. Copia la carpeta \`mod_assets\` del pack de ropa en la carpeta \`game\` de tu instalación de JN.
3. Inicia JN, o pide a Natsuki que busque nueva ropa/atuendos vía Talk -> About your outfit... -> Can you search again for new outfits? (Hablar -> Sobre tu atuendo... -> ¿Puedes buscar de nuevo nuevos atuendos?).

## Añadir atuendos personalizados prefabricados

Para añadir un atuendo prefabricado:

1. Añade cualquier ropa prerrequisito que el atuendo requiera si se especifica: ver la sección **Añadir ropa personalizada prefabricada** para detalles.
2. Copia el archivo \`.json\` de definición del atuendo del pack de atuendo en la carpeta \`custom_outfits\` de tu instalación de JN.
3. Inicia JN, o pide a Natsuki que busque nueva ropa/atuendos.

---

## Solución de problemas (Troubleshooting)

JN intentará manejar los errores con ropa y atuendos personalizados lo mejor que pueda, e informará al usuario con una notificación emergente al iniciar el juego si un ítem falla al cargar. En este caso, por favor revisa el registro (log) para más información y sigue la guía a continuación.

### Errores de Ropa/Prendas

**Cannot load wearable as one or more key attributes do not exist.**

Falta uno de los siguientes en el archivo: \`reference_name\`, \`display_name\`, \`unlocked\` o \`category\`, o \`category\` tiene un valor inválido. Asegúrate de que estén definidos correctamente.

**Cannot load wearable as one or more attributes are the wrong data type.**

Uno o más atributos no tienen el formato correcto. Asegúrate de que \`reference_name\`, \`display_name\`, \`category\` y sus valores estén entre comillas ("), y que \`unlocked\` sea \`true\` o \`false\` (sin comillas si es booleano, o revisa la sintaxis JSON).

**Cannot load wearable as the reference name contains a reserved namespace.**

El valor para \`reference_name\` comienza con \`jn_\`, lo cual está prohibido.

**Cannot load wearable as the reference name contains one or more restricted characters.**

El \`reference_name\` contiene espacios o caracteres especiales. Solo debe contener letras y guiones bajos (_).

**Cannot load wearable as one or more sprites are missing.**

Faltan archivos de imagen .png. Asegúrate de que el pack esté actualizado, soporte la versión actual de JN y que los activos estén en las carpetas correctas.

**The outfit loaded, but isn't appearing in the game.**

La definición puede especificar que no está desbloqueada por defecto (\`unlocked: false\`). Contacta al autor para verificar si es intencional.

### Errores de Atuendos

**Cannot load outfit as one or more attributes are the wrong data type.**

Formato incorrecto en el JSON. Verifica las comillas en claves y valores.

**Cannot load outfit as specified clothes/... does not exist.**

Una o más prendas especificadas en el atuendo no existen. Asegúrate de haber añadido primero la ropa de la que depende el atuendo y que los \`reference_name\` sean correctos.

**Cannot load outfit as specified clothes/... are not valid clothing/...**

Una prenda no coincide con el espacio asignado (ej. asignar un peinado al espacio de clothes). Asegúrate de que la \`category\` de la prenda coincida con el espacio en el atuendo.

**The outfit loaded, but the log says it was locked.**

El atuendo contiene ropa que aún no ha sido desbloqueada. Esto es intencional para evitar trampas.

**Natsuki says she can't delete an outfit after I ask her to remove one.**

Asegúrate de que el nombre del archivo del atuendo coincida con el \`reference_name\` dentro del archivo. Como último recurso, borra el archivo de \`custom_outfits\` con el juego cerrado.

**An outfit I want to delete does not appear in the list of outfits to remove.**

El atuendo puede haber fallado al cargar o ya haber sido borrado. Nota: Los atuendos vanilla no se pueden eliminar.`
};

/* ─── Natsuki Menu Sections ─── */
export const natsukiMenuSections = [
  {
    title: 'Información general',
    items: [
      { key: 'home', label: 'Inicio', Icon: Home },
      { key: 'instalacion', label: 'Instalación', Icon: Download },
      { key: 'actualizaciones', label: 'Actualizaciones', Icon: RefreshCw },
      { key: 'faq', label: 'Preguntas frecuentes', Icon: CircleHelp },
    ],
  },
  {
    title: 'Contenido',
    items: [
      { key: 'caracteristicas', label: 'Características (spoiler)', Icon: Star },
      { key: 'ropa', label: 'Guía de ropa y atuendos', Icon: User },
    ],
  },
];

/* ─── Natsuki Theme ─── */
export const natsukiTheme = { accent: '#f472b6', accentHover: '#fce7f3', accentGradient: 'linear-gradient(135deg, #e4e4e7 0%, #f472b6 100%)', lightboxGlow: 'rgba(244, 114, 182, 0.15)', title: 'Just Natsuki', subtitle: 'Wiki oficial · The Encoders Club', defaultSection: 'home' };
