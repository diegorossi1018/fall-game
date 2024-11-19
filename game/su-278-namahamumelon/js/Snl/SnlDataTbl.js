/**
 * @file    SnlDataTbl.js
 * @brief   Jsonを引っ張ってきてデータテーブル作るクラス
 * @author  D.Hara
 */
var SnlDataTbl = function()
{
	this.m_DefaultExtension = "json";
	this.m_Data = null;
	this.m_CallBackContext = null;
	this.m_CallBack = null;
	
};

SnlDataTbl.prototype = {};

SnlDataTbl.eLoadStep =
{
	None    : 0,
	Loading : 1,
	Done    : 2,
}

// データテーブルを作成して読み込み開始
SnlDataTbl.prototype.Create = function( DataPathTbl, DefaultExtension, CallBackContext, CallBack )
{
	// デフォルト拡張子があれば設定
	if( DefaultExtension != null )
	{
		this.m_DefaultExtension = DefaultExtension;
	}
	
	// 完了コールバックがあれば設定
	if( CallBack != null )
	{
		this.m_CallBack = CallBack;
		this.m_CallBackContext = CallBackContext;
	}
	
	// DataPathTblからデータテーブルを作成
	this.m_Data = {};
	for( var i=0; i<DataPathTbl.length; i++ )
	{
		// キーはファイル名の小文字化したもの
		var Key = DataPathTbl[i].match(".+/(.+?)([\?#;].*)?$")[1];
		Key = Key.toLowerCase();
		
		this.m_Data[Key] =
		{
			Index	: i,							// データインデックス(旧バージョン互換用)
			URL 	: DataPathTbl[i],				// データURL
			Step	: SnlDataTbl.eLoadStep.None,	// 読み込み進捗
			Data 	: null							// データ部
		};
	}
	
	// そのまま読み込むとローディングゲージ等の素材より前に読まれて都合が悪いので0.01秒ディレイ
	var self = this;
	window.setTimeout( function()
	{
		// 最大同時ロード数をPCかどうかで判定
		var MaxConnections = 128;
		var UserAgent = navigator.userAgent.toLowerCase();
		if(	0 < UserAgent.indexOf('ipod') || 0 < UserAgent.indexOf('iphone') || 0 < UserAgent.indexOf('ipad') || 0 < UserAgent.indexOf('android') )
		{
			MaxConnections = 16;
		}
		
		// 最大同時ロード数分読み込みを回す
		for( var i=0; i<DataPathTbl.length && i<MaxConnections; i++ )
		{
			self.GetJson( );
		} 
	},10 );
};

// データテーブル解放
SnlDataTbl.prototype.Destroy = function()
{
	this.m_Data = null;
};

// 読み込み済みファイル数取得
SnlDataTbl.prototype.GetLoadedFileNum = function()
{
	var n = 0;
	for ( var Key in this.m_Data ) 
	{
		if( this.m_Data[Key].Step == SnlDataTbl.eLoadStep.Done )
		{
			n++;
		}
	}
	
	return n;
}

// 読み込み進捗を0-1で表示
SnlDataTbl.prototype.GetLoadProgress = function()
{
	if( this.m_Data == null )
	{
		return 0;
	}
	
	return this.GetLoadedFileNum() / Object.keys(this.m_Data).length;
};

// 読み込みは終了したか？
SnlDataTbl.prototype.isLoadingDone = function()
{
	return Object.keys(this.m_Data).length <= this.GetLoadedFileNum();
};

// 読み込み成功時の処理
SnlDataTbl.prototype.OnSuccess = function( Key, Data )
{
	// データがstringならJSONのパースを試す
	if( typeof Data == "string" )
	{
		try
		{
			this.m_Data[Key].Data = JSON.parse( Data );
		}
		catch(e)
		{
			this.m_Data[Key].Data = Data;
		}
	}
	else
	{
		this.m_Data[Key].Data = Data;
	}
	
	// 読み込み済みに
	this.m_Data[Key].Step = SnlDataTbl.eLoadStep.Done;
	
	// 読み込みがすべて終了すれば完了コールバックを呼ぶ
	if( this.isLoadingDone() )
	{
		if( this.m_CallBack != null )
		{
			if( this.m_CallBackContext == null )
			{
				this.m_CallBack();
			}
			else
			{
				this.m_CallBack.call( this.m_CallBackContext );
			}
		}
		return;
	}
	
	// 次のデータをロード
	this.GetJson();
};

// 未読み込みデータを検索して読み込み処理を開始
SnlDataTbl.prototype.GetJson = function()
{
	for ( var Key in this.m_Data ) 
	{
		if( this.m_Data[Key].Step == SnlDataTbl.eLoadStep.None )
		{
			this.GetJsonCore( Key );
			return;
		}
	}
}

