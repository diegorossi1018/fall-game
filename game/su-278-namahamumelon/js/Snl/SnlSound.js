/**
 * @file 	SnlSound.js
 * @brief 	サウンドを再生するための関数群（PC:AudioAPI or AudioTag, Mobile:AudioAPI)
 * @author	D.Hara
 * @date 	2015/03/25
 */
var SnlSound =  function(){}

// 並列読み込み数
SnlSound.LoadLineNum = 4;

// ロード状況
SnlSound.eLoadStep = 
{
	None 		: 0,		// ロードが開始されていない
	NowLoading	: 1,		// ロード中
	OK			: 2,		// ロード正常終了
	Error		: 3,		// ロードエラー 
};

// サウンドの種類
SnlSound.eSoundType =
{
	BGM			: 0,
	SE			: 1,
	Voice		: 2,
		
	Max			: 3,
};

// 同一サウンドの同時再生時の処理
SnlSound.eMultipleType =
{
	Play 		: 0,		// 同時再生を許可(デフォルト)
	Overwrite	: 1,		// 上書き再生(古いもの停止してから再生)
	Disable		: 2,		// 同時再生禁止(古いのを優先して再生終わるまでは同一サウンドの再生命令を無視）
}

// サウンドの再生は有効か？
SnlSound.m_IsEnable = true;

// AudioTagModeか？
SnlSound.m_AudioTagMode = false;

// WebAudioAPIコンテキスト
SnlSound.m_Context = null;

// ロードファイル番号
SnlSound.m_LoadIndex = [];

// ロード状況
SnlSound.m_LoadStep  = [];

// ファイルパス
SnlSound.m_LoadPath  = [];

// サウンドバッファー
SnlSound.m_Buffer	   = [];

// サウンドソース
SnlSound.m_Source = null;

// サウンドソースのベース時間
SnlSound.m_SourceBaseTime = null;

// Audioオブジェクト
SnlSound.m_AudioObject = null;

// 
SnlSound.m_GainNode = [];

SnlSound.m_Volume = [1,1,1];



// 同時発音数
SnlSound.m_BankMax =
[
	1,	// BGM同時発音数
	10,	// SE同時発音数
	1,	// Voice同時発音数
];

// 次回使用サウンドソース番号
SnlSound.m_BankIndex = [0,0,0];

// 指定タイプのサウンドを再生するか
SnlSound.m_isEnableBGM = true;
SnlSound.m_isEnableSE = true;
SnlSound.m_isEnableVoice = true;

// 最後に再生したサウンド
SnlSound.m_LastPlay = [-1,-1,-1];
SnlSound.m_LastPlayIsLoop = [-1,-1,-1];
SnlSound.m_LastPlayBGM = -1;		// 旧バージョン互換（参照用）

// ロードは終了したか？
SnlSound.m_IsLoadDone = false;

// 同一BGMが再生選択された際に頭出しを行うか
//（ループ再生OFF時はSnlSound.m_isSameBgmRestartに関わらず頭出し）
SnlSound.m_isSameBgmRestart = true;

// BGM復元再生フラグ(Disable→Enableの復元再生フラグ)
SnlSound.RecoverBGM = false;

// 拡張バンク用の連想配列
SnlSound.ExBank = null;

// Exバンクアクセス用のIndexのオフセット
SnlSound.ExBankHead = 10000;

