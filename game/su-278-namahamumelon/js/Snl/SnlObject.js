/**
 * @file 	SnlObject.js
 * @brief 	描画用オブジェクト（画像/テキスト）クラス
 * @author	D.Hara
 */
var SnlObject =  function( Bank )
{
	// オブジェクト本体（テキストorスプライト)
	this.m_Object		= null;
	
	// テキストか？
	this.m_isText		= false;
	
	// 画像バンク番号
	if( Bank == null || Bank < 0 )
	{
		this.m_BankNo = 0;
	}
	else
	{
		this.m_BankNo = Bank;
	}
	
	// 画像番号
	this.m_TextureNo	= -1;
	
	// フォント名
	this.m_FontName		= "Arial";
	// フォント情報(大きさ、太字など）
	this.m_StyleText	= null;
	
	
	// 仮想画面上のポジション
	this.m_Pos			= { x:0, y:0 };
	this.m_Scale		= { x:1, y:1 };
	this.m_BaseSize		= { x:0, y:0 };
	
	this.m_DispZ		= 0;
	
	// 親オブジェクト
	this.m_Parent		= null;
	
	// 子オブジェクト
	this.m_Child		= null;
	
	// ImageMgr
	this.m_ImageMgr = null;
	
	// ロードするImageのパス
	this.m_ImagePath = null;
	this.m_ImageUseCountAddDone = false;
	
	this.m_IdleImageMgr = false;
	
	this.m_Mask = null;
	this.m_MaskTextureNo = -1;
	
	this.m_isIgnoreRaycast = false;
	
	this.m_AliganData = null;
};

// デフォルトの影をつけるか？
SnlObject.isSetDefaultShadow = false;

// テキスト揃え定義
SnlObject.eTextAligan =
{
	// 旧指定(互換用：Centerだけアンカーの上じゃなくて中央だから微妙に使い辛い)
	Left 	: 0,		// Left   = TopLeft
	Center 	: 1,		// Center = CenterCenter 
	Right	: 2,		// right  = TopRight

	// 新指定(テキスト揃え+アンカーXYの両方を指定できる)
	TopLeft   		: 3,	TopCenter 		: 4,	TopRight  		: 5,
	CenterLeft		: 6,	CenterCenter	: 7,	CenterRight		: 8,
	BottomLeft		: 9,	BottomCenter	: 10,	BottomRight		: 11,	
	
	// 新指定の短縮版
	TL : 3,	TC : 4,	 TR : 5,
	CL : 6,	CC : 7,	 CR : 8,
	BL : 9,	BC : 10, BR : 11,
	
	// 新指定をLayoutと同一の名前で指定したい時用
	LU: 3,	CU: 4,	RU: 5,
	LC: 6,	/*CC: 7,*/RC: 8,
	LD: 9,	CD: 10,	RD: 11,
	
	// 小文字版も用意しておく
	left	: 0,
	center	: 1,
	right	: 2,
		
	topleft   		: 3,	topcenter 		: 4,	topright  		: 5,
	centerleft		: 6,	centercenter	: 7,	centerright		: 8,
	bottomleft		: 9,	bottomcenter	: 10,	bottomright		: 11,	
		
	tl : 3,	tc : 4,	 tr : 5,
	cl : 6,	cc : 7,	 cr : 8,
	bl : 9,	bc : 10, br : 11,

	lu: 3,	lc: 6,	ld: 9,
	cu: 4,	/*cc: 7,*/cd: 10,
	ru: 5,	rc: 8,	rd: 11,
};

SnlObject.TextCenterAnchorY = 0.5;

SnlObject.TextAliganData =
[
	// 古いのと互換用
	{ style: "left",	x: 0,   y:0		}, 	// Left
	{ style: "center",	x: 0.5, y:SnlObject.TextCenterAnchorY 	},	// Center
	{ style: "right",	x: 1,   y:0		},	// Right
	
	// 新指定
	{ style: "left",	x: 0,   y:0		}, 	// Top-Left
	{ style: "center",	x: 0.5, y:0 	},	// Top-Center
	{ style: "right",	x: 1,   y:0		},	// Top-Right
	{ style: "left",	x: 0,   y:SnlObject.TextCenterAnchorY	}, 	// Center-Left
	{ style: "center",	x: 0.5, y:SnlObject.TextCenterAnchorY 	},	// Center-Center
	{ style: "right",	x: 1,   y:SnlObject.TextCenterAnchorY	},	// Center-right
	{ style: "left",	x: 0,   y:1		}, 	// Bottom-Left
	{ style: "center",	x: 0.5, y:1 	},	// Bottom-Center
	{ style: "right",	x: 1,   y:1		},	// Bottom-right
	
];

