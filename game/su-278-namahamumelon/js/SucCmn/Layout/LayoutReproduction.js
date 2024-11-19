/**
 * @file 	LayoutReproduction.js
 * @brief 	レイアウトクラス
 */

/*
レイアウトデータからUIを作る
てぃっぷす
・オートスケールが動いてるときにオートスケール対象ノードへの位置変更はスケール後コールバックでやらないとオートスケールの初期位置計算のときに元座標に戻されちゃうぞ
*/

var LayoutReproduction = function(owner_ojb, default_z)
{
	//
	this.load_file = ""; //読み込んだファイル名
	this.root_parent = null;

	this.sprite_array = [];
	
	//バンクなし版
	this.prefix = "";
	this.imgEnum = null;
	
	//バンクあり版
	this.use_bank_mode = false;
	this.imgBankArray = null;
	this.btnBankArray = null;

	//システム変数
	this.layout_data = null; //読み込んだレイアウトデータ
	this.owner = owner_ojb; //作り元
	this.default_z = LayoutReproduction.DispDefaultZ; //ディフォルトZ値
	if (default_z)
	{
		this.default_z = default_z;
	}
	this.load_complete = false; //ロード完了
	this.onload_create = false; //ロード完了時にクリエイトする
	this.onload_onscale_callback = null;
	this.deleted_flag = false; //削除済み
	//デバッグ用
	this.rect_debug = false; //矩形が書かれる（本当に合ってるかは謎(大体合ってる))
	//デバッグ用２
	this.btn_psdid_debug = false; //ボタンにPSDIDを表示する
	//デバッグ用３
	this.rect_debug_text_only = false;

	//ボタンを反応させなくするYの座標
	this.enable_btn_range = {
		y: null, //数字なら動く。null or undefined なら動かない
		h: 0, //yからの有効な高さ
		y1: null, //y+h
	};
	
	//全てのテキストにテキストエフェクトをつけない
	this.all_cancel_text_effect = false;
	
	// ファイルを出力したPhotoshopのバージョン
	this.ps_app_vesion = 19; //とりあえず2018ってことにしておく
};

// エラー表記のDisp位置
LayoutReproduction.DispErrorZ = 0;

// デフォルトのDisp位置
LayoutReproduction.DispDefaultZ = 1;


//
LayoutReproduction.NUM_DISP_MAX_DIGIT = 8; //SnlNumDispを使った時の最大桁数
//常駐データ配列
LayoutReproduction.BeingStationedLayoutData = null; //[{file:filename, data:layout_data, step:LayoutReproduction.eStepStationed}]

//ルートのID（絶対に０）
LayoutReproduction.ROOT_LAYER_ID = 0;

//オブジェクトの種類
LayoutReproduction.eObjKind = {
	NOWN: 0,
	IMAGE: 1,
	BUTTON: 2,
	TEXT: 3,
	NUMBER: 4, //NumDisp
	NINE: 5, //ナインスライス
};

//IMGインデックスを探す時の種類
LayoutReproduction.eEindex = {
	IMAGE: 0,
	BUTTON: 1,
};

//アンカーの割合値
LayoutReproduction.eAnhor = { //横/縦
	LU:
	{
		x: 0,
		y: 0
	},
	LC:
	{
		x: 0,
		y: 0.5
	},
	LD:
	{
		x: 0,
		y: 1
	},

	CU:
	{
		x: 0.5,
		y: 0
	},
	CC:
	{
		x: 0.5,
		y: 0.5
	},
	CD:
	{
		x: 0.5,
		y: 1
	},

	RU:
	{
		x: 1,
		y: 0
	},
	RC:
	{
		x: 1,
		y: 0.5
	},
	RD:
	{
		x: 1,
		y: 1
	},
};

// PhotoShop→PixiJSの位置のズレを吸収するためのオフセットを計算するための値
// オフセット値=round(FontSize*Rate)
LayoutReproduction.TextOffsetRateX = 0.05; // 左右揃え時のみオフセット計算をする
LayoutReproduction.TextOffsetRateY = 0.04;

// テキストのアンカーやスタイルの基本値のテーブル
LayoutReproduction.AliganBaseTbl =
[
	{ style: "left",	x: 0,   y:SnlObject.TextCenterAnchorY	}, 	// LayoutTextLeft
	{ style: "center",	x: 0.5, y:SnlObject.TextCenterAnchorY 	},	// LayoutTextCenter
	{ style: "right",	x: 1,   y:SnlObject.TextCenterAnchorY	},	// LayoutTextRight
];

//バンク配列を取る
LayoutReproduction.prototype.GetBankArray = function()
{
	return {
		img: this.imgBankArray,
		btn: this.btnBankArray
	};
}

//ボタンの有効範囲を設定する//縦スクロールのみ対応
LayoutReproduction.prototype.SetBtnEnableRange = function(y, h)
{
	this.enable_btn_range = {
		y: y,
		h: h,
		y1: y + h
	};
}




//破棄
LayoutReproduction.prototype.Destroy = function()
{
	if (this.sprite_array.length > 0)
	{
		var keys = Object.keys(this.sprite_array);

		for (var i = keys.length - 1; i >= 0; i--)
		{
			var key = keys[i];
			this.sprite_array[key].Destroy();
			this.sprite_array[key] = null;
		}
	}
	this.sprite_array = null;
	this.layout_data = null;
	this.deleted_flag = true; //削除済みフラグを立てる
};

//有効範囲チェック
LayoutReproduction.prototype.IsInEnableRange = function(dest_obj)
{
	//有効範囲
	if (this.enable_btn_range.y != null)
	{
		var btn_wpos = dest_obj.GetWorldPos();
		if (btn_wpos.y < this.enable_btn_range.y || this.enable_btn_range.y1 < btn_wpos.y)
		{
			return false; //範囲外なので
		}
	}
	return true;
}

