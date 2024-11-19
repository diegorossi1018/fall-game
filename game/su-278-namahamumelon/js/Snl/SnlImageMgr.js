/**
 * @file 	SnlImageMgr.js
 * @brief 	画像管理クラス
 * @author	D.Hara
 */
 
var SnlImageMgr =  function()
{
	this.ImageMgrType = "normal";
	
	this.isPacking = false;
	
	
	this.m_ImageMax = 0;
	this.m_Image = null;
	this.m_Texture = null;
	this.m_ImageKeyTbl = null;
	this.m_ImageIdxToKey = null;
	this.m_ImageOnLoad = null;
	this.m_ImageSize = null;
	this.m_UseCount = null;
	this.m_ImageLoadCount = 0;
	
	//
	this.m_LoadAllIdx = -1;
	this.m_LoadDoneCount = 0;
	this.m_LoadAllMaxConnections = 4;
	this.m_LoadAllImgPathArray = null;
	this.m_LoadAllSuccessCallBack = null;
	this.m_SetPixiMgrProgress = false;
	
	this.m_IsNoSpace = false;
};


SnlImageMgr.prototype = 
{
	// 初期化(ImageMax = 最大読み込み枚数)
	Init : function( ImageMax )
	{
		this.m_ImageMax = ImageMax;
		
		this.m_ImageKeyTbl = {};
	
		this.m_Image = [];
		this.m_Texture = [];
		this.m_ImageOnLoad = [];
		this.m_ImageIdxToKey = [];
		this.m_ImageSize = [];
		this.m_UseCount = [];
		for( var i=0; i<this.m_ImageMax; i++ )
		{
			this.m_Image[i] = null;
			this.m_Texture[i] = null;
			this.m_ImageOnLoad[i] = false;
			this.m_ImageSize[i] = {x:0, y:0};
			this.m_UseCount[i] = 0;
		}
		this.m_LoadDoneCount = 0;
		this.m_ImageLoadCount = 0;
	},
		
	Init_LoadAll : function( ImgPathArray, MaxConnections, LoadAllSuccessCallBack )
	{
		this.m_LoadAllImgPathArray = ImgPathArray;
		this.m_LoadAllMaxConnections = MaxConnections;
		this.Init( this.m_LoadAllImgPathArray.length );
		for( var i=0; i<this.m_LoadAllMaxConnections && i < this.m_LoadAllImgPathArray.length ; i++ )
		{
			this.GetTexture( this.m_LoadAllImgPathArray[i] );
		}
		this.m_LoadDoneCount = 0;
		this.m_ImageLoadCount = 0;
		this.m_LoadAllIdx = this.m_LoadAllMaxConnections;
		this.m_LoadAllSuccessCallBack = LoadAllSuccessCallBack;
	},
		
	GetProgress : function()
	{
		if( this.m_LoadAllIdx < 0 || this.m_LoadAllImgPathArray == null )
		{
			return 0;
		}
		
		if( this.m_LoadAllImgPathArray.length <= this.m_LoadDoneCount )
		{
			return 1;
		}
		
		return this.m_LoadDoneCount / this.m_LoadAllImgPathArray.length;
	},
	
	// 終了
	Destroy : function()
	{
		this.AllDeleteImage();
		this.m_ImageIdxToKey = null;
		this.m_ImageKeyTbl = null;
		this.m_Image = null;
		this.m_ImageOnLoad = null;
		this.m_ImageSize = null;
		this.m_ImageLoadCount = 0;
		
		this.m_LoadAllIdx = -1;
		this.m_LoadDoneCount = 0;
		this.m_LoadAllMaxConnections = 4;
		this.m_LoadAllImgPathArray = null;
		this.m_LoadAllSuccessCallBack = null;
		this.m_SetPixiMgrProgress = false;
	},
	
	// 現在何かをロード中か？
	NowLoading : function()
	{
		for( var i=0; i<this.m_Image.length; i++ )
		{
			if( this.m_Image[i] != null )
			{
				return true;
			}
		}
		return false;
	},
		
		
	AddUseCount : function( ImagePath, LogView )
	{
		if( typeof LogView === "undefined" )
		{
			LogView = false;
		}
		
		var Idx = ImagePath;
		
		if( typeof ImagePath === 'number' )
		{
		}
		else
		{
			Idx = this.GetIdx( ImagePath );
		}
		
		if( 0 <= Idx )
		{
			
			this.m_UseCount[Idx]++;
			
			if( LogView )
			{
				console.log( "AddIdx:" + Idx + ", " + this.m_UseCount[Idx] );
			}
			
		}
	},
		
	DecUseCount : function( ImagePath, LogView )
	{
		if( typeof LogView === "undefined" )
		{
			LogView = false;
		}
		
		var Idx = ImagePath;
		
		if( typeof ImagePath === 'number' )
		{
		}
		else
		{
			Idx = this.GetIdx( ImagePath );
		}
		
		if( 0 <= Idx )
		{
			this.m_UseCount[Idx]--;
			if( LogView )
			{
				console.log( "DecIdx:" + Idx + ", " + this.m_UseCount[Idx] );
			}
		}
	},
	
	GetIdx : function( ImagePath )
	{
		if( ImagePath == null )
		{
			return -1;
		}
		
		if( ImagePath in this.m_ImageKeyTbl )
		{
			//if( this.m_ImageOnLoad[this.m_ImageKeyTbl[ImagePath]] )
			{
				return this.m_ImageKeyTbl[ImagePath];
			}
			
			//return -1;
		}
		
		if( ImagePath.indexOf("/") < 0 )
		{
			ImagePath = "/" + ImagePath;
			
			if( ImagePath.indexOf(".") < 0 )
			{
				ImagePath = ImagePath + ".png";
			}
			
			
			var keys = Object.keys(this.m_ImageKeyTbl);
		
			for( var i=0; i<keys.length; i++ )
			{
				if( 0 <= keys[i].indexOf( ImagePath ) )
				{
					return this.m_ImageKeyTbl[keys[i]];
				}
			}
		}
		
		return -1;
	},
		
	UnloadNotUseTexture : function()
	{
		for( var i=0; i<this.m_ImageMax; i++ )
		{
			if( this.m_UseCount[i] <= 0 )
			{
				this.DeleteImage( i );
			}
		}
	},
	
	// 画像の取得（ロード開始）
	// ロード済みならPixiTextureを返す
	GetTexture : function( ImagePath, isLoad )
	{
		if( isLoad == null )
		{
			isLoad = true;
		}
		
		if( this.m_ImageKeyTbl == null )
		{
			return null;
		}
		
		if( ImagePath == null )
		{
			console.log( "ImgPathがnull" );
			return null;
		}
		else if( typeof ImagePath != "string" )
		{
			console.log( "ImgPathが"+(typeof ImagePath)+"です\nVal:" + ImagePath );
		}
		
		var Idx = this.GetIdx( ImagePath );
		if( 0 <= Idx )
		{
			return this.m_Texture[Idx];
		}
		
		if( !isLoad )
		{
			return null;
		}
		
		var IdxNull = -1;
		for( var i=0; i<this.m_ImageMax; i++ )
		{
			if( IdxNull < 0 && !( this.m_Image[i] != null || this.m_Texture[i] != null ) )
			{
				IdxNull = i;
			}
		}
		
		if( IdxNull < 0 && this.m_LoadAllIdx < 0)
		{
			this.UnloadNotUseTexture();
			
			for( var i=0; i<this.m_ImageMax; i++ )
			{
				if( IdxNull < 0 && !( this.m_Image[i] != null || this.m_Texture[i] != null ) )
				{
					IdxNull = i;
				}
			}
		}
			
		if( IdxNull < 0 )
		{
			this.m_IsNoSpace = true;
			if( SnlPixiMgr.isDebug )
			{
				console.log( ImagePath + "\n空きがありません！" );
			}
			return null;
		}
		this.m_IsNoSpace = false;
		this.m_ImageOnLoad[IdxNull] = false;
		this.m_ImageKeyTbl[ImagePath] = IdxNull;
		this.m_Image[IdxNull] = new Image();
		this.m_Image[IdxNull].crossOrigin = "anonymous";
		this.m_Image[IdxNull].onload = SnlImageMgr_OnLoad( this, IdxNull );
		this.m_Image[IdxNull].onerror = SnlImageMgr_OnError( this, IdxNull );
		this.m_ImageIdxToKey[IdxNull] = ImagePath;
		this.m_ImageLoadCount++;
		
		if( ImagePath.indexOf( "http" ) == 0 )
		{
			this.m_Image[IdxNull].src = ImagePath;
		}
		else
		{
			this.m_Image[IdxNull].src = SnlPixiMgr.m_BasePath + ImagePath;
		}
		
		return null;
	},
	
	// 画像の破棄
	DeleteImage : function( Idx )
	{
		if( this.m_Texture[Idx] == null )
		{
			return;
		}
		

		
		this.m_Texture[Idx].destroy( true );
		this.m_Texture[Idx] = null;
		
		if( SnlPixiMgr.PixiVersion < SnlPixiMgr.ePixiVersion.V4 )
	   	{
			PIXI.Texture.removeTextureFromCache( this.m_ImageIdxToKey[Idx] );
		}
		else
		{
			PIXI.Texture.removeFromCache( this.m_ImageIdxToKey[Idx] );
		}
		
		if( this.m_Image[Idx] != null )
		{
			this.m_Image[Idx].parentNode.removeChild(this.m_Image[Idx]);
			this.m_Image[Idx].onload = null;
			this.m_Image[Idx].onerror = null;
			this.m_Image[Idx] = null;
		}
		
		this.m_ImageKeyTbl[this.m_ImageIdxToKey[Idx]] = null;
		delete this.m_ImageKeyTbl[this.m_ImageIdxToKey[Idx]];
		this.m_ImageOnLoad[Idx] = false;
		this.m_ImageSize[Idx] = null;
	},
		
	// 全てのイメージの破棄
	AllDeleteImage : function()
	{
		for( var i=0; i<this.m_ImageMax; i++ )
		{
			this.DeleteImage( i );
		}
	},
		
	// 画像サイズ取得
	GetImageSize : function( ImagePath )
	{

		
		var image = null;
		if( ImagePath in this.m_ImageKeyTbl )
		{
			if( this.m_ImageOnLoad[this.m_ImageKeyTbl[ImagePath]] )
			{
				image = this.m_ImageSize[this.m_ImageKeyTbl[ImagePath]];
			}
		}
		
		if( ImagePath.indexOf("/") < 0 )
		{
			ImagePath = "/" + ImagePath;
			
			if( ImagePath.indexOf(".") < 0 )
			{
				ImagePath = ImagePath + ".png";
			}
			
			
			var keys = Object.keys(this.m_ImageKeyTbl);
		
			for( var i=0; i<keys.length; i++ )
			{
				if( 0 <= keys[i].indexOf( ImagePath ) )
				{
					image = this.m_ImageSize[this.m_ImageKeyTbl[keys[i]]];
				}
			}
		}
		
		if( image == null )
		{
			return {x:0, y:0};
		}
		
		return image;
	},
	
	// 画像読み込み完了
	OnLoad : function( Idx )
	{
		if( this.m_ImageOnLoad == null )
		{
			return;
		}
		
		this.m_LoadDoneCount++;
		
		this.m_ImageOnLoad[Idx] = true;
		
		this.m_Texture[Idx] = new PIXI.Texture( new PIXI.BaseTexture( this.m_Image[Idx], PIXI.SCALE_MODES.LINEAR, 1 ) );
		if( SnlPixiMgr.ePixiVersion.V4 <= SnlPixiMgr.PixiVersion )
		{
			this.m_Texture[Idx].baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;
		}
		
		var w = this.m_Image[Idx].width;
	    var h = this.m_Image[Idx].height;
	    
	    // Firefox, Safari, Chrome
	    if ( typeof this.m_Image[Idx].naturalWidth !== 'undefined' ) 
	    {
	       	w = this.m_Image[Idx].naturalWidth;
	       	h = this.m_Image[Idx].naturalHeight;
	    }
	    // for IE
	    else if ( typeof this.m_Image[Idx].runtimeStyle !== 'undefined' )
	    {    
	        var run = this.m_Image[Idx].runtimeStyle;
	        var mem = { w: run.width, h: run.height };  // keep runtimeStyle
	        run.width  = "auto";
	        run.height = "auto";
	        w = this.m_Image[Idx].width;
	        h = this.m_Image[Idx].height;
	        run.width  = mem.w;
	        run.height = mem.h;
	 
	    }
	    // for Opera
	    else 
	   	{         
	        var mem = { w: this.m_Image[Idx].width, h: this.m_Image[Idx].height };  // keep original style
	        this.m_Image[Idx].removeAttribute("width");
	        this.m_Image[Idx].removeAttribute("height");
	        w = this.m_Image[Idx].width;
	        h = this.m_Image[Idx].height;
	        this.m_Image[Idx].width  = mem.w;
	        this.m_Image[Idx].height = mem.h;
	    }
	    
		this.m_ImageSize[Idx] = {x:w, y:h};
		
		if( this.m_Image[Idx] != null )
		{
			this.m_Image[Idx].onload = null;
			this.m_Image[Idx].onerror = null;
			this.m_Image[Idx] = null;
		}
		
		if( this.m_LoadAllImgPathArray == null )
		{
			return;
		}
		
		if( this.m_SetPixiMgrProgress )
		{
			SnlPixiMgr.m_NowLoadProgress = this.GetProgress();
		}
		
		if( this.m_LoadAllImgPathArray.length <= this.m_LoadAllIdx )
		{
			var isLoadAll = true;
			for( var i=0; i<this.m_ImageMax; i++ )
			{
				if( this.m_Texture[i] == null )
				{
					isLoadAll = false;
				}
				
				if( this.m_ImageOnLoad[i] == false )
				{
					isLoadAll = false;
				}
			}
			
			if( isLoadAll && this.m_LoadAllSuccessCallBack != null )
			{
				if( SnlPixiMgr.isDebug )
				{
					console.log( "LoadAll");
				}
				
				this.m_LoadAllSuccessCallBack();
			}
			return;
		}
		
		this.GetTexture( this.m_LoadAllImgPathArray[this.m_LoadAllIdx] );
		this.m_LoadAllIdx++;
	},
	
	// 画像読み込み失敗
	OnError : function( Idx )
	{
		if( this.m_ImageOnLoad == null )
		{
			return;
		}
		
		
		/*
		if( this.m_LoadAllImgPathArray != null )
		{
			this.DeleteImage( Idx );
			this.GetTexture( this.m_LoadAllImgPathArray[Idx] );
		}
		else
		*/
		{
			if( this.m_Image[Idx] != null )
			{
				var src  = this.m_Image[Idx].src;
				
				this.m_Image[Idx].onload = null;
				this.m_Image[Idx].onerror = null;
				this.m_Image[Idx] = null;
				
				this.m_Image[Idx] = new Image();
				this.m_Image[Idx].crossOrigin = "anonymous";
				this.m_Image[Idx].onload = SnlImageMgr_OnLoad( this, Idx );
				this.m_Image[Idx].onerror = SnlImageMgr_OnError( this, Idx );
				this.m_Image[Idx].src = src;	
			}
		}
	},
	
	isNoSpace : function()
	{
		return this.m_IsNoSpace;
	}
	
};

// 画像用読み込み完了コールバック
function SnlImageMgr_OnLoad( Mgr, Idx )
{
	return function()
	{
		
		if( SnlPixiMgr.isDebug )
		{
			if( Mgr.m_LoadAllImgPathArray == null )
			{
				console.log( "OnLoad[" + Idx +"] : " + Mgr.m_Image[Idx].src );
			}
			else
			{
				console.log( "OnLoad : " + Mgr.m_LoadAllImgPathArray[Idx] );
			}
		}
		Mgr.OnLoad( Idx );
		
	}
};

// 画像用読み込み失敗コールバック
function SnlImageMgr_OnError( Mgr, Idx )
{
	return function()
	{
		if( SnlPixiMgr.isDebug )
		{
			if( Mgr.m_LoadAllImgPathArray == null )
			{
				console.log( "OnError[" + Idx + "] : " + Mgr.m_Image[Idx].src );
			}
			else
			{
				console.log( "OnError : " + Mgr.m_LoadAllImgPathArray[Idx] );
			}
		}
		Mgr.OnError( Idx );
	}
}


