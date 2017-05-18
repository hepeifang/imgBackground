define(function(){
	var ImgShow = function(arg) {};
	$.extend(ImgShow.prototype, {
		"imgMouseEnter": function(_this) {
			_this.find("input").removeClass("inputNone");
			_this.find("div:first").addClass("imgInfo");
			this.imgSrcChange(_this);
		},
		"imgMouseLeave": function(_this) {
			var input = _this.find("input");
			if(input.is(":checked") == false) {
				input.addClass("inputNone")
			}
			this.willDown();
			_this.find("div:first").removeClass("imgInfo");
			this.imgSrcChange(_this);
		},
		"imgSrcChange": function(_this) {
			var img = _this.find("img");
			var src = img.attr("src");
			img.attr("src", img.attr("name"));
			img.attr("name", src);
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
//					type: "post",
					data: json,
//					url:"http://172.18.24.155:8080/download/picture",
					url: "./backTest/newNews.json",
					success: function(data) {
						console.log(data);
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
	return ImgShow;
})
