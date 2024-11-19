/**
 * @file 	UiUtility.js
 * @brief 	UI周りの雑多なユーティリティ関数群
 */
var UiUtility = function() {

};

// 基本解像度
UiUtility.BaseResolution = { w:640, h: 800 };

// 基本解像度<スクリーン解像度の際に基本スクリーンはセンタリングするか？
UiUtility.BaseScreenCenteringH = true;

// 基本画面のYからスクリーン座標のYに変更
UiUtility.GetScreenPosY = function( BaseScreenPosY )
{
	if( !UiUtility.BaseScreenCenteringH )
	{
		return BaseScreenPosY;
	}
	
	if( SnlPixiMgr.m_Height <= UiUtility.BaseResolution.h )
	{
		return BaseScreenPosY;
	}
	
	var top = Math.floor( (SnlPixiMgr.m_Height - UiUtility.BaseResolution.h) * 0.5 );
	
	return top + BaseScreenPosY;
}

// BankのImg定義
UiUtility.ImgBankData = null;

UiUtility.SetImgBankData = function( ImgBankData )
{
	UiUtility.ImgBankData = ImgBankData;
}


//正多角形の座標を得る
//x,y=中心
//radius=半径//配列にすると角度ごとの可変半径に
//sides=辺の数
//offsetAngle=オフセット角度
UiUtility.PolygonPoint = function(x, y, radius_max, clamp_max, radius, sides, offsetAngle, mini_radius)
{
	var r = [];
	var offsetRadius = [];
	if (Array.isArray(radius) == false)
	{
		for (var i = 0; i < sides; i++)
		{
			offsetRadius[i] = radius;
		}
	}
	else
	{
		offsetRadius = radius;
	}

	if (!mini_radius)
	{
		mini_radius = 0; //最低値
	}

	// 内角
	var radDiv = (Math.PI * 2) / sides;
	// 回転オフセット(省略時は270°)
	var radOffset = (offsetAngle != undefined) ? offsetAngle * Math.PI / 180 : -Math.PI / 2;

	// パス描画
	for (var i = 0; i < sides; ++i)
	{
		var rad = radDiv * i + radOffset;
		var rate = (offsetRadius[i] / clamp_max);
		var radius = (rate * radius_max) + mini_radius;
		var px = x + Math.cos(rad) * radius;
		var py = y + Math.sin(rad) * radius;
		r.push(px);
		r.push(py);
	}
	r.push(r[0]);
	r.push(r[1]);
	//ctx.closePath();
	return r;
}

