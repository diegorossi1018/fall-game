/**
 * @file 	SnlPixiMgr.js
 * @brief 	画像ロード/描画(Pixijs、ThreeJS)
 			マウス/タッチ入力
 * @author	D.Hara
 */

var SnlPixiMgr =  function(){}

SnlPixiMgr.ePixiVersion =
{
	V2 : 0,
	V3 : 10,
	V4 : 20,
	V5 : 30,
	V6 : 40,
};

SnlPixiMgr.eThreeQuality= 
{
	High 	: 0,
	Normal  : 1,
	Low		: 2,
}
SnlPixiMgr.ThreeQuality = SnlPixiMgr.eThreeQuality.High;

SnlPixiMgr.PixiVersion = 0;

// デバッグモードか？
SnlPixiMgr.isDebug = false;

// Debug兼コンバートデータ出力フラグ
SnlPixiMgr.c_OutputSpriteSheet = false;

// 擬似横持ちモード
SnlPixiMgr.isQuasiLandscape = false;
SnlPixiMgr.m_QuasiCanvas = null;

// 縦横どちらに合わせるか？
SnlPixiMgr.isHBase = false;

// 横解像度
SnlPixiMgr.m_Width 			= 640;

// 縦解像度
SnlPixiMgr.m_Height 			= 800;

// サイズ計算をPC時でもモバイルと同じ計算を行う
SnlPixiMgr.m_ForceMobileSize  = false;

// バナー高さ
SnlPixiMgr.m_AdsHeight		= 0;

// 表示調整用倍率
SnlPixiMgr.m_DispRatio 		= 1.0;
// 入力調整用倍率
SnlPixiMgr.m_InputRatio 		= 1.0;

// ステージ（描画ルート）
SnlPixiMgr.m_Stage			= [];

// レンダラ
SnlPixiMgr.m_Renderer			= [];


// 〇フレームに一度しか描画しない対応
SnlPixiMgr.m_RenderCount = 0;			// カウンタ
SnlPixiMgr.m_RenderDist  = 0;			// 2以上でSnlPixiMgr.m_RenderDist毎の描画になる

// 3Dカメラ(ThreeJS用)
SnlPixiMgr.m_Camera			= [];

// ビュー(Canvas)の最大数
SnlPixiMgr.m_ViewMax			= -1;

// ビュー(Canvas)のタイプ(どの描画ライブラリを使用するか？)
SnlPixiMgr.m_ViewType			= [];

// Canvas
SnlPixiMgr.m_Canvas 			= [];

// 以下の中央寄せ処理をPC環境でも適用するか？
SnlPixiMgr.m_enableCenteringPC	= false;

// Canvasの中央寄せ(横)
SnlPixiMgr.m_isCentering 		= false;

// Canvasの中央寄せ(縦)
SnlPixiMgr.m_isCenteringH		= false;

// 描画関係の設定データ
SnlPixiMgr.m_CanvasModeTbl	= null;

// 描画更新を行っても良いかビュー毎に指定
SnlPixiMgr.m_isUpdate			= [];

// CreateJSのFPS定義
SnlPixiMgr.CreateJsFPS = 30;

//
SnlPixiMgr.m_ResizeCheckOnUpdate = false;
SnlPixiMgr.m_DocumentClientSize = { x:-1, y:-1 };


// マウス
SnlPixiMgr.m_MousePos 		= { x:-1, y:-1 };
SnlPixiMgr.m_MouseDown 		= false;
SnlPixiMgr.m_MouseUp   		= false;
SnlPixiMgr.m_MousePress 		= false;
SnlPixiMgr.m_StartMousePos	= { x:-1, y:-1 };
SnlPixiMgr.m_LastMousePos		= { x:-1, y:-1 };
SnlPixiMgr.m_FlickCheck		= [];
SnlPixiMgr.m_FlickType		= -1;
SnlPixiMgr.m_FlickTimeLimit	= 0.5;			// タイムリミット以内にフリック動作を完了させない場合は感知させない
SnlPixiMgr.m_FlickStartTime	= 0;

// タッチ
SnlPixiMgr.m_TouchMode		= false;		// タッチモード動作後はマウスを取らない
SnlPixiMgr.m_MultiTouch		= false;		// マルチタッチ処理を行うか？
SnlPixiMgr.m_Touch			= false;		// タッチ中か？（シングルタッチモード用）
SnlPixiMgr.m_TouchID			= [];			// タッチIDを記録
SnlPixiMgr.m_TouchStep		= [];			// タッチStep
SnlPixiMgr.m_TouchPos			= [];			// タッチ位置を記録
SnlPixiMgr.m_ActiveTouchNum	= 0;			// 現在アクティブなタッチ位置は何個ある？
SnlPixiMgr.m_TouchPaddingX	= 0;
SnlPixiMgr.m_TouchPaddingY	= 0;

SnlPixiMgr.eTouchStep = 
{
	None : 0,
	Down : 1,
	Press : 2,
	Up : 3,
};


// Z用スプライト
SnlPixiMgr.m_ZMax				= 0;
SnlPixiMgr.m_DispSortSprite 	= null;

// テクスチャ等
SnlPixiMgr.m_isPreferentialMemory = false;	// true:メモリ効率優先 false:描画速度優先
SnlPixiMgr.m_Texture			= null;
SnlPixiMgr.m_TextureData		= null;
SnlPixiMgr.m_TexOrigin 		= null;

// パッキングされたテクスチャ枚数
SnlPixiMgr.m_TexturePackNum	= null;
SnlPixiMgr.m_TexturePackSize = 2048;


// ロード関係
SnlPixiMgr.m_BasePath			= "";		// 設定する時は必ずSetBasePathから設定する、参照は自由
SnlPixiMgr.m_Loader 			= null;
SnlPixiMgr.m_TextureLoaded	= false;
SnlPixiMgr.m_NowLoadBank 		= [];
SnlPixiMgr.m_NowLoadImgPath	= [];
//SnlPixiMgr.m_NowLoadDoneNum	= -1;
//SnlPixiMgr.m_NowLoadMax		= -1;
SnlPixiMgr.m_NowLoadProgress	= 0;

// SnlImageMgr連携
SnlPixiMgr.m_ImageCheckObj = null;

// タッチ時のサウンド処理可否
SnlPixiMgr.m_SoundAllPlayAndStop = false;
SnlPixiMgr.m_SoundAllPlayAndStopFunc = null;

// PCか？
SnlPixiMgr.m_isPC = false;

// ViewType
SnlPixiMgr.ViewType =
{
	PixiJS 		: 0,
	CreateJS	: 1,
	ThreeJS		: 2,
};

// FlickType
SnlPixiMgr.eFlickType =
{
	None	: -1,
	Up 		: 0,
	Right	: 1,
	Down	: 2,
	Left	: 3,
	Max		: 4,
};

SnlPixiMgr.eShakeType = 
{
	None 		: -1,
	Rnd 		: 0,	// ランダム揺れ
	Vertical 	: 1,	// 縦揺れ
	Horizontal 	: 2,	// 横揺れ
};

SnlPixiMgr.m_ShakeStep = 0;
SnlPixiMgr.m_ShakeTimer = 0;
SnlPixiMgr.m_ShakeLimit = 1;
SnlPixiMgr.m_ShakePower = 0;
SnlPixiMgr.m_ShakePos = { x:0, y:0 };
SnlPixiMgr.m_ShakeType = -1;

// 表示/非表示イベント類
SnlPixiMgr.m_HiddenEvent = [];
SnlPixiMgr.m_VisibleEvent = [];


SnlPixiMgr.SetBasePath = function( BasePath )
{
	SnlPixiMgr.m_BasePath = BasePath;
};

//
SnlPixiMgr.m_EnableMouseWheel = false;
SnlPixiMgr.m_MouseWheelDown = false;
SnlPixiMgr.m_MouseWheelUp = false;

SnlPixiMgr.m_MouseUpOnesEvent = null;

// SS関係
SnlPixiMgr.m_ScreenShotSupport = false;
SnlPixiMgr.m_ScreenShotCanvas = null;
SnlPixiMgr.m_ScreenShotScale = 1;
SnlPixiMgr.m_ScreenShotFlag = false;
SnlPixiMgr.m_ScreenShotCanvasNo = 0;
SnlPixiMgr.m_ScreenShotCallbackContext = null;
SnlPixiMgr.m_ScreenShotCallback = null;
SnlPixiMgr.m_ScreenShotType = "image/jpeg";
SnlPixiMgr.m_ScreenShotQuality = 0.5;

SnlPixiMgr.m_ResizeExec = false;

// iPadOS関係
SnlPixiMgr.m_iPadOSForceMobile = false;		// iPadOS時に強制的にiPad扱いにするか？
SnlPixiMgr.m_isiPad = false;				// iPad判定フラグ


// デバイスを判定して SnlPixiMgr.m_isPC、SnlPixiMgr.m_isiPad などを使える状態にする
SnlPixiMgr.DeviceCheck = function( iPadOSForceMobile )
{
	if( typeof iPadOSForceMobile !== "undefined" )
	{
		SnlPixiMgr.m_iPadOSForceMobile = iPadOSForceMobile;
	}
	
	var UserAgent = navigator.userAgent.toLowerCase();
	
	// iPad判定
	if( SnlPixiMgr.m_iPadOSForceMobile )
	{
		SnlPixiMgr.m_isiPad = UserAgent.indexOf('ipad') > -1 || UserAgent.indexOf('macintosh') > -1 && 'ontouchend' in document;
	}
	else
	{
		SnlPixiMgr.m_isiPad = UserAgent.indexOf('ipad') > -1;
	}
	
	SnlPixiMgr.m_isPC = true;
	// iPod
	if( 0 < UserAgent.indexOf('ipod') || 0 < UserAgent.indexOf('iphone') || SnlPixiMgr.m_isiPad || 0 < UserAgent.indexOf('android') )
	{
		SnlPixiMgr.m_isPC = false;
	}
}


// 初期化
// ZMax(Z最大値)
// CanvasModeTbl = []
// CanvasModeTbl[].ViewNo 	ビュー番号低いほど手前
// CanvasModeTbl[].RenderMode 0 = Pixi.js 1 = Easel.js, 2 = three.js　0と2のViewを5枚以上つくるとおかしくなる
// CanvasModeTbl[].AllwaysUpdate true = 常に描画し続ける、 false = 描画更新フラグを参照する