// 初期化
SnlSound.Init = function( )
{
	// ロードは開始
	SnlSound.m_IsLoadDone = false;
	
	// バージョン判定（このクラス単体でも動かせるようにここで判定
	var UserAgent = navigator.userAgent.toLowerCase();
    var iOSVer = 0;
    var isAndroid = false;
	var isiPad = UserAgent.indexOf('ipad') > -1 || UserAgent.indexOf('macintosh') > -1 && 'ontouchend' in document;
    if( 0 < UserAgent.indexOf('ipad') )
	{
		if( 0 < UserAgent.indexOf("cpu os 1") )
		{
			UserAgent.match(/cpu os (\w+){1,4}/g);
			iOSVer=(RegExp.$1.replace(/_/g, '')+'00').slice(0,4);
		}
		else
		{
			UserAgent.match(/cpu os (\w+){1,3}/g);
			iOSVer=(RegExp.$1.replace(/_/g, '')+'00').slice(0,3);
		}
    }
	else if( isiPad )
	{
		iOSVer = 1300;
	}
    else if( 0 < UserAgent.indexOf('ipod') || 0 < UserAgent.indexOf('iphone') )
    {
		if( 0 < UserAgent.indexOf("iphone os 1") )
		{
			UserAgent.match(/iphone os (\w+){1,4}/g);
			iOSVer=(RegExp.$1.replace(/_/g, '')+'00').slice(0,4);
		}
		else
		{
			UserAgent.match(/iphone os (\w+){1,3}/g);
			iOSVer=(RegExp.$1.replace(/_/g, '')+'00').slice(0,3);
		}
     }
     else if( 0 < UserAgent.indexOf('android') )
     {
     	isAndroid = true;
     }
     		
	
	
	// コンテキストの作成
	// こけた場合はWebAudioAPI無効フラグを立てて以降の処理を無効に
	try 
	{
    	// Fix up for prefixing
   	 	window.AudioContext = window.AudioContext||window.webkitAudioContext||window.mozAudioContext;
   	 	
    	SnlSound.m_Context = new AudioContext();
    	
     	if( 900 <= iOSVer )
     	{
     		SnlSound.m_Context.close();
     		SnlSound.m_Context = new AudioContext();
     	}
     	
     	if( SnlSound.m_Context.createGain == null )
     	{
     		SnlSound.m_Context.createGain = SnlSound.m_Context.createGainNode;
     	}
     		
     		
     	if( isAndroid || 600 <= iOSVer )
  		{
  			if( typeof SnlPixiMgr != "undefined" )
  			{
	  			if( SnlPixiMgr.m_HiddenEvent != null )
	  			{
		  			SnlPixiMgr.SetHiddenEvent(SnlSound.HiddenEvent);
					SnlPixiMgr.SetVisibleEvent(SnlSound.VisibleEvent);
				}
			}
  		}
  	}
  	catch(e) 
  	{
  		if( iOSVer == 0 && !isAndroid )	// iOSのバージョンが取得できなくてandroidでもないならとりあえずPC扱い
  		{
			SnlSound.InitAudioTagMode();
		}
		else
	  	{
		   	SnlSound.m_IsEnable = false;
		}
    	return;
  	}
  	
  	SnlSound.m_Source = [];
  	SnlSound.m_SourceBaseTime = [];
  	for( var i=0; i<SnlSound.eSoundType.Max; i++ )
	{
		SnlSound.m_Source[i] = [];
		SnlSound.m_GainNode[i] = [];
		SnlSound.m_SourceBaseTime[i] = [];
		for( var j=0; j<SnlSound.m_BankMax[i]; j++ )
		{
			SnlSound.m_Source[i][j] = null;
			SnlSound.m_GainNode[i][j] = null;
			SnlSound.m_SourceBaseTime[i][j] = 
			{
				BaseTime : 0,
				SoundIndex : -1,
			}
		}
	}
};

// オーディオタグモードの初期化
SnlSound.InitAudioTagMode = function()
{
	SnlSound.m_AudioTagMode = true;
	
	SnlSound.m_AudioObject = [];
	SnlSound.m_SourceBaseTime = [];
	
	for( var i=0; i<SnlSound.eSoundType.Max; i++ )
	{
		SnlSound.m_AudioObject[i] = [];
		SnlSound.m_SourceBaseTime[i] = [];
		for( var j=0; j<SnlSound.m_BankMax[i]; j++ )
		{
			SnlSound.m_AudioObject[i][j] = null;
			SnlSound.m_SourceBaseTime[i][j] = 
			{
				BaseTime : 0,
				SoundIndex : -1,
			}
		}
	}
	SnlSound.m_IsLoadDone = true;
};

// ロード処理  Paths=サウンドリソースパスの配列
SnlSound.Load = function( Paths )
{
	if( !SnlSound.m_IsEnable )
	{
		return;
	}
	/*
	if( SnlSound.m_AudioTagMode )
	{
		for( var i=0; i<Paths.length; i++ )
		{
			SnlSound.m_LoadPath[i] = Paths[i];
		}
		SnlSound.LoadAudioTagMode();
		return;
	}*/
	
	var BasePath = "";
	if( typeof SnlPixiMgr != "undefined" )
	{
		BasePath = SnlPixiMgr.m_BasePath;
	}
	
	
	//SnlSound.m_LoadIndex = 0;
	
	for( var i=0; i<Paths.length; i++ )
	{
		SnlSound.m_LoadStep[i] = SnlSound.eLoadStep.None;
		SnlSound.m_LoadPath[i] = BasePath + Paths[i];
	}
	
	// ロードゲージ読み込み等が先に来るようにディレイ
	window.setTimeout( function()
	{
		for( var i=0; i<SnlSound.LoadLineNum; i++ )
		{
			SnlSound.m_LoadIndex[i] = i;
			SnlSound.LoadCore(i);
		}
	}, 10 );
};

