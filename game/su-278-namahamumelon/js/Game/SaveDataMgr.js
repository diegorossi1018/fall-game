// セーブデータ管理
var SaveDataMgr = function(){}

SaveDataMgr.Key = SU_Api.m_ServiceProvider + "_" + "su-278-namahamumelon";		// ゲーム毎に一意な値を設定する

SaveDataMgr.SaveData = null;
SaveDataMgr.SaveExec = false;
	
SaveDataMgr.Init = function()
{
	SaveDataMgr.SaveExec = true;
	if( SU_Api.m_ServiceProvider == "DSG" )
	{
		SU_Api.getDB(SaveDataMgr.InitCore, SaveDataMgr.Init, "SaveData" );
	}
	else
	{
		SaveDataMgr.InitCore( null );
	}
}
	
	
SaveDataMgr.InitCore = function( ServerSaveStr )
{
	SaveDataMgr.SaveExec = false;
	
	var SaveStr = ServerSaveStr; 
	if( SU_Api.m_ServiceProvider == "DSG" )
	{
		
	}
	else
	{
		SaveStr = localStorage.getItem( SaveDataMgr.Key );
	}
	
	if( SaveStr != null )
	{
		try 
		{
			SaveDataMgr.SaveData = JSON.parse( SaveStr );
			return;
		}
		catch (o_O) 
		{
			console.log("SaveDataError!");
		}
	}

	SaveDataMgr.SaveData = 
	{
		HighScore : 0,
		SecondScore : 0,
		ThirdScore : 0
	};

	SaveDataMgr.Save();
};
	
SaveDataMgr.Save = function()
{
	if( SU_Api.m_ServiceProvider == "DSG" )
	{
		SaveDataMgr.SaveExec = true;
		SU_Api.setDB( SaveDataMgr.SaveServerEnd, SaveDataMgr.Save, "SaveData",  JSON.stringify( SaveDataMgr.SaveData, null, '\t' ) );
	}
	else
	{
		localStorage.setItem( SaveDataMgr.Key,  JSON.stringify( SaveDataMgr.SaveData, null, '\t' ) );
	}
};

SaveDataMgr.SetHighScore = function( Score )
{
	if( Score < SaveDataMgr.SaveData.HighScore )
	{
		return;
	}
	
	SaveDataMgr.SaveData.HighScore = Score;
	SaveDataMgr.Save();
	
	if( SU_Api.m_ServiceProvider == "SU" )
	{
		SaveDataMgr.MergeServerData();
	}
}
	
SaveDataMgr.SaveServerEnd = function()
{
	SaveDataMgr.SaveExec = false;
};
	



// 以下ゲームの窓
SaveDataMgr.isMergeExec = false;
	
SaveDataMgr.MergeServerData = function()
{
	SaveDataMgr.isMergeExec = true;
	SU_Api.getDB(SaveDataMgr.LoadServerSuccess, SaveDataMgr.MergeEnd, "SaveData" );
};
	
SaveDataMgr.LoadServerSuccess = function( Json )
{
	var Obj =null;
	if( Json != null )
	{
		try 
		{
			Obj = JSON.parse( Json );
		}
		catch (o_O) 
		{
			console.log("SaveDataError!");
		}
	}
	
	if( Obj != null )
	{
		// マージ処理
		if( SaveDataMgr.SaveData.HighScore < Obj.HighScore )
		{
			SaveDataMgr.SaveData.HighScore = Obj.HighScore;
		}

		if( SaveDataMgr.SaveData.SecondScore < Obj.SecondScore )
		{
			SaveDataMgr.SaveData.SecondScore < Obj.SecondScore;
		}

		if( SaveDataMgr.SaveData.ThirdScore < Obj.ThirdScore )
		{
			SaveDataMgr.SaveData.ThirdScore < Obj.ThirdScore;
		}
	}
	
	SaveDataMgr.Save();
	
	var Data = {};
	
	SU_Api.setDB( SaveDataMgr.MergeEnd, SaveDataMgr.MergeEnd, "SaveData", JSON.stringify( Data, null, '\t' ) );
	
};
	
SaveDataMgr.MergeEnd = function()
{
	SaveDataMgr.isMergeExec = false;
};
	

SaveDataMgr.prototype ={};
