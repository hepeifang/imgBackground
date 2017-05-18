define(function(){
	var ImgQuery = function() {
		this.keyword = $(".photoQuery").find(".keyword").val();
		this.startTime = Date.parse(new Date($(".photoQuery").find($(".startTime")).val())) / 1000;
		this.endTime = Date.parse(new Date($(".photoQuery").find($(".startTime")).val())) / 1000;
	};
	$.extend(ImgQuery.prototype, {
		"search": function() {
			if(this.startTime - this.endTime > 0) {
				alert("开始时间必须小于结束时间");
			}
			this.getNews("http://192.168.85.73:8002/xhvisionchina/getNews?startTime=" + $(".startTime").val() +
				"&endTime=" + $(".endTime").val() + "&groupTitle=" + $(".title").val() + "&groupExplian=" +
				$(".digest").val()+"&keyword="+$(".keyword").val()+"&pageSize=20&classify="+$(".inputClassify").val(),
				function(data) {
					var data = template("data", data.content);
					$(".data").html(data);
					$(".photoMain").addClass("photoAnimation");
				})
		},
		getNews: function(url, callback) {
			$.ajax({
				url: url,
				type: "get",
				dataType: "json",
				success: function(data) {
					if(data.code == 500) {
						alert("数据检索异常");
					}
					callback(data);
				}
			});
		},
		inputFocus: function(_this) {
			_this.addClass("inputBlur");
		},
		inputBlur: function(_this) {
			_this.removeClass("inputBlur");
		}
	});
	return ImgQuery;
})