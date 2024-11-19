/**
 * @file 	SnlLoadingGauge.js
 * @brief 	ローディングプログレスバークラス
 * @author	D.Hara
 */
var SnlLoadingGauge =  function(){};

SnlLoadingGauge.m_DispZ = 0;
SnlLoadingGauge.m_Enable = false;
SnlLoadingGauge.m_CoreTexName = "./ImgSnl/Loading_Core.png";
SnlLoadingGauge.m_CoreWidth = 256;
SnlLoadingGauge.m_FrameTexName = "./ImgSnl/Loading_Frame.png";
SnlLoadingGauge.m_BGTexName = "./ImgSnl/Loading_Back.png";
SnlLoadingGauge.m_BGTexScale = 40;

SnlLoadingGauge.m_Pos = { x:0.5, y:0.5 };

SnlLoadingGauge.m_CoreTex = null;
SnlLoadingGauge.m_FrameTex = null;
SnlLoadingGauge.m_BGTex = null;

SnlLoadingGauge.m_FrameObj = null;
SnlLoadingGauge.m_CoreObj = null;
SnlLoadingGauge.m_BGObj = null;

SnlLoadingGauge.Init = function( DispZ )
{
	SnlLoadingGauge.m_DispZ = DispZ;
	if( SnlPixiMgr.ePixiVersion.V5 <= SnlPixiMgr.PixiVersion )
	{
		SnlLoadingGauge.m_BGTex = PIXI.Texture.from( SnlPixiMgr.m_BasePath + SnlLoadingGauge.m_BGTexName );
		SnlLoadingGauge.m_CoreTex = PIXI.Texture.from( SnlPixiMgr.m_BasePath + SnlLoadingGauge.m_CoreTexName );
		SnlLoadingGauge.m_FrameTex = PIXI.Texture.from( SnlPixiMgr.m_BasePath + SnlLoadingGauge.m_FrameTexName );
	}
	else
	{
		SnlLoadingGauge.m_BGTex = PIXI.Texture.fromImage( SnlPixiMgr.m_BasePath + SnlLoadingGauge.m_BGTexName );
		SnlLoadingGauge.m_CoreTex = PIXI.Texture.fromImage( SnlPixiMgr.m_BasePath + SnlLoadingGauge.m_CoreTexName );
		SnlLoadingGauge.m_FrameTex = PIXI.Texture.fromImage( SnlPixiMgr.m_BasePath + SnlLoadingGauge.m_FrameTexName );
	}


	SnlLoadingGauge.m_BGObj = new SnlObject();
	SnlLoadingGauge.m_BGObj.CreateSpriteFromImg( SnlLoadingGauge.m_BGTex, null, SnlLoadingGauge.m_Pos.x * SnlPixiMgr.m_Width, SnlLoadingGauge.m_Pos.y * SnlPixiMgr.m_Height, 0.5, 0.5, SnlLoadingGauge.m_DispZ );
	SnlLoadingGauge.m_BGObj.SetScale( SnlLoadingGauge.m_BGTexScale, SnlLoadingGauge.m_BGTexScale );
	SnlLoadingGauge.m_BGObj.SetVisible( false );
		
	SnlLoadingGauge.m_FrameObj = new SnlObject();
	SnlLoadingGauge.m_FrameObj.CreateSpriteFromImg( SnlLoadingGauge.m_FrameTex, null, SnlLoadingGauge.m_Pos.x * SnlPixiMgr.m_Width, SnlLoadingGauge.m_Pos.y * SnlPixiMgr.m_Height, 0.5, 0.5, SnlLoadingGauge.m_DispZ );
	SnlLoadingGauge.m_FrameObj.SetVisible( false );
				
	SnlLoadingGauge.m_CoreObj = new SnlObject();
	SnlLoadingGauge.m_CoreObj.CreateSpriteFromImg( SnlLoadingGauge.m_CoreTex, null, SnlLoadingGauge.m_Pos.x * SnlPixiMgr.m_Width - SnlLoadingGauge.m_CoreWidth * 0.5, SnlLoadingGauge.m_Pos.y * SnlPixiMgr.m_Height, 0, 0.5, SnlLoadingGauge.m_DispZ );
	SnlLoadingGauge.m_CoreObj.SetVisible( false );
	
	SnlLoadingGauge.m_Enable = false;

};

SnlLoadingGauge.SetEnable = function( isEnable )
{
	SnlLoadingGauge.m_FrameObj.SetVisible( isEnable );
	SnlLoadingGauge.m_CoreObj.SetVisible( isEnable );
	SnlLoadingGauge.m_BGObj.SetVisible( isEnable );
	
	SnlLoadingGauge.m_Enable = isEnable;
};

SnlLoadingGauge.Update = function( Rate )
{
	if( !SnlLoadingGauge.m_Enable )
	{
		return;
	}
	
	if( SnlPixiMgr.ePixiVersion.V5 <= SnlPixiMgr.PixiVersion )
	{
		if( !SnlLoadingGauge.m_CoreTex.baseTexture.valid || !SnlLoadingGauge.m_FrameTex.baseTexture.valid || !SnlLoadingGauge.m_BGTex.baseTexture.valid)
		{
			return;
		}
	}
	else
	{
		if( !SnlLoadingGauge.m_CoreTex.baseTexture.hasLoaded || !SnlLoadingGauge.m_FrameTex.baseTexture.hasLoaded || !SnlLoadingGauge.m_BGTex.baseTexture.hasLoaded)
		{
			return;
		}
	}
	
	SnlLoadingGauge.m_CoreObj.SetScale( Rate, 1 );
};
	

SnlLoadingGauge.prototype = 
{

};

