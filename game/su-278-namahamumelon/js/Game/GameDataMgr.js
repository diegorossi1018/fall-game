// SnlDataTblを使ってデータをダウンロードしたり管理したりするクラス
var GameDataMgr = function(){}
GameDataMgr.prototype = {}

// 読み込むJsonの一覧
GameDataMgr.ProblemDataPath =
[
	"./Data/CommonValue.json",
	"./Data/TextData.json",
];

// 読み込みが終了したか？
GameDataMgr.doneLoad = false;

// Json管理クラス
GameDataMgr.JsonTbl = null;

// クライアント汎用変数テーブル
GameDataMgr.CommonValue = null;

// データロード開始
GameDataMgr.StartLoadData = function()
{
	// デバッグ時はバージョン情報をランダムに付与してキャッシュが効かないようにしておく
	if( GameDefine.isDebug )
	{
		UiUtility.SetRndVersion( GameDataMgr.ProblemDataPath );
	}
	
	for( var i=0; i<GameDataMgr.ProblemDataPath.length; i++ )
	{
		GameDataMgr.ProblemDataPath[i] = SnlPixiMgr.m_BasePath + GameDataMgr.ProblemDataPath[i];
	
	}

	// SnlDataTblを作成してロードを開始する
	GameDataMgr.JsonTbl = new SnlDataTbl();
	GameDataMgr.JsonTbl.Create(GameDataMgr.ProblemDataPath, "json", null, GameDataMgr.SuccessLoadData);
};

// データロードコールバック
GameDataMgr.SuccessLoadData = function()
{
	GameDataMgr.TextData = GameDataMgr.JsonTbl.GetData("TextData");

	
	// 読み込み完了
	GameDataMgr.doneLoad = true;
};