//ボタンを更新
LayoutReproduction.prototype.UpdateButton = function()
{
	for (var sp in this.sprite_array)
	{
		if (this.sprite_array[sp].obj_kind == LayoutReproduction.eObjKind.BUTTON)
		{
			if (this.sprite_array[sp].disable_update == true) continue; //更新しないフラグ
			if (this.sprite_array[sp].GetVisible() == false) continue; //未表示は更新しない
			if (this.IsInEnableRange(this.sprite_array[sp].GetSprite()) == false) continue; //有効範囲外

			this.sprite_array[sp].Update();
			if (this.sprite_array[sp].GetLastHit() === true)
			{
				return this.sprite_array[sp];
			}
		}
	}
	return null;
}

//全部更新
LayoutReproduction.prototype.Update = function(delta_time)
{
	var button_result = this.UpdateButton();

	return button_result;
}

// ロード(バンクモードだけど今あるバンクを自動で)
// url:レイアウトパス, onload_function: ロード完了コールバック
LayoutReproduction.prototype.LoadBankModeAuto = function( url, onload_function )
{
	this.LoadBankMode( url, SnlPixiMgr.GetEnableBankList(), null, onload_function );
}


//ロード(バンクモード)
LayoutReproduction.prototype.LoadBankMode = function(url, img_bank_array, btn_bank_array, onload_function)
{
	this.use_bank_mode = true; //バンクモード
	this.imgBankArray = img_bank_array;
	if( btn_bank_array == null )
	{
		this.btnBankArray = img_bank_array;
	}
	else
	{
		this.btnBankArray = btn_bank_array;
	}

	//AJAXロード開始
	this.GetOneStageDataRequest(url, onload_function);
}
//ロード(通常モード)
LayoutReproduction.prototype.Load = function(url, img_enum, prefix, onload_function)
{
	this.imgEnum = img_enum;
	this.prefix = prefix;
	this.GetOneStageDataRequest(url, onload_function);
}

//ロードして構築(バンクモード)
LayoutReproduction.prototype.LoadCreateBankMode = function(url, img_bank_array, btn_bank_array, onload_function)
{
	if( img_bank_array == null )
	{
		img_bank_array = [0];
	}
	
	if( btn_bank_array == null )
	{
		btn_bank_array = img_bank_array;
	}

	this.onload_create = true;
	this.LoadBankMode(url, img_bank_array, btn_bank_array, onload_function);
}

//UIを作る(データはどこでも)
LayoutReproduction.prototype.Create = function(layout_data, imgEnum)
{
	if (this.deleted_flag == true) //レイアウト読み込みー＞XRHで取得中に削除ー＞こっからさきは宙ぶらりん
	{
		console.error("削除済みレイアウトを構築しようとしています");
		//それとなく動くようにとりあえず流しています。
	}

	this.layout_data = layout_data;

	//rootのデータを少しだけカスタマイズする
	if (layout_data.name == "root")
	{
		layout_data.base_w = layout_data.ow;
		layout_data.base_h = layout_data.oh;
		
		layout_data.ow = SnlPixiMgr.m_Width;
		layout_data.oh = SnlPixiMgr.m_Height;
		
		if( typeof layout_data.app_version != "undefined" )
		{
			this.ps_app_vesion = parseInt( layout_data.app_version );
		}
	}
	else
	{
		console.assert("レイアウトデータの先頭がrootじゃないぞ");
	}

	//読み込んだデータにデバッグスイッチがあるならRECTを表示する
	if ("dbg_rect" in layout_data)
	{
		console.log("layoutデータにデバッグ用フラグを発見しました");
		this.rect_debug = true;
	}

	if(imgEnum!=undefined && imgEnum!=null)
	{
		this.imgEnum = imgEnum;
	}

	this.MakeSprite(layout_data, this.root_parent);
};

//UIを作る(バンクも指定できる)
LayoutReproduction.prototype.CreateBankMode = function(layer_data, img_bank_array, btn_bank_array)
{
	this.use_bank_mode = true;
	this.imgBankArray = img_bank_array;
	this.btnBankArray = btn_bank_array;
	this.Create(layer_data);
};

//自身がもってるlayout_dataでUIを作る
LayoutReproduction.prototype.CreateSelf = function()
{
	this.Create(this.layout_data);
}


//=================================================================================================
//内部向けメソッド
//=================================================================================================

//AJAXでレイアウトデータリソースを読む
LayoutReproduction.prototype.GetOneStageDataRequest = function(url, onload_function)
{


	var stationed_data = LayoutReproduction.FindStationedData(url);
	if (stationed_data != null)
	{
		console.log("常駐データで初期化("+url+")");
		this.load_complete = true;
		this.layout_data = stationed_data;
		//レイアウトを展開
		if (this.onload_create == true)
		{
			this.Create(this.layout_data);
		}
		onload_function.call(this.owner, this); //thisを初期化元にする
		return;
	}

	var self = this;
	this.load_file = url;
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = function()
	{
		if (this.readyState == 4)
		{
			if (this.status == 200 && this.response)
			{
				self.layout_data = JSON.parse(this.response);
				//レイアウトを展開
				if (self.onload_create == true)
				{
					self.Create(self.layout_data);
				}

				//ロード直後に初期化したい時
				if (onload_function != null && onload_function != undefined)
				{
					if (self.owner)
					{
						onload_function.call(self.owner, self); //thisを初期化元にする
					}
					else
					{ //こっちはいるのだろうか・・・
						onload_function(self);
					}
				}

				//ロード完了
				self.load_complete = true;
			}
			else //if (this.status == 0)
			{ //取得できなきゃ全部失敗
				var Dialog = new DialogNormal();
				Dialog.Init(DialogNormal.Size.S, "画面構築データ取得失敗\nトップへ戻ります。", ["OK"], null, NetworkMgr.CmnErrorToTop, LayoutReproduction.DispErrorZ, "エラー");
			}
		}
		else
		{}
	}

	if (url.indexOf("http") != 0)
	{
		url = SnlPixiMgr.m_BasePath + url;
	}
	console.log("レイアウトロード:" + url);
	xmlHttpRequest.open('GET', url, true);
	xmlHttpRequest.responseType = 'text'; //IEだとjsonタイプが選べないので・・・

	if (SnlPixiMgr.isDebug)
	{
		xmlHttpRequest.setRequestHeader('Pragma', 'no-cache');
		xmlHttpRequest.setRequestHeader('Cache-Control', 'no-cache');
		xmlHttpRequest.setRequestHeader('If-Modified-Since', 'Thu, 01 Jun 1970 00:00:00 GMT');
	}

	try
	{
		xmlHttpRequest.send();
	}
	catch (e)
	{
		console.log("取得失敗");
	}
};


