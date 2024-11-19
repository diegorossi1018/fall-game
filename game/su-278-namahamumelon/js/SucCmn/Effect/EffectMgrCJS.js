// CreateJSで作成されたエフェクトの管理	
var EffectMgrCJS = function()
{
}
EffectMgrCJS.prototype = {};


// エフェクトタイプ列挙
// EffectMgrCJS.eTypeは循環参照防止及びEffectMgrのCommonへの分離の関係でGameDefine.eEffectCJSに変更されました

// エフェクト画像類
EffectMgrCJS.m_Images = null;			// 画像
EffectMgrCJS.m_LoadManifest = null;		// 読み込み設定
EffectMgrCJS.m_FPS = null;
EffectMgrCJS.m_AdobeAnIDTbl = null;
EffectMgrCJS.m_CreateFunc = null;
EffectMgrCJS.m_ImageDir = null;

// ローディング管理
EffectMgrCJS.m_DoneLoadingID = -1;
EffectMgrCJS.m_NowLoadingID = -1;
	
// エフェクトZ
EffectMgrCJS.m_EffectZ = -1;
	
// 初期化
EffectMgrCJS.Init = function()
{
	createjs.MotionGuidePlugin.install();
	
	// エフェクトのDispZを設定
	EffectMgrCJS.m_EffectZ = GameDefine.eDispSort.CreateJS;

	EffectMgrCJS.m_Images  = [];
	EffectMgrCJS.m_LoadManifest = [];
	EffectMgrCJS.m_FPS = [];
	EffectMgrCJS.m_AdobeAnIDTbl =[];
	EffectMgrCJS.m_CreateFunc = [];
	EffectMgrCJS.m_ImageDir = [];
	EffectMgrCJS.m_Size = [];
	
	// 設定からFPSの取得
	for( var key in GameDefine.eEffectCJS )
	{
		var id = GameDefine.eEffectCJS[key].AdobeAnID;
		
		EffectMgrCJS.m_AdobeAnIDTbl.push( id );
		
		var comp = AdobeAn.getComposition(id);
		var lib = comp.getLibrary();
		var ImgFiles = comp.getImages();
		
		EffectMgrCJS.m_FPS[id] = lib.properties.fps;
		EffectMgrCJS.m_Images[id] = comp.getImages();
		EffectMgrCJS.m_LoadManifest[id] = lib.properties.manifest;
		EffectMgrCJS.m_CreateFunc[id] = lib[GameDefine.eEffectCJS[key].CreateFunc];
		EffectMgrCJS.m_ImageDir[id] = "";
		EffectMgrCJS.m_Size[id] = { x:lib.properties.width, y:lib.properties.height };
		
		if( "Dir" in GameDefine.eEffectCJS[key] )
		{
			EffectMgrCJS.m_ImageDir[id] = GameDefine.eEffectCJS[key].Dir + "/";
		}
	}
};

// CJS側のリソース読み込みの進捗を取得(1=100%)
EffectMgrCJS.GetLoadProgress = function()
{
	return EffectMgrCJS.m_NowLoadingID / EffectMgrCJS.m_AdobeAnIDTbl.length;
};
	
// ローディング処理(ModeLoadingから呼ばれる)
EffectMgrCJS.LoadingUpdate = function()
{
	if( EffectMgrCJS.m_AdobeAnIDTbl.length <= EffectMgrCJS.m_NowLoadingID )
	{
		return true; // 全項目ローディング完了
	}
		
	// エフェクトの読み込み終了
	if( EffectMgrCJS.m_NowLoadingID == EffectMgrCJS.m_DoneLoadingID )
	{
		EffectMgrCJS.m_NowLoadingID++; // 読込中番号をインクリメント
			
		if( EffectMgrCJS.m_AdobeAnIDTbl.length <= EffectMgrCJS.m_NowLoadingID )
		{
			return true;	// 全項目ローディング完了
		}
		
		var id = EffectMgrCJS.m_AdobeAnIDTbl[EffectMgrCJS.m_NowLoadingID];
		var loader = null;
		var Dir = EffectMgrCJS.m_ImageDir[id];
		
		
		// 次のエフェクトの読み込みを開始
		if( SnlPixiMgr.m_BasePath == "" )
		{
			loader = new createjs.LoadQueue(false);
			
			for( var i=0; i<EffectMgrCJS.m_LoadManifest[id].length; i++ )
			{
				
				
				EffectMgrCJS.m_LoadManifest[id][i].src =  "./EffectCJS/Images/" + Dir + EffectMgrCJS.m_LoadManifest[id][i].id + ".png"; //+ EffectMgrCJS.m_LoadManifest[id][i].src;
			}
		}
		else
		{
			// BasePath設定時はクロスドメイン許可
			loader = new createjs.LoadQueue( false, "", "Anonymous");
			
			for( var i=0; i<EffectMgrCJS.m_LoadManifest[id].length; i++ )
			{
				
				
				EffectMgrCJS.m_LoadManifest[id][i].src = SnlPixiMgr.m_BasePath + "/EffectCJS/Images/" + Dir + EffectMgrCJS.m_LoadManifest[id][i].id + ".png"; //+ EffectMgrCJS.m_LoadManifest[id][i].src;
			}
		}
			
		loader.addEventListener("fileload", EffectMgrCJS.handleFileLoad);
		loader.addEventListener("complete", EffectMgrCJS.handleComplete);
		if( SnlPixiMgr.m_isPC )
		{
			loader.setMaxConnections(128);
		}
		else
		{
			loader.setMaxConnections(4);
		}

		loader.loadManifest(EffectMgrCJS.m_LoadManifest[id]);
	}
		
	return false; // まだ読込中
};
	