//数値をカンマ区切りの文字列にする
UiUtility.GetNumText = function(num)
{
	return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

//数値をHH:MM:SSに変換
UiUtility.ConvHHMMSS = function(num)
{
	num = parseInt(num);

	var HH = Math.floor(num / 3600);
	num -= HH * 3600;

	var MM = Math.floor(num / 60);
	num -= MM * 60;

	var SS = num;

	var Day = Math.floor(HH / 24);

	if (1 <= Day)
	{
		HH -= 24 * Day;
	}

	HH = ('00' + HH).slice(-2);
	MM = ('00' + MM).slice(-2);
	SS = ('00' + SS).slice(-2);

	if (1 <= Day)
	{
		return Day + "日 " + HH + ":" + MM + ":" + SS;
	}

	return HH + ":" + MM + ":" + SS;
}

//指定文字数で配列に分ける
UiUtility.SplitText = function(src, worp_count)
{
	var r = [];
	for (; src.length != 0;)
	{
		r.push(src.substr(0, worp_count));
		src = src.substr(worp_count);
	}
	return r;
}
//指定文字数で改行する
UiUtility.GetWorpText = function(src, worp_count)
{
	// 元の文章に改行が含まれる場合はあらかじめSplit 
	var b = src.split(/\n/);
	var txt = "";
	
	for( var n=0; n<b.length; n++ )
	{
		if( n != 0 )
		{
			txt += "\n";
		}
		
		var r = b[n];
		var c = 0;
		for( var i=0; i<r.length; i++ )
		{
			var strc = 1;
			if( SnlRichText.isHankaku( r[i] ) )
			{
				strc = 0.6;
			}
			
			if( worp_count < (c + strc) )
			{
				txt = txt + "\n" + r[i];
				c = strc;
			}
			else
			{
				txt = txt + r[i];
				c += strc;
			}
			
			
		}
		
		
		/*var r = UiUtility.SplitText(b[n], worp_count);
	
		for (var i = 0; i < r.length; i++)
		{
			txt += r[i];
			if (i != r.length - 1)
			{
				txt += "\n";
			}
		}*/
		
		
		
		
		
		
	}		
	return txt;
}

UiUtility.TextBoxDefaultZ = 2;

// レイアウトから作成されたオブジェクトからテキストボックスを作成する
UiUtility.CreateTextBox = function(text_rect_object, str_length, placeholder, value, input_type, font_size, text_align, text_color )
{
	if (placeholder == null)
	{
		placeholder = "";
	}

	if (value == null)
	{
		value = null;
	}

	var pos = text_rect_object.GetWorldPos();
	var DecX = 12;
	
	var UserAgent = navigator.userAgent.toLowerCase();
	var isiPad = UserAgent.indexOf('ipad') > -1 || UserAgent.indexOf('macintosh') > -1 && 'ontouchend' in document;

	if (typeof font_size === "undefined")
	{
		font_size = 14;
	}
	else
	{
		

		// 携帯端末( ipod, iphone, ipad, android )
		if (0 < UserAgent.indexOf('ipod') || 0 < UserAgent.indexOf('iphone') || 0 < UserAgent.indexOf('ipad') || 0 < UserAgent.indexOf('android'))
		{
			if (0 < UserAgent.indexOf('ipod') || 0 < UserAgent.indexOf('iphone') || 0 < UserAgent.indexOf('ipad'))
			{
				pos.x -= 5;
				pos.y -= 5;

				DecX = 20;
			}
			

			
			if( isiPad )
			{
				var ScreenH = document.documentElement.clientHeight;
				var Rate = ScreenH / 1042;
				font_size *= Rate;
			}
			else
			{
				font_size *= 0.5;
			}
		}
		/*
		if (GameConfig.isPC)
		{
			font_size = Math.floor(font_size * LayoutUtil.GetDefaultScale());
		}
		*/
	}

	if( typeof text_align === "undefined" )
	{
		text_align = "center";

		if (input_type == null)
		{
			input_type = null;
		}
		else if (input_type.toLowerCase() == "number")
		{
			text_align = "right";
		}
	}
	
	if( typeof text_color === "undefind" )
	{
		text_color = "White";
	}

	var Scl = LayoutUtil.GetDefaultScale();

	var text_box = new SnlTextBox();
	if( isiPad )
	{
		text_box.BaseFontSize = font_size;
	}
	text_box.Create(pos.x, pos.y, text_rect_object.layout_data.ow * Scl - DecX, text_rect_object.layout_data.oh * Scl - 10, str_length, UiUtility.TextBoxDefaultZ , placeholder, value, input_type);
	text_box.ChangeCss("fontSize", font_size);
	text_box.ChangeCss("background-color", "transparent");
	text_box.ChangeCss("border", "0");
	text_box.ChangeCss("text-align", text_align);
	text_box.ChangeCss("color", text_color);
	text_box.ChangeCss("outline", 0);

	return text_box;
}

//カラーマトリクスフィルターを弄る
// 0.0~1.0までの値
/*
	[							|ここの2つは色の今の色へ掛けて足される
			R	|G		|B		|		|
		R	1,	|0,		|0, 	|0,		|0,
		G	0, 	|1,		|0, 	|0,		|0,
		B	0,	|0,		|1, 	|0,		|0,
		A	0,	|0,		|0, 	|1,		|0
	]
*/

//RGB指定のフィルターカラーへ
UiUtility.SetFilterColor = function(filter, r, g, b)
{
	filter.matrix = [
		1 - (g + b), r, r, 0, 0,
		g, 1 - (r + b), g, 0, 0,
		b, b, 1, 0, 0,
		0, 0, 0, 1 - (r + g), 0,
	];
	//R
	filter.matrix[0] = 1 - (g + b);
	filter.matrix[1] = r;
	filter.matrix[2] = r;
	//G
	filter.matrix[5] = 1 - (r + b);
	filter.matrix[6] = g;
	filter.matrix[7] = g;
	//B
	filter.matrix[10] = 1 - (r + g);
	filter.matrix[11] = b;
	filter.matrix[12] = b;
}
//αを設定allとra～は排他
UiUtility.SetFilterAlpha = function(filter, all, ra, ga, ba)
{
	if (ra != 0 || ga != 0 || ba != 0)
	{
		filter.matrix[15] = ra;
		filter.matrix[16] = ga;
		filter.matrix[17] = ba;
		filter.matrix[18] = 0;
	}
	else
	{
		filter.matrix[15] = 0;
		filter.matrix[16] = 0;
		filter.matrix[17] = 0;
		filter.matrix[18] = all;
	}
}
//色のシフト
UiUtility.SetFilterAddColor = function(filter, r, g, b)
{
	filter.matrix[4] = r;
	filter.matrix[8] = g;
	filter.matrix[12] = b;
}

//オブジェクトのディープコピー(力)
UiUtility.CopyObject = function(obj)
{
	var r = null;
	try
	{
		r = JSON.parse(JSON.stringify(obj));
	}
	catch (e)
	{
		console.assert("コピーに失敗しました");
		return null;
	}
	return r;
}

// 全ての画像ノードにスケールをかける（nullなノードはスルーして子を探す、スケールを掛けたノード以下はスケールを掛けない）
UiUtility.SetImgScl = function(Obj, Scl)
{
	if (Obj.m_TextureNo == -1 && !Obj.m_isText)
	{
		// 子を検索
		if (Obj.m_Child == null)
		{
			return;
		}

		for (var i = 0; i < Obj.m_Child.length; i++)
		{
			UiUtility.SetImgScl(Obj.m_Child[i], Scl);
		}

		return;
	}

	// スケールを掛ける
	var ImgSclX = Obj.GetScale().x * Scl;
	var ImgSclY = Obj.GetScale().y * Scl;
	Obj.SetScale(ImgSclX, ImgSclY);
}

//配列の中に指定の値が有るかチェック
UiUtility.FindValueInArray = function(dest_value, src_array)
{
	if (Array.isArray(src_array) === false) return false;

	for (var key in src_array)
	{
		var value = src_array[key];
		if (dest_value === value)
		{
			return true;
		}
	}
	return false;
}

UiUtility.PathToFileName = function( Path )
{
	return Path.split("/").pop().split("?")[0];
}

UiUtility.FileNameToImgIdx = function(Bank, FileNameBase)
{
	var FileName = FileNameBase.toLowerCase();

	if (FileName.indexOf(".") < 0)
	{
		FileName = FileName + ".png";
	}

	for (var i = 0; i < UiUtility.ImgBankData[Bank].c_ImgPath.length; i++)
	{
		if( UiUtility.PathToFileName(UiUtility.ImgBankData[Bank].c_ImgPath[i].toLowerCase()) === FileName )
		{
			return i;
		}
	}
	
	FileName = FileNameBase.toLowerCase();

	if (FileName.indexOf(".") < 0)
	{
		FileName = FileName + ".jpg";
	}
	
	for (var i = 0; i < UiUtility.ImgBankData[Bank].c_ImgPath.length; i++)
	{
		if( UiUtility.PathToFileName(UiUtility.ImgBankData[Bank].c_ImgPath[i].toLowerCase()) === FileName )
		{
			return i;
		}
	}	
	
	
	
	return -1;
};

// ParentLayoutObj(nullオブジェクト)のサイズとTextureNoのサイズに基づきParentLayoutObjをスケーリングしてスケール調整されたSnlObjectを作成
// (TextureBankはわからないなら0or省略）
UiUtility.CreateObjectFromNullObj = function( ParentLayoutObj, TextureNo, TextureBank )
{
	if( typeof TextureBank == "undefined" )
	{
		TextureBank = 0;
	}
	var TexSize = SnlPixiMgr.GetTextureSize(TextureBank, TextureNo);
	var SclX = ParentLayoutObj.layout_data.ow / TexSize.x;
	var SclY = ParentLayoutObj.layout_data.oh / TexSize.y;
	ParentLayoutObj.SetScale( SclX, SclY );
	
	var AnchorStr = ParentLayoutObj.layout_data.anchor;
	if( AnchorStr == null || AnchorStr == "" )
	{
		AnchorStr = "CC";
	}
	
	var AnchorX = LayoutReproduction.eAnhor[AnchorStr].x;
	var AnchorY = LayoutReproduction.eAnhor[AnchorStr].y;
	
	var Obj = new SnlObject( TextureBank );
	Obj.CreateSprite( TextureNo, 0, 0, AnchorX, AnchorY, -1, ParentLayoutObj );
	
	return Obj;
};

// ParentLayoutObj(nullオブジェクト)のサイズとNumTextureIDArrayのサイズに基づきParentLayoutObjをスケーリングしてスケール調整されたSnlNumDispを作成
// (TextureBankはわからないなら0or省略）
UiUtility.CreateNumDispFromNullObj = function( ParentLayoutObj, NumTextureIDArray, Arigen, SizeInfo, TextureBank )
{
	if( typeof TextureBank == "undefined" )
	{
		TextureBank = 0;
	}
	
	var TextureID0 = NumTextureIDArray;
	if (Array.isArray(NumTextureIDArray))
	{
		TextureID0 = NumTextureIDArray[0];
	}
	
	var TexSize = SnlPixiMgr.GetTextureSize(TextureBank, TextureID0);
	var DigitMax = LayoutReproduction.NUM_DISP_MAX_DIGIT;	// レイアウトから作るんだからレイアウト設定に合わせとけ
	var SclX = ParentLayoutObj.layout_data.ow / TexSize.x;
	var SclY = ParentLayoutObj.layout_data.oh / TexSize.y;
	ParentLayoutObj.SetScale( SclX, SclY );
	
	var NumDisp = new SnlNumDisp();
	NumDisp.SetBank( TextureBank );
	NumDisp.Create(0, 0, 0, DigitMax, NumTextureIDArray, TexSize.x, -1, ParentLayoutObj, Arigen, SizeInfo);
	
	return NumDisp;
};

// レイアウト側に設定されているow,ohに基づいてスケーリング
UiUtility.SetScaleFromLayout = function( LayoutObj )
{
	var TextureBank = LayoutObj.m_BankNo;
	var TextureNo = LayoutObj.GetTextureNo();
	var TexSize = SnlPixiMgr.GetTextureSize(TextureBank, TextureNo);
	
	var SclX = LayoutObj.layout_data.ow / TexSize.x;
	var SclY = LayoutObj.layout_data.oh / TexSize.y;
	
	LayoutObj.SetScale( SclX, SclY );
	
}


// パスの配列にランダムなバージョンを付与
UiUtility.SetRndVersion = function( PathArray )
{
	for( var i=0; i<PathArray.length; i++ )
	{
		PathArray[i] = PathArray[i] + "?v=" + Math.floor( Math.random() * 4294967295 );
	}
	return PathArray;
}


UiUtility.NumPrefix = 
{
	K : { P: "K", Num: 1000 },
	M : { P: "M", Num: 1000000 },
	G : { P: "G", Num: 1000000000 },
	T : { P: "T", Num: 1000000000000 },
	P : { P: "P", Num: 1000000000000000 },
};

UiUtility.NumPrefixArray = 
[
	UiUtility.NumPrefix.K,
	UiUtility.NumPrefix.M,
	UiUtility.NumPrefix.G,
	UiUtility.NumPrefix.T,
	UiUtility.NumPrefix.P,
];

// 数字を単位をつけて表示するテキストにコンバート
UiUtility.NumToKMGText = function( BNum )
{
	var Ret = UiUtility.NumToKMG( BNum );
	return Ret.NumText + Ret.Unit;
}

// 数字を数値と単位に分けて表示する
UiUtility.SetKMGNum = function( BNum, NumObj, UnitObj )
{
	var Ret = UiUtility.NumToKMG( BNum );
	NumObj.SetText(Ret.NumText);
	UnitObj.SetText(Ret.Unit);
}

// 数字を単位と表示部分に分ける( { NumText:数値部分, Unit:単位 } )
UiUtility.NumToKMG = function( BNum )
{
	var Ret = { NumText: 0, Unit: "" };
	
	if( BNum == null )
	{
		return Ret;
	}
	
	var BigNum = BNum;
	
	var DispNum = 0;
	var DispStr = "0";
	
	for( var i=UiUtility.NumPrefixArray.length-1; 1<=i; i-- )
	{
		if( UiUtility.NumPrefixArray[i].Num <= BigNum )
		{
			DispNum = BigNum / UiUtility.NumPrefixArray[i].Num;
			DispStr = DispNum.toFixed(3).slice( 0, 5 );
			
			Ret.NumText = DispStr;
			Ret.Unit = UiUtility.NumPrefixArray[i].P;
			
			return  Ret;
		}
	}
	
	if( 10000 <= BigNum )
	{
		DispNum = BigNum / UiUtility.NumPrefix.K.Num
		DispStr = DispNum.toFixed(3).slice( 0, 5 );
		
		Ret.NumText = DispStr;
		Ret.Unit = UiUtility.NumPrefix.K.P;
		
		return  Ret;
	}
	
	Ret.NumText = "" + BigNum;

	return Ret;
}