//SNLオブジェを作る
LayoutReproduction.prototype.MakeSprite = function(layout_data, parent_sprite)
{
	//スケールを追加する
	if (!("scale" in layout_data))
	{
		layout_data.scale = 1;
	}
	//Z値
	var z = (parent_sprite == null || parent_sprite == undefined) ? this.default_z : -1;
	var sprite_obj = new SnlObject();
	sprite_obj.obj_kind = LayoutReproduction.eObjKind.NOWN;

	var anchor = this.GetAnchor(layout_data.anchor);
	var pos = this.CalcSpritePos(layout_data, parent_sprite);

	if (layout_data.is_num == true)
	{ //SnlNum
		sprite_obj = this.CreateSnlNumDisp(layout_data, parent_sprite);
		sprite_obj.obj_kind = LayoutReproduction.eObjKind.NUMBER;
	}
	else if (layout_data.is_text == true)
	{ //TextSprite
		sprite_obj.obj_kind = LayoutReproduction.eObjKind.TEXT;
		var text_info = layout_data.text_data;
		
		// 古いPhotoshopで出力されてる場合の補正
		if( this.ps_app_vesion <= 13 ) // とりあえずCC
		{
			text_info.size = Math.round( text_info.size * 1.04166667 );
		
			if( typeof text_info.line_height != "undefined" )
			{
				text_info.line_height = Math.round( text_info.line_height * 1.04166667 );
			}
		}
		
		var is_bold = (text_info) ? text_info.is_bold : false;
		var AliganData = UiUtility.CopyObject( LayoutReproduction.AliganBaseTbl[text_info.aligan] );
		
		// オフセットの計算
		var ofsX = -Math.round( text_info.size * LayoutReproduction.TextOffsetRateX );
		var ofsY = Math.round( text_info.size * LayoutReproduction.TextOffsetRateY );
		switch( text_info.aligan % 3 )
		{
			case SnlObject.eTextAligan.Left:
			break;
			
			case SnlObject.eTextAligan.Center:
				ofsX = 0;
			break;
			
			case SnlObject.eTextAligan.Right:
				ofsX = -ofsX;
			break;
		}
		
		sprite_obj.CreateText(text_info.content, text_info.size, is_bold, "#" + text_info.color, AliganData, pos.x + ofsX, pos.y + ofsY, z, parent_sprite);
		sprite_obj.layout_text_base_pos = { x:pos.x + ofsX, y:pos.y + ofsY };
		
		if( typeof text_info.line_height != "undefined" )
		{
			if( 2 <= LayoutUtil.LineCounter( text_info.content ) )
			{
				sprite_obj.ChangeTextStyle( "lineHeight", text_info.line_height );
			}
		}
		
		if( typeof text_info.spaceing != "undefined" )
		{
			var em =  text_info.spaceing / 1000;
			var spaceingPx = em * text_info.size;
			sprite_obj.ChangeTextStyle( "letterSpacing", spaceingPx );
		}
		sprite_obj.FlashTextStyle();
		


		sprite_obj.SetAlpha(layout_data.alpha);

		//テキストオプション＠ドロップシャドウ
		if ("drop_data" in layout_data && layout_data.drop_data != null)
		{
			if (("color" in layout_data.drop_data) &&
				("alpha" in layout_data.drop_data) &&
				("angle" in layout_data.drop_data) &&
				("blur" in layout_data.drop_data) &&
				("distance" in layout_data.drop_data)
			)
			{
				var drop_color = "#" + layout_data.drop_data.color;
				var alpha = parseFloat(layout_data.drop_data.alpha);
				var angle = parseFloat(layout_data.drop_data.angle);
				var blur = parseFloat(layout_data.drop_data.blur);
				var distance = parseFloat(layout_data.drop_data.distance);
				sprite_obj.SetTextDropShadow(drop_color, alpha, angle, blur, distance);
			}
			else
			{
				//console.warn("パラメータの無い@dropがあります:" + this.layout_data.original_file + " layer name:" + layout_data.name);
				sprite_obj.SetTextDropShadow("#000000", null, 1.57, null, null);
			}
		}
		//テキストオプション＠アウトライン
		if ("outline_data" in layout_data && layout_data.outline_data != null)
		{
			if (("color" in layout_data.outline_data) &&
				("thickness" in layout_data.outline_data) &&
				("line_join" in layout_data.outline_data)
			)
			{
				var outlien_color = "#" + layout_data.outline_data.color;
				var Thickness = parseInt(layout_data.outline_data.thickness);
				var LineJoin = layout_data.outline_data.line_join;
				sprite_obj.SetTextOutline(outlien_color, Thickness, LineJoin);
			}
			else
			{
				//console.warn("パラメータの無い@outlineがあります:" + this.layout_data.original_file + " layer name:" + layout_data.name);
				sprite_obj.SetTextOutline(null, null, null);
			}
		}
		//テキストオプションとディフォルトのエフェクトを消す
		if (this.all_cancel_text_effect === true)
		{
			sprite_obj.ChangeTextStyle("dropShadow", false);
			sprite_obj.ChangeTextStyle("strokeThickness", 0);
			sprite_obj.FlashTextStyle();
		}

		if (this.rect_debug == true || this.rect_debug_text_only == true) //大まかなサイズが出る（フォトショとフォントが違う関係上）
		{
			sprite_obj.rect_graphics = new SnlObject();
			var gp_info = {
				w: layout_data.ow,
				h: layout_data.oh
			};
			sprite_obj.rect_graphics.CreateSpriteGraphics(gp_info, 0, 0, 0, 0, -1, sprite_obj);
			sprite_obj.rect_graphics.GetSprite().lineStyle(2, 0x00FF88, 1);
			sprite_obj.rect_graphics.GetSprite().beginFill(0xCCDDCC, 0.5);
			var txt_anchor = this.GetAnchor(this.GetTextAnchorCode(text_info));
			sprite_obj.rect_graphics.GetSprite().drawRect(0 - (gp_info.w * txt_anchor.x), 0 - (gp_info.h * txt_anchor.y), gp_info.w, gp_info.h);

			if ("psd_id" in layout_data)
			{
				sprite_obj.rect_name = new SnlObject();
				sprite_obj.rect_name.CreateText(layout_data.psd_id, 20, false, "Red", 0, 0, 0, -1, sprite_obj.rect_graphics);
			}
		}
	}
	else if (layout_data.is_button == true || layout_data.is_toggle == true)
	{ //ButtonSprite
		sprite_obj = this.CreateButton(layout_data, parent_sprite);
		sprite_obj.obj_kind = LayoutReproduction.eObjKind.BUTTON;
		this.DbgRectSpriteSet(sprite_obj, layout_data);
	}
	else if (layout_data.is_nineslice == true)
	{ //NiceSlice
		//現在はNineSliceはバンクモードでしか動かない？
		sprite_obj = new NineSliceObj();
		var img_index = this.GetEImgNum(layout_data, LayoutReproduction.eEindex.IMAGE);
		sprite_obj.Create(img_index.bank, img_index.index, pos.x, pos.y, anchor.x, anchor.y, z, parent_sprite);
		sprite_obj.obj_kind = LayoutReproduction.eObjKind.NINE;
	}
	else
	{ //Sprite
		sprite_obj.obj_kind = LayoutReproduction.eObjKind.IMAGE;
		var img_index = this.GetEImgNum(layout_data, LayoutReproduction.eEindex.IMAGE);
		if (this.use_bank_mode === true)
		{
			sprite_obj.CreateSprite_SetBank(img_index.bank, img_index.index, pos.x, pos.y, anchor.x, anchor.y, z, parent_sprite);
		}
		else
		{
			sprite_obj.CreateSprite(img_index.index, pos.x, pos.y, anchor.x, anchor.y, z, parent_sprite);
		}
		sprite_obj.SetAlpha(layout_data.alpha);
		this.DbgRectSpriteSet(sprite_obj, layout_data);
	}
	//this.sprite_array[layout_data.name] = sprite_obj;
	sprite_obj.disable_update = false; //更新しないフラグ
	sprite_obj.layout_data = layout_data;
	if (layout_data.is_button == true || layout_data.is_toggle == true)
	{
		sprite_obj.GetSprite().layout_data = layout_data; //ボタンはSNLオブジェが一つ下なのでこっちにも参照を持たせる
		sprite_obj.GetSprite().btn_self = sprite_obj;
	}
	//this.sprite_array[layout_data.id] = sprite_obj;
	this.sprite_array.push(sprite_obj);
	//子供がいるなら
	var max = layout_data.child.length;
	for (var i = 0; i < max; i++)
	{
		this.MakeSprite(layout_data.child[i], sprite_obj);
	}
};

