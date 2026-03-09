import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n.js";

const TRIGRAMS = {
  "111": { hans:{name:"乾",nature:"天"}, hant:{name:"乾",nature:"天"}, en:{name:"Heaven",  nature:""} },
  "011": { hans:{name:"兑",nature:"泽"}, hant:{name:"兌",nature:"澤"}, en:{name:"Lake",    nature:""} },
  "101": { hans:{name:"离",nature:"火"}, hant:{name:"離",nature:"火"}, en:{name:"Fire",    nature:""} },
  "001": { hans:{name:"震",nature:"雷"}, hant:{name:"震",nature:"雷"}, en:{name:"Thunder", nature:""} },
  "110": { hans:{name:"巽",nature:"风"}, hant:{name:"巽",nature:"風"}, en:{name:"Wind",    nature:""} },
  "010": { hans:{name:"坎",nature:"水"}, hant:{name:"坎",nature:"水"}, en:{name:"Water",   nature:""} },
  "100": { hans:{name:"艮",nature:"山"}, hant:{name:"艮",nature:"山"}, en:{name:"Mountain",nature:""} },
  "000": { hans:{name:"坤",nature:"地"}, hant:{name:"坤",nature:"地"}, en:{name:"Earth",   nature:""} },
};

// Key = [初爻..上爻].join(""), 1=yang 0=yin, lower trigram=first 3 digits, upper=last 3
const HEXAGRAM_DB = {
  "111111":{ num:1,  hans:{name:"乾",  title:"乾为天",   judgment:"元亨利贞。"},                             hant:{name:"乾",  title:"乾為天",   judgment:"元亨利貞。"},                             en:{name:"The Creative",            title:"Heaven / Heaven",    judgment:"Sublime success, furthering through perseverance."} },
  "000000":{ num:2,  hans:{name:"坤",  title:"坤为地",   judgment:"元亨，利牝马之贞。"},                     hant:{name:"坤",  title:"坤為地",   judgment:"元亨，利牝馬之貞。"},                     en:{name:"The Receptive",           title:"Earth / Earth",      judgment:"Sublime success, furthering through the perseverance of a mare."} },
  "100010":{ num:3,  hans:{name:"屯",  title:"水雷屯",   judgment:"元亨利贞，勿用有攸往，利建侯。"},         hant:{name:"屯",  title:"水雷屯",   judgment:"元亨利貞，勿用有攸往，利建侯。"},         en:{name:"Difficulty at the Beginning",title:"Water / Thunder",  judgment:"Sublime success. Perseverance furthers. Do not set out; it furthers to appoint helpers."} },
  "010001":{ num:4,  hans:{name:"蒙",  title:"山水蒙",   judgment:"亨。匪我求童蒙，童蒙求我。"},             hant:{name:"蒙",  title:"山水蒙",   judgment:"亨。匪我求童蒙，童蒙求我。"},             en:{name:"Youthful Folly",          title:"Mountain / Water",   judgment:"It is not I who seek the young fool; the young fool seeks me."} },
  "111010":{ num:5,  hans:{name:"需",  title:"水天需",   judgment:"有孚，光亨，贞吉，利涉大川。"},           hant:{name:"需",  title:"水天需",   judgment:"有孚，光亨，貞吉，利涉大川。"},           en:{name:"Waiting",                 title:"Water / Heaven",     judgment:"If you are sincere, you have light and success. Perseverance brings good fortune."} },
  "010111":{ num:6,  hans:{name:"讼",  title:"天水讼",   judgment:"有孚，窒惕，中吉，终凶。"},               hant:{name:"訟",  title:"天水訟",   judgment:"有孚，窒惕，中吉，終凶。"},               en:{name:"Conflict",                title:"Heaven / Water",     judgment:"You are sincere but obstructed. A cautious halt partway brings good fortune; going through to the end brings misfortune."} },
  "010000":{ num:7,  hans:{name:"师",  title:"地水师",   judgment:"贞，丈人吉，无咎。"},                     hant:{name:"師",  title:"地水師",   judgment:"貞，丈人吉，無咎。"},                     en:{name:"The Army",                title:"Earth / Water",      judgment:"The army needs perseverance and a strong man. Good fortune without blame."} },
  "000010":{ num:8,  hans:{name:"比",  title:"水地比",   judgment:"吉。原筮，元永贞，无咎。"},               hant:{name:"比",  title:"水地比",   judgment:"吉。原筮，元永貞，無咎。"},               en:{name:"Holding Together",        title:"Water / Earth",      judgment:"Good fortune. Inquire of the oracle whether you possess sublimity, constancy, and perseverance; then there is no blame."} },
  "111011":{ num:9,  hans:{name:"小畜",title:"风天小畜", judgment:"亨。密云不雨，自我西郊。"},               hant:{name:"小畜",title:"風天小畜", judgment:"亨。密雲不雨，自我西郊。"},               en:{name:"Small Taming",            title:"Wind / Heaven",      judgment:"Success. Dense clouds, no rain from our western region."} },
  "110111":{ num:10, hans:{name:"履",  title:"天泽履",   judgment:"履虎尾，不咥人，亨。"},                   hant:{name:"履",  title:"天澤履",   judgment:"履虎尾，不咥人，亨。"},                   en:{name:"Treading",                title:"Heaven / Lake",      judgment:"Treading upon the tail of the tiger; it does not bite the man. Success."} },
  "111000":{ num:11, hans:{name:"泰",  title:"地天泰",   judgment:"小往大来，吉亨。"},                       hant:{name:"泰",  title:"地天泰",   judgment:"小往大來，吉亨。"},                       en:{name:"Peace",                   title:"Earth / Heaven",     judgment:"The small departs, the great approaches. Good fortune and success."} },
  "000111":{ num:12, hans:{name:"否",  title:"天地否",   judgment:"否之匪人，不利君子贞。"},                 hant:{name:"否",  title:"天地否",   judgment:"否之匪人，不利君子貞。"},                 en:{name:"Standstill",              title:"Heaven / Earth",     judgment:"Evil people do not further the perseverance of the superior man. The great departs; the small approaches."} },
  "101111":{ num:13, hans:{name:"同人",title:"天火同人", judgment:"同人于野，亨，利涉大川。"},               hant:{name:"同人",title:"天火同人", judgment:"同人于野，亨，利涉大川。"},               en:{name:"Fellowship",              title:"Heaven / Fire",      judgment:"Fellowship with men in the open. Success. It furthers to cross the great water."} },
  "111101":{ num:14, hans:{name:"大有",title:"火天大有", judgment:"元亨。"},                                 hant:{name:"大有",title:"火天大有", judgment:"元亨。"},                                 en:{name:"Great Possession",        title:"Fire / Heaven",      judgment:"Supreme success."} },
  "001000":{ num:15, hans:{name:"谦",  title:"地山谦",   judgment:"亨，君子有终。"},                         hant:{name:"謙",  title:"地山謙",   judgment:"亨，君子有終。"},                         en:{name:"Modesty",                 title:"Earth / Mountain",   judgment:"Success. The superior man carries things through."} },
  "000100":{ num:16, hans:{name:"豫",  title:"雷地豫",   judgment:"利建侯行师。"},                           hant:{name:"豫",  title:"雷地豫",   judgment:"利建侯行師。"},                           en:{name:"Enthusiasm",              title:"Thunder / Earth",    judgment:"It furthers to install helpers and to set armies marching."} },
  "100110":{ num:17, hans:{name:"随",  title:"泽雷随",   judgment:"元亨利贞，无咎。"},                       hant:{name:"隨",  title:"澤雷隨",   judgment:"元亨利貞，無咎。"},                       en:{name:"Following",               title:"Lake / Thunder",     judgment:"Supreme success. Perseverance furthers. No blame."} },
  "011001":{ num:18, hans:{name:"蛊",  title:"山风蛊",   judgment:"元亨，利涉大川。先甲三日，后甲三日。"},   hant:{name:"蠱",  title:"山風蠱",   judgment:"元亨，利涉大川。先甲三日，後甲三日。"},   en:{name:"Work on the Spoiled",     title:"Mountain / Wind",    judgment:"Supreme success. It furthers to cross the great water. Before the starting point, three days; after, three days."} },
  "110000":{ num:19, hans:{name:"临",  title:"地泽临",   judgment:"元亨利贞，至于八月有凶。"},               hant:{name:"臨",  title:"地澤臨",   judgment:"元亨利貞，至於八月有凶。"},               en:{name:"Approach",                title:"Earth / Lake",       judgment:"Supreme success. Perseverance furthers. When the eighth month comes, there will be misfortune."} },
  "000011":{ num:20, hans:{name:"观",  title:"风地观",   judgment:"盥而不荐，有孚颙若。"},                   hant:{name:"觀",  title:"風地觀",   judgment:"盥而不薦，有孚顒若。"},                   en:{name:"Contemplation",           title:"Wind / Earth",       judgment:"The ablution has been made, but not yet the offering. Full of trust they look up to him."} },
  "100101":{ num:21, hans:{name:"噬嗑",title:"火雷噬嗑", judgment:"亨，利用狱。"},                           hant:{name:"噬嗑",title:"火雷噬嗑", judgment:"亨，利用獄。"},                           en:{name:"Biting Through",          title:"Fire / Thunder",     judgment:"Success. It furthers to let justice be administered."} },
  "101001":{ num:22, hans:{name:"贲",  title:"山火贲",   judgment:"亨，小利有攸往。"},                       hant:{name:"賁",  title:"山火賁",   judgment:"亨，小利有攸往。"},                       en:{name:"Grace",                   title:"Mountain / Fire",    judgment:"Success. In small matters it furthers one to undertake something."} },
  "000001":{ num:23, hans:{name:"剥",  title:"山地剥",   judgment:"不利有攸往。"},                           hant:{name:"剝",  title:"山地剝",   judgment:"不利有攸往。"},                           en:{name:"Splitting Apart",         title:"Mountain / Earth",   judgment:"It does not further one to go anywhere."} },
  "100000":{ num:24, hans:{name:"复",  title:"地雷复",   judgment:"亨，出入无疾，朋来无咎。"},               hant:{name:"復",  title:"地雷復",   judgment:"亨，出入無疾，朋來無咎。"},               en:{name:"Return",                  title:"Earth / Thunder",    judgment:"Success. Going out and coming in without error. Friends come without blame."} },
  "100111":{ num:25, hans:{name:"无妄",title:"天雷无妄", judgment:"元亨利贞，其匪正有眚，不利有攸往。"},     hant:{name:"無妄",title:"天雷無妄", judgment:"元亨利貞，其匪正有眚，不利有攸往。"},     en:{name:"Innocence",               title:"Heaven / Thunder",   judgment:"Supreme success. Perseverance furthers. If someone is not as they should be, misfortune follows."} },
  "111001":{ num:26, hans:{name:"大畜",title:"山天大畜", judgment:"利贞，不家食吉，利涉大川。"},             hant:{name:"大畜",title:"山天大畜", judgment:"利貞，不家食吉，利涉大川。"},             en:{name:"Great Taming",            title:"Mountain / Heaven",  judgment:"Perseverance furthers. Not eating at home brings good fortune. It furthers to cross the great water."} },
  "100001":{ num:27, hans:{name:"颐",  title:"山雷颐",   judgment:"贞吉，观颐，自求口实。"},                 hant:{name:"頤",  title:"山雷頤",   judgment:"貞吉，觀頤，自求口實。"},                 en:{name:"Nourishment",             title:"Mountain / Thunder", judgment:"Perseverance brings good fortune. Pay heed to the providing of nourishment."} },
  "011110":{ num:28, hans:{name:"大过",title:"泽风大过", judgment:"栋桡，利有攸往，亨。"},                   hant:{name:"大過",title:"澤風大過", judgment:"棟橈，利有攸往，亨。"},                   en:{name:"Great Preponderance",     title:"Lake / Wind",        judgment:"The ridgepole sags. It furthers one to have somewhere to go. Success."} },
  "010010":{ num:29, hans:{name:"坎",  title:"坎为水",   judgment:"习坎，有孚，维心亨，行有尚。"},           hant:{name:"坎",  title:"坎為水",   judgment:"習坎，有孚，維心亨，行有尚。"},           en:{name:"The Abysmal",             title:"Water / Water",      judgment:"The Abysmal repeated. If you are sincere, you have success in your heart."} },
  "101101":{ num:30, hans:{name:"离",  title:"离为火",   judgment:"利贞，亨。畜牝牛，吉。"},                 hant:{name:"離",  title:"離為火",   judgment:"利貞，亨。畜牝牛，吉。"},                 en:{name:"The Clinging",            title:"Fire / Fire",        judgment:"Perseverance furthers. Success. Care for the cow brings good fortune."} },
  "001110":{ num:31, hans:{name:"咸",  title:"泽山咸",   judgment:"亨利贞，取女吉。"},                       hant:{name:"咸",  title:"澤山咸",   judgment:"亨利貞，取女吉。"},                       en:{name:"Influence",               title:"Lake / Mountain",    judgment:"Success. Perseverance furthers. Taking a maiden to wife brings good fortune."} },
  "011100":{ num:32, hans:{name:"恒",  title:"雷风恒",   judgment:"亨，无咎，利贞，利有攸往。"},             hant:{name:"恆",  title:"雷風恆",   judgment:"亨，無咎，利貞，利有攸往。"},             en:{name:"Duration",                title:"Thunder / Wind",     judgment:"Success. No blame. Perseverance furthers. It furthers to have somewhere to go."} },
  "001111":{ num:33, hans:{name:"遁",  title:"天山遁",   judgment:"亨，小利贞。"},                           hant:{name:"遁",  title:"天山遁",   judgment:"亨，小利貞。"},                           en:{name:"Retreat",                 title:"Heaven / Mountain",  judgment:"Success. In what is small, perseverance furthers."} },
  "111100":{ num:34, hans:{name:"大壮",title:"雷天大壮", judgment:"利贞。"},                                 hant:{name:"大壯",title:"雷天大壯", judgment:"利貞。"},                                 en:{name:"Great Power",             title:"Thunder / Heaven",   judgment:"Perseverance furthers."} },
  "000101":{ num:35, hans:{name:"晋",  title:"火地晋",   judgment:"康侯用锡马蕃庶，昼日三接。"},             hant:{name:"晉",  title:"火地晉",   judgment:"康侯用錫馬蕃庶，晝日三接。"},             en:{name:"Progress",                title:"Fire / Earth",       judgment:"The powerful prince is honored with horses in large numbers. In a single day he is granted audience three times."} },
  "101000":{ num:36, hans:{name:"明夷",title:"地火明夷", judgment:"利艰贞。"},                               hant:{name:"明夷",title:"地火明夷", judgment:"利艱貞。"},                               en:{name:"Darkening of the Light",  title:"Earth / Fire",       judgment:"In adversity it furthers one to be persevering."} },
  "101011":{ num:37, hans:{name:"家人",title:"风火家人", judgment:"利女贞。"},                               hant:{name:"家人",title:"風火家人", judgment:"利女貞。"},                               en:{name:"The Family",              title:"Wind / Fire",        judgment:"The perseverance of the woman furthers."} },
  "110101":{ num:38, hans:{name:"睽",  title:"火泽睽",   judgment:"小事吉。"},                               hant:{name:"睽",  title:"火澤睽",   judgment:"小事吉。"},                               en:{name:"Opposition",              title:"Fire / Lake",        judgment:"In small matters, good fortune."} },
  "001010":{ num:39, hans:{name:"蹇",  title:"水山蹇",   judgment:"利西南，不利东北；利见大人，贞吉。"},     hant:{name:"蹇",  title:"水山蹇",   judgment:"利西南，不利東北；利見大人，貞吉。"},     en:{name:"Obstruction",             title:"Water / Mountain",   judgment:"The southwest furthers. The northeast does not further. It furthers to see the great man. Perseverance brings good fortune."} },
  "010100":{ num:40, hans:{name:"解",  title:"雷水解",   judgment:"利西南，无所往，其来复吉。"},             hant:{name:"解",  title:"雷水解",   judgment:"利西南，無所往，其來復吉。"},             en:{name:"Deliverance",             title:"Thunder / Water",    judgment:"The southwest furthers. If there is no longer anything where one has to go, return brings good fortune."} },
  "110001":{ num:41, hans:{name:"损",  title:"山泽损",   judgment:"有孚，元吉，无咎，可贞，利有攸往。"},     hant:{name:"損",  title:"山澤損",   judgment:"有孚，元吉，無咎，可貞，利有攸往。"},     en:{name:"Decrease",                title:"Mountain / Lake",    judgment:"Decrease combined with sincerity brings supreme good fortune. No blame. One may be persevering."} },
  "100011":{ num:42, hans:{name:"益",  title:"风雷益",   judgment:"利有攸往，利涉大川。"},                   hant:{name:"益",  title:"風雷益",   judgment:"利有攸往，利涉大川。"},                   en:{name:"Increase",                title:"Wind / Thunder",     judgment:"It furthers one to undertake something. It furthers one to cross the great water."} },
  "111110":{ num:43, hans:{name:"夬",  title:"泽天夬",   judgment:"扬于王庭，孚号，有厉，告自邑，不利即戎，利有攸往。"}, hant:{name:"夬",  title:"澤天夬",   judgment:"揚于王庭，孚號，有厲，告自邑，不利即戎，利有攸往。"}, en:{name:"Breakthrough",            title:"Lake / Heaven",      judgment:"One must resolutely make the matter known at the court of the king. It must be announced truthfully. Danger."} },
  "011111":{ num:44, hans:{name:"姤",  title:"天风姤",   judgment:"女壮，勿用取女。"},                       hant:{name:"姤",  title:"天風姤",   judgment:"女壯，勿用取女。"},                       en:{name:"Coming to Meet",          title:"Heaven / Wind",      judgment:"The maiden is powerful. One should not marry such a maiden."} },
  "000110":{ num:45, hans:{name:"萃",  title:"泽地萃",   judgment:"亨，王假有庙，利见大人，亨，利贞。"},     hant:{name:"萃",  title:"澤地萃",   judgment:"亨，王假有廟，利見大人，亨，利貞。"},     en:{name:"Gathering Together",      title:"Lake / Earth",       judgment:"Success. The king approaches his temple. It furthers to see the great man. Perseverance furthers."} },
  "011000":{ num:46, hans:{name:"升",  title:"地风升",   judgment:"元亨，用见大人，勿恤，南征吉。"},         hant:{name:"升",  title:"地風升",   judgment:"元亨，用見大人，勿恤，南征吉。"},         en:{name:"Pushing Upward",          title:"Earth / Wind",       judgment:"Supreme success. One must see the great man. Fear not. Departure toward the south brings good fortune."} },
  "010110":{ num:47, hans:{name:"困",  title:"泽水困",   judgment:"亨，贞大人吉，无咎，有言不信。"},         hant:{name:"困",  title:"澤水困",   judgment:"亨，貞大人吉，無咎，有言不信。"},         en:{name:"Oppression",              title:"Lake / Water",       judgment:"Success. Perseverance. The great man brings good fortune. No blame. When one has something to say, it is not believed."} },
  "011010":{ num:48, hans:{name:"井",  title:"水风井",   judgment:"改邑不改井，无丧无得，往来井井。"},       hant:{name:"井",  title:"水風井",   judgment:"改邑不改井，無喪無得，往來井井。"},       en:{name:"The Well",                title:"Water / Wind",       judgment:"The town may be changed, but the well cannot be changed. It neither decreases nor increases."} },
  "101110":{ num:49, hans:{name:"革",  title:"泽火革",   judgment:"己日乃孚，元亨利贞，悔亡。"},             hant:{name:"革",  title:"澤火革",   judgment:"己日乃孚，元亨利貞，悔亡。"},             en:{name:"Revolution",              title:"Lake / Fire",        judgment:"On your own day you are believed. Supreme success, furthering through perseverance. Remorse disappears."} },
  "011101":{ num:50, hans:{name:"鼎",  title:"火风鼎",   judgment:"元吉，亨。"},                             hant:{name:"鼎",  title:"火風鼎",   judgment:"元吉，亨。"},                             en:{name:"The Cauldron",            title:"Fire / Wind",        judgment:"Supreme good fortune. Success."} },
  "100100":{ num:51, hans:{name:"震",  title:"震为雷",   judgment:"亨，震来虩虩，笑言哑哑，震惊百里，不丧匕鬯。"}, hant:{name:"震",  title:"震為雷",   judgment:"亨，震來虩虩，笑言啞啞，震驚百里，不喪匕鬯。"}, en:{name:"The Arousing",            title:"Thunder / Thunder",  judgment:"Thunder brings success. Thunder comes—boom! Laughing words—ha-ha! The thunder terrifies for a hundred miles."} },
  "001001":{ num:52, hans:{name:"艮",  title:"艮为山",   judgment:"艮其背，不获其身，行其庭，不见其人，无咎。"}, hant:{name:"艮",  title:"艮為山",   judgment:"艮其背，不獲其身，行其庭，不見其人，無咎。"}, en:{name:"Keeping Still",           title:"Mountain / Mountain",judgment:"Keeping his back still so that he no longer feels his body. He goes into his courtyard and does not see his people. No blame."} },
  "001011":{ num:53, hans:{name:"渐",  title:"风山渐",   judgment:"女归吉，利贞。"},                         hant:{name:"漸",  title:"風山漸",   judgment:"女歸吉，利貞。"},                         en:{name:"Development",             title:"Wind / Mountain",    judgment:"The maiden is given in marriage. Good fortune. Perseverance furthers."} },
  "110100":{ num:54, hans:{name:"归妹",title:"雷泽归妹", judgment:"征凶，无攸利。"},                         hant:{name:"歸妹",title:"雷澤歸妹", judgment:"征凶，無攸利。"},                         en:{name:"The Marrying Maiden",     title:"Thunder / Lake",     judgment:"Undertakings bring misfortune. Nothing that would further."} },
  "101100":{ num:55, hans:{name:"丰",  title:"雷火丰",   judgment:"亨，王假之，勿忧，宜日中。"},             hant:{name:"豐",  title:"雷火豐",   judgment:"亨，王假之，勿憂，宜日中。"},             en:{name:"Abundance",               title:"Thunder / Fire",     judgment:"Success. The king attains abundance. Be not sad. Be like the sun at midday."} },
  "001101":{ num:56, hans:{name:"旅",  title:"火山旅",   judgment:"小亨，旅贞吉。"},                         hant:{name:"旅",  title:"火山旅",   judgment:"小亨，旅貞吉。"},                         en:{name:"The Wanderer",            title:"Fire / Mountain",    judgment:"Success through smallness. Perseverance brings good fortune to the wanderer."} },
  "011011":{ num:57, hans:{name:"巽",  title:"巽为风",   judgment:"小亨，利有攸往，利见大人。"},             hant:{name:"巽",  title:"巽為風",   judgment:"小亨，利有攸往，利見大人。"},             en:{name:"The Gentle",              title:"Wind / Wind",        judgment:"Success through what is small. It furthers one to have somewhere to go. It furthers one to see the great man."} },
  "110110":{ num:58, hans:{name:"兑",  title:"兑为泽",   judgment:"亨，利贞。"},                             hant:{name:"兌",  title:"兌為澤",   judgment:"亨，利貞。"},                             en:{name:"The Joyous",              title:"Lake / Lake",        judgment:"Success. Perseverance is favorable."} },
  "010011":{ num:59, hans:{name:"涣",  title:"风水涣",   judgment:"亨，王假有庙，利涉大川，利贞。"},         hant:{name:"渙",  title:"風水渙",   judgment:"亨，王假有廟，利涉大川，利貞。"},         en:{name:"Dispersion",              title:"Wind / Water",       judgment:"Success. The king approaches his temple. It furthers to cross the great water. Perseverance furthers."} },
  "110010":{ num:60, hans:{name:"节",  title:"水泽节",   judgment:"亨，苦节不可贞。"},                       hant:{name:"節",  title:"水澤節",   judgment:"亨，苦節不可貞。"},                       en:{name:"Limitation",              title:"Water / Lake",       judgment:"Success. Galling limitation must not be persevered in."} },
  "110011":{ num:61, hans:{name:"中孚",title:"风泽中孚", judgment:"豚鱼吉，利涉大川，利贞。"},               hant:{name:"中孚",title:"風澤中孚", judgment:"豚魚吉，利涉大川，利貞。"},               en:{name:"Inner Truth",             title:"Wind / Lake",        judgment:"Pigs and fishes. Good fortune. It furthers to cross the great water. Perseverance furthers."} },
  "001100":{ num:62, hans:{name:"小过",title:"雷山小过", judgment:"亨，利贞，可小事，不可大事。"},           hant:{name:"小過",title:"雷山小過", judgment:"亨，利貞，可小事，不可大事。"},           en:{name:"Small Preponderance",     title:"Thunder / Mountain", judgment:"Success. Perseverance furthers. Small things may be done; great things should not be done."} },
  "101010":{ num:63, hans:{name:"既济",title:"水火既济", judgment:"亨，小利贞，初吉终乱。"},                 hant:{name:"既濟",title:"水火既濟", judgment:"亨，小利貞，初吉終亂。"},                 en:{name:"After Completion",        title:"Water / Fire",       judgment:"Success in small matters. Perseverance furthers. At the beginning good fortune, at the end disorder."} },
  "010101":{ num:64, hans:{name:"未济",title:"火水未济", judgment:"亨，小狐汔济，濡其尾，无攸利。"},         hant:{name:"未濟",title:"火水未濟", judgment:"亨，小狐汔濟，濡其尾，無攸利。"},         en:{name:"Before Completion",       title:"Fire / Water",       judgment:"Success. But if the little fox, after nearly completing the crossing, gets his tail in the water, there is nothing that would further."} },
};

