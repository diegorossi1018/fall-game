// 定数定義（循環参照防止のためにGameMainから分離)
var GameDefine =  function(){}

GameDefine.prototype = {}

// バージョン情報
GameDefine.Version = "ver 1.00";

// デバッグ状態か？
GameDefine.isDebug = false;

// レイアウトシステムは有効か？
GameDefine.EnableLayoutSystem = true;

// CreapJSを使用したエフェクトは有効か？
GameDefine.EnableCreap = true;

// CreateJSを使用したエフェクトは有効か？
GameDefine.EnableCreateJS = true;

// SpineJSを使用したエフェクトは有効か？
GameDefine.EnableSpine = true;

// キーボード入力は有効か？
GameDefine.EnableKeyboardInput = true;

// GameDataMgrは有効か？
GameDefine.EnableGameDataMgr = true;

// 60FPS固定描画を行うか？
GameDefine.FixFrameTiming = false;
	
// Zソート用列挙体(数が小さいほど手前、適宜追加すること)
GameDefine.eDispSort =
{
	Debug		: 0,			// デバッグ用
	Front		: 1,			// ゲームの最前面
	Fader		: 2,			// 暗転用
	Top			: 3,
	UI			: 4,			// UI
	Effect		: 5,			// エフェクト類(通常ゲームおよびCreapJS系)
	CreateJS	: 6,			// CreateJSエフェクト
	Block		: 7,			// 盤面上のオブジェクト
	Board		: 8,			// 盤面
	BG			: 9,			// 背景
	Max			: 10,
};

// Z詳細設定(PixiJSと他の描画ライブラリを混合しない場合省略可能)
GameDefine.CanvasModeTbl =
[
	// ViewNo: 			小さいほど手前（昇順）、同一番号内で違うRenderModeとの共存は不可、3まで
	// RenderMode:		0-PixiJS,1-CreateJS,2-PixiJS
	// AllwaysUpdate:	trueと入れておく
	// zIndex:		 	大きいほど手前（降順）CSSでのz-index（省略可、省略する場合全ての項目で省略すること）
	
	{ ViewNo:0, RenderMode : 0, AllwaysUpdate : true , zIndex : 400},	// Debug	
	{ ViewNo:0, RenderMode : 0, AllwaysUpdate : true , zIndex : 400},	// Front	
	{ ViewNo:0, RenderMode : 0, AllwaysUpdate : true , zIndex : 400},	// Fader	
	{ ViewNo:0, RenderMode : 0, AllwaysUpdate : true , zIndex : 400},	// Top
	{ ViewNo:0, RenderMode : 0, AllwaysUpdate : true , zIndex : 400},	// UI		
	{ ViewNo:0, RenderMode : 0, AllwaysUpdate : true , zIndex : 400},	// Effect	
	{ ViewNo:1, RenderMode : 1, AllwaysUpdate : true , zIndex : 300},	// CreateJS	
	{ ViewNo:2, RenderMode : 0, AllwaysUpdate : true , zIndex : 200},	// Block	
	{ ViewNo:2, RenderMode : 0, AllwaysUpdate : true , zIndex : 200},	// Board	
	{ ViewNo:2, RenderMode : 0, AllwaysUpdate : true , zIndex : 200},	// BG	
];

// GameMode列挙
GameDefine.eMode =
{
	None		: -1,
	Loading		: 0,
	Title		: 1,
	Main		: 2,
	EffectTestCreap	: 3,
	Result		: 4,
	Miss        : 5,
	Max			: 6
};

// 画像バンク列挙
GameDefine.eBank =
{
	Common 		: 0,
};

// サウンド列挙
GameDefine.eSound =
{
	BGM			: 0,
	CmnBtn		: 1,
	Down		: 2,
	GameOver    : 3,
	Merge       : 4,
	Result      : 5,
	SeedBig 	: 6, 
	SeedEat     : 7
};

// サウンドのパス
GameDefine.SoundPath =
[
	"./Sound/BGM/MainBGM.mp3",
	"./Sound/SE/button_SE23.mp3",
	"./Sound/SE/down_SE100_006.mp3",
	"./Sound/SE/gameover_se0403.mp3",
	"./Sound/SE/merge_se0300.mp3",
	"./Sound/SE/result_se0013.mp3",
	"./Sound/SE/seed_big_SE700_006.mp3",
	"./Sound/SE/seed_eat_10.mp3",
];

// Creapを使用したエフェクトの定義
GameDefine.eEffect =
{
	Title : { AdobeAnID:"37DBC6DC83FBCD4E99FF646D915AD712", CreateFunc:"title", BankNo:"Common" },
};

// CreateJSを使用したエフェクトの定義
GameDefine.eEffectCJS =
{
	uso_0 : { AdobeAnID:"89E71C4BF99BD147AC9134CD7E47DFC50", CreateFunc:"uso_a", BankNo:"Effect" },
}

// SpineJSを使用したエフェクトの定義
GameDefine.eSpine =
{
	hamu_01 : 0,
	hamu_02 : 1,
	hamu_03 : 2,
	hamu_04 : 3,
	hamu_05 : 4,
	hamu_06 : 5,
	hamu_07 : 6,
	hamu_08 : 7,
	hamu_09 : 8,
	hamu_10 : 9,
	hamu_11 : 10,
	seed : 11,
	result : 12,
	record : 13,
	how : 14,
	title : 15,
	gameOver : 16,
	Max : 17
}

// SpineJSのファイルテーブル
GameDefine.SpineFileTbl = 
[
	"./Spine/hamu_01/hamu_01.json",
	"./Spine/hamu_02/hamu_02.json",
	"./Spine/hamu_03/hamu_03.json",
	"./Spine/hamu_04/hamu_04.json",
	"./Spine/hamu_05/hamu_05.json",
	"./Spine/hamu_06/hamu_06.json",
	"./Spine/hamu_07/hamu_07.json",
	"./Spine/hamu_08/hamu_08.json",
	"./Spine/hamu_09/hamu_09.json",
	"./Spine/hamu_10/hamu_10.json",
	"./Spine/hamu_11/hamu_11.json",
	"./Spine/eff_seed/eff_seed.json",
	"./Spine/eff_result/eff_result.json",
	"./Spine/eff_record/eff_record.json",
	"./Spine/eff_how/eff_how.json",
	"./Spine/eff_title/eff_title.json",
	"./Spine/eff_gameover/eff_gameover.json",	
];

// レイアウトのパス定数
GameDefine.eLayoutPath = 
{
	Common: "./LayoutData/Common/",
};

// 常駐レイアウトデータテーブル
GameDefine.ResidentLayoutFile = 
[
	GameDefine.eLayoutPath.Common+"layout_title.json",
];