//イメージ番号を得る
LayoutReproduction.prototype.GetEImgNum = function(layout_data, eindex, extend_name, extend_name2, output_console )
{
	var result = {
		index: -1,
		bank: -1
	};
	
	if( typeof output_console == "undefined" )
	{
		output_console = true;
	}

	if (extend_name == undefined || extend_name == null)
	{
		extend_name = "";
	}

	if (layout_data.null_node == true)
	{
		return result;
	}
	else
	{
		if (this.use_bank_mode == true)
		{ //バンクを使う

			if (eindex == LayoutReproduction.eEindex.IMAGE)
			{ //イメージ
				//切り替えファイル名だったら切り替える				
				var file = layout_data.name;


				for (var bank in this.imgBankArray)
				{
					var idx = UiUtility.FileNameToImgIdx(this.imgBankArray[bank], file);
					if (idx != -1)
					{
						result.bank = this.imgBankArray[bank];
						result.index = idx;
						break;
					}
				}
			}
			if (eindex == LayoutReproduction.eEindex.BUTTON)
			{ //ボタン
				var file = layout_data.name + extend_name;
				
				if( extend_name != null && extend_name2 != null )
				{
					file = layout_data.name.replace( extend_name, extend_name2 );
					
					if( file == layout_data.name )
					{
						return result;
					}
				}
				
				for (var bank in this.btnBankArray)
				{
					var idx = UiUtility.FileNameToImgIdx(this.btnBankArray[bank], file);
					if (idx != -1)
					{
						result.bank = this.btnBankArray[bank];
						result.index = idx;
						break;
					}
				}
			}
			return result;
		}
		else
		{ //バンクは使わない
			var file = this.prefix + layout_data.name + extend_name;
			if (file in this.imgEnum)
			{
				result.bank = 0;
				result.index = this.imgEnum[file];
				return result;
			}
		}
	}
	if( output_console )
	{
		console.log("ファイルが無い？:" + layout_data.name);
	}
	return result;
};

//アンカー位置
LayoutReproduction.prototype.GetAnchor = function(anchor_code)
{
	var copy = null;
	if (anchor_code in LayoutReproduction.eAnhor)
	{
		copy = Object.assign(
		{}, LayoutReproduction.eAnhor[anchor_code]);
		return copy;
	}
	copy = Object.assign(
	{}, LayoutReproduction.eAnhor.CC);
	return copy;
};

//テクスト用のアンカーコードを得る
LayoutReproduction.prototype.GetTextAnchorCode = function(text_data)
{
	switch (text_data.aligan)
	{
		case 0:
			return "LC";
		case 1:
			return "CC";

		case 2:
			return "RC";
	}
};


