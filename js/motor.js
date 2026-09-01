var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/datos/aditivos-ampliacion.ts
var FILAS_AMPLIACION = [
  // --- Colorantes ----------------------------------------------------------
  ["E121", "Naranja GGN", "colorante", 3, true, "Retirado de la lista de aditivos autorizados en la UE.", "media"],
  ["E140", "Clorofilas", "colorante", 0, true, "Pigmento verde de las plantas.", "alta"],
  ["E141", "Complejos cúpricos de clorofilas", "colorante", 1, true, "Clorofila estabilizada con cobre. Aporta cobre en cantidades muy pequeñas.", "media"],
  ["E150", "Caramelo", "colorante", 1, true, "Sin especificar la clase. Las clases III y IV pueden contener 4-metilimidazol.", "media"],
  ["E153", "Carbón vegetal", "colorante", 1, true, "Puede adsorber medicamentos y nutrientes si se consume en cantidad.", "media"],
  ["E160b", "Annato / Bixina", "colorante", 1, true, "Colorante natural del achiote. Reacciones alérgicas descritas, poco frecuentes.", "media"],
  ["E160d", "Licopeno", "colorante", 0, true, "Pigmento del tomate con actividad antioxidante.", "alta"],
  ["E160e", "Beta-apo-8-carotenal", "colorante", 1, true, "Carotenoide de síntesis, precursor de vitamina A.", "media"],
  ["E161b", "Luteína", "colorante", 0, true, "Carotenoide presente de forma natural en verduras de hoja.", "alta"],
  ["E161g", "Cantaxantina", "colorante", 2, true, "Se acumula en la retina a dosis altas. Uso muy restringido en la UE.", "media"],
  ["E172", "Óxidos e hidróxidos de hierro", "colorante", 1, true, "Pigmento mineral, uso casi exclusivo en recubrimientos.", "media"],
  ["E173", "Aluminio", "colorante", 2, true, "Metal sin función nutricional. Uso limitado a decoración de repostería.", "media"],
  ["E174", "Plata", "colorante", 1, true, "Decoración de repostería, sin función nutricional.", "baja"],
  ["E175", "Oro", "colorante", 1, true, "Decoración de repostería, sin función nutricional.", "baja"],
  ["E180", "Litolrubina BK", "colorante", 2, true, "Colorante sintético limitado a cortezas de queso.", "baja"],
  // --- Conservantes --------------------------------------------------------
  ["E201", "Sorbato sódico", "conservante", 1, false, "De los conservantes mejor tolerados.", "alta"],
  ["E203", "Sorbato cálcico", "conservante", 1, false, "Mismo perfil que el sorbato potásico.", "alta"],
  ["E213", "Benzoato cálcico", "conservante", 2, false, "Con vitamina C puede formar benceno. Pseudoalergias descritas.", "media"],
  ["E215", "p-hidroxibenzoato de etilo sódico", "conservante", 2, false, "Parabeno. Sospecha de actividad endocrina.", "media"],
  ["E219", "p-hidroxibenzoato de metilo sódico", "conservante", 2, false, "Parabeno. Sospecha de actividad endocrina.", "media"],
  ["E222", "Bisulfito sódico", "conservante", 2, false, "Alérgeno de declaración obligatoria. Broncoconstricción en asmáticos.", "alta"],
  ["E225", "Sulfito potásico", "conservante", 2, false, "Alérgeno de declaración obligatoria.", "alta"],
  ["E226", "Sulfito cálcico", "conservante", 2, false, "Alérgeno de declaración obligatoria.", "alta"],
  ["E227", "Bisulfito cálcico", "conservante", 2, false, "Alérgeno de declaración obligatoria.", "alta"],
  ["E228", "Bisulfito potásico", "conservante", 2, false, "Alérgeno de declaración obligatoria.", "alta"],
  ["E230", "Bifenilo", "conservante", 3, false, "Fungicida de superficie en cítricos. Retirado como aditivo alimentario en la UE.", "media"],
  ["E231", "Ortofenilfenol", "conservante", 2, false, "Tratamiento de superficie de cítricos. No comer la piel.", "media"],
  ["E232", "Ortofenilfenato sódico", "conservante", 2, false, "Tratamiento de superficie de cítricos. No comer la piel.", "media"],
  ["E234", "Nisina", "conservante", 0, false, "Péptido producido por bacterias lácticas. Muy bien tolerado.", "alta"],
  ["E242", "Dimetildicarbonato", "conservante", 1, false, "Se descompone en metanol y CO2 en cantidades ínfimas.", "media"],
  ["E261", "Acetatos de potasio", "conservante", 0, false, "Sal del vinagre. Sin riesgo conocido.", "alta"],
  ["E262", "Acetatos de sodio", "conservante", 0, false, "Sal del vinagre. Aporta algo de sodio.", "alta"],
  ["E263", "Acetato de calcio", "conservante", 0, false, "Sal del vinagre. Aporta calcio.", "alta"],
  ["E281", "Propionato sódico", "conservante", 1, false, "Antifúngico de panadería industrial.", "media"],
  ["E283", "Propionato potásico", "conservante", 1, false, "Antifúngico de panadería industrial.", "media"],
  ["E297", "Ácido fumárico", "acidulante", 0, false, "Ácido presente de forma natural en frutas y setas.", "alta"],
  // --- Antioxidantes y reguladores -----------------------------------------
  ["E302", "Ascorbato de calcio", "antioxidante", 0, false, "Vitamina C en forma de sal cálcica. Antioxidante que además aporta algo de calcio.", "alta"],
  ["E304", "Palmitato de ascorbilo", "antioxidante", 0, false, "Vitamina C unida a un ácido graso para que sea soluble en grasa. Así puede proteger de la oxidación a los aceites del producto.", "alta"],
  ["E308", "Gamma-tocoferol", "antioxidante", 0, false, "Una de las cuatro formas naturales de la vitamina E. Protege las grasas del enranciamiento.", "alta"],
  ["E309", "Delta-tocoferol", "antioxidante", 0, false, "Otra forma natural de la vitamina E, la de mayor poder antioxidante de las cuatro.", "alta"],
  ["E315", "Ácido eritórbico", "antioxidante", 1, false, "Isómero de la vitamina C sin actividad vitamínica.", "media"],
  ["E316", "Eritorbato sódico", "antioxidante", 1, false, "Muy usado en embutidos junto a los nitritos.", "media"],
  ["E325", "Lactato sódico", "regulador", 0, false, "Sal del ácido láctico. Aporta sodio.", "alta"],
  ["E326", "Lactato potásico", "regulador", 0, false, "Sal potásica del ácido láctico, el mismo que produce la fermentación del yogur. Regula la acidez y aporta potasio en vez de sodio.", "alta"],
  ["E327", "Lactato cálcico", "regulador", 0, false, "Sal del ácido láctico. Aporta calcio.", "alta"],
  ["E334", "Ácido tartárico", "acidulante", 0, false, "Es el ácido natural de la uva, y el responsable de los cristales que aparecen en el fondo de algunas botellas de vino.", "alta"],
  ["E335", "Tartratos de sodio", "regulador", 0, false, "Sal sódica del ácido tartárico de la uva. Regula la acidez y estabiliza el color.", "alta"],
  ["E336", "Tartratos de potasio", "regulador", 0, false, "Es el cremor tártaro de la repostería.", "alta"],
  ["E337", "Tartrato doble de sodio y potasio", "regulador", 0, false, "Sal doble de sodio y potasio del ácido tartárico. Regula la acidez y secuestra metales que acelerarían el enranciamiento.", "alta"],
  ["E350", "Malatos de sodio", "regulador", 0, false, "Sal sódica del ácido málico, el ácido natural de la manzana verde. Regula la acidez.", "alta"],
  ["E351", "Malato potásico", "regulador", 0, false, "Sal potásica del ácido málico de la manzana. Regula la acidez aportando potasio en lugar de sodio.", "alta"],
  ["E352", "Malatos de calcio", "regulador", 0, false, "Sal cálcica del ácido málico de la manzana. Regula la acidez y firma la textura de la fruta en conserva.", "alta"],
  ["E353", "Ácido metatartárico", "estabilizante", 1, false, "Ácido tartárico modificado que impide la precipitación de cristales en el vino. Su uso está limitado a bebidas.", "baja"],
  ["E355", "Ácido adípico", "acidulante", 1, false, "Acidulante de síntesis, bien tolerado.", "media"],
  ["E363", "Ácido succínico", "acidulante", 0, false, "Ácido del metabolismo celular.", "media"],
  ["E380", "Citrato triamónico", "regulador", 1, false, "Regulador de acidez de uso industrial.", "baja"],
  ["E392", "Extracto de romero", "antioxidante", 0, false, "Antioxidante natural que sustituye a BHA y BHT.", "alta"],
  // --- Espesantes, gelificantes y emulgentes -------------------------------
  ["E400", "Ácido algínico", "espesante", 0, true, "Fibra soluble extraída de algas pardas. Espesa y gelifica sin digerirse, así que apenas aporta energía.", "alta"],
  ["E402", "Alginato potásico", "espesante", 0, true, "Sal potásica del ácido algínico de las algas. Fibra soluble que espesa y aporta potasio.", "alta"],
  ["E403", "Alginato amónico", "espesante", 0, true, "Sal amónica del ácido algínico de las algas. Fibra soluble espesante, de uso menos frecuente que las otras.", "media"],
  ["E404", "Alginato cálcico", "espesante", 0, true, "Sal cálcica del ácido algínico. Es lo que gelifica las esferificaciones de la cocina moderna.", "alta"],
  ["E405", "Alginato de propilenglicol", "espesante", 1, true, "Alginato modificado químicamente.", "media"],
  ["E413", "Goma tragacanto", "espesante", 0, true, "Exudado vegetal, fibra soluble.", "media"],
  ["E416", "Goma karaya", "espesante", 0, true, "Exudado vegetal, fibra soluble.", "media"],
  ["E425", "Konjac", "espesante", 1, true, "Fibra muy viscosa. Riesgo de atragantamiento en gelatinas; prohibido en golosinas.", "alta"],
  ["E426", "Hemicelulosa de soja", "espesante", 0, true, "Fibra soluble obtenida de la soja. Estabiliza bebidas y evita que los ingredientes se separen.", "media"],
  ["E427", "Goma casia", "espesante", 0, true, "Fibra soluble del árbol de la casia, emparentada con la goma garrofín. Espesa y retiene agua.", "baja"],
  ["E428", "Gelatina", "gelificante", 0, true, "Proteína de origen animal.", "alta"],
  ["E431", "Estearato de polioxietileno", "emulgente", 1, true, "Emulgente sintético que mezcla agua y grasa. Sin toxicidad conocida a las dosis autorizadas, pero es un marcador claro de formulación industrial.", "baja"],
  ["E434", "Polisorbato 40", "emulgente", 2, true, "Mismo perfil que el resto de polisorbatos: sospecha sobre la barrera intestinal.", "media"],
  ["E436", "Polisorbato 65", "emulgente", 2, true, "Mismo perfil que el resto de polisorbatos.", "media"],
  ["E442", "Fosfátidos de amonio", "emulgente", 1, true, "Emulgente del chocolate industrial.", "media"],
  ["E444", "Acetato isobutirato de sacarosa", "estabilizante", 1, true, "Estabilizante que impide que los aceites esenciales de las bebidas cítricas suban a la superficie. Uso limitado a bebidas.", "baja"],
  ["E445", "Ésteres glicéricos de colofonia", "estabilizante", 1, true, "Estabilizante de bebidas cítricas.", "baja"],
  ["E459", "Beta-ciclodextrina", "estabilizante", 1, true, "Encapsula aromas. Puede arrastrar colesterol y algunos fármacos.", "media"],
  ["E460", "Celulosa", "espesante", 0, true, "Celulosa, la fibra que forma la pared de las células vegetales. No se digiere y aporta volumen sin calorías.", "alta"],
  ["E461", "Metilcelulosa", "espesante", 1, true, "Celulosa modificada químicamente.", "media"],
  ["E463", "Hidroxipropilcelulosa", "espesante", 1, true, "Celulosa modificada químicamente.", "media"],
  ["E464", "Hidroxipropilmetilcelulosa", "espesante", 1, true, "Celulosa modificada. Es lo que forma las cápsulas vegetales.", "media"],
  ["E465", "Etilmetilcelulosa", "espesante", 1, true, "Celulosa modificada químicamente.", "baja"],
  ["E468", "Carboximetilcelulosa reticulada", "espesante", 1, true, "Celulosa modificada químicamente para hincharse con agua. Aporta textura, pero su presencia indica un producto formulado.", "baja"],
  ["E469", "Carboximetilcelulosa hidrolizada", "espesante", 1, true, "Celulosa parcialmente descompuesta por enzimas para que espese mejor. Marcador de producto industrial.", "baja"],
  ["E470a", "Sales de sodio, potasio y calcio de ácidos grasos", "emulgente", 1, true, "Emulgente y antiaglomerante.", "media"],
  ["E470b", "Sales de magnesio de ácidos grasos", "emulgente", 1, true, "Emulgente y antiaglomerante.", "media"],
  ["E472a", "Ésteres acéticos de mono y diglicéridos", "emulgente", 1, true, "Marcador claro de ultraprocesado.", "media"],
  ["E472b", "Ésteres lácticos de mono y diglicéridos", "emulgente", 1, true, "Marcador claro de ultraprocesado.", "media"],
  ["E472c", "Ésteres cítricos de mono y diglicéridos", "emulgente", 1, true, "Marcador claro de ultraprocesado.", "media"],
  ["E472d", "Ésteres tartáricos de mono y diglicéridos", "emulgente", 1, true, "Marcador claro de ultraprocesado.", "media"],
  ["E472f", "Ésteres mixtos de mono y diglicéridos", "emulgente", 1, true, "Marcador claro de ultraprocesado.", "media"],
  ["E473", "Sacaroésteres de ácidos grasos", "emulgente", 1, true, "Emulgente hecho a partir de azúcar y ácidos grasos. Mezcla agua y grasa en bollería y bebidas industriales.", "media"],
  ["E474", "Sacaroglicéridos", "emulgente", 1, true, "Mezcla de emulgentes derivados del azúcar y las grasas. Bien tolerado, pero propio de productos muy formulados.", "baja"],
  ["E477", "Ésteres de propilenglicol de ácidos grasos", "emulgente", 1, true, "Emulgente de bollería industrial.", "baja"],
  ["E481b", "Estearoil lactilato", "emulgente", 1, true, "Mejorante de panificación industrial.", "baja"],
  ["E483", "Tartrato de estearilo", "emulgente", 1, true, "Mejorante de panificación industrial.", "baja"],
  ["E492", "Triestearato de sorbitano", "emulgente", 1, true, "Emulgente sintético derivado del sorbitol, usado sobre todo en chocolates y coberturas para evitar que se vuelvan blancuzcos.", "baja"],
  ["E493", "Monolaurato de sorbitano", "emulgente", 1, true, "Emulgente sintético derivado del sorbitol. Estabiliza emulsiones en productos de repostería industrial.", "baja"],
  ["E494", "Monooleato de sorbitano", "emulgente", 1, true, "Emulgente sintético derivado del sorbitol y el ácido oleico. Estabiliza salsas y coberturas.", "baja"],
  ["E495", "Monopalmitato de sorbitano", "emulgente", 1, true, "Emulgente sintético derivado del sorbitol y el ácido palmítico. Se usa en levaduras y coberturas.", "baja"],
  // --- Sales minerales y antiaglomerantes ----------------------------------
  ["E501", "Carbonatos de potasio", "regulador", 0, false, "Sal potásica que regula la acidez y actúa como gasificante. Es lo que hace subir algunos bizcochos tradicionales.", "alta"],
  ["E503", "Carbonatos de amonio", "gasificante", 0, false, "Levadura química tradicional.", "alta"],
  ["E507", "Ácido clorhídrico", "regulador", 0, false, "Regulador de acidez. Es el ácido del propio estómago.", "alta"],
  ["E508", "Cloruro potásico", "regulador", 0, false, "Sustituto de la sal que aporta potasio en vez de sodio.", "alta"],
  ["E511", "Cloruro magnésico", "endurecedor", 0, false, "Es el nigari con el que se cuaja el tofu.", "alta"],
  ["E515", "Sulfatos de potasio", "regulador", 0, false, "Sal potásica del ácido sulfúrico. Regula la acidez y sustituye parte del sodio en algunas sales dietéticas.", "media"],
  ["E516", "Sulfato cálcico", "endurecedor", 0, false, "Es el yeso alimentario, aporta calcio.", "alta"],
  ["E517", "Sulfato amónico", "regulador", 1, false, "Nutriente de levaduras en panificación industrial.", "baja"],
  ["E520", "Sulfato de aluminio", "endurecedor", 2, false, "Aporta aluminio, sin función nutricional.", "media"],
  ["E524", "Hidróxido sódico", "regulador", 0, false, "Es la sosa con la que se tratan las aceitunas.", "alta"],
  ["E526", "Hidróxido cálcico", "regulador", 0, false, "Es la cal con la que se nixtamaliza el maíz.", "alta"],
  ["E535", "Ferrocianuro sódico", "antiaglomerante", 1, false, "Antiaglomerante de la sal de mesa, en cantidades ínfimas.", "media"],
  ["E536", "Ferrocianuro potásico", "antiaglomerante", 1, false, "Antiaglomerante de la sal de mesa.", "media"],
  ["E541", "Fosfato sódico-alumínico", "gasificante", 2, false, "Aporta a la vez aluminio y fósforo inorgánico.", "media"],
  ["E550", "Silicatos de sodio", "antiaglomerante", 1, true, "Silicato de sodio usado como antiaglomerante en productos en polvo. Mineral inerte que no se absorbe.", "baja"],
  ["E553a", "Silicatos de magnesio", "antiaglomerante", 1, true, "Silicato de magnesio usado como antiaglomerante. Mineral inerte que impide que los polvos se apelmacen.", "baja"],
  ["E554", "Silicato alumínico sódico", "antiaglomerante", 2, true, "Antiaglomerante que aporta aluminio, un metal sin ninguna función en el organismo y que conviene no acumular.", "media"],
  ["E555", "Silicato alumínico potásico", "antiaglomerante", 2, true, "Antiaglomerante que aporta aluminio, un metal sin función nutricional cuyo consumo conviene mantener bajo.", "media"],
  ["E570", "Ácidos grasos", "antiaglomerante", 0, true, "Ácidos grasos usados como soporte.", "media"],
  ["E574", "Ácido glucónico", "regulador", 0, false, "Ácido suave sin riesgo conocido.", "alta"],
  ["E575", "Glucono-delta-lactona", "acidulante", 0, false, "Acidulante suave. Es lo que cuaja el tofu sedoso.", "media"],
  ["E576", "Gluconato sódico", "secuestrante", 0, false, "Sal sódica del ácido glucónico, derivado de la glucosa. Secuestra metales que acelerarían el enranciamiento.", "media"],
  ["E578", "Gluconato cálcico", "endurecedor", 0, false, "Sal cálcica del ácido glucónico. Aporta calcio y firma la textura de frutas y verduras en conserva.", "alta"],
  ["E579", "Gluconato ferroso", "estabilizante", 0, false, "Estabiliza el color de las aceitunas negras y aporta hierro.", "alta"],
  ["E585", "Lactato ferroso", "estabilizante", 0, false, "Estabiliza el color de las aceitunas negras.", "media"],
  // --- Potenciadores del sabor ---------------------------------------------
  ["E622", "Glutamato monopotásico", "potenciador", 2, true, "Mismo perfil que el glutamato monosódico.", "media"],
  ["E623", "Diglutamato cálcico", "potenciador", 2, true, "Mismo perfil que el glutamato monosódico.", "media"],
  ["E624", "Glutamato monoamónico", "potenciador", 2, true, "Mismo perfil que el glutamato monosódico.", "media"],
  ["E625", "Diglutamato magnésico", "potenciador", 2, true, "Mismo perfil que el glutamato monosódico.", "media"],
  ["E626", "Ácido guanílico", "potenciador", 2, true, "Purina. Desaconsejado en gota e hiperuricemia.", "media"],
  ["E628", "Guanilato potásico", "potenciador", 2, true, "Purina. Desaconsejado en gota.", "media"],
  ["E630", "Ácido inosínico", "potenciador", 2, true, "Purina. Desaconsejado en gota e hiperuricemia.", "media"],
  ["E632", "Inosinato potásico", "potenciador", 2, true, "Purina. Desaconsejado en gota.", "media"],
  ["E634", "Ribonucleótidos cálcicos", "potenciador", 2, true, "Purinas. Desaconsejado en gota.", "media"],
  ["E640", "Glicina", "potenciador", 0, true, "Es un aminoácido que el propio cuerpo fabrica. Aquí se usa para redondear el sabor, sobre todo en productos con edulcorantes.", "alta"],
  // --- Edulcorantes y varios -----------------------------------------------
  ["E900", "Dimetilpolisiloxano", "antiespumante", 1, true, "Silicona antiespumante de freidoras industriales.", "media"],
  ["E901", "Cera de abejas", "recubrimiento", 0, true, "Cera segregada por las abejas, usada para dar brillo y proteger la superficie de golosinas y fruta. No se absorbe.", "alta"],
  ["E902", "Cera candelilla", "recubrimiento", 0, true, "Cera vegetal de un arbusto mexicano, usada para dar brillo a golosinas y como recubrimiento protector.", "media"],
  ["E905", "Cera microcristalina", "recubrimiento", 1, true, "Derivado del petróleo de grado alimentario.", "media"],
  ["E914", "Cera de polietileno oxidada", "recubrimiento", 1, true, "Recubrimiento de superficie de frutas.", "baja"],
  ["E920", "L-cisteína", "mejorante", 1, true, "Mejorante de masas. Marcador de panificación industrial.", "media"],
  ["E927b", "Carbamida (urea)", "mejorante", 1, true, "Mejorante de masas industriales.", "baja"],
  ["E938", "Argón", "gas", 0, false, "Argón, un gas noble que no reacciona con nada. Desplaza al oxígeno dentro del envase para frenar la oxidación.", "alta"],
  ["E939", "Helio", "gas", 0, false, "Helio, gas inerte usado en el envasado en atmósfera protectora. No reacciona con el alimento.", "alta"],
  ["E942", "Óxido nitroso", "gas", 0, false, "Es el gas de los sifones de nata.", "alta"],
  ["E943a", "Butano", "propelente", 1, false, "Propelente de aerosoles alimentarios.", "media"],
  ["E944", "Propano", "propelente", 1, false, "Propelente de aerosoles alimentarios.", "media"],
  ["E949", "Hidrógeno", "gas", 0, false, "Hidrógeno usado en el envasado en atmósfera protectora. Gas inerte frente al alimento.", "media"],
  ["E953", "Isomalt", "edulcorante", 1, true, "Polialcohol con efecto laxante por encima de 20-30 g.", "alta"],
  ["E957", "Taumatina", "edulcorante", 0, true, "Proteína dulce de origen vegetal, muy bien tolerada.", "media"],
  ["E959", "Neohesperidina DC", "edulcorante", 1, true, "Edulcorante derivado de cítricos.", "media"],
  ["E961", "Neotamo", "edulcorante", 2, true, "Derivado del aspartamo, unas 8.000 veces más dulce que el azúcar.", "media"],
  ["E962", "Sal de aspartamo-acesulfamo", "edulcorante", 2, true, "Combina los dos edulcorantes y hereda las dudas de ambos.", "media"],
  ["E964", "Jarabe de poliglicitol", "edulcorante", 1, true, "Polialcohol con efecto laxante.", "media"],
  ["E966", "Lactitol", "edulcorante", 1, true, "Polialcohol con efecto laxante.", "alta"],
  ["E969", "Advantamo", "edulcorante", 2, true, "Derivado del aspartamo, extremadamente potente.", "media"],
  ["E999", "Extracto de quilaya", "espumante", 1, true, "Espumante vegetal de bebidas.", "media"],
  // --- Almidones modificados y otros ---------------------------------------
  ["E1103", "Invertasa", "enzima", 0, false, "Enzima que ablanda los rellenos de bombón.", "media"],
  ["E1200", "Polidextrosa", "espesante", 1, true, "Fibra de síntesis. Efecto laxante en cantidad.", "media"],
  ["E1201", "Polivinilpirrolidona", "estabilizante", 1, true, "Estabilizante de recubrimientos.", "baja"],
  ["E1404", "Almidón oxidado", "espesante", 1, true, "Almidón modificado químicamente.", "media"],
  ["E1410", "Fosfato de monoalmidón", "espesante", 1, true, "Almidón modificado. Aporta fósforo añadido.", "media"],
  ["E1412", "Fosfato de dialmidón", "espesante", 1, true, "Almidón modificado. Aporta fósforo añadido.", "media"],
  ["E1413", "Fosfato de dialmidón fosfatado", "espesante", 1, true, "Almidón modificado. Aporta fósforo añadido.", "media"],
  ["E1414", "Fosfato de dialmidón acetilado", "espesante", 1, true, "Almidón modificado. Aporta fósforo añadido.", "media"],
  ["E1420", "Almidón acetilado", "espesante", 1, true, "Almidón modificado químicamente.", "media"],
  ["E1440", "Hidroxipropil almidón", "espesante", 1, true, "Almidón modificado químicamente.", "media"],
  ["E1450", "Octenilsuccinato de almidón sódico", "espesante", 1, true, "Almidón modificado, muy usado en bebidas.", "media"],
  ["E1451", "Almidón oxidado acetilado", "espesante", 1, true, "Almidón modificado químicamente.", "baja"],
  ["E1452", "Octenilsuccinato de almidón alumínico", "espesante", 2, true, "Almidón modificado que además aporta aluminio.", "media"],
  ["E1505", "Citrato de trietilo", "soporte", 1, true, "Disolvente que transporta los aromas y evita que se separen. Se metaboliza en citrato y etanol en cantidades ínfimas.", "baja"],
  ["E1518", "Triacetina", "humectante", 1, true, "Soporte de aromas derivado de la glicerina. Mantiene la humedad y evita que los aromas se evaporen.", "media"]
];
var FAMILIAS_E = [
  { desde: 100, hasta: 199, funcion: "colorante", cosmetico: true },
  { desde: 200, hasta: 299, funcion: "conservante", cosmetico: false },
  { desde: 300, hasta: 399, funcion: "antioxidante o regulador de acidez", cosmetico: false },
  { desde: 400, hasta: 499, funcion: "espesante, emulgente o estabilizante", cosmetico: true },
  { desde: 500, hasta: 599, funcion: "regulador de acidez o antiaglomerante", cosmetico: false },
  { desde: 600, hasta: 699, funcion: "potenciador del sabor", cosmetico: true },
  { desde: 700, hasta: 799, funcion: "antibiótico", cosmetico: false },
  { desde: 900, hasta: 949, funcion: "agente de recubrimiento o gas", cosmetico: true },
  { desde: 950, hasta: 969, funcion: "edulcorante", cosmetico: true },
  { desde: 970, hasta: 999, funcion: "agente diverso", cosmetico: true },
  { desde: 1e3, hasta: 1599, funcion: "aditivo diverso o almidón modificado", cosmetico: true }
];

