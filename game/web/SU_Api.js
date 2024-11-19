/**
 * @file 	SU_Api.js
 * @brief	広告とYahoo!Apiを制御するためのSUCCESSゲーム用API関数群(自社用)
 * @author	H.Narita
 * @date	2016/02/16
 * @update	2016/09/26
 */


if (!window.suapi) {	//SU_Apiファイルの多重読み込み阻止を全体に{}
	window.suapi = true;

	var SU_Api = function () {
		//SU_Apiクラスの多重生成阻止
		if (SU_Api.m_InitCheck) {
			return;
		}

		//新バージョンに対応済みなものだけtrue
		arguments.callee.m_isReady = false;
		//if(window.snd_game_id == 6){
		SU_Api.m_isReady = true;
		//}

		arguments.callee.m_ServiceProvider = "SU";												//今回の環境(YGP:yahoo DSG:スゴ得 SU:自社 NON:未指定)
		arguments.callee.m_Version = 2.20;														//APIのバージョン
		arguments.callee.m_AdSkip = null;														//null/false:広告表示,"console","alert"," "
		arguments.callee.m_SND_GAME_ID = window.snd_game_id;									//ゲーム番号
		arguments.callee.m_GAME_ID = window.game_id;											//ゲームID
		arguments.callee.m_GAME_NAME = window.game_name;								//ゲーム名
		arguments.callee.m_IP = window.ipADDR;														//IPアドレス(GameMain.phpで設定)
		arguments.callee.m_DEVICE = window.device;													//接続デバイス(GameMain.phpで設定)
		arguments.callee.m_BasePath = "";

		//	arguments.callee.m_LOGIN_URL = "../../../user/auth/flash/?gid="+SU_Api.m_SND_GAME_ID;
		arguments.callee.m_LOGIN_URL = "../../../user/auth/flash/";
		arguments.callee.m_REGISTER_URL = "../../../user/register/pre";
		arguments.callee.m_REWARD_URL = "../../../user/mypage/acquisition";
		if (window.isTestServer == 1) //テスト専用
		{
			SU_Api.m_LOGIN_URL = "../../../public/user/auth/flash/";
			SU_Api.m_REGISTER_URL = "../../../public/user/register/pre";
			SU_Api.m_REWARD_URL = "../../../public/user/mypage/acquisition";
		}

		//ランキングの存在しないゲームIDを配列化しておく
		arguments.callee.m_NoneRanking = [21, 22, 24];

		// サウンドランキング
		SU_Api.isSoundRanking = window.isSoundRanking;

		arguments.callee.m_InitCheck = false;		//多重生成確認
		arguments.callee.m_isLogin = false;			//ログイン確認(true=LOGIN,false=NON)

		arguments.callee.m_AsyncMode = true;		//DBとの通信方法(trueは非同期(標準))

		//ゲームの窓 SUCCESS公式サイト用に追加
		arguments.callee.m_DOMAIN = document.domain;													//これのドメイン取得
		arguments.callee.m_REFERRER = document.referrer;												//親元のドメイン取得

		arguments.callee.m_isSUCCESS_HP = false;												//サクセスHPで表示される場合はtrue
		if (SU_Api.m_REFERRER == "https://develop.success-corp.co.jp/" ||
			SU_Api.m_REFERRER == "https://www.success-corp.co.jp/") {
			SU_Api.m_isSUCCESS_HP = true;
		}

		// XMLHttpRequest APIコンテキスト
		//arguments.callee.m_Context = null;
		//arguments.callee.m_Context2 = null;	//同期(false)用

		//通信レスポンス状況
		arguments.callee.m_ResponseFlag = false;	//true:通信中

		//ディスプレイ広告のスロット番号
		arguments.callee.m_DisplayAdsSlot = window.dispSlot;

		//ディスプレイ広告を時間で閉じるまでのカウンタ
		arguments.callee.m_DispStamp = Math.floor(new Date().getTime() / 1000);	//15s * 60frame
		//ディスプレイ広告を更新リクエスト回数
		arguments.callee.m_RequestDispAd = 0;

		//サイドメニューONOFF
		arguments.callee.m_SideMenuSwitch = 0;

		window.ads_callback_success = null;
		window.ads_callback_error = null;

		/*
		if( window.innerWidth > window.innerHeight )
		{
			if( document.getElementById('warning_port') )
			{
				document.getElementById('warning_port').style.display='block';
			}
		}*/

		//ストレージが使用可能か(エラーの場合プライベートブラウズの可能性)
		try {
			window.sessionStorage.setItem('key', 1);
		}
		catch (error) {
			alert("webStorage_error");
			alert("プライベートブラウズモードが設定されている場合は正常にゲームが動作しない可能性があります");
		}

		// 横持ち判定を行うか？
		arguments.callee.m_PortraitCheckOnUpdate = true;

		//横持ちに対する対応
		arguments.callee.PortraitCheck = function () {
			//PCの時は横持ち関係なし
			if (SU_Api.m_DEVICE == "pc") {
				return;
			}

			// 横持ち判定を止めているタイミングでは判定しないし表示も出さない
			if (!SU_Api.m_PortraitCheckOnUpdate) {
				document.getElementById('warning_port').style.display = 'none';
				return;
			}

			//動画広告の為の横サイズなら無視
			if (document.getElementById('adContainer')) {
				if (document.getElementById('adContainer').style.display != 'none') {
					return;
				}
			}

			/*/名画鑑定用。?
			//横幅の方が長いゲームでは横もち警告を出さない
			if( Number(window.game_sizeX) > Number(window.game_sizeY) )
			{
				console.log("ON");
				return;
			}
			*/

			if (document.getElementById('warning_port')) {
				if (window.innerWidth > window.innerHeight) {
					document.getElementById('warning_port').style.display = 'block';
				}
				else {
					document.getElementById('warning_port').style.display = 'none';
				}
			}

		};

		//起動時に1度だけ呼び出す処理: 初期設定
		arguments.callee.Init = function () {
			//生成
			//SU_Api.m_Context = new XMLHttpRequest();
			//SU_Api.m_Context2 = new XMLHttpRequest();

			//SU_Apiの多重生成阻止
			if (SU_Api.m_InitCheck) {
				return;
			}
			SU_Api.m_InitCheck = true;

			SU_Api.m_isLogin = false;

			//デバッグ用
			var mozi = parent.location.href;
			var sugotoku = mozi.indexOf("https://sugotoku");
			var version = mozi.indexOf("?s");
			console.log(sugotoku + "/" + version);
			if (-1 != sugotoku && -1 != version) {
				SU_Api.m_AdSkip = "console";
			}


			//横持ちに対する対応
			SU_Api.PortraitCheck();

			//ゲームタブ生成
			if (document.getElementById("game_tab")) SU_Api.CreateGameTab();
			if (document.getElementById("menu")) SU_Api.CreateMenuTab();
			SU_Api.CreateLoadIcon();

			//ディスプレイ広告のスロット番号
			SU_Api.m_DisplayAdsSlot = window.dispSlot;

			//サイドメニュー関連
			if (document.getElementById("menubutton")) {
				//サイドメニューON/OFF
				document.getElementById('menubutton').addEventListener("click", function () {
					if (SU_Api.m_isReady) {
						if (document.getElementById('menutab').style.display == "none") {
							document.getElementById('menutab').style.display = "block";
							document.getElementById('menubutton').style.marginLeft = "280px";
							document.getElementById("menuballoon").style.display = "none";
						}
						else {
							document.getElementById('menutab').style.display = "none";
							document.getElementById('menubutton').style.marginLeft = "0px";
						}
					} else {
						window.open("../../", "_blank");
					}
				});

				//マウスオーバー/マウスアウト時のボタンオーバーレイ加工
				document.getElementById('menubutton').addEventListener("mouseover", function () {
					document.getElementById('menubutton').src = "../web/img/but_menu_over.png";
				});
				document.getElementById('menubutton').addEventListener("mouseout", function () {
					document.getElementById('menubutton').src = "../web/img/but_menu.png";
				});

			}


			//広告を閉じる
			if (document.getElementById("display_button")) {
				document.getElementById("display_button").addEventListener("click", function (e) {
					document.getElementById('nontouch').style.visibility = 'hidden';
					document.getElementById("display_button").style.visibility = "hidden";
					document.getElementById("display_ad").style.display = "none";

					//リワード広告の場合、報酬を渡す
					if (window.ads_callback_success != null) window.ads_callback_success();
					window.ads_callback_success = null;
					window.ads_callback_error = null;
				});
			}

			//画面比率によってはスマホ下広告を出さない
			if (document.getElementById("bottom_ad")) {
				//console.log("W:"+window.innerWidth+"  H:"+window.innerHeight+"  ="+window.innerWidth/window.innerHeight )
				if (window.innerWidth / window.innerHeight >= 0.72) {
					document.getElementById("bottom_ad").style.display = "none";
				}
			}

			//画面下広告を全部非表示
			// document.getElementById("bottom_ad").style.display = "none";


			//AdBlockに対する対応
			SU_Api.checkAbBlock();

			//横画面の時のタッチ操作無効
			function TouchEventFunc(e) {
				e.preventDefault();
			}
			//document.getElementById('game_tab').addEventListener("touchstart",TouchEventFunc);
			document.getElementById('warning_port').addEventListener("touchstart", TouchEventFunc);
			document.getElementById('warning_port').addEventListener("touchmove", TouchEventFunc);
			document.getElementById('warning_port').addEventListener("touchend", TouchEventFunc);

			//操作無効判定エリアを適当に追加
			var game_invalid = document.createElement("div");
			game_invalid.id = "game_invalid";
			game_invalid.style.display = "none";
			document.body.appendChild(game_invalid);
			
			// 説明動画の設定
			if( SU_Api.EnableHowToMovie )
			{
				//クラス名js-modal-videoがあれば以下を実行
				if ($(".js-modal-video").length) 
				{ 
					$(".js-modal-video").modalVideo({
				    	channel: "youtube",
				    	youtube: 
				    	{
				      		rel: 0, //関連動画の指定
				      		autoplay: 1, //自動再生の指定
				    	},
					});
				}
			}
		};

		//動的にdiv生成
		arguments.callee.checkAbBlock = function () {
			if (!SU_Api.m_isReady) return;

			// AdBlockが検出されなかった場合
			function adBlockNotDetected() {
				//alert('AdBlockは無効です');
			}
			// AdBlockが検出された場合
			function adBlockDetected() {
				var tab_bg = document.createElement("img");
				tab_bg.id = "warning_adblock_img";
				tab_bg.src = "../web/img/adblock_bg.png";
				tab_bg.style.width = "300px";
				tab_bg.style.height = "380px";
				tab_bg.style.zIndex = "99998";
				tab_bg.style.position = "absolute";
				tab_bg.style.margin = "auto";
				tab_bg.style.left = "0";
				tab_bg.style.right = "0";
				tab_bg.style.top = "50px";
				var tab_btn = document.createElement("img");
				tab_btn.style.zIndex = "99998";
				tab_btn.id = "warning_adblock_btn";
				tab_btn.src = "../web/img/adblock_button_on.png";
				tab_btn.style.width = "180px";
				tab_btn.style.height = "60px";
				tab_btn.style.zIndex = "99998";
				tab_btn.style.position = "absolute";
				tab_btn.style.margin = "auto";
				tab_btn.style.left = "0";
				tab_btn.style.right = "0";
				tab_btn.style.top = "350px";
				document.getElementById("warning_adblock").appendChild(tab_bg);
				document.getElementById("warning_adblock").appendChild(tab_btn);

				document.getElementById("warning_adblock_btn").onclick = function (e) {
					window.location = "";
				};
			}

			//判定
			if (typeof blockAdBlock === 'undefined') {
				adBlockDetected();
			} else {
				blockAdBlock.onDetected(adBlockDetected);
				blockAdBlock.onNotDetected(adBlockNotDetected);
			}

		};

		//動的にdiv生成
		arguments.callee.CreateGameTab = function () {
			//画面サイズ
			var monitorX = 480;
			var monitorY = 600;
			if (SU_Api.m_DEVICE != "pc") {
				monitorX = window.innerWidth;
				monitorY = window.innerHeight;
				if (document.getElementById("warning_port").style.display != "none") {
					monitorX = window.innerWidth;
					monitorY = window.innerHeight;
				}
			}

			var game_tab = document.getElementById("game_tab");
			game_tab.style.backgroundColor = "rgba(0, 0, 0, .2)";
			game_tab.style.position = "absolute";
			game_tab.style.top = "0";
			game_tab.style.right = "0";
			game_tab.style.left = "0";
			game_tab.style.bottom = "0";
			game_tab.style.fontFamily = 'メイリオ, Meiryo, "ＭＳ Ｐゴシック", "ヒラギノ角ゴ Pro W3", "Hiragino Kaku Gothic ProN", sans-serif, "Open Sans", "Helvetica Neue", Helvetica, Arial, Roboto, "Droid Sans", 游ゴシック, YuGothic';
			game_tab.style.zIndex = "99998";

			//背景
			var tab_bg = document.createElement("div");
			tab_bg.id = "game_tab_bg";
			tab_bg.style.backgroundColor = "#FFF";
			tab_bg.style.width = "280px";
			tab_bg.style.height = SU_Api.isSoundRanking ? "466px" : "320px";
			tab_bg.style.zIndex = "99997";
			tab_bg.style.position = "absolute";
			tab_bg.style.margin = (SU_Api.isSoundRanking ? "20px " : "50px ") + ((monitorX - 280) / 2) + "px";
			tab_bg.style.outlineWidth = "1px";
			tab_bg.style.outlineColor = "rgba(0, 0, 0, .4)";
			tab_bg.style.outlineStyle = "solid";

			//ヘッダ
			var tab_header = document.createElement("div");
			tab_header.innerHTML = '<img src="../../assets/img/thumbnail/basic/' + SU_Api.m_GAME_ID + '.png" alt="" ' +
				'style="width:50px; height:50px; position:absolute;" />' +
				'<div style="line-height: 50px; margin-left: 60px; font-size: 14px; overflow: hidden;">' + SU_Api.m_GAME_NAME + '</div>';
			tab_header.id = "game_tab_header";
			tab_header.style.backgroundColor = "#DDD";
			tab_header.style.width = "280px";
			tab_header.style.height = "50px";
			tab_header.style.position = "relative";
			tab_header.style.margin = "0";

			//続けるボタン
			var tab_next = document.createElement("div");
			tab_next.innerHTML = '<p style="line-height: 40px; margin: 0; text-align: center; color:#FFF;">ゲームを続ける</p>';
			tab_next.id = "game_tab_next";
			tab_next.style.backgroundColor = "#00a2f2";
			tab_next.style.borderRadius = "6px";
			tab_next.style.width = "200px";
			tab_next.style.height = "40px";
			tab_next.style.margin = "10px auto 0";
			tab_next.style.cursor = "pointer";

			var tab_sound_good = document.createElement("div");
			tab_sound_good.id = "game_sound_good";
			tab_sound_good.style.width = "240px";
			tab_sound_good.style.height = "136px";
			tab_sound_good.style.border = "2px solid red";
			tab_sound_good.style.borderRadius = "6px";
			tab_sound_good.style.margin = "10px auto 0";
			tab_sound_good.style.boxSizing = "border-box";
			if (!SU_Api.isSoundRanking) {
				tab_sound_good.style.display = "none";
			}

			var sound_good_text = document.createElement("p");
			sound_good_text.style.textAlign = "center";
			sound_good_text.style.fontSize = "12px";
			sound_good_text.style.margin = "7px 0";
			sound_good_text.style.lineHeight = "18px";
			sound_good_text.innerHTML = "ゲームの窓に会員登録して<br>ゲームにチャレンジし、<br>気に入ったBGMに<br>『イイネ！』しよう！";

			var sound_good_button = document.createElement("button");
			sound_good_button.style.width = "40px";
			sound_good_button.style.height = "40px";
			sound_good_button.style.background = "none";
			sound_good_button.style.border = "none";
			sound_good_button.style.padding = "0";
			sound_good_button.style.margin = "0 auto";
			sound_good_button.style.display = "block";

			var button_img = document.createElement("img");
			button_img.src = "../web/img/goodsound_nologin.png";

			button_img.style.width = "100%";
			button_img.style.height = "100%";
			button_img.style.cursor = "initial";
			sound_good_button.appendChild(button_img);

			tab_sound_good.appendChild(sound_good_text);
			tab_sound_good.appendChild(sound_good_button);

			//ログインボタン
			var tab_login = document.createElement("a");
			tab_login.innerHTML = '<p style="line-height: 40px; margin: 0; text-align: center; color:#FFF;">LOGIN</p>';
			tab_login.id = "game_tab_login";
			tab_login.style.textDecoration = "none";
			tab_login.style.backgroundColor = "#F00";
			tab_login.style.borderRadius = "6px";
			tab_login.style.width = "120px";
			tab_login.style.height = "40px";
			tab_login.style.margin = "10px auto 0";
			tab_login.style.cursor = "pointer";
			tab_login.style.display = "block";

			//Create Account?
			var tab_account = document.createElement("a");
			tab_account.innerHTML = 'まだ会員登録がお済みでない場合はこちらから';
			tab_account.href = SU_Api.m_REGISTER_URL;
			tab_account.target = "_blank";
			tab_account.id = "game_tab_account";
			tab_account.style.marginTop = "5px";
			tab_account.style.textAlign = "center";
			tab_account.style.fontSize = ".6rem";
			tab_account.style.color = "#f03";
			tab_account.style.display = "block";
			tab_account.style.textDecoration = "underline";

			//今週のハイスコア
			var tab_hiscore = document.createElement("div");
			//	tab_hiscore.innerHTML = "SCORE:";
			tab_hiscore.id = "game_tab_hiscore";
			tab_hiscore.style.backgroundColor = "#EEE";
			tab_hiscore.style.boxSizing = "border-box";
			tab_hiscore.style.width = "220px";
			tab_hiscore.style.height = "100px";
			tab_hiscore.style.padding = "8px 10px";
			tab_hiscore.style.margin = "10px auto 0";

			//今回のSCORE:
			var hiscore_this = document.createElement("div");
			hiscore_this.id = "game_tab_hiscore_this";
			hiscore_this.innerHTML = "今回のスコア:";
			hiscore_this.style.left = "0px";
			hiscore_this.style.top = "0px";
			hiscore_this.style.fontSize = "13px";//"10pt";
			hiscore_this.style.lineHeight = "20px";

			//(スコア数値)
			var hiscore_score = document.createElement("div");
			hiscore_score.id = "game_tab_hiscore_score";
			hiscore_score.innerHTML = "114514";
			hiscore_score.style.textAlign = "center";
			hiscore_score.style.fontSize = "32px";//"24pt";
			hiscore_score.style.lineHeight = "48px";
			hiscore_score.style.color = "#d86";

			//今週のハイスコア / 今週の合計スコア
			var hiscore_total = document.createElement("div");
			hiscore_total.id = "game_tab_hiscore_total";
			hiscore_total.innerHTML = "今週の合計スコア: 1919810";
			hiscore_total.style.bottom = "0px";
			hiscore_total.style.textAlign = "right";
			hiscore_total.style.fontSize = "10.5px";//8pt";
			hiscore_total.style.lineHeight = "16px";

			//Twitterボタン
			var tab_twitter = document.createElement("div");
			tab_twitter.id = "game_tab_twitter";
			tab_twitter.style.position = "absolute";
			tab_twitter.style.bottom = "11px";
			tab_twitter.style.right = "40px";
			tab_twitter.style.height = "20px";

			//半透明背景
			var tab_black_bg = document.createElement("div");
			tab_black_bg.id = "game_tab_black_bg";
			tab_black_bg.style.backgroundColor = "#000";
			tab_black_bg.style.opacity = "0.8";
			tab_black_bg.style.width = monitorX + "px";
			tab_black_bg.style.height = monitorY + "px";
			tab_black_bg.style.position = "absolute";
			tab_black_bg.style.display = "none";

			//報酬背景
			var tab_reward_bg = document.createElement("div");
			tab_reward_bg.id = "game_tab_reward_bg";
			tab_reward_bg.style.backgroundColor = "#FFF";
			tab_reward_bg.style.borderRadius = "8px";
			tab_reward_bg.style.width = "290px";
			tab_reward_bg.style.height = "100px";
			tab_reward_bg.style.position = "absolute";
			tab_reward_bg.style.margin = "150px " + ((monitorX - 290) / 2) + "px";
			tab_reward_bg.style.display = "none";

			//報酬文章(新しい報酬を獲得しました！)
			var tab_reward_msg = document.createElement("div");
			tab_reward_msg.id = "game_tab_hiscore_this";
			tab_reward_msg.innerHTML = "新しい報酬を獲得しました！";
			tab_reward_msg.style.position = "absolute";
			tab_reward_msg.style.width = "inherit";
			tab_reward_msg.style.top = "15px";
			tab_reward_msg.style.textAlign = "center";
			tab_reward_msg.style.fontSize = "14pt";


			//報酬ボタン（確認）
			var tab_reward_btnCheck = document.createElement("div");
			tab_reward_btnCheck.innerHTML = '<p style="line-height: 12px; text-align: center; color:#FFF;">報酬確認</p>';
			tab_reward_btnCheck.id = "game_tab_reward_btnCheck";
			tab_reward_btnCheck.style.backgroundColor = "#00a2f2";
			tab_reward_btnCheck.style.borderRadius = "6px";
			tab_reward_btnCheck.style.width = "80px";
			tab_reward_btnCheck.style.height = "40px";
			tab_reward_btnCheck.style.position = "absolute";
			tab_reward_btnCheck.style.margin = "50px 40px";
			tab_reward_btnCheck.style.cursor = "pointer";

			//報酬ボタン（OK）
			var tab_reward_btnOK = document.createElement("div");
			tab_reward_btnOK.innerHTML = '<p style="line-height: 12px; text-align: center; color:#FFF;">OK</p>';
			tab_reward_btnOK.id = "game_tab_reward_btnOK";
			tab_reward_btnOK.style.backgroundColor = "#00a2f2";
			tab_reward_btnOK.style.borderRadius = "6px";
			tab_reward_btnOK.style.width = "80px";
			tab_reward_btnOK.style.height = "40px";
			tab_reward_btnOK.style.position = "absolute";
			tab_reward_btnOK.style.margin = "50px 160px";
			tab_reward_btnOK.style.cursor = "pointer";

			//htmlに動的生成
			var game_Tab = document.getElementById("game_tab");
			game_Tab.appendChild(tab_bg);
			tab_bg.appendChild(tab_header);
			tab_bg.appendChild(tab_next);
			tab_bg.appendChild(tab_sound_good);
			tab_bg.appendChild(tab_login);
			tab_bg.appendChild(tab_account);
			tab_bg.appendChild(tab_hiscore);
			tab_bg.appendChild(tab_twitter);

			tab_hiscore.appendChild(hiscore_this);
			tab_hiscore.appendChild(hiscore_score);
			tab_hiscore.appendChild(hiscore_total);

			game_Tab.appendChild(tab_black_bg);
			game_Tab.appendChild(tab_reward_bg);
			tab_reward_bg.appendChild(tab_reward_msg);
			tab_reward_bg.appendChild(tab_reward_btnCheck);
			tab_reward_bg.appendChild(tab_reward_btnOK);

			//tab画面を隠す
			document.getElementById("game_tab").style.display = "none";

			//イベントリスナを設定
			document.getElementById("game_tab_next").addEventListener("click", function (e) {
				document.getElementById("game_tab").style.display = "none";
			});

			//	document.getElementById("game_tab_login").onclick = function(e){
			//		window.open(SU_Api.m_LOGIN_URL,"_blank","width=1000,height=800");
			//	};

			document.getElementById("game_tab_login").href = SU_Api.m_LOGIN_URL;
			document.getElementById("game_tab_login").target = "testwindow";
			document.getElementById("game_tab_login").onclick = function (e) {
				window.open('../../', 'testwindow', "width=1000,height=800");
			};

			document.getElementById("game_tab_reward_btnCheck").onclick = function (e) {
				window.open(SU_Api.m_REWARD_URL, "newtab", "width=1000,height=800");
			};

			document.getElementById("game_tab_reward_btnOK").onclick = function (e) {
				document.getElementById("game_tab_black_bg").style.display = "none";
				document.getElementById("game_tab_reward_bg").style.display = "none";
			};
		};

		//メニュー関連
		arguments.callee.CreateMenuTab = function () {
			if (!SU_Api.m_isReady) return;
			if ("pc" == SU_Api.m_DEVICE) return;

			//メニュータブ
			var menu_tab = document.createElement("div");
			menu_tab.id = "menutab";
			menu_tab.style.backgroundColor = "#43372d";
			menu_tab.style.width = "280px";
			menu_tab.style.height = window.innerHeight + "px";
			if (document.getElementById("warning_port").style.display != "none") {
				menu_tab.style.height = window.innerWidth + "px";
			}
			menu_tab.style.position = "absolute";
			menu_tab.style.margin = "0px";
			menu_tab.style.display = "none";

			//メニューボタン
			var menu_button = document.createElement("img");
			menu_button.id = "menubutton";
			menu_button.src = "../web/img/but_menu.png";
			menu_button.style.width = "50px";
			menu_button.style.height = "50px";
			menu_button.style.position = "absolute";
			menu_button.style.zIndex = "90000";
			menu_button.style.margin = "0px";
			menu_button.style.cursor = "pointer";

			var is_balloon_halfover = window.menuItem.position >= (window.game_sizeY / 2);

			var menu_balloon = document.createElement("img");
			menu_balloon.id = "menuballoon";
			menu_balloon.src = is_balloon_halfover ? "../web/img/but_fukidashi_2.png" : "../web/img/but_fukidashi_1.png";
			menu_balloon.style.width = "110px";
			menu_balloon.style.height = "110px";
			menu_balloon.style.position = "absolute";
			menu_balloon.style.display = window.howtoplay ? "block" : "none";
			menu_balloon.style.zIndex = "90000";
                        menu_balloon.style.animation = "blinking 1s infinite";
                        setInterval(function () {
                            menu_balloon.style.display = "none";
                        }, 5000);

			//htmlに動的生成
			var menu = document.getElementById("menu");
			menu.appendChild(menu_tab);
			menu.appendChild(menu_button);
			menu.appendChild(menu_balloon);


			//メニューtitle
			var menu_title = document.createElement("div");
			menu_title.id = "menutitle";
			menu_title.style.textAlign = "center";
			menu_title.style.margin = "10px";
			menu_title.innerHTML = "<img src='../web/img/but_title_menu.png' style='width:100px;height:30px;'>";

			//メニューtop
			var menu_top = document.createElement("div");
			menu_top.id = "menutop";
			menu_top.style.textAlign = "center";
			menu_top.style.margin = "10px";
			menu_top.style.cursor = "pointer";
			menu_top.innerHTML = "<img src='../web/img/but_03.png' style='width:250px;height:50px;'>";

			//メニューranking
			var menu_ranking = document.createElement("div");
			menu_ranking.id = "menuranking";
			menu_ranking.style.textAlign = "center";
			menu_ranking.style.margin = "10px";
			menu_ranking.style.cursor = "pointer";
			menu_ranking.innerHTML = "<img src='../web/img/but_02.png' style='width:250px;height:50px;'>";

			// 
			var menu_video = document.createElement("div");
			menu_video.id = "menuvideo";
			menu_video.style.textAlign = "center";
			menu_video.style.margin = "10px";
			menu_video.style.cursor = "pointer";
			menu_video.style.display = window.howtoplay ? "block" : "none";
			menu_video.innerHTML = "<img src='../web/img/btn_takuwan.png' style='width:250px;height:50px;'>";

			//メニューclose
			var menu_close = document.createElement("div");
			menu_close.id = "menuclose";
			menu_close.style.textAlign = "center";
			menu_close.style.margin = "10px";
			menu_close.style.cursor = "pointer";
			menu_close.innerHTML = "<img src='../web/img/but_05.png' style='width:250px;height:50px;'>";

			//メニューlogin
			var menu_login = document.createElement("div");
			menu_login.id = "menulogin";
			menu_login.style.textAlign = "center";
			menu_login.style.margin = "10px";
			menu_login.style.cursor = "pointer";
			menu_login.innerHTML = "<img src='../web/img/but_04.png' style='width:250px;height:50px;'>";

			//htmlに動的生成
			var menutab = document.getElementById("menutab");
			menutab.appendChild(menu_title);
			menutab.appendChild(menu_top);
			menutab.appendChild(menu_ranking);
			menutab.appendChild(menu_video);
			menu_video.addEventListener("click", function () {
				var anchor = document.createElement("a");
				anchor.target = "_blank";
				anchor.href = window.howtoplay;
				anchor.click();
			});
			menutab.appendChild(menu_close);
			//menutab.appendChild(menu_login);


			//イベントリスナを設定
			document.getElementById("menutop").addEventListener("click", function (e) {
				window.parent.location = "../../";
			});

			if (0 <= SU_Api.m_NoneRanking.indexOf(Number(SU_Api.m_SND_GAME_ID))) {
				//ランキング非対応
				document.getElementById("menuranking").style.display = "none";
				//document.getElementById("menuranking").style.visibility = "hidden";
			}
			else {
				//ランキング表示
				document.getElementById("menuranking").addEventListener("click", function (e) {
					if (SU_Api.m_DEVICE != "pc") {	//すまほ
						window.parent.location = "../mobileranking/" + window.snd_game_id;
					}
					else {	//PC
						if (SU_Api.m_isSUCCESS_HP == true) {
							var urls = window.location.href;
							urls = urls.replace("/GameMain.php", "#tabs");
							urls = urls.replace("/game/", "/game/play/");
							window.parent.location = urls;
						}
						else {
							var element = parent.document.getElementById("tabs");
							var rect = element.getBoundingClientRect();
							var positionX = rect.left + window.parent.pageXOffset;	// 要素のX座標
							var positionY = rect.top + window.parent.pageYOffset;	// 要素のY座標
							// 要素の位置にスクロールさせる
							window.parent.scrollTo(positionX, positionY);
						}
					}
				});
			}

			document.getElementById("menuclose").addEventListener("click", function (e) {
				document.getElementById('menutab').style.display = "none";
				document.getElementById('menubutton').style.marginLeft = "0px";
			});

			/*document.getElementById("menulogin").addEventListener("click", function(e){
				window.open(SU_Api.m_LOGIN_URL,"newtab","width=1000,height=800");
			});*/

			//z-index
			document.getElementById("menutab").style.zIndex = "99999";

			//画像ドラッグ反転不可
			document.getElementById("menu").style.userSelect = "none";
			document.getElementById("menu").style.webkitUserSelect = "none";
			document.getElementById("menu").style.mozUserSelect = "none";
			document.getElementById("menu").style.msUserSelect = "none";

			//メニューボタンの位置とサイズを動的に調整
			var scale = window.innerWidth / window.game_sizeX;
			if ((window.game_sizeX / window.game_sizeY) < (window.innerWidth / window.innerHeight)) {
				scale = window.innerHeight / window.game_sizeY;
			}
			document.getElementById("menubutton").style.top = Math.floor(window.menuItem.position * scale) + "px";
			document.getElementById("menuballoon").style.top = Math.floor(window.menuItem.position * scale + window.menuItem.size) + "px";
			if (window.menuItem.responsive) {
				document.getElementById("menubutton").style.height = Math.floor(window.menuItem.size * scale) + "px";
				document.getElementById("menubutton").style.width = Math.floor(window.menuItem.size * scale) + "px";
				document.getElementById("menuballoon").style.top = is_balloon_halfover
					? Math.floor(window.menuItem.position * scale - window.menuItem.size * scale * 2) + "px"
					: Math.floor(window.menuItem.position * scale + window.menuItem.size * scale) + "px";
				document.getElementById("menuballoon").style.height = Math.floor(110 * scale) + "px";
				document.getElementById("menuballoon").style.width = Math.floor(110 * scale) + "px";
			}
		};

		//ロード用アイコン
		arguments.callee.CreateLoadIcon = function () {
			//icon
			var icon = document.createElement("div");
			//icon.innerHTML = "";
			icon.id = "game_load_icon";
			icon.style.backgroundColor = "#FFF";
			icon.style.width = "40px";
			icon.style.height = "40px";
			icon.style.position = "relative";
			icon.style.margin = "5px " + String((window.innerWidth) - 40) + "px";
			icon.style.display = "none";

			//htmlに動的生成
			document.body.appendChild(icon);
		};


		//毎フレーム行う処理: SU_Apiの更新
		arguments.callee.Update = function () {
			//Version2.1より、SU_Api内のMainLoopにて行う
		};

		//毎フレーム行う処理: SU_Apiの更新
		arguments.callee.MainLoop = function () {
			//横画面チェック
			SU_Api.PortraitCheck();

			/*
			//通信待機アイコン(一応用意しておくが通信早いので逆に不自然の為コメントアウト)
			if(SU_Api.m_DEVICE!="pc")
			{
				if(SU_Api.m_ResponseFlag)
				{
					document.getElementById("game_load_icon").style.display = "block";
				}
				else
				{
					document.getElementById("game_load_icon").style.display = "none";
				}
			}*/

			//ログイン直後処理
			if (localStorage.getItem('loginflag') == "true") {
				function getCookie(key) {
					// Cookieから値を取得する
					var cookieString = document.cookie;
					var cookieKeyArray = cookieString.split(";");
					for (var i = 0; i < cookieKeyArray.length; i++) {
						var targetCookie = cookieKeyArray[i];
						targetCookie = targetCookie.replace(/^\s+|\s+$/g, "");
						var valueIndex = targetCookie.indexOf("=");
						if (targetCookie.substring(0, valueIndex) == key) {
							// キーが引数と一致した場合、値を返す
							return unescape(targetCookie.slice(valueIndex + 1));

						}
					}
					return "";
				}
				var isGameTab = document.getElementById("game_tab").style.display != "none";
				if (isGameTab && getCookie('tmp_gid') == SU_Api.m_SND_GAME_ID) {
					SU_Api.results(Number(getCookie('tmp_score')));
				}
				else {
					//alert("Unexpected login error");
				}
				sessionStorage.setItem('logiiin', true);
				localStorage.removeItem('loginflag');
				document.cookie = 'tmp_score=;';
				document.cookie = 'tmp_gid=;';

			}

			//ディスプレイ広告について
			if (document.getElementById("display_ad")) {
				nowtime = Math.floor(new Date().getTime() / 1000);
				//5秒経過した時点でボタン(閉じる)を表示
				if (document.getElementById("display_button").style.visibility != "visible" &&
					nowtime - SU_Api.m_DispStamp >= 5)	/// !!広告を閉じるボタン出現の時間
				{
					document.getElementById("display_button").style.visibility = "visible";
				}

				//15秒経ったら自動で広告を閉じる
				if (nowtime - SU_Api.m_DispStamp > 15) {
					document.getElementById("display_ad").style.display = "none";
					document.getElementById('nontouch').style.visibility = 'hidden';
					document.getElementById("display_button").style.visibility = "hidden";

					//リワード広告の場合、報酬を渡す
					if (window.ads_callback_success != null) window.ads_callback_success();
					window.ads_callback_success = null;
					window.ads_callback_error = null;
				}

				//時間をカウントし表示
				if (document.getElementById("display_ad").style.display != "none") {
					var timeSprite = 15 - Math.floor(nowtime - SU_Api.m_DispStamp);
					document.getElementById("display_count").innerHTML = timeSprite;
				}
				else {
					SU_Api.m_DispStamp = Math.floor(new Date().getTime() / 1000);
					document.getElementById("display_button").style.visibility = "hidden";
				}
			}
			
			// 動画説明の監視
			if( SU_Api.EnableHowToMovie() )
			{
				// 再生中
				if( SU_Api.isPlayingHowToMovie )
				{
					// 再生中なのに再生モーダルがない→再生終了
					if( 0 >= document.getElementsByClassName("modal-video-body").length )
					{
						SU_Api.isPlayingHowToMovie = false;
						
						// サウンド設定のバックアップがあるなら復元
						if( SU_Api.HowTowMovieSoundBackUp != null )
						{
							SnlSound.SetEnableBGM( SU_Api.HowTowMovieSoundBackUp.BGM );
							SnlSound.SetEnableSE( SU_Api.HowTowMovieSoundBackUp.SE );
							SU_Api.HowTowMovieSoundBackUp = null;
						}
					}
				}
				else
				{
					// 未再生なのに再生用モーダルが開かれた→再生開始
					if( 0 < document.getElementsByClassName("modal-video-body").length )
					{
						SU_Api.isPlayingHowToMovie = true;
						
						// Soundが有効ならSnlSoundの設定をバックアップ
						if( typeof SnlSound != "undefined" )
						{
							if( SnlSound.m_isEnableBGM || SnlSound.m_isEnableSE )
							{
								SU_Api.HowTowMovieSoundBackUp =
								{
									SE : SnlSound.m_isEnableSE,
									BGM : SnlSound.m_isEnableBGM,
								};
								SnlSound.SetEnableBGM( false );
								SnlSound.SetEnableSE( false );
							}
						}
					}
				}
			}
			
		};

		//HTML特殊文字をデコードして返す
		arguments.callee.htmlspecialchars_decode = function (str) {
			return str.replace(/&(gt|lt|#039|quot|amp);/ig,
				function ($0, $1) {
					if (/^gt$/i.test($1)) return ">";
					if (/^lt$/i.test($1)) return "<";
					if (/^#039$/.test($1)) return "'";
					if (/^quot$/i.test($1)) return "\"";
					if (/^amp$/i.test($1)) return "&";
				});
		};

		//新しいDisp広告をリクエストする
		arguments.callee.getDispAd = function () {
			document.getElementById("middle_ad").innerHTML = "";
			var script0 = document.createElement('script');
			var script1 = document.createElement('script');
			script0.setAttribute("src", "https://pagead2.googlesyndication.com/pub-config/r20160212/ca-pub-1306297722460299.js");
			script1.setAttribute("src", "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");

			var ins1 = document.createElement('ins');
			ins1.setAttribute("class", "adsbygoogle");
			ins1.setAttribute("style", "display:inline-block;width:300px;height:250px");
			ins1.setAttribute("data-ad-client", "ca-pub-1306297722460299");
			ins1.setAttribute("data-ad-slot", SU_Api.m_DisplayAdsSlot);

			var script2 = document.createElement('script');
			script2.innerHTML = "(adsbygoogle = window.adsbygoogle || []).push({});";

			document.getElementById("middle_ad").appendChild(script0);
			document.getElementById("middle_ad").appendChild(script1);
			document.getElementById("middle_ad").appendChild(ins1);
			document.getElementById("middle_ad").appendChild(script2);

			SU_Api.m_RequestDispAd++;
		};

		/*
		 * 概要		:	ステージクリア型用のスコアリセット判定
		 *				次の月曜日の日付を超えている場合はtrueを返す
		 * 引数		:	gToday(連想配列{y,d,m,h,i,w})
							gClearday(連想配列{y,d,m,h,i,w})
		 * 戻り値	:	bool(true/false)
		 */
		arguments.callee.weekReset = function (gToday, gClearday) {
			//今日の日付情報が無ければ取得
			if (gToday == null) gToday = SU_Api.getToday();

			//クリア日の情報が無ければ今日の日付で
			if (gClearday == null) gClearday = gToday;

			//weekcnt=何日分先か
			var weekcnt = 1;	//日曜日の場合は1日次送り
			if (gClearday.w != 0)	//月～土の場合
			{
				weekcnt = 8 - gClearday.w;
			}

			//リセット予定日を設定
			var resetDate = { y: gClearday.y, m: gClearday.m, d: gClearday.d, h: 0, i: 0, };

			for (var i = 0; i < weekcnt; i++) {
				//”翌日”を設定し、翌日に切り替え予定
				var mtbl = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				if ((resetDate.y) % 4 == 0) mtbl[1] = 29;	//閏年(leapYear)

				if (resetDate.m == 12 && resetDate.d == 31) {
					//12月31日なら次は来年の1月1日
					resetDate.d = 1;
					resetDate.m = 1;
					resetDate.y = (resetDate.y) + 1;
				}
				else if (resetDate.d == mtbl[(resetDate.m) - 1]) {
					//月末なら次の日は来月の1日
					resetDate.d = 1;
					resetDate.m = (resetDate.m) + 1;
					resetDate.y = resetDate.y;
				}
				else {
					//通常ならば日付のみをインクリメント
					resetDate.d = (resetDate.d) + 1;
					resetDate.m = resetDate.m;
					resetDate.y = resetDate.y;
				}
			}

			//12桁表示
			var r12 = (resetDate.y * 100000000) + (resetDate.m * 1000000) + (resetDate.d * 10000) + (resetDate.h * 100) + resetDate.i;
			var t12 = (gToday.y * 100000000) + (gToday.m * 1000000) + (gToday.d * 10000) + (gToday.h * 100) + gToday.i;
			//console.log("r/t: "+r12+"/"+t12+"("+ Number(t12-r12) +")");


			//10ケタ日付同士で比較して、リセット予定日を超えている場合はtrue
			if (t12 >= r12) {
				return true;
			}
			return false;
		},

			/*
			 * 概要		:	weekReset関数に沿った今日の日付の連想配列{}を返す
			 * 引数		:	なし
			 * 戻り値	:	連想配列 {y:(数値),m:(数値),d:(数値),h:(数値),i:(数値),w:(数値),};
			 */
			arguments.callee.getToday = function () {
				var date_obj = new Date();
				return {
					y: date_obj.getFullYear(),	//年 (例:"2016"年)
					m: date_obj.getMonth() + 1,	//月 (例:"10"月)
					d: date_obj.getDate(),		//日 (例:"15"日)
					h: date_obj.getHours(),		//時 (例:"18"時)
					i: date_obj.getMinutes(),	//分 (例:"2"分)
					w: date_obj.getDay(),		//曜日 (例:"1"(=月曜日))
				};
			};

		//最新の日付を判定する
		//引数１の方が新しい場合true,引数2の方が新しい場合false
		//片方しかない場合は存在する方を最新とみなす
		//両方存在しない場合はエラーという文字列を返す
		//両方同じデータの場合はfalseを返す
		arguments.callee.latestJudge = function (dateA, dateB) {
			if (dateA != null && dateB == null) return true;
			if (dateA == null && dateB != null) return false;
			if (dateA == null && dateB == null) return "date_error";

			//年を判定(数値大きい方が最新)
			if (dateA.y > dateB.y) return true;
			if (dateA.y < dateB.y) return false;
			//月を判定
			if (dateA.m > dateB.m) return true;
			if (dateA.m < dateB.m) return false;
			//日を判定
			if (dateA.s > dateB.s) return true;
			if (dateA.s < dateB.s) return false;
			//時を判定
			if (dateA.h > dateB.h) return true;
			if (dateA.h < dateB.h) return false;
			//分を判定
			if (dateA.i > dateB.i) return true;
			if (dateA.i < dateB.i) return false;

			//両方同じデータ
			return false;
		};

		//文字コード操作 格納時
		arguments.callee.Encode = function (str) {
			var str2 = "";
			str = encodeURIComponent(str);
			for (var i = 0; i < str.length; i++) {
				str2 += String.fromCharCode(str.charCodeAt(i) + 10);
			}
			return str2;
		};

		//文字コード操作 復元時
		arguments.callee.Decode = function (str) {
			if (str == null) {
				return str;
			}

			var str2 = "";
			for (var i = 0; i < str.length; i++) {
				str2 += String.fromCharCode(str.charCodeAt(i) - 10);
			}
			return decodeURIComponent(str2);
		};

		/*
		 * 概要		:	広告やYタブやサイドメニューが表示中（または通信中）、横もちの場合trueを返す
		 *				総じてゲームの停止が必要そうな状況の時にtrueを返す
		 * 引数		:	なし
		 * 戻り値	:	bool(true/false)
		 */
		arguments.callee.isView = function () {
			/*if(SU_Api.m_ResponseFlag)
			{
				return true;
			}*/

			if (SU_Api.isPlayingAd) {
				return true;
			}

			var promotionWindow = document.querySelector("#promotion-window");
			if (promotionWindow && promotionWindow.style.display !== "none") {
				return true;
			}

			var creditWindow = document.querySelector("#game-credit");
			if (creditWindow && creditWindow.style.display !== "none") {
				return true;
			}

			if (document.getElementById("game_invalid")) {
				if (document.getElementById("game_invalid").style.display != "none") {
					return true;
				}
			}
			if (document.getElementById("adContainer")) {
				if (document.getElementById("adContainer").style.display != "none") {
					return true;
				}
			}
			if (document.getElementById("menutab")) {
				if (document.getElementById('menutab').style.display != "none") {
					return true;
				}
			}
			if (document.getElementById("warning_adblock_img")) {
				return true;
			}
			if (document.getElementById("display_ad")) {
				if (document.getElementById("display_ad").style.display != "none") {
					return true;
				}
			}
			if (document.getElementById("game_tab")) {
				if (document.getElementById("game_tab").style.display != "none") {
					return true;
				}
			}
			if (document.getElementById("warning_port")) {
				if (document.getElementById("warning_port").style.display != "none") {
					return true;
				}
			}
			if (document.getElementById("reward_ad")) {
				if (document.getElementById("reward_ad").style.display != "none") {
					return true;
				}
			}
			
			if( SU_Api.isPlayingHowToMovie )
			{
				return true;
			}
			
			return false;
		};

		var isGoodSoundClicked = false;
		var goodSoundButtonImg;

		SU_Api.goodSound = function () {
			if (!isGoodSoundClicked) {
				isGoodSoundClicked = true;
				goodSoundButtonImg.src = "../web/img/goodsound_clicked.png";
				goodSoundButtonImg.style.cursor = "initial";

				$.ajax({
					type: "post",
					url: "../../ajax/sound/good.json",
					data: {
						game_id: window.snd_game_id
					},
					success: function (data) {

					},
					error: function (jqXHR, textStatus, errorThrown) {
						SU_Api.setLogin(false);
					}
				});
			}
		};

		SU_Api.setGoodSoundButton = function (isLoggedIn) {
			if (typeof goodSoundButtonImg === "undefined") {
				goodSoundButtonImg = document.querySelector("#game_sound_good > button > img");
			}

			if (isLoggedIn) {
				var game_sound_good = document.querySelector("#game_sound_good");
				game_sound_good.style.height = "100px";

				var game_sound_good_text = document.querySelector("#game_sound_good > p");
				game_sound_good_text.innerHTML = "BGMが気に入ったら<br>『イイネ!』を押してね！";

				goodSoundButtonImg.src = "../web/img/goodsound_loggedin.png";
				goodSoundButtonImg.style.cursor = "pointer";

				var game_sound_good_button = document.querySelector("#game_sound_good > button");
				game_sound_good_button.addEventListener("click", SU_Api.goodSound);

			} else {
				var game_sound_good = document.querySelector("#game_sound_good");
				game_sound_good.style.height = "136px";

				var game_sound_good_text = document.querySelector("#game_sound_good > p");
				game_sound_good_text.innerHTML = "ゲームの窓に会員登録して<br>ゲームにチャレンジし、<br>気に入ったBGMに<br>「イイネ！」しよう！";

				goodSoundButtonImg.src = "../web/img/goodsound_nologin.png";
				goodSoundButtonImg.style.cursor = "initial";

				var game_sound_good_button = document.querySelector("#game_sound_good > button");
				game_sound_good_button.removeEventListener("click", SU_Api.goodSound);
			}
		};

		//ログイン状況の監視
		arguments.callee.setLogin = function (islogin) {
			if (SU_Api.m_isLogin != islogin) {
				SU_Api.m_isLogin = islogin;
				if (SU_Api.m_isLogin == false) {
					if (SU_Api.isSoundRanking) {
						var game_tab = document.querySelector("#game_tab_bg");
						game_tab.style.height = "466px";

						SU_Api.setGoodSoundButton(false);
					}

					document.getElementById("game_tab_login").style.cursor = "pointer";
					document.getElementById("game_tab_login").style.backgroundColor = "#F00";
					document.getElementById("game_tab_login").innerHTML = '<p style="line-height: 40px; margin: 0; text-align: center; color:#FFF;">LOGIN</p>';
					document.getElementById("game_tab_account").style.visibility = "visible";
					//document.getElementById("game_tab_login").onclick = function(e){
					//	window.open(SU_Api.m_LOGIN_URL,"newtab","width=1000,height=800");
					//};
					document.getElementById("game_tab_login").href = SU_Api.m_LOGIN_URL;
					document.getElementById("game_tab_login").target = "testwindow";
					document.getElementById("game_tab_login").onclick = function (e) {
						window.open('../../', 'testwindow', "width=1000,height=800");
					};

					parent.document.getElementById("gw_nickname").innerHTML = "ゲスト";
					if (parent.document.getElementById("gw_auth"))
						parent.document.getElementById("gw_auth").style.display = "block";

				}
				else {
					if (SU_Api.isSoundRanking) {
						var game_tab = document.querySelector("#game_tab_bg");
						game_tab.style.height = "430px";

						SU_Api.setGoodSoundButton(true);
					}

					document.getElementById("game_tab_login").style.cursor = "initial";
					document.getElementById("game_tab_login").style.backgroundColor = "#088";
					document.getElementById("game_tab_login").innerHTML = '<p style="line-height: 40px; margin: 0; text-align: center; color:#FFF;">ログイン済</p>';
					document.getElementById("game_tab_account").style.visibility = "hidden";
					document.getElementById("game_tab_login").href = void (0);
					document.getElementById("game_tab_login").target = null;
					document.getElementById("game_tab_login").onclick = function (e) {
						return false;
					};

					SU_Api.loginCheck(function (data) {
						if (parent.document.getElementById("gw_nickname")) {
							parent.document.getElementById("gw_nickname").innerHTML = data.user_data.nickname;
							if (parent.document.getElementById("gw_auth"))
								parent.document.getElementById("gw_auth").style.display = "none";
						}
					});
				}
			}
		};

		/*
		 * 概要		: SUリザルト画面を出力。
		 * 引数		: 数値(スコア)
		 * 戻り値	: なし
		 */
		arguments.callee.results = function (score, stage) {
			//操作無効
			document.getElementById("game_invalid").style.display = "block";

			//遅延出力
			setTimeout(SU_Api.resultsMain.bind(undefined, score, stage), 3000);
		};

		arguments.callee.resultsMain = function (score, stage) {
			document.getElementById("game_invalid").style.display = "none";

			if (score < 0) score = 0;

			//tweetButton動的生成
			if (typeof (twttr) != "undefined") {
				var text = window.game_name + "でスコア" + score + "を獲得！\n";
				var button = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="https://h5games.success-corp.co.jp" data-text="' + text + '" data-via="success_g3" data-lang="ja" data-related="SUCCESS_Corp,success_g3" data-hashtags="ゲームの窓"></a>';

				//document.getElementById("game_tab_twitter").innerHTML = button;
				$('#game_tab_twitter').html(button);
				twttr.widgets.load();

				// ツイート完了後のコールバック
				function afterTweet(intent_event) {
					if (intent_event) {
						SU_Api.AddTweetCount();
					};
				}

				// イベントにコールバックをバインド
				twttr.ready(function (twttr) {
					twttr.events.bind('tweet', afterTweet);
				});

			}

			//リログ時用に値を保存しておく
			document.cookie = 'tmp_score=' + score + ';';
			document.cookie = 'tmp_gid=' + SU_Api.m_SND_GAME_ID + ';';

			SU_Api.sendScore(score, stage);

			document.getElementById("game_tab").style.display = "block";
			document.getElementById("game_tab_hiscore_score").innerHTML = score;
		};

		SU_Api.isPlayingAd = false;
		SU_Api.isBGM = false;

		SU_Api.adsCallback = function () {
			if (typeof SnlSound !== 'undefined' && typeof (SnlSound.SetEnableBGM) === 'function') {
				SnlSound.SetEnableBGM(SU_Api.isBGM);
				SU_Api.isBGM = false;
			}
			SU_Api.isPlayingAd = false;
		};

		/*
		 * 概要		: ディスプレイ広告を表示状態にする。
		 * 引数		: なし
		 * 戻り値	: なし
		 */
		arguments.callee.ads = function () {
			//		//リワード広告の場合、報酬を渡す
			//		if( window.ads_callback_success!=null ) window.ads_callback_success();
			//		window.ads_callback_success = null;
			//		window.ads_callback_error   = null;
			//		
			//		//担当指示により出力なし
			//		return;

			//SUCCESSのTOPページからのアクセスだった場合
			if (SU_Api.m_isSUCCESS_HP == true) {
				console.log("通常広告SKIP");
				return;
			}

			//広告スキップ
			if (SU_Api.m_AdSkip) {
				var mozi = "ads";
				if (SU_Api.m_AdSkip == "console") console.log(mozi + " skip");
				else if (SU_Api.m_AdSkip == "alert") alert(mozi + " skip");

				return;
			}

			if (window.isAfg) {
				SU_Api.isPlayingAd = true;
				if (typeof SnlSound !== 'undefined') {
					SU_Api.isBGM = SnlSound.m_isEnableBGM;
				}
				playAds(SU_Api.adsCallback);
			} else {
				if (SU_Api.m_RequestDispAd < 6) SU_Api.getDispAd();

				document.getElementById('nontouch').style.visibility = 'visible';
				document.getElementById("display_ad").style.display = "block";
			}
		};

		/*
		 * 概要		: 動画広告を表示状態にする。
		 * 引数		: なし
		 * 戻り値	: なし
		 */
		arguments.callee.adsMovie = function () {
			//広告スキップ
			if (SU_Api.m_AdSkip) {
				var mozi = "adsMovie";
				if (SU_Api.m_AdSkip == "console") console.log(mozi + " skip");
				else if (SU_Api.m_AdSkip == "alert") alert(mozi + " skip");

				return;
			}

			//SUCCESSのTOPページからのアクセスだった場合
			if (SU_Api.m_isSUCCESS_HP == true) {
				console.log("動画広告SKIP");
				return;
			}

			if (window.isAfg) {
				if (typeof SnlSound !== 'undefined') {
					SU_Api.isBGM = SnlSound.m_isEnableBGM;
				}
				playAds(SU_Api.adsCallback);
				return;
			}

			//falseなら動画広告配信cancel
			if (window.isMovieAds == false) {
				SU_Api.ads();
				return;
			}

			//PC環境以外の場合は、ディスプレイ広告に切り替える。
			if (SU_Api.m_DEVICE != "pc" || window.movieLoading != 1) {
				SU_Api.ads();
			}
			else {
				playAds();
			}
		};

		//2018/06/27 リワード広告(PCのみ)
		arguments.callee.adsReward = function (_option) {
			if (SU_Api.m_DEVICE == "pc") {
				var flag = 0;
				var dateNOW = new Date();
				var dateTARGET = new Date('9/18/2018 00:00:00');
				var userAgent = window.navigator.userAgent.toLowerCase();
				var isIE = (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1);

				if (dateNOW.getTime() > dateTARGET.getTime()) {
					console.log("9/18~ Adsense動画に切替");
					flag = 1;
				} else if (isIE == true) {
					console.log("IE Adsense動画に切替");
					flag = 1;
				}

				if (flag == 0) {
					adsReward(_option);
				} else {
					SU_Api.adsRewardGoogle(_option);
				}
			}
			else {
				window.ads_callback_success = _option.callback_s;
				window.ads_callback_error = _option.callback_e;
				SU_Api.ads();
			}
		};


		arguments.callee.adsRewardGoogle = function (_option) {
			if (window.movieLoading != 1) {
				//alert("動画広告(Adsense)の読込が終わっていないので再生できません。後ほどお試しください。");
				window.ads_callback_success = _option.callback_s;
				window.ads_callback_error = _option.callback_e;
				SU_Api.ads();
				return;
			}

			//広告スキップ
			/*if(SU_Api.m_AdSkip)
			{
				var mozi = "adsMovie";
				if(SU_Api.m_AdSkip == "console")	console.log(mozi+" skip");
				else if(SU_Api.m_AdSkip == "alert")	alert(mozi+" skip");
				
				return;
			}*/

			//SUCCESSのTOPページからのアクセスだった場合
			if (SU_Api.m_isSUCCESS_HP == true) {
				console.log("動画広告SKIP");
				return;
			}

			playAdsReward(_option);
		},

			//typeofより万能な型判定関数
			arguments.callee.is = function (type, obj) {
				var clas = Object.prototype.toString.call(obj).slice(8, -1);
				return obj !== undefined && obj !== null && clas === type;
			};

		//ゲームの窓連携API

		//ツイートカウント
		arguments.callee.AddTweetCount = function () {
			//SU_Api.m_ResponseFlag = true;
			$.ajax({
				type: "post",
				url: "../../ajax/count/twit.json",
				success: function (jsondata) {
					if (jsondata.flag == true) {
						console.log("あなたのツイートを受け付けました");
					}
					SU_Api.rewardCheck(jsondata.new_reward);
					//		SU_Api.m_ResponseFlag = false;
				},
				error: function (request, status, error) {
					//		SU_Api.m_ResponseFlag = false;
					SU_Api.rewardCheck(false);
				},
			});
		},

			//ログインチェック
			arguments.callee.loginCheck = function (callback) {
				SU_Api.m_ResponseFlag = true;
				$.ajax({
					type: "post",
					url: "../../ajax/auth/info.json",
					success: function (jsondata) {
						SU_Api.m_ResponseFlag = false;
						//SU_Api.m_isLogin = jsondata.logged_in;
						SU_Api.setLogin(jsondata.logged_in);
						if (callback) callback(jsondata);
					},
					error: function (request, status, error) {
						SU_Api.m_ResponseFlag = false;
						//SU_Api.m_isLogin = false;	//エラー時は未ログインとみなす
						SU_Api.setLogin(false);
						if (callback) callback(SU_Api.convErrorNumber(request));
					},
				});
			},

			//ログ送信 ( スコアは1ゲーム毎のスコアが欲しいとの事 )
			arguments.callee.sendLog = function (score, stage) {
				var Data = {};
				if (!isNaN(window.snd_game_id)) Data.game_id = window.snd_game_id;
				if (!isNaN(score)) Data.score = score;
				if (!isNaN(stage)) Data.stage = stage;

				$.ajax({
					type: "post",
					url: "../../ajax/record/log.json",
					data: Data,
					success: function (jsondata) {
						console.log(jsondata);
					},
					error: function (request, status, error) {
						console.log(SU_Api.convErrorNumber(request));
					},
				});
			},

			//ランキングサーバにスコアを投げる
			arguments.callee.sendScore = function (score, stage) {
				SU_Api.m_ResponseFlag = true;

				var Data = {};
				if (!isNaN(window.snd_game_id)) Data.game_id = window.snd_game_id;
				if (!isNaN(score)) Data.score = score;
				if (!isNaN(stage)) Data.stage = stage;

				$.ajax({
					type: "post",
					url: "../../ajax/record/save.json",
					data: Data,
					async: SU_Api.m_AsyncMode,
					// 通信成功した時の処理
					success: function (jsondata) {
						//ログイン時の処理 引数によって戻り値の形が違う
						if (jsondata.flag) {
							var msg = [" ", "今週のハイスコア", "今週の合計スコア", "最高タイム",]
							var total = jsondata.ranking.weekly.score;
							document.getElementById("game_tab_hiscore_total").innerHTML = msg[jsondata.ranking.type] + ": " + total;
						}
						else {
							document.getElementById("game_tab_hiscore_total").innerHTML = " ";
						}

						if (jsondata.error && ~jsondata.error.indexOf("Login")) {
							SU_Api.setLogin(false);
						} else {
							SU_Api.setLogin(true);
							if (isGoodSoundClicked) {
								isGoodSoundClicked = false;
								goodSoundButtonImg.src = "../web/img/goodsound_loggedin.png";
								goodSoundButtonImg.style.cursor = "pointer";
							}
						}

						SU_Api.rewardCheck(jsondata.new_reward);
						SU_Api.m_ResponseFlag = false;
					},
					// 通信失敗した時の処理
					error: function (request, status, error) {
						SU_Api.setLogin(false);
						document.getElementById("game_tab_hiscore_total").innerHTML = "---";
						console.debug(error);
						SU_Api.m_ResponseFlag = false;
						SU_Api.rewardCheck(false);

					}
				});
			};

		//報酬確認
		arguments.callee.rewardCheck = function (reward) {
			if (reward) {
				document.getElementById("game_tab_black_bg").style.display = "block";
				document.getElementById("game_tab_reward_bg").style.display = "block";

				document.getElementById("game_tab_account").style.visibility = "visible";
				document.getElementById("game_tab_account").innerHTML = '報酬を獲得しました。こちらから確認';
				document.getElementById("game_tab_account").href = SU_Api.m_REWARD_URL;
			}
			else {
				if (SU_Api.m_isLogin == false) document.getElementById("game_tab_account").style.visibility = "visible";
				else document.getElementById("game_tab_account").style.visibility = "hidden";

				document.getElementById("game_tab_account").innerHTML = 'まだ会員登録がお済みでない場合はこちらから';
				document.getElementById("game_tab_account").href = SU_Api.m_REGISTER_URL;
			}
		};

		//ランキングサーバからスコア取得
		arguments.callee.getScore = function (callback) {
			SU_Api.m_ResponseFlag = true;

			var Data = {};
			if (!isNaN(window.snd_game_id)) Data.game_id = window.snd_game_id;

			$.ajax({
				type: "post",
				url: "../../ajax/record/score.json",
				data: Data,
				async: SU_Api.m_AsyncMode,
				// 通信成功した時の処理
				success: function (jsondata) {
					//ログイン時の処理 引数によって戻り値の形が違う
					if (jsondata.flag) {
						if (!jsondata.score) jsondata.score = 0;
						callback(jsondata.score);
					}
					else {
						callback(null);
					}
					SU_Api.m_ResponseFlag = false;
				},
				// 通信失敗した時の処理
				error: function (request, status, error) {
					callback(null);
					console.debug(error);
					SU_Api.m_ResponseFlag = false;
				}
			});
		};

		//データベースに値を保存
		arguments.callee.setDB = function (callback_s, callback_e, key, value) {
			SU_Api.m_ResponseFlag = true;

			//通信に必要なデータを作成
			/*var Data={};
			if( key && SU_Api.is( "String" , key ) ) Data[key] = value;
			else Data = key;
			Data["game_id"] = window.snd_game_id;
			*/

			//新しい仕様はたぶんこれでうまくいく？
			var Data = {};
			//if( key && SU_Api.is( "String" , key ) ) Data["keys"] = {key:value};
			if (key && SU_Api.is("String", key)) {
				var obj = {};
				obj[key] = value;
				Data["keys"] = obj;
			}
			else Data["keys"] = key;
			Data["game_id"] = window.snd_game_id;

			$.ajax({
				type: "post",
				url: "../../ajax/gamedata/save.json",
				data: Data,
				async: SU_Api.m_AsyncMode,
				// 通信成功した時の処理
				success: function (jsondata) {
					if (jsondata.flag == true)	//DB保存成功
					{
						if (callback_s) callback_s();
						//			console.debug("setDB - true");
					}
					else	//通信は成功しているがログインやサーバ側でエラー
					{
						if (callback_e) callback_e(SU_Api.convErrorNumber(jsondata.flag));
						//			console.debug("setDB - false");
					}
					SU_Api.m_ResponseFlag = false;
				},
				// 通信失敗した時の処理
				error: function (request, status, error) {
					if (callback_e) callback_e(SU_Api.convErrorNumber(request));
					console.debug(error);
					SU_Api.m_ResponseFlag = false;
				}
			});
		};

		//データベースから値を取得
		arguments.callee.getDB = function (callback_s, callback_e, key) {
			SU_Api.m_ResponseFlag = true;

			//通信に必要なデータを作成
			var Data = {};
			if (SU_Api.is("String", key)) Data["keys"] = [key];
			else Data["keys"] = key;
			Data["game_id"] = window.snd_game_id;

			$.ajax({
				type: "post",
				url: "../../ajax/gamedata/load.json",
				//	url : "../../../kang/uwebtest/public/ajax/gamedata/load.json",
				data: Data,
				async: SU_Api.m_AsyncMode,
				// 通信成功した時の処理
				success: function (jsondata) {
					if (jsondata.flag == true)//DB取得成功
					{
						//if(callback_s) callback_s( jsondata.savedata );

						if (callback_s) {
							if (SU_Api.is("String", key)) callback_s(jsondata.savedata[key]);
							else callback_s(jsondata.savedata);
						}

						//			console.debug("getDB - true");
					}
					else	//通信は成功しているがログインやサーバ側でエラー
					{
						if (callback_e) callback_e(SU_Api.convErrorNumber(jsondata.flag));
						//			console.debug("getDB - false");
					}
					SU_Api.m_ResponseFlag = false;

				},
				// 通信失敗した時の処理
				error: function (request, status, error) {
					if (callback_e) callback_e(SU_Api.convErrorNumber(request));
					console.debug(error);
					SU_Api.m_ResponseFlag = false;
				},
			});

		};

		//データベースの値を削除
		arguments.callee.removeDB = function (callback_s, callback_e, key) {
			SU_Api.m_ResponseFlag = true;

			var Data = {};
			if (SU_Api.is("String", key)) Data["keys"] = [key];
			else Data["keys"] = key;
			Data["game_id"] = window.snd_game_id;

			$.ajax({
				type: "post",
				url: "../../ajax/gamedata/delete.json",
				//			url : "../../../kang/uwebtest/public/ajax/gamedata/delete.json",
				data: Data,
				async: SU_Api.m_AsyncMode,
				// 通信成功した時の処理
				success: function (jsondata) {
					if (jsondata.flag == true)//DB削除成功
					{
						if (callback_s) callback_s();
						//		console.debug("removeDB - true");
					}
					else//通信には成功したが何らかのエラー
					{
						if (callback_e) callback_e(SU_Api.convErrorNumber(jsondata.flag));
						//		console.debug("removeDB - false");
					}
					SU_Api.m_ResponseFlag = false;

				},
				// 通信失敗した時の処理
				error: function (request, status, error) {
					if (callback_e) callback_e(SU_Api.convErrorNumber(request));
					console.debug(error);
					SU_Api.m_ResponseFlag = false;
				},
			});
		};

		//SU_Apiが定めるエラー番号を返す
		arguments.callee.m_ErrorCode = {
			UNKNOWN_ERROR: -1,	//その他不明なエラー。
			UNEXPECTED_ERROR: 0,	//通信自体は成功したが予期せぬ問題が発生した。
			INFORMATIONAL: 1,	//リクエストは受け取られた。処理は継続される。
			SUCCESS: 2,	//リクエストは受け取られ、理解され、受理された。
			REDIRECTION: 3,	//リクエストを完了させるために、追加的な処理が必要。
			CLIENT_ERROR: 4,	//クライアントからのリクエストに誤りがあった。
			SERVER_ERROR: 5,	//サーバがリクエストの処理に失敗した。
			REQUEST_UNKNOWN: 6,	//不明なリクエストレスポンス。
		};
		arguments.callee.convErrorNumber = function (request) {
			//通信自体は成功したが予期せぬ問題が発生した。
			if (request == false) {
				return SU_Api.m_ErrorCode.UNEXPECTED_ERROR;
			}

			//不明なリクエストレスポンス
			if (request == null || request.status == null) {
				return SU_Api.m_ErrorCode.REQUEST_UNKNOWN;
			}

			//リクエストは受け取られた。処理は継続される。
			if (100 <= request.status && request.status < 200) {
				return SU_Api.m_ErrorCode.INFORMATIONAL;
			}
			//リクエストは受け取られ、理解され、受理された。
			if (200 <= request.status && request.status < 300) {
				return SU_Api.m_ErrorCode.SUCCESS;
			}
			//リクエストを完了させるために、追加的な処理が必要。
			if (300 <= request.status && request.status < 400) {
				return SU_Api.m_ErrorCode.REDIRECTION;
			}
			//クライアントからのリクエストに誤りがあった。
			if (400 <= request.status && request.status < 500) {
				return SU_Api.m_ErrorCode.CLIENT_ERROR;
			}
			//サーバがリクエストの処理に失敗した。
			if (500 <= request.status && request.status < 600) {
				return SU_Api.m_ErrorCode.SERVER_ERROR;
			}
			//その他不明なエラー。
			return SU_Api.m_ErrorCode.UNKNOWN;
		};

		SU_Api.promotionWindow = function (balance) {
			typeof balance === "undefined" && (balance = 0);
			var promotionWindow = document.querySelector("#promotion-window");

			promotionWindow.className = balance > 0 ? "start" : "end";
			promotionWindow.style.display = "block";
		};

		SU_Api.ViewGamesCredit = function () {
			var creditWindow = document.querySelector("#game-credit");
			creditWindow.style.display = "block";

			var closeButton = document.querySelector("#game-credit-close");
			var close = function () {
				creditWindow.style.display = "none";
				closeButton.removeEventListener("click", close);
			};
			closeButton.addEventListener("click", close);
		};
		
		// 遊び方説明は再生中(更新はSU_Api.MainLoopで行う)
		SU_Api.isPlayingHowToMovie = false;
		SU_Api.HowTowMovieSoundBackUp = null;

		// 遊び方ムービーは有効か？
		SU_Api.EnableHowToMovie = function()
		{
			if( typeof window.howToMovieID === "undefined" )
			{
				return false;
			}
			return window.howToMovieID != "";
		}

		// 遊び方ムービーの表示
		SU_Api.PlayHowToMovie = function()
		{
			if( !SU_Api.EnableHowToMovie )
			{
				return;
			}
			$(".js-modal-video").click();
		}
		
	};

	SU_Api.prototype =
	{

	};

	//ファイル読み込み時にSU_Api生成
	new SU_Api();
	SU_Api.Init();

	function apiLoop(event) {
		SU_Api.MainLoop();
		requestAnimationFrame(apiLoop);
	}
	// 次のアニメーションフレームでSU_Api.MainLoopを呼び出してもらう
	requestAnimationFrame(apiLoop);


}	// if(suapi==null)