// CanvasModeTbl = nullの場合はすべてをViewNo=0 RenderMode = AllwaysUpdate = trueとして扱う
SnlPixiMgr.Init = function( ZMax, CanvasModeTbl )
{
	// デバイスのチェック
	SnlPixiMgr.DeviceCheck();

	// PC盤では疑似横持ちは切る
	if( SnlPixiMgr.m_isPC )
	{
		SnlPixiMgr.isQuasiLandscape = false;
	}
	
	// 画面サイズ等の割り出し
	var ScreenW = document.documentElement.clientWidth;
	var ScreenH = document.documentElement.clientHeight;
	
	SnlPixiMgr.m_DocumentClientSize.x = ScreenW;
	SnlPixiMgr.m_DocumentClientSize.y = ScreenH;
	
	var w = Math.ceil( ScreenW );
	var h = Math.ceil( ScreenW / SnlPixiMgr.m_Width * SnlPixiMgr.m_Height );
	if( SnlPixiMgr.isQuasiLandscape )
	{
		w = Math.ceil( ScreenW );
		h = Math.ceil( ScreenW / SnlPixiMgr.m_Height * SnlPixiMgr.m_Width );
	}
	
	if( SnlPixiMgr.isHBase )
	{
		h = Math.ceil(ScreenH);
		w = Math.ceil( ScreenH / SnlPixiMgr.m_Height * SnlPixiMgr.m_Width );
		
	}
	
	var ClientLeft = 0;
	var ClientTop = 0;
	
	// 携帯端末でない( ipod, iphone, ipad, android )
	if( !( !SnlPixiMgr.m_isPC || SnlPixiMgr.m_ForceMobileSize ) )
	{
		w = SnlPixiMgr.m_Width;
		h = SnlPixiMgr.m_Height;
		
		if( SnlPixiMgr.m_enableCenteringPC )
		{
			if( SnlPixiMgr.m_isCentering )
   			{
   				ClientLeft = Math.ceil( (ScreenW - w ) * 0.5 );
   				if( ClientLeft < 0 )
   				{
   					ClientLeft = 0;
   				}
   			}
			
			if( SnlPixiMgr.m_isCenteringH )
			{
				ClientTop = Math.ceil( (ScreenH - h) * 0.5 );
				if( ClientTop < 0 )
				{
					ClientTop = 0;
				}
			}
		}
		
	}
	else
	{
		SnlPixiMgr.m_TouchPaddingX = 0;
		SnlPixiMgr.m_TouchPaddingY = 0;
		
		if( window.innerHeight < h + SnlPixiMgr.m_AdsHeight )
		{
			h = Math.ceil( ScreenH-SnlPixiMgr.m_AdsHeight );
			
			if( SnlPixiMgr.isQuasiLandscape )
			{
				w = Math.ceil( h / SnlPixiMgr.m_Width * SnlPixiMgr.m_Height );
				ClientLeft = Math.ceil( (ScreenW - w ) * 0.5 );
			}
			else
			{
				w = Math.ceil( h / SnlPixiMgr.m_Height * SnlPixiMgr.m_Width );
				ClientLeft = Math.ceil( (ScreenW - w ) * 0.5 );
				SnlPixiMgr.m_TouchPaddingX = ClientLeft;
			}
			
		}
		else
		{
			if( SnlPixiMgr.m_isCenteringH )
			{
				ClientTop = Math.ceil( (ScreenH - h) * 0.5 );
				//SnlPixiMgr.m_TouchPaddingY = ClientTop;
			}
		}
	}
	//alert( w +","+ h + "," + window.innerHeight);
	
	if( CanvasModeTbl == null )
	{
		CanvasModeTbl = [];
		
		for( var i=0; i<ZMax; i++ )
		{
			CanvasModeTbl[i] = { ViewNo:0, PixiMode : true, RenderMode : 0, AllwaysUpdate : true };
			SnlPixiMgr.m_isUpdate[i] = true;
		}
		
	}
	else
	{
		for( var i=0; i<ZMax; i++ )
		{
			CanvasModeTbl[i].PixiMode = ( CanvasModeTbl[i].RenderMode == 0 );
			SnlPixiMgr.m_isUpdate[i] = true;
		}
	}
	
	
	SnlPixiMgr.m_InputRatio = w / SnlPixiMgr.m_Width;
	if( SnlPixiMgr.isQuasiLandscape )
	{
		SnlPixiMgr.m_InputRatio = w / SnlPixiMgr.m_Height;
	}
	
	//alert( m_InputRatio );
	
	SnlPixiMgr.m_CanvasModeTbl = CanvasModeTbl;

	var NowViewNo = -1;
	
	if( PIXI.VERSION.indexOf('v2.') != -1 )
	{
		SnlPixiMgr.PixiVersion = SnlPixiMgr.ePixiVersion.V2;
	}
	else if( PIXI.VERSION.indexOf('3.') == 0 )
	{
		SnlPixiMgr.PixiVersion = SnlPixiMgr.ePixiVersion.V3;
	}
	else if( PIXI.VERSION.indexOf('4.') == 0 )
	{
		SnlPixiMgr.PixiVersion = SnlPixiMgr.ePixiVersion.V4;
		PIXI.settings.MIPMAP_TEXTURES = false;
	}
	else if( PIXI.VERSION.indexOf('5.') == 0 )
	{
		SnlPixiMgr.PixiVersion = SnlPixiMgr.ePixiVersion.V5;
		PIXI.settings.MIPMAP_TEXTURES = false;
	}
	else
	{
		SnlPixiMgr.PixiVersion = SnlPixiMgr.ePixiVersion.V6;
		PIXI.settings.MIPMAP_TEXTURES = false;		
	}
	
	if( SnlPixiMgr.isQuasiLandscape )
	{
	    var canvas 		= document.createElement('canvas'); 
   		canvas.id 		= "SnlCanvas_QuasiLandscape" //ID
   			
   		canvas.height 	= SnlPixiMgr.m_Width;
   		canvas.width 	= SnlPixiMgr.m_Height;
   			
   		canvas.style.position = 'absolute'; 
   		if( SnlPixiMgr.m_isCentering )
   		{
   			canvas.style.left = ClientLeft + 'px'; 
   		}
   		else
   		{
			canvas.style.left = '0px';
		}
    	
		canvas.style.zIndex	= "'" + String(ZMax) +"'";
   		canvas.style.width = w + 'px';
   		canvas.style.height = h + 'px'; 
   		
   		canvas.addEventListener("touchmove",function(event){
  		  event.preventDefault();
		});   			
		
		document.getElementById('pixiview').appendChild(canvas);
		SnlPixiMgr.m_QuasiCanvas = canvas;
	}

	if( SnlPixiMgr.m_ScreenShotSupport )
	{
	    var canvas 		= document.createElement('canvas'); 
   		canvas.id 		= "SnlCanvas_ScreenShot"; //ID
   		canvas.style.position = 'absolute'; 


		var ScreenShotW = Math.round( SnlPixiMgr.m_Width * SnlPixiMgr.m_ScreenShotScale );
		var ScreenShotH = Math.round( SnlPixiMgr.m_Height * SnlPixiMgr.m_ScreenShotScale );

		canvas.style.zIndex	= "'50000'";
   		canvas.height 	= ScreenShotH;
   		canvas.width 	= ScreenShotW;
   		canvas.style.width = ScreenShotW + 'px';
   		canvas.style.height = ScreenShotH + 'px';  
   		canvas.style.display="none";
		
		document.getElementById('pixiview').appendChild(canvas);
		SnlPixiMgr.m_ScreenShotCanvas = canvas;
	}

	var LastCanvasID = "";
	// ステージを作る
	for( var i=ZMax-1; 0<=i; i-- )
	{
		if( NowViewNo != CanvasModeTbl[i].ViewNo )
		{				
			NowViewNo = CanvasModeTbl[i].ViewNo;
			if( SnlPixiMgr.m_ViewMax < NowViewNo )
			{
				SnlPixiMgr.m_ViewMax = NowViewNo;
			}
			// pixiviewの位置にcanvasを作成
		    var canvas 		= document.createElement('canvas'); 
   			canvas.id 		= "SnlCanvas_" + String(i);    //ID
   			canvas.style.position = 'absolute'; 
   			if( SnlPixiMgr.m_isCentering )
   			{
   				canvas.style.left = ClientLeft + 'px'; 
   			}
   			else
   			{
				canvas.style.left = '0px'; 
			}
			
			if( SnlPixiMgr.isQuasiLandscape )
			{
				canvas.style.display="none";
			}
			
	    	canvas.style.top  = ClientTop + 'px'; 
	    	
			canvas.style.zIndex	= "'" + String(ZMax-i) +"'";
   			canvas.height 	= SnlPixiMgr.m_Height;
   			canvas.width 	= SnlPixiMgr.m_Width;
   			canvas.style.width = w + 'px';
   			canvas.style.height = h + 'px';

   			LastCanvasID = "SnlCanvas_" + String(i);
   				
   			if( CanvasModeTbl[i].zIndex != null )
   			{
   				canvas.style.zIndex = CanvasModeTbl[i].zIndex;
   			}
   			
   			SnlPixiMgr.m_Canvas[NowViewNo] = canvas;

	   		
   			//canvas.getContext("2d").scale( 1.0 / window.devicePixelRatio, 1.0 / window.devicePixelRatio );
	   		document.getElementById('pixiview').appendChild(canvas);
	   		

	   		
	   		
	   		//SnlPixiMgr.m_PixiView[NowViewNo] = SnlPixiMgr.m_CanvasModeTbl[i].PixiMode;
	   		SnlPixiMgr.m_ViewType[NowViewNo] = SnlPixiMgr.m_CanvasModeTbl[i].RenderMode;
	   		
	   		
	   		// Pixi.js(WebGL)
	   		if( SnlPixiMgr.m_CanvasModeTbl[i].RenderMode == SnlPixiMgr.ViewType.PixiJS )
	   		{
				if( SnlPixiMgr.PixiVersion < SnlPixiMgr.ePixiVersion.V3 )
	   			{
					SnlPixiMgr.m_Stage[NowViewNo] = new PIXI.Stage(0x000000);
				}
				else
				{
					SnlPixiMgr.m_Stage[NowViewNo] = new PIXI.Container();
				}


				var opt = 
				{
					view : canvas,
					antialias   : false,
					preserveDrawingBuffer : false,
					resolution : 1.0,
					backgroundColor:0x000000
				};
				
				
				if( SnlPixiMgr.PixiVersion <= SnlPixiMgr.ePixiVersion.V5 )
	   			{
	   				opt.transparent = true;
	   			}
	   			else
	   			{
	   				opt.backgroundAlpha = 0;
	   			}

				// レンダラーを作る
				if( SnlPixiMgr.PixiVersion <= SnlPixiMgr.ePixiVersion.V4 )
	   			{
					SnlPixiMgr.m_Renderer[NowViewNo] = PIXI.autoDetectRenderer( SnlPixiMgr.m_Width * SnlPixiMgr.m_DispRatio, SnlPixiMgr.m_Height * SnlPixiMgr.m_DispRatio, opt);
				}
				else
				{
					opt.width = SnlPixiMgr.m_Width * SnlPixiMgr.m_DispRatio;
					opt.height = SnlPixiMgr.m_Height * SnlPixiMgr.m_DispRatio;
					SnlPixiMgr.m_Renderer[NowViewNo] = PIXI.autoDetectRenderer( opt );
				}
					var DummyDisp = new PIXI.Graphics();
					DummyDisp.clear();
					DummyDisp.beginFill(0xFFFFFF, 0);
						DummyDisp.drawRect( -1, -1, 2, 2 );
					DummyDisp.endFill();
					DummyDisp.position.x = 0;
					DummyDisp.position.y = 0;
					
					
					SnlPixiMgr.m_Stage[NowViewNo].addChild( DummyDisp );

				// レンダラーのviewをDOMに追加する
				//document.getElementById("pixiview").appendChild( SnlPixiMgr.m_Renderer[NowViewNo].view );
			}
			// Create.js(Canvas)
			else if( SnlPixiMgr.m_CanvasModeTbl[i].RenderMode == SnlPixiMgr.ViewType.CreateJS )
			{
				SnlPixiMgr.m_Stage[NowViewNo] = new createjs.Stage(canvas);
				
				//SnlPixiMgr.m_Stage[NowViewNo] = new createjs.StageGL(canvas,{transparent: true});
				//SnlPixiMgr.m_Stage[NowViewNo].setClearColor(0xFFFFFF00);
				
				createjs.Ticker.setFPS(SnlPixiMgr.CreateJsFPS);
				createjs.Ticker.addEventListener("tick", SnlPixiMgr.m_Stage[NowViewNo]);
				
				if(createjs.Touch.isSupported() == true)
				{
					createjs.Touch.enable(SnlPixiMgr.m_Stage[NowViewNo], false, false);
				}
				SnlPixiMgr.m_Stage[NowViewNo].preventSelection = false;
			}
			else
			{
				// レンダラ作成
				var Data = SnlPixiMgr.m_CanvasModeTbl[i];

				SnlPixiMgr.m_Renderer[NowViewNo] = new THREE.WebGLRenderer( { 'canvas' : canvas, antialias: true } );
				SnlPixiMgr.m_Renderer[NowViewNo].outputEncoding = THREE.sRGBEncoding;
				
				// クオリティ設定
				switch( SnlPixiMgr.ThreeQuality )
				{
					case SnlPixiMgr.eThreeQuality.High:
						SnlPixiMgr.m_Renderer[NowViewNo].setPixelRatio( window.devicePixelRatio );
						SnlPixiMgr.m_Renderer[NowViewNo].shadowMap.enabled = true;
					break;
					
					case SnlPixiMgr.eThreeQuality.Low:
						SnlPixiMgr.m_Renderer[NowViewNo].setPixelRatio( 0.5 );
					break;
				}
				
				// デフォルトシーンの作成
				var CreateDefaultScene = true;
				if( "CreateDefaultScene" in Data )
				{
					 CreateDefaultScene = Data.CreateDefaultScene;
				}
				
				if( CreateDefaultScene )
				{
					var FOV = 90;
					var Aspect = SnlPixiMgr.m_Width / SnlPixiMgr.m_Height;
					var Near = 0.5;
					var Far  = 200;
					
					if( "FOV" in SnlPixiMgr.m_CanvasModeTbl[i] )
					{
						FOV  = SnlPixiMgr.m_CanvasModeTbl[i].FOV;
						Near = SnlPixiMgr.m_CanvasModeTbl[i].Near;
						Far  = SnlPixiMgr.m_CanvasModeTbl[i].Far;
					}
					SnlPixiMgr.m_Stage[NowViewNo] = new THREE.Scene();
					SnlPixiMgr.m_Camera[NowViewNo] = new THREE.PerspectiveCamera( FOV, Aspect, Near, Far);
				}
				else
				{
					SnlPixiMgr.m_Stage[NowViewNo] = null;
					SnlPixiMgr.m_Camera[NowViewNo] = null;
				}
			}
		}
		
		SnlPixiMgr.m_CanvasModeTbl[i].CanvasID = LastCanvasID;
	}
	



	// ステージにマウス周りのイベントコールバックを追加
	if( SnlPixiMgr.PixiVersion < SnlPixiMgr.ePixiVersion.V3 )
	{
		SnlPixiMgr.m_Stage[0].mousedown	= SnlPixiMgr.EvMouseDown;
		SnlPixiMgr.m_Stage[0].mouseup	= SnlPixiMgr.EvMouseUp;
	}
	else
	{
		if (window.PointerEvent)
		{
			if( SnlPixiMgr.m_isPC )
			{
		        // IE11以上＋モダンブラウザ用(※現在推奨)
				document.addEventListener("pointermove", SnlPixiMgr.EvMouseMove);
				document.addEventListener("pointerdown", SnlPixiMgr.EvMouseDown);
				document.addEventListener("pointerup" , SnlPixiMgr.EvMouseUp);
			}
			else
			{
				// iOS13以降で取り扱いが変更されたのでとりあえず登録しない( iOS以外ならGetVersion_iOSは0を返す )
				if(	1300 <= SnlPixiMgr.GetVersion_iOS() )
				{
					
				}
				else
				{
					document.addEventListener("mousemove" , SnlPixiMgr.EvMouseMove );
					document.addEventListener("mousedown" , SnlPixiMgr.EvMouseDown);
					document.addEventListener("mouseup" , SnlPixiMgr.EvMouseUp);
				}
			}
		}
		else
		{
			document.addEventListener("mousemove" , SnlPixiMgr.EvMouseMove );
			document.addEventListener("mousedown" , SnlPixiMgr.EvMouseDown);
			document.addEventListener("mouseup" , SnlPixiMgr.EvMouseUp);
		}
	}
	
	// タッチイベントを登録
	document.addEventListener("touchstart",		SnlPixiMgr.EvTouchStart);
	document.addEventListener("touchend",		SnlPixiMgr.EvTouchEnd);
	document.addEventListener("touchmove",		SnlPixiMgr.EvTouchMove);
	document.addEventListener("touchcancel",	SnlPixiMgr.EvTouchCancel);
	
	if( SnlPixiMgr.m_EnableMouseWheel )
	{
		document.addEventListener("mousewheel", SnlPixiMgr.EvMouseWheel );
	}
	
	// 非表示非表示系イベント登録
  	var hidden, visibilityChange;
  	if (typeof document.hidden !== "undefined") 
  	{
    	hidden = "hidden";
    	visibilityChange = "visibilitychange";
  	} 
  	else if (typeof document.mozHidden !== "undefined") 
  	{
    	hidden = "mozHidden";
    	visibilityChange = "mozvisibilitychange";
  	}
  	else if (typeof document.msHidden !== "undefined") 
  	{
    	hidden = "msHidden";
    	visibilityChange = "msvisibilitychange";
  	}
  	else if (typeof document.webkitHidden !== "undefined")
  	{
    	hidden = "webkitHidden";
    	visibilityChange = "webkitvisibilitychange";
  	}
  	document.addEventListener(visibilityChange, SnlPixiMgr.VisibilityChange, false );
	
	SnlPixiMgr.m_ZMax = ZMax;
	
	SnlPixiMgr.m_DispSortSprite = [];
	// スプライト描画ソート用スプライトの作成
	for( var i=SnlPixiMgr.m_ZMax-1; 0<=i; i-- )
	{
		// Pixi.js(WebGL)
		if( SnlPixiMgr.m_CanvasModeTbl[i].PixiMode )
		{
			SnlPixiMgr.m_DispSortSprite[i] = new PIXI.Sprite(null);
			SnlPixiMgr.m_Stage[SnlPixiMgr.m_CanvasModeTbl[i].ViewNo].addChild(SnlPixiMgr.m_DispSortSprite[i]);
		}
	}
	

};