// src/datos/aditivos.ts
var FILAS = [
  // --- Colorantes azoicos: advertencia legal obligatoria en la UE ---------
  ["E102", "Tartrazina", "colorante", 3, true, 'Colorante azoico. La UE obliga a rotular "puede afectar a la actividad y la atención de los niños". Asociado a reacciones en asmáticos.', "alta"],
  ["E104", "Amarillo de quinoleína", "colorante", 3, true, "Colorante con advertencia legal de hiperactividad infantil en la UE.", "alta"],
  ["E110", "Amarillo ocaso FCF", "colorante", 3, true, "Azoico con advertencia legal de hiperactividad infantil. Prohibido en varios países.", "alta"],
  ["E122", "Azorrubina / Carmoisina", "colorante", 3, true, "Azoico con advertencia legal de hiperactividad infantil.", "alta"],
  ["E124", "Ponceau 4R", "colorante", 3, true, "Azoico con advertencia legal de hiperactividad infantil. Prohibido en EE. UU.", "alta"],
  ["E129", "Rojo allura AC", "colorante", 3, true, "Azoico con advertencia legal de hiperactividad infantil.", "alta"],
  ["E123", "Amaranto", "colorante", 3, true, "Uso muy restringido en la UE. Prohibido en EE. UU. desde 1976.", "media"],
  ["E127", "Eritrosina", "colorante", 2, true, "Yodado, uso restringido. Sospecha de interferencia tiroidea a dosis altas.", "media"],
  ["E131", "Azul patente V", "colorante", 2, true, "Colorante sintético, reacciones alérgicas descritas.", "media"],
  ["E132", "Indigotina", "colorante", 2, true, "Colorante sintético sin función nutricional.", "baja"],
  ["E133", "Azul brillante FCF", "colorante", 2, true, "Colorante sintético sin función nutricional.", "baja"],
  ["E142", "Verde S", "colorante", 2, true, "Colorante sintético sin función nutricional.", "baja"],
  ["E151", "Negro brillante BN", "colorante", 2, true, "Colorante sintético, restringido en varios países.", "media"],
  ["E155", "Marrón HT", "colorante", 2, true, "Colorante sintético, reacciones en personas sensibles al benzoato.", "media"],
  ["E171", "Dióxido de titanio", "colorante", 3, true, "PROHIBIDO como aditivo alimentario en la UE desde 2022: la EFSA no pudo descartar genotoxicidad.", "alta"],
  ["E150c", "Caramelo amónico", "colorante", 2, true, "Puede contener 4-metilimidazol, clasificado como posible carcinógeno.", "media"],
  ["E150d", "Caramelo sulfito amónico", "colorante", 2, true, "Puede contener 4-metilimidazol. Es el caramelo de los refrescos de cola.", "media"],
  ["E150a", "Caramelo natural", "colorante", 1, true, "Obtenido por calentamiento de azúcar sin reactivos. Bajo riesgo.", "media"],
  ["E150b", "Caramelo cáustico sulfítico", "colorante", 1, true, "Bajo riesgo, pero sigue siendo un colorante cosmético.", "baja"],
  ["E100", "Curcumina", "colorante", 0, true, "Extracto de cúrcuma. Sin riesgo conocido a dosis alimentarias.", "alta"],
  ["E101", "Riboflavina (B2)", "colorante", 0, true, "Es una vitamina del grupo B.", "alta"],
  ["E160a", "Carotenos", "colorante", 0, true, "Precursor de vitamina A, de origen vegetal.", "alta"],
  ["E160c", "Extracto de pimentón", "colorante", 0, true, "Colorante natural sin riesgo conocido.", "alta"],
  ["E162", "Rojo de remolacha", "colorante", 0, true, "Colorante natural sin riesgo conocido.", "alta"],
  ["E163", "Antocianinas", "colorante", 0, true, "Pigmentos vegetales con actividad antioxidante.", "alta"],
  ["E120", "Cochinilla / Ácido carmínico", "colorante", 1, true, "Origen animal (insecto). Alérgeno reconocido en personas sensibles.", "media"],
  // --- Conservantes ------------------------------------------------------
  ["E249", "Nitrito potásico", "conservante", 3, false, "Precursor de nitrosaminas en el estómago y al cocinar. La OMS clasifica la carne procesada como carcinógeno del grupo 1.", "alta"],
  ["E250", "Nitrito sódico", "conservante", 3, false, "Precursor de nitrosaminas. Es la razón principal de que la carne procesada sea carcinógeno del grupo 1 (OMS).", "alta"],
  ["E251", "Nitrato sódico", "conservante", 3, false, "Se reduce a nitrito en el organismo. Mismo mecanismo de nitrosaminas.", "alta"],
  ["E252", "Nitrato potásico", "conservante", 3, false, "Se reduce a nitrito en el organismo. Mismo mecanismo de nitrosaminas.", "alta"],
  ["E239", "Hexametilentetramina", "conservante", 3, false, "Libera formaldehído. Uso muy restringido.", "media"],
  ["E284", "Ácido bórico", "conservante", 3, false, "Acumulativo, toxicidad reproductiva. Uso legal casi residual.", "media"],
  ["E220", "Dióxido de azufre", "conservante", 2, false, "Alérgeno de declaración obligatoria. Broncoconstricción en asmáticos.", "alta"],
  ["E221", "Sulfito sódico", "conservante", 2, false, "Alérgeno de declaración obligatoria. Destruye tiamina (B1).", "alta"],
  ["E223", "Metabisulfito sódico", "conservante", 2, false, "Alérgeno de declaración obligatoria, reacciones en asmáticos.", "alta"],
  ["E224", "Metabisulfito potásico", "conservante", 2, false, "Alérgeno de declaración obligatoria.", "alta"],
  ["E210", "Ácido benzoico", "conservante", 2, false, "Junto con vitamina C puede formar benceno en bebidas. Pseudoalergias.", "media"],
  ["E211", "Benzoato sódico", "conservante", 2, false, "Junto con vitamina C puede formar benceno. Estudiado en el síndrome de hiperactividad junto a colorantes azoicos.", "media"],
  ["E212", "Benzoato potásico", "conservante", 2, false, "Mismo perfil que el benzoato sódico.", "media"],
  ["E214", "p-hidroxibenzoato de etilo", "conservante", 2, false, "Parabeno. Sospecha de actividad endocrina.", "media"],
  ["E218", "p-hidroxibenzoato de metilo", "conservante", 2, false, "Parabeno. Sospecha de actividad endocrina.", "media"],
  ["E200", "Ácido sórbico", "conservante", 1, false, "Bien tolerado. Irritación leve en personas sensibles.", "alta"],
  ["E202", "Sorbato potásico", "conservante", 1, false, "De los conservantes mejor tolerados.", "alta"],
  ["E280", "Ácido propiónico", "conservante", 1, false, "Antifúngico de panadería. Bien tolerado.", "media"],
  ["E282", "Propionato cálcico", "conservante", 1, false, "Antifúngico de panadería industrial. Marcador de pan no artesanal.", "media"],
  ["E235", "Natamicina", "conservante", 1, false, "Antifúngico de superficie en quesos y embutidos.", "media"],
  ["E1105", "Lisozima", "conservante", 0, false, "Enzima natural del huevo. Alérgeno para alérgicos al huevo.", "media"],
  ["E270", "Ácido láctico", "acidulante", 0, false, "Presente de forma natural en alimentos fermentados.", "alta"],
  ["E260", "Ácido acético", "acidulante", 0, false, "Es el ácido del vinagre. Se usa para acidificar y conservar, y el cuerpo lo metaboliza como cualquier alimento fermentado.", "alta"],
  ["E296", "Ácido málico", "acidulante", 0, false, "Ácido natural de la manzana.", "alta"],
  ["E330", "Ácido cítrico", "acidulante", 0, false, "Ácido natural de los cítricos, sin riesgo a dosis alimentarias.", "alta"],
  ["E331", "Citratos de sodio", "regulador", 0, false, "Sal del ácido cítrico. Sin riesgo conocido.", "alta"],
  ["E332", "Citratos de potasio", "regulador", 0, false, "Sal potásica del ácido cítrico. Regula la acidez y aporta algo de potasio. Sin señales de daño a dosis alimentarias.", "alta"],
  ["E333", "Citratos de calcio", "regulador", 0, false, "Sal cálcica del ácido cítrico. Regula la acidez y firma la textura de frutas en conserva, aportando algo de calcio.", "alta"],
  ["E500", "Bicarbonato sódico", "gasificante", 0, false, "Aporta sodio, pero sin riesgo propio.", "alta"],
  ["E170", "Carbonato cálcico", "regulador", 0, false, "Es carbonato de calcio, aporta calcio.", "alta"],
  // --- Antioxidantes -----------------------------------------------------
  ["E320", "BHA (butilhidroxianisol)", "antioxidante", 3, false, "Clasificado por la IARC como posible carcinógeno humano (grupo 2B). Sospecha de disrupción endocrina.", "alta"],
  ["E321", "BHT (butilhidroxitolueno)", "antioxidante", 2, false, "Antioxidante sintético con señales de disrupción endocrina en modelos animales.", "media"],
  ["E310", "Galato de propilo", "antioxidante", 2, false, "Sospecha de actividad estrogénica. Restringido en alimentos infantiles.", "media"],
  ["E311", "Galato de octilo", "antioxidante", 2, false, "Mismo perfil que el galato de propilo.", "media"],
  ["E312", "Galato de dodecilo", "antioxidante", 2, false, "Mismo perfil que el galato de propilo.", "media"],
  ["E319", "TBHQ", "antioxidante", 2, false, "Antioxidante sintético con IDA estrecha. Señales inmunológicas en estudios animales.", "media"],
  ["E300", "Ácido ascórbico (vitamina C)", "antioxidante", 0, false, "Es vitamina C. Beneficioso salvo combinado con benzoatos.", "alta"],
  ["E301", "Ascorbato sódico", "antioxidante", 0, false, "Es vitamina C en forma de sal sódica, más estable que el ácido ascórbico puro. Protege de la oxidación y del enranciamiento.", "alta"],
  ["E306", "Tocoferoles naturales", "antioxidante", 0, false, "Vitamina E de origen natural.", "alta"],
  ["E307", "Alfa-tocoferol", "antioxidante", 0, false, "Es vitamina E de síntesis. Protege las grasas del producto de la oxidación y cumple además una función nutricional.", "alta"],
  ["E322", "Lecitinas", "emulgente", 0, true, "Emulgente de soja o girasol, bien tolerado. Cuenta como marcador de procesado.", "alta"],
  // --- Potenciadores del sabor -------------------------------------------
  ["E621", "Glutamato monosódico", "potenciador", 2, true, "Estimula la palatabilidad y favorece el sobreconsumo. Aporta sodio adicional oculto.", "media"],
  ["E627", "Guanilato disódico", "potenciador", 2, true, "Se usa junto al glutamato para multiplicar su efecto. Desaconsejado en gota (purinas).", "media"],
  ["E631", "Inosinato disódico", "potenciador", 2, true, "Nucleótido purínico. Desaconsejado en hiperuricemia y gota.", "media"],
  ["E635", "Ribonucleótidos disódicos", "potenciador", 2, true, "Mezcla de E627 y E631. Mismo perfil.", "media"],
  ["E620", "Ácido glutámico", "potenciador", 2, true, "Base del glutamato monosódico.", "media"],
  // --- Edulcorantes ------------------------------------------------------
  ["E951", "Aspartamo", "edulcorante", 2, true, "Clasificado por la IARC en 2023 como posiblemente carcinógeno (grupo 2B). Contraindicado en fenilcetonuria.", "media"],
  ["E950", "Acesulfamo K", "edulcorante", 2, true, "Señales de alteración de la microbiota y de la respuesta a la insulina en estudios recientes.", "media"],
  ["E955", "Sucralosa", "edulcorante", 2, true, "Altera la microbiota intestinal. Puede generar compuestos indeseables al calentarse.", "media"],
  ["E952", "Ciclamato", "edulcorante", 2, true, "Prohibido en EE. UU. desde 1970. Metabolizado a ciclohexilamina por la microbiota.", "media"],
  ["E954", "Sacarina", "edulcorante", 2, true, "Alteración de la tolerancia a la glucosa vía microbiota en estudios humanos.", "media"],
  ["E960", "Glucósidos de esteviol", "edulcorante", 1, true, "Origen vegetal, de los mejor tolerados. Sigue siendo marcador de ultraprocesado.", "media"],
  ["E968", "Eritritol", "edulcorante", 2, true, "Estudios de 2023 lo asocian a mayor reactividad plaquetaria y riesgo cardiovascular.", "media"],
  ["E965", "Maltitol", "edulcorante", 1, true, "Polialcohol. Efecto laxante y gases por encima de 20-30 g.", "alta"],
  ["E420", "Sorbitol", "edulcorante", 1, true, "Polialcohol. Efecto laxante, mal tolerado en colon irritable (FODMAP).", "alta"],
  ["E421", "Manitol", "edulcorante", 1, true, "Polialcohol con efecto laxante.", "alta"],
  ["E967", "Xilitol", "edulcorante", 1, true, "Polialcohol. No eleva la glucemia, pero es tóxico para los perros.", "alta"],
  // --- Emulgentes, espesantes, estabilizantes -----------------------------
  ["E407", "Carragenanos", "espesante", 2, true, "Asociado a inflamación intestinal en modelos animales. Desaconsejado en enfermedad inflamatoria intestinal.", "media"],
  ["E407a", "Alga Euchema procesada", "espesante", 2, true, "Perfil similar al carragenano.", "media"],
  ["E466", "Carboximetilcelulosa (CMC)", "espesante", 2, true, "Ensayo clínico de 2021: altera la microbiota y la capa de moco intestinal.", "media"],
  ["E433", "Polisorbato 80", "emulgente", 2, true, "Emulgente asociado a alteración de la barrera intestinal en estudios experimentales.", "media"],
  ["E432", "Polisorbato 20", "emulgente", 2, true, "Mismo perfil que el polisorbato 80.", "media"],
  ["E435", "Polisorbato 60", "emulgente", 2, true, "Mismo perfil que el polisorbato 80.", "media"],
  ["E471", "Mono y diglicéridos de ácidos grasos", "emulgente", 1, true, "Puede contener grasas trans residuales. Marcador claro de ultraprocesado.", "media"],
  ["E472e", "Ésteres DATEM", "emulgente", 1, true, "Mejorante de panificación industrial. Marcador de pan ultraprocesado.", "media"],
  ["E475", "Ésteres poliglicéridos", "emulgente", 1, true, "Emulgente de bollería industrial.", "baja"],
  ["E476", "Polirricinoleato de poliglicerol", "emulgente", 1, true, "Usado para reducir manteca de cacao en el chocolate barato.", "media"],
  ["E481", "Estearoil-2-lactilato sódico", "emulgente", 1, true, "Mejorante de panificación industrial.", "baja"],
  ["E482", "Estearoil-2-lactilato cálcico", "emulgente", 1, true, "Mejorante de panificación industrial.", "baja"],
  ["E491", "Monoestearato de sorbitano", "emulgente", 1, true, "Emulgente sintético derivado del sorbitol. Ayuda a mezclar agua y grasa. Sin toxicidad conocida, pero delata una formulación industrial.", "baja"],
  ["E410", "Goma garrofín", "espesante", 0, true, "Fibra vegetal de algarroba. Bien tolerada.", "alta"],
  ["E412", "Goma guar", "espesante", 0, true, "Fibra vegetal. Puede dar gases (FODMAP).", "alta"],
  ["E414", "Goma arábiga", "espesante", 0, true, "Fibra prebiótica bien tolerada.", "alta"],
  ["E415", "Goma xantana", "espesante", 0, true, "Polisacárido de fermentación, bien tolerado.", "alta"],
  ["E417", "Goma tara", "espesante", 0, true, "Fibra soluble de la semilla de tara, un árbol sudamericano. Espesa sin aportar apenas calorías.", "media"],
  ["E418", "Goma gellan", "espesante", 0, true, "Polisacárido de fermentación.", "media"],
  ["E440", "Pectinas", "gelificante", 0, true, "Fibra soluble natural de la fruta.", "alta"],
  ["E406", "Agar-agar", "gelificante", 0, true, "Fibra gelificante de algas rojas, usada en Japón desde hace siglos. No se digiere y aporta sensación de saciedad.", "alta"],
  ["E401", "Alginato sódico", "espesante", 0, true, "Sal sódica del ácido algínico, extraída de algas pardas. Es fibra soluble que espesa y estabiliza.", "alta"],
  ["E1442", "Fosfato de hidroxipropil almidón", "espesante", 1, true, "Almidón modificado químicamente. Marcador de ultraprocesado.", "media"],
  ["E1400", "Dextrinas", "espesante", 1, true, "Almidón modificado, índice glucémico alto.", "media"],
  ["E1422", "Adipato de dialmidón acetilado", "espesante", 1, true, "Almidón modificado químicamente.", "media"],
  // --- Fosfatos y sales minerales ----------------------------------------
  ["E338", "Ácido fosfórico", "acidulante", 2, false, "Fósforo inorgánico de absorción muy alta. Se asocia a peor salud ósea y renal y desmineraliza el esmalte dental.", "media"],
  ["E339", "Fosfatos de sodio", "estabilizante", 2, false, "Fósforo inorgánico añadido: carga renal y riesgo cardiovascular en consumo habitual.", "media"],
  ["E340", "Fosfatos de potasio", "estabilizante", 2, false, "Mismo perfil que los fosfatos de sodio.", "media"],
  ["E341", "Fosfatos de calcio", "estabilizante", 2, false, "Fósforo inorgánico añadido.", "media"],
  ["E450", "Difosfatos", "estabilizante", 2, false, "Retienen agua en embutidos y carnes. Fósforo inorgánico añadido.", "media"],
  ["E451", "Trifosfatos", "estabilizante", 2, false, "Muy usados para inyectar agua en carne y pescado.", "media"],
  ["E452", "Polifosfatos", "estabilizante", 2, false, "Fósforo inorgánico de absorción casi total.", "media"],
  ["E385", "EDTA cálcico disódico", "secuestrante", 2, false, "Quelante que puede arrastrar minerales esenciales en consumo continuado.", "media"],
  ["E512", "Cloruro de estaño", "antioxidante", 2, false, "Aporta estaño, con IDA estrecha.", "baja"],
  ["E551", "Dióxido de silicio", "antiaglomerante", 1, true, "Antiaglomerante. La forma nanoparticulada está bajo revisión de la EFSA.", "media"],
  ["E552", "Silicato cálcico", "antiaglomerante", 1, true, "Antiaglomerante mineral que impide que los productos en polvo se apelmacen. Se usa en cantidades ínfimas y no se absorbe.", "baja"],
  ["E553b", "Talco", "antiaglomerante", 1, true, "Talco de grado alimentario, usado como antiaglomerante y para dar brillo. Inerte, no se absorbe en el intestino.", "baja"],
  ["E504", "Carbonato de magnesio", "antiaglomerante", 0, false, "Sal de magnesio que regula la acidez y evita el apelmazamiento. Aporta magnesio, un mineral en el que la dieta española suele quedarse corta.", "alta"],
  ["E509", "Cloruro cálcico", "endurecedor", 0, false, "Sal de calcio, sin riesgo.", "alta"],
  ["E575", "Glucono-delta-lactona", "acidulante", 0, false, "Acidulante suave.", "media"],
  // --- Gases y varios ----------------------------------------------------
  ["E290", "Dióxido de carbono", "gas", 0, false, "Es el gas de las bebidas con gas.", "alta"],
  ["E941", "Nitrógeno", "gas", 0, false, "Nitrógeno, el gas que compone el 78 % del aire. Desplaza al oxígeno dentro del envase para que el producto no se oxide.", "alta"],
  ["E948", "Oxígeno", "gas", 0, false, "Oxígeno usado en el envasado en atmósfera protectora, sobre todo para mantener el color rojo de la carne fresca.", "alta"],
  ["E903", "Cera carnauba", "agente de recubrimiento", 1, true, "Recubrimiento brillante de golosinas.", "baja"],
  ["E904", "Goma laca", "agente de recubrimiento", 1, true, "Recubrimiento de origen animal (insecto).", "baja"],
  ["E1520", "Propilenglicol", "humectante", 1, true, "Portador de aromas. IDA establecida, bajo riesgo a dosis normales.", "media"],
  ["E422", "Glicerol", "humectante", 0, true, "Humectante bien tolerado, con aporte calórico.", "alta"],
  ["E163a", "Cianidina", "colorante", 0, true, "Cianidina, una de las antocianinas que dan color a los frutos rojos y la col lombarda. Pigmento vegetal con actividad antioxidante.", "media"]
];
var TODAS = [...FILAS, ...FILAS_AMPLIACION];
var ADITIVOS = new Map(
  TODAS.map(([codigo, nombre, funcion, riesgo, cosmetico, motivo, evidencia]) => [
    codigo,
    {
      codigo,
      nombre,
      funcion,
      riesgo,
      cosmetico,
      motivo,
      evidencia,
      fichado: true,
      fuentes: fuentesDeAditivo(codigo, riesgo, funcion)
    }
  ])
);
function fuentesDeAditivo(codigo, riesgo, funcion) {
  const f = ["ue-1333", "efsa-aditivos"];
  const n = parseInt(codigo.replace(/[^0-9]/g, ""), 10);
  if (n >= 249 && n <= 252) f.push("efsa-nitritos", "iarc-carne");
  if (codigo === "E951" || codigo === "E962" || codigo === "E961" || codigo === "E969") f.push("iarc-aspartamo");
  if (codigo === "E171") f.push("ue-2022-63");
  if ([102, 104, 110, 122, 124, 129].includes(n)) f.push("efsa-azoicos");
  if (n >= 338 && n <= 343 || n >= 450 && n <= 452) f.push("efsa-fosforo");
  if (codigo === "E466" || funcion === "emulgente") f.push("emulgentes-2021");
  return f;
}
function buscarAditivo(codigo) {
  const exacto = ADITIVOS.get(codigo) ?? ADITIVOS.get(codigo.replace(/[a-z]$/, ""));
  if (exacto) return exacto;
  const n = parseInt(codigo.replace(/[^0-9]/g, ""), 10);
  if (!Number.isFinite(n)) return void 0;
  const familia = FAMILIAS_E.find((f) => n >= f.desde && n <= f.hasta);
  if (!familia) return void 0;
  return {
    codigo,
    nombre: `Aditivo ${codigo}`,
    funcion: familia.funcion,
    // Sin ficha no se puede afirmar que sea peligroso, pero tampoco que sea
    // inocuo. Riesgo 1: consta, pesa poco y se avisa de que falta información.
    riesgo: 1,
    cosmetico: familia.cosmetico,
    motivo: `No tenemos ficha de este aditivo. Por su numeración es un ${familia.funcion}. Consúltalo en el Reglamento (CE) 1333/2008 antes de sacar conclusiones.`,
    evidencia: "baja",
    fichado: false,
    fuentes: ["ue-1333"]
  };
}
var ALIAS_ADITIVOS = {
  "glutamato monosodico": "E621",
  "glutamato monosódico": "E621",
  "glutamato de sodio": "E621",
  "nitrito sodico": "E250",
  "nitrito de sodio": "E250",
  "nitrito potasico": "E249",
  "nitrato sodico": "E251",
  "nitrato potasico": "E252",
  "sal de nitrificacion": "E250",
  "sal nitrificante": "E250",
  aspartamo: "E951",
  sucralosa: "E955",
  "acesulfamo k": "E950",
  "acesulfamo potasico": "E950",
  sacarina: "E954",
  ciclamato: "E952",
  eritritol: "E968",
  maltitol: "E965",
  sorbitol: "E420",
  xilitol: "E967",
  manitol: "E421",
  "glucosidos de esteviol": "E960",
  "extracto de estevia": "E960",
  carragenano: "E407",
  carragenanos: "E407",
  "goma xantana": "E415",
  "goma guar": "E412",
  "goma garrofin": "E410",
  "goma arabiga": "E414",
  "agar agar": "E406",
  pectina: "E440",
  pectinas: "E440",
  lecitina: "E322",
  lecitinas: "E322",
  "lecitina de soja": "E322",
  "lecitina de girasol": "E322",
  "acido citrico": "E330",
  "acido ascorbico": "E300",
  "acido fosforico": "E338",
  "acido lactico": "E270",
  "acido malico": "E296",
  "acido sorbico": "E200",
  "sorbato potasico": "E202",
  "benzoato sodico": "E211",
  "acido benzoico": "E210",
  "dioxido de azufre": "E220",
  sulfitos: "E220",
  "metabisulfito sodico": "E223",
  "dioxido de titanio": "E171",
  "dioxido de silicio": "E551",
  "carbonato calcico": "E170",
  "bicarbonato sodico": "E500",
  "propionato calcico": "E282",
  tartrazina: "E102",
  "rojo allura": "E129",
  "amarillo ocaso": "E110",
  "ponceau 4r": "E124",
  "azul brillante": "E133",
  curcumina: "E100",
  carotenos: "E160a",
  "caramelo amonico": "E150c",
  "caramelo sulfito amonico": "E150d",
  "color caramelo": "E150c",
  "mono y digliceridos de acidos grasos": "E471",
  "monogliceridos y digliceridos": "E471",
  "esteres de acidos grasos": "E471",
  "polirricinoleato de poliglicerol": "E476",
  "polisorbato 80": "E433",
  "carboximetilcelulosa": "E466",
  "celulosa microcristalina": "E466",
  "trifosfatos": "E451",
  "difosfatos": "E450",
  "polifosfatos": "E452",
  "fosfatos de sodio": "E339",
  "tocoferoles": "E306",
  bht: "E321",
  bha: "E320",
  tbhq: "E319",
  "galato de propilo": "E310",
  // Aditivos que las etiquetas nombran por su nombre y no por su código.
  "extracto de romero": "E392",
  "romero": "E392",
  "tocoferoles naturales": "E306",
  "alfa tocoferol": "E307",
  "vitamina e": "E306",
  "vitamina c": "E300",
  "ascorbato sodico": "E301",
  "ascorbato de sodio": "E301",
  "nisina": "E234",
  "natamicina": "E235",
  "carmin": "E120",
  "cochinilla": "E120",
  "acido carminico": "E120",
  "curcuma": "E100",
  "clorofilas": "E140",
  "licopeno": "E160d",
  "luteina": "E161b",
  "betacaroteno": "E160a",
  "caroteno": "E160a",
  "rojo de remolacha": "E162",
  "antocianinas": "E163",
  "carbon vegetal": "E153",
  "goma tragacanto": "E413",
  "goma gellan": "E418",
  "goma tara": "E417",
  "alginato sodico": "E401",
  "acido alginico": "E400",
  "agar": "E406",
  "almidon modificado": "E1442",
  "celulosa": "E460",
  "metilcelulosa": "E461",
  "carboximetilcelulosa sodica": "E466",
  "glicerol": "E422",
  "glicerina": "E422",
  "sorbato calcico": "E203",
  "sorbato sodico": "E201",
  "benzoato calcico": "E213",
  "propionato sodico": "E281",
  "acido propionico": "E280",
  "acido tartarico": "E334",
  "acido fumarico": "E297",
  "acido succinico": "E363",
  "acido adipico": "E355",
  "lactato sodico": "E325",
  "lactato calcico": "E327",
  "citrato sodico": "E331",
  "citrato calcico": "E333",
  "fosfato calcico": "E341",
  "difosfato disodico": "E450",
  "cloruro potasico": "E508",
  "cloruro calcico": "E509",
  "sulfato calcico": "E516",
  "hidroxido calcico": "E526",
  "hidroxido sodico": "E524",
  "carbonato potasico": "E501",
  "cera de abejas": "E901",
  "cera carnauba": "E903",
  "goma laca": "E904",
  "taumatina": "E957",
  "isomalt": "E953",
  "lactitol": "E966",
  "neotamo": "E961",
  "estevia": "E960",
  "polidextrosa": "E1200",
  "gelatina alimentaria": "E428",
  "pectina de manzana": "E440",
  "l cisteina": "E920",
  "cisteina": "E920",
  "oxigeno": "E948",
  "nitrogeno": "E941",
  "dioxido de carbono": "E290",
  "anhidrido carbonico": "E290"
};

// src/datos/alergenos.ts
var ALERGENOS = [
  {
    clave: "gluten",
    nombre: "Cereales con gluten",
    patrones: [
      "gluten",
      "trigo",
      "centeno",
      "cebada",
      "espelta",
      "kamut",
      "triticale",
      "harina de trigo",
      "semola",
      "cuscus",
      "seitan",
      "malta de cebada",
      "extracto de malta"
    ],
    nota: "Trigo, centeno, cebada, avena, espelta, kamut y sus híbridos. La avena solo es problema si no está certificada sin gluten."
  },
  {
    clave: "crustaceos",
    nombre: "Crustáceos",
    patrones: [
      "crustaceo",
      "gamba",
      "langostino",
      "camaron",
      "cangrejo",
      "bogavante",
      "langosta",
      "cigala",
      "necora",
      "centollo",
      "krill"
    ],
    nota: "Y productos a base de crustáceos."
  },
  {
    clave: "huevo",
    nombre: "Huevos",
    patrones: ["huevo", "clara de huevo", "yema", "ovoalbumina", "albumina de huevo", "lisozima", "ovoproducto"],
    nota: "Incluye la lisozima (E1105), que se obtiene de la clara."
  },
  {
    clave: "pescado",
    nombre: "Pescado",
    patrones: [
      "pescado",
      "atun",
      "salmon",
      "bacalao",
      "merluza",
      "anchoa",
      "sardina",
      "boqueron",
      "gelatina de pescado",
      "surimi"
    ],
    nota: "Y productos a base de pescado, incluida la gelatina de pescado usada como clarificante."
  },
  {
    clave: "cacahuete",
    nombre: "Cacahuetes",
    patrones: ["cacahuete", "cacahuate", "mani", "aceite de cacahuete", "crema de cacahuete"],
    nota: "Es una legumbre, no un fruto seco, y se declara aparte por su alta capacidad alergénica."
  },
  {
    clave: "soja",
    nombre: "Soja",
    patrones: [
      "soja",
      "soya",
      "lecitina de soja",
      "proteina de soja",
      "tofu",
      "tempeh",
      "salsa de soja",
      "edamame",
      "miso"
    ],
    nota: "Y productos a base de soja. La lecitina de soja (E322) está muy extendida."
  },
  {
    clave: "leche",
    nombre: "Leche",
    patrones: [
      "leche",
      "lactosa",
      "suero de leche",
      "caseina",
      "caseinato",
      "nata",
      "mantequilla",
      "queso",
      "yogur",
      "cuajo",
      "lactoserum",
      "proteina de suero",
      "kefir",
      "requeson",
      "mascarpone"
    ],
    nota: "Incluida la lactosa. Alergia a la proteína de la leche e intolerancia a la lactosa son cosas distintas."
  },
  {
    clave: "frutos_cascara",
    nombre: "Frutos de cáscara",
    patrones: [
      "almendra",
      "avellana",
      "nuez",
      "nueces",
      "anacardo",
      "pacana",
      "pecana",
      "nuez de brasil",
      "pistacho",
      "macadamia",
      "nuez de queensland"
    ],
    nota: "Almendras, avellanas, nueces, anacardos, pacanas, nueces de Brasil, pistachos y macadamias."
  },
  {
    clave: "apio",
    nombre: "Apio",
    patrones: ["apio", "apionabo"],
    nota: "Y productos derivados. Aparece con frecuencia en caldos y sopas preparadas."
  },
  {
    clave: "mostaza",
    nombre: "Mostaza",
    patrones: ["mostaza"],
    nota: "Y productos derivados. Habitual en salsas, escabeches y embutidos."
  },
  {
    clave: "sesamo",
    nombre: "Granos de sésamo",
    patrones: ["sesamo", "ajonjoli", "tahini", "tahina"],
    nota: "Y productos a base de sésamo, incluido el tahini del hummus."
  },
  {
    clave: "sulfitos",
    nombre: "Dióxido de azufre y sulfitos",
    patrones: [
      "sulfito",
      "sulfitos",
      "metabisulfito",
      "bisulfito",
      "dioxido de azufre",
      "e220",
      "e221",
      "e222",
      "e223",
      "e224",
      "e226",
      "e227",
      "e228"
    ],
    nota: "De declaración obligatoria por encima de 10 mg/kg. Puede provocar broncoconstricción en personas asmáticas."
  },
  {
    clave: "altramuces",
    nombre: "Altramuces",
    patrones: ["altramuz", "altramuces", "lupino", "harina de altramuz"],
    nota: "Legumbre cada vez más usada como harina en productos sin gluten."
  },
  {
    clave: "moluscos",
    nombre: "Moluscos",
    patrones: [
      "molusco",
      "mejillon",
      "almeja",
      "berberecho",
      "ostra",
      "vieira",
      "calamar",
      "sepia",
      "pulpo",
      "caracol",
      "navaja",
      "chipiron"
    ],
    nota: "Y productos a base de moluscos."
  }
];
var PATRONES_TRAZAS = [
  "puede contener trazas",
  "puede contener",
  "trazas de",
  "elaborado en una linea",
  "elaborado en instalaciones",
  "fabricado en una fabrica"
];
var AVISO_ALERGENOS = "La detección de alérgenos es una ayuda de lectura, nunca una garantía. Si tienes una alergia diagnosticada, lee siempre el envase original.";