//スプライトの座標
LayoutReproduction.prototype.CalcSpritePos = function(layout_data, parent_sprite)
{
	var origin_code = this.GetAnchor(layout_data.origin); //コピーを吐き出します
	var parent_size = {
		ow: 0,
		oh: 0
	};
	if (parent_sprite != null)
	{
		if (layout_data.name == "root")
		{ //ルートの親はイメージを持たないスプライトだけがなれます。//普通にあやしい//なんでワールド座標をサイズに入れているのか謎
			var p = parent_sprite.GetWorldPos();
			if (!p)
			{
				console.log("pはnull");
			}
			parent_size = { //座標から０，０を点対称にはんてんとかそういうのか？
				ow: p.x,
				oh: p.y
			};
			origin_code.x = origin_code.y = -1;
		}
		else
		{
			parent_size = {
				ow: (parent_sprite.layout_data.ow * parent_sprite.layout_data.scale),
				oh: (parent_sprite.layout_data.oh * parent_sprite.layout_data.scale)
			};
		}
	}
	var origin_pos = {
		x: parent_size.ow * origin_code.x,
		y: parent_size.oh * origin_code.y
	};
	var anchor_code = (layout_data.is_button == true) ? "CC" : layout_data.anchor;
	if (layout_data.is_text == true)
	{
		anchor_code = this.GetTextAnchorCode(layout_data.text_data);
	}
	var anchor_pos = this.GetAnchor(anchor_code);
	var pos = {
		x: (layout_data.sx * layout_data.scale) + ((layout_data.w * layout_data.scale) * anchor_pos.x) + origin_pos.x,
		y: (layout_data.sy * layout_data.scale) + ((layout_data.h * layout_data.scale) * anchor_pos.y) + origin_pos.y
	};

	pos.x = Math.floor(pos.x);
	pos.y = Math.floor(pos.y);

	return pos;
};

//ボタンをクリエイト
LayoutReproduction.prototype.CreateButton = function(layout_data, parent_sprite)
{
	var z = (parent_sprite == null || parent_sprite == undefined) ? this.default_z : -1;
	var name = layout_data.name;
	var pos = this.CalcSpritePos(layout_data, parent_sprite);
	//スケールボタンorフィリップボタン
	var btn_index = this.GetEImgNum(layout_data, LayoutReproduction.eEindex.BUTTON);
	var btn_off = this.GetEImgNum(layout_data, LayoutReproduction.eEindex.BUTTON, "_off", null, false );
	if (btn_off.index == -1)
	{
		btn_off = this.GetEImgNum(layout_data, LayoutReproduction.eEindex.BUTTON, "_0", null, false );
	}
	var btn_on = this.GetEImgNum(layout_data, LayoutReproduction.eEindex.BUTTON, "_on", null, false );
	if (btn_on.index == -1)
	{
		btn_on = this.GetEImgNum(layout_data, LayoutReproduction.eEindex.BUTTON, "_1", null, false );
		
		if( btn_on.index == -1 )
		{
			btn_on = this.GetEImgNum(layout_data, LayoutReproduction.eEindex.BUTTON, "_0", "_1", false );
		}
	}
	var dest_sprite = new SnlButton(btn_index.bank);

	//トグルボタン
	if (layout_data.is_toggle == true)
	{
		dest_sprite.SetBank(btn_off.bank);
		dest_sprite.CreateFlipBtn(btn_off.index, btn_on.index, pos.x, pos.y, z, 1.0, parent_sprite, true);
		return dest_sprite;
	}
	//通常のボタン
	if (btn_off.index == -1 && btn_on.index == -1)
	{ //スケールボタン
		dest_sprite.CreateScaleBtn(btn_index.index, pos.x, pos.y, z, 1.0, parent_sprite);
		if (btn_index.index === -1)
		{//NULLボタン扱いする
			console.warn("ボタン画像なしでボタンを作りました"+layout_data.name);
			dest_sprite.m_Object.m_BaseSize = {
				x: layout_data.ow,
				y: layout_data.oh
			};
		}
	}
	else
	{ //フィリップボタン
		if (btn_on.index != -1 && btn_off.index != -1)
		{
			dest_sprite.SetBank(btn_off.bank);
			dest_sprite.CreateFlipBtn(btn_off.index, btn_on.index, pos.x, pos.y, z, 1.0, parent_sprite);
		}
		else if (btn_on.index != -1)
		{
			dest_sprite.CreateFlipBtn(btn_index.index, btn_on.index, pos.x, pos.y, z, 1.0, parent_sprite);
		}
		else if (btn_off.index != -1)
		{
			dest_sprite.CreateFlipBtn(btn_off.index, btn_index.index, pos.x, pos.y, z, 1.0, parent_sprite);
		}
	}
	if (this.btn_psdid_debug)
	{
		if ("psd_id" in layout_data)
		{
			dest_sprite.SetText(layout_data.psd_id, 18, false, "Yellow", 0, 0);
		}
	}

	return dest_sprite;
};

//SNLNUMを作る
LayoutReproduction.prototype.CreateSnlNumDisp = function(layer_data, parent_sprite)
{
	var z = (parent_sprite == null || parent_sprite == undefined) ? this.default_z : -1;
	var img_info = this.GetEImgNum(layer_data, LayoutReproduction.eEindex.IMAGE);
	if (img_info == null || img_info.index == -1 || img_info.bank == -1)
	{ //失敗ケース
		console.log(layer_data);
		console.assert("SnlNumDispとして構築しようとして失敗");
		return null;
	}
	//SnlNumを作る
	var pos = this.CalcSpritePos(layer_data, parent_sprite);
	var tex_info = SnlPixiMgr.GetTextureSize(img_info.bank, img_info.index);
	var numdisp = new SnlNumDisp();
	numdisp.SetBank(img_info.bank);
	numdisp.Create(pos.x, pos.y, 0, LayoutReproduction.NUM_DISP_MAX_DIGIT, img_info.index, tex_info.x, z, parent_sprite, layer_data.num_arigen);
	return numdisp;
}

