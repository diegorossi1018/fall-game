/**
 * @file 	LayoutUtil.js
 * @brief 	レイアウト周りのユーティリティ関数群
 */
var LayoutUtil = function() {}

//ヘッダーとフッター以外のスケール（チャットも除く）
LayoutUtil.DefaultUIScale = 0.69;

//ヘッダーのPCスケール
LayoutUtil.HeaderPcScale = 0.76; //DefaultUIScale同じが望ましい
//フッターのPCスケール
LayoutUtil.FooterPcScale = 0.76; //DefaultUIScale同じが望ましい

//それ以外（チャットは除く）レイアウトにかかるスケール
LayoutUtil.GetDefaultScale = function()
{
	return 1; //SP時のスケール
}


LayoutUtil.LineCounter = function(str)
{
    return str.split("\r").length;
}

//テキストボックスを作る
LayoutUtil.CreateNumInputForParent = function(input_node, font_color, font_size, num_min, num_max)
{
	var number_input = UiUtility.CreateTextBox(input_node, SnlMath.Digit(num_max), "", num_min, "number", font_size);
	number_input.ChangeCss("color", font_color);
	number_input.SetMinMax(num_min, num_max);
	number_input.SetStep(1);
	return number_input;
};

LayoutUtil.CreateNumInput = function(layout, parent_name, font_color, font_size, num_min, num_max)
{
	var input_node = layout.GetObject(parent_name);
	return LayoutUtil.CreateNumInputForParent(input_node, font_color, font_size, num_min, num_max);
}

//#色をr,g,bにパース
LayoutUtil.parseColor = function(str_color)
{
	var l = str_color.length,
		r = 0,
		g = 0,
		b = 0;
	if (l === 7)
	{
		r = parseInt(str_color.slice(1, 3), 16);
		g = parseInt(str_color.slice(3, 5), 16);
		b = parseInt(str_color.slice(5, 7), 16);
	}
	else if (l === 4)
	{
		var rr = str_color.slice(1, 2),
			gg = str_color.slice(2, 3),
			bb = str_color.slice(3, 4);
		r = parseInt(rr + rr, 16);
		g = parseInt(gg + gg, 16);
		b = parseInt(bb + bb, 16);
	}

	if (isNaN(r) || isNaN(g) || isNaN(b))
	{
		r = g = b = 0;
	}

	var color = {};
	//0~255
	color.decimal = {
		r: r,
		g: g,
		b: b
	};
	//0.0~1.0
	color.real = {
		r: parseFloat(r) / 255,
		g: parseFloat(g) / 255,
		b: parseFloat(b) / 255
	};
	//0~255配列
	color.array = [r, g, b];
	return color;
}

//テキストについているドロップシャドウとアウトラインを消す
LayoutUtil.ClearTextEffect = function(text_obj)
{
	text_obj.ChangeTextStyle("dropShadow", false);
	text_obj.ChangeTextStyle("strokeThickness", 0);
	text_obj.FlashTextStyle();
}

// _LayoutUtility = new LayoutUtil();

//////////////////////////////////////////////////////////////////////////////////////////トグル管理
LayoutUtil.ToggleGroup = function(is_all_off)
{
	this.all_off = is_all_off; //全部OFFにできるかフラグ
	this.toggle_array = [];
}

LayoutUtil.ToggleGroup.prototype.Set = function(index, toggle_obj)
{
	this.toggle_array[index] = toggle_obj;
}

LayoutUtil.ToggleGroup.prototype.Add = function(toggle_obj)
{
	this.toggle_array.push(toggle_obj);
}

LayoutUtil.ToggleGroup.prototype.Destroy = function()
{
	this.toggle_array = null;
}

LayoutUtil.ToggleGroup.prototype.SetOn = function(on_index)
{
	if (this.toggle_array[on_index] != null)
	{
		this.toggle_array[on_index].SetToggle(true, true);
		this.Update(on_index);
	}
}

LayoutUtil.ToggleGroup.prototype.AllOff = function()
{
	for (var i = 0; i < this.toggle_array.length; i++)
	{
		if (this.toggle_array[i] != null)
		{
			this.toggle_array[i].SetToggle(false, true);
			this.toggle_array[i].SetDisable(false, false);
		}
	}
}

LayoutUtil.ToggleGroup.prototype.Update = function(on_index)
{
	var all_false = false;
	if (this.all_off == true && this.toggle_array[on_index] != null && this.toggle_array[on_index].isToggleON() == false)
	{
		all_false = true;
	}

	for (var i = 0; i < this.toggle_array.length; i++)
	{
		if (this.toggle_array[i] == null)
		{
			continue;
		}

		if (this.all_off == true)
		{
			if (all_false == false && i == on_index) continue;
			this.toggle_array[i].SetToggle(false, true);
			this.toggle_array[i].SetDisable(false);
		}
		else
		{
			if (i == on_index)
			{
				this.toggle_array[i].SetDisable(true, false);
				continue;
			}
			this.toggle_array[i].SetToggle(false, true);
			this.toggle_array[i].SetDisable(false);
		}
	}

	return all_false == true ? -1 : on_index;
}