SnlObject.prototype = 
{
	// テクスチャバンクの設定
	SetBank : function( Bank )
	{
		this.m_BankNo = Bank;
	},
		
	isIgnoreRaycast : function( )
	{
		return this.m_isIgnoreRaycast;
	},
		
	SetIgnoreRaycast : function( isIgnore )
	{
		this.m_isIgnoreRaycast = isIgnore;
	},
		
	SetBaseSize : function( w, h )
	{
		this.m_BaseSize.x = w;
		this.m_BaseSize.y = h;
	},
	
	// テクスチャバンクの設定を行い、スプライトとしてオブジェクトを作成する
	CreateSprite_SetBank : function( Bank, TextureNo, PosX, PosY, AnchorX, AnchorY, DispZ, Parent )
	{
		this.SetBank( Bank );
		this.CreateSprite( TextureNo, PosX, PosY, AnchorX, AnchorY, DispZ, Parent );
	},
	
	// バンク番号とテクスチャ番号を元にスプライトとしてオブジェクトを作成する
	CreateSprite : function( TextureNo, PosX, PosY, AnchorX, AnchorY, DispZ, Parent )
	{
		this.m_Object = SnlPixiMgr.CreateSprite( this.m_BankNo, TextureNo, PosX, PosY, AnchorX, AnchorY, DispZ );
		this.m_isText = false;
		this.m_TextureNo = TextureNo;
		
		SnlPixiMgr.BankTextureAddUseCount( this.m_BankNo, TextureNo );
		
		this.m_BaseSize.x = 0;
		this.m_BaseSize.y = 0;		
		
		this.CreateCore( PosX, PosY, DispZ, TextureNo, Parent );
	},
	
	// PIXI.Textureを元にスプライトとしてオブジェクトを作成する
	CreateSpriteFromImg : function( Texture, TextureInfo, PosX, PosY, AnchorX, AnchorY, DispZ, Parent )
	{
		
		
		this.m_Object = SnlPixiMgr.CreateSpriteFromImg( Texture, PosX, PosY, AnchorX, AnchorY, DispZ );
		this.m_isText = false;
		//this.m_TextureNo = TextureNo;
		if( TextureInfo != null )
		{
			if( typeof TextureInfo.w !== "undefined" )
			{
				this.m_BaseSize.x = TextureInfo.w;
				this.m_BaseSize.y = TextureInfo.h;
			}
			else
			{
				this.m_BaseSize.x = TextureInfo.x;
				this.m_BaseSize.y = TextureInfo.y;
			}
		}
		
		this.CreateCore( PosX, PosY, DispZ, -1, Parent );
	},
		
	CreateSpriteFromVideo : function( Video, TextureInfo, PosX, PosY, AnchorX, AnchorY, DispZ, Parent )
	{
		this.m_Object = SnlPixiMgr.CreateSpriteFromVideo( Video, PosX, PosY, AnchorX, AnchorY, DispZ );
		this.m_isText = false;
		//this.m_TextureNo = TextureNo;
		if( TextureInfo != null )
		{
			if( typeof TextureInfo.w !== "undefined" )
			{
				this.m_BaseSize.x = TextureInfo.w;
				this.m_BaseSize.y = TextureInfo.h;
			}
			else
			{
				this.m_BaseSize.x = TextureInfo.x;
				this.m_BaseSize.y = TextureInfo.y;
			}
		}
		
		this.CreateCore( PosX, PosY, DispZ, -1, Parent );
	},
	
	// PIXI.グラフィックでオブジェクトを作成する
	CreateSpriteGraphics : function(TextureInfo, PosX, PosY, AnchorX, AnchorY, DispZ, Parent)
	{
		this.m_Object = SnlPixiMgr.CreateSpriteGraphics(PosX, PosY, AnchorX, AnchorY, DispZ);
		this.m_isText = false;
		//this.m_TextureNo = TextureNo;
		if (TextureInfo != null)
		{
			if( typeof TextureInfo.w !== "undefined" )
			{
				this.m_BaseSize.x = TextureInfo.w;
				this.m_BaseSize.y = TextureInfo.h;
			}
			else
			{
				this.m_BaseSize.x = TextureInfo.x;
				this.m_BaseSize.y = TextureInfo.y;
			}
		}

		this.CreateCore(PosX, PosY, DispZ, -1, Parent);
		this.m_is_graphics = true; //グラフィック判定
	},
		
	// SnlImageMgrと連携してオブジェクトを作成する
	CreateSpriteFromImageMgr : function( ImageMgr, ImagePath, DummyTextureBank, DummyTextureNo, PosX, PosY, AnchorX, AnchorY, DispZ, Parent )
	{
		this.SetBank( DummyTextureBank );
		this.m_ImageMgr = ImageMgr;
		this.m_ImagePath = ImagePath;
		
		this.m_isText = false;
		this.m_TextureNo = DummyTextureNo;
		
		
		
		if( ImageMgr.GetTexture( ImagePath ) != null )
		{
			this.m_ImageUseCountAddDone = true;
			this.m_ImageMgr.AddUseCount( this.m_ImagePath );
			this.m_Object = SnlPixiMgr.CreateSpriteFromImg( ImageMgr.GetTexture( ImagePath ), PosX, PosY, AnchorX, AnchorY, DispZ );
			this.m_BaseSize = ImageMgr.GetImageSize( ImagePath );
		}
		else
		{
			this.m_ImageUseCountAddDone = true;
			this.m_ImageMgr.AddUseCount( this.m_ImagePath );
			this.m_IdleImageMgr = true;
			this.m_Object = SnlPixiMgr.CreateSprite( this.m_BankNo, DummyTextureNo, PosX, PosY, AnchorX, AnchorY, DispZ );
			SnlPixiMgr.AddImageCheckObj( this );
		}
		
		this.CreateCore( PosX, PosY, DispZ, DummyTextureNo, Parent );
	},
		
	// SnlImageMgrのロードをチェック
	CheckImageMgr : function()
	{
		if( this.m_ImageMgr == null )
		{
			return true;
		}
		
		if( !this.m_IdleImageMgr )
		{
			return true;
		}
		
		var tex = this.m_ImageMgr.GetTexture( this.m_ImagePath );
		if( tex != null )
		{
			this.m_IdleImageMgr = false;
			this.ChangeTexture( this.m_ImagePath );
			return true;
		}
		
		return false;
	},
	
	// フォント情報を設定しテキストとしてオブジェクトを作成する
	CreateText_SetFont : function( TextStr, FontName, FontSize, isBold, Color, Aligan, PosX, PosY, DispZ, Parent )
	{
		this.m_FontName = FontName;
		this.CreateText( TextStr, FontSize, isBold, Color, Aligan, PosX, PosY, DispZ, Parent );
	},
	
	// テキストスタイルの変更(これだけでは更新されない)
	ChangeTextStyle : function( key, data )
	{
		this.m_StyleText[key] = data;
	},
	
	// テキストスタイルの表示への反映
	FlashTextStyle : function()
	{
		if( SnlPixiMgr.PixiVersion <= SnlPixiMgr.ePixiVersion.V4 )
		{
			this.m_Object.setStyle( this.m_StyleText );
		}
		else
		{
			this.m_Object.style = this.m_StyleText;
			this.m_Object.updateText(true);
		}
	},
	
	// wordWrap
	SetWordWrap : function( isEnable, WordWrapWidth )
	{
		this.ChangeTextStyle( "wordWrap" , isEnable );
		if( isEnable )
		{
			this.ChangeTextStyle( "wordWrapWidth", WordWrapWidth );
			this.ChangeTextStyle( "breakWords",  true );
		}
		this.FlashTextStyle();
	},
		
		
	
	// ドロップシャドウの適用
	SetTextDropShadow : function( Color, Alpha, Angle, Blur, Distance )
	{
		if( Color == null )	Color = '#ff1717';
		if( Alpha == null ) Alpha = 0.9;
		if( Angle == null ) Angle = 0.5;
		if( Blur == null ) Blur = 3;
		if( Distance == null ) Distance = 2;
		
		this.ChangeTextStyle( "dropShadow", true );
		this.ChangeTextStyle( "dropShadowAlpha", Alpha );
		this.ChangeTextStyle( "dropShadowAngle", Angle );
		this.ChangeTextStyle( "dropShadowBlur", Blur );
		this.ChangeTextStyle( "dropShadowColor", Color );
		this.ChangeTextStyle( "dropShadowDistance", Distance );
		
		this.FlashTextStyle();
	},
		
	// アウトラインの適用
	SetTextOutline : function( Color, Thickness, LineJoin )
	{
		if( Color == null )	Color = '#ffffff';
		if( Thickness == null ) Thickness = 3;
		if( LineJoin == null ) LineJoin = "round";
		
		this.ChangeTextStyle( "lineJoin", LineJoin );
		this.ChangeTextStyle( "stroke", Color );
		this.ChangeTextStyle( "strokeThickness", Thickness );
		
		this.FlashTextStyle();
	},
	
	// テキストとしてオブジェクトを作成する
	CreateText : function( TextStr, FontSize, isBold, Color, Aligan, PosX, PosY, DispZ, Parent )
	{
		this.m_StyleText = {
			font:'', 
			fill:'', 
			align:'',
	   	};
	   	
	   	if( SnlObject.isSetDefaultShadow )
	   	{
	   		this.m_StyleText["dropShadow"] = true;
		    this.m_StyleText["dropShadowAlpha"] = 0.9;
		    this.m_StyleText["dropShadowAngle"] = 0.5;
		    this.m_StyleText["dropShadowBlur"] = 3;
		    this.m_StyleText["dropShadowColor"] = '#000000';
		    this.m_StyleText["dropShadowDistance"] = 2;
	   	}
		   
		if( Color.toLowerCase() == "black"  || Color.toLowerCase() == "#000000")
		{
			this.m_StyleText.dropShadowColor = '#ffffff';
		}
		
		// FontSize
		if( SnlPixiMgr.PixiVersion <= SnlPixiMgr.ePixiVersion.V4 )
		{
			if( !isBold )
			{
				this.m_StyleText.font = String( FontSize ) +  "px "+this.m_FontName;
			}
			else
			{
				this.m_StyleText.font = "bold " + String( FontSize ) +  "px "+this.m_FontName;
			}			
			
		}
		else
		{
			this.m_StyleText.fontFamily = this.m_FontName;
			this.m_StyleText.fontSize = FontSize;
			if( isBold )
			{
				this.m_StyleText.fontWeight = "bold";
			}
			// this.m_StyleText = new PIXI.TextStyle(this.m_StyleText)
		}
		
		// Color
		this.m_StyleText.fill = Color;
		
		// Aliganが文字列ならeTextAliganに変換
		if( typeof Aligan == "string" )
		{
			Aligan = SnlObject.eTextAligan[Aligan.toLowerCase()];
			if( typeof Aligan == "undefined" )
			{
				Aligan = SnlObject.eTextAligan.Left;
			} 
		}
		
		// Aliganがオブジェクト（Aligan構造体）ならデータをそのまま使う
		var AliganData = null;
		if( typeof Aligan == "object" )
		{
			AliganData = Aligan;
			
			// 力技コピー
			this.m_AliganData = JSON.parse(JSON.stringify(AliganData)); 
		}
		else
		{
			AliganData = SnlObject.TextAliganData[Aligan];
		}

		
		var AnchorX = AliganData.x;
		var AnchorY = AliganData.y;
		this.m_StyleText.align = AliganData.style;

		this.m_isText = true;
		this.m_Object = SnlPixiMgr.CreateText( TextStr, this.m_StyleText, PosX, PosY, AnchorX, AnchorY, DispZ );
		
		this.m_BaseSize.x = 0;
		this.m_BaseSize.y = 0;
		
		this.CreateCore( PosX, PosY, DispZ, -1, Parent );
	},
		
	// テキストスタイルの連想配列を渡してテキストの作成
	CreateText_SetStyle : function( TextStr, StyleText, PosX, PosY, DispZ, Parent )
	{
		this.m_StyleText = JSON.parse(JSON.stringify(StyleText));
	   	
		// Aligan
		var AnchorX = 0;
		var AnchorY = 0;
		
		switch( this.m_StyleText.align )
		{
			case "left":
			break;
			
			case "center":
				AnchorX = 0.5;
				AnchorY = 0.5;
			break;
			
			case "right":
				AnchorX = 1.0;
				AnchorY = 0.0;
			break;
		}
		
		this.m_isText = true;
		this.m_Object = SnlPixiMgr.CreateText( TextStr, this.m_StyleText, PosX, PosY, AnchorX, AnchorY, DispZ );
		
		this.m_BaseSize.x = 0;
		this.m_BaseSize.y = 0;
		
		this.CreateCore( PosX, PosY, DispZ, -1, Parent );
	},
	
	// オブジェクト作成共通処理
	CreateCore : function( PosX, PosY, DispZ, TextureNo, Parent )
	{
		this.m_Pos.x = PosX;
		this.m_Pos.y = PosY;
		this.m_DispZ = DispZ;
		
		//this.m_BaseSize.x = 0;//this.m_Object.width / SnlPixiMgr.m_DispRatio;
		//this.m_BaseSize.y = 0;//this.m_Object.height / SnlPixiMgr.m_DispRatio;
		
		if( 0 <= TextureNo )
		{
			this.m_BaseSize = SnlPixiMgr.GetTextureSize( this.m_BankNo, TextureNo );
		}
		if( !this.m_isText )
		{
			this.m_Object.SnlObject = this;
		}	
		this.SetScale( 1, 1 );
		
		// Parentがいて、DispZが0未満の場合、親を設定する
		if( Parent != null && DispZ < 0 )
		{
			if( Parent.SetChild == null && Parent.m_Object.SetChild != null )
			{
				this.m_Parent = Parent.m_Object;
				this.m_Parent.SetChild( this );
			}
			else
			{
				this.m_Parent		= Parent;
				this.m_Parent.SetChild( this );
			}
		}
		else
		{
			this.m_Parent		= null;
		}
	},
	
	// 渡されたオブジェクトを子供として登録
	SetChild : function( Child, Index )
	{
		if( this.m_Child == null )
		{
			this.m_Child = [];
		}
		
		
		if (typeof Index === "undefined") 
		{
			Index = this.m_Child.length;
		}
		
		Child.m_Parent = this;
		this.m_Child.splice( Index, 0, Child );
		this.m_Object.addChildAt( Child.GetObject(), Index );
		
	},
		
	GetChild : function( Idx )
	{
		if( this.m_Child == null )
		{
			return null;
		}
		
		if( this.m_Child.length <= Idx || Idx < 0 )
		{
			return null;
		}
		
		return this.m_Child[Idx];
	},
	
	// 渡されたオブジェクトが自分の子供いる場合はそれを削除
	DeadChild : function( Child )
	{
		if( this.m_Child == null )
		{
			return;
		}
		
		for( var i=0; i<this.m_Child.length; i++ )
		{
			if( this.m_Child[i] == Child )
			{
				this.m_Object.removeChild( this.m_Child[i].GetObject() );
				this.m_Child.splice( i, 1 );
				return;
				
				//this.m_Child[i] = null;
			}
			
		}
	},
	
	//PIXIグラフィック用の簡易デストロイ
	DestroyGraphics : function()
	{
		if ("m_is_graphics" in this)
		{
			if (this.m_Object != null && this.m_is_graphics == true)
			{
				if ("destory" in this.m_Object)
				{
					this.m_Object.destroy();
					this.m_is_graphics = false;
				}
			}
		}
	},
	
	// 終了処理
	Destroy : function()
	{
		SnlPixiMgr.RemoveImageCheckObj( this );
		
		// 子がいる場合、子も殺せ
		if( this.m_Child != null )
		{
			for( var i=0; i<this.m_Child.length; i++ )
			{
				if( this.m_Child[i] != null )
				{
					this.m_Child[i].Destroy();
					this.m_Child[i] = null;
				}
			}
			
			this.m_Child = null;
		}
		
		// 親がいる場合、親とのリンクを切る
		if( this.m_Parent != null )
		{
			this.m_Parent.DeadChild( this );
			this.m_Parent = null;
		}
		
		this.DestroyMask();
		
		// Stageへのリンクを切る
		if( 0 <= this.m_DispZ )
		{
			SnlPixiMgr.ReleaseZ( this.m_Object, this.m_DispZ );
		}
		
		// 全部nullで処分
		if( !this.m_isText )
		{
			if( this.m_Object != null )
			{
				this.m_Object.SnlObject = null;
				this.m_Object.texture = null;
			}
			
			if( this.m_ImageMgr != null )
			{
				if( this.m_ImageUseCountAddDone )
				{
					this.m_ImageUseCountAddDone = false;
					this.m_ImageMgr.DecUseCount( this.m_ImagePath );
					this.m_ImageMgr = null;
				}
			}
			else
			{
				SnlPixiMgr.BankTextureDecUseCount( this.m_BankNo, this.m_TextureNo );
			}
		}
		
		if( this.m_Object != null && SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
		{
			this.m_Object.destroy();
			this.m_Object = null;
		}
		

		this.m_Object		= null;
		this.m_StyleText	= null;
		this.m_Pos			= null;
		this.m_Scale		= null;
		this.m_BaseSize		= null;
		this.m_AliganData = null;
		
	},
		
	CreateMask : function()
	{
		this.DestroyMask();
		
		this.m_Mask = new PIXI.Graphics();
		this.m_Object.mask = this.m_Mask;
		this.m_Object.addChild( this.m_Mask );
		
		return this.m_Mask;
	},
		
	CreateMaskFromTexture : function( TextureNo, PosX, PosY, AnchorX, AnchorY )
	{
		this.m_Mask = SnlPixiMgr.CreateSprite( this.m_BankNo, TextureNo, PosX, PosY, AnchorX, AnchorY, -1 );
		SnlPixiMgr.BankTextureAddUseCount( this.m_BankNo, TextureNo );
		this.m_MaskTextureNo = TextureNo;
		
		this.m_Object.mask = this.m_Mask;
		this.m_Object.addChild( this.m_Mask );
	},
		
	CalcMaskPos : function()
	{/*
		if( this.m_Mask == null )
		{
			return;
		}
		var Pos = this.GetWorldPos();
		var Scale = this.GetWorldScale();
		
		this.m_Mask.x = Pos.x;
		this.m_Mask.y = Pos.y;
		
		this.m_Mask.scale.x = Scale.x;
		this.m_Mask.scale.y = Scale.y;
		
		this.m_Mask.rotation = this.m_Object.rotation;*/
	},
	
	DestroyMask : function()
	{
		if( this.m_isText )
		{
			return;
		}
		if( this.m_Object != null )
		{
			this.m_Object.mask = null;
		}
		
		if( this.m_Mask == null )
		{
			return;
		}
		
		this.m_Mask.destroy();
		this.m_Mask = null;
		
		if( 0 <= this.m_MaskTextureNo )
		{
			SnlPixiMgr.BankTextureDecUseCount( this.m_BankNo, this.m_MaskTextureNo );
			this.m_MaskTextureNo = -1;
		}
	},
		
	RefreshParent : function()
	{
		if( this.m_Parent != null )
		{
			this.m_Parent.DeadChild( this );
			this.m_Parent.SetChild( this );
		}
		else
		{
			
			this.SetZ( this.m_DispZ );
		}
	},
		
	SetParent : function( Parent )
	{
		if( Parent == null )
		{
			return;
		}

		if( this.m_Parent != null )
		{
			this.m_Parent.DeadChild( this );
		}
		else
		{
			if( 0 <= this.m_DispZ )
			{
				SnlPixiMgr.ReleaseZ( this.m_Object, this.m_DispZ );
			}
		}
		
		this.m_Parent = Parent;
		this.m_DispZ = -1;
		Parent.SetChild(this);
	},
	
	GetRect : function( scl )
	{
		var Scale = this.GetWorldScale();
		if( scl == null )
		{
		}
		else 
		{
			if( typeof scl === "object" )
			{
				Scale.x *= scl.x;
				Scale.y *= scl.y;
			}
			else
			{
				Scale.x *= scl;
				Scale.y *= scl;
			}
		}
		

		var WorldPos = this.GetWorldPos();
		
		var rect = 
		{
			x : WorldPos.x - this.m_BaseSize.x * this.m_Object.anchor.x * Scale.x,
			y : WorldPos.y - this.m_BaseSize.y * this.m_Object.anchor.y * Scale.y,
			w : this.m_BaseSize.x * Scale.x,
			h : this.m_BaseSize.y * Scale.y
		};
		return rect;
	},
	
	// シングルだろうが、マルチだろうがとりあえずtrue,falseで返す
	InputHitCheck2 : function( JdgScale, RaycastCheck, isDownCheck )
	{
		var r = this.InputHitCheck( JdgScale, RaycastCheck, isDownCheck );
		
		if( SnlPixiMgr.m_TouchMode && SnlPixiMgr.m_MultiTouch )
		{
			if( r < 0 )
			{
				return false;
			}
			return true;
		}
		
		return r;
		
	},
	
	// マウス（タッチ）位置と画像の当たり判定を行う
	InputHitCheck : function( JdgScale, RaycastCheck, isDownCheck )
	{
		if( JdgScale == null )
		{
			JdgScale = 1;
		}
		
		if( RaycastCheck == null )
		{
			RaycastCheck = false;
		}
		
		if( isDownCheck == null )
		{
			isDownCheck = false;
		}
		
		if( SnlPixiMgr.m_TouchMode && SnlPixiMgr.m_MultiTouch )
		{
			for( var i=0; i<SnlPixiMgr.m_TouchID.length; i++ )
			{
				if( SnlPixiMgr.m_TouchID[i] == -1 )
				{
					continue;
				}
				
				if( !isDownCheck || SnlPixiMgr.m_TouchStep[i] == SnlPixiMgr.eTouchStep.Down )
				{
					if( SnlMath.HitBox( this.GetRect( JdgScale ), SnlPixiMgr.m_TouchPos[i] ) )
					{
						if( RaycastCheck )
						{
							if( SnlPixiMgr.RayCastCheck( this.m_Object, SnlPixiMgr.m_TouchPos[i] ) != SnlPixiMgr.eRayCastResult.Success )
							{
								continue;
							}
						}
						return i;
					}
				}
			}
		}
		else
		{
			if( !isDownCheck || SnlPixiMgr.m_MouseDown )
			{
			
				if( SnlMath.HitBox( this.GetRect( JdgScale ),SnlPixiMgr.m_MousePos ) )
				{
					if( RaycastCheck )
					{
						if( SnlPixiMgr.RayCastCheck( this.m_Object, SnlPixiMgr.m_MousePos ) != SnlPixiMgr.eRayCastResult.Success )
						{
							return false;
						}
					}
					return true;
				}
			}
			
			return false;
		}
		
		return -1;
	},
		
	HitCheck : function( Pos, JdgScale, RaycastCheck )
	{
		if( JdgScale == null )
		{
			JdgScale = 1;
		}
		
		if( RaycastCheck == null )
		{
			RaycastCheck = false;
		}
		
		if( SnlMath.HitBox( this.GetRect( JdgScale ), Pos ) )
		{
			if( RaycastCheck )
			{
				if( SnlPixiMgr.RayCastCheck( this.m_Object, Pos ) != SnlPixiMgr.eRayCastResult.Success )
				{
					return false;
				}
			}
			return true;
		}
		
		return false;
	},
	
	/*HitCheck : function( Obj ) =
	{
	},*/
	
	
	SetPos : function( x, y )
	{
		this.m_Pos.x = x;
		this.m_Pos.y = y;
		
		this.m_Object.x = x * SnlPixiMgr.m_DispRatio;
		this.m_Object.y = y * SnlPixiMgr.m_DispRatio;
		
		this.CalcMaskPos();
	},
		
	AddPos : function( x, y )
	{
		this.m_Pos.x += x;
		this.m_Pos.y += y;
		
		this.m_Object.x = this.m_Pos.x * SnlPixiMgr.m_DispRatio;
		this.m_Object.y = this.m_Pos.y * SnlPixiMgr.m_DispRatio;
		
		this.CalcMaskPos();
	},
		
	SetPosX : function( x )
	{
		this.m_Pos.x = x;
		
		this.m_Object.x = x * SnlPixiMgr.m_DispRatio;
		
		this.CalcMaskPos();
	},
		
	SetPosY : function( y )
	{
		this.m_Pos.y = y;
		
		this.m_Object.y = y * SnlPixiMgr.m_DispRatio;
		
		this.CalcMaskPos();
	},
	
	//　ローカル位置の取得
	GetPos : function()
	{
		return this.m_Pos;
	},
	
	//　親の位置を考慮し座標の取得
	GetWorldPos : function()
	{
		if( this.m_Parent != null && this.m_DispZ < 0 )
		{
			var WPos = {x:0,y:0};
			var PWPos = this.m_Parent.GetWorldPos();
			var PWRot = this.m_Parent.GetWorldRot() * SnlMath.DegToRad;
			var Scl = this.m_Parent.GetWorldScale();
			
			var x = this.m_Pos.x * Scl.x;
			var y = this.m_Pos.y * Scl.y;
			
			var x2 = Math.cos(PWRot) * x - Math.sin(PWRot) * y;
			var y2 = Math.sin(PWRot) * x + Math.cos(PWRot) * y;
			
			WPos.x = PWPos.x + x2;
			WPos.y = PWPos.y + y2;
			
			return WPos;
			
			/*
			var p = null;
			p =this.m_Object.getGlobalPosition();
			
			return p;
			*/
		}
		
		return this.m_Pos;
	},
		
	GetWorldRot : function()
	{
		if( this.m_Parent != null && this.m_DispZ < 0 )
		{
			var PRot = this.m_Parent.GetWorldRot();
			var WRot = PRot + this.m_Object.rotation * SnlMath.RadToDeg;
			
			return WRot;
		}
		
		return this.m_Object.rotation * SnlMath.RadToDeg;
	},
		
	// 世界のスケール
	GetWorldScale : function()
	{
		var WScale = { x:0, y:0 };
		
		if( this.m_Parent != null && this.m_DispZ < 0 )
		{
			var PScale = this.m_Parent.GetWorldScale();
			
			
			WScale.x = PScale.x * this.m_Scale.x;
			WScale.y = PScale.y * this.m_Scale.y;
			
			/*if( WScale.x <= 0 || WScale.y <= 0 )
			{
				console.log( "スケールエラー" );
			}*/
			
			
		}
		else
		{
			WScale.x = this.m_Scale.x;
			WScale.y = this.m_Scale.y;
		}
		
		
		
		return WScale;

	},
	
	SetZ : function( z )
	{
		this.m_DispZ = z;
		SnlPixiMgr.PixiObjSetZ( this.m_Object, z );
	},
	
	SetAnchor : function( x, y )
	{
		this.m_Object.anchor.x = x;
		this.m_Object.anchor.y = y;
	},
	
	SetScale : function( x, y )
	{
		this.m_Scale.x = x;
		this.m_Scale.y = y;
		

		this.m_Object.scale.x = SnlPixiMgr.m_DispRatio * this.m_Scale.x;
		this.m_Object.scale.y = SnlPixiMgr.m_DispRatio * this.m_Scale.y;
		
		this.CalcMaskPos();

	},
		
	AddScale : function( x, y )
	{
		this.m_Scale.x += x;
	  	this.m_Scale.y += y;
	  
	  	this.m_Object.scale.x = SnlPixiMgr.m_DispRatio * this.m_Scale.x;
	  	this.m_Object.scale.y = SnlPixiMgr.m_DispRatio * this.m_Scale.y;
	  	
	  	this.CalcMaskPos();
	},
		
	GetScale : function()
	{
		return this.m_Scale;
	},
		
	SetRot : function( DegRot )
	{

		this.m_Object.rotation = DegRot * SnlMath.DegToRad;
		
		this.CalcMaskPos();

	},
		
	AddRot : function( Deg )
	{
		this.m_Object.rotation += Deg * SnlMath.DegToRad;
		this.CalcMaskPos();
	},
		
	GetRot : function( )
	{

		return this.m_Object.rotation * SnlMath.RadToDeg;

	},
	
	SetVisible : function( isVisible )
	{
		this.m_Object.visible = isVisible;
	},
	
	GetVisible : function( )
	{
		return this.m_Object.visible;
	},
	
	// テキスト文字列の設定
	SetText : function( text )
	{
		if( !this.m_isText )
		{
			return;
		}
		
		if( typeof text !== "string" )
		{
			text = "" + text;
		}
		
		if( SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
		{
			if( this.m_Object.text == text )
			{
				return;
			}
			
			this.m_Object.text = text;
		}
		else
		{
			this.m_Object.setText( text );
		}
	},
		
	// レイアウトから生成されたテキストに複数行のテキスト設定をする
	// isCenterH true:縦はレイアウトテキスト矩形の中央揃え false:縦はレイアウトテキスト矩形の上揃え
	SetTextLayoutMultiLineText : function( text, isCenterH )
	{
		if( typeof isCenterH == "undefined" )
		{
			isCenterH = false;
		}
		
		// 中央揃えなら標準におまかせ、レイアウトから作られてないなら標準
		if( isCenterH || this.layout_data == null )
		{
			this.SetText( text );
			return;
		}
		
		// レイアウト上の文字列の行数
		var LayoutLines = SnlMath.Big( this.layout_data.text_data.content.split("\n").length, this.layout_data.text_data.content.split("\r").length ); 
		
		// 新規文字列の行数
		var NewTextLines = SnlMath.Big( text.split("\n").length, text.split("\r").length );
		
		// レイアウト上の行数と新規文字列の行数が同じなら補正しない
		if( LayoutLines == NewTextLines )
		{
			this.SetAnchor( this.m_AliganData.x, this.m_AliganData.y );
			this.SetText( text );
			return;
		}
		
		var AncY = ( LayoutLines ) / ( NewTextLines * 2 );
		this.SetAnchor( this.m_AliganData.x, AncY );
		this.SetText( text );
		
	},
		
	ChangeTexture : function( TextureNo )
	{
		if( this.m_isText )
		{
			return;
		}
		
		if( this.m_ImageMgr == null )
		{
			SnlPixiMgr.BankTextureDecUseCount( this.m_BankNo, this.m_TextureNo );
			SnlPixiMgr.ChangeTexture( this.m_Object, this.m_BankNo, TextureNo );
			SnlPixiMgr.BankTextureAddUseCount( this.m_BankNo, TextureNo );
		}
		else
		{
			if( this.m_ImagePath != TextureNo && this.m_ImagePath != null )
			{
				if( this.m_ImageUseCountAddDone )
				{
					this.m_ImageUseCountAddDone = false;
					this.m_ImageMgr.DecUseCount( this.m_ImagePath );
				}
			}
			
			this.m_ImagePath = TextureNo;
			var tex = this.m_ImageMgr.GetTexture( this.m_ImagePath );
			if( tex != null )
			{
				if( this.m_ImageUseCountAddDone == false )
				{
					this.m_ImageUseCountAddDone = true;
					this.m_ImageMgr.AddUseCount( this.m_ImagePath );
				}
				this.m_IdleImageMgr = false;
				this.m_Object.texture = tex;
				this.m_BaseSize = this.m_ImageMgr.GetImageSize( this.m_ImagePath );
			}
			else
			{
				this.m_IdleImageMgr = true;
			}
		}
		
		this.m_TextureNo = TextureNo;
	},
		
	GetTextureNo : function()
	{
		return this.m_TextureNo;
	},
		
	GetObject : function()
	{
		return this.m_Object;
	},
	
	GetAlpha : function(  )
	{
		return this.m_Object.alpha;
	},
		
	AddAlpha : function( a )
	{
		this.SetAlpha( this.m_Object.alpha + a );
	},
	
	// アルファを0-1で設定
	SetAlpha : function( a )
	{
		if( 1 < a )
		{
			a = 1;
		}
		if( a < 0 )
		{
			a = 0;
		}
		
		
		this.m_Object.alpha = a;
	},
	
	
	// ブレンドモードをPIXI.blendModes.から指定
	// ブレンドモードを指定することで加算合成や乗算合成等が行える
	SetBlendMode : function( blendMode )
	{

		this.m_Object.blendMode = blendMode;
	},
	
	// テキスト色変え
	ChangeTextColor : function( color )
	{
		if( !this.m_isText )
		{
			return;
		}
		
		this.m_StyleText.fill = color;
		
		if( SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
		{
			this.m_Object.style = this.m_StyleText;
		}
		else
		{
			this.m_Object.FlashTextStyle();
		}
	},
	
	// テクスチャの色設定を取得
	GetTextureColor : function()
	{
		var r = ( this.m_Object.tint & 0x00FF0000 ) >> 16;
		var g = ( this.m_Object.tint & 0x0000FF00 ) >> 8;
		var b = ( this.m_Object.tint & 0x000000FF );
		
		return { r:r, g:g, b:b };
	},
		
	ChangeTextureColorRGB : function( RGB )
	{
		this.ChangeTextureColor( (RGB & 0x00FF0000) >> 16, (RGB & 0x0000FF00) >> 8, (RGB & 0x000000FF) );
	},
	
	// テクスチャの色を指定
	ChangeTextureColorWithChildren : function( r, g, b )
	{
		this.ChangeTextureColor( r, g, b );
		
		var i = 0;
		var c = this.GetChild( i );
		
		while( c != null )
		{
			c.ChangeTextureColorWithChildren( r, g, b );
			i++;
			c = this.GetChild( i );
		}
		
		
	},
	
	// テクスチャの色設定を0-255で指定
	ChangeTextureColor : function( r, g, b )
	{
		r = Math.floor( r );
		g = Math.floor( g );
		b = Math.floor( b );
		
		
		if( r < 0 )
		{
			r = 0;
		}
		if( 255 < r )
		{
			r = 255;
		}
		
		if( g < 0 )
		{
			g = 0;
		}
		
		if( 255 < g )
		{
			g = 255;
		}
		
		if( b < 0 )
		{
			b = 0;
		}
		if( 255 < b )
		{
			b = 255;
		}
		
		
		var rgb = r * 256 * 256 + g * 256 + b;
		
		
		if( this.m_isText )
		{
			return;
		}
		
		this.m_Object.tint = rgb;
	},
	
	// PIXIオブジェクトを得る
	GetSprite : function()
	{
		return this.m_Object;
	},
		
	
	
};