SnlSound.getUnicodeString = function ( arrayBuffer ) 
{
 	var bytes = new Uint8Array( arrayBuffer );
 	var binaryString = "";
  	for( var i = 0; i < bytes.byteLength; i++ ) 
  	{
		binaryString += String.fromCharCode( bytes[ i ] );
  	}
  	return binaryString;
};

SnlSound.getBase64 = function( string )
{
  	return window.btoa( string );
};

SnlSound.BufferToBase64 = function( arrayBuffer )
{
	var UniStr = SnlSound.getUnicodeString( arrayBuffer );
	
	return SnlSound.getBase64( UniStr );
};

// ロード処理コア部
SnlSound.LoadCore = function( LoadIndex ) 
{
	if( !SnlSound.m_IsEnable )
	{
		return;
	}
	
	// 順番にロード
	var SNo = LoadIndex;
	
	if( SnlSound.m_LoadPath.length <= SNo )
	{
		return;
	}
	
	SnlSound.m_LoadStep[SNo] = SnlSound.eLoadStep.NowLoading;
	
  	var request = new XMLHttpRequest();
  	request.open('GET', SnlSound.m_LoadPath[SNo], true);
  	request.responseType = 'arraybuffer';

  	// ロード成功時のコールバック設定
  	request.SnlSoundLoadIndex = SNo;
  	request.onload = function(e) 
  	{
  		var LoadIndex = e.target.SnlSoundLoadIndex;
  		
  		
  		if( SnlSound.m_AudioTagMode )
  		{
  			SnlSound.m_Buffer[LoadIndex] = null;
  				
  			// 1MB以下はBase64化して保持
  			if( request.response.byteLength <= 1000000 )
  			{
  				SnlSound.m_Buffer[LoadIndex] = SnlSound.BufferToBase64( request.response );
  			}

   			SnlSound.m_LoadStep[LoadIndex] = SnlSound.eLoadStep.OK;
   			SnlSound.LoadCore(LoadIndex+SnlSound.LoadLineNum);
  		}
  		else
  		{
    		SnlSound.m_Context.decodeAudioData
    		(
    			request.response, 
	    		function(buffer) 
    			{
    				var LoadIndex = e.target.SnlSoundLoadIndex;
    				SnlSound.m_LoadStep[LoadIndex] = SnlSound.eLoadStep.OK;
    				SnlSound.m_Buffer[LoadIndex] = buffer;
    			
    				SnlSound.LoadCore(LoadIndex+SnlSound.LoadLineNum);
    			
    			},
    			function()
				{
					var LoadIndex = e.target.SnlSoundLoadIndex;
					SnlSound.m_LoadStep[LoadIndex] = SnlSound.eLoadStep.Error;
					SnlSound.m_Buffer[LoadIndex] = null;
	   			 	SnlSound.LoadCore(LoadIndex+SnlSound.LoadLineNum);
	   			}
    		);
    	}
  	}
  	
  	// ロード失敗時のコールバック設定
  	request.onerror = function(e)
	{
		var LoadIndex = e.target.SnlSoundLoadIndex;
		SnlSound.m_LoadStep[LoadIndex] = SnlSound.eLoadStep.Error;
		SnlSound.m_Buffer[LoadIndex] = null;
   	 	SnlSound.LoadCore(LoadIndex+SnlSound.LoadLineNum);
   	}
  	
  	// ロードリクエスト
  	request.send();
};

// すべてのサウンドがロードされたか？
// (エラーでもロード済みとする）
SnlSound.isAllLoad = function()
{
	if( !SnlSound.m_IsEnable )
	{
		return true;
	}
	
	for( var i=0; i<SnlSound.m_LoadPath.length; i++ )
	{
		if( SnlSound.m_LoadStep[i] != SnlSound.eLoadStep.OK &&
			SnlSound.m_LoadStep[i] != SnlSound.eLoadStep.Error)
		{
			return false;
		}
	}
	
	SnlSound.m_IsLoadDone = true;
	
	return true;
};

// ロード進行度取得
SnlSound.GetLoadProgress = function()
{
	if( !SnlSound.m_IsEnable )
	{
		return 1;
	}
	
	var c = 0;
		
	for( var i=0; i<SnlSound.m_LoadPath.length; i++ )
	{
		if( SnlSound.m_LoadStep[i] == SnlSound.eLoadStep.OK ||
			SnlSound.m_LoadStep[i] == SnlSound.eLoadStep.Error)
		{
			c++;
		}
	}
	
	return c / SnlSound.m_LoadPath.length;
};