// ファイル読み込みコールバック
EffectMgrCJS.handleFileLoad = function (evt) 
{
	if (evt.item.type == "image") 
	{
		var id = EffectMgrCJS.m_AdobeAnIDTbl[EffectMgrCJS.m_NowLoadingID];
		EffectMgrCJS.m_Images[id][evt.item.id] = evt.result; 
	}
};
	
// ファイル読み込み完了コールバック
EffectMgrCJS.handleComplete = function() 
{
	EffectMgrCJS.m_DoneLoadingID++;
};
	
// エフェクトの作成（戻り値はEffect用のObject 定義はEffectMgrCJS.CreateEffectのObj
// EffectType 				: エフェクトタイプ（GameDefine.eEffectCJS）
// PosX, PosY 				: エフェクトの位置（左上）
// isLoop					: エフェクトはループ再生するか？
// EffectZ					: エフェクトの描画順( GameDefine.eDispSort -1で親オブジェクト依存) 省略可能 省略orNULL時はEffectMgrCJS.m_EffectZ 
// MovieClipMode			: CreateJSのMovieClipのMode　省略可能 省略orNULL時は"independent"
// MovieClipStartPosition	: CreateJSのMovieClipの再生開始フレーム 省略可能 省略orNULL時は0
EffectMgrCJS.CreateEffect = function( Type, PosX, PosY, isLoop, EffectZ, MovieClipMode, MovieClipStartPosition )
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
		
	if( MovieClipMode == null )
	{
		MovieClipMode = "independent";
	}
		
	if( MovieClipStartPosition == null )
	{
		MovieClipStartPosition = 0;
	}
	
	var ID = Type.AdobeAnID;
	
	// エフェクト生成設定
	var Obj = null;
	Obj = new EffectMgrCJS.m_CreateFunc[ID](MovieClipMode, MovieClipStartPosition,isLoop);
	Obj.cjsSize = EffectMgrCJS.m_Size[ID]
	
	if( Obj == null )
	{
		return null;
	}
	else
	{
		Obj.x = PosX;
		Obj.y = PosY;
		

	}
		
	// AnimExecでエフェクトを任意に更新できるようにする（使わなくても良い）
	Obj.EffType = ID;
	Obj.AnimTimer = 0;
	Obj.AnimExec = function( SpeedRate ) // SpeedRateは再生速度倍率、省略すると1
	{
		if( SpeedRate == null )
		{
			SpeedRate = 1;
		}
		this.gotoAndStop( EffectMgrCJS.m_FPS[this.EffType] * this.AnimTimer );
		this.AnimTimer += SnlFPS.deltaTime * SpeedRate;
	};
	
	// アンカーの設定
	Obj.SetAnchor = function( AncX, AncY )
	{
		//var x = this.x;
		//var y = this.y;
		
		this.regX = Obj.cjsSize.x * AncX;
		this.regY = Obj.cjsSize.y * AncY;
		
		//this.x = x;
		//this.y = y;
	};
	
	// 位置の設定
	Obj.SetPos = function( x, y )
	{
		this.x = x;
		this.y = y;
	}
	
	// スケールの設定
	Obj.SetScale = function( SclX, SclY )
	{
		this.scaleX = SclX;
		this.scaleY = SclY;
	}
	
	// エフェクトの削除
	Obj.Destroy = function()
	{
		EffectMgrCJS.DeleteEffect( this );
	}
	
	// 再生終了したか？
	Obj.isEnd = function()
	{
		return this.totalFrames <= this.currentFrame;
	}
		
	if( EffectZ == null )
	{
		EffectZ = EffectMgrCJS.m_EffectZ;
	}
	
	Obj.m_EffectZ = EffectZ;
	SnlPixiMgr.PixiObjSetZ( Obj, EffectZ );
		
	return Obj;
};
	
// エフェクトの解放
EffectMgrCJS.DeleteEffect = function( Obj )
{
	SnlPixiMgr.ReleaseZ( Obj, Obj.m_EffectZ );
};


