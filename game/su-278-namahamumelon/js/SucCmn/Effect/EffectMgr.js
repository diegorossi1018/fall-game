// Creapで作成されたエフェクトの管理
var EffectMgr = function()
{
}

// EffectMgr.eTypeは循環参照防止及びEffectMgrのCommonへの分離の関係でGameDefine.eEffectに変更されました

// FPS管理
EffectMgr.m_FPS = {};
EffectMgr.m_EffectImgs = {};
EffectMgr.m_EffectSize = {};

// エフェクト標準Z
EffectMgr.m_EffectZ = -1;

// エフェクト標準バンク
EffectMgr.m_BaseBankNo = 0;

// エフェクトリスト
EffectMgr.m_List = [];

// エフェクトロードチェックリスト
EffectMgr.m_LoadCheckList = [];

// エフェクト管理ID
EffectMgr.m_EffectIDHead = 0;

// Creapの設定
Creap.options.isAccurateTarget = false;

// 子供の探索
EffectMgr.FindChildCore = function( obj, name )
{
	if( obj == null || obj.children == null )
	{
		return null;
	}
	
	for( var i=0; i<obj.children.length; i++ )
	{
		if( obj.children[i].searchName == name )
		{
			return obj.children[i];
		}
		
		var s = EffectMgr.FindChildCore( obj.children[i], name );
		if( s != null )
		{
			return s;
		}
	}
	
	return null;
}

// 初期化
EffectMgr.Init = function()
{
	EffectMgr.m_BaseBankNo = -1
	
	
	EffectMgr.m_EffectZ = GameDefine.eDispSort.Effect;
	// 設定からFPSの取得
	for( var key in GameDefine.eEffect )
	{
		if( isNaN(GameDefine.eEffect[key].BankNo) )
		{
			GameDefine.eEffect[key].BankNo = GameDefine.eBank[GameDefine.eEffect[key].BankNo];
		}
		
		var comp = AdobeAn.getComposition(GameDefine.eEffect[key].AdobeAnID);
		var lib = comp.getLibrary();
		var ImgFiles = [];
		
		var Dir = "";
		if( "ImgDir" in GameDefine.eEffect[key] )
		{
			Dir = GameDefine.eEffect[key].ImgDir + "/";
		}
		
		
		for( var i=0; i<lib.properties.manifest.length; i++ )
		{
			ImgFiles[i] = "./Img/GameEffect/" + Dir + lib.properties.manifest[i].id + ".png"; //lib.properties.manifest[i].src;
		}
		EffectMgr.m_EffectImgs[GameDefine.eEffect[key].AdobeAnID] = ImgFiles;
		
		EffectMgr.m_EffectSize[GameDefine.eEffect[key].AdobeAnID] =
		{
			x: lib.properties.width,
			y: lib.properties.height,
		};
		EffectMgr.m_FPS[GameDefine.eEffect[key].AdobeAnID] = lib.properties.fps;
	}
};

// エフェクトを作成してEffectObjを返す(基本的にこっちを使う）
// EffectType 	: エフェクトタイプ（GameDefine.eEffect）
// isLoop		: エフェクトはループ再生するか？
// PosX, PosY 	: エフェクトの位置
// AncX, AncY	: エフェクトのアンカー
// EffectZ		: エフェクトの描画順( GameDefine.eDispSort -1で親オブジェクト依存)
// Parent		: エフェクトの親オブジェクト
EffectMgr.CreateAndLoad = function( EffectType, isLoop, PosX, PosY, AncX, AncY, EffectZ, Parent )
{
	var Obj = new EffectObj();
	Obj.Create( EffectType, PosX, PosY, EffectMgr.m_EffectSize[EffectType.AdobeAnID], {x:AncX, y:AncY}, EffectZ, Parent, isLoop );
	
	if( EffectType.BankNo == EffectMgr.m_BaseBankNo )
	{
		EffectMgr.m_LoadCheckList.push( Obj );
	}
	
	return Obj;
};