// すべてのサウンドを再生して直後に停止させる
// これをタップイベント等でコールすることで以降は任意のタイミングでサウンドの再生が可能
SnlSound.AllPlayAndStop = function()
{
	if( !SnlSound.m_IsEnable || SnlSound.m_AudioTagMode || !SnlSound.m_IsLoadDone )
	{
		return;
	}
	
	for( var i=0; i<SnlSound.m_LoadPath.length; i++ )
	{
		if( SnlSound.m_LoadStep[i] != SnlSound.eLoadStep.OK )
		{
			continue;
		}
		
		var source = SnlSound.m_Context.createBufferSource(); 	// creates a sound source
  		source.buffer = SnlSound.m_Buffer[i];                  	// tell the source which sound to play
  		source.connect(SnlSound.m_Context.destination);      	// connect the source to the context's destination (the speakers)
  		source.start(0);                           				// play the source now
                                            						// note: on older systems, may have to use deprecated noteOn(time);
           
           //Chrome55対策                                 						
           if (source.context.state === 'suspended') 
           {
               source.context.resume();
           }
                                            						
    		source.stop(0);
	}
};

SnlSound.isEnableSoundType = function( SoundType )
{
	var isEnable = [ SnlSound.m_isEnableBGM, SnlSound.m_isEnableSE, SnlSound.m_isEnableVoice ];
	
	return isEnable[SoundType];
};

