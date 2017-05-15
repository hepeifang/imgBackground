;
(function($) {
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
			this.getNews(function(data) {
				var data = template("data", data.content);
				$(".data").html(data);
				$(".photoMain").addClass("photoAnimation");
			})
		},
		getNews: function(callback) {
			$.ajax({
//				url: "http://192.168.85.73:8002/xhvisionchina/getNews?classify=220636&startTime=" + $(".startTime").val() + "&endTime=" + $(".endTime").val(),
				url: "./backTest/newNews.json",
				type: "get",
				dataType: "json",
				success: function(data) {
					if(data.code == 500) {
						alert("数据检索异常");
					}
					if(data.code == 200) {
						callback(data);
					}
				}
			});
		}
	});
	var ImgShow = function(arg) {};
	$.extend(ImgShow.prototype, {
		"imgMouseEnter": function(_this) {
			_this.find("input").removeClass("inputNone");
			_this.find("div:first").addClass("imgInfo");
			this.imgSrcChange(_this);
		},
		"imgMouseLeave": function(_this) {
			var input = _this.find("input");
			if(input.is(":checked") == false){
				input.addClass("inputNone")
			}
			this.willDown();
			_this.find("div:first").removeClass("imgInfo");
			this.imgSrcChange(_this);
		},
		"imgSrcChange": function(_this) {
			var img = _this.find("img");
			var src = img.attr("src");
			img.attr("src", img.attr("data"));
			img.attr("data", src);
		},
		"imgSelect":function(_this){
			_this.stopPropagation();
			if($(_this.target).attr("type")!="checkbox"){
				var input = $(_this.target).parent("li").find("input");
				var flag=input.is(":checked") == false;
				input.prop("checked", flag? true : false);
			}
		},
		"willDown": function() {
			var index = this.imgCheck();
			index == "" ? $(".down").prop("disabled", true) : $(".down").prop("disabled", false);
		},
		imgCheck: function(flag) {
			var index = [];
			var photoMain = $('.photoMain');
			var img = photoMain.find("img");
			photoMain.find(".imgCheck").each(function(i) {
				if($(this).is(":checked") == true) {
					flag == "downSure" ? index.push(i) : index.push(img[i].src);
				}
			});
			return index;
		},
		downSure: function() {
			var department = $(".department").val();
			var edit = $(".edit").val();
			var index = this.imgCheck("downSure");
			var idsArr = [];
			index.map(function(index) {
				idsArr.push($(".ids").eq(index).val());
			})
			var ids = idsArr.join(",");
			var json = {
				"name": department,
				"depart": edit,
				"ids": ids
			};
			if(department == "") {
				alert("部门不能为空");
			} else if(edit == "") {
				alert("编辑不能为空");
			} else {
				$.ajax({
					type: "post",
					data: json,
					url: "http://172.18.24.155:8080/download/picture",
					success: function(data) {
						var downBar = $(".downBar");
						downBar.find("input").val("");
						downBar.addClass("downBarNone");
						var imgs = this.imgCheck();
						imgs.map(function(i) {
							var a = document.createElement('a');
							a.setAttribute('download', '');
							a.href = i;
							document.body.appendChild(a);
							a.click();
						});
						$(".photoMain input").each(function() {
							$(this).prop("checked", false).addClass("inputNone");
							$(".down").prop("disabled", true);
						});
					}.bind(this),
					error: function() {
						console.log("downSure Error");
					}
				});
			}
		},
		downInfo: function() {
			$(".downBar").removeClass("downBarNone");
		},
		downCancel: function() {
			$(".downBar").addClass("downBarNone");
		},
	});
	var Classify=function(){
		
	};
	$.extend(Classify.prototype,{
		oneClick:function(_this){
			var classname=_this.attr("class");
			var targetname=classname+"-two";
			$(".twoClassify").css("display","none");
			$("."+targetname).css("display","block");
		}
	});
	$(document).ready(function() {
		$(".search").on("click", function() {
			var imgQuery = new ImgQuery();
			imgQuery.search();
		});
		var imgShow = new ImgShow();
		$(".photoMain").on("mouseenter", "li", function() {
			imgShow.imgMouseEnter($(this));
		});
		$(".photoMain").on("mouseleave", "li", function() {
			imgShow.imgMouseLeave($(this));
		});
		$(".photoMain").on("click","li",function(){
			imgShow.imgSelect(event);
		});
		$(".photoMain").on("change", "input", function() {
			imgShow.willDown();
		});
		$(".down").on("click", function() {
			imgShow.downInfo();
		});
		$(".downCancel").on("click", function() {
			imgShow.downCancel();
		});
		$(".downSure").on("click", function() {
			imgShow.downSure();
		});
		$(".date").datepicker({
			showOtherMonths: true,
			selectOtherMonths: true,
			maxDate: new Date(),
			dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			showOn: "button",
			buttonText:"",
			dateFormat: "yy-mm-dd",
		});
		var month = new Date().getMonth() + 1;
		if(month < 10) {
			month = "0" + month;
		}
		var day = new Date().getDate();
		if(day < 10) {
			day = "0" + day;
		}
		$(".date").val(new Date().getFullYear() + "-" + month + "-" + day);
		$(window).scroll(function() {
			var bot = 50; 
			if((bot + $(window).scrollTop()) >= ($(document).height() - $(window).height())) {
				var imgQuery = new ImgQuery();
				imgQuery.getNews(function(data) {
					var data = template("data", data.content);
					$(".data").append(data);
				})
			}
		});
		$(".oneClassify").on("click","li>a",function(){
			var classify=new Classify();
			classify.oneClick($(this));
		})
	})
})(jQuery);