SnlPixiMgr.GetVersion_iOS = function()
{
	var UserAgent = navigator.userAgent.toLowerCase();
	var iOSVer = 0;

	if ( 0 < UserAgent.indexOf("cpu os 1") )
	{
		UserAgent.match(/cpu os (\w+){1,4}/g);
		iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 4);
	}
	else
	{
		UserAgent.match(/cpu os (\w+){1,3}/g);
		iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 3);
	}
	
	if( 0 < iOSVer )
	{
		return iOSVer;
	}
	
	if ( 0 < UserAgent.indexOf("iphone os 1") )
	{
		UserAgent.match(/iphone os (\w+){1,4}/g);
		iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 4);
	}
	else
	{
		UserAgent.match(/iphone os (\w+){1,3}/g);
		iOSVer = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 3);
	}
	
	return iOSVer;
}

SnlPixiMgr.ScreenResize = function()
{
	SnlPixiMgr.m_ResizeExec = true;

	// 画面サイズ等の割り出し
	var ScreenW = document.documentElement.clientWidth;
	var ScreenH = document.documentElement.clientHeight;
	
	SnlPixiMgr.m_DocumentClientSize.x = ScreenW;
	SnlPixiMgr.m_DocumentClientSize.y = ScreenH;
	
	var w = Math.ceil( ScreenW );
	var h = Math.ceil( ScreenW / SnlPixiMgr.m_Width * SnlPixiMgr.m_Height );
	var ClientLeft = 0;
	var ClientTop = 0;
	
	if( SnlPixiMgr.isQuasiLandscape )
	{
		h = Math.ceil( ScreenW / SnlPixiMgr.m_Height * SnlPixiMgr.m_Width );
	}

	
	// 携帯端末でない( ipod, iphone, ipad, android )
	if( !( !SnlPixiMgr.m_isPC || SnlPixiMgr.m_ForceMobileSize ) )
	{
		w = SnlPixiMgr.m_Width;
		h = SnlPixiMgr.m_Height;
		
		/*
		if( ScreenH < SnlPixiMgr.m_Height )
		{
			h = ScreenH;
			w = ScreenH / SnlPixiMgr.m_Height * SnlPixiMgr.m_Width;
		}
		*/

		if( SnlPixiMgr.m_enableCenteringPC )
		{
			if( SnlPixiMgr.m_isCentering )
   			{
   				ClientLeft = Math.ceil( (ScreenW - w ) * 0.5 );
   				if( ClientLeft < 0 )
   				{
   					ClientLeft = 0;
   				}
   			}
			
			if( SnlPixiMgr.m_isCenteringH )
			{
				ClientTop = Math.ceil( (ScreenH - h) * 0.5 );
				if( ClientTop < 0 )
				{
					ClientTop = 0;
				}
			}
		}
		

	}
	else
	{
		SnlPixiMgr.m_TouchPaddingX = 0;
		SnlPixiMgr.m_TouchPaddingY = 0;
		if( window.innerHeight < h + SnlPixiMgr.m_AdsHeight )
		{
			h = Math.ceil( ScreenH-SnlPixiMgr.m_AdsHeight );
			
			if( SnlPixiMgr.isQuasiLandscape )
			{
				w = Math.ceil( h / SnlPixiMgr.m_Width * SnlPixiMgr.m_Height );
				ClientLeft = Math.ceil( (ScreenW - w ) * 0.5 );
			}
			else
			{
				w = Math.ceil( h / SnlPixiMgr.m_Height * SnlPixiMgr.m_Width );
				ClientLeft = Math.ceil( (ScreenW - w ) * 0.5 );
				SnlPixiMgr.m_TouchPaddingX = ClientLeft;
			}
			
			if( SnlPixiMgr.m_isCenteringH )
			{
				ClientTop = Math.ceil( (ScreenH - h) * 0.5 );
				//SnlPixiMgr.m_TouchPaddingY = ClientTop;
			}
			
		}
		else
		{
			if( SnlPixiMgr.m_isCenteringH )
			{
				ClientTop = Math.ceil( (ScreenH - h) * 0.5 );
				//SnlPixiMgr.m_TouchPaddingY = ClientTop;
			}
		}
	}
	
	if( SnlPixiMgr.isQuasiLandscape )
	{
		SnlPixiMgr.m_InputRatio = w / SnlPixiMgr.m_Height;
	}
	else
	{
		SnlPixiMgr.m_InputRatio = w / SnlPixiMgr.m_Width;
	}
	
	for( var i=0; i<SnlPixiMgr.m_Canvas.length; i++ )
	{
		if( SnlPixiMgr.m_isCentering )
   		{
   			SnlPixiMgr.m_Canvas[i].style.left = ClientLeft + 'px'; 
   		}
   		else
   		{
			SnlPixiMgr.m_Canvas[i].style.left = '0px'; 
		}
		
		SnlPixiMgr.m_Canvas[i].style.top  = ClientTop + 'px'; 
		
		SnlPixiMgr.m_Canvas[i].style.width = w + 'px';
   		SnlPixiMgr.m_Canvas[i].style.height = h + 'px';
	}
	
	if( SnlPixiMgr.isQuasiLandscape )
	{
		if( SnlPixiMgr.m_isCentering )
   		{
   			SnlPixiMgr.m_QuasiCanvas.style.left = ClientLeft + 'px'; 
   		}
   		else
   		{
			SnlPixiMgr.m_QuasiCanvas.style.left = '0px'; 
		}
		
		SnlPixiMgr.m_QuasiCanvas.style.top  = ClientTop + 'px'; 
		
		SnlPixiMgr.m_QuasiCanvas.style.width = w + 'px';
   		SnlPixiMgr.m_QuasiCanvas.style.height = h + 'px';		
	}
	
};

// テクスチャ読み込み - 旧Snl互換用
SnlPixiMgr.LoadTexture = function( ImgPathArray, ImgDataArray )
{
	SnlPixiMgr.LoadBankTexture( 0, ImgPathArray );
},