function castLine() { return [0,1,2].reduce(a => a + (Math.random()<0.5?2:3), 0); }
function lineVal(v) { return (v===7||v===9) ? 1 : 0; }
function getHex(arr) {
  return HEXAGRAM_DB[arr.join("")] || {
    num:"?",
    hans:{name:"？",title:"未知之卦",judgment:"此卦暂未收录。"},
    hant:{name:"？",title:"未知之卦",judgment:"此卦暫未收錄。"},
    en:{name:"Unknown",title:"Unknown",judgment:"This hexagram is not in the database."},
  };
}
function upperTriKey(vals) { return [vals[5],vals[4],vals[3]].join(""); }
function lowerTriKey(vals)  { return [vals[2],vals[1],vals[0]].join(""); }
function hexLang(entry, lang) {
  return entry[lang==="en" ? "en" : lang==="zh-Hant" ? "hant" : "hans"];
}
function triLang(tri, lang) {
  if (!tri) return {name:"",nature:""};
  return tri[lang==="en" ? "en" : lang==="zh-Hant" ? "hant" : "hans"];
}

function buildSummary(question, lines, lang, t) {
  const vals    = lines.map(lineVal);
  const changed = lines.map(v => v===9?0:v===6?1:lineVal(v));
  const pEntry  = getHex(vals);
  const hasChg  = lines.some(v=>v===6||v===9);
  const rEntry  = hasChg ? getHex(changed) : null;
  const primary = hexLang(pEntry, lang);
  const result  = rEntry ? hexLang(rEntry, lang) : null;
  const yao     = v => lineVal(v)===1 ? "━━━━━" : "━━ ━━";
  const block   = ls => [...ls].reverse().map(v => "  "+yao(v)).join("\n");
  const hexStr  = (entry, d) => lang==="en"
    ? `${d.name} (${t("card.hexNum",{num:entry.num})} · ${d.title})`
    : `${d.title}（${t("card.hexNum",{num:entry.num})} · ${d.name}）`;

  let out = t("summary.header") + "\n";
  out += t("summary.time") + new Date().toLocaleString(
    lang==="en" ? undefined : lang==="zh-Hant" ? "zh-TW" : "zh-CN"
  ) + "\n";
  if (question) out += t("summary.question") + question + "\n";
  out += "\n" + t("summary.primary") + hexStr(pEntry, primary) + "\n";
  out += block(lines) + "\n" + t("summary.judgment") + primary.judgment + "\n";
  if (hasChg && result) {
    const chgs = lines.map((v,i) => (v===6||v===9)
      ? `  ${t(`line.${i}`)}${t("changing.lineSuffix")}：${v===9?t("summary.yangChg"):t("summary.yinChg")}`
      : null).filter(Boolean);
    out += "\n" + t("summary.changing") + "\n" + chgs.join("\n") + "\n";
    out += "\n" + t("summary.derived") + hexStr(rEntry, result) + "\n";
    out += block(changed.map(v=>v===1?7:8)) + "\n" + t("summary.judgment") + result.judgment + "\n";
  }
  out += "\n---\n" + t("summary.footer");
  return out;
}

