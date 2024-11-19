var GameMain =  function()
{	
	//Debug表示
	this.m_DispDPS = null;	// FPS描画用オブジェクト
	this.m_NowFPS = 0;		// FPS数値
	
	// Mode
	this.m_Mode = GameDefine.eMode.None;
	this.m_ModeExec = [];
	
	// モードチェンジ関係
	this.m_NextMode = -1;
	this.m_ModeChangeStep = -1;

};

GameMain.SaveDate = null;

GameMain.prototype = {}

// 初期化
GameMain.prototype.Init = function()
{		
	// セーブデータ初期化		
	SaveDataMgr.Init();
	
	// CreateJSのFPS(エフェクトのFPS)
	SnlPixiMgr.CreateJsFPS = 60;
	
	// スゴ得用設定
	if( SU_Api.m_ServiceProvider == "DSG" )
	{
		SnlPixiMgr.SetBasePath( SU_Api.m_BasePath );
		SnlPixiMgr.m_AdsHeight = 60;
		SnlPixiMgr.m_isCentering = true;
	}
	
	// iPadの扱いを決める（デバイス判定を回す）
	SnlPixiMgr.DeviceCheck( false );	// iPadは基本PCでiPad側がモバイル扱い状態ならモバイルとして扱う
	// SnlPixiMgr.DeviceCheck( true );	// iPadはモバイルとして扱う
	
	// サイズ計算（モバイル時は横固定で縦の長さを可変させる）
	if( !SnlPixiMgr.m_isPC )
	{
		this.offSetY = 0;
		this.offSetYBG = 0;
		// 横→縦時にサイズを修正するように
		//if( SU_Api.m_ServiceProvider == "YGP" || SU_Api.m_ServiceProvider == "SU" ||  SU_Api.m_ServiceProvider == "AGP" || SU_Api.m_ServiceProvider == "KGB" || SU_Api.m_ServiceProvider == "GLOB" )
		// {
			
		var Rate = (document.documentElement.clientHeight - SnlPixiMgr.m_AdsHeight ) / document.documentElement.clientWidth;
		SnlPixiMgr.m_Height = (SnlPixiMgr.m_Width * Rate);
		
		if( SnlPixiMgr.m_Height < 800 )
		{
			SnlPixiMgr.m_Height = 800;
		}
		
		if( 1280 < SnlPixiMgr.m_Height )
		{
			SnlPixiMgr.m_Height = 1280;
		}
		
		SnlPixiMgr.m_isCentering = true;
		SnlPixiMgr.m_ResizeCheckOnUpdate = true;
		// }

		this.offSetY = ( SnlPixiMgr.m_Height - 800 ) / 2;
		this.offSetCenterPos = { x : 350, y : 400 + this.offSetY };

		// =============================================================
		// offset pos
		var havePosJsList =
		[
			ModeTitle,Board,GameMainUI,GameResultUI,ModalPause,ModalRule,ModalConfirm
		
		];

		for( var js in havePosJsList )
		{
			// Check have pos
			if( havePosJsList[js].pos != null )
			{
				for( var data in havePosJsList[js].pos )
				{
					// Is List?
					if( havePosJsList[js].pos[data].x == null )
					{
						for( var pos in havePosJsList[js].pos[data] )
						{
							havePosJsList[js].pos[data][pos].y += this.offSetY;
						}
					} else
					{
						havePosJsList[js].pos[data].y += this.offSetY;
					}
				}
				// Add Bottom pos
				havePosJsList[js].pos.bottom = { x : SnlPixiMgr.m_Width / 2, y : SnlPixiMgr.m_Height - 35 };
			} else
			{
				console.log( havePosJsList[js].name + " has no Pos" );
			}
		}
		// =============================================================
	}
	
	// 描画間隔の設定（らくらくホン環境とかよう)
	if( typeof SU_Api.isOldPhone !== "undefined" )
	{
		if( SU_Api.isOldPhone )
		{
			SnlPixiMgr.m_RenderDist = 3; 		// 描画は3フレに一回
			GameDefine.FixFrameTiming = true;
		}			
	}
		
	// 描画初期化
	SnlPixiMgr.m_isPreferentialMemory = true; // メモリ効率優先
	// SnlPixiMgr.Init( GameDefine.eDispSort.Max ); // PixiJSと他の描画ライブラリを混合しない場合
	SnlPixiMgr.Init( GameDefine.eDispSort.Max, GameDefine.CanvasModeTbl ); // PixiJSと他の描画ライブラリを混合する場合
	
	// 本番ではconsoleを止める
	console.snl_output = GameDefine.isDebug;

	MatterMgr.init();
	
	SnlFader.Init( GameDefine.eDispSort.Fader );

	document.addEventListener('visibilitychange', function() {
		if (document.hidden) {

			var bodys = MatterMgr.getBodies();

			bodys.forEach(function( body ) {
				Matter.Sleeping.set(body, true);
			});

			MatterMgr.engineObj.enabled = false;
		} else {
			var bodys = MatterMgr.getBodies();

			bodys.forEach(function( body ) {
				Matter.Sleeping.set(body, false);
			});

			MatterMgr.engineObj.enabled = true;
		}
	});
	
	// デバッグ用FPS表示
	if( GameDefine.isDebug )
	{
		SnlPixiMgr.isDebug = true;
		this.m_DispDPS = new SnlObject();
		this.m_DispDPS.CreateText( "FPS:**", 20, true, "Red",  SnlObject.eTextAligan.Right, 640, 0, GameDefine.eDispSort.Debug );
	}
	
	// PC版の描画縮小処理
	if( SnlPixiMgr.m_isPC )
	{
		if( SU_Api.m_ServiceProvider == "YGP" || SU_Api.m_ServiceProvider == "SU" ||  SU_Api.m_ServiceProvider == "AGP" || SU_Api.m_ServiceProvider == "KGB" || SU_Api.m_ServiceProvider == "GLOB" )
		{
			for( var i=0; i<GameDefine.eDispSort.Max; i++ )
			{
				var canvas = document.getElementById( "SnlCanvas_" + i );
				if( canvas )
				{
	    			canvas.style.width = '480px';
	    			canvas.style.height = '600px';
	    		}
			}
			SnlPixiMgr.m_InputRatio = 480 / SnlPixiMgr.m_Width;
		}
	}
	
	// サウンド関係の初期化
	SnlSound.m_isSameBgmRestart = false; // 同一BGMの再生命令は無視
	// SnlSound.m_isSameBgmRestart = true;  // 同一BGMの再生命令は頭出し
	SnlSound.Init();
	
	// 基本的にBGM/SEはOFFの状態でゲームが始まる
	SnlSound.SetEnableBGM( false );
	SnlSound.SetEnableSE( false );
	
	// デフォルトボタン音設定
	SnlButton.DefaultHitSE = GameDefine.eSound.CmnBtn;
	
	// キーボード入力初期化
	if( GameDefine.EnableKeyboardInput )
	{
		SnlKeyboard.Init();
	}
	
	// 各種モードクラスの初期化と設定
	this.m_ModeExec[GameDefine.eMode.Main] 				= new ModeMain();
	this.m_ModeExec[GameDefine.eMode.Title] 			= new ModeTitle();
	this.m_ModeExec[GameDefine.eMode.Loading]			= new ModeLoading();
	this.m_ModeExec[GameDefine.eMode.EffectTestCreap] 	= new ModeEffectTestCreap();
	this.m_ModeExec[GameDefine.eMode.Result]			= new ModeResult();
	
	this.ChangeMode( GameDefine.eMode.Loading );
};