// バンク内のテクスチャを破棄する
SnlPixiMgr.UnloadBankTexture = function( BankNo )
{
	if( SnlPixiMgr.m_Loader == null )
	{
		return;
	}
	
	if( SnlPixiMgr.m_Loader.length <= BankNo )
	{
		return;
	}
	
	if( SnlPixiMgr.m_Loader[BankNo] == null )
	{
		return;
	}
	
	if( SnlPixiMgr.m_isPreferentialMemory )
	{
		SnlPixiMgr.m_Loader[BankNo].Destroy();
		SnlPixiMgr.m_Loader[BankNo] = null;
		return;
	}
	
	SnlPixiMgr.m_Loader[BankNo].reset();
	SnlPixiMgr.m_Loader[BankNo] = null;
	
	SnlPixiMgr.m_TextureNum[BankNo] = 0;
	
	for( var j=0; j<SnlPixiMgr.m_SpriteSheet[BankNo]._images.length; j++ )
	{
		SnlPixiMgr.m_TextureData[BankNo][j] = null;
		
		if( SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
		{
			PIXI.utils.TextureCache["Img_" + String(BankNo) + "_" + String(j)].destroy( true );
			PIXI.utils.TextureCache["Img_" + String(BankNo) + "_" + String(j)] = null;
		}
		else
		{
			PIXI.TextureCache["Img_" + String(BankNo) + "_" + String(j)].destroy( true );
			PIXI.TextureCache["Img_" + String(BankNo) + "_" + String(j)] = null;
		}
	}
	SnlPixiMgr.m_TextureData[BankNo] = null;
	
	for( var i=0; i<SnlPixiMgr.m_TexOrigin[BankNo].length; i++ )
	{
		SnlPixiMgr.m_TexOrigin[BankNo][i].destroy( true );
		SnlPixiMgr.m_TexOrigin[BankNo][i] = null;
	}
	SnlPixiMgr.m_TexOrigin[BankNo] = null;
	
	for( var i=0; i<SnlPixiMgr.m_SpriteSheet[BankNo]._images.length; i++ )
	{
		SnlPixiMgr.m_SpriteSheet[BankNo]._images[i].image = null;
		SnlPixiMgr.m_SpriteSheet[BankNo]._images[i] = null;
	}
	SnlPixiMgr.m_SpriteSheet[BankNo] = null;
},

// バンク毎のテクスチャ読み込み
SnlPixiMgr.LoadBankTexture = function( BankNo, ImgPathArray )
{
	SnlPixiMgr.m_NowLoadBank.push( BankNo );
	SnlPixiMgr.m_NowLoadImgPath.push( ImgPathArray );
	
	// ロード
	if( SnlPixiMgr.m_NowLoadBank.length == 1 )
	{
		SnlPixiMgr.LoadBankTextureCore();
	}
},
	
SnlPixiMgr.InitBank = function( BankNo, ImageMax )
{
	if( SnlPixiMgr.m_isPreferentialMemory )
	{
		SnlPixiMgr.m_Loader[BankNo] = new SnlImageMgr();
		SnlPixiMgr.m_Loader[BankNo].Init( ImageMax );
	}
},

// 一枚ずつ指定のテクスチャを読み込み
SnlPixiMgr.LoadBankTextureOnes = function( BankNo, ImgPath )
{
	if( SnlPixiMgr.m_isPreferentialMemory )
	{
		return SnlPixiMgr.m_Loader[BankNo].GetTexture( ImgPath );
	}
	
	return null;
};
	
// 指定テクスチャのTextureNoを取得
SnlPixiMgr.GetTextureNo = function( BankNo, ImgPath )
{
	if( SnlPixiMgr.m_isPreferentialMemory )
	{
		return SnlPixiMgr.m_Loader[BankNo].GetIdx( ImgPath );
	}
	
	return -1;
};

// 現在有効なバンクを配列で取得
SnlPixiMgr.GetEnableBankList = function()
{
	var Ret = [];
	if( SnlPixiMgr.m_Loader == null )
	{
		return Ret;
	}
	
	for( var Key in SnlPixiMgr.m_Loader )
	{
		if( SnlPixiMgr.m_Loader[Key] != null )
		{
			Ret.push( parseInt(Key) );
		}
	}
	
	return Ret;
}

// バンク毎のテクスチャ読み込みコア部分
SnlPixiMgr.LoadBankTextureCore = function()
{
	SnlPixiMgr.m_TextureLoaded = false;
	
	var BankNo = SnlPixiMgr.m_NowLoadBank[0];
	var ImgPathArray = SnlPixiMgr.m_NowLoadImgPath[0];
	
	
	
	if( SnlPixiMgr.m_Loader == null )
	{
		SnlPixiMgr.m_Loader = [];
		SnlPixiMgr.m_SpriteSheet = [];
		SnlPixiMgr.m_TextureData = [];
		SnlPixiMgr.m_TextureNum = [];
		SnlPixiMgr.m_TexOrigin = [];
		SnlPixiMgr.m_TexturePackNum= [];
	}
	
	if( SnlPixiMgr.m_isPreferentialMemory )
	{
		SnlPixiMgr.m_Loader[BankNo] = new SnlImageMgr();
		SnlPixiMgr.m_Loader[BankNo].m_SetPixiMgrProgress = true;
		
		if( SnlPixiMgr.m_isPC )
		{
			SnlPixiMgr.m_Loader[BankNo].Init_LoadAll( ImgPathArray, 128,  SnlPixiMgr.handleFileComplete_PreferentialMemory );
		}
		else
		{
			SnlPixiMgr.m_Loader[BankNo].Init_LoadAll( ImgPathArray, 16,  SnlPixiMgr.handleFileComplete_PreferentialMemory );
		}
		return;
	};
	

	
	var manifest = [];
	
	
	SnlPixiMgr.m_TextureNum[BankNo] = ImgPathArray.length;
	
	for( var i=0; i<ImgPathArray.length; i++ )
	{
		manifest[i] = {src: SnlPixiMgr.m_BasePath+ImgPathArray[i], id: "SnlImage_" + BankNo + "_" + String(i) };
	};
	
	SnlPixiMgr.m_TextureData[BankNo] = [];
	
	if( SnlPixiMgr.m_BasePath == "" )
	{
		SnlPixiMgr.m_Loader[BankNo] = new createjs.LoadQueue( false );
	}
	else 
	{
		// BasePath設定時はクロスドメイン許可
		SnlPixiMgr.m_Loader[BankNo] = new createjs.LoadQueue( false, "", "Anonymous");
	}
	
	if( SnlPixiMgr.m_isPC )
	{
		SnlPixiMgr.m_Loader[BankNo].setMaxConnections(128);
	}
	else
	{
		SnlPixiMgr.m_Loader[BankNo].setMaxConnections(4);
	}
	SnlPixiMgr.m_Loader[BankNo].on( "complete", SnlPixiMgr.handleFileComplete_PreferentialDrawSpeed  );
	SnlPixiMgr.m_Loader[BankNo].on("progress", function() { SnlPixiMgr.m_NowLoadProgress = SnlPixiMgr.m_Loader[BankNo].progress;/*console.log("Progress:", SnlPixiMgr.m_Loader[BankNo].progress, event.progress);*/ });
	SnlPixiMgr.m_Loader[BankNo].loadManifest( manifest );
	
	//SnlPixiMgr.m_DispSortSprite = [];
};

// 画像読み込み完了コールバック
SnlPixiMgr.handleFileComplete_PreferentialMemory = function(event)
{
	SnlPixiMgr.LoadNextBank();
};

SnlPixiMgr.LoadNextBank = function()
{
	SnlPixiMgr.m_NowLoadBank.shift();
	SnlPixiMgr.m_NowLoadImgPath.shift();
	
	if( SnlPixiMgr.m_NowLoadBank.length <= 0 )
	{
		SnlPixiMgr.m_TextureLoaded = true;
	}
	else
	{
		if( !SnlPixiMgr.m_isPreferentialMemory )
		{
			SnlPixiMgr.LoadBankTextureCore();
		}
		else
		{
			var Next = SnlPixiMgr.m_NowLoadBank[0];
			if( this.m_Loader[Next] != null && this.m_Loader[Next].isPacking )
			{
				SnlPixiMgr.LoadPackTexturePMCore();
			}
			else
			{
				SnlPixiMgr.LoadBankTextureCore();
			}
		}
	}
}

SnlPixiMgr.PackingData = null;
SnlPixiMgr.handleFileComplete_PreferentialDrawSpeed  = function(event) 
{
	
	var BankNo = SnlPixiMgr.m_NowLoadBank[0];
	// 動的にスプライトシートを作成する
	var SpriteBuilder = new createjs.SpriteSheetBuilder();
	SpriteBuilder.maxWidth 		= SnlPixiMgr.m_TexturePackSize;
	SpriteBuilder.maxHeight 	= SnlPixiMgr.m_TexturePackSize;
	SpriteBuilder.padding 		= 2;
		
	for( var i=0; i<SnlPixiMgr.m_TextureNum[BankNo]; i++ )
	{
		SpriteBuilder.addFrame(new createjs.Bitmap(SnlPixiMgr.m_Loader[BankNo].getResult( "SnlImage_" + BankNo + "_" + String(i) )));
   	}
   	
   	SnlPixiMgr.m_SpriteSheet[BankNo] = SpriteBuilder.build();


	var TimeStamp2 = String( Date.now() );
	
	if( SnlPixiMgr.c_OutputSpriteSheet )
	{
		if( SnlPixiMgr.PackingData == null )
		{
			SnlPixiMgr.PackingData = 
			{
				FrameData : {},
				ImgDataFileName : {},
			};
		}
		
		SnlPixiMgr.PackingData.ImgDataFileName[BankNo] = [];
	}
	

	// Easel.js用スプライトシートからPixi.js用のスプライトシートも作成する
	SnlPixiMgr.m_TexOrigin[BankNo] = [];
	for( var i=0; i<SnlPixiMgr.m_SpriteSheet[BankNo]._images.length; i++ )
	{
		SnlPixiMgr.m_TexOrigin[BankNo][i] = PIXI.Texture.fromCanvas( SnlPixiMgr.m_SpriteSheet[BankNo]._images[i] );
		
		if( SnlPixiMgr.c_OutputSpriteSheet )
		{
			SnlPixiMgr.SaveCanvas( SnlPixiMgr.m_SpriteSheet[BankNo]._images[i], "Img_" + BankNo + "_" + String(i) + ".png" );
			SnlPixiMgr.PackingData.ImgDataFileName[BankNo][i] = "Img_" + BankNo + "_" + String(i) + ".png?t=" + TimeStamp2;
		}
	}
	
	if( SnlPixiMgr.c_OutputSpriteSheet )
	{
		// 保存用フレームデータ
		var FrameDatas = [];
		for( var i=0; i<SnlPixiMgr.m_SpriteSheet[BankNo]._frames.length; i++ )
		{
			var frame = SnlPixiMgr.m_SpriteSheet[BankNo].getFrame( i );
			for( var j=0; j<SnlPixiMgr.m_SpriteSheet[BankNo]._images.length; j++ )
			{
				if( SnlPixiMgr.m_SpriteSheet[BankNo]._images[j] != frame.image )
				{
					continue;
				}
				
				FrameDatas[i] = 
				{
					x: frame.rect.x,
					y: frame.rect.y,
					w: frame.rect.width - SpriteBuilder.padding * 2,
					h: frame.rect.height - SpriteBuilder.padding * 2,
					p: j
				};
			}
		}
		SnlPixiMgr.SaveObjectToJsonText( FrameDatas, "Frame_" + BankNo  + ".json" );
		
		SnlPixiMgr.PackingData.FrameData[BankNo] = FrameDatas;
	}
	
	
	
	for( var i=0; i<SnlPixiMgr.m_SpriteSheet[BankNo]._frames.length; i++ )
	{
		var frame = SnlPixiMgr.m_SpriteSheet[BankNo].getFrame( i );
		var texSize	= new PIXI.Rectangle( frame.rect.x, frame.rect.y, frame.rect.width - SpriteBuilder.padding * 2, frame.rect.height - SpriteBuilder.padding * 2 );
		
		for( var j=0; j<SnlPixiMgr.m_SpriteSheet[BankNo]._images.length; j++ )
		{
			if( SnlPixiMgr.m_SpriteSheet[BankNo]._images[j] == frame.image )
			{
				SnlPixiMgr.m_TextureData[BankNo][i] = { w:frame.rect.width - SpriteBuilder.padding * 2, h:frame.rect.height - SpriteBuilder.padding * 2 };
				if( SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
				{
					PIXI.utils.TextureCache["Img_" + String(BankNo) + "_" + String(i)] = new PIXI.Texture( SnlPixiMgr.m_TexOrigin[BankNo][j].baseTexture, texSize );
				}
				else
				{
					PIXI.TextureCache["Img_" + String(BankNo) + "_" + String(i)] = new PIXI.Texture( SnlPixiMgr.m_TexOrigin[BankNo][j].baseTexture, texSize );
				}
			}
		}
	}
	
	SnlPixiMgr.LoadNextBank();
}

SnlPixiMgr.OutputPackingData = function( ImgPathData )
{
	if( ImgPathData != null )
	{
		for( var i=0; i<ImgPathData.length; i++ )
		{
			for( var j=0; j<SnlPixiMgr.PackingData.FrameData[i].length; j++ )
			{
				SnlPixiMgr.PackingData.FrameData[i][j].BaseImagePath = ImgPathData[i][j];
			}
		}
	}
	
	
	SnlPixiMgr.SaveObjectToJsonText( SnlPixiMgr.PackingData, "ImgPackingData.json" );
	
	var js = "var ImgPackingData =\n" + JSON.stringify( SnlPixiMgr.PackingData, null, '\t' ) + ";";
	SnlPixiMgr.SaveText( js,  "ImgPackingData.js" );
};
	
// パックされたテクスチャの読み込み(メモリ効率優先版)
SnlPixiMgr.LoadPackTexturePM = function( BankNo, PackImageBasePath, PackImageFileList, FrameData )
{
	if( !SnlPixiMgr.m_isPreferentialMemory )
	{
		if( SnlPixiMgr.isDebug )
		{
			console.log("描画速度優先時はSnlPixiMgr.LoadBankTexture_PackDataを使用してください");
		}
		return;
	}
	
	var MaxConnections = 16;
	if( SnlPixiMgr.m_isPC )
	{
		MaxConnections = 128;
	}
	
	SnlPixiMgr.m_NowLoadBank.push( BankNo );
	SnlPixiMgr.m_NowLoadImgPath.push( PackImageFileList );
	
	if( SnlPixiMgr.m_Loader == null )
	{
		SnlPixiMgr.m_Loader = [];
	}
	
	SnlPixiMgr.m_Loader[BankNo] = new SnlPackImageMgr();
	SnlPixiMgr.m_Loader[BankNo].Init( PackImageBasePath, PackImageFileList, FrameData, MaxConnections, SnlPixiMgr.handleFileComplete_PreferentialMemory );
	SnlPixiMgr.m_Loader[BankNo].m_SetPixiMgrProgress = true;
	
	// ロード
	if( SnlPixiMgr.m_NowLoadBank.length == 1 )
	{
		SnlPixiMgr.LoadPackTexturePMCore();
	}
}

SnlPixiMgr.LoadPackTexturePMCore = function()
{
	SnlPixiMgr.m_TextureLoaded = false;
	var BankNo = SnlPixiMgr.m_NowLoadBank[0];
	SnlPixiMgr.m_Loader[BankNo].LoadTexture();
}

// パックされたテクスチャの読み込み(動作速度優先版)
SnlPixiMgr.LoadTexture_PackData = function( ImgPathArray, ImgDataArray, FrameDataPath )
{
	SnlPixiMgr.LoadBankTexture_PackData( 0, ImgPathArray, ImgDataArray, FrameDataPath );
}

// パックされたテクスチャの読み込み(動作速度優先版)
SnlPixiMgr.LoadBankTexture_PackData = function( BankNo, ImgPathArray, ImgDataArray, FrameDataPath )
{
	if( SnlPixiMgr.m_isPreferentialMemory )
	{
		if( SnlPixiMgr.isDebug )
		{
			console.log("メモリ効率優先時はSnlPixiMgr.LoadPackTexturePMを使用してください");
		}
		return;
	}
	
	
	SnlPixiMgr.m_NowLoadBank = BankNo;
	
	if( SnlPixiMgr.m_Loader == null )
	{
		SnlPixiMgr.m_Loader = [];
		SnlPixiMgr.m_SpriteSheet = [];
		SnlPixiMgr.m_TextureData = [];
		SnlPixiMgr.m_TextureNum = [];
		SnlPixiMgr.m_TexOrigin = [];
		SnlPixiMgr.m_TexturePackNum = [];
	}
	
	
	SnlPixiMgr.m_TextureData[BankNo] = ImgDataArray;
	SnlPixiMgr.m_TextureNum[BankNo] = SnlPixiMgr.m_TextureData.length;
	SnlPixiMgr.m_TexturePackNum[BankNo] = ImgPathArray.length;
	
	SnlPixiMgr.m_TextureLoaded = false;
	
	var manifest = [];
	
	for( var i=0; i<ImgPathArray.length; i++ )
	{
		manifest[i] = {src: SnlPixiMgr.m_BasePath + ImgPathArray[i], id: "SnlImage_" + BankNo + "_" + String(i) };
	};
	manifest[ImgPathArray.length] = {src: FrameDataPath, id: "SnlFrameData" };
	
	
	if( SnlPixiMgr.m_BasePath == "" )
	{
		SnlPixiMgr.m_Loader[BankNo] = new createjs.LoadQueue( false );
	}
	else 
	{
		// BasePath設定時はクロスドメイン許可
		SnlPixiMgr.m_Loader[BankNo] = new createjs.LoadQueue( false, "", "Anonymous");
	}
	
	if( SnlPixiMgr.m_isPC )
	{
		SnlPixiMgr.m_Loader[BankNo].setMaxConnections(128);
	}
	else
	{
		SnlPixiMgr.m_Loader[BankNo].setMaxConnections(4);
	}
	SnlPixiMgr.m_Loader[BankNo].on("complete", SnlPixiMgr.handleFileComplete_PackData );
	SnlPixiMgr.m_Loader[BankNo].loadManifest( manifest );
	
	//SnlPixiMgr.m_DispSortSprite = [];
};

// パックされたテクスチャの読み込みを完了
SnlPixiMgr.handleFileComplete_PackData = function(event) 
{
	var BankNo = SnlPixiMgr.m_NowLoadBank;
	SnlPixiMgr.m_TextureLoaded = true;

	// FrameDataの取りだし
	var FrameData = JSON.parse( SnlPixiMgr.m_Loader[BankNo].getResult( "SnlFrameData" ) );

	// 動的にスプライトシートを作成する（ImageをCanvasに変換するのに手頃なのでこれを使う）
	SpriteBuilder = new createjs.SpriteSheetBuilder();
	SpriteBuilder.maxWidth 	= SnlPixiMgr.m_TexturePackSize;
	SpriteBuilder.maxHeight = SnlPixiMgr.m_TexturePackSize;
	SpriteBuilder.padding 	= 0;
	
	for( var i=0; i<SnlPixiMgr.m_TexturePackNum[BankNo]; i++ )
	{
		SpriteBuilder.addFrame(new createjs.Bitmap(SnlPixiMgr.m_Loader[BankNo].getResult( "SnlImage_" + BankNo + "_" + String(i) )));
   	}
   	SnlPixiMgr.m_SpriteSheet[BankNo] = SpriteBuilder.build();
   	
   	SnlPixiMgr.m_TexOrigin[BankNo] = [];
	
	for( var i=0; i<SnlPixiMgr.m_SpriteSheet[BankNo]._frames.length; i++ )
	{
		var frame = SnlPixiMgr.m_SpriteSheet[BankNo].getFrame( i );
		for( var j=0; j<SnlPixiMgr.m_SpriteSheet[BankNo]._images.length; j++ )
		{
			if( SnlPixiMgr.m_SpriteSheet[BankNo]._images[j] == frame.image )
			{
				SnlPixiMgr.m_TexOrigin[BankNo][i] = PIXI.Texture.fromCanvas( SnlPixiMgr.m_SpriteSheet[BankNo]._images[j] );
			}
		}
	}
	
	for( var i=0; i<FrameData.length; i++ )
	{
		var texSize	= new PIXI.Rectangle
		( 
			FrameData[i].x,
			FrameData[i].y,
			FrameData[i].w,
			FrameData[i].h 
		);
		
		if( SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
		{
			PIXI.utils.TextureCache["Img_" + String(BankNo) + "_" + String(i)] = new PIXI.Texture( SnlPixiMgr.m_TexOrigin[BankNo][FrameData[i].p].baseTexture, texSize );
		}
		else
		{
			PIXI.TextureCache["Img_" + String(BankNo) + "_" + String(i)] = new PIXI.Texture( SnlPixiMgr.m_TexOrigin[BankNo][FrameData[i].p].baseTexture, texSize );
		}
	}
};


	
// Canvasの内容をテクスチャとして保存
SnlPixiMgr.SaveCanvas = function( canvas, fileName )
{
	var b = canvas.toDataURL();
	var bin = atob(b.split(',')[1]);  
	var buffer = new Uint8Array(bin.length);  
	for (var j = 0; j < bin.length; j++) 
	{  
 		buffer[j] = bin.charCodeAt(j);  
	} 
	var blob = new Blob([buffer.buffer], {type: "image/png"});
	
	
	if (window.navigator.msSaveBlob) 
	{
		// for IE
		window.navigator.msSaveBlob(blob, fileName)
	}
	else //if (window.webkitURL && window.webkitURL.createObject) 
	{
		var a = document.createElement('a');
		a.download = fileName;
		a.target   = '_blank';
		// for Chrome
		a.href = window.webkitURL.createObjectURL(blob);
		a.click();
	}
};

// オブジェクトをJsonのテキストとしてローカルに保存
SnlPixiMgr.SaveObjectToJsonText = function( objData, fileName )
{
	var buf = JSON.stringify( objData, null, '\t' );
	SnlPixiMgr.SaveText( buf, fileName );
};

SnlPixiMgr.SaveText = function( text, fileName )
{
	var blob = new Blob([text],{type: "text/html"});
	if (window.navigator.msSaveBlob) 
	{
		// for IE
		window.navigator.msSaveBlob(blob, fileName)
	}
	else //if (window.webkitURL && window.webkitURL.createObject) 
	{
		var a = document.createElement('a');
		a.download = fileName;
		a.target   = '_blank';
		// for Chrome
		a.href = window.webkitURL.createObjectURL(blob);
		a.click();
	}
};

// オブジェクトをバイナリとしてローカルに保存
SnlPixiMgr.SaveObjectToBinary = function( objData, fileName )
{
	
	var blob = new Blob([objData],{type: "application/octet-stream"});
	if (window.navigator.msSaveBlob) 
	{
		// for IE
		window.navigator.msSaveBlob(blob, fileName)
	}
	else// if (window.webkitURL && window.webkitURL.createObject) 
	{
		var a = document.createElement('a');
		a.download = fileName;
		a.target   = '_blank';
		// for Chrome
		a.href = window.webkitURL.createObjectURL(blob);
		a.click();
	}
};

// テクスチャは読み込み済みか？
SnlPixiMgr.isLoadedTexture = function()
{
	return SnlPixiMgr.m_TextureLoaded;
};


// 次回タップ時にすべてのサウンドを一度再生して止める処理を行う
// (モバイル環境では一度タップ時鳴らした音以外鳴らすことができないため）
SnlPixiMgr.SetAllPlayAndStop = function( Func )
{
	SnlPixiMgr.m_SoundAllPlayAndStop = true;
	if( Func != null )
	{
		SnlPixiMgr.m_SoundAllPlayAndStopFunc = Func;
	}
};

SnlPixiMgr.EvMouseWheel = function(e)
{
	var x = Math.floor( SnlPixiMgr.m_MousePos.x );
	var y = Math.floor( SnlPixiMgr.m_MousePos.y );
	
	// エリア外ならダウンは判定しない
	if( x < 0 || SnlPixiMgr.m_Width < x || y < 0 || SnlPixiMgr.m_Height < y )
	{
		return;
	}

	var delta = e.deltaY ? -(e.deltaY) : e.wheelDelta ? e.wheelDelta : -(e.detail);
	if (delta < 0)
	{
		SnlPixiMgr.m_MouseWheelDown = true;
		//console.log( "下");
	}
 	else if (delta > 0)
	{
		SnlPixiMgr.m_MouseWheelUp = true;
		//console.log( "上");
	}
	
	
	e.preventDefault();
};

// マウスダウンイベント
SnlPixiMgr.EvMouseDown = function(e)
{

	if( SnlPixiMgr.m_SoundAllPlayAndStop )
	{
		if( SnlPixiMgr.m_SoundAllPlayAndStopFunc == null )
		{
			SnlSound.AllPlayAndStop();
		}
		else
		{
			SnlPixiMgr.m_SoundAllPlayAndStopFunc();
		}
		SnlPixiMgr.m_SoundAllPlayAndStop = false;
	}

	if( SnlPixiMgr.m_isPC )
	{
		SnlPixiMgr.m_MultiTouch = false;	// マウスとマルチタッチを併用するとあかんことになる
	}
	
	if( SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
	{
		if(e.button != 0)
		{
			return;
		}
	}
	
	var x = Math.floor( SnlPixiMgr.m_MousePos.x );
	var y = Math.floor( SnlPixiMgr.m_MousePos.y );
	
	// エリア外ならダウンは判定しない
	if( x < 0 || SnlPixiMgr.m_Width < x || y < 0 || SnlPixiMgr.m_Height < y )
	{
		return;
	}
	
	
	SnlPixiMgr.m_MouseDown = true;
	SnlPixiMgr.Flick_Init();
	
	var CanvasTop = SnlPixiMgr.m_Canvas[0].getBoundingClientRect().top;
	if( SnlPixiMgr.isQuasiLandscape )
	{
		CanvasTop = SnlPixiMgr.m_QuasiCanvas.getBoundingClientRect().top;
	}
	
	
	if( SnlPixiMgr.isDebug )
	{
		console.log("Mouse Down x:" + x + "(" + ( x / SnlPixiMgr.m_Width ) + ") y:" + y + "(" + ( y / SnlPixiMgr.m_Height ) + ")" );
	}
};

// マウスアップイベント
SnlPixiMgr.EvMouseUp = function (e)
{
	if( SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
	{
		if(e.button != 0)
		{
			return;
		}
	}
	
	if( !SnlPixiMgr.m_MouseDown && !SnlPixiMgr.m_MousePress )
	{
		return;
	}
	
	SnlPixiMgr.m_MouseUp = true;
	if( SnlPixiMgr.m_MouseUpOnesEvent != null )
	{
		SnlPixiMgr.m_MouseUpOnesEvent();
		SnlPixiMgr.m_MouseUpOnesEvent = null;
	}
	
	if( typeof SU_Api !== "undefined" )
	{
		if( SU_Api.MouseUpAdsEvent != null )
		{
			SU_Api.MouseUpAdsEvent();
		}
	}
	
	SnlPixiMgr.Flick_Done();
};

SnlPixiMgr.EvMouseMove = function(e)
{
	var CanvasTop = SnlPixiMgr.m_Canvas[0].getBoundingClientRect().top;
	var CanvasLeft = SnlPixiMgr.m_Canvas[0].getBoundingClientRect().left;
	if( SnlPixiMgr.isQuasiLandscape )
	{
		CanvasTop = SnlPixiMgr.m_QuasiCanvas.getBoundingClientRect().top;
		CanvasLeft = SnlPixiMgr.m_QuasiCanvas.getBoundingClientRect().left;
	}
	
	SnlPixiMgr.m_MousePos.x = (e.clientX-CanvasLeft) / SnlPixiMgr.m_DispRatio / SnlPixiMgr.m_InputRatio;
	SnlPixiMgr.m_MousePos.y = (e.clientY-CanvasTop) / SnlPixiMgr.m_DispRatio / SnlPixiMgr.m_InputRatio;
	
	if( SnlPixiMgr.isQuasiLandscape )
	{
		var x = SnlPixiMgr.m_MousePos.y;
		var y = SnlPixiMgr.m_Height - SnlPixiMgr.m_MousePos.x;
		
		SnlPixiMgr.m_MousePos.x = x;
		SnlPixiMgr.m_MousePos.y = y;
	}
	
	
};

SnlPixiMgr.GetTouchIdx = function()
{
	if( SnlPixiMgr.m_ActiveTouchNum <= 0 )
	{
		return 0;
	}
	
	for( var i=1; i<this.m_TouchID.length; i++ )
	{
		if( this.m_TouchID[i] < 0 )
		{
			if( SnlPixiMgr.m_TouchStep[i] == SnlPixiMgr.eTouchStep.None )
			{
				return i;
			}
		}
	}
	
	return this.m_TouchID.length;
};



// タッチスタートイベント
SnlPixiMgr.EvTouchStart = function(e)
{
	if( SnlPixiMgr.m_Touch && !SnlPixiMgr.m_MultiTouch )
	{
		return;
	}

	// TouchList オブジェクトを取得
	var touch_list = e.changedTouches;

	if( touch_list.length <= 0 )
	{
		return;
	}
	
	
	var TouchLength = 1;
	if( SnlPixiMgr.m_MultiTouch )
	{
		TouchLength = touch_list.length;
	}
	
	var PaddingX = SnlPixiMgr.m_TouchPaddingX;
	var PaddingY = SnlPixiMgr.m_TouchPaddingY;
	var CanvasTop = SnlPixiMgr.m_Canvas[0].getBoundingClientRect().top + window.pageYOffset;
	
	if( SnlPixiMgr.isQuasiLandscape )
	{
		CanvasTop = SnlPixiMgr.m_QuasiCanvas.getBoundingClientRect().top;
	}
	
	for( var i=0; i<touch_list.length; i++ )
	{
		if( SnlPixiMgr.isQuasiLandscape )
		{
			if( SnlPixiMgr.m_Width * SnlPixiMgr.m_InputRatio < (touch_list[i].pageY-PaddingY-CanvasTop) )
			{
				continue;
			}
			
		}
		else
		{
			if( SnlPixiMgr.m_Height * SnlPixiMgr.m_InputRatio < (touch_list[i].pageY-PaddingY-CanvasTop) )
			{
				continue;
			}
		}
		
		var Idx = SnlPixiMgr.GetTouchIdx();
		
		SnlPixiMgr.m_TouchID[Idx] = touch_list[i].identifier;
		SnlPixiMgr.m_TouchPos[Idx] = { x: (touch_list[i].pageX- PaddingX) / SnlPixiMgr.m_InputRatio, y: (touch_list[i].pageY-PaddingY-CanvasTop) / SnlPixiMgr.m_InputRatio };
		
		if( SnlPixiMgr.isQuasiLandscape )
		{
			var x = SnlPixiMgr.m_TouchPos[Idx].y;
			var y = SnlPixiMgr.m_Height - SnlPixiMgr.m_TouchPos[Idx].x;
			
			SnlPixiMgr.m_TouchPos[Idx].x = x;
			SnlPixiMgr.m_TouchPos[Idx].y = y;
			
			//console.log(SnlPixiMgr.m_TouchPos[Idx].y);
		}
		
		SnlPixiMgr.m_TouchStep[Idx] = SnlPixiMgr.eTouchStep.Down;
		if( Idx == 0 )
		{
			SnlPixiMgr.m_Touch 	= true;
			SnlPixiMgr.m_TouchMode = true;
			SnlPixiMgr.m_MouseDown = true;
			SnlPixiMgr.m_MousePos.x = SnlPixiMgr.m_TouchPos[Idx].x;
			SnlPixiMgr.m_MousePos.y = SnlPixiMgr.m_TouchPos[Idx].y;
			SnlPixiMgr.Flick_Init();
		}
		SnlPixiMgr.m_ActiveTouchNum++;
	}
	
	
};

// タッチ終了イベント
SnlPixiMgr.EvTouchEnd = function (e)
{
	if( SnlPixiMgr.m_SoundAllPlayAndStop )
	{
		if( SnlPixiMgr.m_SoundAllPlayAndStopFunc == null )
		{
			SnlSound.AllPlayAndStop();
		}
		else
		{
			SnlPixiMgr.m_SoundAllPlayAndStopFunc();
		}
		SnlPixiMgr.m_SoundAllPlayAndStop = false;
	}
	
	if( SnlPixiMgr.m_MouseUpOnesEvent != null )
	{
		SnlPixiMgr.m_MouseUpOnesEvent();
		SnlPixiMgr.m_MouseUpOnesEvent = null;
	}
	
	if( typeof SU_Api !== "undefined" )
	{
		if( SU_Api.MouseUpAdsEvent != null )
		{
			SU_Api.MouseUpAdsEvent();
		}
	}
	
	var isEnd = false;

	// TouchList オブジェクトを取得
	var touch_list = e.changedTouches;

	// 中身に順番にアクセス
	var i;
	var num = touch_list.length;
	for( var i=0; i<num; i++ )
	{
		for( var j=0; j<SnlPixiMgr.m_TouchID.length; j++ )
		{
			if( touch_list[i].identifier == SnlPixiMgr.m_TouchID[j] )
			{
				SnlPixiMgr.m_TouchID[j] = -1;
				SnlPixiMgr.m_TouchStep[j] = SnlPixiMgr.eTouchStep.Up;
				if( j == 0 )
				{
					isEnd = true;
				}
				//this.m_ActiveTouchNum--;
			}
		}
	}
	
	if( isEnd == false )
	{
		return;
	}
	
	SnlPixiMgr.m_Touch = false;
	SnlPixiMgr.m_MouseUp = true;
	
	SnlPixiMgr.Flick_Done();
};

// タッチ移動イベント
SnlPixiMgr.EvTouchMove = function (e)
{
	var isEnd = false;

	// TouchList オブジェクトを取得
	var touch_list = e.changedTouches;

	var PaddingX = SnlPixiMgr.m_TouchPaddingX;
	var PaddingY = SnlPixiMgr.m_TouchPaddingY;
	
	var CanvasTop = SnlPixiMgr.m_Canvas[0].getBoundingClientRect().top + window.pageYOffset;
	if( SnlPixiMgr.isQuasiLandscape )
	{
		CanvasTop = SnlPixiMgr.m_QuasiCanvas.getBoundingClientRect().top;
	}
	// 中身に順番にアクセス
	var i;
	var num = touch_list.length;
	for( var i=0; i<num; i++ )
	{
		for( var j=0; j<SnlPixiMgr.m_TouchID.length; j++ )
		{
			if( touch_list[i].identifier == SnlPixiMgr.m_TouchID[j] )
			{
				SnlPixiMgr.m_TouchPos[j].x = (touch_list[i].pageX - PaddingX) / SnlPixiMgr.m_InputRatio ;
				SnlPixiMgr.m_TouchPos[j].y = (touch_list[i].pageY - PaddingY - CanvasTop) / SnlPixiMgr.m_InputRatio;
				if( SnlPixiMgr.isQuasiLandscape )
				{
					var x = SnlPixiMgr.m_TouchPos[j].y;
					var y = SnlPixiMgr.m_Height - SnlPixiMgr.m_TouchPos[j].x;
					SnlPixiMgr.m_TouchPos[j].x = x;
					SnlPixiMgr.m_TouchPos[j].y = y;
				}
				
				if( j == 0 )
				{
					SnlPixiMgr.m_MousePos.x = (touch_list[i].pageX - PaddingX) / SnlPixiMgr.m_InputRatio ;
					SnlPixiMgr.m_MousePos.y = (touch_list[i].pageY - PaddingY - CanvasTop) / SnlPixiMgr.m_InputRatio;
					if( SnlPixiMgr.isQuasiLandscape )
					{
						var x = SnlPixiMgr.m_MousePos.y;
						var y = SnlPixiMgr.m_Height - SnlPixiMgr.m_MousePos.x;
						SnlPixiMgr.m_MousePos.x = x;
						SnlPixiMgr.m_MousePos.y = y;
					}
					SnlPixiMgr.Flick_Move();
				}
			}
		}
	}
};

// タッチの位置を取得（状況により同一Idxでも参照する指が異なる可能性有り）、参照外の場合はnullを返す
SnlPixiMgr.GetTouchPosIdx = function( Idx )
{
	var Count = 0;
	for( var j=0; j<SnlPixiMgr.m_TouchID.length; j++ )
	{
		if( SnlPixiMgr.m_TouchStep[j] == SnlPixiMgr.eTouchStep.None )
		{
			continue;
		}
		if( Count == Idx )
		{
			return { x: SnlPixiMgr.m_TouchPos[j].x, y: SnlPixiMgr.m_TouchPos[j].y };
		}
		Count++;
	}
	
	return null;
};

SnlPixiMgr.FindTouchIdx = function( TouchID )
{
	for( var j=0; j<SnlPixiMgr.m_TouchID.length; j++ )
	{
		if( SnlPixiMgr.m_TouchStep[j] == SnlPixiMgr.eTouchStep.None )
		{
			continue;
		}
		
		if( SnlPixiMgr.m_TouchID[j] == TouchID )
		{
			return j;
		}
	}
	
	return -1;
};

// タッチキャンセルイベント
SnlPixiMgr.EvTouchCancel = function ( e )
{
	SnlPixiMgr.m_Touch = false;
	SnlPixiMgr.m_MouseUp = true;
	SnlPixiMgr.m_MousePress = false;
	SnlPixiMgr.m_MouseDown = false;
	
	for( var j=0; j<SnlPixiMgr.m_TouchID.length; j++ )
	{
		SnlPixiMgr.m_TouchID[j] = -1;
		SnlPixiMgr.m_TouchStep[j] = SnlPixiMgr.eTouchStep.Up;
	}
	
	SnlPixiMgr.m_ActiveTouchNum	= 0;			// 現在アクティブなタッチ位置は何個ある？
	
	SnlPixiMgr.Flick_Done();
};

// フリック判定初期化
SnlPixiMgr.Flick_Init = function()
{
	var date = new Date();
	SnlPixiMgr.m_FlickStartTime = date.getTime();
	
	for( var i=0; i<SnlPixiMgr.eFlickType.Max; i++ )
	{
		SnlPixiMgr.m_FlickCheck[i] = true;
	}
	SnlPixiMgr.m_StartMousePos.x = SnlPixiMgr.m_MousePos.x;
	SnlPixiMgr.m_StartMousePos.y = SnlPixiMgr.m_MousePos.y;
	SnlPixiMgr.m_LastMousePos.x = SnlPixiMgr.m_MousePos.x;
	SnlPixiMgr.m_LastMousePos.y = SnlPixiMgr.m_MousePos.y;
	SnlPixiMgr.m_FlickType = SnlPixiMgr.eFlickType.None;
};

// フリック判定処理（タッチ中）
SnlPixiMgr.Flick_Move = function()
{
	var DistLastX = (SnlPixiMgr.m_MousePos.x - SnlPixiMgr.m_LastMousePos.x) / SnlPixiMgr.m_Width;
	var DistLastY = (SnlPixiMgr.m_MousePos.y - SnlPixiMgr.m_LastMousePos.y) / SnlPixiMgr.m_Height;
	var DistStartX = (SnlPixiMgr.m_MousePos.x - SnlPixiMgr.m_StartMousePos.x) / SnlPixiMgr.m_Width;
	var DistStartY = (SnlPixiMgr.m_MousePos.y - SnlPixiMgr.m_StartMousePos.y) / SnlPixiMgr.m_Height;
	
	if( DistLastX < -0.05 )
	{
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Right] = false;
	}
	if( 0.05 < DistLastX  )
	{
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Left] = false;
	}
	
	if( DistLastY < -0.05 )
	{
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Down] = false;
	}
	
	if( 0.05 < DistLastY  )
	{
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Up] = false;
	}
	
	if( DistStartX < -0.15 )
	{
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Right] = false;
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Up] = false;
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Down] = false;
	}
	if( 0.15 < DistStartX  )
	{
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Left] = false;
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Up] = false;
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Down] = false;
	}
	
	if( DistStartY < -0.15 )
	{
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Down] = false;
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Left] = false;
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Right] = false;
	}
	
	if( 0.15 < DistStartY  )
	{
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Up] = false;
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Left] = false;
		SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Right] = false;
	}
	
	
	SnlPixiMgr.m_LastMousePos.x = SnlPixiMgr.m_MousePos.x;
	SnlPixiMgr.m_LastMousePos.y = SnlPixiMgr.m_MousePos.y;
};