function LineDraw({ v, idx, showMark, isResult }) {
  const val     = lineVal(v);
  const changing= v===6||v===9;
  const color   = changing?(v===9?"#e8a04b":"#8ab4d4"):(isResult?"rgba(200,168,75,0.55)":"#e8d5a0");
  const glow    = changing?`0 0 10px ${v===9?"rgba(232,160,75,0.7)":"rgba(138,180,212,0.7)"}`:"none";
  const { t }   = useTranslation();
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
      <span style={{fontSize:9,color:"rgba(200,168,75,0.4)",width:18,textAlign:"right"}}>
        {t(`line.${5-idx}`)}
      </span>
      {val===1
        ? <div style={{width:80,height:8,background:color,boxShadow:glow,borderRadius:1}}/>
        : <div style={{width:80,display:"flex",gap:6}}>
            <div style={{flex:1,height:8,background:color,boxShadow:glow,borderRadius:1}}/>
            <div style={{flex:1,height:8,background:color,boxShadow:glow,borderRadius:1}}/>
          </div>
      }
      <span style={{width:16,fontSize:12,textAlign:"center",color:v===9?"#e8a04b":"#8ab4d4"}}>
        {showMark&&changing?(v===9?"○":"✕"):""}
      </span>
    </div>
  );
}

