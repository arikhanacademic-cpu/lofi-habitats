/* ================= Data ================= */
const HAB = {
 savannah:{name:'Savannah',place:'Serengeti, Tanzania',lat:-2.3,lon:34.8,tz:'Africa/Dar_es_Salaam',kind:'land',transpose:-5,
   desc:'The biggest animals here sleep the least. Wild elephants manage about two hours a night, often standing up. The plains turn green in the wet season, from about November to May.',alias:'serengeti tanzania africa savanna kenya grassland safari'},
 rainforest:{name:'Rainforest',place:'Amazon, near Manaus, Brazil',lat:-3.1,lon:-60.0,tz:'America/Manaus',kind:'land',transpose:3,
   desc:'Close to the equator, so day and night are each about 12 hours long all year. From about April to July the rivers rise and flood the forest floor.',alias:'amazon brazil jungle manaus south america tropical'},
 reef:{name:'Coral reef',place:'Great Barrier Reef, off Cairns, Australia',lat:-16.9,lon:146.0,tz:'Australia/Brisbane',kind:'water',transpose:0,
   desc:'At night the reef changes shift. Day fish tuck into crevices, and the hunters and filter-feeders come out. A few nights after the full moon in November or December, the corals spawn.',alias:'australia great barrier reef ocean sea coral cairns queensland'},
 deep:{name:'Deep sea',place:'Monterey Canyon, California · 0–1,000 m',lat:36.8,lon:-122.0,tz:'America/Los_Angeles',kind:'deep',transpose:-7,
   desc:'No sunlight reaches the bottom, but the clock still matters. Every night, animals rise hundreds of metres to feed, then sink again at dawn.',alias:'monterey california pacific ocean abyss deep sea canyon usa'},
 arctic:{name:'Arctic',place:'Svalbard, Norway · 78°N',lat:78.2,lon:15.6,tz:'Arctic/Longyearbyen',kind:'land',transpose:-2,
   desc:'So far north that the sun stays up for months in summer and stays down for months in winter. Many animals here ignore the clock.',alias:'svalbard norway north pole ice snow polar longyearbyen'},
 antarctica:{name:'Antarctica',place:'Snow Hill Island, Antarctica · 64°S',lat:-64.5,lon:-57.4,tz:'America/Argentina/Ushuaia',kind:'land',transpose:-4,
   desc:'The seasons are flipped from the Arctic. Emperor penguins raise their chicks through the dark winter, while other penguins and the orcas only arrive for summer.',alias:'antarctica south pole penguin ice snow hill antarctic peninsula'},
 desert:{name:'Desert',place:'Erg Chebbi dunes, near Merzouga, Morocco',lat:31.15,lon:-4.0,tz:'Africa/Casablanca',kind:'land',transpose:1,
   desc:'Most animals here avoid the heat by coming out at night. The Saharan silver ant does the opposite and runs out at the hottest time of day.',alias:'sahara desert morocco merzouga dunes africa sand'},
 london:{name:'London',place:'London, United Kingdom',lat:51.51,lon:-0.12,tz:'Europe/London',kind:'land',transpose:2,
   desc:'Britain’s biggest city has a night shift too. Foxes, hedgehogs, bats and owls live between the houses and parks, and some of them hibernate through the winter.',alias:'london uk england britain city urban'},
};
const HAB_ORDER=['savannah','rainforest','reef','deep','arctic','antarctica','desert','london'];

