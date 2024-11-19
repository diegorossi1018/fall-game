// 細かいこと考えずに各種環境での広告がいじくれるAPI
// SUGC_ExApiが各プラットフォーム毎の広告APIの挙動を吸収する
// Ads_Apiへのサウンド状態通知とかもSUGC_ExApiが吸収してます
// 使用方法はAds_Apiに準拠しますがコール時にのAdsTypeおよびRewardTypeを
// 専用のSUGC_ExApi.AdsType、SUGC_ExApi.RewardTypeを使用してください

var SUGC_ExApi = function()
{
};

SUGC_ExApi.eMode = 
{
	SU_Api 		: 0,	// SU_Api.asdを使用して広告表示
	Ads_Api 	: 1,	// Ads_Apiを使用して広告表示
	None		: 2,	// 広告がない環境
}

SUGC_ExApi.prototype = {};

// 広告は有効かどうかの判定用
SUGC_ExApi.EnableAds = true;

// 広告挙動のモード
SUGC_ExApi.Mode = SUGC_ExApi.eMode.SU_Api;

SUGC_ExApi.AdsAfterFunc = null;
SUGC_ExApi.AdsRewardViewedFunc = null;
SUGC_ExApi.AdsExec = false;

// Ads_Apiが定義済みならAds_Api使用モードに
if( typeof Ads_Api !== "undefined" )
{
	SUGC_ExApi.AdsType = JSON.parse(JSON.stringify(Ads_Api.AdsType));
	SUGC_ExApi.RewardType = JSON.parse(JSON.stringify(Ads_Api.RewardType));
	SUGC_ExApi.Mode = SUGC_ExApi.eMode.Ads_Api;
}
// Ads_Apiがない
else
{
	// エラー回避のためAds_Api側の標準定義を書いておく
	SUGC_ExApi.AdsType =
	{
	    Loading : {Type : "preroll", Name : "Loading"},
	    Start : {Type : "start", Name : "Start-Game"},
	    Restart : {Type : "next", Name : "Restart-Game"},
	    SelectLevel : {Type : "next",Name : "Select-Level"},
	    NextLevel : {Type : "next",Name : "Next-Level"},
	    Result : {Type : "next",Name : "Result"},
	    BackTitle : {Type : "next",Name : "Back-Title"},
	    GameOver : {Type : "next",Name : "Game-Over"},
	    UserAction : {Type : "next",Name : "UserAction"},
	    Reward : {Type : "reward",Name : "Reward"},
	    Other : {Type : "next",Name : "Other"} //一応作ってはいるけど、表す範囲が広すぎるのでなるべく使わない
	}
	
	SUGC_ExApi.RewardType =
	{
	    AddCoin     : {Type : "reward", Name : "AddCoin"},
	    AddItem     : {Type : "reward", Name : "AddItem"},
	    UseFunction : {Type : "reward", Name : "UseFunction"},
	    ShowHint    : {Type : "reward", Name : "ShowHint"},
	    Continue    : {Type : "reward", Name : "Continue"},
	}
	
	// 広告の無い環境はここに記載しておく
	switch( SU_Api.m_ServiceProvider )
	{
		case "NON":	// 開発環境とか
		case "DSG": // スゴ得
		case "SAP": // スターアプリ
			SUGC_ExApi.Mode = SUGC_ExApi.eMode.None;
			SUGC_ExApi.EnableAds = false;
		break;
	}
}

// 広告定義にリワードかそうじゃないかのフラグを追加しておく
for ( var Key in SUGC_ExApi.AdsType )
{
	SUGC_ExApi.AdsType[Key].isReward = false;
}

for( var Key in SUGC_ExApi.RewardType )
{
	SUGC_ExApi.RewardType[Key].isReward = true;
}

// 初期化
SUGC_ExApi.Init = function()
{
}