// src/datos/lexico.ts
var AZUCARES_ANADIDOS = [
  "azucar",
  "azucar moreno",
  "azucar de cana",
  "azucar invertido",
  "azucar glas",
  "azucar caramelizado",
  "sacarosa",
  "jarabe de glucosa",
  "jarabe de glucosa y fructosa",
  "jarabe de fructosa",
  "jarabe de maiz",
  "jarabe de maiz de alta fructosa",
  "sirope de glucosa",
  "sirope de agave",
  "sirope de arce",
  "jarabe de arce",
  "jarabe de arroz",
  "jarabe de malta",
  "jarabe de azucar invertido",
  "jarabe de caramelo",
  "isoglucosa",
  "dextrosa",
  "glucosa",
  "fructosa",
  "maltosa",
  "maltodextrina",
  "dextrina",
  "melaza",
  "miel",
  "panela",
  "azucar de coco",
  "extracto de malta",
  "malta de cebada",
  "concentrado de zumo",
  "zumo concentrado",
  "zumo de fruta concentrado",
  "concentrado de manzana",
  "concentrado de uva",
  "pasta de datil",
  "jarabe de dátil",
  "jarabe de datil",
  "galactosa",
  "trehalosa"
];
var GRASAS = [
  { patron: "parcialmente hidrogenad", prefijo: true, etiqueta: "Grasa parcialmente hidrogenada", valor: -3, motivo: "Fuente directa de grasas trans industriales. No existe nivel seguro de consumo según la OMS." },
  { patron: "hidrogenad", prefijo: true, etiqueta: "Grasa hidrogenada", valor: -3, motivo: "Proceso que genera grasas trans. Elevan el colesterol LDL y bajan el HDL simultáneamente." },
  { patron: "interesterificad", prefijo: true, etiqueta: "Grasa interesterificada", valor: -2, motivo: "Sustituto de las trans con efectos metabólicos aún poco caracterizados." },
  { patron: "palmiste", etiqueta: "Aceite de palmiste", valor: -2, motivo: "Aún más saturado que el aceite de palma (más del 80 % de grasa saturada)." },
  { patron: "palma", etiqueta: "Aceite de palma", valor: -2, motivo: "Cerca del 50 % de grasa saturada. Su refinado genera ésteres glicidílicos, contaminantes de proceso vigilados por la EFSA." },
  { patron: "grasa vegetal", etiqueta: "Grasa vegetal sin especificar", valor: -2, motivo: "Casi siempre palma o coco. La falta de concreción rara vez esconde algo bueno." },
  { patron: "grasas vegetales", etiqueta: "Grasa vegetal sin especificar", valor: -2, motivo: "Casi siempre palma o coco. La falta de concreción rara vez esconde algo bueno." },
  { patron: "aceites vegetales", etiqueta: "Aceite vegetal sin especificar", valor: -1, motivo: "Sin especificar el origen no se puede valorar el perfil de ácidos grasos." },
  { patron: "aceite vegetal", etiqueta: "Aceite vegetal sin especificar", valor: -1, motivo: "Sin especificar el origen no se puede valorar el perfil de ácidos grasos." },
  { patron: "manteca de cerdo", etiqueta: "Manteca de cerdo", valor: -1, motivo: "Alto contenido en grasa saturada." },
  { patron: "sebo", etiqueta: "Sebo animal", valor: -2, motivo: "Grasa animal muy saturada." },
  { patron: "aceite de coco", etiqueta: "Aceite de coco", valor: -1, motivo: "Más del 80 % de grasa saturada, pese a su fama saludable." },
  { patron: "aceite de girasol alto oleico", etiqueta: "Girasol alto oleico", valor: 1, motivo: "Perfil parecido al del oliva, estable frente a la oxidación." },
  { patron: "aceite de girasol", etiqueta: "Aceite de girasol", valor: 0, motivo: "Muy rico en omega-6; en exceso desequilibra la relación omega-6/omega-3." },
  { patron: "aceite de colza", etiqueta: "Aceite de colza", valor: 1, motivo: "Buen perfil de ácidos grasos, con aporte de omega-3." },
  { patron: "aceite de oliva virgen extra", etiqueta: "AOVE", valor: 3, motivo: "Monoinsaturados y polifenoles con efecto cardioprotector demostrado." },
  { patron: "aceite de oliva virgen", etiqueta: "Aceite de oliva virgen", valor: 2, motivo: "Rico en monoinsaturados." },
  { patron: "aceite de oliva", etiqueta: "Aceite de oliva", valor: 2, motivo: "Rico en ácido oleico." },
  { patron: "mantequilla", etiqueta: "Mantequilla", valor: -1, motivo: "Alta en grasa saturada, aunque de matriz láctea." },
  { patron: "nata", etiqueta: "Nata", valor: -1, motivo: "Alta en grasa saturada." }
];
var MARCADORES_UPF = [
  { patron: "aroma", etiqueta: "Aromas" },
  { patron: "saborizante", etiqueta: "Saborizantes" },
  { patron: "extracto de levadura", etiqueta: "Extracto de levadura" },
  { patron: "proteina de suero", etiqueta: "Proteína de suero aislada" },
  { patron: "aislado de proteina", etiqueta: "Aislado de proteína" },
  { patron: "concentrado de proteina", etiqueta: "Concentrado de proteína" },
  { patron: "proteina de soja texturizada", etiqueta: "Proteína de soja texturizada" },
  { patron: "suero de leche en polvo", etiqueta: "Suero de leche en polvo" },
  { patron: "leche en polvo", etiqueta: "Leche en polvo" },
  { patron: "leche desnatada en polvo", etiqueta: "Leche desnatada en polvo" },
  { patron: "leche entera en polvo", etiqueta: "Leche entera en polvo" },
  { patron: "suero en polvo", etiqueta: "Suero en polvo" },
  { patron: "almidon modificado", etiqueta: "Almidón modificado" },
  { patron: "maltodextrina", etiqueta: "Maltodextrina" },
  { patron: "jarabe de glucosa", etiqueta: "Jarabe de glucosa" },
  { patron: "dextrosa", etiqueta: "Dextrosa" },
  { patron: "gluten de trigo", etiqueta: "Gluten de trigo aislado" },
  { patron: "fibra vegetal", etiqueta: "Fibra vegetal aislada" },
  { patron: "inulina", etiqueta: "Inulina añadida" },
  { patron: "hidrolizado", etiqueta: "Hidrolizado de proteína" },
  { patron: "humo", etiqueta: "Aroma de humo" },
  { patron: "colorante", etiqueta: "Colorante" },
  { patron: "edulcorante", etiqueta: "Edulcorante" },
  { patron: "emulgente", etiqueta: "Emulgente" },
  { patron: "estabilizante", etiqueta: "Estabilizante" },
  { patron: "espesante", etiqueta: "Espesante" },
  { patron: "potenciador del sabor", etiqueta: "Potenciador del sabor" },
  { patron: "antiaglomerante", etiqueta: "Antiaglomerante" },
  { patron: "gasificante", etiqueta: "Gasificante" },
  { patron: "corrector de acidez", etiqueta: "Corrector de acidez" }
];
var INGREDIENTES_REALES = [
  { patron: "integral", etiqueta: "Cereal integral", peso: 3, motivo: "Conserva el salvado y el germen: fibra, magnesio y vitaminas del grupo B que la harina refinada pierde." },
  { patron: "avena", etiqueta: "Avena", peso: 3, motivo: "Beta-glucanos con efecto demostrado sobre el colesterol LDL." },
  { patron: "legumbre", etiqueta: "Legumbre", peso: 3, motivo: "Fibra, proteína vegetal y almidón resistente. Uno de los mejores predictores de longevidad." },
  { patron: "garbanzo", etiqueta: "Garbanzo", peso: 3, motivo: "Proteína vegetal, fibra y hierro." },
  { patron: "lenteja", etiqueta: "Lenteja", peso: 3, motivo: "Proteína vegetal, fibra y hierro no hemo." },
  { patron: "alubia", etiqueta: "Alubia", peso: 3, motivo: "Fibra y almidón resistente que alimenta la microbiota." },
  { patron: "judia", etiqueta: "Judía", peso: 3, motivo: "Fibra y proteína vegetal." },
  { patron: "almendra", etiqueta: "Almendra", peso: 3, motivo: "Grasa monoinsaturada, vitamina E, magnesio y fibra." },
  { patron: "nuez", etiqueta: "Nuez", peso: 3, motivo: "Única fuente vegetal común de omega-3 de cadena corta en cantidad relevante." },
  { patron: "avellana", etiqueta: "Avellana", peso: 3, motivo: "Monoinsaturados y vitamina E." },
  { patron: "pistacho", etiqueta: "Pistacho", peso: 3, motivo: "Proteína, fibra y potasio." },
  { patron: "anacardo", etiqueta: "Anacardo", peso: 2, motivo: "Magnesio y grasa insaturada." },
  { patron: "semilla", etiqueta: "Semillas", peso: 2, motivo: "Fibra, minerales y grasa insaturada." },
  { patron: "tomate", etiqueta: "Tomate", peso: 2, motivo: "Licopeno, potasio y vitamina C." },
  { patron: "verdura", etiqueta: "Verdura", peso: 3, motivo: "Fibra, micronutrientes y compuestos fitoquímicos." },
  { patron: "hortaliza", etiqueta: "Hortalizas", peso: 3, motivo: "Fibra y micronutrientes con baja densidad calórica." },
  { patron: "espinaca", etiqueta: "Espinaca", peso: 3, motivo: "Folato, hierro y nitratos vasodilatadores." },
  { patron: "zanahoria", etiqueta: "Zanahoria", peso: 2, motivo: "Betacarotenos y fibra." },
  { patron: "cebolla", etiqueta: "Cebolla", peso: 2, motivo: "Quercetina y fructanos prebióticos." },
  { patron: "ajo", etiqueta: "Ajo", peso: 2, motivo: "Compuestos azufrados con efecto cardiovascular." },
  { patron: "fruta", etiqueta: "Fruta", peso: 2, motivo: "Fibra y micronutrientes en su matriz original." },
  { patron: "huevo", etiqueta: "Huevo", peso: 2, motivo: "Proteína de altísimo valor biológico y colina." },
  { patron: "atun", etiqueta: "Atún", peso: 2, motivo: "Proteína y omega-3 de cadena larga." },
  { patron: "salmon", etiqueta: "Salmón", peso: 3, motivo: "EPA y DHA, los omega-3 con efecto cardiovascular directo." },
  { patron: "sardina", etiqueta: "Sardina", peso: 3, motivo: "Omega-3, calcio y vitamina D." },
  { patron: "yogur", etiqueta: "Yogur", peso: 2, motivo: "Matriz láctea fermentada con bacterias vivas." },
  { patron: "fermento", etiqueta: "Fermentos lácticos", peso: 2, motivo: "Bacterias vivas que contribuyen a la microbiota intestinal." },
  { patron: "masa madre", etiqueta: "Masa madre", peso: 3, motivo: "Fermentación larga que reduce el índice glucémico y mejora la biodisponibilidad de minerales." },
  { patron: "cacao", etiqueta: "Cacao", peso: 2, motivo: "Flavanoles con efecto vascular, siempre que no venga sepultado en azúcar." }
];
var REFINADOS = [
  "harina de trigo",
  "harina de maiz",
  "harina de arroz",
  "semola de trigo",
  "almidon de maiz",
  "almidon de patata",
  "almidon de trigo",
  "fecula",
  "arroz blanco",
  "pasta de trigo"
];
var SALES = ["sal", "sal marina", "cloruro sodico", "sal yodada", "salmuera"];
var VRN = {
  vitamina_a: { nombre: "Vitamina A", cantidad: 800, unidad: "ug" },
  vitamina_d: { nombre: "Vitamina D", cantidad: 5, unidad: "ug" },
  vitamina_e: { nombre: "Vitamina E", cantidad: 12, unidad: "mg" },
  vitamina_k: { nombre: "Vitamina K", cantidad: 75, unidad: "ug" },
  vitamina_c: { nombre: "Vitamina C", cantidad: 80, unidad: "mg" },
  tiamina: { nombre: "Tiamina (B1)", cantidad: 1.1, unidad: "mg" },
  riboflavina: { nombre: "Riboflavina (B2)", cantidad: 1.4, unidad: "mg" },
  niacina: { nombre: "Niacina (B3)", cantidad: 16, unidad: "mg" },
  vitamina_b6: { nombre: "Vitamina B6", cantidad: 1.4, unidad: "mg" },
  folato: { nombre: "Ácido fólico", cantidad: 200, unidad: "ug" },
  vitamina_b12: { nombre: "Vitamina B12", cantidad: 2.5, unidad: "ug" },
  biotina: { nombre: "Biotina", cantidad: 50, unidad: "ug" },
  calcio: { nombre: "Calcio", cantidad: 800, unidad: "mg" },
  fosforo: { nombre: "Fósforo", cantidad: 700, unidad: "mg" },
  hierro: { nombre: "Hierro", cantidad: 14, unidad: "mg" },
  magnesio: { nombre: "Magnesio", cantidad: 375, unidad: "mg" },
  zinc: { nombre: "Zinc", cantidad: 10, unidad: "mg" },
  potasio: { nombre: "Potasio", cantidad: 2e3, unidad: "mg" },
  yodo: { nombre: "Yodo", cantidad: 150, unidad: "ug" },
  selenio: { nombre: "Selenio", cantidad: 55, unidad: "ug" }
};
function normalizarTexto(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[.,;:()\[\]{}«»"'*]/g, " ").replace(/\s+/g, " ").trim();
}
var OTRAS_VIGILADAS = [
  { patron: "cafeina", etiqueta: "Cafeína", severidad: 30, motivo: "Estimulante. La EFSA sitúa el límite en 400 mg al día para adultos y 200 mg en embarazo. Altera el sueño hasta 6 horas después de tomarla." },
  { patron: "taurina", etiqueta: "Taurina", severidad: 24, motivo: "Habitual en bebidas energéticas, casi siempre junto a dosis altas de cafeína y azúcar." },
  { patron: "quinina", etiqueta: "Quinina", severidad: 22, motivo: "Amargante de las tónicas. Desaconsejada en embarazo y con ciertos medicamentos." },
  { patron: "sirope de glucosa fructosa", etiqueta: "Jarabe de glucosa y fructosa", severidad: 62, motivo: "Fructosa libre en dosis altas: se metaboliza en el hígado y se asocia a hígado graso no alcohólico." },
  { patron: "jarabe de glucosa y fructosa", etiqueta: "Jarabe de glucosa y fructosa", severidad: 62, motivo: "Fructosa libre en dosis altas: se metaboliza en el hígado y se asocia a hígado graso no alcohólico." }
];

// src/nucleo/ingredientes.ts
function tienePalabra(texto, patron) {
  const p = patron.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|\\s)${p}(\\s|$)`).test(texto);
}
function tienePrefijo(texto, patron) {
  return texto.includes(patron);
}
var RE_CODIGO_E = /\be\s?-?\s?(\d{3,4}\s?[a-z]?)\b/gi;
function analizarIngredientes(crudos) {
  const lista = [];
  const aditivos = [];
  const fuentesAzucar = /* @__PURE__ */ new Set();
  const marcadoresUPF = /* @__PURE__ */ new Set();
  const grasas = [];
  const reales = [];
  let azucarEnPrimeras = false;
  let refinadoPrimero = false;
  let salPresente = false;
  crudos.forEach((crudo, i) => {
    const t = normalizarTexto(crudo.texto);
    const roles = /* @__PURE__ */ new Set();
    let codigoE;
    let nombreAditivo;
    let riesgoAditivo;
    RE_CODIGO_E.lastIndex = 0;
    let m;
    while ((m = RE_CODIGO_E.exec(t)) !== null) {
      const cod = "E" + m[1].replace(/\s/g, "");
      const ad = buscarAditivo(cod);
      if (ad) {
        aditivos.push({ aditivo: ad, posicion: i });
        roles.add("aditivo");
        codigoE = ad.codigo;
        nombreAditivo = ad.nombre;
        riesgoAditivo = ad.riesgo;
        if (ad.cosmetico) marcadoresUPF.add(ad.nombre);
      }
    }
    if (!codigoE) {
      for (const [alias, cod] of Object.entries(ALIAS_ADITIVOS)) {
        if (tienePalabra(t, alias)) {
          const ad = ADITIVOS.get(cod);
          if (ad && !aditivos.some((a) => a.aditivo.codigo === cod && a.posicion === i)) {
            aditivos.push({ aditivo: ad, posicion: i });
            roles.add("aditivo");
            codigoE = ad.codigo;
            nombreAditivo = ad.nombre;
            riesgoAditivo = ad.riesgo;
            if (ad.cosmetico) marcadoresUPF.add(ad.nombre);
          }
          break;
        }
      }
    }
    let mejorAzucar = "";
    for (const az of AZUCARES_ANADIDOS) {
      if (tienePalabra(t, az) && az.length > mejorAzucar.length) mejorAzucar = az;
    }
    if (mejorAzucar) {
      roles.add("azucar_anadido");
      fuentesAzucar.add(mejorAzucar);
      if (i < 3) azucarEnPrimeras = true;
    }
    const candidatasGrasa = GRASAS.filter((g) => g.prefijo ? tienePrefijo(t, g.patron) : tienePalabra(t, g.patron));
    if (candidatasGrasa.length > 0) {
      const mejor = candidatasGrasa.reduce((a, b) => b.patron.length > a.patron.length ? b : a);
      grasas.push({ perfil: mejor, posicion: i });
      roles.add("grasa");
    }
    for (const mk of MARCADORES_UPF) {
      if (tienePrefijo(t, mk.patron)) {
        marcadoresUPF.add(mk.etiqueta);
        roles.add("marcador_ultraprocesado");
      }
    }
    for (const r of INGREDIENTES_REALES) {
      if (tienePalabra(t, r.patron)) {
        if (!reales.some((x) => x.etiqueta === r.etiqueta)) {
          reales.push({ etiqueta: r.etiqueta, peso: r.peso, motivo: r.motivo, posicion: i, porcentaje: crudo.porcentaje });
        }
        roles.add(r.patron === "integral" ? "integral" : "fruta_verdura_legumbre");
      }
    }
    for (const ref of REFINADOS) {
      if (tienePalabra(t, ref) && !roles.has("integral")) {
        roles.add("harina_refinada");
        if (i === 0) refinadoPrimero = true;
      }
    }
    for (const s of SALES) {
      if (tienePalabra(t, s)) {
        roles.add("sal");
        salPresente = true;
      }
    }
    if (roles.size === 0) roles.add("otro");
    lista.push({
      texto: crudo.texto,
      textoNormalizado: t,
      posicion: i,
      porcentaje: crudo.porcentaje,
      roles: [...roles],
      codigoE,
      nombreAditivo,
      riesgoAditivo
    });
  });
  const alergenos = [];
  for (const al of ALERGENOS) {
    for (const ic of lista) {
      if (!al.patrones.some((pat) => tienePalabra(ic.textoNormalizado, pat))) continue;
      const esTraza = PATRONES_TRAZAS.some((t) => ic.textoNormalizado.includes(t));
      if (!alergenos.some((x) => x.clave === al.clave)) {
        alergenos.push({
          clave: al.clave,
          nombre: al.nombre,
          nota: al.nota,
          esTraza,
          encontradoEn: ic.texto
        });
      }
      break;
    }
  }
  const aditivosSinFicha = [...new Set(
    aditivos.filter((a) => a.aditivo.fichado === false).map((a) => a.aditivo.codigo)
  )];
  return {
    lista,
    alergenos,
    aditivosSinFicha,
    aditivos,
    fuentesAzucar: [...fuentesAzucar],
    azucarEnPrimeras,
    grasas,
    marcadoresUPF: [...marcadoresUPF],
    reales,
    refinadoPrimero,
    salPresente,
    total: crudos.length
  };
}

// src/config/pesos.ts
var VERSION_ALGORITMO = "1.7.1";
var PESOS = {
  nutriScore: 0.36,
  nova: 0.28,
  aditivos: 0.24,
  ingredientes: 0.12
};
var NOTA_LETRA = { A: 100, B: 82, C: 58, D: 32, E: 12 };
var NOTA_NOVA = { 1: 100, 2: 84, 3: 66, 4: 22 };
var CASTIGO_ADITIVO = { 0: 0, 1: 4, 2: 13, 3: 26 };
var UMBRALES = {
  azucarSolido: 22.5,
  // g por 100 g
  azucarBebida: 11.25,
  // g por 100 ml
  saturadas: 5,
  // g por 100 g
  sal: 1.5,
  // g por 100 g
  ratioSaturadasGrasa: 33,
  // % sobre grasa total, solo para aceites y cremas
  densidadCalorica: 350
  // kcal por 100 g a partir de las cuales penaliza
};
var LIMITES_DIARIOS = {
  salOMS: 5,
  // g al día
  azucarLibreOMS: 25
  // g al día
};
var VETOS = {
  trans: 18,
  aditivoNivel3: 40,
  salAlta: { desde: 2.5, tope: 42 },
  bebidaAzucarada: { desde: 8, tope: 28 },
  azucarMuyAlto: { desde: 45, tope: 24 },
  azucarAlto: { desde: 30, tope: 30 },
  ultraprocesado: 64,
  ultraprocesadoAzucarado: { desde: 15, tope: 48 }
};
var SUELOS = {
  minimamenteProcesado: 74,
  grasaBuena: 88
};
var EXPONENTE_DOSIS = 0.7;
var NIVELES = [
  { clave: "rojo", desde: 0, etiqueta: "Consumo ocasional" },
  { clave: "naranja", desde: 30, etiqueta: "Con moderación" },
  { clave: "amarillo", desde: 50, etiqueta: "Aceptable, hay mejores" },
  { clave: "verde_claro", desde: 70, etiqueta: "Buena elección habitual" },
  { clave: "verde_parchis", desde: 85, etiqueta: "Especialmente favorable" }
];
var CAMPOS_OBLIGATORIOS = [
  "energia",
  "grasas_g",
  "saturadas_g",
  "hidratos_g",
  "azucares_g",
  "proteinas_g",
  "sal"
];

// src/nucleo/nova.ts
var EXPLICACION = {
  1: "Alimento sin procesar o mínimamente procesado. Es comida, sin más.",
  2: "Ingrediente culinario procesado (aceite, sal, azúcar). Se usa para cocinar, no se come solo.",
  3: "Alimento procesado: comida real a la que se ha añadido sal, azúcar o aceite para conservarla o hacerla más sabrosa.",
  4: "Ultraprocesado. Formulación industrial con sustancias que no existen en una cocina doméstica. El grupo NOVA 4 se asocia de forma consistente con mayor riesgo cardiovascular, obesidad y mortalidad total, incluso ajustando por su composición nutricional."
};
function clasificarNova(ing) {
  if (ing.total === 0) {
    return {
      grupo: null,
      marcadores: [],
      explicacion: "No se puede determinar el grado de procesamiento sin la lista de ingredientes."
    };
  }
  const marcadores2 = [...ing.marcadoresUPF];
  if (marcadores2.length > 0) {
    return { grupo: 4, marcadores: marcadores2, explicacion: EXPLICACION[4] };
  }
  const hayAzucar = ing.fuentesAzucar.length > 0;
  const hayGrasaAnadida = ing.grasas.length > 0;
  const haySal = ing.salPresente;
  const hayRefinado = ing.lista.some((i) => i.roles.includes("harina_refinada"));
  if (ing.total <= 2) {
    if ((hayGrasaAnadida || hayAzucar || haySal) && ing.reales.length === 0) {
      return { grupo: 2, marcadores: [], explicacion: EXPLICACION[2] };
    }
    return { grupo: 1, marcadores: [], explicacion: EXPLICACION[1] };
  }
  if (hayAzucar || haySal || hayGrasaAnadida || hayRefinado) {
    return { grupo: 3, marcadores: [], explicacion: EXPLICACION[3] };
  }
  return { grupo: 1, marcadores: [], explicacion: EXPLICACION[1] };
}
function notaNova(grupo) {
  return grupo === null ? null : NOTA_NOVA[grupo];
}

// src/nucleo/normalizar.ts
function leido(valor, textoOriginal) {
  return { valor, estado: "leido", textoOriginal };
}
function desconocido() {
  return { valor: null, estado: "desconocido" };
}
function calculado(valor, de) {
  return { valor, estado: "calculado", textoOriginal: `deducido de ${de}` };
}
function hay(d) {
  return Boolean(d) && d.estado !== "desconocido" && typeof d.valor === "number";
}
function aDato(x) {
  if (x === null || x === void 0) return desconocido();
  if (typeof x === "number") {
    return Number.isFinite(x) ? leido(x) : desconocido();
  }
  if (typeof x === "object" && "estado" in x) return x;
  return desconocido();
}
function normalizarNutrientes(e) {
  const n = {
    energia_kcal: aDato(e.energia_kcal),
    energia_kj: aDato(e.energia_kj),
    grasas_g: aDato(e.grasas_g),
    saturadas_g: aDato(e.saturadas_g),
    monoinsaturadas_g: aDato(e.monoinsaturadas_g),
    poliinsaturadas_g: aDato(e.poliinsaturadas_g),
    trans_g: aDato(e.trans_g),
    hidratos_g: aDato(e.hidratos_g),
    azucares_g: aDato(e.azucares_g),
    polialcoholes_g: aDato(e.polialcoholes_g),
    fibra_g: aDato(e.fibra_g),
    proteinas_g: aDato(e.proteinas_g),
    sal_g: aDato(e.sal_g),
    sodio_mg: aDato(e.sodio_mg),
    fvl_porcentaje: aDato(e.fvl_porcentaje)
  };
  if (!hay(n.energia_kj) && hay(n.energia_kcal)) {
    n.energia_kj = calculado(n.energia_kcal.valor * 4.184, "kcal");
  }
  if (!hay(n.energia_kcal) && hay(n.energia_kj)) {
    n.energia_kcal = calculado(n.energia_kj.valor / 4.184, "kJ");
  }
  if (!hay(n.sal_g) && hay(n.sodio_mg)) {
    n.sal_g = calculado(n.sodio_mg.valor * 2.5 / 1e3, "sodio");
  }
  return n;
}
function camposQueFaltan(n) {
  const nombres = {
    energia: "Energía",
    grasas_g: "Grasas",
    saturadas_g: "Grasas saturadas",
    hidratos_g: "Hidratos de carbono",
    azucares_g: "Azúcares",
    proteinas_g: "Proteínas",
    sal: "Sal"
  };
  const faltan = [];
  for (const campo of CAMPOS_OBLIGATORIOS) {
    if (campo === "energia") {
      if (!hay(n.energia_kcal) && !hay(n.energia_kj)) faltan.push(nombres.energia);
    } else if (campo === "sal") {
      if (!hay(n.sal_g)) faltan.push(nombres.sal);
    } else if (!hay(n[campo])) {
      faltan.push(nombres[campo]);
    }
  }
  return faltan;
}
function voluntariosQueFaltan(n) {
  const faltan = [];
  if (!hay(n.fibra_g)) faltan.push("Fibra");
  if (!hay(n.fvl_porcentaje)) faltan.push("Porcentaje de fruta, verdura y legumbre");
  return faltan;
}

// src/nucleo/nutriscore.ts
var ENERGIA_GENERAL = [335, 670, 1005, 1340, 1675, 2010, 2345, 2680, 3015, 3350];
var ENERGIA_BEBIDA = [30, 90, 150, 210, 240, 270, 300, 330, 360, 390];
var ENERGIA_GRASA = [120, 240, 360, 480, 600, 720, 840, 960, 1080, 1200];
var AZUCAR_GENERAL = [3.4, 6.8, 10, 14, 17, 20, 24, 27, 31, 34, 37, 41, 44, 48, 51];
var AZUCAR_BEBIDA = [0.5, 2, 3.5, 5, 6, 7, 8, 9, 10, 11];
var SATURADAS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var RATIO_SATURADAS = [10, 16, 22, 28, 34, 40, 46, 52, 58, 64];
var SAL = [
  0.2,
  0.4,
  0.6,
  0.8,
  1,
  1.2,
  1.4,
  1.6,
  1.8,
  2,
  2.2,
  2.4,
  2.6,
  2.8,
  3,
  3.2,
  3.4,
  3.6,
  3.8,
  4
];
var FIBRA = [3, 4.1, 5.2, 6.3, 7.4];
var PROTEINA = [2.4, 4.8, 7.2, 9.6, 12, 14, 17];
var PROTEINA_BEBIDA = [1.2, 1.5, 1.8, 2.1, 2.4, 2.7, 3];
function puntos(valor, umbrales) {
  let n = 0;
  for (const u of umbrales) if (valor > u) n++;
  return n;
}
function puntosFVL(pct, esBebida) {
  if (esBebida) {
    if (pct > 80) return 6;
    if (pct > 60) return 4;
    if (pct > 40) return 2;
    return 0;
  }
  if (pct > 80) return 5;
  if (pct > 60) return 2;
  if (pct > 40) return 1;
  return 0;
}
var VACIO = {
  letra: null,
  completo: false,
  puntosNegativos: 0,
  puntosPositivos: 0,
  puntuacion: null,
  detalle: {},
  faltan: []
};
function calcularNutriScore(n, opts) {
  const faltan = camposQueFaltan(n);
  if (faltan.length > 0) {
    return { ...VACIO, faltan };
  }
  const cat = opts.categoria;
  const esBebida = cat === "bebida";
  const esGrasa = cat === "grasa_anadida";
  const kj = n.energia_kj.valor;
  const grasas = n.grasas_g.valor;
  const sat = n.saturadas_g.valor;
  const azucar = n.azucares_g.valor;
  const sal = n.sal_g.valor;
  const proteina = n.proteinas_g.valor;
  const fibra = hay(n.fibra_g) ? n.fibra_g.valor : 0;
  const fvl = hay(n.fvl_porcentaje) ? n.fvl_porcentaje.valor : 0;
  let pEnergia;
  let pSaturadas;
  if (esGrasa) {
    pEnergia = puntos(sat * 37, ENERGIA_GRASA);
    pSaturadas = puntos(grasas > 0 ? sat / grasas * 100 : 0, RATIO_SATURADAS);
  } else {
    pEnergia = puntos(kj, esBebida ? ENERGIA_BEBIDA : ENERGIA_GENERAL);
    pSaturadas = puntos(sat, SATURADAS);
  }
  const pAzucar = puntos(azucar, esBebida ? AZUCAR_BEBIDA : AZUCAR_GENERAL);
  const pSal = puntos(sal, SAL);
  const pEdulcorante = esBebida && opts.contieneEdulcorante ? 4 : 0;
  const N = pEnergia + pAzucar + pSaturadas + pSal + pEdulcorante;
  const pFibra = puntos(fibra, FIBRA);
  let pProteina = puntos(proteina, esBebida ? PROTEINA_BEBIDA : PROTEINA);
  if (cat === "carne_roja") pProteina = Math.min(pProteina, 2);
  const pFVL = puntosFVL(fvl, esBebida);
  const P = pFibra + pProteina + pFVL;
  let puntuacion;
  if (cat === "queso" || cat === "bebida" || esGrasa) {
    puntuacion = N - P;
  } else {
    puntuacion = N < 11 ? N - P : N - pFVL - pFibra;
  }
  let letra;
  if (esBebida) {
    if (opts.esAgua) letra = "A";
    else if (puntuacion <= 2) letra = "B";
    else if (puntuacion <= 6) letra = "C";
    else if (puntuacion <= 9) letra = "D";
    else letra = "E";
  } else if (esGrasa) {
    if (puntuacion < -5) letra = "A";
    else if (puntuacion < 3) letra = "B";
    else if (puntuacion < 11) letra = "C";
    else if (puntuacion < 19) letra = "D";
    else letra = "E";
  } else {
    if (puntuacion < 1) letra = "A";
    else if (puntuacion < 3) letra = "B";
    else if (puntuacion < 11) letra = "C";
    else if (puntuacion < 19) letra = "D";
    else letra = "E";
  }
  return {
    letra,
    completo: true,
    puntosNegativos: N,
    puntosPositivos: P,
    puntuacion,
    faltan: [],
    detalle: {
      energia: pEnergia,
      azucares: pAzucar,
      saturadas: pSaturadas,
      sal: pSal,
      edulcorante: pEdulcorante,
      fibra: pFibra,
      proteinas: pProteina,
      fvl: pFVL
    }
  };
}
function notaDesdeLetra(letra) {
  return letra ? NOTA_LETRA[letra] : null;
}

// src/nucleo/limitar.ts
function porUmbral(valor, umbral, base, tope = 96) {
  if (valor <= 0 || umbral <= 0) return 0;
  return Math.min(tope, base * Math.pow(valor / umbral, EXPONENTE_DOSIS));
}
var r1 = (x) => Math.round(x * 10) / 10;
function construirLimitar(n, ing, nova, categoria) {
  const out = [];
  const esBebida = categoria === "bebida";
  const unidad = esBebida ? "100 ml" : "100 g";
  const hayIngredientes = ing.total > 0;
  const hidrogenada = ing.grasas.find((g) => g.perfil.patron.includes("hidrogenad"));
  if (hidrogenada) {
    out.push({
      id: "trans_ingrediente",
      nombre: hidrogenada.perfil.etiqueta,
      categoria: "grasa",
      peso: 96,
      origen: "ingredientes",
      dato: `posición ${hidrogenada.posicion + 1} de la lista`,
      motivo: hidrogenada.perfil.motivo,
      evidencia: "alta"
    });
  } else if (hay(n.trans_g) && n.trans_g.valor > 0.2) {
    out.push({
      id: "trans_declaradas",
      nombre: "Grasas trans",
      categoria: "grasa",
      peso: Math.min(96, 70 + n.trans_g.valor * 12),
      origen: "tabla",
      dato: `${r1(n.trans_g.valor)} g / ${unidad}`,
      motivo: "Suben el colesterol LDL y bajan el HDL a la vez. La OMS no establece ningún nivel seguro de ingesta.",
      evidencia: "alta"
    });
  }
  if (hay(n.azucares_g) && n.azucares_g.valor > 0.5) {
    const azucar = n.azucares_g.valor;
    const hayAnadido = ing.fuentesAzucar.length > 0;
    const umbral = esBebida ? UMBRALES.azucarBebida : UMBRALES.azucarSolido;
    let peso = porUmbral(azucar, umbral, 62);
    if (!hayIngredientes) peso *= 0.7;
    else if (!hayAnadido) peso *= 0.32;
    if (ing.azucarEnPrimeras) peso *= 1.12;
    if (esBebida) peso *= 1.25;
    peso = Math.min(97, peso);
    if (peso >= 4) {
      out.push({
        // El identificador distingue los tres casos a propósito. Si los tres
        // compartieran uno, el recuento del historial los fusionaría y acabaría
        // diciendo que un yogur natural lleva azúcar añadido.
        id: !hayIngredientes ? "azucares" : hayAnadido ? "azucares_anadidos" : "azucares_intrinsecos",
        nombre: !hayIngredientes ? "Azúcares" : hayAnadido ? "Azúcares añadidos" : "Azúcares intrínsecos",
        categoria: "nutriente",
        peso,
        origen: hayIngredientes ? "ambos" : "tabla",
        dato: `${r1(azucar)} g / ${unidad}`,
        motivo: !hayIngredientes ? "Sin la lista de ingredientes no se puede distinguir el azúcar añadido del propio del alimento. La valoración es provisional." : hayAnadido ? `Azúcar libre añadido${ing.azucarEnPrimeras ? ", y además figura entre los tres primeros ingredientes, así que es de lo que más pesa en el producto" : ""}. La OMS recomienda no pasar de 25 g al día.` : "Azúcar propio del alimento, dentro de su matriz natural. Preocupa mucho menos que el añadido, pero sigue contando en el total diario.",
        evidencia: "alta"
      });
    }
  }
  if (ing.fuentesAzucar.length >= 2) {
    out.push({
      id: "azucar_fragmentado",
      nombre: "Azúcar repartido en varias fuentes",
      categoria: "ingrediente",
      peso: Math.min(74, 42 + ing.fuentesAzucar.length * 8),
      origen: "ingredientes",
      dato: `${ing.fuentesAzucar.length} formas distintas: ${ing.fuentesAzucar.join(", ")}`,
      motivo: "Los ingredientes se declaran por orden de peso. Dividir el azúcar en varias formas químicas hace que ninguna suba a los primeros puestos, aunque sumadas sean el ingrediente principal. Es legal y es deliberado.",
      evidencia: "alta"
    });
  }
  if (hay(n.saturadas_g) && n.saturadas_g.valor > 0.3) {
    const sat = n.saturadas_g.valor;
    if (categoria === "grasa_anadida" && hay(n.grasas_g) && n.grasas_g.valor > 0) {
      const ratio = sat / n.grasas_g.valor * 100;
      const peso = porUmbral(ratio, UMBRALES.ratioSaturadasGrasa, 52);
      if (peso >= 5) {
        out.push({
          id: "saturadas_ratio",
          nombre: "Proporción de grasa saturada",
          categoria: "nutriente",
          peso,
          origen: "tabla",
          dato: `${Math.round(ratio)} % de la grasa total (${r1(sat)} g / ${unidad})`,
          motivo: "En una grasa lo relevante es el reparto entre saturada e insaturada. Por debajo del 20 % el perfil es favorable; por encima del 50 % es el de una grasa sólida.",
          evidencia: "alta"
        });
      }
    } else {
      const peso = porUmbral(sat, UMBRALES.saturadas, 55);
      if (peso >= 5) {
        out.push({
          id: "saturadas",
          nombre: "Grasas saturadas",
          categoria: "nutriente",
          peso,
          origen: "tabla",
          dato: `${r1(sat)} g / ${unidad}`,
          motivo: "Elevan el colesterol LDL. Las guías recomiendan mantenerlas por debajo del 10 % de las calorías diarias, unos 22 g.",
          evidencia: "alta"
        });
      }
    }
  }
  if (hay(n.sal_g) && n.sal_g.valor > 0.1) {
    const sal = n.sal_g.valor;
    const peso = porUmbral(sal, UMBRALES.sal, 58);
    if (peso >= 5) {
      out.push({
        id: "sal",
        nombre: "Sal",
        categoria: "sal",
        peso,
        origen: "tabla",
        dato: `${r1(sal)} g / ${unidad} (${Math.round(sal / 5 * 100)} % del límite diario OMS)`,
        motivo: "Principal factor dietético modificable de la hipertensión. La OMS fija el límite en 5 g al día y la media española lo dobla.",
        evidencia: "alta"
      });
    }
  }
  const vistos = /* @__PURE__ */ new Set();
  for (const { aditivo } of ing.aditivos) {
    if (aditivo.riesgo === 0 || vistos.has(aditivo.codigo)) continue;
    vistos.add(aditivo.codigo);
    const base = { 1: 26, 2: 58, 3: 88 }[aditivo.riesgo];
    const ajuste = aditivo.evidencia === "alta" ? 4 : aditivo.evidencia === "baja" ? -4 : 0;
    out.push({
      id: `aditivo_${aditivo.codigo}`,
      nombre: `${aditivo.codigo} · ${aditivo.nombre}`,
      categoria: "aditivo",
      peso: Math.min(94, base + ajuste),
      origen: "ingredientes",
      dato: aditivo.funcion,
      motivo: aditivo.motivo,
      evidencia: aditivo.evidencia
    });
  }
  if (vistos.size >= 5) {
    out.push({
      id: "coctel_aditivos",
      nombre: "Acumulación de aditivos",
      categoria: "procesado",
      peso: Math.min(72, 38 + vistos.size * 5),
      origen: "ingredientes",
      dato: `${vistos.size} aditivos con algún grado de riesgo`,
      motivo: "Cada aditivo se evalúa por separado, nunca en combinación. El efecto conjunto de mezclas es un hueco reconocido de la evaluación toxicológica actual.",
      evidencia: "media"
    });
  }
  for (const { perfil, posicion } of ing.grasas) {
    if (perfil.valor >= 0 || perfil.patron.includes("hidrogenad")) continue;
    const base = { [-1]: 34, [-2]: 62, [-3]: 90 }[perfil.valor] ?? 30;
    out.push({
      id: `grasa_${perfil.patron.replace(/\s/g, "_")}`,
      nombre: perfil.etiqueta,
      categoria: "grasa",
      peso: base + (posicion < 3 ? 6 : 0),
      origen: "ingredientes",
      dato: `posición ${posicion + 1} de la lista`,
      motivo: perfil.motivo,
      evidencia: "media"
    });
  }
  if (nova.grupo === 4) {
    out.push({
      id: "ultraprocesado",
      nombre: "Ultraprocesado (NOVA 4)",
      categoria: "procesado",
      peso: Math.min(88, 52 + nova.marcadores.length * 4),
      origen: "ingredientes",
      dato: `${nova.marcadores.length} marcador(es): ${nova.marcadores.slice(0, 6).join(", ")}`,
      motivo: nova.explicacion,
      evidencia: "alta"
    });
  }
  if (hay(n.energia_kcal) && categoria !== "grasa_anadida") {
    const kcal = n.energia_kcal.valor;
    if (kcal > UMBRALES.densidadCalorica) {
      out.push({
        id: "densidad_calorica",
        nombre: "Densidad calórica alta",
        categoria: "nutriente",
        peso: Math.min(66, (kcal - UMBRALES.densidadCalorica) / 3.5),
        origen: "tabla",
        dato: `${Math.round(kcal)} kcal / ${unidad}`,
        motivo: "Mucha energía en poco volumen. Facilita comer de más antes de que aparezca la señal de saciedad.",
        evidencia: "media"
      });
    }
  }
  if (ing.refinadoPrimero) {
    out.push({
      id: "refinado_primero",
      nombre: "Harina refinada como ingrediente principal",
      categoria: "ingrediente",
      peso: 42,
      origen: "ingredientes",
      dato: "primer ingrediente de la lista",
      motivo: "Sin salvado ni germen: pierde la mayor parte de la fibra, el magnesio y las vitaminas del grupo B, y sube el índice glucémico.",
      evidencia: "alta"
    });
  }
  if (ing.total >= 15) {
    out.push({
      id: "lista_larga",
      nombre: "Lista de ingredientes muy larga",
      categoria: "procesado",
      peso: Math.min(58, 26 + (ing.total - 15) * 2),
      origen: "ingredientes",
      dato: `${ing.total} ingredientes`,
      motivo: "El número de ingredientes es uno de los predictores más simples y fiables del grado de procesamiento industrial.",
      evidencia: "media"
    });
  }
  for (const vig of OTRAS_VIGILADAS) {
    if (out.some((x) => x.nombre === vig.etiqueta)) continue;
    const encontrado = ing.lista.find((i) => i.textoNormalizado.includes(vig.patron));
    if (encontrado) {
      out.push({
        id: `vigilada_${vig.patron.replace(/\s/g, "_")}`,
        nombre: vig.etiqueta,
        categoria: "ingrediente",
        peso: vig.severidad,
        origen: "ingredientes",
        dato: `posición ${encontrado.posicion + 1} de la lista`,
        motivo: vig.motivo,
        evidencia: "media"
      });
    }
  }
  return out.map((p) => ({ ...p, peso: Math.round(Math.max(0, Math.min(100, p.peso))) })).sort((a, b) => b.peso - a.peso);
}

// src/nucleo/favorables.ts
function porUmbral2(valor, umbral, base, exp = 0.75, tope = 95) {
  if (valor <= 0 || umbral <= 0) return 0;
  return Math.min(tope, base * Math.pow(valor / umbral, exp));
}
var r12 = (x) => Math.round(x * 10) / 10;
function construirFavorables(n, ing, categoria, micros = [], esUltraprocesado = false) {
  const out = [];
  const unidad = categoria === "bebida" ? "100 ml" : "100 g";
  const hayIngredientes = ing.total > 0;
  if (hay(n.fibra_g) && n.fibra_g.valor >= 1.5) {
    const fibra = n.fibra_g.valor;
    out.push({
      id: "fibra",
      nombre: fibra >= 6 ? "Alto contenido en fibra" : "Fibra",
      categoria: "nutriente",
      peso: porUmbral2(fibra, 3, 34),
      origen: "tabla",
      dato: `${r12(fibra)} g / ${unidad}`,
      motivo: fibra >= 6 ? 'Supera el umbral legal de "alto contenido en fibra" (6 g/100 g). Alimenta la microbiota, ralentiza la absorción de glucosa y aumenta la saciedad.' : "Ralentiza la absorción de azúcares, mejora el tránsito y alimenta a las bacterias del colon. La ingesta recomendada es de 25-30 g al día y casi nadie llega.",
      evidencia: "alta"
    });
  }
  if (hay(n.proteinas_g) && n.proteinas_g.valor >= 3) {
    const prot = n.proteinas_g.valor;
    const kcal = hay(n.energia_kcal) ? n.energia_kcal.valor : 0;
    const pctEnergia = kcal > 0 ? prot * 4 / kcal * 100 : 0;
    out.push({
      id: "proteina",
      nombre: pctEnergia >= 20 ? "Alto contenido en proteínas" : "Proteínas",
      categoria: "nutriente",
      peso: porUmbral2(prot, 6, 34),
      origen: "tabla",
      dato: `${r12(prot)} g / ${unidad}${pctEnergia > 0 ? ` (${Math.round(pctEnergia)} % de la energía)` : ""}`,
      motivo: "Mantiene la masa muscular, es el macronutriente más saciante y el que tiene mayor gasto térmico en la digestión.",
      evidencia: "alta"
    });
  }
  if (hay(n.fvl_porcentaje) && n.fvl_porcentaje.valor >= 40) {
    const fvl = n.fvl_porcentaje.valor;
    out.push({
      id: "fvl",
      nombre: "Alto porcentaje de fruta, verdura o legumbre",
      categoria: "ingrediente",
      peso: Math.min(95, fvl),
      origen: "ambos",
      dato: `${Math.round(fvl)} % del producto`,
      motivo: "La base de cualquier patrón alimentario asociado a menor mortalidad. Aporta fibra, potasio y fitoquímicos en su matriz original.",
      evidencia: "alta"
    });
  }
  if (hay(n.monoinsaturadas_g) && n.monoinsaturadas_g.valor >= 3) {
    const mono = n.monoinsaturadas_g.valor;
    out.push({
      id: "monoinsaturadas",
      nombre: "Grasas monoinsaturadas",
      categoria: "nutriente",
      peso: porUmbral2(mono, 10, 40),
      origen: "tabla",
      dato: `${r12(mono)} g / ${unidad}`,
      motivo: "El ácido oleico mejora el perfil lipídico cuando sustituye a la grasa saturada. Es el eje de la dieta mediterránea.",
      evidencia: "alta"
    });
  }
  if (hay(n.poliinsaturadas_g) && n.poliinsaturadas_g.valor >= 2) {
    const poli = n.poliinsaturadas_g.valor;
    out.push({
      id: "poliinsaturadas",
      nombre: "Grasas poliinsaturadas",
      categoria: "nutriente",
      peso: porUmbral2(poli, 8, 32),
      origen: "tabla",
      dato: `${r12(poli)} g / ${unidad}`,
      motivo: "Incluyen los ácidos grasos esenciales que el cuerpo no sabe fabricar. Su valor depende del equilibrio entre omega-6 y omega-3.",
      evidencia: "media"
    });
  }
  for (const real of ing.reales) {
    let peso = real.peso * 17;
    if (real.posicion < 3) peso += 16;
    if (real.porcentaje) peso += Math.min(20, real.porcentaje / 5);
    out.push({
      id: `real_${real.etiqueta.toLowerCase().replace(/\s/g, "_")}`,
      nombre: real.etiqueta,
      categoria: "ingrediente",
      peso: Math.min(94, peso),
      origen: "ingredientes",
      dato: real.porcentaje ? `${real.porcentaje} %, posición ${real.posicion + 1}` : `posición ${real.posicion + 1} de la lista`,
      motivo: real.motivo,
      evidencia: "alta"
    });
  }
  for (const micro of micros) {
    const ref = VRN[micro.clave];
    if (!ref) continue;
    let cantidad = micro.cantidad;
    if (micro.unidad === "g") cantidad *= 1e3;
    if (micro.unidad === "ug" && ref.unidad === "mg") cantidad /= 1e3;
    if (micro.unidad === "mg" && ref.unidad === "ug") cantidad *= 1e3;
    const pct = cantidad / ref.cantidad * 100;
    if (pct < 15) continue;
    const factor = esUltraprocesado ? 0.5 : 1;
    out.push({
      id: `micro_${micro.clave}`,
      nombre: ref.nombre + (esUltraprocesado ? " (añadido)" : ""),
      categoria: "micronutriente",
      peso: Math.min(88, pct * 1.1) * factor,
      origen: "tabla",
      dato: `${Math.round(pct)} % del VRN por ${unidad}`,
      motivo: esUltraprocesado ? "Vitamina o mineral añadido en fábrica. Cuenta, pero no convierte un ultraprocesado en un alimento nutritivo: fuera de su matriz natural se absorbe peor." : pct >= 30 ? 'Supera el 30 % del valor de referencia: legalmente es un "alto contenido en".' : 'Supera el 15 % del valor de referencia: legalmente es "fuente de".',
      evidencia: "alta"
    });
  }
  if (hayIngredientes) {
    const conRiesgo = new Set(ing.aditivos.filter((a) => a.aditivo.riesgo > 0).map((a) => a.aditivo.codigo));
    if (ing.aditivos.length === 0) {
      out.push({
        id: "sin_aditivos",
        nombre: "Sin aditivos",
        categoria: "ausencia",
        peso: 74,
        origen: "ingredientes",
        dato: "ningún aditivo declarado",
        motivo: "Ni colorantes, ni conservantes, ni emulgentes. Comida que se sostiene sola.",
        evidencia: "alta"
      });
    } else if (conRiesgo.size === 0) {
      out.push({
        id: "aditivos_inocuos",
        nombre: "Aditivos sin riesgo conocido",
        categoria: "ausencia",
        peso: 48,
        origen: "ingredientes",
        dato: `${ing.aditivos.length} aditivo(s), todos de riesgo 0`,
        motivo: "Lleva aditivos, pero todos son sustancias sin señales de daño a dosis alimentarias.",
        evidencia: "media"
      });
    }
    if (ing.fuentesAzucar.length === 0 && hay(n.azucares_g) && n.azucares_g.valor < 5) {
      out.push({
        id: "sin_azucar_anadido",
        nombre: "Sin azúcares añadidos",
        categoria: "ausencia",
        peso: 70,
        origen: "ambos",
        dato: `${r12(n.azucares_g.valor)} g / ${unidad}, todos intrínsecos`,
        motivo: "El azúcar libre es el nutriente con recomendación de reducción más clara y unánime de todas las guías alimentarias.",
        evidencia: "alta"
      });
    }
    if (ing.total <= 5) {
      out.push({
        id: "lista_corta",
        nombre: "Lista de ingredientes corta",
        categoria: "ausencia",
        peso: 40 + (6 - ing.total) * 6,
        origen: "ingredientes",
        dato: `${ing.total} ingrediente(s)`,
        motivo: "Cuanto más corta es la lista, más cerca está el producto de ser comida y menos de ser una formulación.",
        evidencia: "media"
      });
    }
  }
  if (hay(n.sal_g)) {
    const sal = n.sal_g.valor;
    if (sal === 0) {
      out.push({
        id: "sin_sal",
        nombre: "Sin sal añadida",
        categoria: "ausencia",
        peso: 62,
        origen: "tabla",
        dato: "0 g",
        motivo: "Nada que sumar al límite diario de 5 g de la OMS.",
        evidencia: "alta"
      });
    } else if (sal < 0.3) {
      out.push({
        id: "bajo_en_sal",
        nombre: "Bajo en sal",
        categoria: "ausencia",
        peso: 56,
        origen: "tabla",
        dato: `${r12(sal)} g / ${unidad}`,
        motivo: 'Por debajo de 0,3 g/100 g la UE permite declararlo "bajo contenido en sal".',
        evidencia: "alta"
      });
    }
  }
  return out.map((b) => ({ ...b, peso: Math.round(Math.max(0, Math.min(100, b.peso))) })).sort((a, b) => b.peso - a.peso);
}

// src/nucleo/puntuacion.ts
var ETIQUETAS_SEMAFORO = {
  rojo: "Consumo ocasional",
  naranja: "Con moderación",
  amarillo: "Aceptable, hay mejores",
  verde_claro: "Buena elección habitual",
  verde_parchis: "Especialmente favorable"
};
var COLORES_SEMAFORO = {
  rojo: "#D93B34",
  naranja: "#E4771D",
  amarillo: "#E8B617",
  verde_claro: "#78B341",
  verde_parchis: "#17A05A"
};
function semaforoDesde(p) {
  let out = "rojo";
  for (const n of NIVELES) if (p >= n.desde) out = n.clave;
  return out;
}
function calcularPuntuacion(n, ing, nova, ns, categoria) {
  const hayIngredientes = ing.total > 0;
  const unicos = /* @__PURE__ */ new Map();
  for (const { aditivo } of ing.aditivos) unicos.set(aditivo.codigo, aditivo.riesgo);
  let castigo = 0;
  for (const riesgo of unicos.values()) castigo += CASTIGO_ADITIVO[riesgo];
  const notaAditivos = hayIngredientes ? Math.max(0, 100 - castigo) : null;
  let notaIngredientes = null;
  if (hayIngredientes) {
    let v2 = 55;
    v2 += Math.min(45, ing.reales.reduce((s, r) => s + r.peso * 5, 0));
    if (ing.azucarEnPrimeras) v2 -= 18;
    if (ing.fuentesAzucar.length >= 2) v2 -= 12;
    if (ing.refinadoPrimero) v2 -= 12;
    for (const g of ing.grasas) v2 += g.perfil.valor < 0 ? g.perfil.valor * 6 : g.perfil.valor * 4;
    notaIngredientes = Math.max(0, Math.min(100, v2));
  }
  const brutos = [
    { clave: "nutriScore", nombre: "Composición nutricional", nota: notaDesdeLetra(ns.letra), peso: PESOS.nutriScore },
    { clave: "nova", nombre: "Grado de procesamiento", nota: notaNova(nova.grupo), peso: PESOS.nova },
    { clave: "aditivos", nombre: "Aditivos", nota: notaAditivos, peso: PESOS.aditivos },
    { clave: "ingredientes", nombre: "Calidad de la lista", nota: notaIngredientes, peso: PESOS.ingredientes }
  ];
  const usables = brutos.filter((c) => c.nota !== null);
  const pesoDisponible = usables.reduce((s, c) => s + c.peso, 0);
  const componentes = brutos.map((c) => ({
    clave: c.clave,
    nombre: c.nombre,
    nota: c.nota,
    pesoOriginal: c.peso,
    pesoAplicado: c.nota === null || pesoDisponible === 0 ? 0 : c.peso / pesoDisponible
  }));
  if (usables.length === 0 || pesoDisponible === 0) {
    return { puntuacion: null, semaforo: null, vetos: [], componentes };
  }
  let puntuacion = componentes.reduce((s, c) => s + (c.nota ?? 0) * c.pesoAplicado, 0);
  const vetos = [];
  const tope = (limite, razon) => {
    if (puntuacion > limite) puntuacion = limite;
    vetos.push(razon);
  };
  const trans = hay(n.trans_g) && n.trans_g.valor > 0.5;
  if (ing.grasas.some((g) => g.perfil.patron.includes("hidrogenad")) || trans) {
    tope(VETOS.trans, "Contiene grasas trans industriales: la OMS no reconoce ninguna dosis segura.");
  }
  if ([...unicos.values()].some((r) => r === 3)) {
    tope(VETOS.aditivoNivel3, 'Contiene al menos un aditivo de la categoría "evitar".');
  }
  if (hay(n.sal_g) && n.sal_g.valor > VETOS.salAlta.desde) {
    tope(VETOS.salAlta.tope, `Aporta ${n.sal_g.valor.toFixed(1)} g de sal por 100 g: la mitad del límite diario en una sola toma.`);
  }
  if (ing.fuentesAzucar.length > 0 && hay(n.azucares_g)) {
    const az = n.azucares_g.valor;
    const esBebida = categoria === "bebida";
    if (esBebida && az > VETOS.bebidaAzucarada.desde) {
      tope(VETOS.bebidaAzucarada.tope, "Bebida azucarada: el azúcar líquido no sacia y se absorbe de golpe.");
    } else if (!esBebida && az > VETOS.azucarMuyAlto.desde) {
      tope(VETOS.azucarMuyAlto.tope, `Casi la mitad del producto es azúcar añadido (${az} g / 100 g).`);
    } else if (!esBebida && az > VETOS.azucarAlto.desde) {
      tope(VETOS.azucarAlto.tope, "Más de 30 g de azúcar añadido por 100 g.");
    }
  }
  if (nova.grupo === 4) {
    tope(VETOS.ultraprocesado, "Ultraprocesado: ningún NOVA 4 entra en la categoría verde parchís.");
    if (ing.fuentesAzucar.length > 0 && hay(n.azucares_g) && n.azucares_g.valor > VETOS.ultraprocesadoAzucarado.desde) {
      tope(
        VETOS.ultraprocesadoAzucarado.tope,
        `Ultraprocesado con ${n.azucares_g.valor} g de azúcar añadido por 100 g: ni la fibra ni la proteína lo compensan.`
      );
    }
  }
  if (categoria === "grasa_anadida" && nova.grupo !== null && nova.grupo <= 2 && hay(n.grasas_g) && n.grasas_g.valor > 0 && hay(n.saturadas_g) && hay(n.monoinsaturadas_g)) {
    const ratioSat = n.saturadas_g.valor / n.grasas_g.valor;
    if (ratioSat < 0.22 && n.monoinsaturadas_g.valor >= 50 && unicos.size === 0 && puntuacion < SUELOS.grasaBuena) {
      puntuacion = SUELOS.grasaBuena;
      vetos.push("Grasa mínimamente procesada con perfil de ácidos grasos favorable: se le aplica una nota mínima alta.");
    }
  }
  if (nova.grupo === 1 && unicos.size === 0 && hay(n.sal_g) && n.sal_g.valor < 0.3 && hay(n.azucares_g) && n.azucares_g.valor < 12 && puntuacion < SUELOS.minimamenteProcesado) {
    puntuacion = SUELOS.minimamenteProcesado;
    vetos.push("Alimento mínimamente procesado sin aditivos: se le aplica una nota mínima.");
  }
  puntuacion = Math.round(Math.max(0, Math.min(100, puntuacion)));
  return { puntuacion, semaforo: semaforoDesde(puntuacion), vetos, componentes };
}

// src/nucleo/validador.ts
var NOMBRE = {
  energia_kcal: "energía",
  energia_kj: "energía en kJ",
  grasas_g: "grasas",
  saturadas_g: "grasas saturadas",
  monoinsaturadas_g: "monoinsaturadas",
  poliinsaturadas_g: "poliinsaturadas",
  trans_g: "grasas trans",
  hidratos_g: "hidratos de carbono",
  azucares_g: "azúcares",
  polialcoholes_g: "polialcoholes",
  fibra_g: "fibra",
  proteinas_g: "proteínas",
  sal_g: "sal",
  sodio_mg: "sodio",
  fvl_porcentaje: "porcentaje de fruta y verdura"
};
var EN_GRAMOS = [
  "grasas_g",
  "saturadas_g",
  "monoinsaturadas_g",
  "poliinsaturadas_g",
  "trans_g",
  "hidratos_g",
  "azucares_g",
  "polialcoholes_g",
  "fibra_g",
  "proteinas_g",
  "sal_g"
];
var v = (d) => d.valor;
var r13 = (x) => Math.round(x * 10) / 10;
var r2 = (x) => Math.abs(x) < 10 ? Math.round(x * 100) / 100 : Math.round(x * 10) / 10;
var May = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function validar(n, esProductoSalado = false) {
  const inc = [];
  for (const campo of Object.keys(n)) {
    const d = n[campo];
    if (hay(d) && v(d) < 0) {
      inc.push({
        codigo: "negativo",
        gravedad: "error",
        campos: [campo],
        mensaje: `El valor de ${NOMBRE[campo] ?? campo} es negativo (${v(d)}). Eso no existe en una etiqueta.`
      });
    }
  }
  for (const campo of EN_GRAMOS) {
    const d = n[campo];
    if (!hay(d) || v(d) <= 100) continue;
    const enMiligramos = v(d) / 1e3;
    inc.push({
      codigo: "mayor_que_cien",
      gravedad: "error",
      campos: [campo],
      mensaje: `${May(NOMBRE[campo] ?? campo)} marca ${v(d)} g por 100 g. Es imposible: no caben más de 100 gramos en 100 gramos.`,
      correccion: enMiligramos <= 100 ? {
        campo,
        valorActual: v(d),
        valorPropuesto: r2(enMiligramos),
        motivo: "La cifra encaja si estaba en miligramos y se leyó como gramos."
      } : void 0
    });
  }
  if (hay(n.azucares_g) && hay(n.hidratos_g) && v(n.azucares_g) > v(n.hidratos_g) + 0.15) {
    inc.push({
      codigo: "azucar_mayor_hidratos",
      gravedad: "error",
      campos: ["azucares_g", "hidratos_g"],
      mensaje: `Los azúcares (${r13(v(n.azucares_g))} g) superan a los hidratos de carbono (${r13(v(n.hidratos_g))} g). En la etiqueta los azúcares van dentro de los hidratos, así que uno de los dos está mal leído.`
    });
  }
  if (hay(n.saturadas_g) && hay(n.grasas_g) && v(n.saturadas_g) > v(n.grasas_g) + 0.15) {
    inc.push({
      codigo: "saturada_mayor_grasa",
      gravedad: "error",
      campos: ["saturadas_g", "grasas_g"],
      mensaje: `La grasa saturada (${r13(v(n.saturadas_g))} g) supera a la grasa total (${r13(v(n.grasas_g))} g). Una es parte de la otra, así que hay un error de lectura.`
    });
  }
  const suma = ["grasas_g", "hidratos_g", "proteinas_g", "fibra_g", "polialcoholes_g", "sal_g"].reduce((s, k) => s + (hay(n[k]) ? v(n[k]) : 0), 0);
  if (suma > 100.5) {
    inc.push({
      codigo: "suma_mayor_cien",
      gravedad: "error",
      campos: ["grasas_g", "hidratos_g", "proteinas_g"],
      mensaje: `Grasas, hidratos, proteínas, fibra y sal suman ${r13(suma)} g por cada 100 g de producto. Algún valor está mal leído.`
    });
  }
  if (hay(n.energia_kcal)) {
    const kcalCalc = (hay(n.grasas_g) ? v(n.grasas_g) * 9 : 0) + (hay(n.hidratos_g) ? v(n.hidratos_g) * 4 : 0) + (hay(n.proteinas_g) ? v(n.proteinas_g) * 4 : 0) + (hay(n.fibra_g) ? v(n.fibra_g) * 2 : 0) + (hay(n.polialcoholes_g) ? v(n.polialcoholes_g) * 2.4 : 0);
    const declarada = v(n.energia_kcal);
    if (kcalCalc >= 20) {
      const desvio = Math.abs(declarada - kcalCalc) / kcalCalc;
      if (desvio > 0.2) {
        const pareceKj = Math.abs(declarada / 4.184 - kcalCalc) / kcalCalc < 0.2;
        inc.push({
          codigo: "energia_incoherente",
          gravedad: pareceKj ? "error" : "aviso",
          campos: ["energia_kcal"],
          mensaje: pareceKj ? `La energía marca ${Math.round(declarada)} kcal, pero por sus nutrientes deberían ser unas ${Math.round(kcalCalc)} kcal. La cifra encaja si se leyó la columna de kilojulios.` : `La energía declarada (${Math.round(declarada)} kcal) se desvía un ${Math.round(desvio * 100)} % de la que sale de sus nutrientes (${Math.round(kcalCalc)} kcal). Merece un vistazo.`,
          correccion: pareceKj ? {
            campo: "energia_kcal",
            valorActual: declarada,
            valorPropuesto: Math.round(declarada / 4.184),
            motivo: "Un kilojulio equivale a 0,239 kilocalorías. La cifra cuadra al convertirla."
          } : void 0
        });
      }
    } else if (declarada > 50 && suma < 5) {
      inc.push({
        codigo: "energia_sin_nutrientes",
        gravedad: "error",
        campos: ["energia_kcal"],
        mensaje: `Marca ${Math.round(declarada)} kcal pero apenas hay nutrientes que las expliquen. Puede que se haya leído la columna "por ración" mezclada con la de "por 100 g".`
      });
    }
  }
  if (hay(n.sal_g) && hay(n.sodio_mg)) {
    const salDesdeSodio = v(n.sodio_mg) * 2.5 / 1e3;
    if (salDesdeSodio > 0.01) {
      const desvio = Math.abs(v(n.sal_g) - salDesdeSodio) / salDesdeSodio;
      if (desvio > 0.15) {
        inc.push({
          codigo: "sal_sodio_descuadran",
          gravedad: "aviso",
          campos: ["sal_g", "sodio_mg"],
          mensaje: `La sal declarada (${r13(v(n.sal_g))} g) no cuadra con el sodio (${Math.round(v(n.sodio_mg))} mg, que equivalen a ${r13(salDesdeSodio)} g de sal). Confundir sodio con sal multiplica el error por 2,5.`,
          correccion: {
            campo: "sal_g",
            valorActual: v(n.sal_g),
            valorPropuesto: r2(salDesdeSodio),
            motivo: "Sal igual a sodio por 2,5, según el Reglamento (UE) 1169/2011."
          }
        });
      }
    }
  }
  if (hay(n.sal_g) && !esProductoSalado && v(n.sal_g) > 6 && v(n.sal_g) <= 100) {
    const grave = v(n.sal_g) > 12;
    inc.push({
      codigo: "sal_disparatada",
      gravedad: grave ? "error" : "aviso",
      campos: ["sal_g"],
      mensaje: grave ? `${r13(v(n.sal_g))} g de sal por 100 g es una barbaridad para cualquier producto que no sea sal o un caldo concentrado.` : `${r13(v(n.sal_g))} g de sal por 100 g es muchísimo: son ${Math.round(v(n.sal_g) / 5 * 100)} % del límite diario de la OMS en cien gramos. Comprueba que la cifra sea esa.`,
      correccion: {
        campo: "sal_g",
        valorActual: v(n.sal_g),
        valorPropuesto: v(n.sal_g) > 100 ? r2(v(n.sal_g) / 1e3) : r2(v(n.sal_g) / 10),
        motivo: "Suele venir de una coma decimal que se ha perdido al leer."
      }
    });
  }
  if (hay(n.saturadas_g) && !hay(n.grasas_g)) {
    inc.push({
      codigo: "saturada_sin_grasa",
      gravedad: "aviso",
      campos: ["grasas_g"],
      mensaje: "Se ha leído la grasa saturada pero no la grasa total. En la etiqueta la saturada va justo debajo, así que probablemente se saltó una línea."
    });
  }
  if (hay(n.azucares_g) && !hay(n.hidratos_g)) {
    inc.push({
      codigo: "azucar_sin_hidratos",
      gravedad: "aviso",
      campos: ["hidratos_g"],
      mensaje: "Se han leído los azúcares pero no los hidratos de carbono. En la etiqueta los azúcares van justo debajo, así que probablemente se saltó una línea."
    });
  }
  if (hay(n.fvl_porcentaje) && (v(n.fvl_porcentaje) < 0 || v(n.fvl_porcentaje) > 100)) {
    inc.push({
      codigo: "porcentaje_imposible",
      gravedad: "error",
      campos: ["fvl_porcentaje"],
      mensaje: `El porcentaje de fruta y verdura marca ${v(n.fvl_porcentaje)} %, y un porcentaje va de 0 a 100.`
    });
  }
  const errores = inc.filter((i) => i.gravedad === "error").length;
  const avisos = inc.filter((i) => i.gravedad === "aviso").length;
  const indiceCoherencia = Math.max(0, 1 - errores * 0.28 - avisos * 0.08);
  return { incidencias: inc, errores, avisos, coherente: errores === 0, indiceCoherencia };
}
function menorQueMalLeido(valor, campo) {
  const texto = String(valor);
  if (!/^[23]\d*[.,]?\d*$/.test(texto)) return void 0;
  const sinPrimera = parseFloat(texto.slice(1).replace(",", "."));
  if (!Number.isFinite(sinPrimera) || sinPrimera >= 1 || sinPrimera <= 0) return void 0;
  return {
    campo,
    valorActual: valor,
    valorPropuesto: sinPrimera,
    motivo: 'Muchas etiquetas ponen "menos de 0,5" con el símbolo «<», y el lector lo confunde con un 2. La cifra encaja si era «<' + sinPrimera.toString().replace(".", ",") + "»."
  };
}
function validarContraIngredientes(n, ctx) {
  const inc = [];
  if (ctx.total === 0) return inc;
  if (hay(n.azucares_g) && v(n.azucares_g) > 5 && !ctx.hayFuenteAzucar && !ctx.hayLacteo && !ctx.hayFruta) {
    inc.push({
      codigo: "azucar_sin_origen",
      gravedad: "aviso",
      campos: ["azucares_g"],
      mensaje: `La tabla declara ${r13(v(n.azucares_g))} g de azúcares, pero en la lista de ingredientes no hay nada de donde puedan salir: ni azúcar añadido, ni fruta, ni lácteo. Una de las dos cifras está mal leída.`,
      correccion: menorQueMalLeido(v(n.azucares_g), "azucares_g")
    });
  }
  if (hay(n.grasas_g) && v(n.grasas_g) > 15 && !ctx.hayGrasaAnadida) {
    inc.push({
      codigo: "grasa_sin_origen",
      gravedad: "aviso",
      campos: ["grasas_g"],
      mensaje: `La tabla declara ${r13(v(n.grasas_g))} g de grasa, pero en los ingredientes no aparece ningún aceite ni grasa. Comprueba la cifra.`
    });
  }
  if (hay(n.sal_g) && v(n.sal_g) > 1.5 && !ctx.haySal) {
    inc.push({
      codigo: "sal_sin_origen",
      gravedad: "aviso",
      campos: ["sal_g"],
      mensaje: `La tabla declara ${r13(v(n.sal_g))} g de sal, pero la sal no figura en la lista de ingredientes. Comprueba la cifra.`
    });
  }
  return inc;
}

// src/nucleo/confianza.ts
var PESOS_CONFIANZA = {
  completitud: 0.45,
  calidadLectura: 0.3,
  coherencia: 0.25
};
var ETIQUETA = {
  alta: "Análisis fiable",
  media: "Análisis orientativo",
  baja: "Confianza baja, conviene revisar los datos",
  insuficiente: "Análisis incompleto"
};
function calcularConfianza(e) {
  const { nutrientes: n } = e;
  const faltan = camposQueFaltan(n);
  const presentes = CAMPOS_OBLIGATORIOS.length - faltan.length;
  const porTabla = presentes / CAMPOS_OBLIGATORIOS.length;
  const completitud = 0.75 * porTabla + 0.25 * (e.hayIngredientes ? 1 : 0);
  const valores = Object.values(n).filter(
    (d) => d.estado === "leido" || d.estado === "corregido"
  );
  let calidadLectura = 1;
  if (valores.length > 0) {
    const suma = valores.reduce((s, d) => {
      if (d.estado === "corregido") return s + 1;
      return s + (typeof d.confianzaOCR === "number" ? d.confianzaOCR : 1);
    }, 0);
    calidadLectura = suma / valores.length;
  }
  const coherencia = Math.max(0, Math.min(1, e.indiceCoherencia));
  const bruto = PESOS_CONFIANZA.completitud * completitud + PESOS_CONFIANZA.calidadLectura * calidadLectura + PESOS_CONFIANZA.coherencia * coherencia;
  let valor = Math.round(bruto * 100);
  let nivel;
  if (faltan.length > 0) {
    nivel = "insuficiente";
    valor = Math.min(valor, 55);
  } else if (e.huboErrores) {
    nivel = "baja";
    valor = Math.min(valor, 55);
  } else if (valor >= 85) nivel = "alta";
  else if (valor >= 60) nivel = "media";
  else nivel = "baja";
  const comoMejorarla = [];
  if (faltan.length > 0) {
    comoMejorarla.push(`Completa estos datos de la tabla: ${faltan.join(", ")}.`);
  }
  if (!e.hayIngredientes) {
    comoMejorarla.push("Fotografía también la lista de ingredientes. Es lo que más sube la fiabilidad del análisis.");
  }
  if (e.huboErrores) {
    comoMejorarla.push("Revisa los datos marcados en rojo: hay cifras que no cuadran entre sí.");
  }
  if (calidadLectura < 0.75 && faltan.length === 0) {
    comoMejorarla.push("La foto se ha leído con dificultad. Repítela con más luz y el envase liso, o pega el texto copiado desde el iPhone.");
  }
  return {
    valor: Math.max(0, Math.min(100, valor)),
    nivel,
    etiqueta: ETIQUETA[nivel],
    completitud: Math.round(completitud * 100),
    calidadLectura: Math.round(calidadLectura * 100),
    coherencia: Math.round(coherencia * 100),
    comoMejorarla
  };
}

// src/datos/fuentes.ts
var F = [
  [
    "ue-1169",
    "Unión Europea",
    "Reglamento (UE) 1169/2011 sobre información alimentaria facilitada al consumidor",
    2011,
    "https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32011R1169",
    "Qué campos son obligatorios en la tabla nutricional, la lista de 14 alérgenos y los valores de referencia de nutrientes."
  ],
  [
    "ue-1333",
    "Unión Europea",
    "Reglamento (CE) 1333/2008 sobre aditivos alimentarios",
    2008,
    "https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32008R1333",
    "La numeración E, la función tecnológica de cada aditivo y sus condiciones de uso."
  ],
  [
    "ue-1924",
    "Unión Europea",
    "Reglamento (CE) 1924/2006 sobre declaraciones nutricionales y de propiedades saludables",
    2006,
    "https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32006R1924",
    'Los umbrales legales de "fuente de", "alto contenido en", "bajo en sal" y "sin azúcares añadidos".'
  ],
  [
    "ue-2022-63",
    "Unión Europea",
    "Reglamento (UE) 2022/63: retirada del dióxido de titanio (E171)",
    2022,
    "https://eur-lex.europa.eu/legal-content/ES/TXT/?uri=CELEX:32022R0063",
    "La prohibición del E171 como aditivo alimentario en la Unión Europea."
  ],
  [
    "efsa-aditivos",
    "EFSA",
    "Reevaluación de aditivos alimentarios autorizados antes de 2009",
    2020,
    "https://www.efsa.europa.eu/en/topics/topic/food-additives",
    "Ingestas diarias admisibles y dictámenes de seguridad de cada aditivo."
  ],
  [
    "efsa-cafeina",
    "EFSA",
    "Dictamen científico sobre la seguridad de la cafeína",
    2015,
    "https://www.efsa.europa.eu/en/efsajournal/pub/4102",
    "El límite de 400 mg diarios en adultos y 200 mg en embarazo."
  ],
  [
    "iarc-carne",
    "IARC / OMS",
    "Monografía 114: consumo de carne roja y carne procesada",
    2018,
    "https://publications.iarc.fr/564",
    "La clasificación de la carne procesada como carcinógeno del grupo 1 y el papel de los nitritos."
  ],
  [
    "iarc-aspartamo",
    "IARC / OMS",
    "Monografía 134: aspartamo, metileugenol e isoeugenol",
    2024,
    "https://publications.iarc.fr/636",
    "La clasificación del aspartamo como posiblemente carcinógeno para el ser humano (grupo 2B)."
  ],
  [
    "oms-azucar",
    "OMS",
    "Directriz: ingesta de azúcares para adultos y niños",
    2015,
    "https://www.who.int/publications/i/item/9789241549028",
    "La recomendación de no superar el 10 % de la energía diaria en azúcares libres, y el objetivo del 5 %."
  ],
  [
    "oms-sal",
    "OMS",
    "Directriz: ingesta de sodio en adultos y niños",
    2012,
    "https://www.who.int/publications/i/item/9789241504836",
    "El límite de 5 g de sal al día, equivalente a 2 g de sodio."
  ],
  [
    "oms-trans",
    "OMS",
    "Paquete de medidas REPLACE para eliminar las grasas trans industriales",
    2018,
    "https://www.who.int/teams/nutrition-and-food-safety/replace-trans-fat",
    "Que no existe un nivel seguro de consumo de grasas trans industriales."
  ],
  [
    "nutriscore-2023",
    "Santé publique France",
    "Nutri-Score: algoritmo actualizado para alimentos y bebidas",
    2023,
    "https://www.santepubliquefrance.fr/en/nutri-score",
    "Las tablas de puntos y los cortes de letra del algoritmo que usa este motor."
  ],
  [
    "nova",
    "Universidad de São Paulo · Monteiro y col.",
    "Clasificación NOVA de alimentos según su grado de procesamiento",
    2019,
    "https://www.fao.org/3/ca5644en/ca5644en.pdf",
    "La definición de los cuatro grupos y de qué marca a un ultraprocesado."
  ],
  [
    "fsa-semaforo",
    "Food Standards Agency (Reino Unido)",
    "Guía de etiquetado nutricional frontal por colores",
    2016,
    "https://www.gov.uk/government/publications/front-of-pack-nutrition-labelling-guidance",
    'Los umbrales de "alto contenido" en azúcar, grasa saturada y sal que este motor usa como referencia de dosis.'
  ],
  [
    "efsa-fosforo",
    "EFSA",
    "Reevaluación de los fosfatos como aditivos alimentarios",
    2019,
    "https://www.efsa.europa.eu/en/efsajournal/pub/5674",
    "La ingesta admisible de fosfatos y la advertencia sobre la carga renal del fósforo añadido."
  ],
  [
    "efsa-nitritos",
    "EFSA",
    "Reevaluación de nitritos y nitratos como aditivos alimentarios",
    2017,
    "https://www.efsa.europa.eu/en/efsajournal/pub/4786",
    "La formación de nitrosaminas y los márgenes de exposición."
  ],
  [
    "emulgentes-2021",
    "Gastroenterology · Chassaing y col.",
    "Ensayo controlado sobre carboximetilcelulosa y microbiota intestinal",
    2021,
    "https://pubmed.ncbi.nlm.nih.gov/34774538/",
    "La alteración de la microbiota y de la capa de moco intestinal por emulgentes de uso común."
  ],
  [
    "efsa-azoicos",
    "EFSA",
    "Dictámenes sobre colorantes azoicos y actividad en la infancia",
    2009,
    "https://www.efsa.europa.eu/en/efsajournal/pub/1330",
    "La advertencia obligatoria de que pueden afectar a la actividad y la atención de los niños."
  ]
];
var FUENTES = new Map(
  F.map(([clave2, organismo, documento, anio, url, aporta]) => [
    clave2,
    { clave: clave2, organismo, documento, anio, url, aporta }
  ])
);
function fuentesDe(claves) {
  return claves.map((c) => FUENTES.get(c)).filter((f) => Boolean(f));
}

// src/nucleo/conocimiento.ts
function deAditivo(a) {
  return {
    clave: a.codigo,
    tipo: "aditivo",
    nombre: `${a.codigo} · ${a.nombre}`,
    sinonimos: [a.codigo, a.nombre],
    categoria: a.funcion,
    valoracion: -a.riesgo,
    explicacion: a.motivo,
    evidencia: a.evidencia,
    fuentes: fuentesDe(a.fuentes ?? ["ue-1333"]),
    fichada: a.fichado !== false
  };
}
function construirCatalogo() {
  const out = [];
  for (const a of ADITIVOS.values()) out.push(deAditivo(a));
  for (const al of ALERGENOS) {
    out.push({
      clave: `alergeno_${al.clave}`,
      tipo: "alergeno",
      nombre: al.nombre,
      sinonimos: al.patrones,
      categoria: "alérgeno de declaración obligatoria",
      valoracion: 0,
      explicacion: `${al.nota} Su declaración es obligatoria en la Unión Europea y en la etiqueta va resaltado.`,
      evidencia: "alta",
      fuentes: fuentesDe(["ue-1169"]),
      fichada: true
    });
  }
  for (const az of AZUCARES_ANADIDOS) {
    out.push({
      clave: `azucar_${az.replace(/\s/g, "_")}`,
      tipo: "azucar",
      nombre: az.charAt(0).toUpperCase() + az.slice(1),
      sinonimos: [az],
      categoria: "azúcar añadido",
      valoracion: -2,
      explicacion: "Es azúcar libre, aunque el nombre no lo parezca. Repartir el azúcar en varias formas distintas hace que ninguna suba a los primeros puestos de la lista de ingredientes.",
      evidencia: "alta",
      fuentes: fuentesDe(["oms-azucar", "ue-1169"]),
      fichada: true
    });
  }
  for (const g of GRASAS) {
    out.push({
      clave: `grasa_${g.patron.replace(/\s/g, "_")}`,
      tipo: "grasa",
      nombre: g.etiqueta,
      sinonimos: [g.patron],
      categoria: "grasa o aceite",
      valoracion: g.valor,
      explicacion: g.motivo,
      evidencia: "media",
      fuentes: fuentesDe(g.valor <= -3 ? ["oms-trans"] : ["fsa-semaforo"]),
      fichada: true
    });
  }
  for (const i of INGREDIENTES_REALES) {
    out.push({
      clave: `real_${i.patron.replace(/\s/g, "_")}`,
      tipo: "ingrediente",
      nombre: i.etiqueta,
      sinonimos: [i.patron],
      categoria: "ingrediente favorable",
      valoracion: Math.min(3, i.peso),
      explicacion: i.motivo,
      evidencia: "alta",
      fuentes: fuentesDe(["nova"]),
      fichada: true
    });
  }
  for (const [clave2, v2] of Object.entries(VRN)) {
    out.push({
      clave: `nutriente_${clave2}`,
      tipo: "nutriente",
      nombre: v2.nombre,
      sinonimos: [v2.nombre, clave2],
      categoria: "vitamina o mineral",
      valoracion: 2,
      explicacion: `Valor de referencia diario en la Unión Europea: ${v2.cantidad} ${v2.unidad}. Un producto puede llamarse "fuente de" a partir del 15 % y "alto contenido en" a partir del 30 %.`,
      evidencia: "alta",
      fuentes: fuentesDe(["ue-1169", "ue-1924"]),
      fichada: true
    });
  }
  return out;
}
var CATALOGO = construirCatalogo();
function buscar(termino, opts = {}) {
  const t = normalizarTexto(termino);
  const limite = opts.limite ?? 40;
  let base = CATALOGO;
  if (opts.tipos?.length) base = base.filter((f) => opts.tipos.includes(f.tipo));
  if (opts.soloLimitar) base = base.filter((f) => f.valoracion < 0);
  if (opts.soloFavorable) base = base.filter((f) => f.valoracion > 0);
  if (!t) return base.slice(0, limite);
  const puntuadas = base.map((f) => {
    const nombre = normalizarTexto(f.nombre);
    const sinonimos = f.sinonimos.map(normalizarTexto);
    let p = 0;
    if (nombre === t || sinonimos.includes(t)) p = 100;
    else if (nombre.startsWith(t) || sinonimos.some((s) => s.startsWith(t))) p = 70;
    else if (nombre.includes(t) || sinonimos.some((s) => s.includes(t))) p = 40;
    else if (normalizarTexto(f.explicacion).includes(t)) p = 10;
    return { f, p };
  }).filter((x) => x.p > 0).sort((a, b) => b.p - a.p || Math.abs(b.f.valoracion) - Math.abs(a.f.valoracion));
  return puntuadas.slice(0, limite).map((x) => x.f);
}
function ficha(clave2) {
  const directa = CATALOGO.find((f) => f.clave === clave2);
  if (directa) return directa;
  if (/^E\d/i.test(clave2)) {
    const a = buscarAditivo(clave2.toUpperCase());
    if (a) return deAditivo(a);
  }
  return void 0;
}
function resumenCatalogo() {
  const out = { aditivo: 0, alergeno: 0, nutriente: 0, ingrediente: 0, azucar: 0, grasa: 0 };
  for (const f of CATALOGO) out[f.tipo]++;
  return out;
}

// src/index.ts
function analizarProducto(p, ahora = /* @__PURE__ */ new Date()) {
  const categoria = p.categoria ?? "general";
  const n = normalizarNutrientes(p.nutrientes);
  const ing = analizarIngredientes(p.ingredientes ?? []);
  const nova = clasificarNova(ing);
  const primero = ing.lista[0]?.textoNormalizado ?? "";
  const esProductoSalado = /^(sal|sal marina|sal yodada|cloruro sodico)\b/.test(primero) || ing.lista.some((i) => /\b(caldo|pastilla de caldo|cubito|concentrado de carne|sazonador|salsa de soja)\b/.test(i.textoNormalizado));
  const validacion = validar(n, esProductoSalado);
  validacion.incidencias.push(...validarContraIngredientes(n, {
    total: ing.total,
    hayFuenteAzucar: ing.fuentesAzucar.length > 0,
    hayLacteo: ing.lista.some((i) => /\b(leche|lacteo|yogur|nata|suero|queso|lactosa)\b/.test(i.textoNormalizado)),
    hayFruta: ing.lista.some((i) => /\b(fruta|zumo|pure|manzana|platano|naranja|fresa|melocoton|pera|uva)\b/.test(i.textoNormalizado)),
    hayGrasaAnadida: ing.grasas.length > 0,
    haySal: ing.salPresente
  }));
  validacion.errores = validacion.incidencias.filter((i) => i.gravedad === "error").length;
  validacion.avisos = validacion.incidencias.filter((i) => i.gravedad === "aviso").length;
  validacion.coherente = validacion.errores === 0;
  validacion.indiceCoherencia = Math.max(0, 1 - validacion.errores * 0.28 - validacion.avisos * 0.08);
  const contieneEdulcorante = ing.aditivos.some((a) => a.aditivo.funcion === "edulcorante");
  const ns = calcularNutriScore(n, { categoria, esAgua: p.es_agua, contieneEdulcorante });
  const limitar = construirLimitar(n, ing, nova, categoria);
  const favorables = construirFavorables(n, ing, categoria, p.micronutrientes, nova.grupo === 4);
  const { puntuacion, semaforo, vetos, componentes } = calcularPuntuacion(n, ing, nova, ns, categoria);
  const faltanObligatorios = camposQueFaltan(n);
  const faltanVoluntarios = voluntariosQueFaltan(n);
  const sinIngredientes = ing.total === 0;
  const datosFaltantes = [...faltanObligatorios];
  if (sinIngredientes) datosFaltantes.push("Lista de ingredientes");
  const analisisCompleto = faltanObligatorios.length === 0 && !sinIngredientes;
  const avisosDeDatos = [];
  const hayAlgunComponente = componentes.some((c) => c.nota !== null);
  if (faltanObligatorios.length > 0) {
    avisosDeDatos.push(
      hayAlgunComponente ? `Faltan datos obligatorios de la etiqueta (${faltanObligatorios.join(", ")}). No se calcula el Nutri-Score y la nota se apoya solo en el resto.` : `Faltan datos obligatorios de la etiqueta (${faltanObligatorios.join(", ")}). Sin ellos no se puede dar ninguna nota.`
    );
  }
  if (sinIngredientes) {
    avisosDeDatos.push("Sin la lista de ingredientes no se puede saber si el azúcar es añadido, ni detectar aditivos, ni valorar el grado de procesamiento.");
  }
  if (faltanVoluntarios.includes("Fibra")) {
    avisosDeDatos.push("La etiqueta no declara fibra. Es voluntario en la UE, así que el producto podría tener más de la que se le reconoce aquí.");
  }
  if (faltanVoluntarios.includes("Porcentaje de fruta, verdura y legumbre") && categoria !== "grasa_anadida") {
    avisosDeDatos.push("No consta el porcentaje de fruta, verdura o legumbre. Si el producto lleva bastante, su nota real podría ser mejor.");
  }
  const confianza = calcularConfianza({
    nutrientes: n,
    hayIngredientes: !sinIngredientes,
    indiceCoherencia: validacion.indiceCoherencia,
    huboErrores: validacion.errores > 0
  });
  if (validacion.errores > 0) {
    avisosDeDatos.push(
      `Hay ${validacion.errores} dato(s) que no cuadran entre sí. La nota se ha calculado igualmente, pero conviene revisarlos antes de fiarse.`
    );
  }
  const porQue = redactarPorQue(limitar, favorables, puntuacion, analisisCompleto);
  let porRacion;
  if (p.racion_declarada_g && p.racion_declarada_g > 0) {
    const f = p.racion_declarada_g / 100;
    const kcal = hay(n.energia_kcal) ? Math.round(n.energia_kcal.valor * f) : null;
    const az = hay(n.azucares_g) ? Math.round(n.azucares_g.valor * f * 10) / 10 : null;
    const sat = hay(n.saturadas_g) ? Math.round(n.saturadas_g.valor * f * 10) / 10 : null;
    const sal = hay(n.sal_g) ? Math.round(n.sal_g.valor * f * 100) / 100 : null;
    porRacion = {
      gramos: p.racion_declarada_g,
      kcal,
      azucares_g: az,
      saturadas_g: sat,
      sal_g: sal,
      pctSalOMS: sal === null ? null : Math.round(sal / LIMITES_DIARIOS.salOMS * 100),
      pctAzucarOMS: az === null ? null : Math.round(az / LIMITES_DIARIOS.azucarLibreOMS * 100)
    };
  }
  const avisos = [];
  if (porRacion && p.racion_declarada_g < 35 && categoria !== "grasa_anadida") {
    avisos.push(`La ración declarada es de solo ${p.racion_declarada_g} g. Comprueba si es lo que comes de verdad: las raciones pequeñas maquillan las cifras del frontal del envase.`);
  }
  if (porRacion?.pctAzucarOMS != null && porRacion.pctAzucarOMS >= 50) {
    avisos.push(`Una sola ración cubre el ${porRacion.pctAzucarOMS} % del azúcar libre recomendado para todo el día.`);
  }
  if (porRacion?.pctSalOMS != null && porRacion.pctSalOMS >= 30) {
    avisos.push(`Una sola ración cubre el ${porRacion.pctSalOMS} % de la sal recomendada para todo el día.`);
  }
  if (ing.aditivosSinFicha.length > 0) {
    avisos.push(`No tenemos ficha de ${ing.aditivosSinFicha.join(", ")}. Se han identificado por su familia y pesan poco en la nota, pero conviene mirarlos aparte.`);
  }
  if (ing.alergenos.length > 0) {
    avisos.push(`Alérgenos detectados: ${ing.alergenos.map((a) => a.nombre.toLowerCase()).join(", ")}. ${AVISO_ALERGENOS}`);
  }
  if (ing.fuentesAzucar.length >= 2) {
    avisos.push("El azúcar aparece repartido en varias formas distintas. Súmalas mentalmente antes de fiarte del orden de la lista.");
  }
  if (hay(n.polialcoholes_g) && n.polialcoholes_g.valor > 10) {
    avisos.push("Más de 10 g de polialcoholes por 100 g: puede provocar gases y efecto laxante.");
  }
  const sustancias = [];
  for (const { aditivo } of ing.aditivos) {
    if (sustancias.some((s) => s.codigo === aditivo.codigo)) continue;
    sustancias.push({
      codigo: aditivo.codigo,
      nombre: aditivo.nombre,
      tipo: aditivo.riesgo > 0 ? "limitar" : "favorable",
      riesgo: aditivo.riesgo
    });
  }
  for (const f of limitar) {
    if (f.categoria === "aditivo") continue;
    sustancias.push({ codigo: f.id, nombre: f.nombre, tipo: "limitar" });
  }
  for (const f of favorables) {
    sustancias.push({ codigo: f.id, nombre: f.nombre, tipo: "favorable" });
  }
  return {
    nombre: p.nombre ?? "Producto sin nombre",
    marca: p.marca,
    categoria,
    versionAlgoritmo: VERSION_ALGORITMO,
    fechaAnalisis: ahora.toISOString(),
    puntuacion,
    semaforo,
    etiquetaSemaforo: semaforo ? ETIQUETAS_SEMAFORO[semaforo] : "Análisis incompleto",
    porQue,
    analisisCompleto,
    datosFaltantes,
    avisosDeDatos,
    confianza,
    incidencias: validacion.incidencias,
    datosCoherentes: validacion.coherente,
    componentes,
    nutriScore: ns,
    nova,
    limitar,
    favorables,
    alergenos: ing.alergenos,
    avisoAlergenos: AVISO_ALERGENOS,
    vetos,
    porRacion,
    avisos,
    sustancias
  };
}
function redactarPorQue(limitar, favorables, puntuacion, completo) {
  if (puntuacion === null) {
    return "No hay datos suficientes para dar una nota. Completa la etiqueta y vuelve a analizarlo.";
  }
  const malos = limitar.filter((f) => f.peso >= 45).slice(0, 3).map((f) => f.nombre.toLowerCase());
  const buenos = favorables.filter((f) => f.peso >= 45).slice(0, 2).map((f) => f.nombre.toLowerCase());
  let txt = "";
  if (malos.length) txt += `Lo que más pesa en contra: ${malos.join(", ")}.`;
  else txt += "No se ha detectado ningún factor de peso que convenga limitar.";
  if (buenos.length) txt += ` A favor: ${buenos.join(" y ")}.`;
  if (!completo) txt += " Ojo: el análisis está incompleto y la nota puede cambiar al completar los datos.";
  return txt;
}

// src/almacen/modelo.ts
function nuevoId(prefijo = "p") {
  const azar = Math.random().toString(36).slice(2, 10);
  return `${prefijo}_${Date.now().toString(36)}_${azar}`;
}
function clave(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
var SEMAFOROS = ["rojo", "naranja", "amarillo", "verde_claro", "verde_parchis"];
function filtrarYOrdenar(lista, f = {}) {
  let out = lista;
  if (f.texto) {
    const t = clave(f.texto);
    out = out.filter((p) => clave(`${p.nombre} ${p.marca ?? ""}`).includes(t));
  }
  if (f.semaforo?.length) out = out.filter((p) => p.semaforo !== null && f.semaforo.includes(p.semaforo));
  if (f.categoria?.length) out = out.filter((p) => f.categoria.includes(p.categoria));
  if (f.soloFavoritos) out = out.filter((p) => p.favorito === true);
  if (f.desde) out = out.filter((p) => p.fechaAnalisis >= f.desde);
  if (f.hasta) out = out.filter((p) => p.fechaAnalisis <= f.hasta);
  const sinNota = (p) => p.puntuacion === null ? -1 : p.puntuacion;
  const orden = f.orden ?? "fecha_desc";
  out = [...out].sort((a, b) => {
    switch (orden) {
      case "fecha_asc":
        return a.fechaAnalisis.localeCompare(b.fechaAnalisis);
      case "nota_desc":
        return sinNota(b) - sinNota(a);
      case "nota_asc":
        return sinNota(a) - sinNota(b);
      case "nombre":
        return a.nombre.localeCompare(b.nombre, "es");
      default:
        return b.fechaAnalisis.localeCompare(a.fechaAnalisis);
    }
  });
  return f.limite ? out.slice(0, f.limite) : out;
}
function contarSustancias(lista, tipo) {
  const mapa = /* @__PURE__ */ new Map();
  for (const p of lista) {
    const vistas = /* @__PURE__ */ new Set();
    for (const s of p.veredicto?.sustancias ?? []) {
      if (tipo && s.tipo !== tipo) continue;
      if (vistas.has(s.codigo)) continue;
      vistas.add(s.codigo);
      const previa = mapa.get(s.codigo);
      if (previa) {
        previa.veces++;
        if (previa.ejemplos.length < 5) previa.ejemplos.push(p.nombre);
      } else {
        mapa.set(s.codigo, {
          codigo: s.codigo,
          nombre: s.nombre,
          tipo: s.tipo,
          riesgo: s.riesgo,
          veces: 1,
          ejemplos: [p.nombre]
        });
      }
    }
  }
  return [...mapa.values()].sort((a, b) => b.veces - a.veces || a.nombre.localeCompare(b.nombre, "es"));
}
function resumir(productos, fotos) {
  const porSemaforo = Object.fromEntries(SEMAFOROS.map((s) => [s, 0]));
  for (const p of productos) if (p.semaforo) porSemaforo[p.semaforo]++;
  const fechas = productos.map((p) => p.fechaAnalisis).sort();
  return {
    productos: productos.length,
    fotos: fotos.length,
    bytesFotos: fotos.reduce((s, f) => s + f.datos.byteLength, 0),
    porSemaforo,
    primerAnalisis: fechas[0],
    ultimoAnalisis: fechas[fechas.length - 1]
  };
}

// src/almacen/memoria.ts
var RepositorioMemoria = class {
  constructor() {
    __publicField(this, "productos", /* @__PURE__ */ new Map());
    __publicField(this, "fotos", /* @__PURE__ */ new Map());
    __publicField(this, "preferencias", /* @__PURE__ */ new Map());
  }
  async guardarProducto(p) {
    this.productos.set(p.id, estructurar(p));
  }
  async obtenerProducto(id) {
    const p = this.productos.get(id);
    return p ? estructurar(p) : void 0;
  }
  async listarProductos(filtro) {
    return filtrarYOrdenar([...this.productos.values()], filtro).map(estructurar);
  }
  async borrarProducto(id) {
    const p = this.productos.get(id);
    if (!p) return;
    this.productos.delete(id);
    const enUso = /* @__PURE__ */ new Set();
    for (const otro of this.productos.values()) {
      for (const f of otro.fotos) enUso.add(f.idFoto);
    }
    for (const f of p.fotos) if (!enUso.has(f.idFoto)) this.fotos.delete(f.idFoto);
  }
  async guardarFoto(f) {
    this.fotos.set(f.id, f);
  }
  async obtenerFoto(id) {
    return this.fotos.get(id);
  }
  async borrarFoto(id) {
    this.fotos.delete(id);
  }
  async guardarPreferencia(clave2, valor) {
    this.preferencias.set(clave2, valor);
  }
  async obtenerPreferencia(clave2) {
    return this.preferencias.get(clave2);
  }
  async listarPreferencias() {
    return Object.fromEntries(this.preferencias);
  }
  async estadisticas() {
    return resumir([...this.productos.values()], [...this.fotos.values()]);
  }
  async recuentoSustancias(tipo) {
    return contarSustancias([...this.productos.values()], tipo);
  }
  async vaciar() {
    this.productos.clear();
    this.fotos.clear();
    this.preferencias.clear();
  }
};
function estructurar(x) {
  return structuredClone(x);
}

// src/almacen/indexeddb.ts
var BASE = "comer-despues-de-usar";
var VERSION_BASE = 1;
var ALMACEN_PRODUCTOS = "productos";
var ALMACEN_FOTOS = "fotos";
var ALMACEN_PREFERENCIAS = "preferencias";
function prometer(req) {
  return new Promise((resuelve, rechaza) => {
    req.onsuccess = () => resuelve(req.result);
    req.onerror = () => rechaza(req.error ?? new Error("Fallo en la base de datos"));
  });
}
function terminada(tx) {
  return new Promise((resuelve, rechaza) => {
    tx.oncomplete = () => resuelve();
    tx.onerror = () => rechaza(tx.error ?? new Error("Transacción fallida"));
    tx.onabort = () => rechaza(tx.error ?? new Error("Transacción abortada"));
  });
}
var RepositorioIndexedDB = class {
  constructor(nombreBase = BASE) {
    __publicField(this, "bd", null);
    __publicField(this, "nombreBase");
    this.nombreBase = nombreBase;
  }
  /** Abre la base y crea los almacenes la primera vez. */
  async abrir() {
    if (this.bd) return this.bd;
    this.bd = await new Promise((resuelve, rechaza) => {
      const req = indexedDB.open(this.nombreBase, VERSION_BASE);
      req.onupgradeneeded = () => {
        const bd = req.result;
        if (!bd.objectStoreNames.contains(ALMACEN_PRODUCTOS)) {
          const st = bd.createObjectStore(ALMACEN_PRODUCTOS, { keyPath: "id" });
          st.createIndex("fecha", "fechaAnalisis");
          st.createIndex("semaforo", "semaforo");
        }
        if (!bd.objectStoreNames.contains(ALMACEN_FOTOS)) {
          bd.createObjectStore(ALMACEN_FOTOS, { keyPath: "id" });
        }
        if (!bd.objectStoreNames.contains(ALMACEN_PREFERENCIAS)) {
          bd.createObjectStore(ALMACEN_PREFERENCIAS);
        }
      };
      req.onsuccess = () => resuelve(req.result);
      req.onerror = () => rechaza(req.error ?? new Error("No se pudo abrir la base de datos"));
      req.onblocked = () => rechaza(new Error("La base está bloqueada por otra pestaña abierta"));
    });
    return this.bd;
  }
  async leer(almacen, fn) {
    const bd = await this.abrir();
    const tx = bd.transaction(almacen, "readonly");
    const res = await prometer(fn(tx.objectStore(almacen)));
    await terminada(tx);
    return res;
  }
  async escribir(almacen, fn) {
    const bd = await this.abrir();
    const tx = bd.transaction(almacen, "readwrite");
    fn(tx.objectStore(almacen));
    await terminada(tx);
  }
  async guardarProducto(p) {
    await this.escribir(ALMACEN_PRODUCTOS, (st) => {
      st.put(p);
    });
  }
  async obtenerProducto(id) {
    return this.leer(ALMACEN_PRODUCTOS, (st) => st.get(id));
  }
  async listarProductos(filtro) {
    const todos = await this.leer(ALMACEN_PRODUCTOS, (st) => st.getAll());
    return filtrarYOrdenar(todos ?? [], filtro);
  }
  async borrarProducto(id) {
    const bd = await this.abrir();
    const producto = await this.obtenerProducto(id);
    if (!producto) return;
    const tx = bd.transaction([ALMACEN_PRODUCTOS, ALMACEN_FOTOS], "readwrite");
    const stProductos = tx.objectStore(ALMACEN_PRODUCTOS);
    const stFotos = tx.objectStore(ALMACEN_FOTOS);
    const resto = await prometer(stProductos.getAll());
    const enUso = /* @__PURE__ */ new Set();
    for (const otro of resto) {
      if (otro.id === id) continue;
      for (const f of otro.fotos) enUso.add(f.idFoto);
    }
    stProductos.delete(id);
    for (const f of producto.fotos) if (!enUso.has(f.idFoto)) stFotos.delete(f.idFoto);
    await terminada(tx);
  }
  async guardarFoto(f) {
    await this.escribir(ALMACEN_FOTOS, (st) => {
      st.put(f);
    });
  }
  async obtenerFoto(id) {
    return this.leer(ALMACEN_FOTOS, (st) => st.get(id));
  }
  async borrarFoto(id) {
    await this.escribir(ALMACEN_FOTOS, (st) => {
      st.delete(id);
    });
  }
  async guardarPreferencia(clave2, valor) {
    await this.escribir(ALMACEN_PREFERENCIAS, (st) => {
      st.put(valor, clave2);
    });
  }
  async obtenerPreferencia(clave2) {
    return this.leer(ALMACEN_PREFERENCIAS, (st) => st.get(clave2));
  }
  async listarPreferencias() {
    const bd = await this.abrir();
    const tx = bd.transaction(ALMACEN_PREFERENCIAS, "readonly");
    const st = tx.objectStore(ALMACEN_PREFERENCIAS);
    const claves = await prometer(st.getAllKeys());
    const valores = await prometer(st.getAll());
    await terminada(tx);
    const out = {};
    claves.forEach((k, i) => {
      out[String(k)] = valores[i];
    });
    return out;
  }
  async estadisticas() {
    const productos = await this.leer(ALMACEN_PRODUCTOS, (st) => st.getAll());
    const fotos = await this.leer(ALMACEN_FOTOS, (st) => st.getAll());
    return resumir(productos ?? [], fotos ?? []);
  }
  async recuentoSustancias(tipo) {
    const productos = await this.leer(ALMACEN_PRODUCTOS, (st) => st.getAll());
    return contarSustancias(productos ?? [], tipo);
  }
  async vaciar() {
    const bd = await this.abrir();
    const tx = bd.transaction([ALMACEN_PRODUCTOS, ALMACEN_FOTOS, ALMACEN_PREFERENCIAS], "readwrite");
    tx.objectStore(ALMACEN_PRODUCTOS).clear();
    tx.objectStore(ALMACEN_FOTOS).clear();
    tx.objectStore(ALMACEN_PREFERENCIAS).clear();
    await terminada(tx);
  }
  async cerrar() {
    this.bd?.close();
    this.bd = null;
  }
};
function hayIndexedDB() {
  try {
    return typeof indexedDB !== "undefined" && indexedDB !== null;
  } catch {
    return false;
  }
}

// src/almacen/copia.ts
var FORMATO = "comer-despues-de-usar/copia";
var VERSION_FORMATO = 1;
async function exportar(repo, opts = {}) {
  const incluirFotos = opts.incluirFotos ?? true;
  const productos = await repo.listarProductos({ orden: "fecha_asc" });
  const preferencias = await repo.listarPreferencias();
  const fotos = [];
  if (incluirFotos) {
    const vistas = /* @__PURE__ */ new Set();
    for (const p of productos) {
      for (const ref of p.fotos) {
        if (vistas.has(ref.idFoto)) continue;
        vistas.add(ref.idFoto);
        const f = await repo.obtenerFoto(ref.idFoto);
        if (!f) continue;
        fotos.push({
          id: f.id,
          tipo: f.tipo,
          mime: f.mime,
          creada: f.creada,
          datos64: aBase64(f.datos)
        });
      }
    }
  }
  return {
    formato: FORMATO,
    version: VERSION_FORMATO,
    fecha: (/* @__PURE__ */ new Date()).toISOString(),
    versionAlgoritmo: VERSION_ALGORITMO,
    incluyeFotos: incluirFotos,
    productos,
    fotos,
    preferencias
  };
}
function validarCopia(x) {
  const errores = [];
  if (!x || typeof x !== "object") {
    return ["El fichero no contiene datos reconocibles."];
  }
  const c = x;
  if (c.formato !== FORMATO) {
    errores.push("El fichero no es una copia de seguridad de esta aplicación.");
  }
  if (typeof c.version !== "number") {
    errores.push("Al fichero le falta el número de versión del formato.");
  } else if (c.version > VERSION_FORMATO) {
    errores.push(`La copia es de una versión más nueva (${c.version}) que esta aplicación (${VERSION_FORMATO}). Actualiza antes de importarla.`);
  }
  if (!Array.isArray(c.productos)) {
    errores.push("El fichero no contiene una lista de productos.");
  } else {
    const malos = c.productos.filter(
      (p) => !p || typeof p !== "object" || typeof p.id !== "string"
    ).length;
    if (malos > 0) errores.push(`Hay ${malos} producto(s) sin identificador válido.`);
  }
  if (c.fotos !== void 0 && !Array.isArray(c.fotos)) {
    errores.push("La lista de fotos está corrupta.");
  }
  return errores;
}
async function importar(repo, copia, opts = {}) {
  const errores = validarCopia(copia);
  if (errores.length > 0) {
    return { ok: false, productosImportados: 0, productosOmitidos: 0, fotosImportadas: 0, errores, avisos: [] };
  }
  const c = copia;
  const modo = opts.modo ?? "fusionar";
  const avisos = [];
  if (modo === "reemplazar") await repo.vaciar();
  let fotosImportadas = 0;
  for (const f of c.fotos ?? []) {
    try {
      const foto = {
        id: f.id,
        tipo: f.tipo,
        mime: f.mime,
        creada: f.creada,
        datos: deBase64(f.datos64)
      };
      await repo.guardarFoto(foto);
      fotosImportadas++;
    } catch {
      avisos.push(`No se pudo restaurar la foto ${f.id}.`);
    }
  }
  let importados = 0;
  let omitidos = 0;
  for (const p of c.productos) {
    try {
      if (modo === "fusionar" && await repo.obtenerProducto(p.id)) {
        omitidos++;
        continue;
      }
      await repo.guardarProducto(p);
      importados++;
    } catch {
      omitidos++;
      avisos.push(`No se pudo restaurar el producto "${p.nombre ?? p.id}".`);
    }
  }
  for (const [k, v2] of Object.entries(c.preferencias ?? {})) {
    await repo.guardarPreferencia(k, v2);
  }
  if (!c.incluyeFotos) {
    avisos.push("Esta copia se guardó sin fotos, así que los productos se restauran sin imagen.");
  }
  if (c.versionAlgoritmo !== VERSION_ALGORITMO) {
    avisos.push(`Los veredictos se calcularon con la versión ${c.versionAlgoritmo} del algoritmo y esta app usa la ${VERSION_ALGORITMO}. Puedes recalcularlos cuando quieras.`);
  }
  return {
    ok: true,
    productosImportados: importados,
    productosOmitidos: omitidos,
    fotosImportadas,
    errores: [],
    avisos
  };
}
function nombreFichero(fecha = /* @__PURE__ */ new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `comer-copia-${fecha.getFullYear()}${p(fecha.getMonth() + 1)}${p(fecha.getDate())}-${p(fecha.getHours())}${p(fecha.getMinutes())}.json`;
}
function aBase64(datos) {
  const bytes = new Uint8Array(datos);
  let bin = "";
  const trozo = 32768;
  for (let i = 0; i < bytes.length; i += trozo) {
    bin += String.fromCharCode(...bytes.subarray(i, i + trozo));
  }
  return btoa(bin);
}
function deBase64(texto) {
  const bin = atob(texto);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// src/imagen/procesar.ts
function crearImagen(ancho, alto) {
  return { datos: new Uint8ClampedArray(ancho * alto * 4), ancho, alto };
}
function redimensionar(img, ladoMax) {
  const mayor = Math.max(img.ancho, img.alto);
  if (mayor <= ladoMax) return img;
  const escala = ladoMax / mayor;
  const ancho = Math.max(1, Math.round(img.ancho * escala));
  const alto = Math.max(1, Math.round(img.alto * escala));
  const out = crearImagen(ancho, alto);
  const px = img.ancho / ancho;
  const py = img.alto / alto;
  for (let y = 0; y < alto; y++) {
    const y0 = Math.floor(y * py);
    const y1 = Math.min(img.alto, Math.max(y0 + 1, Math.ceil((y + 1) * py)));
    for (let x = 0; x < ancho; x++) {
      const x0 = Math.floor(x * px);
      const x1 = Math.min(img.ancho, Math.max(x0 + 1, Math.ceil((x + 1) * px)));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let j = y0; j < y1; j++) {
        for (let i = x0; i < x1; i++) {
          const k2 = (j * img.ancho + i) * 4;
          r += img.datos[k2];
          g += img.datos[k2 + 1];
          b += img.datos[k2 + 2];
          a += img.datos[k2 + 3];
          n++;
        }
      }
      const k = (y * ancho + x) * 4;
      out.datos[k] = r / n;
      out.datos[k + 1] = g / n;
      out.datos[k + 2] = b / n;
      out.datos[k + 3] = a / n;
    }
  }
  return out;
}
function aGrises(img) {
  const out = crearImagen(img.ancho, img.alto);
  for (let i = 0; i < img.datos.length; i += 4) {
    const l = 0.2126 * img.datos[i] + 0.7152 * img.datos[i + 1] + 0.0722 * img.datos[i + 2];
    out.datos[i] = out.datos[i + 1] = out.datos[i + 2] = l;
    out.datos[i + 3] = 255;
  }
  return out;
}
function estirarContraste(img, recorte = 0.02) {
  const hist = new Uint32Array(256);
  for (let i = 0; i < img.datos.length; i += 4) hist[img.datos[i] | 0]++;
  const total = img.ancho * img.alto;
  const fuera = Math.floor(total * recorte);
  let bajo = 0, acumulado = 0;
  for (let v2 = 0; v2 < 256; v2++) {
    acumulado += hist[v2];
    if (acumulado > fuera) {
      bajo = v2;
      break;
    }
  }
  let alto = 255;
  acumulado = 0;
  for (let v2 = 255; v2 >= 0; v2--) {
    acumulado += hist[v2];
    if (acumulado > fuera) {
      alto = v2;
      break;
    }
  }
  const out = crearImagen(img.ancho, img.alto);
  const rango = Math.max(1, alto - bajo);
  for (let i = 0; i < img.datos.length; i += 4) {
    const v2 = Math.max(0, Math.min(255, (img.datos[i] - bajo) / rango * 255));
    out.datos[i] = out.datos[i + 1] = out.datos[i + 2] = v2;
    out.datos[i + 3] = 255;
  }
  return out;
}
function integrales(img) {
  const { ancho: w, alto: h } = img;
  const suma = new Float64Array((w + 1) * (h + 1));
  const suma2 = new Float64Array((w + 1) * (h + 1));
  for (let y = 0; y < h; y++) {
    let fila = 0, fila2 = 0;
    for (let x = 0; x < w; x++) {
      const v2 = img.datos[(y * w + x) * 4];
      fila += v2;
      fila2 += v2 * v2;
      const k = (y + 1) * (w + 1) + (x + 1);
      suma[k] = suma[y * (w + 1) + (x + 1)] + fila;
      suma2[k] = suma2[y * (w + 1) + (x + 1)] + fila2;
    }
  }
  return { suma, suma2, w, h };
}
function binarizarSauvola(img, radio = 0, k = 0.2, R = 128) {
  const { suma, suma2, w, h } = integrales(img);
  const r = radio > 0 ? radio : Math.max(7, Math.round(Math.min(w, h) / 28));
  const out = crearImagen(w, h);
  const areaSuma = (x0, y0, x1, y1, tabla) => tabla[y1 * (w + 1) + x1] - tabla[y0 * (w + 1) + x1] - tabla[y1 * (w + 1) + x0] + tabla[y0 * (w + 1) + x0];
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1);
      const n = (x1 - x0) * (y1 - y0);
      const s = areaSuma(x0, y0, x1, y1, suma);
      const s2 = areaSuma(x0, y0, x1, y1, suma2);
      const media = s / n;
      const varianza = Math.max(0, s2 / n - media * media);
      const desv = Math.sqrt(varianza);
      const umbral = media * (1 + k * (desv / R - 1));
      const v2 = img.datos[(y * w + x) * 4] > umbral ? 255 : 0;
      const kk = (y * w + x) * 4;
      out.datos[kk] = out.datos[kk + 1] = out.datos[kk + 2] = v2;
      out.datos[kk + 3] = 255;
    }
  }
  return out;
}
function recortar(img, x, y, ancho, alto) {
  const x0 = Math.max(0, Math.min(img.ancho - 1, Math.round(x)));
  const y0 = Math.max(0, Math.min(img.alto - 1, Math.round(y)));
  const w = Math.max(1, Math.min(img.ancho - x0, Math.round(ancho)));
  const h = Math.max(1, Math.min(img.alto - y0, Math.round(alto)));
  const out = crearImagen(w, h);
  for (let j = 0; j < h; j++) {
    const origen = ((y0 + j) * img.ancho + x0) * 4;
    out.datos.set(img.datos.subarray(origen, origen + w * 4), j * w * 4);
  }
  return out;
}
function prepararParaLectura(img, opts = {}) {
  const ladoMax = opts.ladoMax ?? 1600;
  let out = redimensionar(img, ladoMax);
  out = aGrises(out);
  out = estirarContraste(out, opts.recorteHistograma ?? 0.02);
  if (opts.binarizar !== false) out = binarizarSauvola(out);
  return out;
}
var RECORTE_COMPLETO = { x0: 0, y0: 0, x1: 100, y1: 100 };
function hayRecorte(r) {
  return r.x0 > 0.5 || r.y0 > 0.5 || r.x1 < 99.5 || r.y1 < 99.5;
}
function recorteRelativo(img, r) {
  const lim = (v2) => Math.max(0, Math.min(100, Number.isFinite(v2) ? v2 : 0));
  let x0 = lim(r.x0), x1 = lim(r.x1), y0 = lim(r.y0), y1 = lim(r.y1);
  if (x1 < x0) [x0, x1] = [x1, x0];
  if (y1 < y0) [y0, y1] = [y1, y0];
  if (x1 - x0 < 5 || y1 - y0 < 5) return img;
  const px = Math.round(x0 / 100 * img.ancho);
  const py = Math.round(y0 / 100 * img.alto);
  const ancho = Math.max(1, Math.round((x1 - x0) / 100 * img.ancho));
  const alto = Math.max(1, Math.round((y1 - y0) / 100 * img.alto));
  return recortar(img, px, py, ancho, alto);
}

// src/imagen/calidad.ts
function nitidez(gris) {
  const { ancho: w, alto: h, datos } = gris;
  if (w < 3 || h < 3) return 0;
  let suma = 0, suma2 = 0, n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const c = (y * w + x) * 4;
      const lap = -4 * datos[c] + datos[c - 4] + datos[c + 4] + datos[c - w * 4] + datos[c + w * 4];
      suma += lap;
      suma2 += lap * lap;
      n++;
    }
  }
  const media = suma / n;
  return suma2 / n - media * media;
}
function brillo(gris) {
  let s = 0;
  for (let i = 0; i < gris.datos.length; i += 4) s += gris.datos[i];
  return s / (gris.datos.length / 4);
}
function contraste(gris) {
  const m = brillo(gris);
  let s = 0;
  for (let i = 0; i < gris.datos.length; i += 4) {
    const d = gris.datos[i] - m;
    s += d * d;
  }
  return Math.sqrt(s / (gris.datos.length / 4));
}
var UMBRALES_CALIDAD = {
  nitidezRelativaMinima: 0.22,
  nitidezRelativaBuena: 0.6,
  nitidezMinima: 60,
  nitidezBuena: 250,
  brilloMinimo: 45,
  brilloMaximo: 225,
  contrasteMinimo: 28,
  ladoMinimo: 600
};
function evaluarCalidad(img) {
  const chica = redimensionar(img, 900);
  const gris = aGrises(chica);
  const nit = nitidez(gris);
  const con = contraste(gris);
  const relativa = con > 3 ? nit / (con * con) : 0;
  const medidas = {
    nitidez: Math.round(nit),
    nitidezRelativa: Math.round(relativa * 1e3) / 1e3,
    brillo: Math.round(brillo(gris)),
    contraste: Math.round(con),
    megapixeles: Math.round(img.ancho * img.alto / 1e5) / 10,
    ladoMenor: Math.min(img.ancho, img.alto)
  };
  const problemas = [];
  if (con > 3 && medidas.nitidezRelativa < UMBRALES_CALIDAD.nitidezRelativaMinima) {
    problemas.push({
      codigo: "movida",
      mensaje: "La foto ha salido movida o desenfocada.",
      consejo: "Apoya los codos, espera a que el móvil enfoque y vuelve a disparar. Es lo que más arregla la lectura."
    });
  }
  if (medidas.brillo < UMBRALES_CALIDAD.brilloMinimo) {
    problemas.push({
      codigo: "oscura",
      mensaje: "La foto ha salido demasiado oscura.",
      consejo: "Acércate a una ventana o enciende una luz. Evita hacer sombra tú mismo sobre el envase."
    });
  }
  if (medidas.brillo > UMBRALES_CALIDAD.brilloMaximo) {
    problemas.push({
      codigo: "quemada",
      mensaje: "Hay un reflejo o un brillo que se come el texto.",
      consejo: "Gira el envase o apártate de la luz directa. Los plásticos brillantes reflejan mucho."
    });
  }
  if (medidas.contraste < UMBRALES_CALIDAD.contrasteMinimo) {
    problemas.push({
      codigo: "plana",
      mensaje: "Apenas se distingue el texto del fondo.",
      consejo: "Acércate hasta que la tabla ocupe casi toda la pantalla y vuelve a intentarlo."
    });
  }
  if (medidas.ladoMenor < UMBRALES_CALIDAD.ladoMinimo) {
    problemas.push({
      codigo: "pequena",
      mensaje: "La imagen tiene muy poca resolución para leer letra pequeña.",
      consejo: "Haz la foto con la cámara en vez de recortar una imagen ya guardada."
    });
  }
  const pNitidez = Math.min(1, medidas.nitidezRelativa / UMBRALES_CALIDAD.nitidezRelativaBuena);
  const pContraste = Math.min(1, medidas.contraste / 60);
  const desvioBrillo = Math.abs(medidas.brillo - 135) / 135;
  const pBrillo = Math.max(0, 1 - desvioBrillo * 1.4);
  const puntuacion = Math.round((0.45 * pNitidez + 0.3 * pContraste + 0.25 * pBrillo) * 100);
  const grave = problemas.some((p) => p.codigo === "movida" || p.codigo === "pequena");
  let nivel;
  if (grave || puntuacion < 35) nivel = "mala";
  else if (problemas.length > 0 || puntuacion < 60) nivel = "aceptable";
  else nivel = "buena";
  return { nivel, puntuacion, medidas, problemas, repetir: nivel === "mala" };
}

// src/lectura/tabla.ts
var SINONIMOS = [
  ["saturadas_g", [
    "de las cuales acidos grasos saturados",
    "de los cuales acidos grasos saturados",
    "de las cuales saturadas",
    "de los cuales saturados",
    "de las quals saturades",
    "dos quais saturados",
    "of which saturates",
    "acidos grasos saturados",
    "grasas saturadas",
    "greixos saturats",
    "saturadas",
    "saturados",
    "saturates",
    "saturats"
  ]],
  ["monoinsaturadas_g", [
    "de las cuales monoinsaturadas",
    "acidos grasos monoinsaturados",
    "grasas monoinsaturadas",
    "monoinsaturadas",
    "monoinsaturados",
    "monounsaturates"
  ]],
  ["poliinsaturadas_g", [
    "de las cuales poliinsaturadas",
    "acidos grasos poliinsaturados",
    "grasas poliinsaturadas",
    "poliinsaturadas",
    "poliinsaturados",
    "polyunsaturates"
  ]],
  ["trans_g", ["acidos grasos trans", "grasas trans", "de las cuales trans", "trans"]],
  ["azucares_g", [
    "de los cuales azucares",
    "de las cuales azucares",
    "dels quals sucres",
    "of which sugars",
    "dos quais acucares",
    "azucares totales",
    "azucares",
    "sucres",
    "sugars",
    "acucares"
  ]],
  ["polialcoholes_g", ["de los cuales polialcoholes", "polialcoholes", "polioles", "polyols"]],
  ["almidon_g", ["de los cuales almidon", "almidon", "starch"]],
  ["hidratos_g", [
    "hidratos de carbono",
    "hidrats de carboni",
    "carbohidratos",
    "glucidos",
    "glicidos",
    "carbohydrate",
    "hidratos",
    // El lector se come letras del principio ("tdmtos de carbono"), pero
    // "de carbono" sobrevive y es lo bastante distintivo para fiarse.
    "de carbono",
    "de carboni"
  ]],
  ["fibra_g", ["fibra alimentaria", "fibra dietetica", "fibra alimentar", "fibra", "fibre", "fibra"]],
  ["proteinas_g", ["proteinas", "proteines", "proteinas", "protein", "proteina"]],
  ["sal_g", ["sal equivalente", "equivalente en sal", "sal", "salt"]],
  ["sodio_mg", ["sodio", "sodi", "sodium"]],
  ["grasas_g", ["materia grasa", "grasas totales", "grasas", "greixos", "lipidos", "gorduras", "fat", "grasa"]],
  ["energia_kcal", ["valor energetico", "valor energetic", "energia", "energy", "calorias"]]
];
var CABECERAS_100 = ["por 100 g", "por 100 ml", "per 100 g", "per 100 ml", "100 g", "100 ml", "/100g", "/100ml"];
var CABECERAS_RACION = ["por racion", "per racio", "por porcion", "racion de", "porcion de", "per serving", "por unidad", "unidad"];
var CABECERAS_ENVASE = ["por envase", "envase entero", "per envas", "por paquete"];
function normalizar(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[·•‧∙]/g, " ").replace(/\s+/g, " ").trim();
}
var UNIDADES = "kcal|kcai|kca|keal|kj|kilojulios|kilocalorias|mg|mcg|ug|µg|g|ml|%";
function normalizarUnidad(u) {
  const x = u.toLowerCase();
  if (/^(kcal|kcai|kca|keal|kilocalorias)$/.test(x)) return "kcal";
  if (/^(kj|kilojulios)$/.test(x)) return "kj";
  if (/^(µg|ug|mcg)$/.test(x)) return "ug";
  return x;
}
function extraerNumeros(texto) {
  const out = [];
  const re = new RegExp(
    `([<>~]?\\s?\\d{1,3}(?:[ .]\\d{3})+(?:[.,]\\d{1,2})?|[<>~]?\\s?\\d+(?:[.,]\\d{1,3})?)\\s*(${UNIDADES})?`,
    "gi"
  );
  let m;
  while ((m = re.exec(texto)) !== null) {
    const bruto = m[0].trim();
    let crudo = m[1].replace(/[<>~]/g, "").trim();
    crudo = crudo.replace(/[ ](?=\d{3}\b)/g, "").replace(/\.(?=\d{3}\b)/g, "");
    const valor = parseFloat(crudo.replace(",", "."));
    if (!Number.isFinite(valor)) continue;
    out.push({ valor, unidad: normalizarUnidad(m[2] ?? ""), bruto });
  }
  return out;
}
function marcadores(linea) {
  const out = [];
  const ocupado = new Array(linea.length).fill(false);
  const todos = SINONIMOS.flatMap(([campo, nombres]) => nombres.map((n) => ({ campo, n }))).sort((a, b) => b.n.length - a.n.length);
  for (const { campo, n } of todos) {
    let desde = 0;
    for (; ; ) {
      const i = linea.indexOf(n, desde);
      if (i === -1) break;
      desde = i + 1;
      const antes = i === 0 || /[^a-z0-9]/.test(linea[i - 1]);
      const despues = i + n.length >= linea.length || /[^a-z0-9]/.test(linea[i + n.length]);
      if (!antes || !despues) continue;
      if (ocupado.slice(i, i + n.length).some(Boolean)) continue;
      for (let k = i; k < i + n.length; k++) ocupado[k] = true;
      out.push({ campo, desde: i, hasta: i + n.length, texto: n });
      break;
    }
  }
  const porCampo = /* @__PURE__ */ new Map();
  for (const m of out.sort((a, b) => a.desde - b.desde)) {
    if (!porCampo.has(m.campo)) porCampo.set(m.campo, m);
  }
  return [...porCampo.values()].sort((a, b) => a.desde - b.desde);
}
function detectarColumnas(lineas) {
  for (const l of lineas) {
    const tiene100 = CABECERAS_100.some((c) => l.includes(c));
    const tieneRacion = CABECERAS_RACION.some((c) => l.includes(c));
    const tieneEnvase = CABECERAS_ENVASE.some((c) => l.includes(c));
    if (!tiene100 && !tieneRacion && !tieneEnvase) continue;
    const pos = [];
    for (const c of CABECERAS_100) {
      const i = l.indexOf(c);
      if (i >= 0) {
        pos.push({ tipo: "por_100", i });
        break;
      }
    }
    for (const c of CABECERAS_RACION) {
      const i = l.indexOf(c);
      if (i >= 0) {
        pos.push({ tipo: "por_racion", i });
        break;
      }
    }
    for (const c of CABECERAS_ENVASE) {
      const i = l.indexOf(c);
      if (i >= 0) {
        pos.push({ tipo: "por_envase", i });
        break;
      }
    }
    pos.sort((a, b) => a.i - b.i);
    const indice100 = pos.findIndex((p) => p.tipo === "por_100");
    let racion;
    const mr = l.match(/racion[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*(g|ml)/) ?? l.match(/porcion[^0-9]{0,12}(\d+(?:[.,]\d+)?)\s*(g|ml)/) ?? l.match(/\((\d+(?:[.,]\d+)?)\s*(?:g|ml)\)/);
    if (mr) racion = parseFloat(mr[1].replace(",", "."));
    if (indice100 >= 0) return { base: "por_100", indice100, racion };
    if (pos.length) return { base: pos[0].tipo, indice100: 0, racion };
  }
  return { base: "desconocida", indice100: 0 };
}
function unirNombresConValores(lineas) {
  const soloNumeros = (l) => /\d/.test(l) && l.replace(/\d+(?:[.,]\d+)?/g, " ").replace(new RegExp(`\\b(${UNIDADES})\\b`, "gi"), " ").replace(/[^\x20-\x7E]/g, "").replace(/[\s.,:;%/<>~+()·-]/g, "").length === 0;
  const esBasura = (l) => marcadores(l).length === 0 && !soloNumeros(l) && !/\d+[.,]\d/.test(l);
  const out = [];
  const dudosos = /* @__PURE__ */ new Set();
  let anteriorFueNombreSinValor = false;
  for (let i = 0; i < lineas.length; i++) {
    const actual = lineas[i];
    const tieneNombre = marcadores(actual).length > 0;
    const sinNumero = !/\d/.test(actual);
    if (tieneNombre && sinNumero) {
      let j = i + 1;
      let saltados = 0;
      while (j < lineas.length && saltados < 1 && esBasura(lineas[j])) {
        j++;
        saltados++;
      }
      if (j < lineas.length && soloNumeros(lineas[j])) {
        if (anteriorFueNombreSinValor) dudosos.add(out.length);
        out.push(`${actual} ${lineas[j]}`);
        for (let k = i + 1; k < j; k++) out.push(lineas[k]);
        i = j;
        anteriorFueNombreSinValor = false;
        continue;
      }
      anteriorFueNombreSinValor = true;
      out.push(actual);
      continue;
    }
    anteriorFueNombreSinValor = false;
    out.push(actual);
  }
  return { lineas: out, dudosos };
}
function analizarTabla(textoCrudo) {
  const lineasCrudas = textoCrudo.split(/[\n\r]+/).map((l) => l.trim()).filter((l) => l.length > 0);
  const { lineas, dudosos } = unirNombresConValores(lineasCrudas.map(normalizar));
  const { base: baseDetectada, indice100, racion } = detectarColumnas(lineas);
  const valores = [];
  const usadas = /* @__PURE__ */ new Set();
  const avisos = [];
  lineas.forEach((linea, iLinea) => {
    const marcas = marcadores(linea);
    if (marcas.length === 0) return;
    marcas.forEach((marca, iMarca) => {
      const fin = iMarca + 1 < marcas.length ? marcas[iMarca + 1].desde : linea.length;
      const fragmento = linea.slice(marca.hasta, fin);
      const nums = extraerNumeros(fragmento);
      if (nums.length === 0) return;
      usadas.add(iLinea);
      if (marca.campo === "energia_kcal") {
        const kj = nums.find((n2) => n2.unidad === "kj");
        const kcal = nums.find((n2) => n2.unidad === "kcal");
        if (kj) valores.push({ campo: "energia_kj", valor: kj.valor, unidad: "kJ", textoOriginal: kj.bruto, confianza: 0.95, columna: 0 });
        if (kcal) valores.push({ campo: "energia_kcal", valor: kcal.valor, unidad: "kcal", textoOriginal: kcal.bruto, confianza: 0.95, columna: 0 });
        if (!kj && !kcal) {
          const n2 = elegirColumna(nums, indice100);
          if (n2) {
            const esKj = n2.valor > 900;
            valores.push({
              campo: esKj ? "energia_kj" : "energia_kcal",
              valor: n2.valor,
              unidad: esKj ? "kJ" : "kcal",
              textoOriginal: n2.bruto,
              confianza: 0.6,
              columna: indice100
            });
            avisos.push("La energía venía sin unidad. Se ha supuesto por su magnitud, compruébala.");
          }
        }
        return;
      }
      const n = elegirColumna(nums, indice100);
      if (!n) return;
      let valor = n.valor;
      let unidad = n.unidad;
      if (marca.campo === "sodio_mg") {
        if (unidad === "g") {
          valor = valor * 1e3;
          unidad = "mg";
        }
      } else if (unidad === "mg") {
        valor = valor / 1e3;
        unidad = "g";
      } else if (unidad === "ug" || unidad === "µg" || unidad === "mcg") {
        valor = valor / 1e6;
        unidad = "g";
      }
      let confianza2 = 0.9;
      if (!n.unidad) confianza2 -= 0.2;
      if (nums.length > 2) confianza2 -= 0.15;
      if (marcas.length > 2) confianza2 -= 0.1;
      if (dudosos.has(iLinea)) confianza2 = Math.min(confianza2, 0.4);
      valores.push({
        campo: marca.campo,
        valor,
        unidad: unidad || "",
        textoOriginal: n.bruto,
        confianza: Math.max(0.3, confianza2),
        columna: indice100
      });
    });
  });
  const nutrientes = {};
  const puestos = /* @__PURE__ */ new Set();
  for (const v2 of valores) {
    if (puestos.has(v2.campo)) continue;
    puestos.add(v2.campo);
    if (v2.campo === "almidon_g") continue;
    const dato = {
      valor: v2.valor,
      estado: "leido",
      textoOriginal: v2.textoOriginal,
      confianzaOCR: v2.confianza
    };
    nutrientes[v2.campo] = dato;
  }
  let racionGramos = racion;
  if (!racionGramos) {
    for (const l of lineas) {
      const m = l.match(/racion(?:es)?[^0-9]{0,15}(\d+(?:[.,]\d+)?)\s*(g|ml)/) ?? l.match(/porcion[^0-9]{0,15}(\d+(?:[.,]\d+)?)\s*(g|ml)/);
      if (m) {
        racionGramos = parseFloat(m[1].replace(",", "."));
        break;
      }
    }
  }
  const columnas = Math.max(1, ...lineas.map((l) => {
    const marcas = marcadores(l);
    return marcas.length === 1 ? extraerNumeros(l.slice(marcas[0].hasta)).length : 0;
  }));
  let base = baseDetectada;
  if (base === "desconocida") {
    if (columnas > 1) {
      base = "por_100";
      avisos.push('No se ha encontrado la cabecera de la tabla. Se ha supuesto que la primera columna es la de "por 100 g", que es lo que manda la ley, pero conviene comprobarlo.');
    } else {
      base = "por_100";
      avisos.push("No se ha encontrado la cabecera de la tabla. Comprueba que los valores son por 100 g y no por ración.");
    }
  } else if (base !== "por_100") {
    avisos.push(`La columna leída es "${base === "por_racion" ? "por ración" : "por envase"}". Para comparar productos hacen falta los valores por 100 g.`);
  }
  const lineasSinUsar = lineas.filter((_, i) => !usadas.has(i));
  if (dudosos.size > 0) {
    const campos = valores.filter((v2) => v2.confianza <= 0.4).map((v2) => v2.campo);
    if (campos.length > 0) {
      avisos.push("Algún campo se ha quedado sin valor al leer, así que las cifras que vienen después podrían pertenecer al campo de arriba. Comprueba sobre todo: " + [...new Set(campos)].join(", ") + ".");
    }
  }
  const OBLIGATORIOS = [
    "energia_kcal",
    "grasas_g",
    "saturadas_g",
    "hidratos_g",
    "azucares_g",
    "proteinas_g",
    "sal_g"
  ];
  const hallados = OBLIGATORIOS.filter((c) => puestos.has(c) || c === "energia_kcal" && puestos.has("energia_kj") || c === "sal_g" && puestos.has("sodio_mg")).length;
  const completitud = hallados / OBLIGATORIOS.length;
  const mediaConfianza = valores.length ? valores.reduce((s, v2) => s + v2.confianza, 0) / valores.length : 0;
  const confianza = Math.round((0.6 * completitud + 0.4 * mediaConfianza) * 100) / 100;
  return { nutrientes, base, racionGramos, columnas, valores, lineasSinUsar, confianza, avisos };
}
function elegirColumna(nums, indice) {
  if (nums.length === 0) return void 0;
  const utiles = nums.filter((n) => n.unidad !== "%");
  const lista = utiles.length ? utiles : nums;
  return lista[Math.min(indice, lista.length - 1)];
}

// src/lectura/ingredientes.ts
var APERTURAS = [
  "ingredientes:",
  "ingredientes",
  "ingredients:",
  "ingredients",
  "ingredientes,",
  "composicion:",
  "composicion",
  "ingredientes >"
];
function partirRespetandoParentesis(texto) {
  const CENTINELA = "";
  const protegido = texto.replace(/(\d),(?=\d)/g, `$1${CENTINELA}`);
  const out = [];
  let actual = "";
  let nivel = 0;
  for (const c of protegido) {
    if (c === "(" || c === "[" || c === "{") nivel++;
    else if (c === ")" || c === "]" || c === "}") nivel = Math.max(0, nivel - 1);
    if ((c === "," || c === ";") && nivel === 0) {
      if (actual.trim()) out.push(actual.trim());
      actual = "";
    } else {
      actual += c;
    }
  }
  if (actual.trim()) out.push(actual.trim());
  return out.map((t) => t.split(CENTINELA).join(","));
}
function analizarIngredientesTexto(crudo) {
  const avisos = [];
  let texto = crudo.replace(/[\n\r]+/g, " ").replace(/\s+/g, " ").trim();
  const normal = normalizar(texto);
  let marcadorEncontrado = false;
  let inicio = 0;
  for (const ap of APERTURAS) {
    const i = normal.indexOf(ap);
    if (i >= 0) {
      inicio = i + ap.length;
      marcadorEncontrado = true;
      break;
    }
  }
  if (!marcadorEncontrado) {
    avisos.push('No se ha encontrado la palabra "Ingredientes". Se ha tomado todo el texto como si lo fuera, así que revísalo.');
  }
  texto = texto.slice(inicio).trim().replace(/^[:.\-–—\s]+/, "");
  let parteTrazas = "";
  const normalActual = normalizar(texto);
  let cortePronto = -1;
  for (const p of PATRONES_TRAZAS) {
    const i = normalActual.indexOf(p);
    if (i >= 0 && (cortePronto === -1 || i < cortePronto)) cortePronto = i;
  }
  if (cortePronto >= 0) {
    parteTrazas = texto.slice(cortePronto);
    texto = texto.slice(0, cortePronto).trim().replace(/[.,;\s]+$/, "");
  }
  const trozos = partirRespetandoParentesis(texto);
  const ingredientes = [];
  for (const trozo of trozos) {
    let t = trozo.trim().replace(/^[.\-–—•*\s]+/, "").replace(/[.\s]+$/, "");
    if (t.length < 2) continue;
    if (/^[\d\s.,%]+$/.test(t)) continue;
    let porcentaje;
    const mp = t.match(/(\d{1,3}(?:[.,]\d{1,2})?)\s*%/);
    if (mp) {
      const v2 = parseFloat(mp[1].replace(",", "."));
      if (v2 > 0 && v2 <= 100) porcentaje = v2;
      t = t.replace(/\(?\s*\d{1,3}(?:[.,]\d{1,2})?\s*%\s*\)?/, " ").replace(/\s+/g, " ").trim();
    }
    let detalle;
    const md = t.match(/\(([^)]*)\)/);
    if (md && md[1].trim().length > 1) detalle = md[1].trim();
    t = t.replace(/[.,;\s]+$/, "").trim();
    if (t.length < 2) continue;
    ingredientes.push({ texto: t, porcentaje, detalle });
  }
  const trazas = [];
  if (parteTrazas) {
    const limpio = parteTrazas.replace(new RegExp(PATRONES_TRAZAS.join("|"), "gi"), " ").replace(/\b(puede|contener|trazas|de|y|o|u|e)\b/gi, " ").replace(/\s+/g, " ").trim();
    for (const t of partirRespetandoParentesis(limpio)) {
      const l = t.replace(/[.\s]+$/, "").trim();
      if (l.length > 2) trazas.push(l);
    }
  }
  let confianza = 0.9;
  if (!marcadorEncontrado) confianza -= 0.3;
  if (ingredientes.length === 0) confianza = 0;
  else if (ingredientes.length === 1) confianza -= 0.25;
  const largos = ingredientes.filter((i) => i.texto.length > 60).length;
  if (largos > 0) {
    confianza -= 0.1 * largos;
    avisos.push(`Hay ${largos} ingrediente(s) demasiado largos. Puede que falte alguna coma y se hayan juntado dos.`);
  }
  if (ingredientes.length > 40) {
    avisos.push("Se han detectado más de 40 ingredientes. Comprueba que no se haya colado texto de otra parte del envase.");
  }
  return {
    ingredientes,
    trazas,
    marcadorEncontrado,
    confianza: Math.max(0, Math.round(confianza * 100) / 100),
    avisos
  };
}

// src/datos/ingredientes-comunes.ts
var FILAS2 = [
  // --- Cereales -----------------------------------------------------------
  [
    "arroz integral",
    "Arroz integral",
    "cereal integral",
    3,
    "Grano de arroz al que solo se le ha quitado la cáscara exterior, conservando el salvado y el germen.",
    "Al conservar el salvado mantiene la fibra, el magnesio y las vitaminas del grupo B que el arroz blanco pierde. Se digiere más despacio, así que sube menos la glucosa en sangre.",
    "alta"
  ],
  [
    "arroz",
    "Arroz",
    "cereal refinado",
    0,
    "Grano de arroz pulido: se le ha quitado la cáscara, el salvado y el germen.",
    "Es energía casi pura, con poca fibra y pocos micronutrientes. Ni suma ni resta por sí mismo, pero el integral es mejor elección en igualdad de condiciones.",
    "alta"
  ],
  [
    "harina integral",
    "Harina integral",
    "cereal integral",
    3,
    "Harina molida con el grano entero, salvado y germen incluidos.",
    'Aporta fibra, magnesio y vitaminas del grupo B. Ojo: "harina de trigo integral" no es lo mismo que "harina de trigo con salvado añadido", que es harina blanca a la que se le devuelve una parte.',
    "alta"
  ],
  [
    "harina de trigo",
    "Harina de trigo refinada",
    "cereal refinado",
    -1,
    "Trigo molido al que se le ha quitado el salvado y el germen.",
    "Pierde la mayor parte de la fibra, el magnesio y las vitaminas del grupo B. Sube el índice glucémico. Como primer ingrediente de un producto, es señal de que la base es harina blanca.",
    "alta"
  ],
  [
    "harina de maiz",
    "Harina de maíz",
    "cereal refinado",
    0,
    "Maíz molido, normalmente sin germen.",
    "Sin gluten, pero con poca fibra y poca proteína. Neutro.",
    "media"
  ],
  [
    "semola",
    "Sémola",
    "cereal refinado",
    0,
    "Molienda gruesa de trigo duro, la base de la pasta.",
    "Perfil parecido al de la harina refinada, con algo más de proteína.",
    "media"
  ],
  [
    "avena integral",
    "Avena integral",
    "cereal integral",
    3,
    "Grano de avena entero, en copos o molido.",
    "Sus beta-glucanos tienen efecto demostrado sobre el colesterol LDL, reconocido por la propia EFSA. De los cereales con mejor perfil.",
    "alta"
  ],
  [
    "avena",
    "Avena",
    "cereal",
    3,
    "Grano de avena, casi siempre entero porque su salvado no se separa bien.",
    "Beta-glucanos con efecto sobre el colesterol, fibra soluble y más proteína que otros cereales.",
    "alta"
  ],
  [
    "centeno",
    "Centeno",
    "cereal",
    2,
    "Cereal emparentado con el trigo, de sabor más intenso.",
    "Más fibra que el trigo y menor índice glucémico, sobre todo en pan de masa madre.",
    "media"
  ],
  [
    "espelta",
    "Espelta",
    "cereal",
    1,
    "Variedad antigua de trigo. Lleva gluten.",
    "Perfil parecido al del trigo. Su fama de más saludable está poco respaldada: lo que cuenta es si va integral o refinada.",
    "media"
  ],
  [
    "quinoa",
    "Quinoa",
    "pseudocereal",
    3,
    "Semilla andina que se cocina como un cereal, aunque no lo es.",
    "Proteína con todos los aminoácidos esenciales, cosa rara en el mundo vegetal. Fibra, hierro y magnesio. Sin gluten.",
    "alta"
  ],
  [
    "trigo sarraceno",
    "Trigo sarraceno",
    "pseudocereal",
    3,
    "Semilla sin parentesco con el trigo, pese al nombre. No lleva gluten.",
    "Fibra, magnesio y rutina, un flavonoide con efecto sobre los vasos sanguíneos.",
    "media"
  ],
  [
    "almidon de maiz",
    "Almidón de maíz",
    "almidón",
    -1,
    "Parte de almidón puro extraída del grano de maíz.",
    "Hidrato de absorción rápida, sin fibra ni micronutrientes. Se usa para espesar y dar textura.",
    "alta"
  ],
  [
    "almidon",
    "Almidón",
    "almidón",
    -1,
    "Hidrato de carbono extraído de un cereal o un tubérculo.",
    'Energía sin fibra ni micronutrientes. Si pone "almidón modificado", además ha pasado por un tratamiento químico.',
    "alta"
  ],
  [
    "maiz",
    "Maíz",
    "cereal",
    1,
    "Grano de maíz, entero o partido.",
    "Aporta fibra y carotenoides si va entero. En forma de harina refinada o almidón pierde casi todo eso.",
    "media"
  ],
  [
    "salvado",
    "Salvado",
    "fibra de cereal",
    2,
    "Capa exterior del grano, separada del resto.",
    "Fibra insoluble concentrada. Mejora el tránsito, aunque en exceso puede reducir la absorción de algunos minerales.",
    "alta"
  ],
  [
    "gluten de trigo",
    "Gluten de trigo aislado",
    "proteína aislada",
    -1,
    "Proteína del trigo extraída y añadida aparte.",
    "Se añade para dar estructura a masas industriales. No es problema salvo para celíacos, pero su presencia delata un producto formulado.",
    "media"
  ],
  // --- Legumbres ----------------------------------------------------------
  [
    "garbanzo",
    "Garbanzo",
    "legumbre",
    3,
    "Legumbre de grano redondo, entera, cocida en conserva o molida en harina.",
    "Proteína vegetal, fibra, hierro y almidón resistente que alimenta a la microbiota. El consumo habitual de legumbres es de los factores mejor asociados a longevidad.",
    "alta"
  ],
  [
    "lenteja",
    "Lenteja",
    "legumbre",
    3,
    "Legumbre pequeña, de las de cocción más rápida.",
    "Proteína, fibra y hierro. Su hierro se absorbe mejor acompañado de vitamina C.",
    "alta"
  ],
  [
    "alubia",
    "Alubia",
    "legumbre",
    3,
    "Judía seca, en cualquiera de sus variedades.",
    "Fibra y almidón resistente, que llega intacto al colon y alimenta a las bacterias buenas.",
    "alta"
  ],
  [
    "guisante",
    "Guisante",
    "legumbre",
    2,
    "Legumbre verde, fresca o congelada.",
    "Fibra, proteína vegetal y vitamina C. Congelado conserva prácticamente todo, porque se congela recién recolectado.",
    "alta"
  ],
  [
    "proteina de guisante",
    "Proteína de guisante aislada",
    "proteína aislada",
    0,
    "Proteína extraída del guisante y separada del resto del alimento.",
    "Buena proteína vegetal, pero fuera de su matriz original. Su presencia indica un producto formulado, no un plato de guisantes.",
    "media"
  ],
  [
    "soja",
    "Soja",
    "legumbre",
    2,
    "Legumbre muy rica en proteína, base del tofu, la salsa de soja y muchas bebidas vegetales.",
    "Proteína completa e isoflavonas. Alérgeno de declaración obligatoria en la UE.",
    "alta"
  ],
  [
    "proteina de soja",
    "Proteína de soja aislada",
    "proteína aislada",
    -1,
    "Proteína de la soja extraída y concentrada.",
    "Se usa para dar textura y subir la proteína de embutidos y precocinados a bajo coste. Marcador claro de ultraprocesado.",
    "media"
  ],
  [
    "altramuz",
    "Altramuz",
    "legumbre",
    2,
    "Legumbre muy proteica, cada vez más usada como harina sin gluten.",
    "Proteína y fibra. Alérgeno de declaración obligatoria.",
    "media"
  ],
  // --- Lácteos ------------------------------------------------------------
  [
    "leche entera",
    "Leche entera",
    "lácteo",
    2,
    "Leche con toda su grasa, normalmente pasteurizada.",
    "Proteína de alto valor, calcio bien absorbido y vitaminas liposolubles. Su grasa saturada se comporta mejor dentro de la matriz láctea que aislada.",
    "alta"
  ],
  [
    "leche desnatada en polvo",
    "Leche desnatada en polvo",
    "lácteo deshidratado",
    -1,
    "Leche a la que se ha quitado la grasa y después el agua.",
    "Conserva proteína y calcio, pero su presencia casi siempre indica un producto industrial. Además concentra la lactosa.",
    "media"
  ],
  [
    "leche en polvo",
    "Leche en polvo",
    "lácteo deshidratado",
    -1,
    "Leche a la que se le ha evaporado el agua hasta dejarla en polvo, para que dure y ocupe menos.",
    "Barata y estable, se usa para dar cuerpo a productos industriales. Marcador de formulación.",
    "media"
  ],
  [
    "leche",
    "Leche",
    "lácteo",
    2,
    "Leche de vaca salvo que se indique otra cosa.",
    "Proteína, calcio y vitamina B12. Alérgeno de declaración obligatoria.",
    "alta"
  ],
  [
    "suero de leche",
    "Suero de leche",
    "lácteo",
    0,
    "Parte líquida que queda al cuajar la leche, normalmente en polvo.",
    "Aporta proteína de buena calidad, pero también lactosa, y se usa sobre todo como relleno barato.",
    "media"
  ],
  [
    "caseina",
    "Caseinato",
    "proteína láctea aislada",
    -1,
    "Proteína principal de la leche, extraída y añadida aparte.",
    "Se usa para dar cremosidad sin leche. Marcador de ultraprocesado. Alérgeno para quien lo sea a la leche.",
    "media"
  ],
  [
    "yogur",
    "Yogur",
    "lácteo fermentado",
    3,
    "Leche fermentada por bacterias vivas.",
    "Matriz fermentada con bacterias vivas, mejor tolerada que la leche y asociada a mejor salud metabólica. Salvo que le hayan añadido azúcar.",
    "alta"
  ],
  [
    "queso",
    "Queso",
    "lácteo",
    0,
    "Leche cuajada, escurrida y curada durante un tiempo que va de días a años.",
    "Calcio y proteína en cantidad, pero también grasa saturada y bastante sal. Depende mucho del tipo.",
    "alta"
  ],
  [
    "nata",
    "Nata",
    "lácteo graso",
    -1,
    "Parte grasa de la leche, separada.",
    "Muy alta en grasa saturada y densa en calorías.",
    "alta"
  ],
  [
    "mantequilla",
    "Mantequilla",
    "grasa láctea",
    -1,
    "Grasa de la leche, batida y separada del suero.",
    "Alrededor del 50 % de grasa saturada. Dentro de una dieta variada no es un problema en poca cantidad, pero conviene no abusar.",
    "alta"
  ],
  // --- Carne y pescado ----------------------------------------------------
  [
    "pechuga de pavo",
    "Pechuga de pavo",
    "carne blanca",
    2,
    "Músculo de pechuga de pavo. Ojo: en un fiambre, el porcentaje declarado dice cuánta carne lleva de verdad.",
    "Proteína magra de alto valor biológico. Si va en un fiambre con nitritos, lo que pesa en contra son los nitritos, no el pavo.",
    "alta"
  ],
  [
    "pollo",
    "Pollo",
    "carne blanca",
    2,
    "Carne de ave, magra o con piel según la pieza.",
    "Proteína magra, hierro y vitaminas del grupo B. Menos grasa saturada que las carnes rojas.",
    "alta"
  ],
  [
    "carne de cerdo",
    "Carne de cerdo",
    "carne",
    1,
    "Carne de cerdo, magra o con grasa según el corte.",
    "Buena proteína y vitamina B1. En productos procesados suele ir acompañada de sal y conservantes que sí pesan.",
    "alta"
  ],
  [
    "carne de vacuno",
    "Carne de vacuno",
    "carne roja",
    0,
    "Carne de ternera, añojo o vaca, según la edad del animal.",
    "Proteína, hierro hemo y B12. La OMS clasifica la carne roja como probable carcinógeno en consumo elevado, así que conviene moderar la frecuencia.",
    "alta"
  ],
  [
    "jamon",
    "Jamón",
    "carne curada",
    -1,
    "Pierna de cerdo curada con sal, y casi siempre con nitritos.",
    "Aporta proteína, pero también mucha sal. Si lleva nitritos, entra en la categoría de carne procesada, que la OMS clasifica como carcinógeno del grupo 1.",
    "alta"
  ],
  [
    "atun",
    "Atún",
    "pescado",
    2,
    "Pescado azul, fresco o en conserva.",
    "Proteína y omega-3. Los túnidos grandes acumulan mercurio, así que se desaconseja en embarazo e infancia.",
    "alta"
  ],
  [
    "salmon",
    "Salmón",
    "pescado azul",
    3,
    "Pescado azul, salvaje o de acuicultura.",
    "De las mejores fuentes de EPA y DHA, los omega-3 con efecto cardiovascular directo. También vitamina D.",
    "alta"
  ],
  [
    "sardina",
    "Sardina",
    "pescado azul",
    3,
    "Pescado azul pequeño, muy habitual en conserva.",
    "Omega-3, calcio si se come con espina, vitamina D y muy poco mercurio por ser pequeño.",
    "alta"
  ],
  [
    "gelatina",
    "Gelatina",
    "proteína animal",
    0,
    "Colágeno extraído de piel y huesos, casi siempre de cerdo o vacuno.",
    "Proteína de bajo valor biológico: le faltan aminoácidos esenciales. Cumple función de textura, no nutricional.",
    "alta"
  ],
  [
    "huevo",
    "Huevo",
    "proteína animal",
    2,
    "Huevo entero, o solo clara o yema si se especifica.",
    "La proteína de referencia con la que se comparan todas las demás. Aporta colina, vitamina D y luteína. Alérgeno declarado.",
    "alta"
  ],
  // --- Frutos secos y semillas --------------------------------------------
  [
    "almendra",
    "Almendra",
    "fruto seco",
    3,
    "Fruto seco, entero, laminado o en pasta.",
    "Grasa monoinsaturada, vitamina E, magnesio y fibra. Su consumo habitual se asocia a mejor perfil lipídico.",
    "alta"
  ],
  [
    "avellana",
    "Avellana",
    "fruto seco",
    3,
    "Fruto seco de sabor dulce, muy usado en cremas de cacao.",
    "Monoinsaturados y vitamina E. En una crema de cacao, mira el porcentaje: suele ser mucho menor que el de azúcar.",
    "alta"
  ],
  [
    "nuez",
    "Nuez",
    "fruto seco",
    3,
    "Fruto seco de cáscara dura y forma de cerebro, entero o troceado.",
    "Casi la única fuente vegetal corriente de omega-3 de cadena corta en cantidad apreciable.",
    "alta"
  ],
  [
    "pistacho",
    "Pistacho",
    "fruto seco",
    3,
    "Fruto seco verde, muchas veces salado.",
    "Proteína, fibra y potasio. Si viene salado, la sal cuenta aparte.",
    "alta"
  ],
  [
    "anacardo",
    "Anacardo",
    "fruto seco",
    2,
    "Semilla curva y de sabor suave que crece pegada al fruto del anacardo.",
    "Magnesio, hierro y grasa insaturada. Algo más de hidratos que otros frutos secos.",
    "alta"
  ],
  [
    "semilla de girasol",
    "Pipas de girasol",
    "semilla",
    2,
    "Semilla de girasol, con o sin cáscara.",
    "Vitamina E y grasa poliinsaturada. Muy ricas en omega-6, así que en exceso desequilibran la relación con el omega-3.",
    "media"
  ],
  [
    "sesamo",
    "Sésamo",
    "semilla",
    2,
    "Semilla pequeña, base del tahini.",
    "Calcio, hierro y lignanos. Alérgeno de declaración obligatoria.",
    "alta"
  ],
  [
    "chia",
    "Semillas de chía",
    "semilla",
    3,
    "Semilla que gelifica al hidratarse.",
    "Fibra soluble en cantidad y omega-3 de cadena corta.",
    "media"
  ],
  [
    "lino",
    "Lino",
    "semilla",
    3,
    "Semilla oleaginosa. Se absorbe mucho mejor molida que entera.",
    "Omega-3 de cadena corta, fibra y lignanos.",
    "media"
  ],
  // --- Fruta y verdura ----------------------------------------------------
  [
    "tomate",
    "Tomate",
    "hortaliza",
    2,
    "Tomate fresco, triturado o concentrado.",
    "Licopeno, potasio y vitamina C. El licopeno se absorbe mejor cocinado y con algo de grasa.",
    "alta"
  ],
  [
    "cebolla",
    "Cebolla",
    "hortaliza",
    2,
    "Bulbo de sabor fuerte, usado fresco, pochado o deshidratado en polvo.",
    "Quercetina y fructanos que alimentan a la microbiota.",
    "media"
  ],
  [
    "ajo",
    "Ajo",
    "hortaliza",
    2,
    "Diente de ajo, fresco o en polvo.",
    "Compuestos azufrados con efecto sobre la tensión y el perfil lipídico, aunque a las dosis de un condimento el efecto es modesto.",
    "media"
  ],
  [
    "zanahoria",
    "Zanahoria",
    "hortaliza",
    2,
    "Raíz naranja, usada cruda, cocida, en tiras o deshidratada.",
    "Betacarotenos, precursores de vitamina A, y fibra.",
    "alta"
  ],
  [
    "espinaca",
    "Espinaca",
    "verdura de hoja",
    3,
    "Hoja verde, fresca o congelada.",
    "Folato, hierro no hemo, magnesio y nitratos con efecto vasodilatador.",
    "alta"
  ],
  [
    "patata",
    "Patata",
    "tubérculo",
    0,
    "Tubérculo. Su efecto depende sobre todo de cómo se cocine.",
    "Potasio y vitamina C. Cocida y enfriada genera almidón resistente. Frita, cambia por completo su perfil.",
    "alta"
  ],
  [
    "manzana",
    "Manzana",
    "fruta",
    2,
    "Fruta entera, en trozos o en puré.",
    "Pectina, una fibra soluble, y polifenoles. En zumo pierde la fibra y el azúcar pasa a ser libre.",
    "alta"
  ],
  [
    "platano",
    "Plátano",
    "fruta",
    2,
    "Fruta. Cuanto más verde, más almidón resistente y menos azúcar libre.",
    "Potasio, vitamina B6 y fibra. Verde aporta almidón resistente, que alimenta a la microbiota; maduro, ese almidón se ha convertido ya en azúcar.",
    "alta"
  ],
  [
    "concentrado de zumo",
    "Concentrado de zumo",
    "azúcar de fruta",
    -2,
    "Zumo al que se ha quitado el agua, quedando el azúcar concentrado.",
    'Suena a fruta y es azúcar libre. Se usa para poder decir "sin azúcares añadidos" sin renunciar al dulzor.',
    "alta"
  ],
  // --- Otros --------------------------------------------------------------
  [
    "agua",
    "Agua",
    "agua",
    0,
    "Agua, normalmente añadida para dar volumen o textura.",
    "Neutra. Pero si aparece entre los primeros ingredientes de un fiambre o un embutido, significa que estás pagando peso en agua.",
    "alta"
  ],
  [
    "levadura",
    "Levadura",
    "fermento",
    1,
    "Hongo que fermenta la masa y la hace subir.",
    "Aporta vitaminas del grupo B y hace subir la masa. Sin pegas nutricionales, aunque una fermentación corta con levadura da un pan menos interesante que una masa madre lenta.",
    "alta"
  ],
  [
    "masa madre",
    "Masa madre",
    "fermento",
    3,
    "Fermento natural de harina y agua, con levaduras y bacterias del ambiente.",
    'La fermentación larga baja el índice glucémico, degrada parte del ácido fítico y libera minerales que estaban bloqueados. Comprueba que no sea "masa madre deshidratada" como mero aromatizante.',
    "media"
  ],
  [
    "extracto de levadura",
    "Extracto de levadura",
    "potenciador natural",
    -1,
    "Levadura descompuesta para liberar sus compuestos de sabor.",
    "Es glutamato por otro nombre: potencia el sabor sin tener que declarar E621. Marcador de ultraprocesado.",
    "media"
  ],
  [
    "cacao",
    "Cacao",
    "cacao",
    2,
    "Semilla de cacao molida y normalmente desgrasada.",
    "Flavanoles con efecto sobre la función vascular, magnesio y hierro. Su valor depende del porcentaje: en una crema con 7 % de cacao y 56 % de azúcar, manda el azúcar.",
    "alta"
  ],
  [
    "manteca de cacao",
    "Manteca de cacao",
    "grasa vegetal",
    0,
    "Grasa natural del grano de cacao, separada al prensarlo.",
    "Muy saturada, pero su ácido esteárico apenas eleva el colesterol LDL, a diferencia de otras saturadas.",
    "media"
  ],
  [
    "sal",
    "Sal",
    "sal",
    -1,
    "Cloruro sódico añadido al producto para conservar y dar sabor.",
    "Necesaria en pequeña cantidad, pero la media española dobla el límite de 5 g diarios de la OMS. Es el principal factor dietético modificable de la hipertensión.",
    "alta"
  ],
  [
    "vinagre",
    "Vinagre",
    "acidulante",
    1,
    "Producto de la fermentación acética del vino, la manzana u otros.",
    "Conserva sin aditivos y hay indicios de que modera la respuesta glucémica de una comida.",
    "media"
  ],
  [
    "especias",
    "Especias",
    "condimento",
    1,
    "Mezcla de especias, casi nunca detallada.",
    "Aportan sabor sin sal ni azúcar. Sin pegas, aunque no se sabe cuáles son.",
    "media"
  ],
  [
    "aroma",
    "Aromas",
    "aroma",
    -1,
    "Sustancias que dan sabor, naturales o de síntesis. La ley no obliga a detallar cuáles.",
    "No son tóxicas, pero su presencia es uno de los marcadores más fiables de ultraprocesado: hace falta añadir sabor porque el producto no lo tiene por sí mismo.",
    "alta"
  ],
  [
    "aroma natural",
    "Aroma natural",
    "aroma",
    -1,
    '"Natural" aquí significa que la molécula procede de una fuente natural, no que sea el alimento original.',
    "La etiqueta suena bien, pero el papel es el mismo: dar sabor a algo que no lo tiene. Sigue siendo marcador de ultraprocesado.",
    "alta"
  ],
  [
    "fibra vegetal",
    "Fibra vegetal aislada",
    "fibra añadida",
    0,
    "Fibra extraída de una planta y añadida aparte.",
    "Suma en la tabla nutricional, pero no equivale a la fibra que viene dentro de un alimento entero.",
    "media"
  ],
  [
    "inulina",
    "Inulina",
    "fibra añadida",
    1,
    "Fibra soluble extraída sobre todo de la achicoria.",
    "Prebiótica de verdad: alimenta a la microbiota. En cantidad da gases y sienta mal en colon irritable.",
    "media"
  ],
  [
    "cafeina",
    "Cafeína",
    "estimulante",
    -1,
    "Estimulante del sistema nervioso, natural o añadido.",
    "La EFSA sitúa el límite en 400 mg diarios para adultos y 200 mg en embarazo. Altera el sueño hasta seis horas después de tomarla.",
    "alta"
  ],
  [
    "alto oleico",
    "Aceite alto oleico",
    "grasa vegetal",
    1,
    "Aceite de girasol de una variedad seleccionada para que sea rico en ácido oleico, el mismo del aceite de oliva.",
    "Su perfil de grasas se parece al del aceite de oliva y aguanta mucho mejor el calor que el girasol corriente, así que se oxida menos al freír. Sigue siendo un aceite refinado, sin los polifenoles del virgen extra.",
    "media"
  ],
  [
    "aroma de humo",
    "Aroma de humo",
    "aroma",
    -1,
    "Condensado de humo, usado para dar sabor ahumado sin ahumar.",
    "Evita algunos compuestos del ahumado tradicional, pero su presencia delata un producto formulado.",
    "media"
  ]
];
var INGREDIENTES_COMUNES = FILAS2.map(
  ([patron, titulo, categoria, valoracion, queEs, porQue, evidencia]) => ({
    patron,
    titulo,
    categoria,
    valoracion,
    queEs,
    porQue,
    evidencia
  })
);

// src/nucleo/explicar.ts
function veredictoDe(v2) {
  if (v2 > 0) return "favorable";
  if (v2 < 0) return "limitar";
  return "neutro";
}
function casa(texto, patron) {
  const p = patron.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${p}([^a-z0-9]|$)`).test(texto);
}
var FUNCIONES_DECLARADAS = [
  "emulgente",
  "emulgentes",
  "conservador",
  "conservadores",
  "conservante",
  "conservantes",
  "colorante",
  "colorantes",
  "antioxidante",
  "antioxidantes",
  "estabilizante",
  "estabilizantes",
  "espesante",
  "espesantes",
  "gelificante",
  "gelificantes",
  "acidulante",
  "acidulantes",
  "corrector de acidez",
  "correctores de acidez",
  "potenciador del sabor",
  "potenciadores del sabor",
  "edulcorante",
  "edulcorantes",
  "antiaglomerante",
  "antiaglomerantes",
  "gasificante",
  "gasificantes",
  "humectante",
  "humectantes",
  "aroma",
  "aromas",
  "agente de tratamiento de la harina"
];
function explicarIngrediente(texto, porcentaje, profundidad = 0) {
  const t = normalizarTexto(texto);
  if (profundidad === 0 && t.includes(" ")) {
    const dosPuntos = texto.indexOf(":");
    if (dosPuntos > 0) {
      const funcion = normalizarTexto(texto.slice(0, dosPuntos));
      const sustancia = texto.slice(dosPuntos + 1).trim();
      if (FUNCIONES_DECLARADAS.some((f) => funcion === f || funcion.endsWith(" " + f)) && sustancia.length > 2) {
        const e = explicarIngrediente(sustancia, porcentaje, 1);
        if (e.veredicto !== "sin_ficha") {
          return { ...e, texto: texto.trim(), categoria: e.categoria || funcion };
        }
      }
    }
  }
  const alergenos = ALERGENOS.filter((a) => a.patrones.some((p) => casa(t, p))).map((a) => a.nombre);
  const base = {
    texto: texto.trim(),
    porcentaje,
    alergenos
  };
  const mE = t.match(/\be\s?-?\s?(\d{3,4}\s?[a-z]?)\b/i);
  if (mE) {
    const ad = buscarAditivo("E" + mE[1].replace(/\s/g, ""));
    if (ad) {
      return {
        ...base,
        titulo: `${ad.codigo} · ${ad.nombre}`,
        categoria: ad.funcion,
        veredicto: ad.riesgo === 0 ? "neutro" : "limitar",
        valoracion: -ad.riesgo,
        queEs: ad.fichado === false ? `Aditivo alimentario. Por su numeración es un ${ad.funcion}.` : `Aditivo alimentario que cumple la función de ${ad.funcion}.`,
        porQue: ad.motivo,
        evidencia: ad.evidencia,
        codigoE: ad.codigo,
        fuentes: fuentesDe(ad.fuentes ?? ["ue-1333"])
      };
    }
  }
  let mejorAlias = "";
  for (const alias of Object.keys(ALIAS_ADITIVOS)) {
    if (casa(t, alias) && alias.length > mejorAlias.length) mejorAlias = alias;
  }
  if (mejorAlias) {
    const ad = buscarAditivo(ALIAS_ADITIVOS[mejorAlias]);
    if (ad) {
      return {
        ...base,
        titulo: `${ad.codigo} · ${ad.nombre}`,
        categoria: ad.funcion,
        veredicto: ad.riesgo === 0 ? "neutro" : "limitar",
        valoracion: -ad.riesgo,
        queEs: `Aditivo alimentario que cumple la función de ${ad.funcion}. En la etiqueta aparece por su nombre y no por su código.`,
        porQue: ad.motivo,
        evidencia: ad.evidencia,
        codigoE: ad.codigo,
        fuentes: fuentesDe(ad.fuentes ?? ["ue-1333"])
      };
    }
  }
  const candidatas = INGREDIENTES_COMUNES.filter((f) => casa(t, f.patron));
  if (candidatas.length > 0) {
    const f = candidatas.reduce((a, b) => b.patron.length > a.patron.length ? b : a);
    return {
      ...base,
      titulo: f.titulo,
      categoria: f.categoria,
      veredicto: veredictoDe(f.valoracion),
      valoracion: f.valoracion,
      queEs: f.queEs,
      porQue: f.porQue,
      evidencia: f.evidencia,
      fuentes: fuentesDe(f.valoracion <= -2 ? ["oms-azucar", "nova"] : ["nova", "ue-1169"])
    };
  }
  const grasas = GRASAS.filter((g) => g.prefijo ? t.includes(g.patron) : casa(t, g.patron));
  if (grasas.length > 0) {
    const g = grasas.reduce((a, b) => b.patron.length > a.patron.length ? b : a);
    return {
      ...base,
      titulo: g.etiqueta,
      categoria: "grasa o aceite",
      veredicto: veredictoDe(g.valor),
      valoracion: g.valor,
      queEs: "Grasa o aceite usado en la elaboración del producto.",
      porQue: g.motivo,
      evidencia: "media",
      fuentes: fuentesDe(g.valor <= -3 ? ["oms-trans"] : ["fsa-semaforo"])
    };
  }
  const azucares = AZUCARES_ANADIDOS.filter((a) => casa(t, a));
  if (azucares.length > 0) {
    const a = azucares.reduce((x, y) => y.length > x.length ? y : x);
    return {
      ...base,
      titulo: texto.trim(),
      categoria: "azúcar añadido",
      veredicto: "limitar",
      valoracion: -2,
      queEs: `Es azúcar libre, aunque el nombre no lo diga. En la etiqueta aparece como "${a}".`,
      porQue: "Cuenta como azúcar añadido en el total del día. Repartirlo en varias formas distintas hace que ninguna suba a los primeros puestos de la lista, aunque sumadas sean el ingrediente principal.",
      evidencia: "alta",
      fuentes: fuentesDe(["oms-azucar", "ue-1169"])
    };
  }
  const upf = MARCADORES_UPF.find((m) => t.includes(m.patron));
  if (upf) {
    return {
      ...base,
      titulo: upf.etiqueta,
      categoria: "marcador de ultraprocesado",
      veredicto: "limitar",
      valoracion: -1,
      queEs: "Sustancia de uso industrial que no encontrarías en una cocina doméstica.",
      porQue: "No es tóxica por sí misma, pero su presencia delata una formulación industrial. El grado de ultraprocesado se asocia a peores resultados de salud incluso ajustando por la composición nutricional.",
      evidencia: "alta",
      fuentes: fuentesDe(["nova"])
    };
  }
  return {
    ...base,
    titulo: texto.trim(),
    categoria: "sin clasificar",
    veredicto: "sin_ficha",
    valoracion: 0,
    queEs: "No tenemos ficha de este ingrediente todavía.",
    porQue: "No podemos decir si suma o resta. No cuenta ni a favor ni en contra de la nota.",
    evidencia: "baja",
    fuentes: []
  };
}
function explicarLista(ingredientes) {
  return ingredientes.map((i) => explicarIngrediente(i.texto, i.porcentaje));
}
export {
  ADITIVOS,
  ALERGENOS,
  AVISO_ALERGENOS,
  CATALOGO,
  COLORES_SEMAFORO,
  ETIQUETAS_SEMAFORO,
  FUENTES,
  RECORTE_COMPLETO,
  RepositorioIndexedDB,
  RepositorioMemoria,
  UMBRALES_CALIDAD,
  VERSION_ALGORITMO,
  aGrises,
  analizarIngredientesTexto,
  analizarProducto,
  analizarTabla,
  binarizarSauvola,
  buscar,
  buscarAditivo,
  calcularConfianza,
  contarSustancias,
  crearImagen,
  desconocido,
  estirarContraste,
  evaluarCalidad,
  explicarIngrediente,
  explicarLista,
  exportar,
  extraerNumeros,
  ficha,
  filtrarYOrdenar,
  fuentesDe,
  hay,
  hayIndexedDB,
  hayRecorte,
  importar,
  leido,
  nombreFichero,
  normalizar,
  normalizarNutrientes,
  nuevoId,
  partirRespetandoParentesis,
  prepararParaLectura,
  recortar,
  recorteRelativo,
  redimensionar,
  resumenCatalogo,
  validar,
  validarContraIngredientes,
  validarCopia
};
