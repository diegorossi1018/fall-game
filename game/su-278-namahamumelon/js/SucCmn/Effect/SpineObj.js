// SpineMgrから作成されるエフェクトのオブジェクト
var SpineObj =  function()
{
	this.super = SnlObject.prototype;
	SnlObject.call( this );
	
	this.m_SpineObjID = -1;
	this.m_SpineObj = null;
	this.m_TrackEntry = null;
	this.m_PauseBackupTimeScale = 1;
};

// SpineObjはSnlObjectを基底に持つ
SpineObj.prototype = Object.create( SnlObject.prototype );

// Spineの作成
// EffectType 	: エフェクトタイプ（GameDefine.eSpine）
// PosX, PosY 	: エフェクトの位置
// Anim			: アニメーション名（省略するとキーの0番を再生）
// isLoop		: ループ再生するか
// EffectZ		: エフェクトの描画順( GameDefine.eDispSort -1で親オブジェクト依存)
// Parent		: エフェクトの親オブジェクト
// IgnoreSkeltonPos : Spineに設定されている座標を無視する
SpineObj.prototype.Create = function ( ObjID, EffectType, PosX, PosY, Anim, isLoop, EffectZ, Parent, IgnoreSkeltonPos )
{
	if( typeof IgnoreSkeltonPos === "undefined" )
	{
		IgnoreSkeltonPos = false;
	}
	
	// ObjID登録
	this.m_SpineObjID = ObjID;
	
	// エフェクト用ノードの作成
	this.CreateSprite( -1, PosX, PosY, 0, 0, EffectZ, Parent );

	// Spineアニメ作成
	var SpineObj = new PIXI.spine.Spine( SpineMgr.m_SpineAsset[EffectType].spineData );
	this.m_SpineObj = SpineObj;
	
	// とりあえずデフォルト位置を設定
	if( !IgnoreSkeltonPos )
	{
		if( "x" in SpineMgr.m_SpineAsset[EffectType].data.skeleton )
		{
			SpineObj.x = -SpineMgr.m_SpineAsset[EffectType].data.skeleton.x;
		}
		if( "y" in SpineMgr.m_SpineAsset[EffectType].data.skeleton )
		{
			SpineObj.y = -SpineMgr.m_SpineAsset[EffectType].data.skeleton.y;
		}
	}
	
	// 省略時は0番のキーのアニメーションを再生する
	if( typeof Anim !== "string" )
	{
		Anim = Object.keys(SpineMgr.m_SpineAsset[EffectType].data.animations)[0];
	}
	if( typeof isLoop !== "boolean" )
	{
		isLoop = false;
	}
	this.Play( Anim, isLoop );
	
	// m_ObjectにSpineを吊るす
	this.m_Object.addChild(SpineObj);
	
};

// エフェクトの削除
SpineObj.prototype.Destroy = function()
{
	this.m_TrackEntry = null;
	
	if( this.m_SpineObj != null )
	{
		this.m_SpineObj.destroy();
		this.m_SpineObj = null;
	}
	
	SpineMgr.Delete( this );
	
	this.super.Destroy.call( this );
};

SpineObj.prototype.Update = function(deltaTime)
{
	//　this.m_SpineObj.update(deltaTime)は描画時に呼ばれるから明示的に行う必要がない
}

SpineObj.prototype.Play = function( Anim, isLoop )
{
	// 前のトラックを消しておく
	this.m_SpineObj.state.clearTrack(0);
	
	// アニメーションの設定
	this.m_TrackEntry = this.m_SpineObj.state.setAnimation( 0, Anim, isLoop );
	
	// ポーズの初期化と更新
	this.m_SpineObj.skeleton.setToSetupPose();
	this.m_SpineObj.update(0);
}


// 再生は終了しているか？
SpineObj.prototype.isEnd = function()
{
	if( this.m_SpineObj == null )
	{
		return false;
	}
	
	return this.m_TrackEntry.isComplete();
};

// エフェクトの停止( true:停止, false:再生 )
SpineObj.prototype.Pause = function( isPause )
{
	if( this.m_SpineObj == null )
	{
		return;
	}
	
	if( isPause )
	{
		if( 0 < this.m_TrackEntry.timeScale )
		{
			this.m_PauseBackupTimeScale = this.m_TrackEntry.timeScale;
			this.m_TrackEntry.timeScale = 0;
		}
	}
	else
	{
		if( this.m_TrackEntry.timeScale <= 0 )
		{
			this.m_TrackEntry.timeScale = this.m_PauseBackupTimeScale;
		}
	}
	
};
