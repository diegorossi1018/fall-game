/**
 * @file 	SnlNumDisp.js
 * @brief 	汎用の画像数値表示処理クラス
 * @author	D.Hara
 */

var SnlNumDisp = function()
{


	// 親とする空のSnlObject
	this.m_VoidObject = null;

	// 数字スプライト
	this.m_SpriteNum = null;

	// 表示中の数値
	this.m_DispNum = -1;

	// 表示したい数値
	this.m_Num = -1;

	// 最大桁数
	this.m_DigitMax = 0;

	// テクスチャバンク
	this.m_TextureBank = 0;

	// 0の画像のテクスチャID
	// (テクスチャは0-9まで連番で並んでるものとしている)
	this.m_Num0TextureID = -1;

	// 数字アニメーション速度
	this.m_DispChangeSpeed = 13 * 60;

	// 数字がアニメーションしたか？
	this.m_isMoveNum = false;

	// 桁がアニメーションする可能性がある
	this.m_AnimDigit = false;

	// 数字幅
	this.m_NumW = 0;

	// 文字揃え
	this.m_Arigen = 0;

	//array//使うテクスチャーID 0~9
	this.m_NumTexID = null
	//array//テクスチャーの無効にする左幅・右幅[{l:?,r:?}]
	this.m_SizeInfo = null;

	//カンマ用
	this.m_CommaTexID = -1; //カンマのテクスチャーID
	this.m_CommaW = 0; //カンマの幅
	this.m_CommaYOffset = 0; //カンマは同じサイズじゃない可能性もある
	this.m_SpriteCommaArray = null; //カンマのスプライト
	
	// 上位の桁がゼロでも表示するモード
	this.m_AllDigitDispMode = false;
};

// 数字の揃えタイプ
SnlNumDisp.eArigen = {
	Right: 0,
	Left: 1,
	Center: 2,
		
	right : 0,
	left : 1,
	center : 2,
};

