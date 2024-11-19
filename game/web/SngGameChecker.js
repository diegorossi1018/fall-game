//デフォルトの非対応端末リスト	
var g_DefaultNGTbl =
	[
		"F-12D", 		// らくらくスマートフォン
	];

var g_DefaultNGTbl2 =
	[
		"F-08E",		// らくらくスマートフォン 2
		"F-09E",		// らくらくスマートフォン プレミアム
		"F-12D", 		// らくらくスマートフォン
	];

// どーぶつもりもり非対応端末リスト
var g_sugoArkNGTbl =
	[
		"F-08E",		// らくらくスマートフォン 2
		"F-06F",		// らくらくスマートフォン 3
		"F-09E",		// らくらくスマートフォン プレミアム
		"F-12D", 		// らくらくスマートフォン
	];

// お絵かきパズル1000非対応端末リスト
var g_sugoPPzNGTbl =
	[
		"F-08E",		// らくらくスマートフォン 2
		"F-06F",		// らくらくスマートフォン 3
		"F-09E",		// らくらくスマートフォン プレミアム
		"F-12D", 		// らくらくスマートフォン
	];

// ソリティアピラミッド非対応端末リスト
var g_sugoSPyNGTbl =
	[
		"L-06D",		// Optimus Vu L-06D
		"F-08E",		// らくらくスマートフォン 2
		"F-09E",		// らくらくスマートフォン プレミアム
		"F-12D", 		// らくらくスマートフォン
	];

var gOrange = ["L-06D", "F-12D", "F-08E", "F-09E", "F-06F"];


