/**
 * @file 	SnlButton.js
 * @brief 	汎用ボタンクラス
 * @author	D.Hara
 */
var SnlButton =  function( Bank, ImageMgr )
{
	// Snlオブジェクト
	this.m_Object		= null;
	this.m_TextObject	= null;
	
	// 状態
	this.m_Step			= 0;
	
	// 前回判定終了時の状態
	this.m_OldStep 		= 0;
	
	// 動作モード
	this.m_Mode			= SnlButton.eMode.Scale;
	
	// 押し下げ位置
	this.m_PressPos = { x:-1, y:-1};
	
	// 前回判定でボタンが押されて離された
	this.m_LastHit		= false;
	
	// 判定スケール（基本サイズは画像サイズ）
	this.m_JdgScale = 1;
	
	// ボタンは無効か？
	this.m_isDisable	= false;
	
	// ボタン有効時の色
	this.m_isEnableColor = { a:0, r:0, g:0, b:0 };
	
	// ボタンテクスチャのバンク番号
	if( Bank == null || Bank < 0 )
	{
		this.m_TextureBank = 0;
	}
	else
	{
		this.m_TextureBank = Bank;
	}
	
	this.m_ImageMgr = null;
	if( ImageMgr != null )
	{
		this.m_ImageMgr = ImageMgr;
	}
	
	// ボタンテクスチャ番号
	this.m_TextureNo = { Normal:-1, On:-1 };
	
	// 強制的に押し下げ中にする(キーバインド選択時）
	this.m_ForcePress = false;
	
	// 強制押し下げ中の決定キー
	this.m_HitKeyCode = 32;
	
	// HitSE
	this.m_HitSE = -1;
	
	// マルチタッチ用インデックス
	this.m_TouchIdx = -1;
	
	// 押し下げ時の大きさ
	this.m_PressScale = 0.85;
	
	// ボタンのスケール
	this.m_Scale = {x:1,y:1};
	
	// ボタンの押し下げ時にスクロール動作をキャンセルする
	this.m_isPressScrollCancel = true;
	
	// オブジェクトの重なりを考慮するか？
	this.m_enableRaycastCheck = false; // true:考慮する false:考慮しない
	
	// トグルスイッチモード(
	this.m_ToggleSWMode = false;
	this.m_ToggleON = false;
	
	// なぞりモード
	this.m_TracingMode = false;
	
	
	// ボタン強調モード
	this.m_EmphasizeMode = false;
	this.m_EmphasizeFillter = null;
	this.m_EmphasizeTimer = 0;
};

// 状態定数
SnlButton.eStep =
{
	Wait : 0,
	Press : 1,
};	
	
// 動作モード
SnlButton.eMode =
{
	Scale : 0,		// 押し下げで縮小するボタン
	FlipFlop : 1,	// 押し下げ中は画像が変更されるボタン
};	
	
// ボタンSE無しの定数
SnlButton.SENone = -2;

// デフォルトのSE設定
SnlButton.DefaultHitSE = SnlButton.SENone;

SnlButton.DisableGray = false;