// フリック終了処理（タッチ終了時に開始時との位置の差でどのようなフリックが行われていたか判定する）
SnlPixiMgr.Flick_Done = function()
{
	var date = new Date();
	
	if( SnlPixiMgr.m_FlickTimeLimit < (date.getTime() - SnlPixiMgr.m_FlickStartTime) / 1000 )
	{
		SnlPixiMgr.m_FlickType = SnlPixiMgr.eFlickType.None;
		return;
	}
	
	var DistStartX = (SnlPixiMgr.m_MousePos.x - SnlPixiMgr.m_StartMousePos.x) / SnlPixiMgr.m_Width;
	var DistStartY = (SnlPixiMgr.m_MousePos.y - SnlPixiMgr.m_StartMousePos.y) / SnlPixiMgr.m_Height;
	
	if( DistStartX < -0.15 && SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Left] )
	{
		SnlPixiMgr.m_FlickType = SnlPixiMgr.eFlickType.Left;
	}
	if( 0.15 < DistStartX && SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Right] )
	{
		SnlPixiMgr.m_FlickType = SnlPixiMgr.eFlickType.Right;
	}
	
	if( DistStartY < -0.15 && SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Up] )
	{
		SnlPixiMgr.m_FlickType = SnlPixiMgr.eFlickType.Up;
	}
	
	if( 0.15 < DistStartY && SnlPixiMgr.m_FlickCheck[SnlPixiMgr.eFlickType.Down] )
	{
		SnlPixiMgr.m_FlickType = SnlPixiMgr.eFlickType.Down;
	}
};