const A = [
 // Reef
 {id:'clownfish',name:'Clownfish',sci:'Amphiprion percula',hab:'reef',sp:'clownfish',r:'diurnal',move:'swim',x:78,y:136,rx:9,ry:3,spd:1.2,sx:78,sy:144,voice:'bubble',on:'Darting around its anemone',off:'Tucked into its anemone',fact:'Its slimy coating stops the anemone’s stinging tentacles from firing, so the anemone works as a bedroom with built-in security.',alias:'nemo fish'},
 {id:'parrotfish',name:'Parrotfish',sci:'Scarus sp.',hab:'reef',sp:'parrotfish',r:'diurnal',move:'swim',x:170,y:100,rx:70,ry:8,spd:.4,sx:28,sy:130,cocoon:true,voice:'click',on:'Crunching algae off the coral',off:'Asleep in a mucus cocoon',fact:'Some parrotfish wrap themselves in a see-through mucus bubble at night, which is thought to hide their scent from predators and parasites.',alias:'fish'},
 {id:'turtle',name:'Green sea turtle',sci:'Chelonia mydas',hab:'reef',sp:'turtle',r:'diurnal',move:'swim',x:160,y:62,rx:90,ry:10,spd:.2,sx:212,sy:150,voice:'bubble',on:'Grazing on seagrass',off:'Resting under a table coral',fact:'Resting turtles can stay underwater for hours, slowing their heart rate to save oxygen.',alias:'turtle reptile'},
 {id:'manta',name:'Reef manta ray',sci:'Mobula alfredi',hab:'reef',sp:'manta',r:'constant',rl:'Never fully stops swimming',move:'swim',x:180,y:34,rx:80,ry:5,spd:.18,voice:'low',on:'Gliding over the reef',off:'',fact:'Mantas have to keep moving to push water over their gills. By day they queue at “cleaning stations” where small fish pick them clean.',alias:'ray stingray'},
 {id:'whitetip',name:'Whitetip reef shark',sci:'Triaenodon obesus',hab:'reef',sp:'whitetip',r:'nocturnal',move:'swim',x:160,y:122,rx:110,ry:8,spd:.3,sx:284,sy:153,voice:'bubble',on:'Hunting through the coral',off:'Lying still in a cave',fact:'Unlike many sharks, it can pump water over its gills, so it can lie on the bottom of a cave all day and hunt at night.',alias:'shark'},
 {id:'moray',name:'Giant moray',sci:'Gymnothorax javanicus',hab:'reef',sp:'moray',r:'nocturnal',move:'swim',x:120,y:146,rx:50,ry:3,spd:.35,sx:24,sy:139,voice:'bubble',on:'Hunting by smell',off:'Waiting in its crevice',fact:'Morays open and close their mouths constantly. It looks threatening, but it’s how they breathe.',alias:'eel'},
 {id:'polyps',name:'Coral polyps',sci:'Acropora sp.',hab:'reef',sp:'polyps',r:'nocturnal',move:'still',x:228,y:152,copies:[[-100,0],[46,0]],voice:'ping',on:'Tentacles out, catching plankton',off:'Tentacles pulled in',fact:'Coral is made of thousands of tiny animals. Many reef corals extend their tentacles at night to catch plankton, and on a few nights a year they all spawn at once.',alias:'coral'},
 {id:'crayfish',name:'Painted crayfish',sci:'Panulirus versicolor',hab:'reef',sp:'crayfish',r:'nocturnal',move:'walk',x:130,y:166,rx:60,spd:.25,sx:14,sy:158,hide:true,voice:'click',on:'Foraging across the sand',off:'Hidden in a crevice',fact:'By day only its long white antennae poke out of the reef. It comes out after dark to feed.',alias:'lobster crayfish crustacean'},
 // Arctic
 {id:'polarbear',name:'Polar bear',sci:'Ursus maritimus',hab:'arctic',sp:'polarbear',r:'cathemeral',per:6,act:.62,ph:0,move:'walk',x:150,y:170,rx:60,spd:.16,sx:96,sy:172,voice:'roar',on:'Patrolling the sea ice',off:'Napping in a snow pit',fact:'Polar bears don’t keep a strict day–night schedule. They sleep around 7 to 8 hours a day, often in a pit dug into the snow.',alias:'bear'},
 {id:'arcticfox',name:'Arctic fox',sci:'Vulpes lagopus',hab:'arctic',sp:'arcticfox',spS:{months:[6,7,8,9],sp:'arcticfox_s'},r:'cathemeral',per:4,act:.6,ph:2,move:'walk',x:222,y:154,rx:50,spd:.4,sx:262,sy:164,voice:'bark',on:'Trotting after polar bears for scraps',off:'Curled up, tail over its nose',fact:'Its coat turns from white in winter to brown-grey in summer. In summer it stashes food like seabird eggs to dig up in winter.',alias:'fox'},
 {id:'walrus',name:'Walrus',sci:'Odobenus rosmarus',hab:'arctic',sp:'walrus',r:'cathemeral',per:7,act:.6,ph:1,move:'still',x:62,y:132,sx:62,sy:132,voice:'low',on:'About to dive for clams',off:'Dozing on the ice edge',fact:'Walruses can stay awake for over 80 hours at sea. They can also sleep floating, held up by air pouches in their throat.',alias:'seal'},
 {id:'reindeer',name:'Svalbard reindeer',sci:'Rangifer tarandus platyrhynchus',hab:'arctic',sp:'reindeer',r:'cathemeral',per:3,act:.6,ph:1.5,move:'walk',x:276,y:142,rx:22,spd:.14,sx:292,sy:144,voice:'grunt',on:'Grazing through the snow',off:'Lying down, chewing the cud',fact:'Their internal clock switches off during the polar day and polar night, and they feed in bouts around the clock.',alias:'caribou deer'},
 {id:'ptarmigan',name:'Svalbard rock ptarmigan',sci:'Lagopus muta hyperborea',hab:'arctic',sp:'ptarmigan',spS:{months:[5,6,7,8,9],sp:'ptarmigan_s'},r:'diurnal',move:'hop',x:180,y:138,rx:14,spd:.5,sx:192,sy:140,voice:'croak',on:'Pecking at plants under the snow',off:'Roosting in a snow hollow',fact:'The only bird that lives on Svalbard all year. It moults from mottled brown in summer to white in winter, and croaks rather than sings.',alias:'bird grouse'},
 {id:'ringedseal',name:'Ringed seal',sci:'Pusa hispida',hab:'arctic',sp:'ringedseal',r:'cathemeral',per:5,act:.6,ph:4,move:'swim',x:140,y:118,rx:50,ry:1,spd:.3,sx:203,sy:112,voice:'ping',on:'Fishing under the ice',off:'Hauled out on a floe',fact:'It keeps breathing holes open through thick sea ice by scratching with its claws.',alias:'seal'},
 {id:'tern',name:'Arctic tern',sci:'Sterna paradisaea',hab:'arctic',sp:'tern',r:'diurnal',months:[5,6,7,8,9],awayNote:'Wintering in Antarctica',back:'May',move:'fly',x:160,y:50,rx:100,ry:10,spd:.35,sx:130,sy:132,voice:'chirp',on:'Diving for fish',off:'Resting on the shore',fact:'It has the longest migration of any animal, flying between the Arctic and Antarctica each year, about 70,000 km on average.',alias:'bird'},
 {id:'littleauk',name:'Little auk',sci:'Alle alle',hab:'arctic',sp:'littleauk',r:'diurnal',months:[4,5,6,7,8],awayNote:'Out at sea in the North Atlantic',back:'April',move:'swim',x:96,y:118,rx:25,ry:1,spd:.45,sx:96,sy:118,voice:'chirp',on:'Diving for tiny crustaceans',off:'In its rock crevice nest',fact:'Svalbard’s most numerous bird, with colonies of over a million pairs in summer.',alias:'bird puffin'},
 // Rainforest
 {id:'jaguar',name:'Jaguar',sci:'Panthera onca',hab:'rainforest',sp:'jaguar',r:'crepuscular',move:'walk',x:170,y:176,rx:90,spd:.25,sx:100,sy:130,voice:'roar',on:'Stalking the forest floor',off:'Resting along a branch',fact:'Most active around dawn and dusk. A strong swimmer that hunts caimans and fish, even in the flooded forest.',alias:'big cat panther leopard'},
 {id:'sloth',name:'Brown-throated sloth',sci:'Bradypus variegatus',hab:'rainforest',sp:'sloth',r:'cathemeral',per:8,act:.55,ph:1,move:'walk',x:206,y:95,rx:10,spd:.04,sx:236,sy:95,voice:'ping',on:'Creeping along a branch',off:'Hanging asleep',fact:'Wild sloths sleep about 10 hours a day, not the 15 to 20 hours often claimed from studies of sloths in zoos.',alias:'sloth'},
 {id:'macaw',name:'Scarlet macaw',sci:'Ara macao',hab:'rainforest',sp:'macaw',r:'diurnal',move:'fly',x:170,y:40,rx:110,ry:8,spd:.28,sx:72,sy:54,voice:'squawk',on:'Flying to a clay lick',off:'Roosting with the flock',fact:'Flocks leave their roosts at dawn and gather at riverbank clay licks, eating clay that may help with toxins in their diet.',alias:'parrot bird'},
 {id:'toucan',name:'White-throated toucan',sci:'Ramphastos tucanus',hab:'rainforest',sp:'toucan',r:'diurnal',move:'hop',x:118,y:54,rx:8,spd:.5,sx:122,sy:54,voice:'croak',on:'Picking fruit with its bill',off:'Asleep, bill tucked over its back',fact:'At night it folds its tail forward and turns its bill back over its body to sleep as a compact ball of feathers.',alias:'bird'},
 {id:'howler',name:'Red howler monkey',sci:'Alouatta seniculus',hab:'rainforest',sp:'howler',r:'diurnal',move:'hop',x:188,y:93,rx:10,spd:.4,sx:180,sy:93,voice:'howl',on:'Howling to the neighbours',off:'Sleeping in the branches',fact:'Its dawn chorus can carry several kilometres through the forest, one of the loudest calls of any land animal.',alias:'monkey primate ape'},
 {id:'dartfrog',name:'Amazonian poison frog',sci:'Ranitomeya ventrimaculata',hab:'rainforest',sp:'dartfrog',r:'diurnal',move:'hop',x:222,y:139,rx:8,spd:.7,sx:230,sy:139,voice:'trill',on:'Hopping on a leaf',off:'Hiding under a leaf',fact:'Active by day because its bright colours warn predators off. Fathers carry tadpoles on their backs to tiny pools of water.',alias:'frog toad amphibian'},
 {id:'milkfrog',name:'Amazon milk frog',sci:'Trachycephalus resinifictrix',hab:'rainforest',sp:'milkfrog',r:'nocturnal',move:'hop',x:256,y:92,rx:6,spd:.6,sx:262,sy:92,voice:'croak',on:'Calling from the canopy',off:'Pressed flat against a branch',fact:'It lives high in the canopy and gives off a sticky white fluid when threatened, which is where the name comes from.',alias:'frog toad amphibian'},
 {id:'nightmonkey',name:'Night monkey',sci:'Aotus nigriceps',hab:'rainforest',sp:'nightmonkey',r:'nocturnal',move:'hop',x:78,y:129,rx:16,spd:.45,sx:34,sy:121,voice:'hoot',on:'Foraging for fruit in the dark',off:'Sleeping in a tree hollow',fact:'The only truly nocturnal monkey. Its huge eyes help it see by moonlight.',alias:'owl monkey primate'},
 {id:'morpho',name:'Blue morpho',sci:'Morpho menelaus',hab:'rainforest',sp:'morpho',r:'diurnal',move:'fly',x:140,y:110,rx:70,ry:14,spd:.45,sx:150,sy:138,voice:'ping',on:'Flashing blue through the trees',off:'Wings folded, camouflaged',fact:'The undersides of its wings are brown with eyespots, so it seems to blink in and out of view as it flies.',alias:'butterfly insect'},
 // Savannah
 {id:'lion',name:'Lion',sci:'Panthera leo',hab:'savannah',sp:'lion',r:'nocturnal',move:'walk',x:120,y:170,rx:70,spd:.2,sx:258,sy:158,voice:'roar',on:'Out hunting',off:'Dozing in the shade',fact:'Lions rest for up to 20 hours a day and do most of their hunting after dark.',alias:'big cat'},
 {id:'elephant',name:'African elephant',sci:'Loxodonta africana',hab:'savannah',sp:'elephant',r:'cathemeral',per:12,act:.85,ph:9,move:'walk',x:124,y:142,rx:20,spd:.06,sx:118,sy:142,voice:'low',on:'Browsing and walking',off:'Sleeping standing up',fact:'Wild elephants sleep only about two hours a night, the least of any mammal studied, and often do it standing up.',alias:'elephant'},
 {id:'giraffe',name:'Masai giraffe',sci:'Giraffa tippelskirchi',hab:'savannah',sp:'giraffe',r:'cathemeral',per:4,act:.85,ph:1,move:'walk',x:206,y:136,rx:16,spd:.08,sx:212,sy:136,voice:'low',on:'Browsing acacia leaves',off:'Napping on its feet',fact:'Giraffes sleep in short bursts, often just a few minutes at a time. At night they make a low humming sound.',alias:'giraffe'},
 {id:'zebra',name:'Plains zebra',sci:'Equus quagga',hab:'savannah',sp:'zebra',r:'cathemeral',per:5,act:.7,ph:1,move:'walk',x:150,y:162,rx:46,spd:.11,sx:170,sy:162,voice:'bark',on:'Grazing with the herd',off:'Sleeping standing up',fact:'Zebras often sleep standing, and in groups so that some members stay alert for lions.',alias:'horse'},
 {id:'wildebeest',name:'Wildebeest',sci:'Connochaetes taurinus',hab:'savannah',sp:'wildebeest',r:'cathemeral',per:6,act:.7,ph:3,months:[11,12,1,2,3,4,5,6,7],awayNote:'Following the rains in Kenya’s Masai Mara',back:'November',move:'walk',x:26,y:126,rx:10,spd:.1,sx:26,sy:126,copies:[[26,-5],[50,2]],voice:'grunt',on:'Grazing on the move',off:'Resting with the herd',fact:'Over a million wildebeest loop between the Serengeti and Kenya’s Masai Mara every year, following the rain and fresh grass.',alias:'gnu antelope migration'},
 {id:'cheetah',name:'Cheetah',sci:'Acinonyx jubatus',hab:'savannah',sp:'cheetah',r:'diurnal',move:'walk',x:180,y:177,rx:90,spd:.4,sx:300,sy:176,voice:'chirp',on:'Scanning for gazelles',off:'Lying low in the grass',fact:'It hunts by day, partly to avoid lions and hyenas, which do most of their hunting at night. It chirps like a bird instead of roaring.',alias:'big cat'},
 {id:'hyena',name:'Spotted hyena',sci:'Crocuta crocuta',hab:'savannah',sp:'hyena',r:'nocturnal',move:'walk',x:210,y:166,rx:70,spd:.3,sx:26,sy:164,voice:'whoop',on:'Hunting with the clan',off:'Asleep at the den',fact:'Spotted hyenas hunt more than they scavenge. Their whooping calls carry several kilometres at night.',alias:'hyena dog'},
 {id:'aardvark',name:'Aardvark',sci:'Orycteropus afer',hab:'savannah',sp:'aardvark',r:'nocturnal',move:'walk',x:78,y:172,rx:20,spd:.18,sx:60,sy:172,hide:true,voice:'grunt',on:'Digging into a termite mound',off:'Asleep in its burrow',fact:'It can eat tens of thousands of termites in a single night, lapping them up with a sticky tongue up to 30 cm long.',alias:'anteater'},
 {id:'vulture',name:'White-backed vulture',sci:'Gyps africanus',hab:'savannah',sp:'vulture',r:'diurnal',move:'fly',x:160,y:40,rx:80,ry:6,spd:.14,sx:282,sy:89,voice:'squawk',on:'Soaring on thermals',off:'Roosting in the acacia',fact:'It waits until mid-morning, when the sun has warmed the ground enough to make rising air currents for it to soar on.',alias:'bird'},
 // Deep sea
 {id:'lanternfish',name:'Lanternfish',sci:'Myctophidae',hab:'deep',sp:'lanternfish',r:'migrator',move:'swim',x:110,dayY:108,nightY:26,rx:60,ry:3,spd:.35,copies:[[-14,-6],[12,5],[26,-3],[-28,4],[5,-11],[-6,10]],voice:'ping',on:'',off:'',fact:'Every night they swim hundreds of metres up to feed, part of the largest daily migration on Earth. They light up with glowing spots called photophores.',alias:'fish'},
 {id:'humboldt',name:'Humboldt squid',sci:'Dosidicus gigas',hab:'deep',sp:'humboldt',r:'migrator',move:'swim',x:190,dayY:80,nightY:34,rx:70,ry:4,spd:.26,voice:'low',on:'',off:'',fact:'By day it hides in low-oxygen water hundreds of metres down, then rises at night to hunt in packs. It can flash red and white.',alias:'squid octopus'},
 {id:'krill',name:'Pacific krill',sci:'Euphausia pacifica',hab:'deep',sp:'krill',r:'migrator',move:'swim',x:56,dayY:56,nightY:12,rx:30,ry:2,spd:.45,copies:[[-8,-4],[8,3],[13,-5],[-13,4],[3,6],[18,1],[-4,-8]],voice:'ping',on:'',off:'',fact:'Tiny but crucial. Their nightly rise to the surface brings them within reach of whales, seabirds and fish.',alias:'shrimp plankton'},
 {id:'angler',name:'Anglerfish',sci:'Melanocetus johnsonii',hab:'deep',sp:'angler',r:'constant',rl:'Always waiting in the dark',move:'swim',x:62,y:160,rx:3,ry:1,spd:.1,voice:'ping',on:'Dangling its glowing lure',off:'',fact:'Its lure glows thanks to bacteria living inside it. It saves energy by staying still until prey swims close.',alias:'fish'},
 {id:'barreleye',name:'Barreleye',sci:'Macropinna microstoma',hab:'deep',sp:'barreleye',r:'constant',rl:'Always waiting in the dark',move:'swim',x:196,y:124,rx:8,ry:1,spd:.08,voice:'ping',on:'Hovering, eyes pointed up',off:'',fact:'It has a see-through head, and its green tube-shaped eyes can rotate to look up through it. Scientists filmed it alive here in Monterey Canyon.',alias:'fish'},
 {id:'vampsquid',name:'Vampire squid',sci:'Vampyroteuthis infernalis',hab:'deep',sp:'vampsquid',r:'constant',rl:'Always waiting in the dark',move:'swim',x:86,y:138,rx:16,ry:2,spd:.1,voice:'low',on:'Drifting in the dark',off:'',fact:'Despite the name, it eats “marine snow”: drifting flakes of dead plankton and other debris, gathered on sticky filaments.',alias:'squid octopus'},
 {id:'larvacean',name:'Giant larvacean',sci:'Bathochordaeus',hab:'deep',sp:'larvacean',r:'constant',rl:'Always waiting in the dark',move:'swim',x:166,y:48,rx:4,ry:1,spd:.08,voice:'ping',on:'Filtering through its mucus house',off:'',fact:'This tadpole-sized animal builds a mucus “house” up to a metre wide to filter food, then abandons it and builds a new one.',alias:'plankton'},
 // London
 {id:'redfox',name:'Urban red fox',sci:'Vulpes vulpes',hab:'london',sp:'redfox',r:'nocturnal',move:'walk',x:160,y:172,rx:80,spd:.3,sx:214,sy:134,voice:'scream',on:'Checking the bins',off:'Asleep under a bush',fact:'London has one of the densest urban fox populations in the world. The eerie screams you hear in winter are part of the mating season.',alias:'fox'},
 {id:'hedgehog',name:'Hedgehog',sci:'Erinaceus europaeus',hab:'london',sp:'hedgehog',r:'nocturnal',hibernate:[11,12,1,2,3],move:'walk',x:100,y:173,rx:40,spd:.25,sx:296,sy:172,hide:true,voice:'snuffle',on:'Snuffling for beetles and worms',off:'Asleep in the leaf pile',fact:'Hedgehogs can travel a couple of kilometres a night looking for food, which is why gardeners cut small “hedgehog highways” in fences.',alias:'hedgehog'},
 {id:'pipistrelle',name:'Common pipistrelle',sci:'Pipistrellus pipistrellus',hab:'london',sp:'pipistrelle',r:'nocturnal',hibernate:[11,12,1,2,3],move:'fly',x:150,y:84,rx:30,ry:10,spd:.9,sx:60,sy:64,hide:true,voice:'click',on:'Catching insects around the streetlight',off:'Roosting under the roof tiles',fact:'It weighs about 5 g, the same as a 20p coin, and can eat thousands of tiny insects in a night.',alias:'bat'},
 {id:'pigeon',name:'Feral pigeon',sci:'Columba livia',hab:'london',sp:'pigeon',r:'diurnal',move:'walk',x:70,y:162,rx:30,spd:.3,sx:60,sy:62,copies:[[18,2],[34,-1]],voice:'coo',on:'Strutting along the pavement',off:'Roosting on a rooftop',fact:'Feral pigeons descend from wild rock doves, which nest on sea cliffs. To a pigeon, a London rooftop is just another cliff ledge.',alias:'bird dove gaston'},
 {id:'robin',name:'European robin',sci:'Erithacus rubecula',hab:'london',sp:'robin',r:'diurnal',move:'hop',x:236,y:127,rx:6,spd:.5,sx:232,sy:84,voice:'robin',on:'Singing from the railings',off:'Roosting in the plane tree',fact:'City robins often sing at night too, probably because streetlights and daytime noise push their song into the dark.',alias:'bird'},
 {id:'tawnyowl',name:'Tawny owl',sci:'Strix aluco',hab:'london',sp:'tawnyowl',r:'nocturnal',move:'still',x:290,y:92,sx:290,sy:92,voice:'owl',on:'Watching the park for mice',off:'Roosting close to the trunk',fact:'The classic “twit-twoo” is usually two owls: one calls “ke-wick” and another answers “hoo-hoo”.',alias:'owl bird'},
 {id:'squirrel',name:'Grey squirrel',sci:'Sciurus carolinensis',hab:'london',sp:'squirrel',r:'diurnal',move:'hop',x:236,y:174,rx:30,spd:.6,sx:262,sy:50,hide:true,voice:'click',on:'Burying nuts in the park',off:'Curled up in its drey',fact:'Grey squirrels bury thousands of nuts each autumn and find many of them again by smell and memory.',alias:'squirrel'},
 {id:'parakeet',name:'Ring-necked parakeet',sci:'Psittacula krameri',hab:'london',sp:'parakeet',r:'diurnal',move:'fly',x:160,y:40,rx:110,ry:8,spd:.32,sx:248,sy:66,copies:[[14,-6],[28,4]],voice:'squawk',on:'Screeching across the sky',off:'In the communal roost',fact:'Tens of thousands of these parakeets now live wild in and around London. In the evening they gather in big, noisy roosts.',alias:'parrot bird'},
 // Antarctica
 {id:'emperor',name:'Emperor penguin',sci:'Aptenodytes forsteri',hab:'antarctica',sp:'emperor',r:'cathemeral',per:3,act:.6,ph:0,move:'walk',x:130,y:158,rx:14,spd:.08,sx:130,sy:158,copies:[[20,4],[-18,6],[36,-2]],voice:'trumpet',on:'Waddling across the sea ice',off:'Dozing standing up',fact:'In winter the males huddle for about two months at down to −40°C, each balancing an egg on its feet. They shuffle so everyone gets a turn in the warm middle.',alias:'penguin bird'},
 {id:'emperorchick',name:'Emperor penguin chick',sci:'Aptenodytes forsteri',hab:'antarctica',sp:'emperorchick',r:'cathemeral',per:2,act:.5,ph:1,months:[7,8,9,10,11,12],awayNote:'Fledged and out at sea',back:'July',move:'still',x:150,y:164,copies:[[22,4]],voice:'chirp',on:'Begging for food',off:'Napping on the ice',fact:'Chicks hatch in the middle of winter and stand on their parents’ feet to keep off the ice.',alias:'penguin chick bird'},
 {id:'chinstrap',name:'Chinstrap penguin',sci:'Pygoscelis antarcticus',hab:'antarctica',sp:'chinstrap',r:'cathemeral',per:.12,act:.5,ph:0,months:[11,12,1,2,3],awayNote:'At sea for the winter',back:'November',move:'walk',x:238,y:152,rx:8,spd:.2,sx:238,sy:152,copies:[[16,3]],voice:'trumpet',on:'Guarding the nest',off:'Taking a four-second nap',fact:'Nesting chinstraps sleep in more than 10,000 micro-naps a day, each lasting about 4 seconds, adding up to around 11 hours.',alias:'penguin bird'},
 {id:'weddell',name:'Weddell seal',sci:'Leptonychotes weddellii',hab:'antarctica',sp:'weddell',r:'cathemeral',per:6,act:.5,ph:2,move:'still',x:70,y:150,sx:70,sy:150,voice:'trillsweep',on:'Watching from the ice',off:'Sleeping on the ice',fact:'They live farther south than any other mammal and keep breathing holes open by grinding the ice with their teeth. Underwater, they call with eerie sliding trills.',alias:'seal'},
 {id:'leopardseal',name:'Leopard seal',sci:'Hydrurga leptonyx',hab:'antarctica',sp:'leopardseal',r:'cathemeral',per:5,act:.6,ph:3,months:[11,12,1,2,3,4],awayNote:'Following the pack ice north',back:'November',move:'swim',x:170,y:112,rx:60,ry:1,spd:.25,sx:206,sy:110,voice:'low',on:'Patrolling the ice edge',off:'Hauled out on a floe',fact:'A top predator with a huge, reptile-like head. It hunts penguins near the ice edge and also filters krill through its teeth.',alias:'seal'},
 {id:'snowpetrel',name:'Snow petrel',sci:'Pagodroma nivea',hab:'antarctica',sp:'snowpetrel',r:'diurnal',move:'fly',x:160,y:46,rx:100,ry:8,spd:.4,sx:254,sy:84,voice:'chirp',on:'Gliding over the ice',off:'Roosting on an iceberg',fact:'Its nests have been found hundreds of kilometres inland, on mountain peaks poking out of the ice sheet.',alias:'bird'},
 {id:'orca',name:'Orca',sci:'Orcinus orca',hab:'antarctica',sp:'orca',r:'constant',rl:'Rests while swimming slowly',months:[11,12,1,2,3,4],awayNote:'Following the ice edge north',back:'November',move:'swim',x:200,y:112,rx:90,ry:1,spd:.2,voice:'whistle',on:'Hunting along the ice edge',off:'',fact:'Antarctic orcas come in several types. Some hunt seals by swimming together to make a wave that washes them off ice floes.',alias:'killer whale dolphin'},
 // Desert
 {id:'fennec',name:'Fennec fox',sci:'Vulpes zerda',hab:'desert',sp:'fennec',r:'nocturnal',move:'walk',x:150,y:172,rx:70,spd:.4,sx:250,sy:170,hide:true,voice:'bark',on:'Listening for insects under the sand',off:'Asleep in its burrow',fact:'Its huge ears give off heat and can hear insects moving under the sand. It can go a long time without drinking, getting water from its food.',alias:'fox'},
 {id:'camel',name:'Dromedary camel',sci:'Camelus dromedarius',hab:'desert',sp:'camel',r:'diurnal',move:'walk',x:110,y:152,rx:30,spd:.07,sx:100,sy:152,voice:'grunt',on:'Crossing the dunes',off:'Resting on folded legs',fact:'Its hump stores fat, not water. After a long trek a camel can drink over 100 litres in about 10 minutes.',alias:'camel dromedary'},
 {id:'viper',name:'Desert horned viper',sci:'Cerastes cerastes',hab:'desert',sp:'viper',r:'nocturnal',move:'walk',x:200,y:176,rx:40,spd:.2,sx:230,sy:176,hide:true,voice:'rasp',on:'Sidewinding across the sand',off:'Buried in the sand',fact:'It buries itself with only its eyes and horns showing, and moves by sidewinding, leaving J-shaped tracks.',alias:'snake reptile'},
 {id:'silverant',name:'Saharan silver ant',sci:'Cataglyphis bombycina',hab:'desert',sp:'silverant',r:'heat',move:'walk',x:140,y:178,rx:60,spd:.9,sx:120,sy:178,copies:[[8,-1],[-10,1]],hide:true,voice:'click',on:'Racing across the hot sand',off:'Waiting in the nest',fact:'It comes out in the hottest part of the day, when the sand can pass 50°C and its predators are hiding. It runs at nearly a metre a second.',alias:'ant insect'},
 {id:'jerboa',name:'Lesser Egyptian jerboa',sci:'Jaculus jaculus',hab:'desert',sp:'jerboa',r:'nocturnal',move:'hop',x:70,y:172,rx:40,spd:.6,sx:54,sy:174,hide:true,voice:'chirp',on:'Hopping after seeds',off:'In its sand-plugged burrow',fact:'It hops on long back legs like a tiny kangaroo, using its tail for balance, and hides from the daytime heat in a burrow it plugs with sand.',alias:'mouse rodent'},
 {id:'scorpion',name:'Fat-tailed scorpion',sci:'Androctonus australis',hab:'desert',sp:'scorpion',r:'nocturnal',move:'walk',x:250,y:177,rx:25,spd:.2,sx:286,sy:156,hide:true,voice:'click',on:'Hunting under the stars',off:'Hiding under a rock',fact:'Like all scorpions, it glows blue-green under ultraviolet light. Scientists still aren’t sure why.',alias:'scorpion arachnid'},
 {id:'eagleowl',name:'Pharaoh eagle-owl',sci:'Bubo ascalaphus',hab:'desert',sp:'eagleowl',r:'nocturnal',move:'still',x:300,y:133,sx:300,sy:133,voice:'owl',on:'Watching for jerboas',off:'Roosting on the rocks',fact:'Its sandy, streaked feathers blend into desert rock, and it hunts jerboas and other small animals at night.',alias:'owl bird'},
];
const BY_ID = Object.fromEntries(A.map(a=>[a.id,a]));

