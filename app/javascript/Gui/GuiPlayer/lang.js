/**
 * Based on work by Anatoly Mironov (mirontoli) and Phil Teare
 * Converted to ISO693-2 by cmcg
 * Example: getLanguageName("eng") --> English
 */
(function() {
	var isoLangs = {
		"abk":{
			"name":"Abkhaz",
			"nativeName":"аҧсуа"
		},
		"aar":{
			"name":"Afar",
			"nativeName":"Afaraf"
		},
		"afr":{
			"name":"Afrikaans",
			"nativeName":"Afrikaans"
		},
		"aka":{
			"name":"Akan",
			"nativeName":"Akan"
		},
		"sqi":{
			"name":"Albanian",
			"nativeName":"Shqip"
		},
		"amh":{
			"name":"Amharic",
			"nativeName":"አማርኛ"
		},
		"ara":{
			"name":"Arabic",
			"nativeName":"العربية"
		},
		"arg":{
			"name":"Aragonese",
			"nativeName":"Aragonés"
		},
		"hye":{
			"name":"Armenian",
			"nativeName":"Հայերեն"
		},
		"asm":{
			"name":"Assamese",
			"nativeName":"অসমীয়া"
		},
		"ava":{
			"name":"Avaric",
			"nativeName":"авар мацӀ, магӀарул мацӀ"
		},
		"ave":{
			"name":"Avestan",
			"nativeName":"avesta"
		},
		"aym":{
			"name":"Aymara",
			"nativeName":"aymar aru"
		},
		"aze":{
			"name":"Azerbaijani",
			"nativeName":"azərbaycan dili"
		},
		"bam":{
			"name":"Bambara",
			"nativeName":"bamanankan"
		},
		"bak":{
			"name":"Bashkir",
			"nativeName":"башҡорт теле"
		},
		"bak":{
			"name":"Basque",
			"nativeName":"euskara, euskera"
		},
		"bel":{
			"name":"Belarusian",
			"nativeName":"Беларуская"
		},
		"ben":{
			"name":"Bengali",
			"nativeName":"বাংলা"
		},
		"bih":{
			"name":"Bihari",
			"nativeName":"भोजपुरी"
		},
		"bis":{
			"name":"Bislama",
			"nativeName":"Bislama"
		},
		"bos":{
			"name":"Bosnian",
			"nativeName":"bosanski jezik"
		},
		"bre":{
			"name":"Breton",
			"nativeName":"brezhoneg"
		},
		"bul":{
			"name":"Bulgarian",
			"nativeName":"български език"
		},
		"mya":{
			"name":"Burmese",
			"nativeName":"ဗမာစာ"
		},
		"cat":{
			"name":"Catalan",
			"nativeName":"Català"
		},
		"cha":{
			"name":"Chamorro",
			"nativeName":"Chamoru"
		},
		"che":{
			"name":"Chechen",
			"nativeName":"нохчийн мотт"
		},
		"nya":{
			"name":"Chichewa",
			"nativeName":"chiCheŵa, chinyanja"
		},
		"chi":{
			"name":"Chinese",
			"nativeName":"中文 (Zhōngwén), 汉语, 漢語"
		},
		"zho":{
			"name":"Chinese",
			"nativeName":"中文 (Zhōngwén), 汉语, 漢語"
		},
		"chv":{
			"name":"Chuvash",
			"nativeName":"чӑваш чӗлхи"
		},
		"cor":{
			"name":"Cornish",
			"nativeName":"Kernewek"
		},
		"cos":{
			"name":"Corsican",
			"nativeName":"corsu, lingua corsa"
		},
		"cre":{
			"name":"Cree",
			"nativeName":"ᓀᐦᐃᔭᐍᐏᐣ"
		},
		"hrv":{
			"name":"Croatian",
			"nativeName":"hrvatski"
		},
		"cze":{
			"name":"Czech",
			"nativeName":"česky, čeština"
		},
		"dan":{
			"name":"Danish",
			"nativeName":"dansk"
		},
		"div":{
			"name":"Divehi",
			"nativeName":"ދިވެހި"
		},
		"dut":{
			"name":"Dutch",
			"nativeName":"Nederlands, Vlaams"
		},
		"eng":{
			"name":"English",
			"nativeName":"English"
		},
		"epo":{
			"name":"Esperanto",
			"nativeName":"Esperanto"
		},
		"est":{
			"name":"Estonian",
			"nativeName":"eesti, eesti keel"
		},
		"ewe":{
			"name":"Ewe",
			"nativeName":"Eʋegbe"
		},
		"fao":{
			"name":"Faroese",
			"nativeName":"føroyskt"
		},
		"fjj":{
			"name":"Fijian",
			"nativeName":"vosa Vakaviti"
		},
		"fin":{
			"name":"Finnish",
			"nativeName":"suomi, suomen kieli"
		},
		"fre":{
			"name":"French",
			"nativeName":"français, langue française"
		},
		"fra":{
			"name":"French",
			"nativeName":"français, langue française"
		},
		"ful":{
			"name":"Fula",
			"nativeName":"Fulfulde, Pulaar, Pular"
		},
		"gla":{
			"name":"Gaelic",
			"nativeName":"Gaélique"
		},
		"glg":{
			"name":"Galician",
			"nativeName":"Galego"
		},
		"geo":{
			"name":"Georgian",
			"nativeName":"ქართული"
		},
		"ger":{
			"name":"German",
			"nativeName":"Deutsch"
		},
		"gre":{
			"name":"Greek",
			"nativeName":"Ελληνικά"
		},
		"grn":{
			"name":"Guaraní",
			"nativeName":"Avañeẽ"
		},
		"guj":{
			"name":"Gujarati",
			"nativeName":"ગુજરાતી"
		},
		"hat":{
			"name":"Haitian",
			"nativeName":"Kreyòl ayisyen"
		},
		"hau":{
			"name":"Hausa",
			"nativeName":"Hausa, هَوُسَ"
		},
		"heb":{
			"name":"Hebrew (modern)",
			"nativeName":"עברית"
		},
		"her":{
			"name":"Herero",
			"nativeName":"Otjiherero"
		},
		"hin":{
			"name":"Hindi",
			"nativeName":"हिन्दी, हिंदी"
		},
		"hmo":{
			"name":"Hiri Motu",
			"nativeName":"Hiri Motu"
		},
		"hun":{
			"name":"Hungarian",
			"nativeName":"Magyar"
		},
		"ina":{
			"name":"Interlingua",
			"nativeName":"Interlingua"
		},
		"ind":{
			"name":"Indonesian",
			"nativeName":"Bahasa Indonesia"
		},
		"ile":{
			"name":"Interlingue",
			"nativeName":"Interlingue"
		},
		"gle":{
			"name":"Irish",
			"nativeName":"Gaeilge"
		},
		"ibo":{
			"name":"Igbo",
			"nativeName":"Asụsụ Igbo"
		},
		"ipk":{
			"name":"Inupiaq",
			"nativeName":"Iñupiaq, Iñupiatun"
		},
		"ido":{
			"name":"Ido",
			"nativeName":"Ido"
		},
		"ice":{
			"name":"Icelandic",
			"nativeName":"Íslenska"
		},
		"ita":{
			"name":"Italian",
			"nativeName":"Italiano"
		},
		"iku":{
			"name":"Inuktitut",
			"nativeName":"ᐃᓄᒃᑎᑐᑦ"
		},
		"jpn":{
			"name":"Japanese",
			"nativeName":"日本語 (にほんご／にっぽんご)"
		},
		"jav":{
			"name":"Javanese",
			"nativeName":"basa Jawa"
		},
		"kal":{
			"name":"Kalaallisut",
			"nativeName":"kalaallisut, kalaallit oqaasii"
		},
		"kan":{
			"name":"Kannada",
			"nativeName":"ಕನ್ನಡ"
		},
		"kau":{
			"name":"Kanuri",
			"nativeName":"Kanuri"
		},
		"kas":{
			"name":"Kashmiri",
			"nativeName":"कश्मीरी, كشميري‎"
		},
		"kaz":{
			"name":"Kazakh",
			"nativeName":"Қазақ тілі"
		},
		"khm":{
			"name":"Khmer",
			"nativeName":"ភាសាខ្មែរ"
		},
		"kik":{
			"name":"Kikuyu, Gikuyu",
			"nativeName":"Gĩkũyũ"
		},
		"kin":{
			"name":"Kinyarwanda",
			"nativeName":"Ikinyarwanda"
		},
		"kir":{
			"name":"Kirghiz, Kyrgyz",
			"nativeName":"кыргыз тили"
		},
		"kom":{
			"name":"Komi",
			"nativeName":"коми кыв"
		},
		"kon":{
			"name":"Kongo",
			"nativeName":"KiKongo"
		},
		"kor":{
			"name":"Korean",
			"nativeName":"한국어 (韓國語), 조선말 (朝鮮語)"
		},
		"kur":{
			"name":"Kurdish",
			"nativeName":"Kurdî, كوردی‎"
		},
		"kua":{
			"name":"Kwanyama",
			"nativeName":"Kuanyama"
		},
		"lat":{
			"name":"Latin",
			"nativeName":"latine"
		},
		"ltz":{
			"name":"Luxembourgish",
			"nativeName":"Lëtzebuergesch"
		},
		"lug":{
			"name":"Ganda",
			"nativeName":"Luganda"
		},
		"lim":{
			"name":"Limburgish",
			"nativeName":"Limburgs"
		},
		"lin":{
			"name":"Lingala",
			"nativeName":"Lingála"
		},
		"lao":{
			"name":"Lao",
			"nativeName":"ພາສາລາວ"
		},
		"lit":{
			"name":"Lithuanian",
			"nativeName":"lietuvių kalba"
		},
		"lub":{
			"name":"Luba-Katanga",
			"nativeName":""
		},
		"lav":{
			"name":"Latvian",
			"nativeName":"latviešu valoda"
		},
		"glv":{
			"name":"Manx",
			"nativeName":"Gaelg, Gailck"
		},
		"mac":{
			"name":"Macedonian",
			"nativeName":"македонски јазик"
		},
		"mlg":{
			"name":"Malagasy",
			"nativeName":"Malagasy fiteny"
		},
		"may":{
			"name":"Malay",
			"nativeName":"bahasa Melayu, بهاس ملايو‎"
		},
		"mal":{
			"name":"Malayalam",
			"nativeName":"മലയാളം"
		},
		"mlt":{
			"name":"Maltese",
			"nativeName":"Malti"
		},
		"mao":{
			"name":"Māori",
			"nativeName":"te reo Māori"
		},
		"mar":{
			"name":"Marathi (Marāṭhī)",
			"nativeName":"मराठी"
		},
		"mah":{
			"name":"Marshallese",
			"nativeName":"Kajin M̧ajeļ"
		},
		"mon":{
			"name":"Mongolian",
			"nativeName":"монгол"
		},
		"nau":{
			"name":"Nauru",
			"nativeName":"Ekakairũ Naoero"
		},
		"nav":{
			"name":"Navajo, Navaho",
			"nativeName":"Diné bizaad, Dinékʼehǰí"
		},
		"nob":{
			"name":"Norwegian Bokmål",
			"nativeName":"Norsk bokmål"
		},
		"nde":{
			"name":"North Ndebele",
			"nativeName":"isiNdebele"
		},
		"nep":{
			"name":"Nepali",
			"nativeName":"नेपाली"
		},
		"ndo":{
			"name":"Ndonga",
			"nativeName":"Owambo"
		},
		"nno":{
			"name":"Norwegian Nynorsk",
			"nativeName":"Norsk nynorsk"
		},
		"nor":{
			"name":"Norwegian",
			"nativeName":"Norsk"
		},
		"iii":{
			"name":"Nuosu",
			"nativeName":"ꆈꌠ꒿ Nuosuhxop"
		},
		"nbl":{
			"name":"South Ndebele",
			"nativeName":"isiNdebele"
		},
		"oci":{
			"name":"Occitan",
			"nativeName":"Occitan"
		},
		"oji":{
			"name":"Ojibwe",
			"nativeName":"ᐊᓂᔑᓈᐯᒧᐎᓐ"
		},
		"chu":{
			"name":"Old Slavonic",
			"nativeName":"ѩзыкъ словѣньскъ"
		},
		"orm":{
			"name":"Oromo",
			"nativeName":"Afaan Oromoo"
		},
		"ori":{
			"name":"Oriya",
			"nativeName":"ଓଡ଼ିଆ"
		},
		"oss":{
			"name":"Ossetian",
			"nativeName":"ирон æвзаг"
		},
		"pan":{
			"name":"Panjabi",
			"nativeName":"ਪੰਜਾਬੀ, پنجابی‎"
		},
		"pli":{
			"name":"Pāli",
			"nativeName":"पाऴि"
		},
		"fas":{
			"name":"Persian",
			"nativeName":"فارسی"
		},
		"per":{
			"name":"Persian",
			"nativeName":"فارسی"
		},
		"pol":{
			"name":"Polish",
			"nativeName":"polski"
		},
		"pus":{
			"name":"Pashto",
			"nativeName":"پښتو"
		},
		"por":{
			"name":"Portuguese",
			"nativeName":"Português"
		},
		"que":{
			"name":"Quechua",
			"nativeName":"Runa Simi, Kichwa"
		},
		"roh":{
			"name":"Romansh",
			"nativeName":"rumantsch grischun"
		},
		"run":{
			"name":"Rundi",
			"nativeName":"rundi"
		},
		"rum":{
			"name":"Romanian",
			"nativeName":"română"
		},
		"rus":{
			"name":"Russian",
			"nativeName":"русский язык"
		},
		"san":{
			"name":"Sanskrit",
			"nativeName":"संस्कृतम्"
		},
		"srd":{
			"name":"Sardinian",
			"nativeName":"sardu"
		},
		"snd":{
			"name":"Sindhi",
			"nativeName":"सिन्धी, سنڌي، سندھی‎"
		},
		"sme":{
			"name":"Northern Sami",
			"nativeName":"Davvisámegiella"
		},
		"smo":{
			"name":"Samoan",
			"nativeName":"gagana faa Samoa"
		},
		"sag":{
			"name":"Sango",
			"nativeName":"yângâ tî sängö"
		},
		"srp":{
			"name":"Serbian",
			"nativeName":"српски језик"
		},
		"sna":{
			"name":"Shona",
			"nativeName":"chiShona"
		},
		"sin":{
			"name":"Sinhala",
			"nativeName":"සිංහල"
		},
		"slo":{
			"name":"Slovak",
			"nativeName":"slovenčina"
		},
		"slk":{
			"name":"Slovak",
			"nativeName":"slovenčina"
		},
		"slv":{
			"name":"Slovene",
			"nativeName":"slovenščina"
		},
		"som":{
			"name":"Somali",
			"nativeName":"Soomaaliga, af Soomaali"
		},
		"sot":{
			"name":"Southern Sotho",
			"nativeName":"Sesotho"
		},
		"spa":{
			"name":"Spanish",
			"nativeName":"español, castellano"
		},
		"sun":{
			"name":"Sundanese",
			"nativeName":"Basa Sunda"
		},
		"swa":{
			"name":"Swahili",
			"nativeName":"Kiswahili"
		},
		"ssw":{
			"name":"Swati",
			"nativeName":"SiSwati"
		},
		"swe":{
			"name":"Swedish",
			"nativeName":"svenska"
		},
		"tam":{
			"name":"Tamil",
			"nativeName":"தமிழ்"
		},
		"tel":{
			"name":"Telugu",
			"nativeName":"తెలుగు"
		},
		"tgk":{
			"name":"Tajik",
			"nativeName":"тоҷикӣ, toğikī, تاجیکی‎"
		},
		"tha":{
			"name":"Thai",
			"nativeName":"ไทย"
		},
		"tir":{
			"name":"Tigrinya",
			"nativeName":"ትግርኛ"
		},
		"tib":{
			"name":"Tibetan Standard, Tibetan, Central",
			"nativeName":"བོད་ཡིག"
		},
		"tuk":{
			"name":"Turkmen",
			"nativeName":"Türkmen, Түркмен"
		},
		"tgl":{
			"name":"Tagalog",
			"nativeName":"Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔"
		},
		"tsn":{
			"name":"Tswana",
			"nativeName":"Setswana"
		},
		"ton":{
			"name":"Tonga (Tonga Islands)",
			"nativeName":"faka Tonga"
		},
		"tur":{
			"name":"Turkish",
			"nativeName":"Türkçe"
		},
		"tso":{
			"name":"Tsonga",
			"nativeName":"Xitsonga"
		},
		"tat":{
			"name":"Tatar",
			"nativeName":"татарча, tatarça, تاتارچا‎"
		},
		"twi":{
			"name":"Twi",
			"nativeName":"Twi"
		},
		"tah":{
			"name":"Tahitian",
			"nativeName":"Reo Tahiti"
		},
		"uig":{
			"name":"Uighur, Uyghur",
			"nativeName":"Uyƣurqə, ئۇيغۇرچە‎"
		},
		"ukr":{
			"name":"Ukrainian",
			"nativeName":"українська"
		},
		"urd":{
			"name":"Urdu",
			"nativeName":"اردو"
		},
		"uzb":{
			"name":"Uzbek",
			"nativeName":"zbek, Ўзбек, أۇزبېك‎"
		},
		"ven":{
			"name":"Venda",
			"nativeName":"Tshivenḓa"
		},
		"vie":{
			"name":"Vietnamese",
			"nativeName":"Tiếng Việt"
		},
		"vol":{
			"name":"Volapük",
			"nativeName":"Volapük"
		},
		"wln":{
			"name":"Walloon",
			"nativeName":"Walon"
		},
		"cym":{
			"name":"Welsh",
			"nativeName":"Cymraeg"
		},
		"wel":{
			"name":"Welsh",
			"nativeName":"Cymraeg"
		},
		"wol":{
			"name":"Wolof",
			"nativeName":"Wollof"
		},
		"fry":{
			"name":"Western Frisian",
			"nativeName":"Frysk"
		},
		"xho":{
			"name":"Xhosa",
			"nativeName":"isiXhosa"
		},
		"yid":{
			"name":"Yiddish",
			"nativeName":"ייִדיש"
		},
		"yor":{
			"name":"Yoruba",
			"nativeName":"Yorùbá"
		},
		"zha":{
			"name":"Zhuang, Chuang",
			"nativeName":"Saɯ cueŋƅ, Saw cuengh"
		}
	}
	
	var getLanguageName = function(key) {
		var lang = isoLangs[key];
		return lang ? lang.name : undefined;
	}
	var getLanguageNativeName = function(key) {
		var lang = isoLangs[key];
		return lang ? lang.nativeName : undefined;
	}
	window.getLanguageName = getLanguageName;
	window.getLanguageNativeName = getLanguageNativeName;
})();