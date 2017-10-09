"use strict";
$(document).ready(function() {

	var images = ["3.jpg", "2.jpg", "1.png", "4.png"];

	var cubicSize = 20;

	var wraper = $("#wraper");

	wraper.html(function() {
		var count = wraper.width() / cubicSize;
		var html1 = "";
		var html2 = "";
		var html3 = "";
		for (var i = 0; i < 4; i++) {
			html1 += "<div class='pic'></div>";
		}
		html2 = "<div class='box'>" + html1 + "</div>";
		for (var j = 0; j < count; j++) {
			html3 += html2;
		}
		return html3;
	})


	$(".box, .pic").css("width", cubicSize + "px");

	var boxs = $(".box");

	var pics = $(".pic");

	var btns = $(".btn");

	var current = 0;

	boxs.each(function(index, obj) {
		$(this).css("left", index * cubicSize + "px");
	})


	// 为什么立即执行的匿名函数会报错 ？？？
	// (function() {
		for (var i = 0; i < images.length; i++) {
			$(".pic:nth-child(" + (i + 1) + ")").each(function(index, obj) {
				$(this).css({
					"background-image": "url(images/" + images[i] + ")",
					"background-position": -index * cubicSize + "px 0px"
				})
			})	
		}
	// })()



	// 记录旋转了多少个 90deg
	var deg = 0;


	// 小立方体某一面的索引
	var picIndex = 1;

	btns.each(function(index, obj) {
		$(this).click(function() {
			var target = index;
			var cur = (function() {
				var cur;
				btns.each(function(index, obj) {
					if($(this).hasClass("active")) {
						cur = index;
						return false;
					}
				})
				return cur;
			})()


			$(btns.eq(cur)).removeClass("active");
			$(this).addClass("active");

			// X 轴顺时针转 90deg ，将目标图片定位在底面
			if(target > cur) {
				deg++;
				picIndex--;
				if(picIndex < 1) {
					picIndex = 4;
				}
				$(".pic:nth-child("+ picIndex +")").css("background-image", "url(images/" + images[target] + ")");

				boxs.each(function(index, obj) {
					$(this).css({
						"transform": "translateZ(-140px) rotateX(" + (deg * 90) + "deg)",
						"transition": "transform 1s " + index * 50 + "ms"
					});
				})
			}

			// X 轴逆时针转 90deg ，将目标图片定位在顶面
			if(target < cur) {
				deg--;
				picIndex++;
				if(picIndex > 4) {
					picIndex = 1;
				}
				$(".pic:nth-child("+ picIndex +")").css("background-image", "url(images/" + images[target] + ")");

				boxs.each(function(index, obj) {
					$(this).css({
						"transform": "translateZ(-140px) rotateX(" + (deg * 90) + "deg)",
						"transition": "transform 1s " + index * 50 + "ms"
					});
				})
			}

			current = target;

		})
	})


	var next = function() {
		
		var target = current + 1;

		if(target > images.length - 1) {
			target = 0;
		}

		picIndex--;
		if(picIndex < 1) {
			picIndex = 4;
		}
			
		// X 轴顺时针转 90deg ，将目标图片定位在底面

		deg++;

		$(".pic:nth-child("+ picIndex +")").css("background-image", "url(images/" + images[target] + ")");

		boxs.each(function(index, obj) {
			$(this).css({
				"transform": "translateZ(-140px) rotateX(" + (deg * 90) + "deg)",
				"transition": "transform 1s " + index * 50 + "ms"
			});
		})

		btns.eq(current).removeClass("active");
		btns.eq(target).addClass("active");
		
		current = target;
	}

	$("#next").click(function() {
		next();
	})


	var prev = function() {
		
		var target = current - 1;

		if(target < 0) {
			target = images.length - 1;
		}

		picIndex++;

		if(picIndex > 5) {
			picIndex = 2;
		}

		if(picIndex > 4) {
			picIndex = 1;
		}
			
		// X 轴顺时针转 90deg ，将目标图片定位在底面

		deg--;
		$(".pic:nth-child("+ picIndex +")").css("background-image", "url(images/" + images[target] + ")");

		boxs.each(function(index, obj) {
			$(this).css({
				"transform": "translateZ(-140px) rotateX(" + (deg * 90) + "deg)",
				"transition": "transform 1s " + index * 50 + "ms"
			});
		})

		btns.eq(current).removeClass("active");
		btns.eq(target).addClass("active");

		current = target;
		
	}

	$("#prev").click(function() {
		prev();
	})

	var timer = null;

	timer = setInterval(function() {
		next();
	}, 5000)

	$(".wraper, .btn, #prev, #next").on({
		"mouseenter": function() {
			clearInterval(timer);
		},
		"mouseleave": function() {
			timer = setInterval(function() {
				next();
			}, 5000)
		}
	})


})