SnlButton.prototype = 
{
	isPress : function()
	{
		return this.m_Step == SnlButton.eStep.Press;
	},
	
	SetBank : function( Bank )
	{
		this.m_TextureBank = Bank;
		if( this.m_Object != null )
		{
			this.m_Object.SetBank( Bank );
		}
	},
		
	SetImageMgr : function( ImageMgr )
	{
		this.m_ImageMgr = ImageMgr;
	},
	
	CreateScaleBtn : function( TextureNo, PosX, PosY, DispZ, JdgScale, Parent )
	{
		if( JdgScale != null )
		{
			this.m_JdgScale = JdgScale;
		}
		
		this.m_Scale = {x:1, y:1};
		
		this.m_TextureNo.Normal = TextureNo;
		
		this.m_Object = new SnlObject();
		if( this.m_ImageMgr != null )
		{
			this.m_Object.CreateSpriteFromImageMgr( this.m_ImageMgr, TextureNo, 0, -1, PosX, PosY, 0.5, 0.5, DispZ, Parent );
		}
		else
		{
			this.m_Object.CreateSprite_SetBank( this.m_TextureBank, TextureNo, PosX, PosY, 0.5, 0.5, DispZ, Parent );
		}
		this.m_Mode	= SnlButton.eMode.Scale;
	},
		
	CreateScaleBtnFromObject : function( Obj, JdgScale )
	{
		if( JdgScale != null )
		{
			this.m_JdgScale = JdgScale;
		}
		
		this.m_Scale = { x:Obj.GetScale().x, y:Obj.GetScale().y };
		
		this.m_Object = Obj;
		this.m_Mode	= SnlButton.eMode.Scale;
	},
		
	CreateFlipBtn : function( TextureNo, TextureNo_ON, PosX, PosY, DispZ, JdgScale, Parent, isToggleMode )
	{
		if( JdgScale != null )
		{
			this.m_JdgScale = JdgScale;
		}
		if( isToggleMode == null )
		{
			isToggleMode = false;
		}
		
		// トグルスイッチ動作
		this.m_ToggleSWMode = isToggleMode;
		this.m_ToggleON = false;
		
		this.m_Scale = {x:1, y:1};
		
		this.m_TextureNo.Normal = TextureNo;
		this.m_TextureNo.On = TextureNo_ON;
		
		this.m_Object = new SnlObject();
		if( this.m_ImageMgr != null )
		{
			this.m_Object.CreateSpriteFromImageMgr( this.m_ImageMgr, TextureNo,  0, -1, PosX, PosY, 0.5, 0.5, DispZ, Parent );
		}
		else
		{
			this.m_Object.CreateSprite_SetBank( this.m_TextureBank, TextureNo, PosX, PosY, 0.5, 0.5, DispZ, Parent );
		}
		
		this.m_Mode	= SnlButton.eMode.FlipFlop;
	},
		
	SetScale : function( Scale )
	{
		if( typeof Scale == "object" )
		{
			this.m_Scale.x = Scale.x;
			this.m_Scale.y = Scale.y;
		}
		else
		{
			this.m_Scale.x = Scale;
			this.m_Scale.y = Scale;
		}
		
		
		this.m_Object.SetScale( this.m_Scale.x, this.m_Scale.y );
	},
		
	GetScale : function()
	{
		return this.m_Object.GetScale();
	},
		
	SetAlpha : function( Alpha )
	{
		this.m_Object.SetAlpha( Alpha );
	},
		
	SetText : function( TextStr, FontSize, isBold, Color, TextOfsX, TextOfsY )
	{
		this.m_TextObject = new SnlObject();
		
		if( TextOfsY == null )
		{
			TextOfsX = 0;
			TextOfsY = 0;
		}
		
		this.m_TextObject.CreateText( TextStr, FontSize, isBold, Color, SnlObject.eTextAligan.Center, TextOfsX, TextOfsY, -1, this.m_Object );
	},
		
	ChangeText : function( TextStr )
	{
		this.m_TextObject.SetText( TextStr );
	},
		
	ChangeTextColor : function( color )
	{
		this.m_TextObject.ChangeTextColor( color );
	},
		
	ChangeTexture : function( TextureNo, TextureNo_ON )
	{
		this.m_TextureNo.Normal = TextureNo;
		this.m_TextureNo.On = TextureNo_ON;
		this.m_Object.ChangeTexture( TextureNo );
	},
		
	Destroy : function()
	{
		if( this.m_TextObject != null )
		{
			this.m_TextObject.Destroy();
			this.m_TextObject = null;
		}
		
		this.m_Object.Destroy();
		this.m_Object = null;
		this.m_PressPos = null;
		this.m_isEnableColor = null;
	},
		
	SetPressScale : function( Scl )
	{
		this.m_PressScale = Scl;
	},

	Update : function()
	{
		if( !this.m_Object.CheckImageMgr() )
		{
			return false;
		}
		
		if( !this.GetVisible() )
		{
			this.m_Step = SnlButton.eStep.Wait;
			this.m_LastHit = false;
			return false;
		}
		
		if( this.m_EmphasizeMode )
		{
			this.m_EmphasizeFillter.brightness(1 + 1 * Math.abs( Math.sin( this.m_EmphasizeTimer * 180 * SnlMath.DegToRad ) ), false); //光る
			this.m_EmphasizeTimer += SnlFPS.deltaTime;
		}
		
		
		var isHit = false;
		
		var JdgScale = this.m_JdgScale;
		if( this.m_Mode == SnlButton.eMode.Scale )
		{
			if( this.m_Step != 0 )
			{
				JdgScale /= this.m_PressScale;
			}
		}
		
		if( this.m_Step == SnlButton.eStep.Wait )
		{
			// シングル
			if( !(SnlPixiMgr.m_TouchMode && SnlPixiMgr.m_MultiTouch) || this.m_ForcePress )
			{
				if( ( SnlPixiMgr.m_MouseDown || this.m_ForcePress || (this.m_TracingMode&&SnlPixiMgr.m_MousePress) ) && !this.m_isDisable )
				{
					if( ( this.m_Object.InputHitCheck(JdgScale,this.m_enableRaycastCheck) || this.m_ForcePress ) )
					{
						this.m_Step = SnlButton.eStep.Press;
						this.m_PressPos.x = SnlPixiMgr.m_MousePos.x;
						this.m_PressPos.y = SnlPixiMgr.m_MousePos.y;
						if( typeof SnlScrollMgr != "undefined" )
						{
							if( SnlScrollMgr != null && this.m_isPressScrollCancel )
							{
								SnlScrollMgr.ScrollCancel(true);
							}
						}
					}
				}
			}
			// マルチタッチ
			else
			{
				var TouchIdx = -1;//this.m_Object.InputHitCheck(this.m_JdgScale);
				
				for( var i=0; i<SnlPixiMgr.m_TouchStep.length && TouchIdx == -1; i++ )
				{
					if( SnlPixiMgr.m_TouchStep[i] == SnlPixiMgr.eTouchStep.Down || (this.m_TracingMode&& SnlPixiMgr.m_TouchStep[i] == SnlPixiMgr.eTouchStep.Press) )
					{
						var Pos = SnlPixiMgr.m_TouchPos[i];
						if( this.m_Object.HitCheck( Pos, JdgScale, this.m_enableRaycastCheck ) )
						{
							TouchIdx = i;
						}
					}
				}
				
				
				if( 0 <= TouchIdx )
				{
					this.m_TouchIdx = TouchIdx;
					this.m_Step = SnlButton.eStep.Press;
					this.m_PressPos.x = SnlPixiMgr.m_TouchPos[TouchIdx].x;
					this.m_PressPos.y = SnlPixiMgr.m_TouchPos[TouchIdx].y;
					if( typeof SnlScrollMgr != "undefined" )
					{
						if( SnlScrollMgr != null && this.m_isPressScrollCancel )
						{
							SnlScrollMgr.ScrollCancel(true);
						}
					}
				}
			}
		}
		else if( this.m_Step == SnlButton.eStep.Press )
		{
			// シングル
			if( !(SnlPixiMgr.m_TouchMode && SnlPixiMgr.m_MultiTouch) || this.m_ForcePress )
			{
				if( ( (!SnlPixiMgr.m_MouseUp && !SnlPixiMgr.m_MousePress) || this.m_isDisable ) && !this.m_ForcePress )
				{
					this.m_Step = SnlButton.eStep.Wait;
				}
				else if( SnlPixiMgr.m_MouseUp )
				{
					if( this.m_Object.InputHitCheck(JdgScale, this.m_enableRaycastCheck) )
					{
						isHit = true;
					}
				}
				else if( this.m_ForcePress )
				{
					// SpaceKey
					if( SnlKeyboard.DownKey == this.m_HitKeyCode )
					{
						isHit = true;
					}
				}
				else
				{
					if( 30 <= SnlMath.Distance( this.m_PressPos, SnlPixiMgr.m_MousePos ) )
					{
						if( this.m_TracingMode )
						{
							isHit = true;
						}
						
						
						this.m_Step = SnlButton.eStep.Wait;
						
					}
				}
			}
			// マルチタッチ
			else
			{
				// マウスとタッチ両方行ける端末だとありうる
				if( this.m_TouchIdx < 0 )
				{
					this.m_Step = SnlButton.eStep.Wait;
					this.m_TouchIdx = -1;
				}
				else
				{
					// 見失った
					if( SnlPixiMgr.m_TouchStep[this.m_TouchIdx] == SnlPixiMgr.eTouchStep.None || this.m_isDisable )
					{
						this.m_TouchIdx = -1;
						this.m_Step = SnlButton.eStep.Wait;
					}
					else if( SnlPixiMgr.m_TouchStep[this.m_TouchIdx] == SnlPixiMgr.eTouchStep.Up )
					{
						isHit = true;
					}
					else
					{
						if( 30 <= SnlMath.Distance( this.m_PressPos, SnlPixiMgr.m_TouchPos[this.m_TouchIdx] ) )
						{
							if( this.m_TracingMode )
							{
								isHit = true;
							}

							this.m_Step = SnlButton.eStep.Wait;
							this.m_TouchIdx = -1;
							
						}
					}
				}
			}
		}
		
		this.UpdateDisp(false);
		
		this.m_OldStep = this.m_Step;
		
		if( isHit )
		{
			if( typeof SnlScrollMgr != "undefined" )
			{
				if( SnlScrollMgr != null )
				{
					SnlScrollMgr.ScrollCancel(true);
				}
			}
			
			if( 0 <= this.m_HitSE )
			{
				SnlSound.PlaySE( this.m_HitSE );
			}
			// SnlButton.DefaultHitSEを鳴らす
			else if( this.m_HitSE != SnlButton.SENone )
			{
				// SnlButtonにDefaultHitSEが設定されているなら鳴らす
				if( 0 <= SnlButton.DefaultHitSE )
				{
					SnlSound.PlaySE( SnlButton.DefaultHitSE );
				}
				// GameMainにDefaultHitSEを見に行く
				else if( typeof GameMain !== "undefined" )
				{
					if( typeof GameMain.DefaultHitSE !== "undefined" )
					{
						if( 0 <= GameMain.DefaultHitSE )
						{
							SnlSound.PlaySE( GameMain.DefaultHitSE );
						}
					}
				}			
			}
		}
		
		this.m_LastHit = isHit;
		
		// トグルスイッチモードならスイッチ状態を反転
		if( isHit && this.m_ToggleSWMode && this.m_Mode	== SnlButton.eMode.FlipFlop )
		{
			this.SetToggle( !this.m_ToggleON, false );
		}
		return isHit;
	},
		

	UpdateDisp : function( isForce )
	{
		if( this.m_OldStep == this.m_Step && !isForce )
		{
			return;
		}
		
		
		{
			if( this.m_Mode == SnlButton.eMode.Scale )
			{
				var isChangeTexture = true;
				if( typeof this.m_TextureNo.Normal === 'number' )
				{
					if( this.m_TextureNo.Normal < 0 )
					{
						isChangeTexture = false;
					}
				}
				if( isChangeTexture )
				{
					this.m_Object.ChangeTexture( this.m_TextureNo.Normal );
				}
				
				if( this.m_Step == 0 )
				{
					this.m_Object.SetScale( this.m_Scale.x, this.m_Scale.y );
				}
				else
				{
					this.m_Object.SetScale( this.m_Scale.x * this.m_PressScale, this.m_Scale.y * this.m_PressScale );
				}
			}
			else if( this.m_Mode == SnlButton.eMode.FlipFlop )
			{
				if( this.m_Step == 0 )
				{
					this.m_Object.ChangeTexture( this.m_TextureNo.Normal );
				}
				else
				{
					this.m_Object.ChangeTexture( this.m_TextureNo.On );
				}
			}
		}
	},
		
	SetTexture : function( TextureNo, TextureNo_ON, isChangeDisp )
	{
		this.m_TextureNo.Normal = TextureNo;
		if( TextureNo_ON != null )
		{
			this.m_TextureNo.On = TextureNo_ON;
		}
		
		if( isChangeDisp == null )
		{
			this.UpdateDisp(true);
		}
		else if( isChangeDisp == true )
		{
			this.UpdateDisp(true);
		}
	},
		
	GetLastHit : function()
	{
		return this.m_LastHit;
	},
		
	SetVisible : function( isVisible )
	{
		if( !isVisible )
		{
			this.m_LastHit = false;
		}
		this.m_Object.SetVisible( isVisible );
		this.UpdateDisp(true);
	},
	
	GetVisible : function( )
	{
		return this.m_Object.GetVisible();
	},
		
	GetSprite : function()
	{
		return this.m_Object;
	},
	
	AddPos : function( x, y )
	{
		this.m_Object.AddPos( x, y );
	},
	
	SetPos : function( x, y )
	{
		this.m_Object.SetPos( x, y );
	},
	
	SetPosX : function( x )
	{
		this.m_Object.SetPosX( x );
	},
	
	SetPosY : function( y )
	{
		this.m_Object.SetPosY( y );
	},
		
	ChangeTextureColor : function( r, g, b )
	{
		this.m_Object.ChangeTextureColor( r, g, b );
	},
		
	SetDisable : function( isDisable, isChangeAlpha )
	{
		if( this.m_isDisable == isDisable )
		{
			return;
		}
		
		this.m_isDisable = isDisable;
		
		var changeAlpha = true;
		if( isChangeAlpha != null )
		{
			changeAlpha = isChangeAlpha;
		}
		
		
		if( isDisable )
		{
			var c = this.m_Object.GetTextureColor();
			this.m_isEnableColor.a = this.m_Object.GetAlpha();
			this.m_isEnableColor.r = c.r;
			this.m_isEnableColor.g = c.g;
			this.m_isEnableColor.b = c.b;
			
			if( changeAlpha )
			{
				if( SnlButton.DisableGray )
				{
					/*
					var fill = new PIXI.filters.ColorMatrixFilter();
					fill.blackAndWhite(true); //白黒にする
					/*
					fill.brightness(0.5, true); //光る
					var bright = new PIXI.filters.ColorMatrixFilter();
					bright.brightness(0.5, false); //光る
					*/
					this.m_Object.m_Object.filters = null;//[fill];
					this.ChangeTextureColor( 96, 96, 96 );
				}
				else
				{
					this.m_Object.SetAlpha( this.m_isEnableColor.a * 0.5 );
				}
			}
			//this.ChangeTextureColor( 0x30, 0x30, 0x30 );
		}
		else
		{
			if( changeAlpha )
			{
				if( SnlButton.DisableGray )
				{
					this.ChangeTextureColor( this.m_isEnableColor.r, this.m_isEnableColor.g, this.m_isEnableColor.b );
					this.m_Object.m_Object.filters = null
				}
				else
				{
					this.m_Object.SetAlpha( this.m_isEnableColor.a );
					this.ChangeTextureColor( this.m_isEnableColor.r, this.m_isEnableColor.g, this.m_isEnableColor.b );
				}
			}
		}
	},
		
	SetForcePress : function( isPress )
	{
		this.m_ForcePress = isPress;
	},
	
	SetHitKey : function( KeyCode )
	{
		this.m_HitKeyCode = KeyCode;
	},
		
	SetHitSE : function( SE )
	{
		this.m_HitSE = SE;
	},
		
	SetPressScrollCancel : function( isPressScrollCancel )
	{
		this.m_isPressScrollCancel = isPressScrollCancel;
	},
		
	isToggleON : function()
	{
		return this.m_ToggleON;
	},
		
	SetToggle : function( isOn, isChangeDisp )
	{
		if( this.m_ToggleON == isOn )
		{
			return;
		}
		if( isChangeDisp == null )
		{
			isChangeDisp = true;
		}
		
		this.m_ToggleON = isOn;
		// テクスチャ反転
		this.SetTexture( this.m_TextureNo.On, this.m_TextureNo.Normal, isChangeDisp );
	},
		
	SetTracingMode : function( isEnable )
	{
		this.m_TracingMode = isEnable;
	},
		
	SetRaycastCheck : function( isEnable )
	{
		this.m_enableRaycastCheck = isEnable;
	},
	
	SetEmphasizeMode : function( isEmphasize )
	{
		if( this.m_EmphasizeMode == isEmphasize )
		{
			return;
		}
		
		if( !isEmphasize )
		{
			this.m_EmphasizeMode = false;
			this.m_Object.m_Object.filters = [];
			return;
		}
		
		this.m_EmphasizeMode = true;
		
		this.m_EmphasizeFillter = new PIXI.filters.ColorMatrixFilter();
		this.m_EmphasizeFillter.brightness(1, false); //光る
		
		this.m_Object.m_Object.filters = [this.m_EmphasizeFillter];
		this.m_EmphasizeTimer = 0;
	},
	
	SetJdgScale : function( JdgScale )
	{
		this.m_JdgScale = JdgScale;
	},
	
};

