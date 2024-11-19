/**
 * @file 	SnlCreditBtn.js
 * @brief 	汎用クレジットボタン(要：SU_Api)
 * @author	D.Hara
 */
var SnlCreditBtn =  function(){};
SnlCreditBtn.prototype = {};

// デフォルトは最前面
SnlCreditBtn.DispZ = 0;

// SnlCreditBtnは有効？
SnlCreditBtn.isEnable  = false;

// SnlCreditBtnは表示？
SnlCreditBtn.isVisible = false;

SnlCreditBtn.CreditTexName = "./ImgSnl/CreditBtn.png";
SnlCreditBtn.CreditTex = null;
SnlCreditBtn.CreditObj = null;
SnlCreditBtn.CreaditTexInfo = { w:120, h:30 };

SnlCreditBtn.Step = 0;

SnlCreditBtn.eStep =
{
	Idel  : 0,
	Press : 1,
}

// 初期化(自動で呼ばれます)
SnlCreditBtn.Init = function()
{
	// 初期化済みならなにもしない
	if( SnlCreditBtn.isEnable )
	{
		return;
	}
	
	// SU_Apiとクレジット表示命令の存在確認
	if( typeof SU_Api !== "undefined" )
	{
		if( typeof SU_Api.ViewGamesCredit !== "undefined" )
		{
			SnlCreditBtn.isEnable = true;
		}
	}
	
	if( !SnlCreditBtn.isEnable )
	{
		return;
	}
	
	// テクスチャの読み込み
	if( typeof PIXI.Texture.from !== "undefined" )
	{
		SnlCreditBtn.CreditTex = PIXI.Texture.from( SnlPixiMgr.m_BasePath + SnlCreditBtn.CreditTexName );
	}
	else
	{
		SnlCreditBtn.CreditTex = PIXI.Texture.fromImage( SnlPixiMgr.m_BasePath + SnlCreditBtn.CreditTexName );
	}

	SnlCreditBtn.isVisible = false;
	
	requestAnimationFrame( SnlCreditBtn.Update );
};

// 位置とアンカーの設定
SnlCreditBtn.SetPos = function( x, y, anchorX, anchorY )
{
	if( !SnlCreditBtn.isEnable )
	{
		return;
	}

	if( SnlCreditBtn.CreditObj == null )
	{
		return;
	}
	
	if( typeof AncX !== "undefined" )
	{
		SnlCreditBtn.CreditObj.SetAnchor( anchorX, anchorY );
	}
	SnlCreditBtn.CreditObj.SetPos( x, y );
}

// 表示切り替え
SnlCreditBtn.SetVisible = function( isVisible, DispZ )
{
	if( !SnlCreditBtn.isEnable )
	{
		return;
	}
	
	if( typeof DispZ !== "undefined" )
	{
		SnlCreditBtn.DispZ = DispZ;
		if( SnlCreditBtn.CreditObj != null )
		{
			SnlCreditBtn.CreditObj.SetZ( DispZ );
		}
	}
	
	if( SnlCreditBtn.CreditObj == null )
	{
		SnlCreditBtn.CreditObj = new SnlObject();
		SnlCreditBtn.CreditObj.CreateSpriteFromImg( SnlCreditBtn.CreditTex, SnlCreditBtn.CreaditTexInfo, SnlPixiMgr.m_Width, 0, 1, 0, SnlCreditBtn.DispZ );

	}
	
	SnlCreditBtn.CreditObj.SetVisible( isVisible );
	SnlCreditBtn.isVisible= isVisible;
};

// 更新(自動でよばれます)
SnlCreditBtn.Update = function()
{
	if( !SnlCreditBtn.isEnable )
	{
		return;
	}
	
	var isNotUpdate = false;
	if( typeof SU_Api !== "undefined" )
	{
		if( typeof SU_Api.isView !== "undefined" )
		{
			if( SU_Api.isView() )
			{
				isNotUpdate = true;
			}
		}
		if( typeof SaveDataMgr !== "undefined" )
		{
			if( SaveDataMgr.SaveExec )
			{
				isNotUpdate = true;
			}
		}
	}
	
	if( !isNotUpdate )
	{
		SnlCreditBtn.UpdateCore();
	}
	
	requestAnimationFrame( SnlCreditBtn.Update );
}

SnlCreditBtn.UpdateCore = function()
{
	// 無効or非表示はなにもしない
	if( !SnlCreditBtn.isEnable || !SnlCreditBtn.isVisible )
	{
		return;
	}
	
	// テクスチャ読み込み中はなにもしない
	if( typeof SnlCreditBtn.CreditTex.baseTexture.valid !== "undefined" )
	{
		if( !SnlCreditBtn.CreditTex.baseTexture.valid )
		{
			return;
		}
	}
	else
	{
		if( !SnlCreditBtn.CreditTex.baseTexture.hasLoaded )
		{
			return;
		}
	}
	
	if( SnlCreditBtn.CreditObj == null )
	{
		return;
	}
	
	switch( SnlCreditBtn.Step )
	{
		case SnlCreditBtn.eStep.Idel:
			if( SnlCreditBtn.CreditObj.InputHitCheck2( 1, true, true ) )
			{
				SnlCreditBtn.Step = SnlCreditBtn.eStep.Press;
			}
		break;
		
		case SnlCreditBtn.eStep.Press:
			if( SnlPixiMgr.m_MouseUp )
			{
				SU_Api.ViewGamesCredit();
				SnlCreditBtn.Step = SnlCreditBtn.eStep.Idel;
				return;
			}
			else if( SnlPixiMgr.m_MousePress )
			{
				if( !SnlCreditBtn.CreditObj.InputHitCheck2( 1, false, false ) )
				{
					SnlCreditBtn.Step = SnlCreditBtn.eStep.Idel;
				}
			}
			else
			{
				SnlCreditBtn.Step = SnlCreditBtn.eStep.Idel;
			}
		break;
	}
};

// 初期化
SnlCreditBtn.Init();