SnlNumDisp.prototype = {
	SetVisible: function(isVisible)
	{
		this.m_VoidObject.SetVisible(isVisible);
	},

	CheckMoveNum: function()
	{
		return this.m_isMoveNum;
	},

	SetBank: function(Bank)
	{
		this.m_TextureBank = Bank;
	},

	//NumTextureIDArrayには0のテクスチャーIDか０～９までのテクスチャーID配列のどちらかを渡す
	//SizeInfoは未入力でもよい。その際は等幅表示になる
	Create: function(PosX, PosY, Num, DigitMax, NumTextureIDArray, NumW, DispZ, Parent, Arigen, SizeInfo)
	{
		this.m_NumW = NumW;

		//配列だったらコピー、そうじゃなければ１個の配列としてコピー
		if (Array.isArray(NumTextureIDArray))
		{
			this.m_NumTexID = NumTextureIDArray;
		}
		else
		{ //テクスチャーIDを一つしか指定してない時
			this.m_NumTexID = [];
			for (var i = 0; i < 10; i++)
			{
				this.m_NumTexID[i] = NumTextureIDArray + i; //連番ルール
			}
		}
		this.m_Num0TextureID = this.m_NumTexID[0];

		//有効なサイズ配列
		if (SizeInfo)
		{
			if( Array.isArray(SizeInfo) )
			{
				this.m_SizeInfo = SizeInfo;
			}
			else
			{
				this.m_SizeInfo = [];
				for( var i=0; i<10; i++ )
				{
					this.m_SizeInfo[i] = SizeInfo;
				}
			}
		}
		else
		{ //サイズを指定しない時は自己設定で等幅になる
			this.m_SizeInfo = [];
			for (var i = 0; i < 10; i++)
			{
				this.m_SizeInfo[i] = {
					l: 0,
					r: 0
				};
			}
		}

		if (Arigen == null)
		{
			Arigen = SnlNumDisp.eArigen.Right;
		}
		
		if( typeof Arigen == "string" )
		{
			Arigen = SnlNumDisp.eArigen[Arigen.toLowerCase()];
		}

		this.m_Arigen = Arigen;

		if (DigitMax < 0)
		{
			DigitMax = 0;
			if (Num == 0)
			{
				DigitMax = 1;
				this.m_AnimDigit = true;
			}
			else
			{
				var Buf = Num;
				while (0 < Buf)
				{
					Buf = Math.floor(Buf / 10);
					DigitMax++;
				}
			}
		}

		this.m_VoidObject = new SnlObject();
		this.m_VoidObject.CreateSprite(-1, 0, 0, 0, 0, DispZ, Parent);

		this.m_SpriteNum = [];
		for (var i = 0; i < DigitMax; i++)
		{
			this.m_SpriteNum[i] = new SnlObject();

			if (Arigen == SnlNumDisp.eArigen.Right)
			{
				this.m_SpriteNum[i].CreateSprite_SetBank(this.m_TextureBank, this.m_Num0TextureID, 0 - NumW * i, 0, 0.5, 0.5, -1, this.m_VoidObject);
			}
			else if (Arigen == SnlNumDisp.eArigen.Center)
			{
				this.m_SpriteNum[i].CreateSprite_SetBank(this.m_TextureBank, this.m_Num0TextureID, NumW * (DigitMax - 1) * 0.5 - NumW * i, 0, 0.5, 0.5, -1, this.m_VoidObject);
			}
			else
			{
				this.m_SpriteNum[i].CreateSprite_SetBank(this.m_TextureBank, this.m_Num0TextureID, NumW * (DigitMax - 1) - NumW * i, 0, 0.5, 0.5, -1, this.m_VoidObject);
			}
		}

		this.m_VoidObject.SetPos(PosX, PosY);

		this.m_DigitMax = DigitMax;

		this.SetNum(Num);
	},

	SetPos: function(PosX, PosY)
	{
		this.m_VoidObject.SetPos(PosX, PosY);
	},
		
	AddPos: function(PosX, PosY)
	{
		this.m_VoidObject.AddPos(PosX, PosY);
	},

	Destroy: function()
	{
		for (var i = 0; i < this.m_SpriteNum.length; i++)
		{
			this.m_SpriteNum[i].Destroy();
			this.m_SpriteNum[i] = null;
		}

		this.m_SpriteNum = null;

		if (this.m_SpriteCommaArray)
		{
			for (var i = 0; i < this.m_SpriteCommaArray.length; i++)
			{
				this.m_SpriteCommaArray[i].Destroy();
				this.m_SpriteCommaArray[i] = null;
			}
		}
		this.m_SpriteCommaArray = null;

		this.m_VoidObject.Destroy();
		this.m_VoidObject = null;
	},

	SetNum: function(Num, isAnim,isForce)
	{
		if( typeof isForce === "undefined" )
		{
			isForce = false;
		}
		
		if (Num < 0)
		{
			Num = 0;
		}

		var NumMax = 1;
		for (var i = 0; i < this.m_DigitMax; i++)
		{
			NumMax *= 10;
		}

		if (NumMax <= Num && !this.m_AnimDigit)
		{
			Num = NumMax - 1;
		}

		if (this.m_Num == Num && !isForce)
		{
			return;
		}

		this.m_Num = Num;

		if (isAnim == null || isAnim == false)
		{
			this.m_DispNum = this.m_Num;
			this.UpdateDisp();
		}

	},

	UpdateDisp: function()
	{

		var Num = this.m_DispNum;
		if (this.m_AnimDigit)
		{
			var DigitMax = 0;
			if (Num == 0)
			{
				DigitMax = 1;
			}
			else
			{
				var Buf = Num;
				while (0 < Buf)
				{
					Buf = Math.floor(Buf / 10);
					DigitMax++;
				}
			}

			if (this.m_DigitMax != DigitMax)
			{

				for (var i = 0; i < this.m_DigitMax; i++)
				{
					this.m_SpriteNum[i].SetVisible(false);
				}

				var NumW = this.m_NumW;
				var Arigen = this.m_Arigen;

				for (var i = 0; i < DigitMax; i++)
				{
					if (this.m_SpriteNum[i] == null)
					{
						this.m_SpriteNum[i] = new SnlObject();
						this.m_SpriteNum[i].CreateSprite_SetBank(this.m_TextureBank, this.m_Num0TextureID, 0 - NumW * i, 0, 0.5, 0.5, -1, this.m_VoidObject);
					}
					else
					{
						this.m_SpriteNum[i].SetVisible(true);
					}

					if (Arigen == SnlNumDisp.eArigen.Right)
					{
						this.m_SpriteNum[i].SetPos(0 - NumW * i, 0);
					}
					else if (Arigen == SnlNumDisp.eArigen.Center)
					{
						this.m_SpriteNum[i].SetPos(NumW * (DigitMax - 1) * 0.5 - NumW * i, 0);
					}
					else
					{
						this.m_SpriteNum[i].SetPos(NumW * (DigitMax - 1) - NumW * i, 0);
					}
				}

				this.m_DigitMax = DigitMax;

				this.MakeCommaSprite(); //カンマ
			}
		}

		Num = this.m_DispNum;

		this.SetCommaVisible(false); //カンマがあれば一旦全部消す

		var BeforNum = -1;
		var XOffset = 0;
		var CommaIndex = 0;
		for (var i = 0; i < this.m_DigitMax; i++)
		{
			var isVisible = (0 < Num || i == 0 || this.m_AllDigitDispMode);

			this.m_SpriteNum[i].SetVisible(isVisible);
			if (!isVisible)
			{
				continue;
			}

			var DNum = Num % 10;
			if (this.m_SizeInfo) //可変幅数値
			{
				this.m_SpriteNum[i].ChangeTexture(this.m_NumTexID[DNum]);
				//文字の配置オフセット
				if (BeforNum > -1)
				{
					BeforNum = Math.floor(SnlMath.Clamp(BeforNum, 0, this.m_SizeInfo.length-1));
					XOffset -= ((this.m_NumW * 0.5) - this.m_SizeInfo[BeforNum].l); //自分の左側
					//カンマチェック
					if (this.m_SpriteCommaArray != null && i % 3 == 0 && i != 0)
					{
						//スプライトがある時は表示と設定、なくてもオフセットだけは効く
						if (CommaIndex < this.m_SpriteCommaArray.length)
						{
							var comma_offset = XOffset - (this.m_CommaW * 0.5);
							this.m_SpriteCommaArray[CommaIndex].SetPos(comma_offset, this.m_CommaYOffset);
							this.m_SpriteCommaArray[CommaIndex].SetVisible(true);
							CommaIndex++;
						}
						XOffset -= this.m_CommaW; //カンマオフセット
					}
					XOffset -= ((this.m_NumW * 0.5) - this.m_SizeInfo[DNum].r); //自分の右側
				}

				this.m_SpriteNum[i].SetPos(XOffset, 0);
				BeforNum = DNum;
			}
			else
			{ //等幅数値//変にメンバーをいじらない限りこっちは通らないはず
				this.m_SpriteNum[i].ChangeTexture(this.m_Num0TextureID + DNum);
			}

			Num = Math.floor(Num / 10);
		}

		//可変幅の場合は再配置
		if (this.m_SizeInfo)
		{
			if (this.m_Arigen == SnlNumDisp.eArigen.Right)
			{}
			else if (this.m_Arigen == SnlNumDisp.eArigen.Center)
			{
				var offset = XOffset * 0.5;
				for (var i = 0; i < this.m_DigitMax; i++)
				{
					this.m_SpriteNum[i].AddPos(-offset, 0);
				}
				if (this.m_SpriteCommaArray != null)
				{
					for (var i = 0; i < this.m_SpriteCommaArray.length; i++)
					{
						this.m_SpriteCommaArray[i].AddPos(-offset, 0);
					}
				}
			}
			else
			{
				for (var i = 0; i < this.m_DigitMax; i++)
				{
					this.m_SpriteNum[i].AddPos(-XOffset, 0);
				}
				if (this.m_SpriteCommaArray != null)
				{
					for (var i = 0; i < this.m_SpriteCommaArray.length; i++)
					{
						this.m_SpriteCommaArray[i].AddPos(-XOffset, 0);
					}
				}
			}
		}
	},

	SetDispChangeSpeed: function(Speed)
	{
		this.m_DispChangeSpeed = Speed;
	},

	GetDispNum: function()
	{
		return this.m_DispNum;
	},

	Update: function()
	{
		if (this.m_DispNum == this.m_Num)
		{
			this.m_isMoveNum = false;
			return;
		}

		this.m_isMoveNum = true;

		var Dir = 1;

		if (this.m_Num < this.m_DispNum)
		{
			Dir = -1;
		}

		this.m_DispNum += Math.ceil(this.m_DispChangeSpeed * SnlFPS.deltaTime) * Dir;

		if (Dir == 1)
		{
			if (this.m_Num < this.m_DispNum)
			{
				this.m_DispNum = this.m_Num;
			}
		}
		else
		{
			if (this.m_DispNum < this.m_Num)
			{
				this.m_DispNum = this.m_Num;
			}
		}

		this.UpdateDisp();
	},
		
	ChangeTextureColor : function( r, g, b )
	{
		for (var i = 0; i < this.m_DigitMax; i++)
		{
			this.m_SpriteNum[i].ChangeTextureColor( r, g, b );
		}
		
		if (this.m_SpriteCommaArray != null )
		{
			for (var i = 0; i < this.m_SpriteCommaArray.length; i++)
			{
				this.m_SpriteCommaArray[i].ChangeTextureColor( r, g, b );
			}
		}
	},

	SetAlpha: function(a)
	{
		for (var i = 0; i < this.m_DigitMax; i++)
		{
			this.m_SpriteNum[i].SetAlpha(a);
		}
	},

	GetAlpha: function()
	{
		return this.m_SpriteNum[0].GetAlpha();
	},

	SetScale: function(SclX, SclY)
	{
		for (var i = 0; i < this.m_DigitMax; i++)
		{
			this.m_SpriteNum[i].SetScale(SclX, SclY);
		}
	},
		
	SetScaleCalcPos : function( SclX, SclY )
	{

		this.m_VoidObject.SetScale( SclX, SclY );
	},
		
	SetColorMatrixFilter : function( Filter )
	{
		if( this.m_SpriteNum != null )
		{
			for (var i = 0; i < this.m_SpriteNum.length; i++)
			{
				this.m_SpriteNum[i].m_Object.filters = Filter;
			}
		}
		
		if( this.m_SpriteCommaArray != null )
		{
			for( var i=0; i < this.m_SpriteCommaArray.length; i++ )
			{
				this.m_SpriteCommaArray[i].m_Object.filters = Filter;
			}
		}
	},

	//カンマ設定
	SetComma: function(TexID, Width, YOffset)
	{
		this.m_CommaTexID = TexID;
		this.m_CommaW = Width;
		this.m_CommaYOffset = 0;
		if (YOffset)
		{
			this.m_CommaYOffset = YOffset;
		}
		this.MakeCommaSprite();
	},

	//カンマスプライト
	MakeCommaSprite: function()
	{
		if (this.m_SpriteCommaArray == null)
		{
			this.m_SpriteCommaArray = [];
		}
		var max = this.m_DigitMax / 3;
		for (var i = 0; i < max; i++)
		{
			if (this.m_CommaTexID < 0) continue; //論理カンマのときはスプライトは作らない

			if (this.m_SpriteCommaArray[i] != null)
			{
				continue;
			}
			this.m_SpriteCommaArray[i] = new SnlObject();
			this.m_SpriteCommaArray[i].CreateSprite_SetBank(this.m_TextureBank, this.m_CommaTexID, 0, this.m_CommaYOffset, 0.5, 0.5, -1, this.m_VoidObject);
			this.m_SpriteCommaArray[i].SetVisible(false);
		}
	},

	//カンマを全部消す
	SetCommaVisible: function(b)
	{
		if (this.m_SpriteCommaArray == null) return;

		for (var i = 0; i < this.m_SpriteCommaArray.length; i++)
		{
			if (this.m_SpriteCommaArray[i])
			{
				this.m_SpriteCommaArray[i].SetVisible(b);
			}
		}
	},

	//後から可変幅を変更する
	SetVariableInfo: function(TexIdArray, SizeInfo)
	{
		if( TexIdArray != null )
		{
			if(Array.isArray(TexIdArray))
			{
				this.m_NumTexID = TexIdArray;
			}
			else
			{
				this.m_NumTexID = [];
				for (var i = 0; i < 10; i++)
				{
					this.m_NumTexID[i] = TexIdArray + i; //連番ルール
				}
			}
		}
		
		if(SizeInfo != null)
		{
			if( Array.isArray(SizeInfo) )
			{
				this.m_SizeInfo = SizeInfo;
			}
			else
			{
				this.m_SizeInfo = [];
				for( var i=0; i<10; i++ )
				{
					this.m_SizeInfo[i] = SizeInfo;
				}
			}
		}		
	},
		
		
	SetDigitMax : function( DigitMax, AllDigitDispMode )
	{
		var buf = this.m_DispNum;
		this.m_AllDigitDispMode = false;
		this.SetNum(0,false,true);
		
		this.m_DigitMax = DigitMax;
		this.m_AnimDigit = false;
		this.m_AllDigitDispMode = AllDigitDispMode;
		this.SetNum( buf, false, true );
		
	},
	
	GetNum : function()
	{
		return this.m_Num;
	},
	
	SetRGBA : function(r,g,b,a)
	{
		for( var i=0; i<this.m_DigitMax; i++ )
		{
			this.m_SpriteNum[i].ChangeTextureColor(r,g,b);
			this.m_SpriteNum[i].SetAlpha(a);
		}
	},
};
