define(["modules/photoQuery"],function(ImgQuery){
	var Classify = function() {
		this.imgQuery = new ImgQuery();
	};
	$.extend(Classify.prototype, {
		oneMouseover: function(_this) {
			_this.parent().parent().find("ul").addClass("twoClassifyNone");
			_this.parent().find(">ul").removeClass("twoClassifyNone");
		},
		oneClick: function(_this) {
			$(".oneClassify a").css("color", "rgb(44,62,80)");
			_this.css("color", "rgb(25,185,153)");
			_this.parent().parent().find("ul").addClass("twoClassifyNone");
			_this.parent().find(">ul").removeClass("twoClassifyNone");
			var classify= _this.attr("name");
			$(".photoQuery input").val("");
			$(".inputClassify").val(classify);
			this.imgQuery.getNews("http://192.168.85.73:8002/xhvisionchina/getNews?classify=" +classify+"&pageSize=20", function(data) {
				var data = template("data", data.content);
				$(".data").html(data);
			});
		},
		oneMouseleave: function(_this) {
			_this.find("ul").addClass("twoClassifyNone");
		}
	});
	return Classify;
})
