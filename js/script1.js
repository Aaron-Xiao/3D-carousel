"use strict";

var images = ["3.jpg", "2.jpg", "1.png", "4.png"];

var cubicSize = 50;

var wraper = $("#wraper");

var rows = wraper.height() / cubicSize;
var cols = wraper.width() / cubicSize;

wraper.html(function() {
	var html1 = "";
	var html2 = "";
	var html3 = "";
	for (var i = 0; i < cols * rows; i++) {
		html1 += "<div class='box'></div>";
	}
	html2 = "<div class='pic'>" + html1 + "</div>";
	for (var j = 0; j < images.length; j++) {
		html3 += html2;
	}
	return html3;
})

var boxs = $(".box");

boxs.each(function() {
	$(this).css({
		"width": (cubicSize - 2) + "px",
		"height": (cubicSize - 2) + "px"
	})
})


// 二维数组函数
// 将传入的 obj 排列成二维数组，之后就可以使用 obj[][] 的方式调用
var coordinate = function(obj, rows, cols) {
	var arr1 = [];
	for (var i = 0; i < rows; i++) {
		var arr2 = [];
		for (var j = 0; j < cols; j++) {
			obj[i * cols + j].xIndex = j;
			obj[i * cols + j].yIndex = i;
			arr2.push(obj[i * cols + j]);
		}
		arr1.push(arr2);
	}
	return arr1;
}


// 核心动画函数
var change = function(arr, x, y, speed, fn, delay) {

	if(speed < 0 && x < 0 || y < 0) {
		return;
	}

	if(speed > 0 && x > cols - 1 || y > rows - 1) {
		return;
	}

	if(fn) {
		fn.call(arr[y][x]);
		setTimeout(function() {
			change(arr, x + speed, y, speed, fn, delay);
			change(arr, x, y + speed, speed, fn, delay);
		}, delay)
	}
}




var pics = $(".pic");

var arr = [];

pics.each(function(index, obj) {

	$(this).css({
		"position": "absolute",
		"z-index": images.length - index
	})

	var eles = $(this).find(".box").get();

	var arr2d = coordinate(eles, rows, cols);

	arr.push(arr2d);

	$(this).find(".box").each(function() {
		$(this).css({
			"background-image": "url(images/" + images[index] + ")",
			"background-position": -this.xIndex * cubicSize + "px " + -this.yIndex * cubicSize + "px"
		})
	})

})


var btns = $(".btn");

// 当前图片的索引
var current = 0;


// 焦点切换
btns.each(function(index, obj) {
	$(this).click(function() {
		var target = index;

		btns.each(function(index, obj) {
			if($(this).hasClass("active")) {
				current = index;
			}
		})

		changeColor(current, target);

		// 上翻
		if(target > current) {
			flipUp(current, target);
		}

		// 下翻
		if(target < current) {
			flipDown(current, target);
		}

		current = target;
	})
})


// 改变焦点背景颜色
var changeColor = function(current, target) {
	btns.eq(current).removeClass("active");
	btns.eq(target).addClass("active");
}

// 上翻函数
var flipUp = function(current, target) {

	// 确定目标图片与当前图片的层叠关系
	pics.each(function(index, obj) {
		if(index == current) {
			$(this).css("z-index", 10);
		} else if(index == target) {
			$(this).css("z-index", 5);
		} else {
			$(this).css("z-index", 0);
		}
	})

	// 目标图片就位
	$(pics.eq(target).find(".box")).css({
		"borderColor": "rgba(255,255,255,0)",
		"box-shadow": "0 0 0 #fff",
		"transform": "translateX(0px) translateY(0px) rotateX(0deg) rotateY(0deg)",
		"opacity": 1,
		"transition": "all 0s"
	})

	// 当前图片上翻
	change(arr[current], cols - 1, rows - 1, -1, function() {
		$(this).css({
			"borderColor": "rgba(255,255,255,.5)",
			"box-shadow": "0 0 50px #fff",
			"transform": "translateX(-50px) translateY(-50px) rotateX(-720deg) rotateY(-720deg)",
			"opacity": 0,
			"transition": "background-image .5s, border .2s, box-shadow .3s .1s, transform 1s .3s, opacity 1.3s"
		});
	}, 50)
}


// 下翻函数
var flipDown = function(current, target) {

	// 确定目标图片与当前图片的层叠关系
	pics.each(function(index, obj) {
		if(index == current) {
			$(this).css("z-index", 5);
		} else if(index == target) {
			$(this).css("z-index", 10);
		} else {
			$(this).css("z-index", 0);
		}
	})

	// 目标图片就位
	$(pics.eq(target).find(".box")).css({
		"borderColor": "rgba(255,255,255,0.5)",
		"box-shadow": "0 0 50px #fff",
		"transform": "translateX(-50px) translateY(-50px) rotateX(-720deg) rotateY(-720deg)",
		"opacity": 0,
		"transition": "all 0s"
	})

	// 目标图片下翻
	change(arr[target], 0, 0, 1, function() {
		$(this).css({
			"borderColor": "rgba(255,255,255,0)",
			"box-shadow": "0 0 0px #fff",
			"transform": "translateX(0px) translateY(0px) rotateX(0deg) rotateY(0deg)",
			"opacity": 1,
			"transition": "background-image .5s, border .2s, box-shadow .3s .1s, transform 1s .3s, opacity 1.3s"
		});
	}, 50)
}


// 切换下一张
var next = function() {
	var target = current + 1;
	if(target > images.length - 1) {
		target = 0;
	}

	changeColor(current, target);

	flipUp(current, target);

	current = target;
}


// 切换上一张
var prev = function() {
	var target = current - 1;
	if(target < 0) {
		target = images.length - 1;
	}

	changeColor(current, target);

	flipDown(current, target);

	current = target;
}


$("#next").click(function() {
	next();
})

$("#prev").click(function() {
	prev();
})


var timer = null;

timer = setInterval(function() {
	next();
}, 3000)


$("#wraper, .btn, #prev, #next").on({
	"mouseenter": function() {
		clearInterval(timer);
	},
	"mouseleave": function() {
		timer = setInterval(function() {
			next();
		}, 3000)		
	}
})