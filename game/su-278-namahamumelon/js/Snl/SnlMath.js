/**
 * @file    SnlMath.js
 * @brief   数学クラス
 * @author  D.Hara
 */
var SnlMath = function () {};

// 二点間の距離を求める(Point={x:?,y:?})
SnlMath.Distance = function (PointA, PointB) {
    return Math.sqrt(
        (PointA.x - PointB.x) * (PointA.x - PointB.x) +
            (PointA.y - PointB.y) * (PointA.y - PointB.y)
    );
};

// 二点間の距離を求める(Point={x:?,y:?,z:?})
SnlMath.Distance3D = function (PointA, PointB) {
    return Math.sqrt(
        (PointA.x - PointB.x) * (PointA.x - PointB.x) +
            (PointA.y - PointB.y) * (PointA.y - PointB.y) +
            (PointA.z - PointB.z) * (PointA.z - PointB.z)
    );
};

// 矩形の当たり判定
SnlMath.HitBox = function (RectA, RectB) {
    if (RectB.w == null) {
        // RectBは点
        if (
            RectA.x <= RectB.x &&
            RectB.x <= RectA.x + RectA.w &&
            RectA.y <= RectB.y &&
            RectB.y <= RectA.y + RectA.h
        ) {
            return true;
        }
    } else {
        if (
            RectA.x <= RectB.x + RectB.w &&
            RectB.x <= RectA.x + RectA.w &&
            RectA.y <= RectB.y + RectB.h &&
            RectB.y <= RectA.y + RectA.h
        ) {
            return true;
        }
    }

    return false;
};

// 弧度法から度数法に変換する定数
SnlMath.RadToDeg = 180 / Math.PI;

// 度数法から弧度法に変換する定数
SnlMath.DegToRad = Math.PI / 180;

// 2つの数値は符号が違う
SnlMath.CodeDiff = function (a, b) {
    var codeA = 0;
    var codeB = 0;
    if (0 < a) {
        codeA = 1;
    }
    if (a < 0) {
        codeA = -1;
    }

    if (0 < b) {
        codeB = 1;
    }
    if (b < 0) {
        codeB = -1;
    }

    return codeA != codeB;
};

// 数値から符号を取得
SnlMath.NumToCode = function (n) {
    if (n == 0) {
        return 0;
    }

    if (0 < n) {
        return 1;
    }

    return -1;
};

// ベクトルの長さ
SnlMath.Vector2Lenght = function (Vec2) {
    return Math.sqrt(Vec2.x * Vec2.x + Vec2.y * Vec2.y);
};

// ベクトルの正規化
SnlMath.Vector2Normalize = function (Vec2) {
    var m = 1 / SnlMath.Vector2Lenght(Vec2);
    Vec2.x *= m;
    Vec2.y *= m;

    return Vec2;
};

// ベクトルのLerp
SnlMath.Vector2Lerp = function (Vec2A, Vec2B, t, isClamp) {
    if (typeof isClamp == "undefined") {
        isClamp = true;
    }

    if (isClamp) {
        t = SnlMath.Clamp(t, 0, 1);
    }

    var r = {
        x: 0,
        y: 0,
    };
    r.x = Vec2A.x + (Vec2B.x - Vec2A.x) * t;
    r.y = Vec2A.y + (Vec2B.y - Vec2A.y) * t;

    return r;
};

// ベクトルAB　(B-A)
SnlMath.CreateVector2 = function (Vec2A, Vec2B) {
    var ret = {
        x: Vec2B.x - Vec2A.x,
        y: Vec2B.y - Vec2A.y,
    };

    return ret;
};

SnlMath.Lerp = function (A, B, t) {
    t = SnlMath.Clamp(t, 0, 1);
    var r = 0;
    r = A + (B - A) * t;
    return r;
};

//数値のクランプ
SnlMath.Clamp = function (Value, Min, Max) {
    return Math.max(Min, Math.min(Max, Value));
};

SnlMath.Big = function (a, b) {
    if (a < b) {
        return b;
    }

    return a;
};

SnlMath.Small = function (a, b) {
    if (a < b) {
        return a;
    }

    return b;
};

// //桁数を得る
SnlMath.Digit = function (src) {
    if (src == undefined || src == null) {
        return 1; //ここは桁数が迷うところ１桁はキープしたいかも
    }
    if (src == 0) {
        return 1;
    }
    //  return Math.floor(Math.log10(src) + 1);//IEでつかえない不具合
    var tmp = Math.abs(src);
    var keta = 1;
    for (;;) {
        tmp = Math.floor(tmp / 10);
        if (tmp == 0) {
            break;
        }
        keta++;
    }
    return keta;
};