// 読み込み処理のコア
SnlDataTbl.prototype.GetJsonCore = function( Key )
{
	var URL = this.m_Data[Key].URL;
	this.m_Data[Key].Step = SnlDataTbl.eLoadStep.Loading;
	
	// http を含まない場合相対パスなのでBasePathを有効に
	if ( URL.indexOf('http') == -1 ) 
	{
		if( SnlPixiMgr != null )
		{
			if( SnlPixiMgr.m_BasePath != "" )
			{
				URL = SnlPixiMgr.m_BasePath + URL;
			}
		}
	}
	
	// 読み込みアクセス
	var self = this;
	var xhr = new XMLHttpRequest();
	xhr.open( "GET", URL, true );
	
	// 状態変化イベントの設定
	xhr.onreadystatechange = function(oEvent)
	{
		// 完了以外のステータスは無視
	    if (xhr.readyState !== 4) 
	    {
	    	return;
	    }
	    
		// 成功したら読み込み成功時の処理に飛ばす
		if( xhr.status === 200 )
		{
			self.OnSuccess( Key, xhr.responseText );
		}
		// 失敗したら成功するまでループ
		else
		{
			self.GetJsonCore( Key );
		}
	}

	// 通信の開始
	xhr.send();
};

// 更新関数(というか完了チェックしてるだけ 旧バージョン互換)
SnlDataTbl.prototype.Update = function()
{
	return this.isLoadingDone();
};

// インデックスを使用してデータの取得
SnlDataTbl.prototype.GetDataIdx = function(Idx)
{
	// データを走査してIndexとすり合わせ
	for ( var Key in this.m_Data ) 
	{
		if( this.m_Data[Key].Index == Idx )
		{
			return this.m_Data[Key].Data;
		}
	}
	
	// 範囲外アクセスはnull
	return null;
};

// ファイル名からデータを取得
SnlDataTbl.prototype.GetData = function( FileName )
{
	// 拡張子ついてないアクセスの場合は標準拡張子をつける
	if ( FileName.indexOf(".") < 0 ) 
	{
		FileName = FileName + "." + this.m_DefaultExtension;
	}
	FileName = FileName.toLowerCase();
	
	if( FileName in this.m_Data )
	{
		return this.m_Data[FileName].Data;
	}
	
	return null;
};

// 指定データをJSONパース
SnlDataTbl.prototype.ParseData = function( FileName )
{
	// 拡張子ついてないアクセスの場合は標準拡張子をつける
	if ( FileName.indexOf(".") < 0 ) 
	{
		FileName = FileName + "." + this.m_DefaultExtension;
	}
	FileName = FileName.toLowerCase();
	
	if( FileName in this.m_Data )
	{
		this.m_Data[FileName].Data = JSON.parse( this.m_Data[FileName].Data );
	}
};

// 指定データの配列長を取得
SnlDataTbl.prototype.Count = function( FileName )
{
	var Data = this.GetData( FileName );
	if( Data == null )
	{
		return 0;
	}
	
	if( !Array.isArray( Data ) )
	{
		return 0;
	}
	
	return Data.length;
};

// CheckKeyがFindDataなデータを検索し見つかった最初のデータを返す
SnlDataTbl.prototype.FindArray = function( FileName, CheckKey, FindData )
{
	var Data = this.GetData( FileName );
	if( Data == null )
	{
		return null;
	}
	
	if( !Array.isArray( Data ) )
	{
		return null;
	}
	
	var IsArray = ( Array.isArray(CheckKey) && Array.isArray(FindData) );
	
	for( var i=0; i<Data.length; i++ )
	{
		if( IsArray )
		{
			var isHit = true;
			for( var j=0; j<CheckKey.length; j++ )
			{
				if( Data[i][CheckKey[j]] != FindData[j] )
				{
					isHit = false;
				}
			}
			
			if( isHit )
			{
				return Data[i];
			}
		}
		else
		{
			if( Data[i][CheckKey] == FindData )
			{
				return Data[i];
			}
		}
	}
	
	return null;
	
};

// CheckKeyがFindDataなデータのリストを返す
SnlDataTbl.prototype.GetDataList = function( FileName, CheckKey, FindData )
{
	var List = [];
	
	var Data = this.GetData( FileName );
	if( Data == null )
	{
		return List;
	}
	
	if( !Array.isArray( Data ) )
	{
		return List;
	}
	
	for( var i=0; i<Data.length; i++ )
	{
		if( Data[i][CheckKey] == FindData )
		{
			List.push( Data[i] );
		}
	}
	
	return List;
	
};
	
	
	