// 広告表示
SUGC_ExApi.ads = function(adsType,_beforeFunc,_afterFunc)
{
	if( SUGC_ExApi.Mode == SUGC_ExApi.eMode.Ads_Api )
	{
		Ads_Api.Ads( adsType,
			function()
			{
				SUGC_ExApi.AdsExec = true;
				if( _beforeFunc != null )
				{
					_beforeFunc();
				}
			},
			function()
			{
				if( _afterFunc != null )
				{
					_afterFunc();
				}
				SUGC_ExApi.AdsExec = false;
			}
		);
		return;
	}
	
	if( typeof _afterFunc !== "undefined" )
	{
		if( _afterFunc != null )
		{
			SUGC_ExApi.AdsAfterFunc = _afterFunc;
		}
	}
	
	if( SUGC_ExApi.Mode == SUGC_ExApi.eMode.SU_Api )
	{
		if( SnlSound.m_isEnableBGM )
		{
			SU_Api.SUGC_BackupSoundFlag = true;
			SnlSound.SetEnableBGM( false );
		}
	}
	
	if( _beforeFunc != null )
	{
		_beforeFunc();
	}
	
	if( SUGC_ExApi.Mode == SUGC_ExApi.eMode.SU_Api )
	{
		SU_Api.ads();
	}
}

SUGC_ExApi.AdsReward = function( adsType, _viewedFunc, _dismissedFunc, _beforeRewardFunc, _beforeFunc, _afterFunc )
{
	if( SUGC_ExApi.Mode == SUGC_ExApi.eMode.Ads_Api )
	{
		Ads_Api.AdsReward
		(
			adsType,
			_viewedFunc,
			_dismissedFunc,
			_beforeRewardFunc,
			function()
			{
				SUGC_ExApi.AdsExec = true;
				if( _beforeFunc != null )
				{
					_beforeFunc();
				}
			},
			function()
			{
				if( _afterFunc != null )
				{
					_afterFunc();
				}
				SUGC_ExApi.AdsExec = false;
			}
		);
		return;
	}
	
	if( typeof _afterFunc !== "undefined" )
	{
		if( _afterFunc != null )
		{
			SUGC_ExApi.AdsAfterFunc = _afterFunc;
		}
	}
	
	if( typeof _viewedFunc !== "undefined" )
	{
		if( _viewedFunc != null )
		{
			SUGC_ExApi.AdsRewardViewedFunc = _viewedFunc;
		}
	}
	
	if( SUGC_ExApi.Mode == SUGC_ExApi.eMode.SU_Api )
	{
		if( SnlSound.m_isEnableBGM )
		{
			SU_Api.SUGC_BackupSoundFlag = true;
			SnlSound.SetEnableBGM( false );
		}
	}
	
	if( _beforeFunc != null )
	{
		_beforeFunc();
	}
	if( _beforeRewardFunc != null )
	{
		_beforeRewardFunc();
	}
	
	if( SUGC_ExApi.Mode == SUGC_ExApi.eMode.SU_Api )
	{
		SU_Api.ads();
	}
}

// ボタンから広告を呼ぶパラメタ
SUGC_ExApi.adsBtnIdx = -1;
SUGC_ExApi.adsBtnType = [];
SUGC_ExApi.adsBtnBeforeFunc = [];
SUGC_ExApi.adsBtnAfterFunc  = [];
SUGC_ExApi.adsBtnForceTrue = [];

// ボタンから広告を呼ぶ
SUGC_ExApi.adsBtnCallAds = function()
{
	var adsType 	= SUGC_ExApi.adsBtnType[SUGC_ExApi.adsBtnIdx];
	var _beforeFunc = SUGC_ExApi.adsBtnBeforeFunc[SUGC_ExApi.adsBtnIdx];
	var _afterFunc	= SUGC_ExApi.adsBtnAfterFunc[SUGC_ExApi.adsBtnIdx];
	
	if( adsType.isReward )
	{
		SUGC_ExApi.AdsReward
		(
			adsType,
			function() // _viewedFunc
			{
				SUGC_ExApi.adsBtnForceTrue[SUGC_ExApi.adsBtnIdx] = true;
			},
			null, // _dismissedFunc,
			null, // _beforeRewardFunc,
			_beforeFunc,
			_afterFunc 
		);
	}
	else
	{
		SUGC_ExApi.adsBtnForceTrue[SUGC_ExApi.adsBtnIdx] = true;
		SUGC_ExApi.ads(adsType,_beforeFunc,_afterFunc);
	}
}