//float&doubleの有効桁数を指定して切り捨てる
SnlMath.toFixed = function (src_nun, digit) {
    return Math.floor(src_nun * Math.pow(10, digit)) / Math.pow(10, digit);
};

SnlMath.Add = function (BaseNum, AddNum) {
    if (BaseNum == null) {
        if (AddNum == null) {
            return 0;
        }

        return Number(AddNum);
    }

    if (AddNum == null) {
        return Number(BaseNum);
    }

    return Number(BaseNum) + Number(AddNum);
};

// 配列のシャッフル
SnlMath.ArrayShuffle = function (array) {
    var n = array.length,
        t,
        i;
    while (n) {
        i = Math.floor(Math.random() * n--);
        t = array[n];
        array[n] = array[i];
        array[i] = t;
    }
    return array;
};

SnlMath.LinePointHitCheck = function (LineP1, LineP2, Pos) {
    var DistP1P2 = SnlMath.Distance(LineP1, LineP2);
    var DistP1Pos = SnlMath.Distance(LineP1, Pos);
    var s =
        (LineP2.x - LineP1.x) * (Pos.x - LineP1.x) +
        (LineP2.y - LineP1.y) * (Pos.y - LineP1.y);
    var s2 = DistP1P2 * DistP1Pos;

    if (s == s2) {
        if (DistP1Pos <= DistP1P2) {
            return true;
        }
    }

    return false;
};

// 線分と矩形の当たり判定 矩形RectA 線分p1-p2
SnlMath.LineBoxCrossCheck = function (RectA, p1, p2) {
    // Rectの頂点
    var rp1 = { x: RectA.x, y: RectA.y };
    var rp2 = { x: RectA.x + RectA.w, y: RectA.y };
    var rp3 = { x: RectA.x + RectA.w, y: RectA.y + RectA.h };
    var rp4 = { x: RectA.x, y: RectA.y + RectA.h };

    // Rectの構成線分と時計回りに判定
    if (SnlMath.LineCrossCheck(p1, p2, rp1, rp2)) {
        return true;
    }

    if (SnlMath.LineCrossCheck(p1, p2, rp2, rp3)) {
        return true;
    }

    if (SnlMath.LineCrossCheck(p1, p2, rp3, rp4)) {
        return true;
    }

    if (SnlMath.LineCrossCheck(p1, p2, rp4, rp1)) {
        return true;
    }

    return false;
};

// 線分と矩形の交点を返す( p1→p2 p1に近いほど交点とする )
SnlMath.LineBoxCrossPoint = function (RectA, p1, p2) {
    var Pos = null;

    // Rectの頂点
    var rp1 = { x: RectA.x, y: RectA.y };
    var rp2 = { x: RectA.x + RectA.w, y: RectA.y };
    var rp3 = { x: RectA.x + RectA.w, y: RectA.y + RectA.h };
    var rp4 = { x: RectA.x, y: RectA.y + RectA.h };

    var line = [
        [rp1, rp2],
        [rp2, rp3],
        [rp3, rp4],
        [rp4, rp1],
    ];

    for (var i = 0; i < line.length; i++) {
        var cp = SnlMath.GetLineCrossPoint(p1, p2, line[i][0], line[i][1]);
        if (cp != null) {
            if (Pos == null) {
                Pos = cp;
            } else {
                if (SnlMath.Distance(p1, cp) < SnlMath.Distance(p1, Pos)) {
                    Pos = cp;
                }
            }
        }
    }

    return Pos;
};

// 線分同士の当たり判定(交差判定) 線分p1-p2、線分l1-l2
SnlMath.LineCrossCheck = function (p1, p2, l1, l2) {
    var tp1 = (l1.x - l2.x) * (p1.y - l1.y) + (l1.y - l2.y) * (l1.x - p1.x);
    var tp2 = (l1.x - l2.x) * (p2.y - l1.y) + (l1.y - l2.y) * (l1.x - p2.x);
    var tl1 = (p1.x - p2.x) * (l1.y - p1.y) + (p1.y - p2.y) * (p1.x - l1.x);
    var tl2 = (p1.x - p2.x) * (l2.y - p1.y) + (p1.y - p2.y) * (p1.x - l2.x);

    // 線分同士の当たり判定
    // この判定では同一直線上の線分の当たりがおかしなことになることがある
    if (tl1 * tl2 < 0 && tp1 * tp2 < 0) {
        return true;
    }

    if (tl1 * tl2 == 0 && tp1 * tp2 == 0) {
        if (SnlMath.LinePointHitCheck(p1, p2, l1)) {
            return true;
        }
        if (SnlMath.LinePointHitCheck(p1, p2, l2)) {
            return true;
        }
    }

    return false;
};