// MainLoop
GameMain.prototype.MainLoop = function()
{
	SnlFPS.Update();
	SU_Api.Update();
	SnlPixiMgr.BeginMain();
	TWEEN.update();
	
	if( GameDefine.isDebug && this.m_DispDPS != null )
	{
		if( SnlFPS.FPS != this.m_NowFPS )
		{
			this.m_NowFPS = SnlFPS.FPS;
			this.m_DispDPS.SetText( "FPS:" + String( SnlFPS.FPS ) );
		}
	}
	
	var isNotUpdate = (SU_Api.isView() || SaveDataMgr.SaveExec);
	if( SU_Api.m_ServiceProvider == "XIAOMI" )
	{
		if( !SUCCESS.gameController.isUpdatable() )
		{
			isNotUpdate = true;
		}
	}
	
	//広告などが表示されている時は、ゲーム本体を止める
	if( isNotUpdate )
	{
		
	}
	else
	{
		SnlFader.Update();
		
		if( GameDefine.EnableCreap )
		{
			EffectMgr.Update();
		}
		
		if( GameDefine.EnableSpine )
		{
			SpineMgr.Update();
		}
		
		// モードチェンジ動作中
		if( 0 <= this.m_ModeChangeStep )//0 <= this.m_NextMode )
		{
			if( this.m_ModeChangeStep == 0 )
			{
				if( SnlFader.m_isFadeEnd )
				{
					this.m_ModeChangeStep++;
					this.ChangeMode( this.m_NextMode, true );
					//SnlFader.SetFade( SnlFader.eType.FadeIn, 0.5 );
					this.m_NextMode = -1;
				}
			}
			else
			{
				var isReady = false;
				if( this.m_ModeExec[this.m_Mode].isReady == null )
				{
					isReady = true;
				}
				else
				{
					isReady = this.m_ModeExec[this.m_Mode].isReady();
				}
				
				if( isReady )
				{
					SnlFader.SetFade( SnlFader.eType.FadeIn, 0.5 );
					this.m_ModeChangeStep = -1;
				}
			}
		}
		// 通常動作
		else
		{
			
			if( 0 <= this.m_Mode )
			{
				this.m_ModeExec[this.m_Mode].Update();
			}
		}
	}
	
	SnlPixiMgr.EndMain();
	// レンダリング
	SnlPixiMgr.Render();
};

