/**
 * @file 	SnlFPS.js
 * @brief 	FPS管理クラス
 * @author	D.Hara
 */
	
var SnlFPS =  function(){}

// FPS計算基準時間
SnlFPS.BaseTime  			= -1;

// 直前フレームの開始時間
SnlFPS.LastFrameStartTime 	= 0;

// フレームカウンタ
SnlFPS.FPSConter 			= 0;

// 現在のFPS
SnlFPS.FPS	   				= 0;

// 前回フレーム開始時間から今回フレーム開始までの経過時間
SnlFPS.deltaTime 			= 0;

// 更新
SnlFPS.Update = function()
{
	var date = new Date();
	
	if( SnlFPS.BaseTime == -1)
	{
		SnlPixiMgr.SetVisibleEvent( SnlFPS.VisibleEvent );
	 	SnlFPS.BaseTime 			= date.getTime();
	 	SnlFPS.LastFrameStartTime 	= date.getTime();
	 	SnlFPS.FPS 				= 0;
	 	SnlFPS.FPSConter 			= 0;
	 	SnlFPS.deltaTime			= 0;
	 	return;
	}
	
	var NowTime = date.getTime();
	
	//前回から1秒以上たっている場合はFPSを計算
	if( 1000 <= (NowTime - SnlFPS.BaseTime) )
	{
		SnlFPS.BaseTime = NowTime;
		SnlFPS.FPS = SnlFPS.FPSConter;
		SnlFPS.FPSConter = 0;
	}
	
	SnlFPS.deltaTime = (NowTime - SnlFPS.LastFrameStartTime) / 1000;
	
	SnlFPS.LastFrameStartTime = NowTime;
	
	SnlFPS.FPSConter++;
}

// 復帰時は現在時刻をリセットしておく
SnlFPS.VisibleEvent = function()
{
	var date = new Date();
	var NowTime = date.getTime();
	SnlFPS.LastFrameStartTime = NowTime;
};


SnlFPS.prototype = {};