function HexCard({ label, lines, isResult }) {
  const { t, i18n } = useTranslation();
  const lang   = i18n.language;
  const vals   = lines.map(lineVal);
  const entry  = getHex(vals);
  const hex    = hexLang(entry, lang);
  const tu     = triLang(TRIGRAMS[upperTriKey(vals)], lang);
  const tl     = triLang(TRIGRAMS[lowerTriKey(vals)], lang);
  const triStr = (tri) => lang==="en" ? tri.name : `${tri.name} ${tri.nature}`;
  const accent = isResult?"#8ab4d4":"#c8a84b";
  const border = isResult?"rgba(138,180,212,0.25)":"rgba(200,168,75,0.25)";
  return (
    <div style={{border:`1px solid ${border}`,background:"rgba(200,168,75,0.03)",
      padding:"28px 28px 24px",minWidth:200,textAlign:"center"}}>
      <div style={{fontSize:10,letterSpacing:5,color:accent,marginBottom:18}}>{label}</div>
      <div style={{fontSize:11,color:"rgba(200,168,75,0.45)",letterSpacing:2,marginBottom:4}}>{triStr(tu)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8,margin:"8px 0"}}>
        {[...lines].reverse().map((v,i)=>
          <LineDraw key={i} v={v} idx={i} showMark={!isResult} isResult={isResult}/>
        )}
      </div>
      <div style={{fontSize:11,color:"rgba(200,168,75,0.45)",letterSpacing:2,marginTop:4,marginBottom:16}}>{triStr(tl)}</div>
      <div style={{width:50,height:1,background:border,margin:"0 auto 14px"}}/>
      <div style={{fontSize:28,fontWeight:700,color:isResult?"#8ab4d4":"#f5e09a",marginBottom:4}}>{hex.name}</div>
      <div style={{fontSize:11,letterSpacing:2,color:"rgba(200,168,75,0.6)",marginBottom:12}}>
        {t("card.hexNum",{num:entry.num})} · {hex.title}
      </div>
      <div style={{fontSize:11,color:"rgba(200,168,75,0.5)",lineHeight:2,
        borderTop:"1px solid rgba(200,168,75,0.1)",paddingTop:12,maxWidth:180,margin:"0 auto"}}>
        {hex.judgment}
      </div>
    </div>
  );
}