// バンク番号とテクスチャ番号からスプライトの作成
SnlPixiMgr.CreateSprite = function ( BankNo, TextureNo, PosX, PosY, AnchorX, AnchorY, DispZ )
{
	var Sprite = null;
	
	var PixiMode = true;
	if( 0 <= DispZ )
	{
		PixiMode = SnlPixiMgr.m_CanvasModeTbl[DispZ].PixiMode;
	}
	
	if( !PixiMode )
	{
		return;
	}
	
	if( BankNo < 0 || TextureNo < 0 )
	{
		Sprite 	= new PIXI.Sprite(null);
	}
	else
	{
		if( SnlPixiMgr.m_isPreferentialMemory )
		{
			if( SnlPixiMgr.m_Loader[BankNo].isPacking )
			{
				Sprite = new PIXI.Sprite( SnlPixiMgr.m_Loader[BankNo].GetTexture( TextureNo ) );
			}
			else if( SnlPixiMgr.m_Loader[BankNo].m_LoadAllImgPathArray != null )
			{
				Sprite = new PIXI.Sprite( SnlPixiMgr.m_Loader[BankNo].GetTexture( SnlPixiMgr.m_Loader[BankNo].m_LoadAllImgPathArray[TextureNo] ) );
			}
			else
			{
				Sprite = new PIXI.Sprite( SnlPixiMgr.m_Loader[BankNo].GetTexture( TextureNo ) );
			}
		}
		else
		{
			Sprite = new PIXI.Sprite.fromFrame("Img_" + String(BankNo) + "_" + String(TextureNo));  //SnlPixiMgr.m_Texture[TextureNo]);
		}
	}
	Sprite.position.x	= PosX * SnlPixiMgr.m_DispRatio;
	Sprite.position.y 	= PosY * SnlPixiMgr.m_DispRatio;
	Sprite.anchor.x		= AnchorX;
	Sprite.anchor.y		= AnchorY;
	Sprite.scale.x		= SnlPixiMgr.m_DispRatio;
	Sprite.scale.y		= SnlPixiMgr.m_DispRatio;
	
	if( 0 <= DispZ )
	{
		SnlPixiMgr.PixiObjSetZ( Sprite, DispZ );
	}
	return Sprite;
};

SnlPixiMgr.BankTextureAddUseCount= function ( BankNo, TextureNo )
{
	if( SnlPixiMgr.m_isPreferentialMemory && 0 <= BankNo && 0 <= TextureNo )
	{
		if( !SnlPixiMgr.m_Loader[BankNo].isPacking )
		{
			SnlPixiMgr.m_Loader[BankNo].AddUseCount( TextureNo );
		}
	}
};

SnlPixiMgr.BankTextureDecUseCount= function ( BankNo, TextureNo )
{
	if( SnlPixiMgr.m_isPreferentialMemory && 0 <= BankNo && 0 <= TextureNo )
	{
		if( !SnlPixiMgr.m_Loader[BankNo].isPacking )
		{
			SnlPixiMgr.m_Loader[BankNo].DecUseCount( TextureNo );
		}
	}
};

// PIXI.Textureからスプライトの作成
SnlPixiMgr.CreateSpriteFromImg = function ( Texture, PosX, PosY, AnchorX, AnchorY, DispZ )
{
	var Sprite = null;
	
	var PixiMode = true;
	if( 0 <= DispZ )
	{
		PixiMode = SnlPixiMgr.m_CanvasModeTbl[DispZ].PixiMode;
	}
	
	if( !PixiMode )
	{
		return;
	}
	
	Sprite 			= new PIXI.Sprite( Texture );  //SnlPixiMgr.m_Texture[TextureNo]);
	
	Sprite.position.x	= PosX * SnlPixiMgr.m_DispRatio;
	Sprite.position.y 	= PosY * SnlPixiMgr.m_DispRatio;
	Sprite.anchor.x		= AnchorX;
	Sprite.anchor.y		= AnchorY;
	Sprite.scale.x		= SnlPixiMgr.m_DispRatio;
	Sprite.scale.y		= SnlPixiMgr.m_DispRatio;

	if( 0 <= DispZ )
	{
		SnlPixiMgr.PixiObjSetZ( Sprite, DispZ );
	}

	return Sprite;
};

// Video要素からスプライトの作成
SnlPixiMgr.CreateSpriteFromVideo = function( video, PosX, PosY, AnchorX, AnchorY, DispZ )
{
	var Sprite = null;
	
	var PixiMode = true;
	if( 0 <= DispZ )
	{
		PixiMode = SnlPixiMgr.m_CanvasModeTbl[DispZ].PixiMode;
	}
	
	if( !PixiMode )
	{
		return;
	}
	
	var texture = null;
	
	if( SnlPixiMgr.PixiVersion <= SnlPixiMgr.ePixiVersion.V4 )
	{
		texture = new PIXI.Texture.fromVideo(video);
	}
	else
	{
		texture = new PIXI.Texture.from( video );
	}
	
	Sprite = new PIXI.Sprite( texture );  //SnlPixiMgr.m_Texture[TextureNo]);
	
	Sprite.position.x	= PosX * SnlPixiMgr.m_DispRatio;
	Sprite.position.y 	= PosY * SnlPixiMgr.m_DispRatio;
	Sprite.anchor.x		= AnchorX;
	Sprite.anchor.y		= AnchorY;
	Sprite.scale.x		= SnlPixiMgr.m_DispRatio;
	Sprite.scale.y		= SnlPixiMgr.m_DispRatio;

	if( 0 <= DispZ )
	{
		SnlPixiMgr.PixiObjSetZ( Sprite, DispZ );
	}

	return Sprite;
};

// Image要素からスプライトの作成
SnlPixiMgr.CreateSpriteFromImage = function ( image, PosX, PosY, AnchorX, AnchorY, DispZ )
{
	var Texture = new PIXI.Texture( new PIXI.BaseTexture( image, PIXI.SCALE_MODES.LINEAR, 1 ) );
	
	
	
	var Sprite = null;
	
	var PixiMode = true;
	if( 0 <= DispZ )
	{
		PixiMode = SnlPixiMgr.m_CanvasModeTbl[DispZ].PixiMode;
	}
	
	if( !PixiMode )
	{
		return;
	}
	
	Sprite 			= new PIXI.Sprite( Texture );  //SnlPixiMgr.m_Texture[TextureNo]);
	
	Sprite.position.x	= PosX * SnlPixiMgr.m_DispRatio;
	Sprite.position.y 	= PosY * SnlPixiMgr.m_DispRatio;
	Sprite.anchor.x		= AnchorX;
	Sprite.anchor.y		= AnchorY;
	Sprite.scale.x		= SnlPixiMgr.m_DispRatio;
	Sprite.scale.y		= SnlPixiMgr.m_DispRatio;

	if( 0 <= DispZ )
	{
		SnlPixiMgr.PixiObjSetZ( Sprite, DispZ );
	}

	return Sprite;
};