// 再生
// SoundType:サウンドの処理種類　SoundIndex:再生するサウンドのIdx isLoop:ループ再生をするか？ MultipleType: 同一音声の多重再生時の処理(デフォルトは多重再生許可)
SnlSound.Play = function( SoundType, SoundIndex, isLoop, MultipleType )
{
	// 多重再生はデフォルトでは許可
	if( typeof MultipleType === "undefined" )
	{
		MultipleType = SnlSound.eMultipleType.Play;
	}
	// 第4引数のcanMultipleで処理してた名残( canMultiple true:SnlSound.eMultipleType.Play, false:SnlSound.eMultipleType.Disable )
	else if( typeof MultipleType === "boolean" )
	{
		if( MultipleType )
		{
			MultipleType = SnlSound.eMultipleType.Play;
		}
		else
		{
			MultipleType = SnlSound.eMultipleType.Disable;
		}
	}

	
	if( !SnlSound.m_IsEnable || !SnlSound.m_IsLoadDone )
	{
		return;
	}
	
	if( SoundIndex < 0 || (typeof SoundIndex === "undefined") )
	{
		return;
	}
		
	var SoundBankIdx = Math.floor( SoundIndex / SnlSound.ExBankHead );
	if( SoundBankIdx == 0 )
	{
		if( SnlSound.m_LoadPath.length <= SoundIndex )
		{
			return;
		}
	}
	else
	{
		if( SnlSound.ExBank == null )
		{
			return;
		}
			
		if( SnlSound.ExBank[SoundBankIdx] == null )
		{
			return;
		}
		
		if( !SnlSound.ExBank[SoundBankIdx].m_IsLoadDone )
		{
			return;
		}
		
		if( !SnlSound.ExBank[SoundBankIdx].IdxCheck( SoundIndex ) )
		{
			return
		}
	}
	
	if( SnlSound.eSoundType.BGM == SoundType )
	{
		if( !SnlSound.RecoverBGM && !SnlSound.m_isSameBgmRestart && isLoop )
		{
			if( SnlSound.m_LastPlay[SoundType] == SoundIndex )
			{
				return;
			}
		}
	}

	SnlSound.m_LastPlay[SoundType] = SoundIndex;
	SnlSound.m_LastPlayIsLoop[SoundType] = isLoop;
	
	if( SnlSound.eSoundType.BGM == SoundType )
	{
		SnlSound.m_LastPlayBGM = SoundIndex;
	}
	
	if( !SnlSound.isEnableSoundType(SoundType) )
	{
		return;
	}
	
	var Idx = SnlSound.m_BankIndex[SoundType];
	if( SnlSound.m_BankMax[SoundType] <= (Idx + 1)  )
	{
		SnlSound.m_BankIndex[SoundType] = 0;
	}
	else
	{
		SnlSound.m_BankIndex[SoundType] = Idx + 1;
	}
	
	// Audioタグモード時の動作
	if( SnlSound.m_AudioTagMode )
	{
		if( 1 <= SoundBankIdx )
		{
			return;
		}
		
		switch( MultipleType )
		{
			// 同一サウンド同時再生禁止処理
			case SnlSound.eMultipleType.Disable:
				for( var i=0; i<SnlSound.m_SourceBaseTime[SoundType].length; i++ )
				{
					if( SnlSound.m_SourceBaseTime[SoundType][i].SoundIndex == SoundIndex )
					{
						if( !SnlSound.m_AudioObject[SoundType][i].ended )
						{
							return;
						}
					}
				}
			break;
			
			// 同一サウンド上書き処理
			case SnlSound.eMultipleType.Overwrite:
				for( var i=0; i<SnlSound.m_SourceBaseTime[SoundType].length; i++ )
				{
					if( SnlSound.m_SourceBaseTime[SoundType][i].SoundIndex == SoundIndex )
					{
						if( !SnlSound.m_AudioObject[SoundType][i].ended )
						{
							SnlSound.m_AudioObject[SoundType][i].pause();
				  			SnlSound.m_AudioObject[SoundType][i].removeAttribute();
				  			SnlSound.m_AudioObject[SoundType][i] = null;
				  			
				  			SnlSound.m_SourceBaseTime[SoundType][i].SoundIndex = -1;
						}
					}
				}
			break;
		}
		
		if( SnlSound.m_AudioObject[SoundType][Idx] != null )
		{
			SnlSound.m_AudioObject[SoundType][Idx].pause();
  			SnlSound.m_AudioObject[SoundType][Idx].removeAttribute();
  			SnlSound.m_AudioObject[SoundType][Idx] = null;
  		}
  		
  		var PathL = SnlSound.m_LoadPath[SoundIndex].toLowerCase();
  		var mime = "audio";
  		if( 0 <= PathL.indexOf(".mp3") )
  		{
  			mime = "audio/mp3";
  		}
  		else if( 0 <= PathL.indexOf(".aac") )
  		{
  			mime = "audio/aac";
  		}	  		
  		else if( 0 <= PathL.indexOf(".ogg") )
  		{
  			mime = "audio/ogg";
  		}
  		else if( 0 <= PathL.indexOf(".wav") )
  		{
  			mime = "audio/wav";
  		}
  				  		
  		
  		
  		if( SnlSound.m_Buffer[SoundIndex] != null )
  		{
  			
  			SnlSound.m_AudioObject[SoundType][Idx] = new Audio( "data:audio/mp3;base64,"+SnlSound.m_Buffer[SoundIndex] );
  		}
  		else
  		{
  			SnlSound.m_AudioObject[SoundType][Idx] = new Audio(SnlSound.m_LoadPath[SoundIndex]);
	  	}
  		
  		var v = SnlSound.m_Volume[SoundType] * SnlSound.m_Volume[SoundType];
  		SnlSound.m_AudioObject[SoundType][Idx].loop = isLoop;
  		SnlSound.m_AudioObject[SoundType][Idx].volume = v;
		SnlSound.m_AudioObject[SoundType][Idx].load();
		SnlSound.m_AudioObject[SoundType][Idx].play();
		SnlSound.m_SourceBaseTime[SoundType][Idx].SoundIndex = SoundIndex;
		return;
	}
	
	try
	{
		var duration;
		var soundBuffer = null;
		if( SoundBankIdx == 0 )
		{
			if( SnlSound.m_LoadStep[SoundIndex] != SnlSound.eLoadStep.OK )
			{
				return;
			}
			
			duration = SnlSound.m_Buffer[SoundIndex].duration;
			soundBuffer = SnlSound.m_Buffer[SoundIndex];
		}
		else
		{
			duration = SnlSound.ExBank[SoundBankIdx].GetDuration( SoundIndex );
			soundBuffer = SnlSound.ExBank[SoundBankIdx].GetSoundBuffer( SoundIndex );
				
			if( soundBuffer == null )
			{
				return;
			}
		}
		
		switch( MultipleType )
		{
			// 同一サウンド同時再生禁止処理
			case SnlSound.eMultipleType.Disable:
				for( var i=0; i<SnlSound.m_SourceBaseTime[SoundType].length; i++ )
				{
					if( SnlSound.m_SourceBaseTime[SoundType][i].SoundIndex == SoundIndex )
					{
						var PlayTime = SnlSound.m_Source[SoundType][i].context.currentTime - SnlSound.m_SourceBaseTime[SoundType][i].BaseTime;
						if( PlayTime <= duration )
						{
							return;
						}
					}
				}
			break;
			
			// 同一サウンド上書き処理
			case SnlSound.eMultipleType.Overwrite:
				for( var i=0; i<SnlSound.m_SourceBaseTime[SoundType].length; i++ )
				{
					if( SnlSound.m_SourceBaseTime[SoundType][i].SoundIndex == SoundIndex )
					{
						var PlayTime = SnlSound.m_Source[SoundType][i].context.currentTime - SnlSound.m_SourceBaseTime[SoundType][i].BaseTime;
						if( PlayTime <= duration )
						{
							SnlSound.m_Source[SoundType][i].stop(0);
							SnlSound.m_Source[SoundType][i] = null;
							SnlSound.m_SourceBaseTime[SoundType][i].SoundIndex = -1;
						}
					}
				}
			break;
		}
		
	
		// 使用中なら停止
		if( SnlSound.m_Source[SoundType][Idx] != null )
		{
			SnlSound.m_Source[SoundType][Idx].stop(0);
			SnlSound.m_Source[SoundType][Idx] = null;
			SnlSound.m_SourceBaseTime[SoundType][Idx].SoundIndex = -1;
		}
		
		if( SnlSound.m_GainNode[SoundType][Idx] == null )
		{
			var t0 = SnlSound.m_Context.currentTime;
			var v = SnlSound.m_Volume[SoundType] * SnlSound.m_Volume[SoundType];
			
			SnlSound.m_GainNode[SoundType][Idx] = SnlSound.m_Context.createGain();
			SnlSound.m_GainNode[SoundType][Idx].gain.setValueAtTime( v, t0 );
		}
		
		// 再生
		SnlSound.m_Source[SoundType][Idx] = SnlSound.m_Context.createBufferSource(); 									// creates a sound source
  		SnlSound.m_Source[SoundType][Idx].buffer = soundBuffer;        								// tell the source which sound to play
  		SnlSound.m_Source[SoundType][Idx].loop = isLoop;																// ループフラグの設定
  		SnlSound.m_Source[SoundType][Idx].connect(SnlSound.m_GainNode[SoundType][Idx]);									// ボリューム調整用のgainNodeに接続
  		SnlSound.m_GainNode[SoundType][Idx].connect(SnlSound.m_Context.destination);									// gainNodeを出力に接続
  		SnlSound.m_SourceBaseTime[SoundType][Idx].BaseTime = SnlSound.m_Source[SoundType][Idx].context.currentTime;		// 再生開始時のcontextの時間を保持
  		SnlSound.m_SourceBaseTime[SoundType][Idx].SoundIndex = SoundIndex;												// 関連付けられたSoundIdxを保持
  		SnlSound.m_Source[SoundType][Idx].start(0);                           											// play the source now
		
		
		
		 //Chrome55でのバグ対策
		if (SnlSound.m_Source[SoundType][Idx].context.state === 'suspended') 
        {
        	SnlSound.m_Source[SoundType][Idx].context.resume();
        }

	}
	catch( e )
	{
  	}

};