//=============================================================================
//デバッグ用の矩形描画
//=============================================================================
LayoutReproduction.prototype.DbgRectSpriteSet = function(sprite_obj, layout_data)
{
	if (this.rect_debug == true) //大まかなサイズが出る（フォトショとフォントが違う関係上）
	{
		sprite_obj.rect_graphics = new SnlObject();
		var gp_info = {
			w: layout_data.ow,
			h: layout_data.oh
		};

		sprite_obj.rect_graphics.CreateSpriteGraphics(gp_info, 0, 0, 0, 0, -1, sprite_obj);
		if (layout_data.null_node == true)
		{
			sprite_obj.rect_graphics.GetSprite().lineStyle(-2, 0xFF0088, 1);
			sprite_obj.rect_graphics.GetSprite().beginFill(0xCCDDCC, 0.3);
		}
		else
		{
			sprite_obj.rect_graphics.GetSprite().lineStyle(-1, 0x00FF88, 0.5);
			sprite_obj.rect_graphics.GetSprite().beginFill(0xCCDDCC, 0.3);

		}
		var anchor = this.GetAnchor(layout_data.anchor);
		var pos = {
			x: 0 - (layout_data.w * anchor.x),
			y: 0 - (layout_data.h * anchor.y)
		};
		sprite_obj.rect_graphics.GetSprite().drawRect(pos.x, pos.y, layout_data.ow, layout_data.oh);

		sprite_obj.rect_graphics.GetSprite().lineStyle(-1, 0xFFFF00, 1);
		sprite_obj.rect_graphics.GetSprite().beginFill(0xFFFF00, 1);
		sprite_obj.rect_graphics.GetSprite().drawRect(0, 0, 3, 3);

		//ついでに名前も
		sprite_obj.rect_name = new SnlObject();
		var name = layout_data.name;
		if ("psd_id" in layout_data)
		{
			name += "\n" + layout_data.psd_id;
		}
		sprite_obj.rect_name.CreateText(name, 12, false, "Red", 0, 0, 0, -1, sprite_obj.rect_graphics);

	}
}

//=============================================================================
//各種ゲッター＆操作
//=============================================================================

//ｓNLオブジェを取る//レイアウトデータの.idを入れてね//名前でも動くけど複数ある時は全部帰ってくる
LayoutReproduction.prototype.GetObject = function(layer_id_name)
{
	if ((typeof layer_id_name) == "string")
	{
		var r = this.GetObjectByName(layer_id_name); //誰も使っていない初期状態からの互換用に一応・・・
		if (r.length >= 1)
		{
			return r[0];
		}
		return null;
	}
	else if ((typeof layer_id_name) == "number")
	{
		return this.sprite_array[layer_id_name];
	}

	return null;
}

//名前からオブジェクトを取る
LayoutReproduction.prototype.GetObjectByName = function(layer_name)
{
	var r = [];
	for (var i = 0; i < this.sprite_array.length; i++)
	{
		if (this.sprite_array[i].layout_data.name == layer_name)
		{
			r.push(this.sprite_array[i]);
		}
	}
	return r;
}

//PSDのレイヤーオブジェクトユニークIDからオブジェクトを取る
LayoutReproduction.prototype.GetObjectByID = function(psd_id)
{
	for (var i = 0; i < this.sprite_array.length; i++)
	{
		if ("psd_id" in this.sprite_array[i].layout_data)
		{
			if (this.sprite_array[i].layout_data.psd_id == psd_id)
			{
				return this.sprite_array[i];
			}
		}
	}
	return null;
}

//PSDのレイヤーオブジェクトユニーク名からオブジェクトを取る
LayoutReproduction.prototype.GetObjectByLabel = function(label)
{
	for (var i = 0; i < this.sprite_array.length; i++)
	{
		if ("label" in this.sprite_array[i].layout_data)
		{
			if (this.sprite_array[i].layout_data.label == label)
			{
				return this.sprite_array[i];
			}
		}
	}
	return null;
}

// ボタン/トグル以外のオブジェクトへのSetIgnoreRaycast設定
LayoutReproduction.prototype.SetIgnoreRaycast = function( isIgnore )
{
	if( typeof isIgnore == "undefined" )
	{
		isIgnore = true;
	}
	
	for (var i = 0; i < this.sprite_array.length; i++)
	{
		if ( this.sprite_array[i].layout_data.is_button || this.sprite_array[i].layout_data.is_toggle )
		{
			continue;
		}
		if (this.sprite_array[i].layout_data.label == label)
		{
			this.sprite_array[i].SetIgnoreRaycast( isIgnore );
		}
		
	}	
}

//オブジェクトへスケールをかける
LayoutReproduction.prototype.SetObjectScale = function(layer_id_name, scale, psd_id)
{
	var obj = null;
	if (psd_id)
	{
		obj = this.GetObjectByID(psd_id);
	}
	else
	{
		obj = this.GetObject(layer_id_name);
	}
	if (obj)
	{
		var src_layout = obj.layout_data;
		src_layout.scale = scale;
		var p = this.CalcSpritePos(src_layout, obj.m_Parent);
		obj.SetScale(scale, scale);
		obj.SetPos(p.x, p.y);
	}
}

// オブジェクトのルートの子に基本スケールをかける
LayoutReproduction.prototype.SetDefaultScaleH = function()
{
	var root = this.GetObject(LayoutReproduction.ROOT_LAYER_ID);
	var DefaultScale = root.layout_data.oh / root.layout_data.base_h;
	
	var root_data = this.layout_data;
	for (var i = 0; i < root_data.child.length; i++)
	{
		var psd_id = root_data.child[i].psd_id;
		this.SetObjectScale(undefined,DefaultScale, psd_id);
	}
}


//フォトショのレイヤー機能が作り出したそのオブジェを内包する幅と高さを取る
//NULLノードでもそのNULLノード以下に含まれるオブジェを全て内包するサイズが入って今留
LayoutReproduction.prototype.GetObjSize = function(layer_id)
{
	if (layer_name in this.sprite_array)
	{
		return {
			w: this.sprite_array[layer_id].layout_data.ow,
			h: this.sprite_array[layer_id].layout_data.oh
		};
	}
	return null;
}

