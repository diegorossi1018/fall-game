/**
 * @file 	SnlFader.js
 * @brief 	フェード表示
 * @author	D.Hara
 */
var SnlFader =  function(){}

SnlFader.m_DispZ = 0;

SnlFader.m_BGTexName = "./ImgSnl/Fader.png";
SnlFader.m_BGTexInfo = { w: 32,	h: 32	};
SnlFader.m_BGTexScale = 40;

SnlFader.m_Pos = { x:0.5, y:0.5 };

SnlFader.m_BGTex = null;
SnlFader.m_BGObj = null;

SnlFader.eType =
{
	None : 0,
	FadeOut : 1,
	FadeIn  : 2,
	Flash	: 3,
};

SnlFader.m_Type = 0;
SnlFader.m_Step = 0;
SnlFader.m_Timer = 0;
SnlFader.m_FadeTime = 1;
//SnlFader.m_FadeColor = 0;
//SnlFader.m_Alpha = 0;


SnlFader.m_isFadeEnd = true;

SnlFader.Init = function( DispZ )
{
	SnlFader.m_DispZ = DispZ;

	if( SnlPixiMgr.ePixiVersion.V5 <= SnlPixiMgr.PixiVersion )
	{
		SnlFader.m_BGTex = PIXI.Texture.from( SnlPixiMgr.m_BasePath + SnlFader.m_BGTexName );
	}
	else
	{
		SnlFader.m_BGTex = PIXI.Texture.fromImage( SnlPixiMgr.m_BasePath + SnlFader.m_BGTexName );
	}
	SnlFader.m_Enable = false;
	
	SnlFader.m_BGObj = new SnlObject();
	SnlFader.m_BGObj.CreateSpriteFromImg( SnlFader.m_BGTex, SnlFader.m_BGTexInfo, SnlFader.m_Pos.x * SnlPixiMgr.m_Width, SnlFader.m_Pos.y * SnlPixiMgr.m_Height, 0.5, 0.5, SnlFader.m_DispZ );
	SnlFader.m_BGObj.SetScale( SnlFader.m_BGTexScale, SnlFader.m_BGTexScale );
	SnlFader.m_BGObj.SetVisible( false );
};

SnlFader.SetZ = function( DispZ )
{
	SnlFader.m_BGObj.SetZ( DispZ );
};

SnlFader.SetFade = function( Type, FadeTime, FadeColor )
{
	if( FadeTime == null )
	{
		FadeTime = 1;
	}
	
	/*if( FadeColor == null )
	{
		FadeColor = 0;
	}*/
	
	SnlFader.m_Type = Type;
	SnlFader.m_isFadeEnd = false;
	SnlFader.m_Timer = 0;
	SnlFader.m_FadeTime = FadeTime;
	//SnlFader.m_FadeColor = FadeColor;
	
	if( FadeColor != null )
	{
		var r = ( FadeColor & 0x00FF0000 ) >> 16;
		var g = ( FadeColor & 0x0000FF00 ) >> 8;
		var b = ( FadeColor & 0x000000FF );
		SnlFader.m_BGObj.ChangeTextureColor( r, g, b );
	}
	
	SnlFader.UpdateColor();
	SnlFader.m_BGObj.SetVisible( true );
};

SnlFader.UpdateColor = function()
{
	var Alpha = 0;
	var Rate  = SnlFader.m_Timer / SnlFader.m_FadeTime;
	if( 1 < Rate )
	{
		Rate = 1;
	}
	
	switch( SnlFader.m_Type )
	{
		case SnlFader.eType.FadeIn:
			Alpha = 1 - Rate;
		break;
		
		case SnlFader.eType.FadeOut:
			Alpha = Rate;
		break;
		
		case SnlFader.eType.Flash:
			Alpha = 1 - ( Math.abs( 0.5 - Rate ) * 2 );
		break;
	}
	
	SnlFader.m_BGObj.SetAlpha( Alpha );
};

SnlFader.Update = function( )
{
	if( SnlFader.m_BGObj == null )
	{
		return;
	}
	
	if( SnlFader.m_isFadeEnd )
	{
		return;
	}
	
	SnlFader.m_Timer += SnlFPS.deltaTime;
	SnlFader.UpdateColor();
	
	if( SnlFader.m_FadeTime <= SnlFader.m_Timer )
	{
		SnlFader.m_isFadeEnd = true;
	}
};
	

SnlFader.prototype = {};