// SnlPixiMgrで取得できるタップの押し下げに広告を連動させる宣言
// SnlPixiMgr.m_MouseUpでの画面進行に広告を連動させる場合に使用
// SUGC_ExApi.adsBtn系とは排他です
SUGC_ExApi.adsTapInit = function( adsType, _beforeFunc, _afterFunc )
{
	SUGC_ExApi.adsBtnIdx = -1;
	SUGC_ExApi.adsBtnType = [];
	SUGC_ExApi.adsBtnBeforeFunc = [];
	SUGC_ExApi.adsBtnAfterFunc  = [];
	SUGC_ExApi.adsBtnForceTrue = [];
	
	SUGC_ExApi.adsBtnType[0] 		= adsType;
	SUGC_ExApi.adsBtnBeforeFunc[0]	= _beforeFunc;
	SUGC_ExApi.adsBtnAfterFunc[0]	= _afterFunc;
	SUGC_ExApi.adsBtnForceTrue[0]	= false;
}

// SnlPixiMgrで取得できるタップの押し下げに広告を連動させる判定部
// SnlPixiMgr.m_MouseUpの判定の代わりにSUGC_ExApi.adsTap()で判定を行う
// 関数内でSnlPixiMgr.SetMouseUpOnesEventを呼んでいるので左記命令と併用する際は気を付けること
SUGC_ExApi.adsTap = function()
{
	if( SUGC_ExApi.adsBtnForceTrue[0] )
	{
		return true;
	}
	
	if( SnlPixiMgr.m_MousePress )
	{
		SUGC_ExApi.adsBtnIdx = 0;
		SnlPixiMgr.SetMouseUpOnesEvent( SUGC_ExApi.adsBtnCallAds );
	}
	else
	{
		SnlPixiMgr.SetMouseUpOnesEvent(null);
	}
	
	return SnlPixiMgr.m_MouseUp;
}

// SnlButtonの押し下げに広告を連動させる
// 互換用(SUGC_ExApi.adsBtn2のbtnIdx=0と同じ動作)
// 関数内でSnlPixiMgr.SetMouseUpOnesEventを呼んでいるので左記命令と併用する際は気を付けること
// btnIdx=0で作成時に広告ボタンのリストを初期化しているので注意
SUGC_ExApi.adsBtn = function( SnlBtn, adsType, _beforeFunc, _afterFunc )
{
	return SUGC_ExApi.adsBtn2( SnlBtn, 0, adsType, _beforeFunc, _afterFunc );
}

// 最後にアップデートされた
SUGC_ExApi.adsBtnLastIdx = 999999;

