require.config({
	urlArgs: "bust=" + (new Date()).getTime() //清缓存
});
require(["modules/classify", "modules/photoQuery", "modules/photoShow"], function(Classify, PhotoQuery, PhotoShow) {
	var page = 1;
	var classify = new Classify();
	var imgQuery = new PhotoQuery();
	var imgShow = new PhotoShow();

	/*默认查询国内新闻*/
	imgQuery.getNews(
//		"http://192.168.85.73:8002/xhvisionchina/getNews?pageSize=20&classify=" + $(".inputClassify").val(),
		"./backTest/newNews.json",
		function(data) {
			var data = template("data", data.content);
			$(".data").html(data);
		});

	/*分类树*/
	imgQuery.getNews("./backTest/classify.json", function(data) {
		var data = template("classify", data);
		$(".oneClassify").html(data);
	})
	$(".oneClassify").on("click", "li>a", function() {
		page = 1;
		classify.oneClick($(this));
	});

	/*图片查询*/
	$(".photoQuery").on("focus", "input:not('.date')", function() {
		imgQuery.inputFocus($(this));
	})
	$(".photoQuery").on("blur", "input", function() {
		imgQuery.inputBlur($(this));
	})
	$(".search").on("click", function() {
		page = 1;
		imgQuery.search();
	});
	$(".down").on("click", function() {
		imgShow.downInfo();
	});
	$(".date").datepicker({
		showOtherMonths: true,
		selectOtherMonths: true,
		maxDate: new Date(),
		dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
		monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
		showOn: "button",
		buttonText: "",
		dateFormat: "yy-mm-dd",
	});

	/*图片展示*/
	$(".photoMain").on("mouseenter", "li", function() {
		imgShow.imgMouseEnter($(this));
	});
	$(".photoMain").on("mouseleave", "li", function() {
		imgShow.imgMouseLeave($(this));
	});
	$(".photoMain").on("change", "input", function() {
		imgShow.willDown();
	});

	/*下载弹框*/
	$(".downCancel").on("click", function() {
		imgShow.downCancel();
	});
	$(".downSure").on("click", function() {
		imgShow.downSure();
	});

	/*分页刷新*/
	$(window).scroll(function() {
		var bot = 50;
		if((bot + $(window).scrollTop()) >= ($(document).height() - $(window).height())) {
			page++;
			imgQuery.getNews("http://192.168.85.73:8002/xhvisionchina/getNews?startTime=" + $(".startTime").val() +
					"&endTime=" + $(".endTime").val() + "&groupTitle=" + $(".title").val() + "&groupExplian=" + $(".digest").val() +
					"&keyword=" + $(".keyword").val() + "&pageSize=20&classify=" + $(".inputClassify").val() + "&pageNo="+page,
					function(data) {
				var data = template("data", data.content);
				$(".data").append(data);
			})
		}
	});

	/*返回Top*/
	$(".upTop").on("click", function() {
		$('body,html').animate({
			scrollTop: 0
		}, 1000);
	})
})