const LANGS = ["zh-Hans","zh-Hant","en"];

export default function IChing() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [question, setQuestion] = useState("");
  const [lines,    setLines]    = useState(null);
  const [casting,  setCasting]  = useState(false);
  const [step,     setStep]     = useState(0);
  const [copied,   setCopied]   = useState(false);

  const cast = async () => {
    setCasting(true); setLines(null); setStep(0); setCopied(false);
    const r = [];
    for (let i=0; i<6; i++) {
      setStep(i+1);
      await new Promise(res=>setTimeout(res,320));
      r.push(castLine());
      setLines([...r]);
    }
    setCasting(false);
  };

  const reset = () => { setLines(null); setStep(0); setCopied(false); };
  const done         = lines?.length===6 && !casting;
  const hasChange    = lines?.some(v=>v===6||v===9);
  const changedLines = lines?.map(v=>v===9?8:v===6?7:v);
  const summary      = done ? buildSummary(question, lines, lang, t) : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(()=>{
      setCopied(true); setTimeout(()=>setCopied(false),2500);
    });
  };
  const handleExport = () => {
    const blob = new Blob([summary],{type:"text/plain;charset=utf-8"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href=url; a.download=`${t("summary.filePrefix")}_${new Date().toISOString().slice(0,10)}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const actionBtnStyle = (active) => ({
    display:"flex",alignItems:"center",gap:8,cursor:"pointer",
    background:active?"rgba(200,168,75,0.18)":"rgba(200,168,75,0.07)",
    border:`1px solid ${active?"rgba(200,168,75,0.6)":"rgba(200,168,75,0.3)"}`,
    color:active?"#f5e09a":"#d4b86a",padding:"11px 24px",
    fontSize:13,letterSpacing:3,fontFamily:"inherit",transition:"all 0.2s",
  });

  return (
    <div style={{minHeight:"100vh",background:"#150f05",
      backgroundImage:"radial-gradient(ellipse at 50% 0%, #261808 0%, #150f05 65%)",
      display:"flex",flexDirection:"column",alignItems:"center",
      padding:"48px 20px 80px",
      fontFamily:"'Noto Serif SC','STSong','SimSun',serif",color:"#e8d5a0"}}>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes fi{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
        textarea{outline:none}
        textarea:focus{border-color:rgba(200,168,75,0.5)!important}
        textarea::placeholder{color:rgba(200,168,75,0.3)}
        .cast-btn:hover{background:rgba(200,168,75,0.1)!important;box-shadow:0 0 32px rgba(200,168,75,0.3)!important}
        .reset-btn:hover{color:rgba(200,168,75,0.7)!important}
        .action-btn:hover{background:rgba(200,168,75,0.18)!important}
        .action-btn:active{transform:scale(0.97)}
        .lang-btn:hover{color:rgba(200,168,75,0.8)!important;border-color:rgba(200,168,75,0.4)!important}
        /* ── Mobile layout ── */
        @media (max-width:600px){
          .hex-row{flex-direction:column!important;align-items:center}
          .hex-arrow{transform:rotate(90deg)}
          .hex-card{min-width:unset!important;width:100%;max-width:320px}
          .lang-switcher{top:10px!important;right:10px!important;gap:4px!important}
          .lang-btn{padding:4px 7px!important;font-size:10px!important}
          .cast-btn{padding:12px 32px!important;font-size:15px!important}
        }
      `}</style>

      {/* Language switcher */}
      <div className="lang-switcher"
        style={{position:"fixed",top:16,right:20,display:"flex",gap:6,zIndex:100}}>
        {LANGS.map(l => (
          <button key={l} className="lang-btn"
            onClick={() => i18n.changeLanguage(l)}
            style={{
              background:lang===l?"rgba(200,168,75,0.15)":"none",
              border:`1px solid ${lang===l?"rgba(200,168,75,0.5)":"rgba(200,168,75,0.2)"}`,
              color:lang===l?"#f5e09a":"rgba(200,168,75,0.5)",
              padding:"5px 10px",fontSize:11,cursor:"pointer",
              fontFamily:"inherit",transition:"all 0.2s",letterSpacing:1,
            }}>
            {/* Each locale file provides its own short label */}
            {l==="zh-Hans"?"简":l==="zh-Hant"?"繁":"EN"}
          </button>
        ))}
      </div>

      {/* Title */}
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:10,letterSpacing:8,color:"#c8a84b",opacity:0.6,marginBottom:10}}>
          {t("header.subtitle")}
        </div>
        <h1 style={{margin:0,fontSize:36,fontWeight:900,letterSpacing:12,
          background:"linear-gradient(180deg,#f5e09a 0%,#c8a84b 55%,#9a6828 100%)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          {t("header.title")}
        </h1>
        <div style={{width:100,height:1,
          background:"linear-gradient(90deg,transparent,#c8a84b,transparent)",margin:"14px auto 0"}}/>
      </div>

      {/* Question input */}
      {!done && (
        <div style={{width:"100%",maxWidth:480,marginBottom:32,animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10,letterSpacing:5,color:"rgba(200,168,75,0.55)",marginBottom:10}}>
            {t("question.label")}
          </div>
          <textarea value={question} onChange={e=>setQuestion(e.target.value)}
            placeholder={t("question.placeholder")} rows={3} disabled={casting}
            style={{width:"100%",background:"rgba(200,168,75,0.04)",
              border:"1px solid rgba(200,168,75,0.2)",color:"#e8d5a0",
              padding:"12px 16px",fontSize:14,lineHeight:1.9,
              fontFamily:"inherit",resize:"vertical",transition:"border 0.2s"}}
          />
        </div>
      )}

      {/* Question display after cast */}
      {done && question && (
        <div style={{marginBottom:28,maxWidth:520,width:"100%",
          borderLeft:"2px solid rgba(200,168,75,0.35)",paddingLeft:16,animation:"fi 0.5s ease"}}>
          <div style={{fontSize:10,letterSpacing:4,color:"rgba(200,168,75,0.5)",marginBottom:6}}>
            {t("question.display")}
          </div>
          <div style={{fontSize:14,color:"#e8d5a0",lineHeight:1.9}}>{question}</div>
        </div>
      )}

      {/* Cast button */}
      {!lines && !casting && (
        <button className="cast-btn" onClick={cast} style={{
          background:"none",border:"1px solid #c8a84b",color:"#f5e09a",
          padding:"14px 44px",fontSize:17,letterSpacing:6,
          cursor:"pointer",fontFamily:"inherit",
          boxShadow:"0 0 24px rgba(200,168,75,0.15)",transition:"all 0.2s"}}>
          {t("cast.button")}
        </button>
      )}

      {casting && (
        <div style={{color:"#c8a84b",fontSize:13,letterSpacing:4,
          animation:"pulse 0.8s infinite",marginBottom:16}}>
          {t("cast.casting",{step})}
        </div>
      )}

      {/* Hexagram cards */}
      {lines && lines.length>0 && (
        <div className="hex-row" style={{display:"flex",gap:32,flexWrap:"wrap",
          justifyContent:"center",animation:"fi 0.6s ease"}}>
          <div className="hex-card"><HexCard label={t("card.primary")} lines={lines} isResult={false}/></div>
          {hasChange && lines.length===6 && <>
            <div className="hex-arrow"
              style={{display:"flex",alignItems:"center",fontSize:24,color:"rgba(200,168,75,0.4)"}}>→</div>
            <div className="hex-card"><HexCard label={t("card.derived")} lines={changedLines} isResult={true}/></div>
          </>}
        </div>
      )}

      {/* Changing lines detail */}
      {done && hasChange && (
        <div style={{marginTop:24,maxWidth:420,width:"100%",
          border:"1px solid rgba(200,168,75,0.15)",padding:"18px 24px",
          background:"rgba(200,168,75,0.03)",animation:"fi 0.7s ease"}}>
          <div style={{fontSize:10,letterSpacing:5,color:"#c8a84b",marginBottom:12}}>
            {t("changing.title")}
          </div>
          {lines.map((v,i)=>(v!==6&&v!==9)?null:(
            <div key={i} style={{display:"flex",gap:12,alignItems:"center",marginBottom:8,fontSize:13}}>
              <span style={{color:"#c8a84b",minWidth:36}}>
                {t(`line.${i}`)}{t("changing.lineSuffix")}
              </span>
              <span style={{fontSize:10,color:v===9?"#e8a04b":"#8ab4d4"}}>
                {v===9?t("changing.yangLine"):t("changing.yinLine")}
              </span>
              <span style={{fontSize:10,color:"rgba(200,168,75,0.45)"}}>
                {v===9?t("changing.yangChange"):t("changing.yinChange")}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Copy / Export / Preview */}
      {done && (
        <div style={{marginTop:32,display:"flex",flexDirection:"column",
          alignItems:"center",gap:16,animation:"fi 0.8s ease",width:"100%",maxWidth:520}}>
          <div style={{fontSize:11,color:"rgba(200,168,75,0.4)",letterSpacing:3}}>
            {t("actions.copyHint")}
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
            <button className="action-btn" onClick={handleCopy} style={actionBtnStyle(copied)}>
              <span style={{fontSize:15}}>{copied?"✓":"⎘"}</span>
              <span style={{minWidth:64}}>{copied?t("actions.copied"):t("actions.copy")}</span>
            </button>
            <button className="action-btn" onClick={handleExport} style={actionBtnStyle(false)}>
              <span style={{fontSize:15}}>↓</span>
              <span>{t("actions.export")}</span>
            </button>
          </div>
          <div style={{width:"100%",background:"rgba(0,0,0,0.35)",
            border:"1px solid rgba(200,168,75,0.1)",padding:"14px 18px"}}>
            <div style={{fontSize:9,letterSpacing:4,color:"rgba(200,168,75,0.3)",marginBottom:10}}>
              {t("actions.preview")}
            </div>
            <pre style={{fontSize:11,color:"rgba(200,168,75,0.55)",lineHeight:2,
              whiteSpace:"pre-wrap",wordBreak:"break-all",fontFamily:"inherit",margin:0}}>
              {summary}
            </pre>
          </div>
          <button className="reset-btn" onClick={reset} style={{
            marginTop:4,background:"none",border:"none",
            color:"rgba(200,168,75,0.35)",fontSize:11,letterSpacing:5,
            cursor:"pointer",fontFamily:"inherit",transition:"color 0.2s"}}>
            {t("actions.reset")}
          </button>
        </div>
      )}
    </div>
  );
}
