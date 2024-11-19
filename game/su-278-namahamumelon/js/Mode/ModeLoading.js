// ローディングモード
var ModeLoading =  function()
{
	this.m_Step = -1;
	this.m_LoadingTextStep = 0;
	this.m_LoadingText = null;
};

// モード列挙
ModeLoading.eStep =
{
	LoadResource : 0,
	InitGame	 : 1,
	Done		 : 2,
}

// レイアウトデータの下限バージョン
ModeLoading.LayoutVersion = 1;


ModeLoading.prototype = {}

// 初期化
ModeLoading.prototype.Init = function() 
{
	// ローディングゲージ初期化
	SnlLoadingGauge.Init( GameDefine.eDispSort.UI );
	SnlLoadingGauge.SetEnable( true );
	
	// ローディング表示
	this.m_LoadingTextStep = 0;
	this.m_LoadingText = new SnlObject();
	this.m_LoadingText.CreateText( "Loading...", 30, false, "White", SnlObject.eTextAligan.Center, 320, UiUtility.GetScreenPosY(320), GameDefine.eDispSort.UI );
	
	this.ChangeStep( ModeLoading.eStep.LoadResource );
}

// ステップ変更命令
ModeLoading.prototype.ChangeStep = function( Step )
{
	this.m_Step = Step;
	switch( this.m_Step )
	{
		// ロード開始
		case ModeLoading.eStep.LoadResource:
		{

			// サウンドロード
			SnlSound.Load( GameDefine.SoundPath );

			// テクスチャロード開始
			SnlPixiMgr.LoadTexture( ImgInfo.c_ImgPath, ImgInfo.c_ImgData );

			// CreapJSを使用したエフェクトが有効なら初期化
			if( GameDefine.EnableCreap )
			{
				EffectMgr.Init();
			}
			
			// CreateJSを使用したエフェクトが有効なら初期化
			if( GameDefine.EnableCreateJS )
			{
				EffectMgrCJS.Init();
			}
			
			// Spineを使用したエフェクトが有効なら読み込み開始
			if( GameDefine.EnableSpine )
			{
				SpineMgr.LoadAllAsset();
			}
			
			// レイアウトシステムが有効なら読み込み開始
			if( GameDefine.EnableLayoutSystem )
			{
				// UiUtilityにBankとImg定義を紐づけたデータを渡す
				UiUtility.SetImgBankData( [ImgInfo] );
				
				LayoutReproduction.LoadStaticData(GameDefine.ResidentLayoutFile, ModeLoading.LayoutVersion);
			}
			
			// Jsonデータのロード
			if( GameDefine.EnableGameDataMgr )
			{
				GameDataMgr.StartLoadData();
			}
			
		}
		break;
		
		// ロード終了後の初期化処理
		case ModeLoading.eStep.InitGame:
		{
			// 各種ロード後に初期化したい物があればここで行う
		}
		break;
		
		// ロード終了
		case ModeLoading.eStep.Done:
		
			// タイトル画面遷移を開始する
			window.gameMain.ChangeMode( GameDefine.eMode.Title );

		break;
	}
}

// モード更新処理
ModeLoading.prototype.Update = function() 
{
	// アニメーション更新
	this.Update_Anim();
	
	// 各ステップ毎の更新処理を呼ぶ
	switch( this.m_Step )
	{
		case ModeLoading.eStep.LoadResource:	this.UpdateLoadResource();	break;
		case ModeLoading.eStep.InitGame:		this.UpdateInitGame();		break;
	}
}

// アニメーション更新
ModeLoading.prototype.Update_Anim = function()
{
	if( this.m_LoadingTextStep == 0 )
	{
		this.m_LoadingText.AddAlpha( -0.05 );
		
		if( this.m_LoadingText.GetAlpha() <= 0 )
		{
			this.m_LoadingTextStep = 1;
		}
	}
	else		
	{
		this.m_LoadingText.AddAlpha( 0.05 );
		
		if( this.m_LoadingText.GetAlpha() >= 1 )
		{
			this.m_LoadingTextStep = 0;
		}
	}
}

// リソース読み込み待機中
ModeLoading.prototype.UpdateLoadResource = function()
{
	// 読み込み完了フラグを立てておく
	var isDone = true;
	
	// 各ロード進行度を取得
	var Rates = 
	[
		SnlPixiMgr.m_NowLoadProgress,
		SnlSound.GetLoadProgress()
	];

	// サウンドロード終了チェック
	if( !SnlSound.isAllLoad() )
	{
		isDone = false;
	}
	
	// テクスチャロード終了チェック
	if( !SnlPixiMgr.isLoadedTexture() )
	{
		isDone = false;
	}
	
	// レイアウトファイルロード終了チェック
	if( GameDefine.EnableLayoutSystem )
	{
		if(LayoutReproduction.IsStationedDataLoadComplete()==false)
		{
			isDone = false;
		}
		
		// ロード進行度にレイアウトファイルを追加
		Rates.push( LayoutReproduction.StationedDataLoadRate() );
	}
	
	// CreateJS系のリソースロード終了チェック
	if( GameDefine.EnableCreateJS )
	{
		if( !EffectMgrCJS.LoadingUpdate() )
		{
			isDone = false;
		}
		// ロード進行度にCreateJS系のリソースを追加
		Rates.push( EffectMgrCJS.GetLoadProgress() );
	}
	
	// GameDataMgrのロード終了チェック
	if( GameDefine.EnableGameDataMgr )
	{
		if( !GameDataMgr.doneLoad )
		{
			isDone = false;
		}
		// ロード進行度にDataTblで読んでいるファイルを追加
		Rates.push( GameDataMgr.JsonTbl.GetLoadProgress() );
	}
	
	// Spineのリソースロード状況をチェック
	if( GameDefine.EnableSpine )
	{
		if( SpineMgr.isAllLoad )
		{
			isDone = false;
		}
		Rates.push( SpineMgr.GetLoadProgress() );
	}
	
	// 各要素のロード進行度から総合のロード進行度を計算
	var Rate = 0;
	for( var i=0; i<Rates.length; i++ )
	{
		Rate += Rates[i];
	}
	Rate = Rate / Rates.length;
	
	// ローディングゲージに進行度を反映
	SnlLoadingGauge.Update( Rate );
	
	if( isDone )
	{
		// タッチイベントでSoundをAllPlayStopするようフラグ立て
		SnlPixiMgr.SetAllPlayAndStop();
		
		this.ChangeStep( ModeLoading.eStep.InitGame );
	}
}

// ロード後の初期化処理時の更新
ModeLoading.prototype.UpdateInitGame = function()
{
	this.ChangeStep( ModeLoading.eStep.Done );
}

// モード終了処理
ModeLoading.prototype.Exit = function() 
{
	SnlLoadingGauge.SetEnable( false );
	
	this.m_LoadingText.Destroy();
	this.m_LoadingText = null;
};

