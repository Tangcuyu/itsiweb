		//- 循环打印页面上关于我们的提示信息

		$(document).ready(function(){

			let time = 3500;    // 设定循环的时间间隔
			let key = 0;		// 确定文字数组索引位置的变量
			let nodeText = ['自由的获取你想要的知识！','真切的感受知识的魅力！','循序渐进的提升自身的技能！'];
			let nodeObj = document.getElementById('source');
			let nodeOut = document.getElementById('output');
			
			let nodeOutm = document.getElementById('moutput');

			/*
				函数 insertText：

				把文字数组中的元素，插入到输入节点; 
				根据key的值，判断应该插入那个元素

				返回输入节点对象;

			*/

			function insertText(obj,arr){
				if (!(key<arr.length))
				key = 0;
				obj.innerHTML = arr[key];
				return obj;
			};

			/*
				函数delText:

				把输出节点的文本清空;
				返回输出节点对象;

			*/

			function delText(obj){
				obj.innerHTML = "";
				return obj;
			}
			
			/*
				函数typingText:

				在页面上逐字打印文字内容;
				调用的typing.js的对象方法：typing.start()
				打印完成后，清空输入节点对象文字内容;
				key值递增1;

			*/

			function typingText(objIn, objOut){

				let typing = new Typing({
									    source: objIn,
									    output: objOut,
									    delay: 200
									});
				typing.start();
				delText(objOut);
				key++;
			};

			/*
				利用setInterval循环打印，文字数组中的内容
			
			*/

			let int = setInterval(function timer() {

				typingText(insertText(nodeObj, nodeText),nodeOut);
				typingText(insertText(nodeObj, nodeText),nodeOutm);
			  	
		  	}, time);

		});

			/*
				离开页面后，清楚循环打印进程
	
			*/

		$(document).unload(function(){
				clearInterval(int);
		});