//ルートごとの表示・非表示
LayoutReproduction.prototype.SetVisible = function(v)
{
	this.GetObject(LayoutReproduction.ROOT_LAYER_ID).SetVisible(v);
}
LayoutReproduction.prototype.GetVisible = function()
{
	return this.GetObject(LayoutReproduction.ROOT_LAYER_ID).GetVisible();
}
//全部にアルファをかける
LayoutReproduction.prototype.SetAlpha = function(a)
{
	if (a < 0)
	{
		a = 0;
	}
	if (a > 1)
	{
		a = 1;
	}
	this.GetObject(LayoutReproduction.ROOT_LAYER_ID).SetAlpha(a);
}

//テキストノードのテキストを変更（未発見なら何もしない）
LayoutReproduction.prototype.SetText = function(object_name_id, src_text, color)
{
	var dest_obj = null;
	if ((typeof object_name_id) == "number")
	{ //数値なら最初にPSDIDをチェック
		dest_obj = this.GetObjectByID(object_name_id);
	}
	if (dest_obj == null)
	{
		dest_obj = this.GetObject(object_name_id);
	}
	if (dest_obj != null)
	{
		if (SnlObject.prototype.isPrototypeOf(dest_obj) === true)
		{
			dest_obj.SetText(src_text);
			//色変えも可能に
			if (color != null && color != undefined)
			{
				dest_obj.ChangeTextColor(color);
			}
		}
		else
		{
			console.warn("テキストノードじゃないオブジェ名（ID)が指定されました:" + object_name_id);
		}
	}
	else
	{
		console.warn("無いノード名を指定してテキストを変更しようとしています:" + object_name_id);
	}
	return dest_obj; //一応返す
}


//-------------------------------------------------------------------------------------------------
// レイアウト基準位置を指定(0-1)
//-------------------------------------------------------------------------------------------------
LayoutReproduction.prototype.SetBaseAncPosY = function( ancY )
{
	var root = this.GetObject(LayoutReproduction.ROOT_LAYER_ID);
	
	var y = root.layout_data.base_h * ancY - SnlPixiMgr.m_Height * ancY;
	
	root.SetPos( 0, -y );
};

// レイアウトを基準位置に合わせる( reference_pos=eAnchor )
LayoutReproduction.prototype.SetReferencePos = function( reference_pos )
{
	// 文字できたらeAnchorに変換
	if( typeof reference_pos === "string" )
	{
		reference_pos = LayoutReproduction.eAnhor[reference_pos.toUpperCase()];
	}
	
	// 基準位置に算出
	var x = reference_pos.x * SnlPixiMgr.m_Width - reference_pos.x * this.GetObject(LayoutReproduction.ROOT_LAYER_ID).layout_data.base_w;
	var y = reference_pos.y * SnlPixiMgr.m_Height - reference_pos.y * this.GetObject(LayoutReproduction.ROOT_LAYER_ID).layout_data.base_h;
	
	// 基準位置に設定
	this.GetObject(LayoutReproduction.ROOT_LAYER_ID).SetPos( x, y );
};

// レイアウトの配置の自動スケール
LayoutReproduction.prototype.AutoScalingPos = function()
{
	var root = this.GetObject(LayoutReproduction.ROOT_LAYER_ID);
	var scale = 
	{
		x : root.layout_data.ow / root.layout_data.base_w,
		y : root.layout_data.oh / root.layout_data.base_h,
	};
	
	this.ScalingPos( scale );
}

// レイアウトの配置をスケーリングする
LayoutReproduction.prototype.ScalingPos = function( scale )
{
	var root = this.GetObject(LayoutReproduction.ROOT_LAYER_ID);
	LayoutReproduction.ScalingPosCore( root, scale );
}

// レイアウトの配置をスケーリングするコア処理
LayoutReproduction.ScalingPosCore = function( snl_object, scale )
{
	var x = snl_object.GetPos().x * scale.x;
	var y = snl_object.GetPos().y * scale.y;
	
	snl_object.SetPos( x, y );
	
	var idx = 0;
	while( snl_object.GetChild( idx ) != null )
	{
		LayoutReproduction.ScalingPosCore( snl_object.GetChild( idx ), scale );
		idx++;
	}
};

//レイアウトデータを持つSNLオブジェクトの子供から指定の名前を持つSNLオブジェクトを探す
LayoutReproduction.FindChildObject = function(layout_snl_object, find_name)
{
	return LayoutReproduction.FindNameData(layout_snl_object, find_name);
}

//探してさらにテキストをセットする怠慢関数
LayoutReproduction.FindChildObjectSetText = function(layout_snl_object, find_name, src_text, color)
{
	var obj = LayoutReproduction.FindNameData(layout_snl_object, find_name);
	if (obj != null && SnlObject.prototype.isPrototypeOf(obj) === true)
	{
		obj.SetText(src_text);
		if (color != null && color != undefined)
		{
			obj.ChangeTextColor(color);
		}
	}
	else
	{
		console.warn("無いノード名を指定してテキストを変更しようとしています:" + find_name);
	}
	return obj;
}

LayoutReproduction.FindNameData = function(snl_object, find_name)
{
	if (snl_object.m_Child == null)
	{
		return null;
	}

	for (var i = 0; i < snl_object.m_Child.length; i++)
	{
		var child = snl_object.m_Child[i];
		if ("layout_data" in child)
		{
			if (child.layout_data.name == find_name)
			{
				if ("btn_self" in child)
				{
					return child.btn_self;
				}
				return child;
			}
		}
		var child_result = null;
		if (child.m_Child != null && child.m_Child.length > 0)
		{
			child_result = LayoutReproduction.FindNameData(child, find_name);
		}
		if (child_result != null)
		{
			return child_result;
		}
	}
	return null;
}



//=================================================================================================
//常駐関係
//=================================================================================================