// PIXI.Graphicsからスプライトの作成
SnlPixiMgr.CreateSpriteGraphics = function(PosX, PosY, AnchorX, AnchorY, DispZ)
{
	var Sprite = null;

	var PixiMode = true;
	if (0 <= DispZ)
	{
		PixiMode = SnlPixiMgr.m_CanvasModeTbl[DispZ].PixiMode;
	}

	if (!PixiMode)
	{
		return;
	}

	Sprite = new PIXI.Graphics();
	Sprite.anchor = {
		x: AnchorX,
		y: AnchorY
	}; //anchorはGraphicsにないけどシステムを動かすために追加
	Sprite.position.x = PosX * SnlPixiMgr.m_DispRatio;
	Sprite.position.y = PosY * SnlPixiMgr.m_DispRatio;
	Sprite.scale.x = SnlPixiMgr.m_DispRatio;
	Sprite.scale.y = SnlPixiMgr.m_DispRatio;

	if (0 <= DispZ)
	{
		SnlPixiMgr.PixiObjSetZ(Sprite, DispZ);
	}

	return Sprite;
};

// バンク番号とテクスチャ番号を元にテクスチャ変更
SnlPixiMgr.ChangeTexture= function( Sprite, BankNo, TextureNo )
{
	if( SnlPixiMgr.m_isPreferentialMemory )
	{
		if( SnlPixiMgr.m_Loader[BankNo].isPacking )
		{
			Sprite.texture = SnlPixiMgr.m_Loader[BankNo].GetTexture( TextureNo );
		}
		else
		{
			Sprite.texture = SnlPixiMgr.m_Loader[BankNo].GetTexture( SnlPixiMgr.m_Loader[BankNo].m_LoadAllImgPathArray[TextureNo] );
		}
	}
	else
	{
		if( SnlPixiMgr.ePixiVersion.V3 <= SnlPixiMgr.PixiVersion )
		{
			Sprite.texture = PIXI.utils.TextureCache["Img_" + String(BankNo) + "_" + String(TextureNo)];//SnlPixiMgr.m_Texture[TextureNo];
		}
		else
		{
			Sprite.texture = PIXI.TextureCache["Img_" + String(BankNo) + "_" + String(TextureNo)];//SnlPixiMgr.m_Texture[TextureNo];
		}
	}
};

// Image要素を使用してテクスチャを変更
SnlPixiMgr.ChangeTextureOnImage = function( Sprite, image )
{
	Sprite.texture = new PIXI.Texture( new PIXI.BaseTexture( image, PIXI.SCALE_MODES.LINEAR, 1 ) );
};

// バンク番号とテクスチャ番号からサイズを取得
SnlPixiMgr.GetTextureSize = function( BankNo, TextureNo )
{
	if( SnlPixiMgr.m_isPreferentialMemory )
	{
		if( SnlPixiMgr.m_Loader[BankNo].isPacking )
		{
			return SnlPixiMgr.m_Loader[BankNo].GetImageSize( TextureNo );
		}
		return SnlPixiMgr.m_Loader[BankNo].GetImageSize( SnlPixiMgr.m_Loader[BankNo].m_LoadAllImgPathArray[TextureNo] );
	}

	return { x: SnlPixiMgr.m_TextureData[BankNo][TextureNo].w, y:SnlPixiMgr.m_TextureData[BankNo][TextureNo].h };
};

//　テキストの作成
SnlPixiMgr.CreateText = function ( Text, Style, PosX, PosY, AnchorX, AnchorY, DispZ )
{
	var PxText 			=  new PIXI.Text( Text, Style );
	PxText.anchor.x 	= AnchorX;
	PxText.anchor.y 	= AnchorY;
	PxText.position.x	= PosX * SnlPixiMgr.m_DispRatio;
	PxText.position.y 	= PosY * SnlPixiMgr.m_DispRatio;
	PxText.scale.x		= SnlPixiMgr.m_DispRatio;
	PxText.scale.y		= SnlPixiMgr.m_DispRatio;
	
	if( 0 <= DispZ )
	{
		SnlPixiMgr.PixiObjSetZ( PxText, DispZ );
	}
	return PxText;
};


// Zの設定
SnlPixiMgr.PixiObjSetZ = function ( PixiObj, DispZ )
{

	if( SnlPixiMgr.m_CanvasModeTbl[DispZ].RenderMode == SnlPixiMgr.ViewType.CreateJS )
	{
		SnlPixiMgr.m_Stage[SnlPixiMgr.m_CanvasModeTbl[DispZ].ViewNo].addChild( PixiObj );
	}
	else
	{
		SnlPixiMgr.ReleaseZ( PixiObj, DispZ );
		SnlPixiMgr.m_DispSortSprite[DispZ].addChild(PixiObj);
	}
};

// Zからの切り離し
SnlPixiMgr.ReleaseZ = function( PixiObj, DispZ )
{
	if( SnlPixiMgr.m_CanvasModeTbl[DispZ].RenderMode == SnlPixiMgr.ViewType.CreateJS )
	{
		//for( var i=0; i<=SnlPixiMgr.m_ViewMax; i++ )
		{
			//if( SnlPixiMgr.m_CanvasModeTbl[i].RenderMode == SnlPixiMgr.ViewType.CreateJS )
			{
				SnlPixiMgr.m_Stage[SnlPixiMgr.m_CanvasModeTbl[DispZ].ViewNo].removeChild( PixiObj );
			}
		}
	}
	else
	{
	
		for( var i=0; i<SnlPixiMgr.m_ZMax; i++ )
		{
			if( SnlPixiMgr.m_CanvasModeTbl[i].RenderMode == SnlPixiMgr.ViewType.PixiJS )
			{
				SnlPixiMgr.m_DispSortSprite[i].removeChild( PixiObj );
			}
		}
	}
};

// SnlPixiMgrを監視するオブジェクトをリストへ追加
SnlPixiMgr.AddImageCheckObj = function( Obj )
{
	if( Obj == null )
	{
		return;
	}
	
	if( SnlPixiMgr.m_ImageCheckObj == null )
	{
		SnlPixiMgr.m_ImageCheckObj = [];
	}
	
	SnlPixiMgr.m_ImageCheckObj[SnlPixiMgr.m_ImageCheckObj.length] = Obj;
	
};	

// SnlPixiMgrを監視するオブジェクトをリストから削除
SnlPixiMgr.RemoveImageCheckObj = function( Obj )
{
	if( SnlPixiMgr.m_ImageCheckObj == null || Obj == null )
	{
		return;
	}
	
	for( var  i=0; i<SnlPixiMgr.m_ImageCheckObj.length; i++ )
	{
		if( SnlPixiMgr.m_ImageCheckObj[i] == Obj )
		{
			SnlPixiMgr.m_ImageCheckObj.splice(i,1);
			return;
		}
	}
};



// メイン前
SnlPixiMgr.BeginMain = function ()
{
	// マウス位置の更新
	if( !SnlPixiMgr.m_TouchMode )
	{
		if( SnlPixiMgr.PixiVersion < SnlPixiMgr.ePixiVersion.V3 )
		{
			var point = SnlPixiMgr.m_Stage[0].getMousePosition();
			SnlPixiMgr.m_MousePos.x = point.x / SnlPixiMgr.m_DispRatio;
   			SnlPixiMgr.m_MousePos.y = point.y / SnlPixiMgr.m_DispRatio;
		}

   		SnlPixiMgr.Flick_Move();
   	}
   	
   	// SnlImageMgrへの問い合わせ
   	if( SnlPixiMgr.m_ImageCheckObj != null )
   	{
   		var i = 0;
   		
   		while( i < SnlPixiMgr.m_ImageCheckObj.length )
   		{
   			if( SnlPixiMgr.m_ImageCheckObj[i].CheckImageMgr() )
   			{
   				SnlPixiMgr.m_ImageCheckObj.splice(i,1);
   			}
   			else
   			{
   				i++;
   			}
   		}
   	}
};
   
   // メイン終了
   SnlPixiMgr.EndMain = function ()
   {
	SnlPixiMgr.InputCleanUp();
};

SnlPixiMgr.InputCleanUp = function()
{
	// マウスイベントの後処理
	if( SnlPixiMgr.m_MouseDown )
	{
		SnlPixiMgr.m_MouseDown = false;
		SnlPixiMgr.m_MousePress = true;
	}
	if( SnlPixiMgr.m_MouseUp )
	{
		SnlPixiMgr.m_MouseUp = false;
		SnlPixiMgr.m_MousePress = false;
		SnlPixiMgr.m_FlickType = SnlPixiMgr.eFlickType.None;
	}
	
	SnlPixiMgr.m_MouseWheelDown = false;
	SnlPixiMgr.m_MouseWheelUp = false;
	
	
	// Touchの状態更新
   	{
   		for( var i=0; i<SnlPixiMgr.m_TouchStep.length; i++ )
   		{
   			switch( SnlPixiMgr.m_TouchStep[i] )
   			{
   				case SnlPixiMgr.eTouchStep.Down:
   					SnlPixiMgr.m_TouchStep[i] = SnlPixiMgr.eTouchStep.Press;
   				break;
   				
   				case SnlPixiMgr.eTouchStep.Up:
					SnlPixiMgr.m_TouchStep[i] = SnlPixiMgr.eTouchStep.None;
					SnlPixiMgr.m_ActiveTouchNum--;
					if(	SnlPixiMgr.m_ActiveTouchNum < 0 )
					{
						SnlPixiMgr.m_ActiveTouchNum = 0;
					}
   				break;
   			}
   		}
   	}
};

// レンダー
SnlPixiMgr.Render = function()
{
	SnlPixiMgr.m_ResizeExec = false;
	
	if( SnlPixiMgr.m_ResizeCheckOnUpdate )
	{
		var ScreenW = document.documentElement.clientWidth;
		var ScreenH = document.documentElement.clientHeight;
		if( SnlPixiMgr.m_DocumentClientSize.x != ScreenW ||
			SnlPixiMgr.m_DocumentClientSize.y != ScreenH )
		{
			SnlPixiMgr.ScreenResize();
		}
	}
	
	
	SnlPixiMgr.UpdateShake();
	
	SnlPixiMgr.BeginRender();
	
	
	if( 2 <= SnlPixiMgr.m_RenderDist )
	{
		if( SnlPixiMgr.m_RenderCount != 0 )
		{
			SnlPixiMgr.m_RenderCount++;
			if( SnlPixiMgr.m_RenderDist <= SnlPixiMgr.m_RenderCount )
			{
				SnlPixiMgr.m_RenderCount = 0;
			}
			return;
		}
		
		SnlPixiMgr.m_RenderCount++;
	}
	
	
	
	
	// ステージを書く
	for( var i=SnlPixiMgr.m_ViewMax; 0<=i; i-- )
	{
		if( !SnlPixiMgr.m_CanvasModeTbl[i].AllwaysUpdate && !SnlPixiMgr.m_isUpdate[i] )
		{
			continue;
		}
		
		// Pixi.js( WebGL )
		if(SnlPixiMgr.m_ViewType[i] == SnlPixiMgr.ViewType.PixiJS )
		{
			SnlPixiMgr.m_Renderer[i].render(SnlPixiMgr.m_Stage[i]);
		}
		// Easel.js( WebGL )
		else if(SnlPixiMgr.m_ViewType[i] == SnlPixiMgr.ViewType.CreateJS )
		{
			//SnlPixiMgr.m_Stage[i].update();
		}
		else
		{
			if( SnlPixiMgr.m_Stage[i]  != null && SnlPixiMgr.m_Camera[i] != null )
			{
				SnlPixiMgr.m_Renderer[i].render(SnlPixiMgr.m_Stage[i], SnlPixiMgr.m_Camera[i]);
			}
		}
		SnlPixiMgr.m_isUpdate[i] = false;
	}
	
	
	if( SnlPixiMgr.isQuasiLandscape )
	{
		var ctx = SnlPixiMgr.m_QuasiCanvas.getContext('2d');

	
		ctx.save();
		ctx.clearRect( 0, 0, SnlPixiMgr.m_QuasiCanvas.width, SnlPixiMgr.m_QuasiCanvas.height );
		ctx.translate(SnlPixiMgr.m_QuasiCanvas.width, 0);
		ctx.rotate( 90 * Math.PI / 180 );
	
		for( var i=SnlPixiMgr.m_ViewMax; 0<=i; i-- )
		{
		
			var canvasS = SnlPixiMgr.m_Canvas[i];
		
			ctx.drawImage( canvasS, 0, 0, canvasS.width, canvasS.height );
	
		}
	
	
		ctx.restore();
		//ctx.save();
	}
	
	if( SnlPixiMgr.m_ScreenShotFlag )
	{
		SnlPixiMgr.m_ScreenShotFlag = false;
		SnlPixiMgr.CreateScreenShotCore( SnlPixiMgr.m_ScreenShotCanvasNo, false );
	}
	
};



SnlPixiMgr.BeginRender = function()
{
	for( var i=SnlPixiMgr.m_ViewMax; 0<=i; i-- )
	{
		if( !SnlPixiMgr.m_CanvasModeTbl[i].PixiMode )
		{
			continue;
		}
		
		SnlPixiMgr.BeginRenderCore( SnlPixiMgr.m_Stage[i] );
	}
};