// SnlButtonの押し下げに広告を連動させる
// btnIdxは同一画面ボタンで正のintの一意な値をとること
// 関数内でSnlPixiMgr.SetMouseUpOnesEventを呼んでいるので左記命令と併用する際は気を付けること
// btnIdx=0で作成時に広告ボタンのリストを初期化
// アップデートする際は必ずbtnIdxが若い順番に呼ぶこと
SUGC_ExApi.adsBtn2 = function( SnlBtn, btnIdx, adsType, _beforeFunc, _afterFunc )
{
	if( SnlBtn == null )
	{
		return null;
	}
	// Idxの0が呼ばれたらごみを削除
	if( btnIdx == 0 )
	{
		SUGC_ExApi.adsBtnIdx = -1;
		SUGC_ExApi.adsBtnType = [];
		SUGC_ExApi.adsBtnBeforeFunc = [];
		SUGC_ExApi.adsBtnAfterFunc  = [];
		SUGC_ExApi.adsBtnForceTrue = [];
	}
	
	SUGC_ExApi.adsBtnType[btnIdx] 		= adsType;
	SUGC_ExApi.adsBtnBeforeFunc[btnIdx]	= _beforeFunc;
	SUGC_ExApi.adsBtnAfterFunc[btnIdx]	= _afterFunc;
	SUGC_ExApi.adsBtnForceTrue[btnIdx]	= false;
	
	SnlBtn.SUGC_adsBtnIdx = btnIdx;
	
	// 改造済みは流す
	if( "UpdateBtnBase" in SnlBtn )
	{
		return SnlBtn;
	}
	
	// SnlButtonのオブジェクトを改造してしまう
	SnlBtn.UpdateBtnBase = SnlBtn.Update;
	SnlBtn.isSUGC_AdsEnable = true;
	
	SnlBtn.Update = function()
	{
		if( !SnlBtn.isSUGC_AdsEnable )
		{
			return this.UpdateBtnBase();
		}
		
		// 最後にアップデートされたbtnIdx以下のIdxが呼ばれた場合はイベント登録を解除
		if( this.SUGC_adsBtnIdx <= SUGC_ExApi.adsBtnLastIdx )
		{
			SnlPixiMgr.SetMouseUpOnesEvent(null);
		}
		SUGC_ExApi.adsBtnLastIdx = this.SUGC_adsBtnIdx;
		
		if( this.UpdateBtnBase() )
		{
			if( SUGC_ExApi.adsBtnType[this.SUGC_adsBtnIdx].isReward )
			{
				this.m_LastHit = false;
				return false;
			}
			else
			{
				SUGC_ExApi.adsBtnForceTrue[this.SUGC_adsBtnIdx] = false;
				return true;
			}
		}
		
		if( SUGC_ExApi.adsBtnForceTrue[this.SUGC_adsBtnIdx] )
		{
			SUGC_ExApi.adsBtnForceTrue[this.SUGC_adsBtnIdx] = false;
			this.m_LastHit = true;
			return true;
		}
		
		
		if( this.isPress() )
		{
			SUGC_ExApi.adsBtnIdx = this.SUGC_adsBtnIdx;
			SnlPixiMgr.SetMouseUpOnesEvent( SUGC_ExApi.adsBtnCallAds );
		}
		
		return false;
	}
	
	return SnlBtn;
}



// Ads_Api周りを使いやすくするための関数群
// サウンドのON/OFFを弄る際にAds_Apiに自動通知
SnlSound.SetEnableOrigin = SnlSound.SetEnable;
SnlSound.SetEnable = function( SoundType, isEnable )
{
	SnlSound.SetEnableOrigin( SoundType, isEnable );
	if( !SUGC_ExApi.AdsExec )
	{
		if( SoundType == SnlSound.eSoundType.BGM && SUGC_ExApi.Mode == SUGC_ExApi.eMode.Ads_Api )
		{
			Ads_Api.AdConfig( isEnable );
		}
	}
}

SU_Api.SUGC_BackupSoundFlag = false;
SU_Api.isView_SUGWOrigin = SU_Api.isView;
SU_Api.isView = function()
{
	// SU_Api.isViewをAds_Api.isViewとマージしてしまう
	if( SUGC_ExApi.Mode == SUGC_ExApi.eMode.Ads_Api )
	{
		if( SU_Api.isView_SUGWOrigin() || Ads_Api.isView() )
		{
			return true;
		}
	}
	else
	{
		// オリジナルのisViewでview状態なら止めておく
		if( SU_Api.isView_SUGWOrigin() )
		{
			return true;
		}
	}
	
	// Ads_Api以外の環境の処理
	
	// 広告再生時にサウンドを止めいていたら復帰
	if( SU_Api.SUGC_BackupSoundFlag )
	{
		SnlSound.SetEnableBGM( true );
		SU_Api.SUGC_BackupSoundFlag = false;
	}
	
	if( SUGC_ExApi.AdsRewardViewedFunc != null )
	{
		SUGC_ExApi.AdsRewardViewedFunc();
		SUGC_ExApi.AdsRewardViewedFunc = null;
	}
	
	if( SUGC_ExApi.AdsAfterFunc != null )
	{
		SUGC_ExApi.AdsAfterFunc();
		SUGC_ExApi.AdsAfterFunc = null;
	}
	
	return false;
}

SUGC_ExApi.Init();