GameMain.prototype.ChangeMode= function( NextMode, isNotFade )
{
	if( isNotFade == null )
	{
		isNotFade = false;
	}
	
	if( isNotFade )
	{
		if( 0 <= this.m_Mode )
		{
			this.m_ModeExec[this.m_Mode].Exit();
		}
	
		this.m_Mode = NextMode;
	
		if( 0 <= this.m_Mode )
		{
			this.m_ModeExec[this.m_Mode].Init();
		}
	}
	else
	{
		this.m_ModeChangeStep = 0;
		this.m_NextMode = NextMode;
		SnlFader.SetFade( SnlFader.eType.FadeOut, 0.5, 0x000000 );
	}
};
	
GameMain.prototype.GetModeInstance = function( Mode )
{
	return this.m_ModeExec[Mode];
};

// Mainループ実体
function mainLoop(event)
{
	// メインループ開始前の時間を保持
	var date = new Date();
	var StartTime = date.getTime();
	
	window.gameMain.MainLoop();
	
	// メインループ終了後の時間を取得
	var date2 = new Date();
	var NowTime = date2.getTime();
	
	// メインループにかかった時間から待機時間を計算
	var wait = 16 - (NowTime-StartTime);
	if( wait < 1 )
	{
		wait = 1;
	}
	
	// 60FPS固定
	if( GameDefine.FixFrameTiming )
	{
		setTimeout( mainLoop, wait );
	}
	// 次のアニメーションフレームでGameMainを呼び出してもらう(垂直同期依存)
	else
	{
		requestAnimationFrame( mainLoop );
	}
}

// ゲームメインの作成(循環参照回避で実体をwindowに逃がしてるがもにょる GameMgr的なの作ってそれに渡して保持させてもいいけどそれもなぁ）
window.gameMain = new GameMain();
window.gameMain.Init();



// メインループの初回呼び出し
requestAnimationFrame( mainLoop );