SnlPixiMgr.BeginRenderCore = function( Object )
{
	if( Object == null )
	{
		return;
	}
	
	// 非表示オブジェクト以下は検索しない
	if( !Object.visible )
	{
		return;
	}
	
	if( Object.alpha <= 0 )
	{
		return;
	}
	if( Object.SnlObject != null )
	{
		if( Object.SnlObject.BeginRender != null )
		{
			Object.SnlObject.BeginRender();			// ルールとして自分は消すな、親もけすな、子供はOK
		}
	}
	
	if( Object.children != null )
	{
		for( var i=Object.children.length-1; 0<=i; i-- )
		{
			SnlPixiMgr.BeginRenderCore(Object.children[i]);
		}
	}
};


// 3D用カメラ取得
SnlPixiMgr.Get3DCamera= function()
{
	for( var i=SnlPixiMgr.m_ViewMax; 0<=i; i-- )
	{
		if(SnlPixiMgr.m_ViewType[i] == SnlPixiMgr.ViewType.ThreeJS )
		{
			return SnlPixiMgr.m_Camera[i];
		}
	}
	
	return null;
};

// 3D用シーン取得
SnlPixiMgr.Get3DScene= function()
{
	for( var i=SnlPixiMgr.m_ViewMax; 0<=i; i-- )
	{
		if(SnlPixiMgr.m_ViewType[i] == SnlPixiMgr.ViewType.ThreeJS )
		{
			return SnlPixiMgr.m_Stage[i];
		}
	}
	
	return null;
};

//3Dカメラとシーンの設定
SnlPixiMgr.Set3DRenderSetting = function( Camera, Scene )
{
	for( var i=SnlPixiMgr.m_ViewMax; 0<=i; i-- )
	{
		if(SnlPixiMgr.m_ViewType[i] == SnlPixiMgr.ViewType.ThreeJS )
		{
			SnlPixiMgr.m_Camera[i]	= Camera;
			SnlPixiMgr.m_Stage[i] 	= Scene;
			return;
		}
	}
}

// 3Dレンダラ取得
SnlPixiMgr.Get3DRenderer = function()
{
	for( var i=SnlPixiMgr.m_ViewMax; 0<=i; i-- )
	{
		if(SnlPixiMgr.m_ViewType[i] == SnlPixiMgr.ViewType.ThreeJS )
		{
			return SnlPixiMgr.m_Renderer[i];
		}
	}
	
	return null;
}

SnlPixiMgr.SetShake = function( Time, Pow, Type )
{
	if( Time == null )
	{
		Time = 0.5;
	}
	
	if( Pow == null )
	{
		Pow = 10;
	}
	
	if( Type == null )
	{
		Type = SnlPixiMgr.eShakeType.Rnd;
	}
	
	SnlPixiMgr.m_ShakeType = Type;
	SnlPixiMgr.m_ShakeStep  = 0;
	SnlPixiMgr.m_ShakeTimer = 0;
	SnlPixiMgr.m_ShakeLimit = Time;
	SnlPixiMgr.m_ShakePower = Pow;
	SnlPixiMgr.m_ShakePos.x = 0;
	SnlPixiMgr.m_ShakePos.y = 0;
};

SnlPixiMgr.UpdateShake = function()
{
	if( SnlPixiMgr.m_ShakeType < 0 )
	{
		return;
	}
	
	if( SnlPixiMgr.m_ShakeLimit <= SnlPixiMgr.m_ShakeTimer )
	{
		SnlPixiMgr.m_ShakeType = -1;
		SnlPixiMgr.m_ShakePos.x = 0;
		SnlPixiMgr.m_ShakePos.y = 0;
	}
	else
	{
		var Rate = SnlPixiMgr.m_ShakeTimer / SnlPixiMgr.m_ShakeLimit;
		var Pow = SnlPixiMgr.m_ShakePower * Math.cos( SnlMath.DegToRad * 90 * Rate );
		var DirX = 0;
		var DirY = 0;
		
		if( SnlPixiMgr.m_ShakeType == SnlPixiMgr.eShakeType.Rnd )
		{
			var rnd = Math.floor( Math.random() * 4 );
			while( SnlPixiMgr.m_ShakeStep == rnd )
			{
				rnd = Math.floor( Math.random() * 4 );
			}
			SnlPixiMgr.m_ShakeStep = rnd;
			
			switch( SnlPixiMgr.m_ShakeStep )
			{
				case 0:
					DirX = -1;
					DirY = -1;
				break;
				case 1:
					DirX = 1;
					DirY = -1;
				break;
				case 2:
					DirX = -1;
					DirY = 1;
				break;
				case 3:
					DirX = 1;
					DirY = 1;
				break;
			}
			
		}
		else
		{
			SnlPixiMgr.m_ShakeStep++;
			if( 2 <= SnlPixiMgr.m_ShakeStep )
			{
				SnlPixiMgr.m_ShakeStep = 0;
			}
			
			var Dir = 1;
			if( SnlPixiMgr.m_ShakeStep == 0 )
			{
				Dir = -1;
			}
			
			if( SnlPixiMgr.m_ShakeType == SnlPixiMgr.eShakeType.Vertical )
			{
				DirY = Dir;
			}
			else
			{
				DirX = Dir;
			}
			

		}
		
		SnlPixiMgr.m_ShakePos.x = Pow * DirX;
		SnlPixiMgr.m_ShakePos.y = Pow * DirY;
		SnlPixiMgr.m_ShakeTimer += SnlFPS.deltaTime;
	}
		
	for( var i=0; i<SnlPixiMgr.m_ZMax; i++ )
	{
		if(SnlPixiMgr.m_ViewType[i] == SnlPixiMgr.ViewType.PixiJS )
		{
			SnlPixiMgr.m_DispSortSprite[i].x = SnlPixiMgr.m_ShakePos.x;
			SnlPixiMgr.m_DispSortSprite[i].y = SnlPixiMgr.m_ShakePos.y;
		}
	}
};


// 表示/非表示イベント
SnlPixiMgr.SetHiddenEvent = function( Func )
{
	SnlPixiMgr.m_HiddenEvent[SnlPixiMgr.m_HiddenEvent.length] = Func;
};

SnlPixiMgr.SetVisibleEvent = function( Func )
{
	SnlPixiMgr.m_VisibleEvent[SnlPixiMgr.m_VisibleEvent.length] = Func;
};

SnlPixiMgr.VisibilityChange = function()
{
    if(document.hidden)
    {
		for( var i=0; i<SnlPixiMgr.m_HiddenEvent.length; i++ )
		{
			SnlPixiMgr.m_HiddenEvent[i]();
		}
		
		// タッチ状態ならタッチキャンセルを強制発火
		if( 0 < SnlPixiMgr.m_TouchID.length )
		{
			SnlPixiMgr.EvTouchCancel();
		}
		
    }
    else
    {
		for( var i=0; i<SnlPixiMgr.m_VisibleEvent.length; i++ )
		{
			SnlPixiMgr.m_VisibleEvent[i]();
		}
    }
}

SnlPixiMgr.RayCastCheck = function( FindObject, TouchPos )
{
	for( var i=0; i<SnlPixiMgr.m_ZMax; i++ )
	{
		// Pixi.js(WebGL)
		if( !SnlPixiMgr.m_CanvasModeTbl[i].PixiMode )
		{
			continue;
		}
		
		var r = SnlPixiMgr.RayCastCheckCore( SnlPixiMgr.m_DispSortSprite[i], FindObject, TouchPos );
		if( r != SnlPixiMgr.eRayCastResult.Search )
		{
			return r;
		}
	}
	
	// 全てのオブジェクトを探したが検索対象が存在しない
	return SnlPixiMgr.eRayCastResult.Error;		// とりあえずエラー扱い
};

SnlPixiMgr.RayCastCheckZ = function( DispZ, TouchPos )
{
	if( !SnlPixiMgr.m_CanvasModeTbl[DispZ].PixiMode )
	{
		return SnlPixiMgr.eRayCastResult.Error;
	}
	
	var FindObject = SnlPixiMgr.m_DispSortSprite[DispZ];
	
	for( var i=0; i<SnlPixiMgr.m_ZMax; i++ )
	{
		// Pixi.js(WebGL)
		if( !SnlPixiMgr.m_CanvasModeTbl[i].PixiMode )
		{
			continue;
		}
		
		var r = SnlPixiMgr.RayCastCheckCore( SnlPixiMgr.m_DispSortSprite[i], FindObject, TouchPos, false );
		if( r != SnlPixiMgr.eRayCastResult.Search )
		{
			return r;
		}
	}
	
	// 全てのオブジェクトを探したが検索対象が存在しない
	return SnlPixiMgr.eRayCastResult.Error;		// とりあえずエラー扱い
}

SnlPixiMgr.eRayCastResult =
{
	Success : 1,	// 指定オブジェクトに到達
	Error   : 2,	// 指定オブジェクト到達前に他のオブジェクトにヒットした
	Search	: 3,	// 現在検索中
};

SnlPixiMgr.RayCastCheckCore = function( Object, FindObject, TouchPos )
{
	// オブジェクトは検索対象か？
	if( Object == FindObject )
	{
		return SnlPixiMgr.eRayCastResult.Success;
	}
	
	// 非表示オブジェクト以下は検索しない
	if( !Object.visible )
	{
		return SnlPixiMgr.eRayCastResult.Search;
	}
	
	if( Object.alpha <= 0 )
	{
		return SnlPixiMgr.eRayCastResult.Search;
	}
	
	for( var i=Object.children.length-1; 0<=i; i-- )
	{
		var r = SnlPixiMgr.RayCastCheckCore(Object.children[i], FindObject, TouchPos );
		if( r != SnlPixiMgr.eRayCastResult.Search )
		{
			return r;
		}
	}
	
	// TouchPosとの当たり判定
	if( Object.SnlObject != null )
	{
		if( !Object.SnlObject.isIgnoreRaycast() )
		{
			if( Object.SnlObject.HitCheck( TouchPos ) )
			{
				return SnlPixiMgr.eRayCastResult.Error;
			}
		}
	}
	
	// Object以下は検索したがヒットしなかった
	return SnlPixiMgr.eRayCastResult.Search;
};

SnlPixiMgr.SetMouseUpOnesEvent = function( EventFunc )
{
	SnlPixiMgr.m_MouseUpOnesEvent = EventFunc;
}

// スクリーンショットを取得( Callback function(ImgBase64) )
SnlPixiMgr.CreateScreenShot = function( Context, Callback, CanvasNo )
{
	SnlPixiMgr.m_ScreenShotCallbackContext = Context;
	SnlPixiMgr.m_ScreenShotCallback = Callback;
	SnlPixiMgr.m_ScreenShotCanvasNo = CanvasNo;
	
	SnlPixiMgr.m_ScreenShotFlag = true;
};

SnlPixiMgr.CreateScreenShotCore = function( CanvasNo, Save )
{
	if( !SnlPixiMgr.m_ScreenShotSupport )
	{
		return null;
	}

	var ctx = SnlPixiMgr.m_ScreenShotCanvas.getContext('2d');
	ctx.save();
	
	ctx.clearRect( 0, 0, SnlPixiMgr.m_ScreenShotCanvas.width, SnlPixiMgr.m_ScreenShotCanvas.height );
	ctx.scale( SnlPixiMgr.m_ScreenShotScale, SnlPixiMgr.m_ScreenShotScale );

	var canvasS = SnlPixiMgr.m_Canvas[CanvasNo];
	ctx.drawImage( canvasS, 0, 0, canvasS.width, canvasS.height );
	ctx.restore();
	
	if( SnlPixiMgr.m_ScreenShotCallback == null && !Save )
	{
		return;
	}

	if( Save )
	{
		SnlPixiMgr.DownloadScreenShot( "ScreenShot" );
	}
	
	if( SnlPixiMgr.m_ScreenShotCallback != null )
	{
		var b = SnlPixiMgr.m_ScreenShotCanvas.toDataURL(SnlPixiMgr.m_ScreenShotType, SnlPixiMgr.m_ScreenShotQuality);
		SnlPixiMgr.m_ScreenShotCallback.call( SnlPixiMgr.m_ScreenShotCallbackContext, b );
	}
	
	SnlPixiMgr.m_ScreenShotCallback = null;
	SnlPixiMgr.m_ScreenShotCallbackContext = null;
};

SnlPixiMgr.DownloadScreenShot = function( fileName )
{
	var b = SnlPixiMgr.m_ScreenShotCanvas.toDataURL(SnlPixiMgr.m_ScreenShotType, SnlPixiMgr.m_ScreenShotQuality);
	
	if( SnlPixiMgr.m_ScreenShotType == "image/jpeg" )
	{
		fileName = fileName + ".jpeg";
	}
	else if( SnlPixiMgr.m_ScreenShotType == null || SnlPixiMgr.m_ScreenShotType == "image/png" )
	{
		fileName = fileName + ".png";
	}
		
	var bin = atob(b.split(',')[1]);  
	var buffer = new Uint8Array(bin.length);  
	for (var j = 0; j < bin.length; j++) 
	{  
		buffer[j] = bin.charCodeAt(j);  
	} 
	var blob = new Blob([buffer.buffer], {type: SnlPixiMgr.m_ScreenShotType});
	
	
	if (window.navigator.msSaveBlob) 
	{
		// for IE
		window.navigator.msSaveBlob(blob, fileName)
	}
	else //if (window.webkitURL && window.webkitURL.createObject) 
	{
		window.URL = window.URL || window.webkitURL;
    	var url = window.URL.createObjectURL(blob);
    		
		var a = document.createElement('a');
 	   	a.href = url;
	    a.download = fileName;
	    //a.target = '_blank'

		a.click();
	}
}

SnlPixiMgr.GetUrlParam = function()
{
	var GetParamStr = window.location.search.replace( "?", "" );
	var ParamStrTbl = GetParamStr.split("&");
	var _GET = {};

	for( var i=0; i<ParamStrTbl.length; i++ )
	{
		var d = ParamStrTbl[i].split("=");
		_GET[d[0]] = d[1];
	}

	//console.log( JSON.stringify(_GET) );
	
	return _GET;
};

SnlPixiMgr.prototype = {};