// Effect作成のコア（基本的にこっちを直接呼ぶ事はない）
// EffectType 	: エフェクトタイプ（GameDefine.eEffect）
// PosX, PosY 	: エフェクトの位置
// isLoop		: エフェクトはループ再生するか？
// EffectZ		: エフェクトの描画順( GameDefine.eDispSort -1で親オブジェクト依存)
// Parent		: エフェクトの親オブジェクト
EffectMgr.CreateEffect = function( EffectType, PosX, PosY, isLoop, EffectZ, Parent )
{
	if( PosX == null )
	{
		PosX = 0;
	}
		
	if( PosY == null )
	{
		PosY = 0;
	}
		
	if( isLoop == null )
	{
		isLoop = true;
	}

	if( EffectZ == null )
	{
		EffectZ = EffectMgr.m_EffectZ;
	}
	
	// エフェクト生成設定
	var Core = new Creap.Content('lib', EffectType.CreateFunc, 'images', 'ss', null, EffectType.AdobeAnID );
	
	var BankNo = EffectType.BankNo;
	if( BankNo < 0 )
	{
		BankNo = EffectMgr.m_BaseBankNo;
	}
		
	var Obj = new Creap.Application( Core, null, { BankNo: BankNo } ).on( 'initialized', function() 
	{
		if( this.m_InitDone )
		{
			return;
		}
		this.start();
		this.m_InitDone = true;
		this.Tick();
	});
		
	// AnimExecでエフェクトを任意に更新できるようにする
	Obj.EffType = EffectType.AdobeAnID;
	Obj.AnimTimer = 0;
	Obj.SpeedRate = 1;
	Obj.isLoop = isLoop;
	Obj.isEnd = false;
	Obj.m_InitDone = false;
	Obj.m_Pause = false;
	Obj.m_VisibleAfterEnd = true;
	
	// エフェクト更新関数
	Obj.AnimExec = function( ) // SpeedRateは再生速度倍率、省略すると1
	{
		if( this.m_Pause )
		{
			return;
		}
		
		var SpeedRate = this.SpeedRate;
		
		if( !this.m_InitDone )
		{
			return;
		}
		
		while( 1 <= this.AnimTimer )
		{
			this.Tick();
			this.AnimTimer--;
		}
		
		this.AnimTimer += EffectMgr.m_FPS[this.EffType] * SnlFPS.deltaTime * SpeedRate;
		
		if( this.root._creap.isEnd )
		{
			this.root.visible = this.m_VisibleAfterEnd;
			this.isEnd = true;
		}
	};
	
	Obj.SetAlpha = function( a )
	{
		if( a < 0 )
		{
			a = 0;
		}
		if( 1 < a )
		{
			a = 1;
		}
		this.root.alpha = a;
	};
	
	Obj.SetVisible = function( isV )
	{
		if( this.isEnd && !this.m_VisibleAfterEnd )
		{
			this.root.visible = false;
			return;
		}
		
		this.root.visible = isV;
	};
	
	Obj.GetRate = function()
	{
		if( this.root == null || this.root._creap == null )
		{
			return 0;
		}
		
		if( this.root._creap.isEnd )
		{
			return 1;
		}
		
		return Number( this.root._creap.currentFrame ) / Number( this.root._creap.totalFrames );
	};
	
	// エフェクト削除関数
	Obj.Destroy = function()
	{
		EffectMgr.DeleteEffect( this );
		
		if( 0 < this.m_EffectZ )
		{
			SnlPixiMgr.ReleaseZ( this.stage, this.m_EffectZ );
		}
		else if( this.m_Parent != null )
		{
			this.m_Parent.DeadChild( this );
			this.m_Parent = null;
		}
		this.stop();
	};
	
	// エフェクト操作系を追加
	Obj.SetPos = function( x, y )
	{
		this.stage.x = x;
		this.stage.y = y;
	};
	
	Obj.SetPosX = function( x )
	{
		this.stage.x = x;
	};
	
	Obj.SetPosY = function( y )
	{
		this.stage.y = y;
	};
	
	Obj.AddPos = function( x, y )
	{
		this.stage.x += x;
		this.stage.y += y;
	};
	
	Obj.GetPos = function()
	{
		return { x: this.stage.x, y: this.stage.y };
	};
	
	Obj.SetScale = function( x, y )
	{
		if( typeof y === "undefined" )
		{
			y = x;
		}
		
		this.stage.scaleX = x;
		this.stage.scaleY = y;
	};
	
	Obj.GetScale = function()
	{
		return { x: this.stage.scaleX, y: this.stage.scaleY };
	};
	
	// SnlObject互換
	Obj.GetObject = function()
	{
		return this.stage;
	};
	
	Obj.FindChild = function( name )
	{
		if( this.root == null )
		{
			return null;
		}
		
		return EffectMgr.FindChildCore( this.root, name );
	}
	
	Obj.Pause = function( isPause )
	{
		this.m_Pause = isPause;
		//this.pause( isPause );
	}
	
	// 位置設定
	Obj.m_EffectZ = EffectZ;
	Obj.m_Parent  = Parent;
	Obj.SetPos( PosX, PosY );
	
	if( 0 <= Obj.m_EffectZ )
	{
		SnlPixiMgr.PixiObjSetZ( Obj.stage, Obj.m_EffectZ );
	}
	else if( Parent != null )
	{
		Obj.m_Parent.SetChild( Obj );
	}
	
	
	// エフェクトID指定
	Obj.EffectID = EffectMgr.m_EffectIDHead;
	EffectMgr.m_EffectIDHead++;
	EffectMgr.m_List.push( Obj );
		
	return Obj;
};
	
// エフェクトの更新
EffectMgr.Update = function()
{
	var i=0;
	
	while( i < EffectMgr.m_LoadCheckList.length )
	{
		if( EffectMgr.m_LoadCheckList[i].LoadingCheck() )
		{
			EffectMgr.m_LoadCheckList.splice( i, 1 );
		}
		else
		{
			i++;
		}
	}
	
	for( i=0; i<this.m_List.length; i++ )
	{
		if( this.m_List[i] == null )
		{
			continue;
		}
		this.m_List[i].AnimExec();
	}
};
	
// エフェクトの解放
EffectMgr.DeleteEffect = function( Obj )
{
	for( var i=0; i<this.m_List.length; i++ )
	{
		if( this.m_List[i].EffectID == Obj.EffectID )
		{
			this.m_List[i] = null;
			this.m_List.splice( i, 1 );
			return;
		}
	}
};

// EffectObjの削除時に呼ばれる
EffectMgr.DeleteEffectObj = function( Obj )
{
	for( var i=0; i<EffectMgr.m_LoadCheckList.length; i++ )
	{
		if( EffectMgr.m_LoadCheckList[i].EffectID == Obj.EffectID )
		{
			EffectMgr.m_LoadCheckList[i] = null;
			EffectMgr.m_LoadCheckList.splice( i, 1 );
			return;
		}
	}
};

EffectMgr.prototype ={};
