var ModeEffectTestCreap =  function()
{
	this.m_Btn = null;
	
	this.m_EffectBG = null;
	this.m_LayoutBase = null;
	this.m_Window = null;
	this.m_Dialog = null;
	this.m_Num = null;
};

ModeEffectTestCreap.eBtn =
{
	Start : 0,
	Continue : 1,
	HowToPlay : 2,
	OtherGame : 3,
	Sound     : 4,
};

ModeEffectTestCreap.prototype = {};

ModeEffectTestCreap.prototype.Init = function() 
{
	SnlSound.PlayBGM( GameDefine.eSound.BGM_Title );
	
	this.m_LayoutBase = new LayoutReproduction(this, GameDefine.eDispSort.BG);
	this.m_LayoutBase.LoadBankMode(GameDefine.eLayoutPath.Common+"layout_title.json", [GameDefine.eBank.Common], null, this.OnLoadLayoutBase);
	//SnlSound.StopBGM( );
};

ModeEffectTestCreap.prototype.OnLoadLayoutBase = function()
{

	this.m_LayoutBase.CreateSelf();
	this.m_LayoutBase.SetBaseAncPosY( 0.5 );
	
	this.m_Btn = 
	[
		this.m_LayoutBase.GetObject( "btn_select" ),
		this.m_LayoutBase.GetObject( "btn_continue" ),
		this.m_LayoutBase.GetObject( "btn_how" ),
		this.m_LayoutBase.GetObject( "btn_other" ),
		this.m_LayoutBase.GetObject( "btn_sound_on" )
	];
	
	// ボタン周りの設定
	this.m_Btn[ModeEffectTestCreap.eBtn.Sound].SetHitSE( SnlButton.SENone );
	if( !SnlSound.m_isEnableBGM )
	{
		this.m_Btn[ModeEffectTestCreap.eBtn.Sound].SetTexture( ImgInfo.eImg.btn_sound_off, ImgInfo.eImg.btn_sound_off_1 );
	}
	this.m_Btn[ModeEffectTestCreap.eBtn.Continue].SetDisable( true /* !ProblemMgr.EnableSaveData() */, true );
	
	this.m_Btn[ModeEffectTestCreap.eBtn.OtherGame].SetVisible( SU_Api.m_ServiceProvider == "YGP" );

	var SizeInfo = { l: 2, r: 2 };
	this.m_Num = [];
	for( var i=0; i</*ProblemMgr.LvMax*/4; i++ )
	{
		// Nullノードのサイズに合わせてSnlNumを作成する
		this.m_Num[i] = UiUtility.CreateNumDispFromNullObj( this.m_LayoutBase.GetObject("num_lv"+i), ImgInfo.eImg.num_0, SnlNumDisp.eArigen.right, SizeInfo );
		this.m_Num[i].SetNum( Math.floor( Math.random() * 250 ) );
		this.m_Num[i].SetRGBA( 255, 254, 251, 255 );
	}
	
	// Creapエフェクトを作成
	this.m_EffectBG = EffectMgr.CreateAndLoad( GameDefine.eEffect.Title, true, 0, 0, 0, 0, -1, this.m_LayoutBase.GetObject("LogoEffect") );	
};

ModeEffectTestCreap.prototype.isReady = function()
{
	return this.m_Btn != null;
};
		
ModeEffectTestCreap.prototype.Update = function() 
{

	for( var i=0; i<this.m_Btn.length; i++ )
	{
		if( !this.m_Btn[i].Update() )
		{
			continue;
		}
		
		switch( i )
		{
			case ModeEffectTestCreap.eBtn.Start:
				window.gameMain.ChangeMode( GameDefine.eMode.Title );
			break;
			
			case ModeEffectTestCreap.eBtn.Continue:

			break;
			
			case ModeEffectTestCreap.eBtn.HowToPlay:

			break;
			
			case ModeEffectTestCreap.eBtn.OtherGame:
				SU_Api.recommendGames();
			break;
			
			case ModeEffectTestCreap.eBtn.Sound:
				SnlSound.SetEnableBGM( !SnlSound.m_isEnableBGM );
				SnlSound.SetEnableSE( !SnlSound.m_isEnableSE );
					
				if( SnlSound.m_isEnableBGM )
				{
					SnlSound.PlaySE( SnlButton.DefaultHitSE );
					this.m_Btn[ModeEffectTestCreap.eBtn.Sound].SetTexture( ImgInfo.eImg.btn_sound_on, ImgInfo.eImg.btn_sound_on_1 );
				}
				else
				{
					this.m_Btn[ModeEffectTestCreap.eBtn.Sound].SetTexture( ImgInfo.eImg.btn_sound_off, ImgInfo.eImg.btn_sound_off_1 );
				}
			break;
		}
		return;
	}
	
};


ModeEffectTestCreap.prototype.Exit = function() 
{
	for( var i=0; i<this.m_Num.length; i++ )
	{
		this.m_Num[i].Destroy();
		this.m_Num[i] = null;
	}
	this.m_Num = null;
	
	if( this.m_Dialog != null )
	{
		this.m_Dialog.Destroy();
		this.m_Dialog = null;
	}
	
	this.m_LayoutBase.Destroy();
	this.m_LayoutBase = null;
	
	this.m_Btn = null;
	
	if( this.m_EffectBG != null )
	{
		this.m_EffectBG.Destroy();
		this.m_EffectBG = null;
	}
};