SnlSound.SetVolume = function( SoundType, Volume )
{
	if( !SnlSound.m_IsEnable )
	{
		return;
	}
	
	if( Volume < 0 )
	{
		Volume = 0;
	}
	
	if( 1 < Volume )
	{
		Volume = 1;
	}
	
	SnlSound.m_Volume[SoundType] = Volume;
	var v = SnlSound.m_Volume[SoundType] * SnlSound.m_Volume[SoundType];
	if( SnlSound.m_AudioTagMode )
	{
		for( var j=0; j<SnlSound.m_BankMax[SoundType]; j++ )
		{
			if( SnlSound.m_AudioObject[SoundType][j] != null )
			{
		  		SnlSound.m_AudioObject[SoundType][j].volume = v;
		  	}
		}
	}
	else
	{
		var t0 = SnlSound.m_Context.currentTime;
		for( var i=0; i<SnlSound.m_GainNode[SoundType].length; i++ )
		{
			if( SnlSound.m_GainNode[SoundType][i] != null )
			{
				//var v = SnlSound.m_Volume[SoundType] * SnlSound.m_Volume[SoundType];//SnlSound.m_Volume[SoundType];//SnlSound.m_Volume[SoundType] * SnlSound.m_Volume[SoundType];
				SnlSound.m_GainNode[SoundType][i].gain.setValueAtTime( v, t0 );
				//gain.gain.setValueAtTime(gain.gain.value, t0);
				//SnlSound.m_GainNode[SoundType][i].gain.value = ;
			}
		}
	}
}

