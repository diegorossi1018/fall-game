var contentWidth = window.innerWidth;
var contentHeight = window.innerHeight;
var adsManager;
var adsLoader;
var adDisplayContainer;
var adContainer;
var isVideoAd;			// 動画広告か？

// ゲームスタートコールバック
var gameStart;
var adsEnd;

// 環境確認用
var isTest = window.location.host !== "h5games.success-corp.co.jp";

// 現在ページ
var descriptionUrl = encodeURIComponent(window.location.href);

var adDisplayContainerInitialized = false;

var setMute = true;
// iPhone
if ( navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('iPad') > 0 ){
    var setMute = true;
}

adContainer = document.getElementById("adContainer");
adDisplayContainer = new google.ima.AdDisplayContainer(adContainer);
adsLoader = new google.ima.AdsLoader(adDisplayContainer);

google.ima.settings.setLocale("ja");
google.ima.settings.setDisableCustomPlaybackForIOS10Plus(false);

adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);

function requestAds() {
    if (!adDisplayContainerInitialized) {	// ゲーム起動時の再生ボタンクリック
        adDisplayContainer.initialize();
        adContainer.removeEventListener("click", playAds);	// click イベント削除
        adDisplayContainerInitialized = true;
        document.getElementById("play").style.display = "none";
    }

    try {
        adsManager.init(contentWidth, contentHeight, google.ima.ViewMode.NORMAL);
        adsManager.start();
    } catch (adError) {
        if (typeof gameStart === "function") {
            gameStart();
            gameStart = undefined;
        }
        else {
            adContainer.style.display = "none";
        }
    }
}

function playAds(onAdComplete, isAfg) {
    adsEnd = isAfg;
    if (typeof onAdComplete === "function") {
        gameStart = onAdComplete;
    }
    var adType = "video";

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = "https://googleads.g.doubleclick.net/pagead/ads?" +
        "ad_type=" + adType +
        "&client=ca-games-pub-1306297722460299" +
        "&description_url=" + descriptionUrl +
        "&videoad_start_delay=0" +
        "&hl=ja" +
        "&max_ad_duration=15000" +
        (isTest ? "&adtest=on" : "");

    adsRequest.forceNonLinearFullSlot = true;

    adsRequest.lineAdSlotWidth = contentWidth;
    adsRequest.lineAdSlotHeight = contentHeight;
    adsRequest.nonLineAdSlotWidth = contentWidth;
    adsRequest.nonLineAdSlotHeight = contentHeight;

    adsRequest.setAdWillPlayMuted(true);
    adsLoader.requestAds(adsRequest);

}
function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    adsManager = adsManagerLoadedEvent.getAdsManager(document.createElement("video"));

    if(setMute){
        adsManager.setVolume(0);
    }
    
    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onAdEvent);
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onAdEvent);
    adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdEvent);
    adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdEvent);

    adDisplayContainer.initialize();
    if (typeof gameStart === "function" && adsEnd) {
        adContainer.addEventListener("click", requestAds);
    }
    else {
        adDisplayContainerInitialized = true;
        requestAds();
    }

}

function onAdEvent(adEvent) {
    var ad = adEvent.getAd();
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED:
            adContainer.style.display = "block";
            break;
        case google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED:
            if (typeof gameStart === "function") {
                gameStart();
                gameStart = undefined;
                if(!adsEnd){
                    adContainer.style.display = "none";
                }
            } else {
                adContainer.style.display = "none";
            }

            break;
        case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
            isVideoAd = undefined;
            adsLoader.contentComplete();
            adsManager.destroy();
            break;
        case google.ima.AdEvent.Type.STARTED:
            var contentType = ad.getContentType().toLowerCase();
            switch (contentType) {
                case "application/javascript":
                case "application/x-shockwave-flash":
                case "video/mp4":
                case "video/mpeg":
                case "application/x-mpegurl":
                case "video/ogg":
                case "video/3gpp":
                case "video/webm":
                case "audio/mpeg":
                case "audio/mp4":
                    isVideoAd = true;
                    break;
                default:
                    isVideoAd = false;
                    break;
            }

            if (isVideoAd) {
                adsManager.resize(contentWidth, contentHeight, google.ima.ViewMode.NORMAL);
                adContainer.setAttribute("class", "playing video");
            }
            else {
                adContainer.setAttribute("class", "playing");
            }

            typeof SnlSound !== 'undefined' && typeof(SnlSound.SetEnableBGM) === 'function' && SnlSound.SetEnableBGM(false);
//            adsManager.setVolume(0);

            break;
        default:
            console.log(adEvent);
            break;
    }
}

function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log('Error : ' + adErrorEvent.getError());
    if (adsManager) {
        adsManager.destroy();
    }
    if (adsLoader) {
        adsLoader.contentComplete();
    }
    if (typeof gameStart === "function") {
        gameStart();
        gameStart = undefined;
    }
    adContainer.style.display = "none";
    //    adContainer.removeAttribute("class");
}