//常駐ファイル読み込み進捗
LayoutReproduction.eStepStationed =
{
	None : 0,
	Loading : 1,
	Done : 2,
}

//常駐にファイルが無いか検索
LayoutReproduction.FindStationedData = function(url)
{
	if (LayoutReproduction.BeingStationedLayoutData == null)
	{
		return null;
	}

	for (var i = 0; i < LayoutReproduction.BeingStationedLayoutData.length; i++)
	{
		var data = LayoutReproduction.BeingStationedLayoutData[i];
		if (data.file.indexOf(url) == 0 && data.data != null)
		{
			return UiUtility.CopyObject(data.data);
		}
	}
	return null;
}

//常駐するレイアウトデータを読み込む
LayoutReproduction.LoadStaticData = function(file_array, layout_version)
{
	if( typeof layout_version != "undefined" )
	{
		if( layout_version != null )
		{
			for (var i = 0; i < file_array.length; i++)
			{
				file_array[i] = file_array[i] + "?v=" +layout_version;
			}
		}
	}
	
	
	
	for (var i = 0; i < file_array.length; i++)
	{
		LayoutReproduction.AdStationedData(file_array[i]);
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
		for( var i=0; i<file_array.length && i<MaxConnections; i++ )
		{
			//ロード開始
			LayoutReproduction.LoadStationedData();
		}
	},10 );
}

//常駐ファイル名から常駐データインデックスを取得
LayoutReproduction.StationedFileNameToIndex = function( file )
{
	if (LayoutReproduction.BeingStationedLayoutData == null || Array.isArray(LayoutReproduction.BeingStationedLayoutData) == false)
	{
		return -1;
	}
	
	for( var i=0; i<LayoutReproduction.BeingStationedLayoutData.length; i++ )
	{
		if( LayoutReproduction.BeingStationedLayoutData[i].file == file )
		{
			return i;
		}
	}
	
	return -1;
}

// 読み込み完了常駐ファイル数を取得
LayoutReproduction.GetStationedDataLoadedNum = function()
{
	if (LayoutReproduction.BeingStationedLayoutData == null || Array.isArray(LayoutReproduction.BeingStationedLayoutData) == false)
	{
		return 0;
	}
	
	var c = 0;
	
	for( var i=0; i<LayoutReproduction.BeingStationedLayoutData.length; i++ )
	{
		if( LayoutReproduction.BeingStationedLayoutData[i].step == LayoutReproduction.eStepStationed.Done )
		{
			c++;
		}
	}
	
	return c;
}

// 常駐ファイルデータを追加して読み込み
LayoutReproduction.AdStationedData = function(file)
{
	if (LayoutReproduction.BeingStationedLayoutData == null || Array.isArray(LayoutReproduction.BeingStationedLayoutData) == false)
	{
		LayoutReproduction.BeingStationedLayoutData = [];
	}

	var data = {
		"file": file,
		data: null,
		step: LayoutReproduction.eStepStationed.None
	};
	LayoutReproduction.BeingStationedLayoutData.push(data);
}

//常駐ファイルデータにレイアウトを追加
LayoutReproduction.AdStationedDataDirect = function(file,layout_data)
{
	if (LayoutReproduction.BeingStationedLayoutData == null || Array.isArray(LayoutReproduction.BeingStationedLayoutData) == false)
	{
		LayoutReproduction.BeingStationedLayoutData = [];
	}

	var data = {
		"file": file,
		"data": layout_data,
		step : LayoutReproduction.eStepStationed.Done
	};
	LayoutReproduction.BeingStationedLayoutData.push(data);
}

// 常駐データの未読み込みデータを検索してロード
LayoutReproduction.LoadStationedData = function()
{
	for( var i=0; i<LayoutReproduction.BeingStationedLayoutData.length; i++ )
	{
		if( LayoutReproduction.BeingStationedLayoutData[i].step == LayoutReproduction.eStepStationed.None )
		{
			LayoutReproduction.LoadStationedDataCore( i );
			return;
		}
	}
	
}

// 常駐データの読み込みのコア
LayoutReproduction.LoadStationedDataCore = function( Idx )
{
	var loader = new LayoutReproduction();
	
	LayoutReproduction.BeingStationedLayoutData[Idx].step = LayoutReproduction.eStepStationed.Loading;
	
	var file_data = LayoutReproduction.BeingStationedLayoutData[Idx];
	loader.GetOneStageDataRequest(file_data.file, LayoutReproduction.OnLoadStationedData);
}

//常駐用のロードコールバック
LayoutReproduction.OnLoadStationedData = function(layout_data)
{
	var Idx = LayoutReproduction.StationedFileNameToIndex( layout_data.load_file );
	
	//読み込み終わり//展開したレイアウトデータだけコピーしておく
	LayoutReproduction.BeingStationedLayoutData[Idx].data = Object.assign( {}, layout_data.layout_data);
	LayoutReproduction.BeingStationedLayoutData[Idx].step = LayoutReproduction.eStepStationed.Done;
	
	// 次のファイルを読み込み
	LayoutReproduction.LoadStationedData();
}

//常駐読み込みおわった？
LayoutReproduction.IsStationedDataLoadComplete = function()
{
	if (LayoutReproduction.BeingStationedLayoutData == null)
	{
		return true;
	}
	else
	{
		if (LayoutReproduction.BeingStationedLayoutData.length <= LayoutReproduction.GetStationedDataLoadedNum() )
		{
			return true;
		}
	}
	return false;
}

//常駐読み込み進行率
LayoutReproduction.StationedDataLoadRate = function()
{
	if (LayoutReproduction.BeingStationedLayoutData == null)
	{
		return 1;
	}
	else
	{
		if (LayoutReproduction.BeingStationedLayoutData.length <= LayoutReproduction.GetStationedDataLoadedNum() )
		{
			return 1;
		}
	}
	
	return LayoutReproduction.GetStationedDataLoadedNum() / LayoutReproduction.BeingStationedLayoutData.length;
}
