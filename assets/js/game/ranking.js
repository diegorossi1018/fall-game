/**
 * [ WEB / Game ]
 * 
 * @since		2017. 02. 09
 * @update		2017. 02. 21
 * @author		Kang <kang@success-corp.co.jp>
 */
$(document).ready(function() {
	/* [ URL ] から [ game_id ] を取得 */
	var game_id_in_url = function() {
		var path_segment	= window.location.pathname.split("/");

		for ( var i = 0; i < path_segment.length; i++ )
		{
			if ( path_segment[i] === "play" )
			{	// { 0 => "su", 1 => "number", 2 => "name" }
				return parseInt(path_segment[i + 1].split("-")[1]);
			}
		}
	}
	
	/* サーバーからランキングを取得 */
	function ranking(count, is_week, is_last, ui) {
		$.ajax({
			type	: "post",
			url		: "../../ajax/record/ranking.json",
			data	: {
				"game_id"	: game_id_in_url(),
				"count"		: (count >= 100) ? 100 : count,
				"is_week"	: is_week,
				"is_last"	: is_last,
			},
			// 成功した時の処理
			success: function(data) {
				// Ranking
				var html_return = $("<span>");
				
				// 自分の成績
				html_return.append(
					$("<article>")
					.append($("<h2>").text("現在の順位 " + data.myranking.rank + " 位"))
					.append($("<p>"))
					.append($("<p>").text(data.myranking.score + "点"))
				);
		
				// Ranking text
				for ( var i = 0; i < data.ranking.length; i++ )
				{	// 3位以内は画像
					var h2_con	= i < 3 
								? $("<img>").attr({
									src	: "../../assets/img/game/icn-ranking"  + (data.ranking[i].rank) + ".png",
									alt : (data.ranking[i].rank) + "位"
								})
								: $("<span>").text(data.ranking[i].rank);
								
					html_return.append(
						$("<article>").append($("<h2>").append(h2_con).append(data.ranking[i].member))
						.append($("<p>"))
						.append($("<p>").text(data.ranking[i].score + "点"))
					);
				}

				if ( ! ( count >= 100 || count >= data.items ) )
				{
					html_return.append(
						$("<a>").text("もっと見る").click(function() { 
							ranking(count + 10, is_week, is_last, ui);
						})
					);
				}
				
				ui.html(html_return);
			}
		}); // end of $.ajax()
	};
	
	$("#tabs").tabs({
		create: function (event, ui) {
			ranking(10, false, false, ui.panel);
		},
		activate: function(event, ui) {
			switch ( ui.newTab.attr('id') )
			{
				case 'daily':
					ranking(10, false, false, ui.newPanel);
					break;
				case 'yes-daily':
					ranking(10, false, true, ui.newPanel);
					break;
				case 'weekly':
					ranking(10, true, false, ui.newPanel);
					break;
				case 'last-weekly':
					ranking(10, true, true, ui.newPanel);
					break;
			}
			
			ui.oldPanel.empty();
		}
	});
	
});