// ID					GameID
// Title				GameTitle
// Path					GamePath
// isPortrait			true=縦持ち, false=横持ち
// iPhoneMin			0=All, 4=iPhone4未満を切る, 5=iPhone5未満を切る
// iPodMin				0=どんな機種でも通す、4=第4世代(Retina3.5インチ)未満を切る、5=第5世代(4インチ)未満を切る
// iPadMin				0=All, 3=iPad1、iPad2、iPadminiを切る
// iOSMin				0=どんなバージョンでも通す、800=8.0.0以上(WebGL有効)、600=6.0.0以上(iPad、iPhone3G、iPod第3世代切り捨て)
// AndroidMin			0=どんなバージョンでも通す、400=4.0.0以上、230=2.3.0以上
// Android300NG			Android3.0系を非対応にする(Android3.xは一部のタブレット専用のOS)
// AndroidNGList		非対応機種リスト、UserAgantから取得できる端末名から判定(http://spec.nttdocomo.co.jp/spmss/)
// AndroidMustWebGL		WebGLが必須か？
// Release				公開済みか？
var g_SngGameCheckerTbl =
	[
		{ ID: 0, Title: "Dummy", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 600, AndroidMin: 400, Android300NG: false, AndroidNGList: g_DefaultNGTbl, AndroidMustWebGL: false, Release: false },
		{ ID: 1, Title: "ソリティアピラミッド", Path: "../su-01-pyramid/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 712, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 2, Title: "お絵かきパズル1000！", Path: "../su-02-oekakipuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 712, AndroidMin: 234, Android300NG: false, AndroidNGList: g_sugoPPzNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 3, Title: "ぐるめダイバー", Path: "../su-03-gourmetdiver/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoArkNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 4, Title: "どーぶつもりもり", Path: "../su-04-morimori/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoArkNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 5, Title: "麻雀1000!", Path: "../su-05-mahjong/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 900, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoArkNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 6, Title: "ソリティアスパイダー", Path: "../su-06-spider/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 7, Title: "毎日線引きパズル", Path: "../su-07-linkpuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 712, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoPPzNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 8, Title: "ソリティアゴルフDX", Path: "../su-08-golf/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 9, Title: "ソリティアクロンダイク", Path: "../su-09-klondike/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 712, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 10, Title: "ナンプレ1000!", Path: "../su-10-numpla/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 712, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 11, Title: "マハラジャ～闘地主～", Path: "../su-11-maharaja/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 712, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 12, Title: "ぐるガメ", Path: "../su-12-gurugame/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoArkNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 13, Title: "ご当地怪獣スライドパズル", Path: "../su-13-kaijupuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoArkNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 14, Title: "りんどりもりもり", Path: "../su-14-rinmori/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoArkNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 15, Title: "二角取り", Path: "../su-15-nikakudori/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 712, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 16, Title: "毎日雑学クイズ", Path: "../su-16-quizzatsugaku/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 712, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 17, Title: "ソリティアフリーセル", Path: "../su-17-freecell/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 18, Title: "超ナンプレ1000！", Path: "../su-18-numplacho/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 19, Title: "ライツアウト", Path: "../su-19-lightsout/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 20, Title: "ブリッジパズル1000！", Path: "../su-20-bridgepuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 21, Title: "間違いさがし～名画鑑定家～", Path: "../su-21-meigakantei/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 22, Title: "将棋～Bonanza～", Path: "../su-22-shogi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: false },
		{ ID: 23, Title: "囲碁  GNUGo", Path: "../su-23-igo/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: false },
		{ ID: 24, Title: "リバーシ", Path: "../su-24-reversi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 25, Title: "スピード", Path: "../su-25-speed/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 26, Title: "釣ろうぜ1000！", Path: "../su-26-fishing/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 27, Title: "BLOCK KUZUSHI", Path: "../su-27-blockkuzushi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 28, Title: "海戦パズル", Path: "../su-28-battleships/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 29, Title: "海戦ゲーム", Path: "../su-29-warshipgame/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 30, Title: "マインスイーパガーデン", Path: "../su-30-minesweeper/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 31, Title: "ソリティアアリス", Path: "../su-31-arithmetic/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 32, Title: "漢字ナンクロ1000!", Path: "../su-32-kannan/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 33, Title: "コウソクレーサー", Path: "../su-33-kousokuracer/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 34, Title: "ビリヤード  ナインボール", Path: "../su-34-nineball/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 35, Title: "上海", Path: "../su-35-shanghai/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 36, Title: "クロスワード1000!", Path: "../su-36-crossword/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 37, Title: "花札乱舞", Path: "../su-37-koikoi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 38, Title: "５×５パズルぴったんこ", Path: "../su-38-5x5/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 39, Title: "なめこ大繁殖", Path: "../su-39-namekopop/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 40, Title: "箱入りなんとか", Path: "../su-40-hakoiri/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 41, Title: "ローテーションポケット", Path: "../su-41-rotationpocket/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 42, Title: "はぴばぴよ！", Path: "../su-42-hapibapiyo/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 43, Title: "丸の多いほうのまるを押す", Path: "../su-43-ooimaru/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 44, Title: "オナジスウジツナグ", Path: "../su-44-numberlink/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 45, Title: "ゾンビたたきZ", Path: "../su-45-zombiez/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 46, Title: "マジカルシルエット農園", Path: "../su-46-silhouette/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 47, Title: "ソリティアスコーピオン", Path: "../su-47-scorpion/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 48, Title: "二角取りくるり", Path: "../su-48-nikakururi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 49, Title: "ナンプレ1000!2", Path: "../su-49-numpla02/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 50, Title: "紫禁城", Path: "../su-50-shikinjo/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 51, Title: "10x10 LINEs!", Path: "../su-51-1010lines/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 52, Title: "100億匹の○×ロジック1000!", Path: "../su-52-oxlogic/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 53, Title: "けものものたすたす", Path: "../su-53-kemonomono/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 54, Title: "あつまれコロボ村", Path: "../su-54-korobomura/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 55, Title: "蛇口からカプチーノ1000！", Path: "../su-55-pipegame/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 56, Title: "クリムゾーンルーム", Path: "../su-56-crimsonroom/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 57, Title: "文豪一直線", Path: "../su-57-jibakurei/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 58, Title: "タッチしてナンバー", Path: "../su-58-ttn/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 443, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 59, Title: "ソリティアモンテカルロ", Path: "../su-59-montecarlo/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 60, Title: "色が少しちがう三角を押す", Path: "../su-60-sankaku/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 61, Title: "漢字ナンクロ1000!2", Path: "../su-61-kannan2/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 62, Title: "たすたすドロップス", Path: "../su-62-tasudrops/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 63, Title: "聖闘四星宮-4balls", Path: "../su-63-4balls/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 64, Title: "ソリティア マンション", Path: "../su-64-mansion/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 65, Title: "形が同じでない四角を押す", Path: "../su-65-shikaku/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 66, Title: "数字バンバン！", Path: "../su-66-suujibanban/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 67, Title: "長さ際だつ棒を押す", Path: "../su-67-bou/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 68, Title: "スキマッチパズル", Path: "../su-68-sukima/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 69, Title: "ライツアウトG", Path: "../su-69-log/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 70, Title: "しんかいぐらし脱出編", Path: "../su-70-shinkaigurashi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 71, Title: "ソリティアボウリング", Path: "../su-71-bowling/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 72, Title: "むげん∞クルクル", Path: "../su-72-mugenloop/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 73, Title: "おかえりブラミー", Path: "../su-73-okaeri/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },

		{ ID: 75, Title: "なぞってリバーシ", Path: "../su-75-hitofude/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 76, Title: "変身しよう！タヌキ！", Path: "../su-76-henshintanuki/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 77, Title: "べつべつだけど同じ道", Path: "../su-77-onajimichi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 78, Title: "くろしろほりっく", Path: "../su-78-kuroshiro/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 79, Title: "ばぶるバブー！シスターズ", Path: "../su-79-puz_bobble/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 80, Title: "じたばたップ飛行", Path: "../su-80-tapbird/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },

		{ ID: 82, Title: "コロボ村のウォリボを探せ", Path: "../su-82-wantedkorobo/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 83, Title: "パズル結晶ファクトリー", Path: "../su-83-crystalfactory/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 84, Title: "おとなりは異星人", Path: "../su-84-hexagonalien/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 85, Title: "漢字ナンクロ1000!3", Path: "../su-85-kannan3/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 87, Title: "ナンプレ1000！3", Path: "../su-87-numpla03/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 88, Title: "イノシシRUN！！", Path: "../su-88-inoshishirun/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 89, Title: "なまはむひとふで", Path: "../su-89-hamufude/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: false },
		{ ID: 90, Title: "パンダのパンだ", Path: "../su-90-pandapanda/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: false },
		{ ID: 91, Title: "ソリティアポーカー", Path: "../su-91-solitairepoker/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 92, Title: "ソリティアクローバー", Path: "../su-92-luckyclover/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 93, Title: "どっかん！！魔法実験", Path: "../su-93-mahoujikken/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 94, Title: "クイズ黒ぶちのイヌ", Path: "../su-94-quizkurobuchi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 95, Title: "10！～10をつくるパズル", Path: "../su-95-make10/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 96, Title: "ナンクロ1000！", Path: "../su-96-numcro/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 97, Title: "ペグっと！ソリティア", Path: "../su-97-pegsolitaire/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 98, Title: "脳トレしんかいダー侵略編", Path: "../su-98-numvaders/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 99, Title: "まいにちなんぷれドリル", Path: "../su-99-numpladrill/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 100, Title: "コインみっけ1000！", Path: "../su-100-findcoins/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 101, Title: "素数コレクター11", Path: "../su-101-primenumber/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 102, Title: "数字チェーン", Path: "../su-102-suujichain/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 103, Title: "もっふすてっぷじゃんぷ", Path: "../su-103-tapjump/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, Android300NG: false, AndroidNGList: g_sugoSPyNGTbl, AndroidMustWebGL: false, Release: true },
		{ ID: 104, Title: "ソリティアクロンダイクW", Path: "../su-104-solitairedouble/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 105, Title: "スウジ！マージ！ソー星人", Path: "../su-105-mergeseijin/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 106, Title: "カラーパレット", Path: "../su-106-colorpalette/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 107, Title: "キャンディタッチ", Path: "../su-107-samegame4e/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 108, Title: "毎日ナンクロ", Path: "../su-108-dailynumcro/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 109, Title: "フラッシュ賽銭開き", Path: "../su-109-flashcoin/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 110, Title: "ソリティアエイトオフ", Path: "../su-110-eightoff/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 111, Title: "クロスサム1000！", Path: "../su-111-crosssum/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 112, Title: "クロンダイク1000！", Path: "../su-112-klondike1000/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 113, Title: "花札乱舞 花合わせ！", Path: "../su-113-hanaawase/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 114, Title: "○×ロジック２", Path: "../su-114-oxlogic2/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 115, Title: "HIT&BLOW", Path: "../su-115-hitandblow/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 116, Title: "大富豪", Path: "../su-116-daifugou/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 117, Title: "フルポンマッチ", Path: "../su-117-fruitsmatch/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 118, Title: "ソリティアユーコン", Path: "../su-118-yukon/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 119, Title: "おんなじあつめ", Path: "../su-119-onnajiatsume/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 120, Title: "クラッシュボンバー", Path: "../su-120-clashbomber/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 125, Title: "ソリティアコネクト", Path: "../su-125-connect/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 127, Title: "永遠のブロック崩し", Path: "../su-127-blockkuzushi2/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 128, Title: "マインスイーパ1000！", Path: "../su-128-minesweeper1000/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 129, Title: "ソリティア1to20", Path: "../su-129-onetotwenty/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 130, Title: "ヨコカラタワーサーチ", Path: "../su-130-towersearch/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 132, Title: "ナンバーライン", Path: "../su-132-numberline/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 134, Title: "ソリティア2048", Path: "../su-134-solitaire2048/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 138, Title: "ソリティアインディアン", Path: "../su-138-indian/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 136, Title: "ジグソー美術館", Path: "../su-136-Jigsawpuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 137, Title: "ソリティアレディジェーン", Path: "../su-137-ladyjane/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 139, Title: "ソリティアシンプリシティ", Path: "../su-139-simplicity/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 140, Title: "ソリティアシンプルシモン", Path: "../su-140-simplesimon/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 141, Title: "みっくすじゅーす", Path: "../su-141-mixjuice/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 142, Title: "マホウツヨメマシマシ", Path: "../su-142-mashimashi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 143, Title: "チョコゲーパレード", Path: "../su-143-chocogeparade/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 144, Title: "ナンプレスパイダー", Path: "../su-144-numplaspider/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 146, Title: "お仕置きうさぎ恋のRUN", Path: "../su-146-angrymoon/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 149, Title: "ヘキサ9ブロック", Path: "../su-149-hexagonblock/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 150, Title: "ビデオポーカー", Path: "../su-150-videopoker/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 151, Title: "とんとん", Path: "../su-151-tonton/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 152, Title: "ルーレット", Path: "../su-152-roulette/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 153, Title: "ブラックジャック", Path: "../su-153-blackjack/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 154, Title: "ババ抜きチャレンジ", Path: "../su-154-babanuki/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 155, Title: "おひとり様パズル", Path: "../su-155-ohitorisama/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 156, Title: "合体防御-数の変-", Path: "../su-156-gattaibougyo/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 157, Title: "開け！迷宮の扉", Path: "../su-157-labyrinthdoor/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 158, Title: "Dots&Boxes", Path: "../su-158-dotsandboxes/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 159, Title: "ひとふで10メイクパズル", Path: "../su-159-hitofude10make/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 160, Title: "七ならべ沼", Path: "../su-160-sevens/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 161, Title: "ライト＆マッシュルーム", Path: "../su-161-lightmushroom/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 162, Title: "ウォール＆ペイント", Path: "../su-162-wallpaint/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 163, Title: "ホイップ＆キャンドル", Path: "../su-163-creamcandle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 165, Title: "ルームシェアパズル", Path: "../su-165-roomshare/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 166, Title: "上昇てんとう虫！JUMP", Path: "../su-166-ladybugjump/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 167, Title: "点つないでWA", Path: "../su-167-tentsunaidewa/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 168, Title: "俺様パズル-対称ロジック-", Path: "../su-168-oresama/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 169, Title: "ぞくぞくペンギンRUN", Path: "../su-169-penguinrun/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 171, Title: "不等号ナンプレ1000！", Path: "../su-171-futogonumpla/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 172, Title: "数字かこってＷＡ！", Path: "../su-172-suujikakottewa/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 173, Title: "マインスイーパステップ", Path: "../su-173-minesweeperstep/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 174, Title: "ソリティアダブルアップ", Path: "../su-174-doubleup/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 175, Title: "漢字ナンクロ1000！ 4", Path: "../su-175-kannan4/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 176, Title: "窓コイン鉱山", Path: "../su-176-mcmining/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 177, Title: "コインは何枚でショー！", Path: "../su-177-howmanycoins/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 178, Title: "ぱぴよんぼや～じゅ", Path: "../su-178-papillonvoyage/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 179, Title: "馬育成ハングリーダービー", Path: "../su-179-jderby/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 180, Title: "ソリティアオズモシス", Path: "../su-180-osmosis/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 181, Title: "キューブつなぐ", Path: "../su-181-connectcubes/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 182, Title: "入れ替えパズル", Path: "../su-182-irekaepuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 183, Title: "進め！ドーナツ", Path: "../su-183-susumedonut/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 184, Title: "エアホッケー3D", Path: "../su-184-airhokey3d/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 186, Title: "ぷりっとディフェンダー", Path: "../su-186-prittodefender/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 187, Title: "10！～10をつくるパズル", Path: "../su-187-tms_make10/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 188, Title: "クイズ黒ぶちのイヌ", Path: "../su-188-tms_quizkurobuchi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 189, Title: "しんかいぐらし脱出編", Path: "../su-189-tms_shinkaigurashi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 190, Title: "ぐるガメ", Path: "../su-190-tms_gurugame/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 191, Title: "キャンディタッチ", Path: "../su-191-tms_samegame4e/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 192, Title: "なまはむひとふで", Path: "../su-192-tms_hamufude/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 193, Title: "蛇口からカプチーノ1000！", Path: "../su-193-tms_pipegame/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 194, Title: "ナンプレ1000！", Path: "../su-194-tms_numpla/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 195, Title: "キャンディーパズル", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 196, Title: "ぼむぼむバブルアタック！", Path: "../su-196-bubbleattack/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 197, Title: "脱出！すしづめパーキング", Path: "../su-197-sushizumeparking/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 198, Title: "オーストラリアの忍耐", Path: "../su-198-australian_patience/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 199, Title: "嘘吐きパズル", Path: "../su-199-liarpuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 200, Title: "おえかき迷路パズル", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 201, Title: "Ｌ×Ｌパズル", Path: "../su-201-LLpuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 203, Title: "パズル間取りックス", Path: "../su-203-madrix/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 204, Title: "るいすい数字さがし", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 205, Title: "キャンフィールド", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 206, Title: "レッド&ブラック", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 207, Title: "焼きたてパンランナー", Path: "../su-207-yakitatepanrunner/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 208, Title: "毎日ナンプレチャレンジ！", Path: "../su-208-mainichi_numpla/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 209, Title: "くるくるハムスターRUN", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 210, Title: "ハムなかまっちならべー", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 211, Title: "1010！蟻とブロックパズル", Path: "../su-211-1010antpuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 212, Title: "Circle環り逢う世界", Path: "'../../../../su-212-circle/index.php'", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 215, Title: "ビリヤードマニア", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 216, Title: "ロードフューリー", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 217, Title: "パズルユーレイ&ツリー", Path: "../su-217-yureiandtree/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 218, Title: "ウシは左へトラ右へ", Path: "../su-218-torawamigi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 219, Title: "うごくおんなじあつめ", Path: "../su-219-ugokuonnajiatsume/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 220, Title: "ソリティア40人の盗賊", Path: "../su-220-fortythieves/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 221, Title: "ソリティアメイズ", Path: "../su-221-solitairemaze/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 222, Title: "走れ、サンタさん", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 223, Title: "弾幕ビーフ", Path: "../su-223-danmakubeef/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 224, Title: "アクアリウムクリッカー", Path: "../su-224-aquariumclicker/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 225, Title: "脳トレ！間違い探し四季編", Path: "../su-225-inlogic_std_seasons/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 226, Title: "ゴーゴードリフト", Path: "../su-226-inlogic_driftingmania/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 227, Title: "数が多いほうのまるが勝ち", Path: "../su-227-ooimarugakati/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 228, Title: "くっつき亀の子パズル", Path: "../su-228-kamenokopuzzle/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 229, Title: "ソリティアイーグルウィング", Path: "../su-229-eaglewing/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 230, Title: 'ソリティアイーストヘブン', isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 231, Title: "ソリティアペンギン", Path: "../su-231-solitairepenguin/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },

		{ ID: 232, Title: "斜線引き〼パズル", Path: "../su-232-syasenhikimasu/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 233, Title: "パズルタイニー合唱団ル～", Path: "../su-233-tinychoirruu/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 235, Title: "1234がムズカシイ", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },

		{ ID: 236, Title: "スライムつみつみ", Path: "../su-236-slimetsumitsumi/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 237, Title: "ミニゴルフマスター", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 238, Title: "森の宝石パズル", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 239, Title: "毎日これどこ探し", Path: "../su-239-mainichi_koredoko/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 240, Title: "毎日ぴたんこ文字ならべ", Path: "../su-240-mainichi_mojinarabe/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },

		{ ID: 242, Title: "タワーディフェンス", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 243, Title: "ソリティアエジプトの盗賊", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },

		{ ID: 244, Title: "エース＆キング", Path: "../su-244-aceandking/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 245, Title: "毎日ぽたり四字熟語の泉", Path: "../su-245-mainichi_yojijukugo/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 246, Title: "2048", Path: "../su-246-2048/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 247, Title: "永遠の数字パズル", Path: "../su-247-number4ever/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 248, Title: "きらめきビームストライク", Path: "../su-248-kiramekibeamstrike/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false }, { ID: 255, Title: "ソリティアロシアン", Path: "../su-255-solitairerussian/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 250, Title: 'コネクトフラワーボール', isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 256, Title: "ズンバマニア", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 257, Title: "エネミーシューター", Path: "../su-257-enemyshooter/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 258, Title: "モグレ！ワレワレハ地底人", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 259, Title: "キューピッド練習中", Path: "../su-259-cupidtraining/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },

		{ ID: 261, Title: "六角形がきらいになる迷路", Path: "../su-261-hexagonmaze/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },

		{ ID: 264, Title: "ナイフスマッシュ", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 266, Title: "スイッチコロコロ", Path: "../su-266-switchkorokoro/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 268, Title: "んがつくしりとり", Path: "../su-268-endshiritori/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 710, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 278, Title: "なまはむめろんゲーム", Path: "../su-278-namahamumelon/index.php", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 281, Title: "メタルサーガS", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 1400, AndroidMin: 600, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },
		{ ID: 287, Title: "デモリッシュ・ピラミッド", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 800, AndroidMin: 422, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },

		{ ID: 300, Title: "メタルサーガS", Path: "", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 1400, AndroidMin: 600, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },


		{ ID: 2018, Title: "けものものたすたす", Path: "../su-2018-newyear/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 2019, Title: "正月Runゲーム", Path: "../su-2019-newyear/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 2020, Title: "2020 正月ゲーム", Path: "../su-2020-newyear/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 2021, Title: "2021 正月ゲーム", Path: "../su-2021-newyear/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 2022, Title: "2022 正月ゲーム", Path: "../su-2022-newyear/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 2023, Title: "2023 正月ゲーム", Path: "../su-2023-newyear/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 2024, Title: "2024 正月ゲーム", Path: "../su-2024-newyear/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 2100, Title: "Google AdSense 4 Game Test", Path: "../su-2100-adtest/index.php", isPortrait: true, iPhoneMin: 0, iPodMin: 0, iPadMin: 0, iOSMin: 614, AndroidMin: 422, AndroidNGList: g_sugoSPyNGTbl, Android300NG: false, AndroidMustWebGL: false, Release: true },
		{ ID: 9999, Title: "", Path: "../su-9999-crosstest", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 700, AndroidMin: 420, Android300NG: false, AndroidNGList: g_sugoArkNGTbl, AndroidMustWebGL: false, Release: false },

		// ES Module版SnlSkeletonテスト用(ES Module版SnlSkeletonの基準　Releaseは絶対にfalseから変更しないこと)
		// ES Module版はとりあえずiOS12以降、Androidは6以上
		{ ID: 241, Title: "ES Module版 SnlSkeleton", isPortrait: true, iPhoneMin: 4, iPodMin: 4, iPadMin: 0, iOSMin: 1200, AndroidMin: 600, AndroidNGList: gOrange, Android300NG: false, AndroidMustWebGL: false, Release: false },


	];

function Sng_GetGameData(GameID) {
	for (var i = 0; i < g_SngGameCheckerTbl.length; i++) {
		if (g_SngGameCheckerTbl[i].ID == GameID) {
			return g_SngGameCheckerTbl[i];
		}
	}

	return null;
}

function Sng_DeviceCheck() {
	var ua = navigator.userAgent;
	if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
		console.log("sp");
		return 'SmartPhone';
	} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
		console.log("tb");
		return 'Tablet';
	} else {
		console.log("pc");
		return 'PC';
	}
}

function Sng_GetErrMes(GameID) {
	//document.body.background = "images/back.png";
	document.linkColor = "#0000ff";
	document.vlinkColor = "#0000ff";
	document.alinkColor = "#0000ff";

	var GameData = Sng_GetGameData(GameID);

	console.log("1");
	if (GameData == null) {
		return "ゲームIDエラー<BR>";
	}

	console.log("2");

	var Str = GameData.Title + "に非対応の端末です。<BR><BR>"
	Str += "対応端末<BR>";

	var iOSVer = "";
	if (GameData.iOSMin != 0) {
		var c = GameData.iOSMin;
		var a = Math.floor(c / 100);
		c -= a * 100;
		var b = Math.floor(c / 10);
		c -= b * 10;


		iOSVer = "(iOS" + String(a) + "." + String(b) + "." + String(c) + "以上)";
	}

	var AndroidVar = "";
	if (GameData.AndroidMin != 0) {
		var c = GameData.AndroidMin;
		var a = Math.floor(c / 100);
		c -= a * 100;
		var b = Math.floor(c / 10);
		c -= b * 10;


		AndroidVar = "Android" + a + "." + b + "." + c + "以上の";
	}


	if (GameData.iPhoneMin == 0) {
		Str += "iPhone" + iOSVer + "<BR>";
	}
	else {
		Str += "iPhone" + GameData.iPhoneMin + "以降" + iOSVer + "<BR>";
	}
	if (GameData.iPadMin == 0) {
		Str += "iPad、iPadMini" + iOSVer + "<BR>";
	}
	else {
		Str += "iPad(第3世代)以降、iPadMini2以降" + iOSVer + "<BR>";
	}
	Str += AndroidVar + "Android端末<BR><BR>";


	Str += "非対応端末<BR>";
	for (var i = 0; i < GameData.AndroidNGList.length; i++) {
		Str += GameData.AndroidNGList[i] + "<BR>";
	}

	if (GameData.Android300NG) {
		Str += "Android3.x.xが搭載されたタブレット<BR>";
	}
	if (GameData.AndroidMustWebGL) {
		Str += "※WebGLが使用できないブラウザには対応しておりません。<BR>";
	}

	/*
	Str += '<BR><img src="images/teiban_top_line1.png"><BR><BR>'; 
	Str += "この端末は以下のゲームに対応してます。<BR>";
	
	Str += "<UL>";
	
	var SID = sessionStorage.getItem( "SucSugo-SID" );
	
	for( var i=0; i<g_SngGameCheckerTbl.length; i++ )
	{
		if( g_SngGameCheckerTbl[i].Release )
		{
			// リンク用フォームを作成
			Str += '<form name="GameLink_' + String(g_SngGameCheckerTbl[i].ID)  +  '" action="' + g_SngGameCheckerTbl[i].Path +  '" method="post" style="display: none" >'
				Str += '<input type="hidden" name="content_selection_id" value="' + String(SID) + '" />';
			Str += '</form>'
			
			// リンク
			if( Sng_CheckGameExec( g_SngGameCheckerTbl[i].ID ) )
			{
				Str += '<li><a href="#" onclick="document.GameLink_' + String(g_SngGameCheckerTbl[i].ID) + '.submit();">' + g_SngGameCheckerTbl[i].Title + '</a></li>';
				//Str += "・" + g_SngGameCheckerTbl[i].Title + "<BR>";
			}
		}
	}
	
	Str += "</UL>";
	
	Str += '<BR><img src="images/teiban_top_line1.png"><BR><BR>'; 
	*/

	Str += '<center><form>';
	Str += '<input type="button" value="戻る" onClick="history.back()">';
	Str += '</form></center><BR>';

	return Str;
}


function Sng_CheckGameExec(GameID) {
	var GameData = Sng_GetGameData(GameID);
	var UserAgent = navigator.userAgent.toLowerCase();
	var iOSVer = 0;
	var iOS = false;

	if (GameData == null) {
		return false;
	}

	// iPod
	if (0 < UserAgent.indexOf('ipod')) {
		iOS = true;
		var iPod = 0;
		if (window.screen.height <= 480) {
			if (1 < window.devicePixelRatio) {
				iPod = 4;
			}
		}
		else {
			iPod = 5;
		}

		if (iPod < GameData.iPodMin) {
			return false;
		}
	}

	// iPhone
	else if (0 < UserAgent.indexOf('iphone')) {
		iOS = true;
		var iPhone = 0;
		if (window.screen.height <= 480) {
			if (1 < window.devicePixelRatio) {
				iPhone = 4;
			}
		}
		else {
			iPhone = 5;
		}

		if (iPhone < GameData.iPhoneMin) {
			return false;
		}

	}
	// iPad
	else if (0 < UserAgent.indexOf('ipad')) {
		iOS = true;
		var iPad = 0;
		if (1 < window.devicePixelRatio) {
			iPad = 3;
		}

		if (iPad < GameData.iPadMin) {
			return false;
		}
		if (0 < UserAgent.indexOf("cpu os 1")) {
			UserAgent.match(/cpu os (\w+){1,4}/g);
			iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 4);
		}
		else {
			UserAgent.match(/cpu os (\w+){1,3}/g);
			iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 3);
		}


	}
	// Android
	else if (0 < UserAgent.indexOf('android')) {
		var ver = parseInt((UserAgent.slice(UserAgent.indexOf("android") + 8).split(";")[0]).replace(/\./g, ""));
		// 10 <= AndroidVer
		if (0 < UserAgent.indexOf("android 1") && UserAgent.indexOf("android 1.") < 0) {
			if (ver < 10) {
				ver = ver * 1000;
			}
			else if (ver < 100) {
				ver = ver * 100;
			}
			else if (ver < 1000) {
				ver = ver * 10;
			}
		}
		// AndroidVer < 10
		else {
			if (ver < 10) {
				ver = ver * 100;
			}
			else if (ver < 100) {
				ver = ver * 10;
			}
		}

		if (ver < GameData.AndroidMin) {
			return false;
		}
		if (GameData.Android300NG) {
			if (300 <= ver && ver <= 399) {
				return false;
			}
		}
		if (GameData.AndroidMustWebGL) {
			if (!window.WebGLRenderingContext) {
				return false;
			}
		}
		for (var i = 0; i < GameData.AndroidNGList.length; i++) {
			var name = GameData.AndroidNGList[i].toLowerCase();
			if (0 < UserAgent.indexOf(name)) {
				return false;
			}
		}
	}

	// iOS
	if (iOS) {
		if (iOSVer == 0) {
			if (0 < UserAgent.indexOf("iphone os 1")) {
				UserAgent.match(/iphone os (\w+){1,4}/g);
				iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 4);
			}
			else {
				UserAgent.match(/iphone os (\w+){1,3}/g);
				iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 3);
			}
		}

		if (iOSVer < GameData.iOSMin) {
			return false;
		}
	}
	return true;

}