// 線分の交点
SnlMath.GetLineCrossPoint = function (p1, p2, l1, l2) {
    if (!SnlMath.LineCrossCheck(p1, p2, l1, l2)) {
        return null;
    }

    var ap1 = { x: 0, y: 0 }; // 交点

    var dev = (p2.y - p1.y) * (l2.x - l1.x) - (p2.x - p1.x) * (l2.y - l1.y);
    if (!dev) {
        return null;
    }

    var d1, d2;

    d1 = l1.y * l2.x - l1.x * l2.y;
    d2 = p1.y * p2.x - p1.x * p2.y;

    ap1.x = d1 * (p2.x - p1.x) - d2 * (l2.x - l1.x);
    ap1.x /= dev;
    ap1.y = d1 * (p2.y - p1.y) - d2 * (l2.y - l1.y);
    ap1.y /= dev;

    return ap1;
};

//ベクトル外積
SnlMath.CrossVector2D = function (vl, vr) {
    return vl.x * vr.y - vl.y * vr.x;
};

// ベクトル内積
SnlMath.DotVector2D = function (vl, vr) {
    return vl.x * vr.x + vl.y * vr.y;
};

//点Pと線(AB)の距離
SnlMath.DistancePointToLine = function (Point, LineA, LineB) {
    var AB = { x: 0, y: 0 };
    var AP = { x: 0, y: 0 };

    AB.x = LineB.x - LineA.x;
    AB.y = LineB.y - LineA.y;
    AP.x = Point.x - LineA.x;
    AP.y = Point.y - LineA.y;

    //ベクトルAB、APの外積の絶対値が平行四辺形Dの面積になる
    var D = Math.abs(SnlMath.CrossVector2D(AB, AP));
    var L = SnlMath.Distance(LineA, LineB); //AB間の距離
    var H = D / L;

    return H;
};

// 角度を0-360で正規化
SnlMath.FixDeg = function (Deg) {
    while (Deg < 0) {
        Deg += 360;
    }

    while (360 <= Deg) {
        Deg -= 360;
    }

    return Deg;
};

// 二角度間の角度差
SnlMath.DegDistance = function (DegA, DegB) {
    DegA = SnlMath.FixDeg(DegA);
    DegB = SnlMath.FixDeg(DegB);

    if (DegA < DegB) {
        if (DegB - DegA <= 180) {
            return DegB - DegA;
        } else {
            return -DegA - (360 - DegB);
        }
    } else {
        if (DegA - DegB <= 180) {
            return -(DegA - DegB);
        }
        /*
		else
		{
			return ( 360 - DegA ) + DegB;
		}
		*/
    }

    return 360 - DegA + DegB;
};

// 移動時間と移動距離と初速から加速（減速）を求める (MoveDist=BaseSpeed*Time+0.5*Acc*Time*Time)
SnlMath.CalcAcc = function (MoveDist, BaseSpeed, Time) {
    return ((MoveDist - BaseSpeed * Time) / (Time * Time)) * 2;
};

// 摩擦と速度0になるまでの時間から初速を求める
SnlMath.CalcBaseSpeed = function (Acc, Time) {
    return Math.abs(Acc) * Time;
};
// 加速と移動距離と移動時間から初速を求める
SnlMath.CalcBaseSpeed2 = function (Acc, MoveDist, Time) {
    return -((0.5 * Acc * Time * Time - MoveDist) / Time);
};

// 移動時間と移動距離から初速と停止のための減速を求める
SnlMath.CalcSpeedAndAcc = function (MoveDist, Time) {
    var v = {};
    v.Acc = (-2 * MoveDist) / (Time * Time);
    v.Base = -v.Acc * Time;

    return v;
};

// int配列を使用した抽選( n番目の抽選確率 RateArray[n] / RateArrayの総和 )
SnlMath.Lottery = function (RateArray) {
    var RateMax = 0;
    for (var i = 0; i < RateArray.length; i++) {
        if (0 < RateArray[i]) {
            RateMax += RateArray[i];
        }
    }

    var Rate = Math.floor(Math.random() * RateMax);

    RateMax = 0;
    for (var i = 0; i < RateArray.length; i++) {
        if (0 < RateArray[i]) {
            if (RateMax <= Rate && Rate < RateMax + RateArray[i]) {
                return i;
            }

            RateMax += RateArray[i];
        }
    }

    // ここには来ないがエラー防止用
    return 0;
};

SnlMath.prototype = {};