// 停止
SnlSound.Stop = function( SoundType )
{
	if( !SnlSound.m_IsEnable || !SnlSound.m_IsLoadDone )
	{
		return;
	}
	
	SnlSound.m_LastPlay[SoundType] = -1;
	SnlSound.m_LastPlayIsLoop[SoundType] = false;
	if( SnlSound.eSoundType.BGM == SoundType )
	{
		SnlSound.m_LastPlayBGM = -1;
	}
	
	if( SnlSound.m_AudioTagMode )
	{
		for( var j=0; j<SnlSound.m_BankMax[SoundType]; j++ )
		{
			if( SnlSound.m_AudioObject[SoundType][j] != null )
			{
				SnlSound.m_AudioObject[SoundType][j].pause();
				SnlSound.m_SourceBaseTime[SoundType][j].SoundIndex = -1;
			}
		}
		return;
	}
	
	try
	{
		SnlSound.m_BgmBankIndex = 0;
		for( var j=0; j<SnlSound.m_BankMax[SoundType]; j++ )
		{
	  		if( SnlSound.m_Source[SoundType][j] != null )
			{
				SnlSound.m_Source[SoundType][j].stop(0);
				SnlSound.m_Source[SoundType][j] = null;
				SnlSound.m_SourceBaseTime[SoundType][j].SoundIndex = -1;
			}
	  	}
	}
	catch( e )
	{
  	}
};

// 有効/無効設定
SnlSound.SetEnable = function( SoundType, isEnable )
{
	if( SnlSound.isEnableSoundType(SoundType) == isEnable )
	{
		return;
	}
	
	switch( SoundType )
	{
		case SnlSound.eSoundType.BGM:		SnlSound.m_isEnableBGM = isEnable;		break;
		case SnlSound.eSoundType.SE:		SnlSound.m_isEnableSE  = isEnable;		break;
		case SnlSound.eSoundType.Voice:		SnlSound.m_isEnableVoice = isEnable;	break;
	}
	
	if( SoundType == SnlSound.eSoundType.BGM )
	{
		if( isEnable )
		{
			if( 0 <= SnlSound.m_LastPlay[SoundType] )
			{
				SnlSound.RecoverBGM = true;
				SnlSound.Play( SoundType, SnlSound.m_LastPlay[SoundType], SnlSound.m_LastPlayIsLoop[SoundType] );
				SnlSound.RecoverBGM = false;
			}
		}
		else
		{
			var LastBGM = SnlSound.m_LastPlay[SoundType];
			var LastLoop = SnlSound.m_LastPlayIsLoop[SoundType];
			SnlSound.Stop(SoundType);
			SnlSound.m_LastPlay[SoundType] = LastBGM;
			SnlSound.m_LastPlayBGM = LastBGM;
			SnlSound.m_LastPlayIsLoop[SoundType] = LastLoop;
		}
	}
	else
	{
		if( !isEnable )
		{
			SnlSound.Stop(SoundType);
		}
	}
};

// 非表示イベント
SnlSound.HiddenEvent = function()
{
	var LastBGM = SnlSound.m_LastPlay[SnlSound.eSoundType.BGM];
	var LastLoop = SnlSound.m_LastPlayIsLoop[SnlSound.eSoundType.BGM];
	SnlSound.StopBGM();
	SnlSound.m_LastPlay[SnlSound.eSoundType.BGM] = LastBGM;
	SnlSound.m_LastPlayBGM = LastBGM;
	SnlSound.m_LastPlayIsLoop[SnlSound.eSoundType.BGM] = LastLoop;
};

// 表示イベント
SnlSound.VisibleEvent = function()
{
	if( SnlSound.isEnableSoundType(SnlSound.eSoundType.BGM) )
	{
		if( 0 <= SnlSound.m_LastPlay[SnlSound.eSoundType.BGM] )
		{
			// ループBGMのみ復帰
			if( SnlSound.m_LastPlayIsLoop[SnlSound.eSoundType.BGM] )
			{
				SnlSound.RecoverBGM = true;
				SnlSound.PlayBGM( SnlSound.m_LastPlay[SnlSound.eSoundType.BGM], true );
				SnlSound.RecoverBGM = false;
			}
		}
	}
};

