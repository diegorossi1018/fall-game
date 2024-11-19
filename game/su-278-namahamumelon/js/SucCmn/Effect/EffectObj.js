// EffectMgrから作成されるエフェクトのオブジェクト
var EffectObj =  function( Bank )
{
	this.super = SnlObject.prototype;
	SnlObject.call( this, Bank );
	
	this.m_Effect = null;
	this.m_EffectSize = null;
	this.m_EffectAnchor = null;
	this.m_EffectObjID = -1;
	this.m_IgnoreWorldScale = false;
};

EffectObj.IDCounter = 0;

// EffectObjはSnlObjectを基底に持つ
EffectObj.prototype = Object.create( SnlObject.prototype );

// エフェクトオブジェクトの作成
// EffectType 	: エフェクトタイプ（GameDefine.eEffect）
// PosX, PosY 	: エフェクトの位置
// Size			: エフェクトサイズ({x,y})
// Anchor		: エフェクトのアンカー({x,y})
// DispZ		: エフェクトの描画順(-1で親オブジェクト依存)
// Parent		: エフェクトの親オブジェクト
// isLoop		: エフェクトはループ再生するか？
EffectObj.prototype.Create = function ( EffectType, PosX, PosY, Size, Anchor, DispZ, Parent, isLoop )
{
	// エフェクト用データ
	if( Anchor == null )
	{
		Anchor = { x: 0, y: 0 };
	}
	
	this.m_Effect = null;
	this.m_EffectSize   = Size;
	this.m_EffectAnchor = Anchor;
	this.m_EffectObjID  = EffectObj.IDCounter;
	this.m_EffectType   = EffectType;
	this.m_isLoop = isLoop;
	EffectObj.IDCounter++;
	
	// エフェクト用ノードの作成
	this.CreateSprite( -1, PosX, PosY, 0, 0, DispZ, Parent );
	
	// エフェクトファイルのローディング開始
	if( EffectType.BankNo == EffectMgr.m_BaseBankNo )
	{
		var ImgFiles = EffectMgr.m_EffectImgs[EffectType.AdobeAnID];
		for( var i=0; i<ImgFiles.length; i++ )
		{
			SnlPixiMgr.LoadBankTextureOnes( EffectType.BankNo, ImgFiles[i] );
			
			SnlPixiMgr.BankTextureAddUseCount( EffectType.BankNo, ImgFiles[i] );
		}
	}
	else
	{
		this.CreateEffect();
	}
};

// エフェクトの削除
EffectObj.prototype.Destroy = function()
{
	if( this.m_Effect != null )
	{
		this.m_Effect.Destroy();
		this.m_Effect = null;
	}
	
	EffectMgr.DeleteEffectObj( this );
	
	if( this.m_EffectType.BankNo == EffectMgr.m_BaseBankNo )
	{
		var ImgFiles = EffectMgr.m_EffectImgs[this.m_EffectType.AdobeAnID];
		for( var i=0; i<ImgFiles.length; i++ )
		{
			SnlPixiMgr.BankTextureDecUseCount( this.m_EffectType.BankNo, ImgFiles[i] );
		}
	}
	
	this.super.Destroy.call( this );
};

// ロードされているかチェック(true:ロード終了,false:ロード中)
EffectObj.prototype.LoadingCheck = function()
{

	var isDone = true;

	if( this.m_EffectType.BankNo == EffectMgr.m_BaseBankNo )
	{
		var ImgFiles = EffectMgr.m_EffectImgs[this.m_EffectType.AdobeAnID];
		for( var i=0; i<ImgFiles.length; i++ )
		{
			if( SnlPixiMgr.LoadBankTextureOnes( this.m_EffectType.BankNo, ImgFiles[i] ) == null )
			{
				isDone = false;
			}
		}
	}
	
	if( isDone )
	{
		this.CreateEffect();
	}
	
	return isDone;
};

// 再生は終了しているか？
EffectObj.prototype.isEnd = function()
{
	if( this.m_Effect == null )
	{
		return false;
	}
	
	return this.m_Effect.isEnd;
};

// EffectMgrを使用してエフェクトの作成
EffectObj.prototype.CreateEffect = function()
{
	var PosX = 0;
	var PosY = 0;
	if( this.m_EffectSize != null )
	{
		if( this.m_IgnoreWorldScale )
		{
			PosX = this.m_EffectSize.x * this.m_EffectAnchor.x;
			PosY = this.m_EffectSize.y * this.m_EffectAnchor.y;
		}
		else
		{
			PosX = this.m_EffectSize.x * this.GetWorldScale().x * this.m_EffectAnchor.x;
			PosY = this.m_EffectSize.y * this.GetWorldScale().y * this.m_EffectAnchor.y;
		}
	}
	
	this.m_Effect = EffectMgr.CreateEffect( this.m_EffectType, -PosX, -PosY, this.m_isLoop, -1, this );
	
	
};

// エフェクトのアンカーを設定( Anchor:({x,y}), isIgnoreWorldScale:ワールドスケールを無視するか？)
EffectObj.prototype.SetAnchor = function( Anchor, isIgnoreWorldScale )
{
	if( typeof isIgnoreWorldScale == "undefined" )
	{
		isIgnoreWorldScale = false;
	}
	
	this.m_EffectAnchor = Anchor;
	this.m_IgnoreWorldScale = isIgnoreWorldScale;
	
	if( this.m_Effect != null )
	{
		var PosX = 0;
		var PosY = 0;
		
		if( this.m_EffectSize != null )
		{
			if( this.m_IgnoreWorldScale )
			{
				PosX = this.m_EffectSize.x * this.m_EffectAnchor.x;
				PosY = this.m_EffectSize.y * this.m_EffectAnchor.y;
			}
			else
			{
				PosX = this.m_EffectSize.x * this.GetWorldScale().x * this.m_EffectAnchor.x;
				PosY = this.m_EffectSize.y * this.GetWorldScale().y * this.m_EffectAnchor.y;
			}
		}
		
		this.m_Effect.SetPos( -PosX, -PosY );
	}
}

// 現在のアニメーションの位置を取得(0:開始位置、1:終了位置）
EffectObj.prototype.GetRate = function()
{
	if( this.m_Effect == null )
	{
		return;
	}
	return this.m_Effect.GetRate();
}

// エフェクトの子を検索
EffectObj.prototype.FindChild = function( name )
{
	if( this.m_Effect == null )
	{
		return null;
	}
	return this.m_Effect.FindChild( name );
}

// エフェクトの停止( true:停止, false:再生 )
EffectObj.prototype.Pause = function( isPause )
{
	if( this.m_Effect == null )
	{
		return;
	}
	this.m_Effect.Pause( isPause );
	
};

// 再生終了後も停止状態で表示を続けるか？(true:表示する、false:表示しない)
EffectObj.prototype.VisibleAfterEnd = function( VisibleAfterEnd )
{
	this.m_Effect.m_VisibleAfterEnd = VisibleAfterEnd;
};
