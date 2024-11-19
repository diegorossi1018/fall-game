var ModeTitle =  function()
{
	// 背景
	this.m_SpriteBG = null;
	this.logo = null;
	this.c = null;
	
	// バージョン情報
	this.m_VarsionText = null;
	
	this.m_VObj = null;
	this.m_RectObj1 = null;
	this.m_RectObj2 = null;

	this.rule = null;

	this.clearFrameSprite = null;

	this.dateCheck = null;
	this.todayClearCheck = false;
	this.changeTodayData = null;
};

// ボタン列挙
ModeTitle.eBtn =
{
	GameStart		: 0,
	Sound			: 1,
	Rule  			: 2,
	Other			: 3,
	Max				: 4,
};

ModeTitle.pos = 
{
	BG : {x:320,y:400},
	logo : {x:320,y:220},
	titleSpine : {x:0, y: -500},
	c : {x:320,y:750},
	frame : {x:320, y:380},
	bestScore : {x:260, y:345},
	
	buttons : 
	{
		start : { x : 320, y : 550 },
		other : { x : 170, y : 670 },
		rule  : { x : 320, y : 670 },
		sound : { x : 470, y : 670 },
	},

}

ModeTitle.prototype = {
	// 初期化
	Init : function() 
	{

		// 背景画像作成
		this.titleBG = new SnlObject();
		this.titleBG.CreateSprite(ImgInfo.eImg.title_bg, ModeTitle.pos.BG.x, ModeTitle.pos.BG.y, 0.5, 0.5, GameDefine.eDispSort.BG);
		
		this.titleSpine = SpineMgr.CreateSpine(GameDefine.eSpine.title, ModeTitle.pos.titleSpine.x, ModeTitle.pos.titleSpine.y,"start", false, GameDefine.eDispSort.BG);

		this.c = new SnlObject();
		this.c.CreateSprite(ImgInfo.eImg.success, ModeTitle.pos.c.x, ModeTitle.pos.c.y, 0.5,0.5, GameDefine.eDispSort.BG);
		
		this.frameSprite = new SnlObject();
        this.frameSprite.CreateSprite(ImgInfo.eImg.result_best, ModeTitle.pos.frame.x, ModeTitle.pos.frame.y, 0.5, 0.5, GameDefine.eDispSort.BG);
		this.frameSprite.SetScale(0.7, 0.7);

		if (SaveDataMgr.SaveData.HighScore === 0) {
            this.firstScore = new SnlObject();
            this.firstScore.CreateSprite(ImgInfo.eImg.result_num_none, ModeTitle.pos.bestScore.x + 60, ModeTitle.pos.bestScore.y, 0.5, 0.5, GameDefine.eDispSort.BG);
        } else {
            this.firstScore = new SnlNumDisp();
            this.firstScore.Create(ModeTitle.pos.bestScore.x, ModeTitle.pos.bestScore.y, SaveDataMgr.SaveData.HighScore, 7, ImgInfo.eImg.result_num_00, ImgInfo.c_ImgData[ImgInfo.eImg.result_num_00].w - 22, GameDefine.eDispSort.BG, null, SnlNumDisp.eArigen.Left);
        }
		this.firstScore.SetScale(0.5, 0.5);

        if (SaveDataMgr.SaveData.SecondScore === 0) {
            this.secondScore = new SnlObject();
            this.secondScore.CreateSprite(ImgInfo.eImg.result_num_none, ModeTitle.pos.bestScore.x + 60, ModeTitle.pos.bestScore.y + 40, 0.5, 0.5, GameDefine.eDispSort.BG);
			
        } else {
            this.secondScore = new SnlNumDisp();
            this.secondScore.Create(ModeTitle.pos.bestScore.x, ModeTitle.pos.bestScore.y + 40, SaveDataMgr.SaveData.SecondScore, 7, ImgInfo.eImg.result_num_00, ImgInfo.c_ImgData[ImgInfo.eImg.result_num_00].w - 22, GameDefine.eDispSort.BG, null, SnlNumDisp.eArigen.Left);
        }
		this.secondScore.SetScale(0.5, 0.5)

        if (SaveDataMgr.SaveData.ThirdScore === 0) {
            this.thirdScore = new SnlObject();
            this.thirdScore.CreateSprite(ImgInfo.eImg.result_num_none, ModeTitle.pos.bestScore.x + 60, ModeTitle.pos.bestScore.y + 80, 0.5, 0.5, GameDefine.eDispSort.BG);
        } else {
            this.thirdScore = new SnlNumDisp();
            this.thirdScore.Create(ModeTitle.pos.bestScore.x, ModeTitle.pos.bestScore.y + 80, SaveDataMgr.SaveData.ThirdScore, 7, ImgInfo.eImg.result_num_00, ImgInfo.c_ImgData[ImgInfo.eImg.result_num_00].w - 22, GameDefine.eDispSort.BG, null, SnlNumDisp.eArigen.Left);
        }
		this.thirdScore.SetScale(0.5, 0.5);

		// 各種ボタン作成
		this.m_Btn = [];
		for ( var i=0; i<ModeTitle.eBtn.Max; i++ ) {
			this.m_Btn[i] = new SnlButton();
		}

		// ゲームスタートボタン作成（押されると画像を切替えるボタン）
		this.m_Btn[ModeTitle.eBtn.GameStart].CreateScaleBtn( ImgInfo.eImg.title_btn_start, ModeTitle.pos.buttons.start.x, ModeTitle.pos.buttons.start.y, GameDefine.eDispSort.UI );
		this.m_Btn[ModeTitle.eBtn.Rule].CreateScaleBtn( ImgInfo.eImg.title_btn_how, ModeTitle.pos.buttons.rule.x, ModeTitle.pos.buttons.rule.y, GameDefine.eDispSort.UI );
		this.m_Btn[ModeTitle.eBtn.Other].CreateScaleBtn( ImgInfo.eImg.title_btn_other, ModeTitle.pos.buttons.other.x, ModeTitle.pos.buttons.other.y, GameDefine.eDispSort.UI );

		
		// サウンド切り替えボタンの作成（押されると画像が縮小されるボタン）
		if ( SnlSound.m_isEnableBGM ) {
			this.m_Btn[ModeTitle.eBtn.Sound].CreateScaleBtn( ImgInfo.eImg.title_btn_se_on, ModeTitle.pos.buttons.sound.x , ModeTitle.pos.buttons.sound.y, GameDefine.eDispSort.UI );
		} else {
			this.m_Btn[ModeTitle.eBtn.Sound].CreateScaleBtn( ImgInfo.eImg.title_btn_se_off, ModeTitle.pos.buttons.sound.x , ModeTitle.pos.buttons.sound.y, GameDefine.eDispSort.UI );
		}

		// ボタンのSEを設定
		this.m_Btn[ModeTitle.eBtn.Sound].SetHitSE( SnlButton.SENone );
		
			
		this.modalRule = new ModalRule();
		this.modalRule.create();

		this.m_Btn[ModeTitle.eBtn.Other].SetVisible( false );
		this.m_Btn[ModeTitle.eBtn.Rule].SetPos( ( ModeTitle.pos.buttons.other.x + ModeTitle.pos.buttons.rule.x ) / 2, ModeTitle.pos.buttons.rule.y );
		this.m_Btn[ModeTitle.eBtn.Sound].SetPos( ( ModeTitle.pos.buttons.rule.x + ModeTitle.pos.buttons.sound.x ) / 2, ModeTitle.pos.buttons.sound.y );	
		
		if ( SU_Api.m_ServiceProvider == "SU" ) {
			SnlCreditBtn.SetVisible( true, GameDefine.eDispSort.Top ) //dispZを省略したら一番上
		}

		// BGM再生
		SnlSound.PlayBGM( GameDefine.eSound.BGM );
	
	},

	isKeyExists : function(obj, key)
    {
        return key in obj;
    },
	
	// 更新処理
	Update : function() 
	{
		// ボタンのチェック
		for( var i = 0; i < ModeTitle.eBtn.Max; i++ )
		{
			// ボタン更新
			this.m_Btn[i].Update();
			
			// ボタンが押されたか？
			if( this.m_Btn[i].GetLastHit() && !ModalRule.isVisible)
			{
				// ボタンによって処理を変える
				switch( i )
				{
					// スタートボタン
					case ModeTitle.eBtn.GameStart:
						//モード変更
						window.gameMain.ChangeMode( GameDefine.eMode.Main );
						if(SU_Api.m_ServiceProvider == "YGP" || SU_Api.m_ServiceProvider == "SU")
						{
							Ads_Api.Ads( Ads_Api.AdsType.Start );
						}
					return;
					
					case ModeTitle.eBtn.Other:
						SU_Api.recommendGames();
					return;

					case ModeTitle.eBtn.Rule:
						this.modalRule.setVisible(true);
					return;
					
					// サウンド切り替えボタン
					case ModeTitle.eBtn.Sound:
					{
						// サウンドフラグを反転
						SnlSound.SetEnableBGM( !SnlSound.m_isEnableBGM );
						SnlSound.SetEnableSE( !SnlSound.m_isEnableSE );
					
						// サウンドフラグに応じてボタン画像の変更
						if ( SnlSound.m_isEnableBGM ) {
							// SEの再生
							SnlSound.PlaySE( SnlButton.DefaultHitSE );
							this.m_Btn[ModeTitle.eBtn.Sound].SetTexture( ImgInfo.eImg.title_btn_se_on);
						} else {
							this.m_Btn[ModeTitle.eBtn.Sound].SetTexture( ImgInfo.eImg.title_btn_se_off);
						}
					}
					break;
				}
			}
		}

		this.modalRule.update();

		if (this.titleSpine.isEnd()) {
			this.titleSpine.Play("loop", true);
		}
	},
	
	// モード終了処理
	Exit : function() 
	{
		if ( SU_Api.m_ServiceProvider == "SU" ) {
			SnlCreditBtn.SetVisible( false );
		}

		// 作成した各種オブジェクトの削除
		this.titleSpine.Destroy();
		this.titleSpine = null;

		this.frameSprite.Destroy();
		this.frameSprite = null;
		
		this.firstScore.Destroy();
		this.firstScore = null;
		this.secondScore.Destroy();
		this.secondScore = null;
		this.thirdScore.Destroy();
		this.thirdScore = null;

		this.titleBG.Destroy();
		this.titleBG = null;

		this.modalRule.destroy();
		this.modalRule = null;
		
		this.c.Destroy();
		this.c = null;

		for ( var i=0; i<ModeTitle.eBtn.Max; i++ ) {
			this.m_Btn[i].Destroy();
			this.m_Btn[i] = null;
		}

		this.m_Btn = null;
	},


};