// BGMの再生
// SoundIndex:再生するサウンドのIdx isLoop:ループ再生をするか？(デフォルトはループする)
SnlSound.PlayBGM = function( SoundIndex, isLoop )
{
	if( typeof isLoop === "undefined" )
	{
		isLoop = true;
	}
	
	SnlSound.Play( SnlSound.eSoundType.BGM, SoundIndex, isLoop );
};

// BGMの停止
SnlSound.StopBGM = function()
{
	SnlSound.Stop( SnlSound.eSoundType.BGM );
};

// Voiceの再生
// SoundIndex:再生するサウンドのIdx isLoop:ループ再生をするか？(デフォルトはループしない)
SnlSound.PlayVoice = function( SoundIndex, isLoop )
{
	if( typeof isLoop === "undefined" )
	{
		isLoop = false;
	}
	
	SnlSound.Play( SnlSound.eSoundType.Voice, SoundIndex, isLoop );
};

// voiceの停止
SnlSound.StopVoice = function()
{
	SnlSound.Stop( SnlSound.eSoundType.Voice );
};

// SEの再生 
// SoundIndex:再生するサウンドのIdx MultipleType: 同一音声の多重再生時の処理(デフォルトは多重再生許可)
SnlSound.PlaySE = function( SoundIndex, MultipleType )
{
	if( typeof MultipleType === "undefined" )
	{
		MultipleType = SnlSound.eMultipleType.Play;
	}
	
	SnlSound.Play( SnlSound.eSoundType.SE, SoundIndex, false, MultipleType );
};

// BGMの有効無効設定 
// isEnable	true:再生有効 false:再生無効
SnlSound.SetEnableBGM = function( isEnable )
{
	SnlSound.SetEnable( SnlSound.eSoundType.BGM, isEnable );
};

// SEの有効無効設定 
// isEnable	true:再生有効 false:再生無効
SnlSound.SetEnableSE = function( isEnable )
{
	SnlSound.SetEnable( SnlSound.eSoundType.SE, isEnable );
};

// Voiceの有効無効設定 
// isEnable	true:再生有効 false:再生無効
SnlSound.SetEnableVoice = function( isEnable )
{
	SnlSound.SetEnable( SnlSound.eSoundType.Voice, isEnable );
};


// PathからSoundIndexに変換
SnlSound.PathToSoundIndex = function( Path )
{
	if( SnlSound.ExBank != null )
	{
		for (var i in SnlSound.ExBank)
		{
			var BankIdx = SnlSound.ExBank[i].GetBankIndex();
			var SoundIdx = SnlSound.ExBank[i].PathToSoundIndex( Path );
			if( SoundIdx <= 0 )
			{
				return BankIdx * SnlSound.ExBankHead + SoundIdx;
			}
		}
	}
	
	for( var i=0; i<SnlSound.m_LoadPath.length; i++ )
	{
		if( 0 <= SnlSound.m_LoadPath[i].indexOf( Path ) )
		{
			return i;
		}
	}
	
	return -1;
};

// ファイルPathでBGM再生
SnlSound.PlayBGM_FP = function( Path )
{
	SnlSound.PlayBGM( SnlSound.PathToSoundIndex( Path ) );
};

// ファイルPathでSE再生
SnlSound.PlaySE_FP = function( Path )
{
	SnlSound.PlaySE( SnlSound.PathToSoundIndex( Path ) );
};

// ファイルPathでVoice再生
SnlSound.PlayVoice_FP = function( Path )
{
	SnlSound.PlayVoice( SnlSound.PathToSoundIndex( Path ) );
};

// ファイルPath配列からランダムでボイスを再生
SnlSound.PlayVoice_FPR = function( Paths )
{
	var r = Math.floor( Math.random() * Paths.length );
	SnlSound.PlayVoice( SnlSound.PathToSoundIndex( Paths[r] ) );
};

// 拡張バンクの登録
SnlSound.EntryExBank = function( Bank )
{
	if( SnlSound.ExBank == null )
	{
		SnlSound.ExBank = {};
	}
	
	var BankIdx = Bank.GetBankIndex();
	
	SnlSound.ExitExBank( BankIdx );
	SnlSound.ExBank[BankIdx] = Bank;
}

// 拡張バンクの削除
SnlSound.ExitExBank = function( BankIdx )
{
	if( SnlSound.ExBank == null )
	{
		return;
	}
	
	if( SnlSound.ExBank[BankIdx] != null )
	{
		SnlSound.ExBank[BankIdx].DestroyCore();
		SnlSound.ExBank[BankIdx] = null;
		
		delete SnlSound.ExBank[BankIdx];
	}
}

SnlSound.prototype = 
{

};