/* ================= Time, sun, status ================= */
const rad=Math.PI/180;
function sunAlt(ms,lat,lon){
  const d=ms/86400000-0.5+2440588-2451545;
  const M=rad*(357.5291+0.98560028*d);
  const Cc=rad*(1.9148*Math.sin(M)+0.02*Math.sin(2*M)+0.0003*Math.sin(3*M));
  const L=M+Cc+rad*102.9372+Math.PI, e=rad*23.4397;
  const dec=Math.asin(Math.sin(e)*Math.sin(L));
  const ra=Math.atan2(Math.sin(L)*Math.cos(e),Math.cos(L));
  const th=rad*(280.16+360.9856235*d)+lon*rad;
  const Hh=th-ra, phi=lat*rad;
  return Math.asin(Math.sin(phi)*Math.sin(dec)+Math.cos(phi)*Math.cos(dec)*Math.cos(Hh))/rad;
}
const fmtCache={};
function localParts(ms,tz){
  const f=fmtCache[tz]||(fmtCache[tz]=new Intl.DateTimeFormat('en-GB',{timeZone:tz,hour:'2-digit',minute:'2-digit',day:'numeric',month:'numeric',weekday:'short',hourCycle:'h23'}));
  const o={};for(const p of f.formatToParts(new Date(ms)))o[p.type]=p.value;
  const h=+o.hour, m=+o.minute;
  return {h,m,hour:h+m/60,month:+o.month,day:+o.day,wd:o.weekday,str:String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')};
}
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function moonPhase(ms){const p=((ms-Date.UTC(2000,0,6,18,14))/86400000/29.530588853)%1;return p<0?p+1:p}
function moonName(p){return p<.03||p>.97?'New moon':p<.22?'Waxing crescent':p<.28?'First quarter':p<.47?'Waxing gibbous':p<.53?'Full moon':p<.72?'Waning gibbous':p<.78?'Last quarter':'Waning crescent'}

const S={hab:'savannah',view:'hab',offset:0,dayOff:0,lapse:false,ylapse:false,sel:null,t:0,env:null,envs:{},status:{},wx:{},wxMode:'auto',wxLive:null,study:null};
const qsHab=(location.hash||'').slice(1); if(HAB[qsHab]) S.hab=qsHab; else if(qsHab==='world') S.view='world'; else { try{const h=localStorage.getItem('lh_hab'); if(HAB[h]) S.hab=h;}catch(e){} }
const nowMs=()=>Date.now()+S.offset*60000+Math.round(S.dayOff)*86400000;
function envFor(habKey,ms){
  const h=HAB[habKey]; const alt=sunAlt(ms,h.lat,h.lon); const lp=localParts(ms,h.tz);
  let mx=-90,mn=90; for(let i=0;i<24;i+=2){const a=sunAlt(ms+(i-12)*3600000,h.lat,h.lon);mx=Math.max(mx,a);mn=Math.min(mn,a);}
  const dark=clamp((6-alt)/18,0,1);
  let phase = alt>6?'Day':alt>0?'Golden hour':alt>-6?(lp.hour<12?'Dawn':'Dusk'):alt>-12?'Twilight':'Night';
  if(mx<-0.8) phase='Polar night'; else if(mn>-0.8) phase='Midnight sun';
  return {alt,lp,dark,phase,moon:moonPhase(ms)};
}
function status(a,env){
  if(a.months && !a.months.includes(env.lp.month)) return 'away';
  if(a.hibernate && a.hibernate.includes(env.lp.month)) return 'asleep';
  const alt=env.alt, hr=env.lp.hour;
  switch(a.r){
    case 'diurnal': return alt>-4?'awake':'asleep';
    case 'nocturnal': return alt<-4?'awake':'asleep';
    case 'crepuscular': return (alt>-14&&alt<10)?'awake':'asleep';
    case 'heat': return alt>36?'awake':'asleep';
    case 'cathemeral': { const per=a.per||5; const v=((hr+(a.ph||0))%per+per)%per; return v<per*(a.act||.6)?'awake':'asleep'; }
    case 'migrator': return 'migrate';
    default: return 'awake';
  }
}
const isHib=(a,env)=>!!(a.hibernate&&a.hibernate.includes(env.lp.month)&&!(a.months&&!a.months.includes(env.lp.month)));
const RL={diurnal:'Active by day',nocturnal:'Active at night',crepuscular:'Active at dawn and dusk',cathemeral:'Active in bursts, day and night',migrator:'Rises at night, sinks by day',constant:'Always active',heat:'Active in the midday heat'};
function statusLine(a,st,env){
  if(st==='away') return a.awayNote+'. Back around '+a.back+'.';
  if(isHib(a,env)) return 'Hibernating until spring';
  if(st==='migrate') return env.dark>.5?'Risen toward the surface to feed':'Hiding in the dark, hundreds of metres down';
  return st==='awake'?a.on:a.off;
}
const spKey=(a,env)=>a.spS&&a.spS.months.includes(env.lp.month)?a.spS.sp:a.sp;

/* ================= Weather ================= */
function wmo(code){ if(code==null) return 'clear'; if(code<=1) return 'clear'; if(code<=3) return 'cloudy'; if(code===45||code===48) return 'fog'; if(code>=95) return 'storm'; if((code>=71&&code<=77)||code===85||code===86) return 'snow'; if(code>=51) return 'rain'; return 'clear'; }
const WXL={clear:'Clear',cloudy:'Cloudy',rain:'Rain',storm:'Thunderstorm',snow:'Snow',fog:'Fog'};
async function fetchWeather(){
  try{ const lat=HAB_ORDER.map(k=>HAB[k].lat).join(','), lon=HAB_ORDER.map(k=>HAB[k].lon).join(',');
    const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=GMT`);
    if(!r.ok) throw 0; let j=await r.json(); if(!Array.isArray(j)) j=[j];
    S.wxLive={}; HAB_ORDER.forEach((k,i)=>{ const c=j[i]&&j[i].current; if(c) S.wxLive[k]={kind:wmo(c.weather_code),temp:c.temperature_2m}; });
  }catch(e){ if(!S.wxLive) S.wxLive=false; }
  tick(true);
}
function wxFor(k){
  if(S.wxMode!=='auto') return {kind:S.wxMode,temp:null,manual:true};
  if(S.wxLive && S.wxLive[k] && Math.abs(S.offset)<=180 && Math.round(S.dayOff)===0) return S.wxLive[k];
  return {kind:'clear',temp:null};
}

/* ================= Events ================= */
const inM=(env,ms)=>ms.includes(env.lp.month);
const EVENTS=[
 {id:'lionhunt',hab:'savannah',label:'Lions on the hunt',when:e=>e.alt<-8,cycle:[45,11],hide:['lion'],draw(f,p,t){ const x=-60+p*420; const z=frame('zebra','awake',Math.floor(t*9)), l=frame('lion','awake',Math.floor(t*10));
   f.drawImage(z.cv,Math.round(x+46),150-SPR.zebra.ay); f.drawImage(l.cv,Math.round(x),156-SPR.lion.ay); }},
 {id:'chorus',hab:'rainforest',label:'Dawn chorus: the howler monkeys are calling',when:e=>e.alt>-7&&e.alt<9&&e.lp.hour<12,voice:'howl'},
 {id:'cleaning',hab:'reef',label:'Cleaning station: wrasse are grooming a turtle',when:e=>e.alt>8,cycle:[55,22],hide:['turtle'],draw(f,p,t){ const tf=frame('turtle','awake',0); f.drawImage(tf.cv,40,118-SPR.turtle.ay);
   for(let i=0;i<3;i++){ const a=t*2.4+i*2.1, x=60+Math.cos(a)*14, y=112+Math.sin(a*1.3)*6; R(f,x,y,3,1,'#3a8ad8'); R(f,x+1,y,1,1,'#1a1a24'); R(f,x+3,y,1,1,'#f2e040'); } }},
 {id:'spawn',hab:'reef',label:'Coral spawning: the reef is releasing billions of eggs',when:e=>inM(e,[11,12])&&e.alt<-6&&e.moon>.52&&e.moon<.8,post(g,t){ for(let i=0;i<160;i++){ const p=(t*.06+i*.0123)%1, x=(i*37.7)%W+Math.sin(t+i)*3, y=152-p*150; g.globalAlpha=.7*(1-p*.6); R(g,x,y,1,1,i%3?'#f6b8d0':'#fff0e0'); } g.globalAlpha=1; }},
 {id:'rise',hab:'deep',label:'Dusk: animals are rising toward the surface',when:e=>e.alt>-10&&e.alt<4&&e.lp.hour>=12},
 {id:'sink',hab:'deep',label:'Dawn: animals are sinking back into the dark',when:e=>e.alt>-10&&e.alt<4&&e.lp.hour<12},
 {id:'polarnight',hab:'arctic',label:'Polar night: the sun won’t rise for weeks',when:e=>e.phase==='Polar night'},
 {id:'midsun',hab:'arctic',label:'Midnight sun: the sun doesn’t set',when:e=>e.phase==='Midnight sun'},
 {id:'aurora',hab:'arctic',label:'Northern lights over Svalbard',when:e=>e.dark>.6&&!inM(e,[5,6,7,8])},
 {id:'huddle',hab:'antarctica',label:'Emperor penguins huddling against the cold',when:e=>inM(e,[5,6,7,8])},
 {id:'aurora_s',hab:'antarctica',label:'Southern lights over the ice',when:e=>e.dark>.75&&inM(e,[4,5,6,7,8,9])},
 {id:'foxcall',hab:'london',label:'Foxes calling: it’s mating season',when:e=>inM(e,[12,1,2])&&e.alt<-6,voice:'scream'},
 {id:'roost',hab:'london',label:'Parakeets flocking to their roost',when:e=>e.alt>-3&&e.alt<7&&e.lp.hour>12},
 {id:'londondawn',hab:'london',label:'The dawn chorus is starting',when:e=>inM(e,[3,4,5,6])&&e.alt>-8&&e.alt<6&&e.lp.hour<12,voice:'robin'},
 {id:'milky',hab:'desert',label:'The Milky Way over the Sahara',when:e=>e.alt<-16},
 {id:'heat',hab:'desert',label:'Midday heat: only the silver ants are out',when:e=>e.alt>36},
 {id:'flood',hab:'rainforest',label:'High water: the forest floor is flooded',when:e=>inM(e,[4,5,6,7])},
 {id:'wet',hab:'savannah',label:'Wet season: the plains have turned green',when:e=>inM(e,[12,1,2,3])&&e.alt>0},
];
function activeEvents(k,env){ return EVENTS.filter(ev=>ev.hab===k&&ev.when(env)&&(!ev.cycle||(S.t%ev.cycle[0])<ev.cycle[1])); }

/* ================= Render ================= */
const cv=document.getElementById('cv'); cv.width=W; cv.height=H; const gMain=cv.getContext('2d');
const fgc=document.createElement('canvas'); fgc.width=W; fgc.height=H; const f=fgc.getContext('2d');
gMain.imageSmoothingEnabled=false; f.imageSmoothingEnabled=false;
const BUILT={};
function seasonOf(k,env){ const sc=SCN[k]; return sc.season?sc.season(env.lp.month):''; }
function scene(k,se){ const key=k+'|'+se; if(!BUILT[key]) BUILT[key]=SCN[k].build(se); SCN[k]._far=BUILT[key].far; SCN[k]._se=se; return BUILT[key]; }
function iconURL(key,st){ const fr=frame(key,st,st==='sleep'?0:1); const [x0,y0,x1,y1]=fr.bb; const w=x1-x0+1,h=y1-y0+1; const s=Math.max(1,Math.floor(40/Math.max(w,h)));
  const c=document.createElement('canvas'); c.width=w*s; c.height=h*s; const x=c.getContext('2d'); x.imageSmoothingEnabled=false; x.drawImage(fr.cv,x0,y0,w,h,0,0,w*s,h*s); return c.toDataURL(); }
const ICON={},ICON_S={};
function icons(){ for(const a of A){ ICON[a.id]=iconURL(a.sp,'awake'); ICON_S[a.id]=iconURL(a.sp,'sleep'); } }
function silhouette(fr,col){ fr._sil=fr._sil||{}; if(fr._sil[col]) return fr._sil[col]; const c=document.createElement('canvas'); c.width=fr.w; c.height=fr.h; const x=c.getContext('2d'); x.drawImage(fr.cv,0,0); x.globalCompositeOperation='source-in'; x.fillStyle=col; x.fillRect(0,0,fr.w,fr.h); return fr._sil[col]=c; }

function animalPos(a,st,env,t,ci,huddle){
  const ph=(a.id.length*1.7)+ci*1.3, sp=a.spd||.3;
  if(st==='asleep') return {x:a.sx??a.x, y:a.sy??a.y, flip:a.id.length%2===0};
  if(huddle) return {x:a.x, y:a.y, flip:ci%2===1, still:true};
  let baseY=a.y; if(a.r==='migrator') baseY=a.dayY+(a.nightY-a.dayY)*env.dark;
  const ang=t*sp+ph; const x=a.x+Math.sin(ang)*(a.rx||0); const dx=Math.cos(ang);
  let y=baseY; if(a.move==='swim'||a.move==='fly') y+=Math.sin(ang*2.3)*(a.ry||0);
  if(a.move==='hop') y-=Math.max(0,Math.sin(t*3+ph))>.85?2:0;
  return {x,y,flip:(a.rx?dx<0:false)};
}
function drawShadow(c,x,y,w){ c.globalAlpha=.22; for(let dy=-1;dy<=1;dy++){ const ww=Math.round(w*(dy===0?1:.7)); R(c,x-ww/2,y+dy,ww,1,'#2a1a10'); } c.globalAlpha=1; }

function renderScene(k,g){
  const hab=HAB[k], sc=SCN[k], env=S.envs[k], t=S.t, se=seasonOf(k,env), B=scene(k,se), wx=S.wx[k]||{kind:'clear'};
  const sky=skyStops(env.alt), evs=activeEvents(k,env), hide=new Set(evs.flatMap(e=>e.hide||[])), huddle=evs.some(e=>e.id==='huddle');
  if(sc.water){ g.drawImage(waterCanvas(k,clamp((env.alt+6)/24,0,1)),0,0); }
  else { g.drawImage(skyCanvas(sc.hz,env.alt),0,0); if(sc.milky) drawMilky(g,env,t); drawCelestial(g,env,sc.hz,t,{aurora:(k==='arctic'&&evs.some(e=>e.id==='aurora'))||(k==='antarctica'&&evs.some(e=>e.id==='aurora_s'))});
    const cl=sc.clouds||[], reps=(wx.kind==='cloudy'||wx.kind==='rain'||wx.kind==='storm'||wx.kind==='snow')?2:(wx.kind==='clear'&&wx.temp!=null?0:1);
    for(let rep=0;rep<reps;rep++) for(const [seed,w,h,x0,y0] of cl){ const cs=cloudSprite(seed+rep*7,w,h,env.alt); const x=((x0+rep*97+t*1.5*(1+seed%3*.3))%(W+w+40))-w-20; g.globalAlpha=(k==='rainforest'?.8:.95)*(1-.55*env.dark); g.drawImage(cs,Math.round(x),y0+rep*8); } g.globalAlpha=1; }
  f.clearRect(0,0,W,H);
  if(sc.anim) sc.anim(f,t,env,sky);
  f.drawImage(B.back,0,0);
  if(sc.anim2) sc.anim2(f,t,env,sky);
  const list=[];
  for(const a of A){ if(a.hab!==k||hide.has(a.id)) continue; const st=S.status[a.id]; if(st==='away') continue;
    const hd=huddle&&a.id==='emperor';
    [[0,0]].concat(a.copies||[]).forEach((o,ci)=>{ const p=animalPos(a,st,env,t,ci,hd); const oo=hd?[o[0]*.4,o[1]*.5]:o; list.push({a,st,x:p.x+oo[0],y:p.y+oo[1],flip:p.flip,ci,still:p.still}); }); }
  list.sort((p,q)=>p.y-q.y);
  const drawn=[];
  for(const it of list){ const key=spKey(it.a,env), def=SPR[key], sleep=it.st==='asleep';
    if(sleep&&it.a.hide){ drawn.push({...it,box:{x:it.x-4,y:it.y-8,w:8,h:8},hidden:true}); continue; }
    const fi=it.still?0:Math.floor(t*(it.a.move==='walk'?5*(it.a.spd>.3?1.6:1):4)+it.ci);
    const fr=frame(key,sleep?'sleep':'awake',fi);
    const ax=def.ax??def.w/2, ay=def.ay??def.h-2;
    const ox=Math.round(it.x-ax), oy=Math.round(it.y-ay);
    if(hab.kind==='land'&&it.a.move!=='fly'&&!def.top&&!(k==='rainforest'&&it.y<150)&&!(k==='london'&&it.y<140)&&it.a.id!=='eagleowl') drawShadow(f,it.x,it.y,(fr.bb[2]-fr.bb[0])*.8);
    if(def.alpha) f.globalAlpha=def.alpha;
    if(it.flip){ f.save(); f.translate(ox+def.w,oy); f.scale(-1,1); f.drawImage(fr.cv,0,0); f.restore(); } else f.drawImage(fr.cv,ox,oy);
    f.globalAlpha=1;
    const bx=it.flip?ox+def.w-1-fr.bb[2]:ox+fr.bb[0];
    const box={x:bx,y:oy+fr.bb[1],w:fr.bb[2]-fr.bb[0]+1,h:fr.bb[3]-fr.bb[1]+1};
    if(sleep&&it.a.cocoon){ f.globalAlpha=.4; f.strokeStyle='#dff8ff'; f.lineWidth=1; f.strokeRect(box.x-1.5,box.y-1.5,box.w+3,box.h+3); f.globalAlpha=1; }
    drawn.push({...it,box,fr,ox,oy,def});
  }
  for(const ev of evs) if(ev.draw){ const p=(S.t%ev.cycle[0])/ev.cycle[1]; ev.draw(f,p,t,env); }
  if(sc.front) sc.front(f,t,env,sky);
  const dk=hab.kind==='deep'?.42:env.dark*(hab.kind==='water'?.72:.7);
  f.globalCompositeOperation='source-atop';
  if(dk>0){ f.fillStyle=`rgba(10,14,46,${dk})`; f.fillRect(0,0,W,H); }
  if(hab.kind==='land'){ const gw=clamp(1-Math.abs(env.alt-2)/8,0,1); if(gw>0){ f.fillStyle=`rgba(255,130,60,${.16*gw})`; f.fillRect(0,0,W,H); } if(wx.kind!=='clear'&&wx.kind!=='cloudy'){ f.fillStyle='rgba(60,70,90,.18)'; f.fillRect(0,0,W,H); } }
  f.globalCompositeOperation='source-over';
  g.drawImage(fgc,0,0);
  for(const d of drawn){ if(d.hidden) continue; const fr=d.fr, night=env.dark>.6&&d.st==='awake'&&hab.kind==='land';
    if(d.def.uv&&env.dark>.6){ const s=silhouette(fr,'#5affd8'); g.globalAlpha=.55; if(d.flip){ g.save(); g.translate(d.ox+d.def.w,d.oy); g.scale(-1,1); g.drawImage(s,0,0); g.restore(); } else g.drawImage(s,d.ox,d.oy); g.globalAlpha=1; }
    const pts=[...fr.glows.map(q=>[q[0],q[1],q[2],1]),...(night?fr.eyes.map(q=>[q[0],q[1],'#f6f3b0',.8]):[])];
    for(const [ex,ey,col,s] of pts){ const px=d.flip?d.ox+d.def.w-1-ex:d.ox+ex, py=d.oy+ey; const pulse=.6+.4*Math.sin(t*3+ex);
      g.globalAlpha=.22*pulse*s; R(g,px-1,py-1,3,3,col); g.globalAlpha=s; R(g,px,py,1,1,col); } g.globalAlpha=1; }
  if(sc.post) sc.post(g,t,env);
  for(const ev of evs) if(ev.post) ev.post(g,t,env);
  drawWeather(g,wx,t,hab.kind,sc.hz||H);
  for(const d of drawn){ if(d.st!=='asleep'||d.ci>0) continue; const bx=d.box.x+d.box.w-2, by=d.box.y-2;
    for(let q=0;q<2;q++){ const ph=((t*.55+q*.5+d.a.id.length*.13)%1); const zx=Math.round(bx+ph*5+q*3), zy=Math.round(by-ph*10); const s=q?3:4;
      g.globalAlpha=Math.sin(ph*Math.PI)*.95; R(g,zx,zy,s,1,'#eef2ff'); for(let i=1;i<s-1;i++) R(g,zx+s-1-i,zy+i,1,1,'#eef2ff'); R(g,zx,zy+s-1,s,1,'#eef2ff'); } g.globalAlpha=1; }
  return {drawn,evs};
}
const hits=[];
function render(){
  if(S.study){ renderScene(S.hab,sctx); return; }
  if(S.view==='world'){ renderWorld(); return; }
  const k=S.hab; const {drawn,evs}=renderScene(k,gMain);
  hits.length=0; for(const d of drawn) hits.push({id:d.a.id,box:d.box});
  const tk=$('ticker'); const lab=evs[0]?evs[0].label:''; if(tk.textContent!==lab) tk.textContent=lab; tk.hidden=!lab;
  const tag=$('tag');
  if(S.sel && BY_ID[S.sel].hab===k){ const d=drawn.find(z=>z.a.id===S.sel&&z.ci===0);
    if(d){ const b=d.box, on=Math.floor(S.t*3)%2===0, col='#ffd166';
      if(on){ const x0=b.x-2,y0=b.y-2,x1=b.x+b.w+1,y1=b.y+b.h+1; for(const [cx,cy,sx,sy] of [[x0,y0,1,1],[x1,y0,-1,1],[x0,y1,1,-1],[x1,y1,-1,-1]]){R(gMain,Math.min(cx,cx+sx*3),cy,4,1,col);R(gMain,cx,Math.min(cy,cy+sy*3),1,4,col);} }
      tag.hidden=false; tag.textContent=BY_ID[S.sel].name; tag.style.left=((b.x+b.w/2)/W*100)+'%'; tag.style.top=(Math.max(10,b.y-4)/H*100)+'%';
    } else tag.hidden=true;
  } else tag.hidden=true;
}

/* ================= World view ================= */
const TILES={}; let wTurn=0;
function buildWorld(){
  $('wgrid').innerHTML=HAB_ORDER.map(k=>`<button type="button" class="tile" data-h="${k}" aria-label="Open ${HAB[k].name}"><canvas width="${W}" height="${H}"></canvas><div class="tl"><b>${HAB[k].name}</b><span data-wt="${k}"></span></div><div class="tc" data-wc="${k}"></div></button>`).join('');
  document.querySelectorAll('.tile').forEach(b=>{ const x=b.querySelector('canvas').getContext('2d'); x.imageSmoothingEnabled=false; TILES[b.dataset.h]=x; });
  $('wgrid').onclick=e=>{const b=e.target.closest('.tile'); if(b) setHab(b.dataset.h); };
}
function renderWorld(){ for(let i=0;i<2;i++){ const k=HAB_ORDER[wTurn%HAB_ORDER.length]; wTurn++; if(TILES[k]) renderScene(k,TILES[k]); } }
function worldText(){
  let aw=0,as=0,away=0; for(const a of A){ const s=S.status[a.id]; if(s==='awake'||s==='migrate') aw++; else if(s==='asleep') as++; else away++; }
  $('worldHead').textContent=`Right now across ${HAB_ORDER.length} places: ${aw} animals awake, ${as} asleep${away?`, ${away} away for the season`:''}.`;
  for(const k of HAB_ORDER){ const e=S.envs[k]; const el=document.querySelector(`[data-wt="${k}"]`); if(el) el.textContent=`${e.lp.str} · ${e.phase}`;
    const c=document.querySelector(`[data-wc="${k}"]`); if(c){ const L=A.filter(a=>a.hab===k); const n=L.filter(a=>['awake','migrate'].includes(S.status[a.id])).length; c.textContent=`${n} awake · ${L.filter(a=>S.status[a.id]==='asleep').length} asleep`; } }
}

/* ================= UI ================= */
function $(id){return document.getElementById(id)}
function buildTabs(){
  $('tabs').innerHTML=`<button type="button" data-h="world" aria-pressed="false">World</button>`+HAB_ORDER.map(k=>`<button type="button" data-h="${k}" aria-pressed="false">${HAB[k].name}<span class="clock" data-c="${k}"></span></button>`).join('');
  $('tabs').onclick=e=>{const b=e.target.closest('button');if(!b) return; if(b.dataset.h==='world') setView('world'); else setHab(b.dataset.h); };
}
function setView(v){ S.view=v; $('world').hidden=v!=='world'; $('habView').hidden=v==='world'; $('panel').hidden=v==='world';
  document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-pressed',v==='world'?b.dataset.h==='world':b.dataset.h===S.hab));
  if(v==='world'){ worldText(); for(let i=0;i<HAB_ORDER.length/2;i++) renderWorld(); } }
function setHab(k,keepSel){
  S.hab=k; if(!keepSel) S.sel=null; try{localStorage.setItem('lh_hab',k)}catch(e){}
  setView('hab');
  const dp=$('depth'); if(k==='deep'){ dp.hidden=false; dp.innerHTML=[0,200,400,600,800,1000].map(m=>`<span style="top:${Math.min(97,Math.max(3,m/1000*100))}%">${m.toLocaleString('en-GB')} m</span>`).join(''); } else dp.hidden=true;
  tick(true);
}
let lastPanelKey='';
function renderPanel(force){
  const hab=HAB[S.hab], env=S.env;
  const groups={awake:[],asleep:[],away:[]};
  for(const a of A){ if(a.hab!==S.hab) continue; const st=S.status[a.id]; (st==='migrate'?groups.awake:groups[st]).push(a); }
  const key=S.hab+'|'+S.sel+'|'+A.filter(a=>a.hab===S.hab).map(a=>S.status[a.id]+spKey(a,env)).join(',')+'|'+(env.dark>.5);
  if(!force && key===lastPanelKey) return; lastPanelKey=key;
  const chip=(a,cls)=>`<button type="button" class="chip ${cls}" data-id="${a.id}" aria-current="${S.sel===a.id}"><img alt="" src="${cls==='asleep'?ICON_S[a.id]:ICON[a.id]}">${a.name}${cls==='away'?` <small>back ${a.back}</small>`:''}${cls==='asleep'&&isHib(a,env)?' <small>hibernating</small>':''}</button>`;
  $('lAwake').innerHTML=groups.awake.map(a=>chip(a,'awake')).join('')||'<p class="empty-note">Everyone here is asleep right now.</p>';
  $('lAsleep').innerHTML=groups.asleep.map(a=>chip(a,'asleep')).join('')||'<p class="empty-note">Nobody is asleep right now.</p>';
  $('lAway').innerHTML=groups.away.map(a=>chip(a,'away')).join(''); $('gAway').hidden=!groups.away.length;
  $('nAwake').textContent=groups.awake.length; $('nAsleep').textContent=groups.asleep.length; $('nAway').textContent=groups.away.length;
  const card=$('card');
  if(S.sel){ const a=BY_ID[S.sel], st=S.status[a.id]; const pc=st==='migrate'?'migrate':st; const pl={awake:'Awake',asleep:isHib(a,env)?'Hibernating':'Asleep',away:'Away',migrate:env.dark>.5?'Rising':'Sinking'}[st];
    card.innerHTML=`<div class="head"><img alt="" src="${st==='asleep'?ICON_S[a.id]:ICON[a.id]}"><div><h2>${a.name}</h2><div class="sci">${a.sci}</div></div><button class="close" id="clr" type="button" aria-label="Close and show habitat">×</button></div>
      <span class="pill ${pc}">${pl}</span><p>${statusLine(a,st,env)}.</p><div class="meta">${a.rl||RL[a.r]} · ${HAB[a.hab].place.split(' · ')[0]}</div><p class="fact">${a.fact}</p>`;
    $('clr').onclick=()=>{S.sel=null;renderPanel(true)};
  } else {
    card.innerHTML=`<h2>${hab.name}</h2><div class="meta">${hab.place}</div><p>${hab.desc}</p><p class="fact">${groups.awake.length} awake, ${groups.asleep.length} asleep${groups.away.length?`, ${groups.away.length} away for the season`:''}. Tap an animal in the scene or below.</p>`;
  }
}
document.querySelector('.panel').addEventListener('click',e=>{const c=e.target.closest('.chip');if(c){S.sel=c.dataset.id;renderPanel(true)}});
function toCanvas(e){const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
function pick(px,py){let best=null,bd=1e9;for(const h of hits){const b=h.box;const pad=3;if(px>=b.x-pad&&px<=b.x+b.w+pad&&py>=b.y-pad&&py<=b.y+b.h+pad){const d=Math.hypot(px-(b.x+b.w/2),py-(b.y+b.h/2));if(d<bd){bd=d;best=h.id}}}return best}
cv.addEventListener('click',e=>{const [x,y]=toCanvas(e);S.sel=pick(x,y);renderPanel(true)});
cv.addEventListener('mousemove',e=>{const [x,y]=toCanvas(e);cv.style.cursor=pick(x,y)?'pointer':'default'});
const q=$('q'), res=$('results'); let items=[], act=-1;
function doSearch(){
  const s=q.value.trim().toLowerCase(); if(!s){res.hidden=true;q.setAttribute('aria-expanded','false');return}
  items=[];
  for(const k of HAB_ORDER){const h=HAB[k];if((h.name+' '+h.place+' '+h.alias).toLowerCase().includes(s)) items.push({type:'hab',k});}
  for(const a of A){if((a.name+' '+a.sci+' '+(a.alias||'')).toLowerCase().includes(s)) items.push({type:'animal',id:a.id});}
  items=items.slice(0,10); act=items.length?0:-1;
  res.innerHTML=items.length?items.map((it,i)=>{ if(it.type==='hab'){const h=HAB[it.k];const e=S.envs[it.k];return `<li role="option" id="o${i}" data-i="${i}" aria-selected="${i===act}"><img alt="" src="${ICON[A.find(a=>a.hab===it.k).id]}"><span>${h.name}</span><small>${h.place.split(' · ')[0]}<br>${e.lp.str} · ${e.phase}</small></li>`}
      const a=BY_ID[it.id];const e=S.envs[a.hab];const st=S.status[a.id];const lbl={awake:'Awake',asleep:isHib(a,e)?'Hibernating':'Asleep',away:'Away',migrate:'Migrating'}[st];return `<li role="option" id="o${i}" data-i="${i}" aria-selected="${i===act}"><img alt="" src="${ICON[a.id]}"><span>${a.name}</span><small>${HAB[a.hab].name}<br>${lbl} · ${e.lp.str}</small></li>`}).join('')
    :`<li class="empty">Not in these habitats yet. Try fox, penguin, squid or Sahara.</li>`;
  res.hidden=false; q.setAttribute('aria-expanded','true'); q.setAttribute('aria-activedescendant',act>=0?'o'+act:'');
}
function choose(i){const it=items[i];if(!it)return; if(it.type==='hab'){setHab(it.k)}else{const a=BY_ID[it.id];S.sel=a.id;setHab(a.hab,true)} q.value='';res.hidden=true;q.setAttribute('aria-expanded','false');}
q.addEventListener('input',doSearch);
q.addEventListener('keydown',e=>{ if(res.hidden) return; if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!items.length)return;act=(act+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;res.querySelectorAll('li').forEach((li,i)=>li.setAttribute('aria-selected',i===act));q.setAttribute('aria-activedescendant','o'+act)} else if(e.key==='Enter'){e.preventDefault();choose(act)} else if(e.key==='Escape'){res.hidden=true;q.setAttribute('aria-expanded','false')} });
res.addEventListener('mousedown',e=>{const li=e.target.closest('li[data-i]');if(li){e.preventDefault();choose(+li.dataset.i)}});
q.addEventListener('blur',()=>setTimeout(()=>{res.hidden=true;q.setAttribute('aria-expanded','false')},120));

const tOff=$('tOff'), tOut=$('tOut'), lapseBtn=$('lapse'), dOff=$('dOff'), dOut=$('dOut'), yBtn=$('ylapse');
function fmtOff(m){ if(Math.abs(m)<1) return 'Live'; const s=m<0?'−':'+'; m=Math.abs(Math.round(m)); const h=Math.floor(m/60), mm=m%60; return s+h+' h'+(mm?' '+mm+' min':''); }
function fmtDate(){ const e=S.envs[S.hab]; if(!e) return ''; return Math.round(S.dayOff)===0?'Today':`${e.lp.day} ${MONTHS[e.lp.month-1]}`; }
tOff.addEventListener('input',()=>{S.offset=+tOff.value; tOut.textContent=fmtOff(S.offset); tick(true)});
dOff.addEventListener('input',()=>{S.dayOff=+dOff.value; tick(true)});
$('live').onclick=()=>{S.offset=0;S.lapse=false;lapseBtn.setAttribute('aria-pressed','false');tOff.value=0;tOut.textContent='Live';tick(true)};
$('today').onclick=()=>{S.dayOff=0;S.ylapse=false;yBtn.setAttribute('aria-pressed','false');dOff.value=0;tick(true)};
lapseBtn.onclick=()=>{S.lapse=!S.lapse;lapseBtn.setAttribute('aria-pressed',S.lapse)};
yBtn.onclick=()=>{S.ylapse=!S.ylapse;yBtn.setAttribute('aria-pressed',S.ylapse)};
$('wx').onchange=e=>{S.wxMode=e.target.value; tick(true)};

function tick(force){
  const ms=nowMs(); for(const k of HAB_ORDER) S.envs[k]=envFor(k,ms); S.env=S.envs[S.hab];
  for(const a of A) S.status[a.id]=status(a,S.envs[a.hab]);
  for(const k of HAB_ORDER) S.wx[k]=wxFor(k);
  const env=S.env, hab=HAB[S.hab], wx=S.wx[S.hab];
  $('hudPlace').textContent=hab.place;
  $('hudTime').textContent=env.lp.wd+' '+env.lp.str;
  const sun=(env.alt>=0?'+':'−')+Math.abs(env.alt).toFixed(0)+'°';
  const wxs=wx.temp!=null?` · ${Math.round(wx.temp)}°C, ${WXL[wx.kind].toLowerCase()}`:(wx.manual&&wx.kind!=='clear'?` · ${WXL[wx.kind].toLowerCase()}`:'');
  $('hudPhase').textContent=`${env.lp.day} ${MONTHS[env.lp.month-1]} · ${env.phase} · sun ${sun}`+(env.alt<0&&hab.kind!=='deep'?' · '+moonName(env.moon):'')+(hab.kind==='land'?wxs:'');
  for(const k of HAB_ORDER){const el=document.querySelector(`[data-c="${k}"]`);if(el)el.textContent=S.envs[k].lp.str;}
  dOut.textContent=fmtDate();
  $('wxNote').textContent=S.wxMode!=='auto'?'Set by hand':S.wxLive===null?'Checking live weather…':S.wxLive===false?'Live weather isn’t available here':(Math.abs(S.offset)>180||Math.round(S.dayOff)!==0)?'Live weather pauses while time is shifted':'Live from Open-Meteo';
  if(S.view==='world') worldText();
  if(S.study) studyText();
  renderPanel(force);
}

/* ================= Study mode ================= */
const scv=$('scv'), sctx=scv.getContext('2d'); sctx.imageSmoothingEnabled=false;
function studyText(){ $('sPlace').textContent=HAB[S.hab].name+' · '+HAB[S.hab].place.split(' · ')[0]; $('sTime').textContent=S.env.lp.str; }
function fmtClock(s){ s=Math.max(0,Math.ceil(s)); return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }
function studyUI(){ const st=S.study; $('sMode').textContent=st.mode==='focus'?'Focus':'Break'; $('sClock').textContent=fmtClock(st.left); $('sPause').textContent=st.running?'Pause':'Resume'; }
function chime(){ if(!AU.ctx) return; const t=AU.ctx.currentTime+.05; [72,79,84].forEach((m,i)=>osc('sine',mtof(m),t+i*.18,1.6,.08,.005)); }
function openStudy(){ S.study={mode:'focus',left:25*60,running:true}; $('study').hidden=false; studyText(); studyUI(); if(!AU.on) $('snd').click();
  try{ const el=$('study'); const p=el.requestFullscreen&&el.requestFullscreen(); if(p&&p.catch) p.catch(()=>{}); }catch(e){} idle(); $('sPause').focus(); }
function closeStudy(){ S.study=null; $('study').hidden=true; try{ if(document.fullscreenElement) document.exitFullscreen().catch(()=>{}); }catch(e){} $('studyBtn').focus(); }
let idleT=null; function idle(){ $('study').classList.remove('idle'); clearTimeout(idleT); idleT=setTimeout(()=>$('study').classList.add('idle'),3000); }
$('study').addEventListener('pointermove',idle); $('study').addEventListener('pointerdown',idle);
$('studyBtn').onclick=openStudy; $('sExit').onclick=closeStudy;
$('sPause').onclick=()=>{S.study.running=!S.study.running; studyUI();};
$('sSkip').onclick=()=>{ const st=S.study; st.mode=st.mode==='focus'?'break':'focus'; st.left=(st.mode==='focus'?25:5)*60; chime(); studyUI(); };
const cycleHab=d=>{ const i=HAB_ORDER.indexOf(S.hab); S.hab=HAB_ORDER[(i+d+HAB_ORDER.length)%HAB_ORDER.length]; tick(true); };
$('sPrev').onclick=()=>cycleHab(-1); $('sNext').onclick=()=>cycleHab(1);
document.addEventListener('keydown',e=>{ if(!S.study) return; idle(); if(e.key==='Escape') closeStudy(); if(e.key==='ArrowRight') cycleHab(1); if(e.key==='ArrowLeft') cycleHab(-1); });

/* ================= Postcard ================= */
let pcBlobURL=null;
function makePostcard(){
  const scale=4, c=document.createElement('canvas'); c.width=W*scale; c.height=H*scale+96; const x=c.getContext('2d'); x.imageSmoothingEnabled=false;
  const tmp=document.createElement('canvas'); tmp.width=W; tmp.height=H; const tx=tmp.getContext('2d'); tx.imageSmoothingEnabled=false; renderScene(S.hab,tx);
  x.drawImage(tmp,0,0,W*scale,H*scale);
  x.fillStyle='#14121c'; x.fillRect(0,H*scale,c.width,96); x.fillStyle='#ffd166'; x.fillRect(0,H*scale,c.width,4);
  const e=S.env, hab=HAB[S.hab]; const L=A.filter(a=>a.hab===S.hab); const aw=L.filter(a=>['awake','migrate'].includes(S.status[a.id])).length, as=L.filter(a=>S.status[a.id]==='asleep').length;
  x.textBaseline='top'; x.fillStyle='#f2f2f7'; x.font='600 34px "Pixelify Sans", "Courier New", monospace'; x.fillText(`${e.lp.str} in ${hab.place.split(' · ')[0]}`,28,H*scale+16);
  x.fillStyle='#b8bed8'; x.font='22px "IBM Plex Mono", Menlo, monospace'; x.fillText(`${e.lp.day} ${MONTHS[e.lp.month-1]} · ${e.phase} · ${aw} awake · ${as} asleep`,28,H*scale+58);
  x.textAlign='right'; x.fillStyle='#ffd166'; x.font='600 28px "Pixelify Sans", "Courier New", monospace'; x.fillText('Lofi Habitats',c.width-28,H*scale+18);
  const url=/^https?:$/.test(location.protocol)&&!/claude\.ai|claudeusercontent/.test(location.host)?location.host+location.pathname.replace(/index\.html$/,''):'';
  if(url){ x.fillStyle='#b8bed8'; x.font='20px "IBM Plex Mono", Menlo, monospace'; x.fillText(url,c.width-28,H*scale+60); }
  $('pcImg').src=c.toDataURL('image/png');
  c.toBlob(b=>{ if(pcBlobURL) URL.revokeObjectURL(pcBlobURL); pcBlobURL=b?URL.createObjectURL(b):null; },'image/png');
  $('pc').hidden=false; $('pcClose').focus();
}
$('cardBtn').onclick=makePostcard; $('pcClose').onclick=()=>{$('pc').hidden=true; $('cardBtn').focus();}; $('pc').addEventListener('click',e=>{ if(e.target.id==='pc') $('pc').hidden=true; });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!$('pc').hidden) $('pc').hidden=true; });
let DL=null; if(window.claude&&window.claude.use) window.claude.use('downloads').then(d=>{DL=d}).catch(()=>{});
$('pcDl').onclick=async()=>{ const name=`lofi-habitats-${S.hab}-${S.env.lp.str.replace(':','')}.png`;
  if(DL){ try{ const b64=$('pcImg').src.split(',')[1], bin=atob(b64), u8=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i); const blob=new Blob([u8],{type:'image/png'}); await DL.save({filename:name,data:blob}); }catch(e){} return; }
  const a=document.createElement('a'); a.href=pcBlobURL||$('pcImg').src; a.download=name; document.body.appendChild(a); a.click(); a.remove(); };

/* ================= Loop ================= */
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let last=performance.now(), acc=0, slow=0;
function loop(now){
  const dt=Math.min(.1,(now-last)/1000); last=now;
  S.t+=dt*(reduce?.35:1);
  if(S.lapse){ S.offset+=dt*30; if(S.offset>=720) S.offset-=1440; tOff.value=Math.round(S.offset/15)*15; tOut.textContent=fmtOff(S.offset); }
  if(S.ylapse){ S.dayOff=(S.dayOff+dt*6)%365; dOff.value=Math.round(S.dayOff); }
  if(S.study&&S.study.running){ S.study.left-=dt; if(S.study.left<=0){ const st=S.study; st.mode=st.mode==='focus'?'break':'focus'; st.left=(st.mode==='focus'?25:5)*60; chime(); } if(Math.floor(S.study.left)!==S.study._s){ S.study._s=Math.floor(S.study.left); studyUI(); } }
  slow+=dt; if(slow>((S.lapse||S.ylapse)?.25:2)){slow=0;tick(false);}
  acc+=dt; if(acc>=1/15){acc=0;render();}
  requestAnimationFrame(loop);
}

/* ================= Audio ================= */
const AU={ctx:null,on:false,step:0,next:0,timer:null,rec:{}};
const PROG=[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]];
const mtof=m=>440*Math.pow(2,(m-69)/12);
function auInit(){
  const Cx=window.AudioContext||window.webkitAudioContext; if(!Cx) return false;
  const c=AU.ctx=new Cx(); AU.master=c.createGain(); AU.master.gain.value=0; AU.lp=c.createBiquadFilter(); AU.lp.type='lowpass'; AU.lp.frequency.value=2200;
  AU.master.connect(AU.lp); AU.lp.connect(c.destination);
  const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate), d=nb.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1);
  AU.noise=nb;
  const cb=c.createBuffer(1,c.sampleRate*3,c.sampleRate), cd=cb.getChannelData(0); for(let i=0;i<cd.length;i++) cd[i]=(Math.random()*2-1)*.012+(Math.random()<.0006?(Math.random()*2-1)*.5:0);
  const cs=c.createBufferSource(); cs.buffer=cb; cs.loop=true; const cg=c.createGain(); cg.gain.value=.35; cs.connect(cg); cg.connect(AU.master); cs.start();
  return true;
}
/* Optional real recordings: add files at sounds/<animal-id>.mp3 next to index.html (see README). Missing files fall back to the synthesised calls. */
function recording(id){ if(AU.rec[id]!==undefined) return AU.rec[id]; AU.rec[id]=null; if(!/^https?:$/.test(location.protocol)) { AU.rec[id]=false; return null; }
  fetch('sounds/'+id+'.mp3').then(r=>r.ok?r.arrayBuffer():Promise.reject()).then(b=>AU.ctx.decodeAudioData(b)).then(buf=>{AU.rec[id]=buf}).catch(()=>{AU.rec[id]=false}); return null; }
function playRec(buf,t){ const s=AU.ctx.createBufferSource(), gn=AU.ctx.createGain(); s.buffer=buf; gn.gain.setValueAtTime(.5,t); gn.gain.setTargetAtTime(0,t+Math.min(buf.duration,4),.3); s.connect(gn); gn.connect(AU.master); s.start(t); s.stop(t+Math.min(buf.duration,5)); }
function aenv(gn,t,a,peak,dec){gn.gain.setValueAtTime(0.0001,t);gn.gain.exponentialRampToValueAtTime(peak,t+a);gn.gain.exponentialRampToValueAtTime(0.0001,t+a+dec);}
function osc(type,freq,t,dur,peak,att,to,dest){const c=AU.ctx,o=c.createOscillator(),gn=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+dur*.8);aenv(gn,t,att||.01,peak,dur);o.connect(gn);gn.connect(dest||AU.master);o.start(t);o.stop(t+dur+(att||.01)+.05);return o}
function noise(t,dur,peak,ftype,freq){const c=AU.ctx,s=c.createBufferSource(),fl=c.createBiquadFilter(),gn=c.createGain();s.buffer=AU.noise;fl.type=ftype;fl.frequency.value=freq;aenv(gn,t,.005,peak,dur);s.connect(fl);fl.connect(gn);gn.connect(AU.master);s.start(t,Math.random());s.stop(t+dur+.05)}
const VOICE={
  chirp:t=>{osc('sine',2600,t,.07,.05,.005,3600);osc('sine',2800,t+.1,.06,.04,.005,3800)},
  squawk:t=>{const c=AU.ctx,fl=c.createBiquadFilter();fl.type='bandpass';fl.frequency.value=1400;fl.connect(AU.master);osc('sawtooth',900,t,.18,.05,.01,650,fl)},
  croak:t=>{for(let i=0;i<3;i++)osc('square',130,t+i*.07,.05,.025,.005)},
  trill:t=>{for(let i=0;i<6;i++)osc('triangle',3200,t+i*.035,.025,.03,.002)},
  low:t=>osc('sine',72,t,1.6,.16,.3,52),
  grunt:t=>osc('triangle',95,t,.25,.08,.02,70),
  howl:t=>{const c=AU.ctx,fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=700;fl.connect(AU.master);const o=osc('sawtooth',170,t,1.3,.06,.2,null,fl);o.frequency.linearRampToValueAtTime(320,t+.6);o.frequency.linearRampToValueAtTime(210,t+1.3)},
  roar:t=>{noise(t,1.1,.18,'lowpass',260);osc('sawtooth',70,t,1,.04,.1,48)},
  bark:t=>{osc('square',620,t,.05,.03,.003,480);osc('square',620,t+.12,.05,.025,.003,480)},
  whoop:t=>osc('sine',380,t,.7,.06,.05,950),
  hoot:t=>{osc('sine',330,t,.3,.07,.05);osc('sine',300,t+.4,.35,.06,.05)},
  bubble:t=>{osc('sine',320,t,.08,.06,.005,1100);osc('sine',420,t+.09,.07,.04,.005,1300)},
  click:t=>{for(let i=0;i<3;i++)noise(t+i*.05,.02,.08,'highpass',3000)},
  ping:t=>{const notes=[72,74,77,79,81,84];osc('sine',mtof(notes[Math.floor(Math.random()*notes.length)]),t,1.4,.05,.005)},
  scream:t=>{const c=AU.ctx,fl=c.createBiquadFilter();fl.type='bandpass';fl.frequency.value=1500;fl.connect(AU.master);osc('sawtooth',1100,t,.45,.04,.02,700,fl)},
  snuffle:t=>{for(let i=0;i<4;i++)noise(t+i*.09,.05,.06,'bandpass',900)},
  coo:t=>{osc('sine',420,t,.25,.07,.04,380);osc('sine',400,t+.35,.45,.06,.05,360)},
  robin:t=>{[88,91,86,93,89,95].forEach((m,i)=>osc('sine',mtof(m),t+i*.07,.06,.035,.004))},
  owl:t=>{osc('sine',740,t,.18,.05,.01,620);osc('sine',420,t+.5,.5,.06,.05,400);osc('sine',420,t+1.1,.6,.05,.05,380)},
  trumpet:t=>{const c=AU.ctx,fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.value=1200;fl.connect(AU.master);osc('sawtooth',300,t,.5,.04,.03,340,fl);osc('sawtooth',310,t+.55,.5,.035,.03,280,fl)},
  trillsweep:t=>osc('sine',3200,t,2.2,.05,.05,500),
  whistle:t=>{osc('sine',1800,t,.6,.04,.05,2600);osc('sine',2600,t+.6,.4,.03,.02,1900)},
  rasp:t=>noise(t,.5,.07,'highpass',2500),
};
function voiceFor(a,t){ const rec=recording(a.id); if(rec) playRec(rec,t); else (VOICE[a.voice]||VOICE.ping)(t); }
function auStep(s,t){
  const tr=HAB[S.hab].transpose, dark=S.env?S.env.dark:0, deep=S.hab==='deep';
  const bar=Math.floor(s/8), pos=s%8, beat=60/72;
  if(pos===0){ AU.lp.frequency.setTargetAtTime(deep?900:2600-1500*dark,t,.5);
    const ch=PROG[bar%4]; for(const m of ch){ const fq=mtof(m+tr); osc('triangle',fq,t,beat*4,.035,.08); osc('sine',fq*1.003,t,beat*4,.03,.08);} osc('sine',mtof(ch[0]+tr-12),t,beat*3,.12,.02); }
  if(!deep&&!(S.study&&S.study.mode==='focus')){
    if(pos===0||(pos===5&&dark<.6)) osc('sine',120,t,.28,.45,.002,42);
    if((pos===2||pos===6)&&dark<.8) noise(t,.14,.1,'bandpass',1800);
    if(dark<.5||pos%2===0) noise(t,.03,.03,'highpass',7000);
  }
  if(Math.random()<.18){const sc=[60,62,65,67,69,72,74];osc('sine',mtof(sc[Math.floor(Math.random()*sc.length)]+tr+12),t,1.2,.04,.01)}
  if((pos===3||pos===7)&&Math.random()<.55){ const aw=A.filter(a=>a.hab===S.hab&&(S.status[a.id]==='awake'||S.status[a.id]==='migrate')); if(aw.length) voiceFor(aw[Math.floor(Math.random()*aw.length)],t+.05); }
  if(pos===1&&S.env){ for(const ev of activeEvents(S.hab,S.env)) if(ev.voice&&Math.random()<.5) VOICE[ev.voice](t+.1); }
}
function auTick(){ const c=AU.ctx, ed=60/72/2; while(AU.next<c.currentTime+.25){ const sw=AU.step%2===0?ed*1.12:ed*.88; auStep(AU.step,AU.next); AU.next+=sw; AU.step++; } }
$('snd').onclick=()=>{
  if(!AU.ctx && !auInit()){ $('sndLabel').textContent='No audio here'; return; }
  const c=AU.ctx; AU.on=!AU.on; const b=$('snd');
  if(AU.on){ c.resume(); AU.master.gain.cancelScheduledValues(c.currentTime); AU.master.gain.setTargetAtTime(.55,c.currentTime,.4); AU.next=c.currentTime+.1; AU.timer=setInterval(auTick,40); b.classList.add('on'); $('sndLabel').textContent='Pause lofi'; }
  else { AU.master.gain.setTargetAtTime(0,c.currentTime,.2); clearInterval(AU.timer); b.classList.remove('on'); $('sndLabel').textContent='Play lofi'; }
  b.setAttribute('aria-pressed',AU.on);
};

/* ================= Boot ================= */
icons(); buildTabs(); buildWorld(); tick(true); if(S.view==='world') setView('world'); else setHab(S.hab,false); render(); requestAnimationFrame(loop); fetchWeather(); setInterval(fetchWeather,15*60*1000);
