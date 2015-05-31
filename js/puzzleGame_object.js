/*重要备注：

imgOrigArr 和 imgRanfArr这两个数组分别存放正确顺序排列和乱序排列的碎片信息
数组结构：arr[碎片节点下标] = 碎片显示位置

 */

/**
 * [puzzleGame 向puzzleGame对象中添加属性]
 * @param  {[json格式]} param [图片 路径+名称]
 * @return       [无]
 */
var puzzleGame = function(param){
/************* 参数处理 ******************/
var that = this;
	this.img = param.img || '';//待操作的图片

/************* 节点 ******************/
	this.btnStart = $('#wrap #left ul #start span');//开始游戏按钮
	this.btnLevel = $('#wrap #left ul #level span');//难度选择按钮
	this.btnShow = $('#wrap #left ul #show span');//难度选择按钮
	this.imgArea = $('#wrap #right #imgArea');//图片显示区域
	this.imgWrap = $('#wrap');//图片包裹区域
	this.imgCells = '';//用于记录碎片节点的变量

/************* 变量 ******************/	
	this.imgOrigArr = [];//图片拆分后，存储正确排序的数组
	this.imgRandArr = [];//图片打乱顺序后，存储当前排序的数组
	this.xyOrigArr = [];
	this.testArr = [1];
	this.xyRandArr = new Array();

	this.levelArr = [[2,2],[4,4],[6,6]];//存储难度等级的数组
	this.levelNow = 1;//表示当前难度等级的变量，与难度数组结合使用
	for (var i = 0; i < this.levelArr[this.levelNow][1]; i++) {
		this.xyRandArr[i] = new Array();
	};
	//图片整体的宽高
	this.imgWidth = parseInt(this.imgArea.css('width'));
	this.imgHeight = parseInt(this.imgArea.css('height'));
	//拆分为碎片后，每一块碎片的宽高
	this.cellWidth = this.imgWidth/this.levelArr[this.levelNow][1];
	this.cellHeight = this.imgHeight/this.levelArr[this.levelNow][0];
	this.toNum = 0;//记录有是否开始的变量，默认fasle，未开始
	this.hasStart = 0;//记录有是否开始的变量，默认fasle，未开始
	this.moveTime = 400;//记录animate动画的运动时间，默认400毫秒
	this.startTime = 0;
	this.startStep = 0;
	this.countDown = null;
	//调用初始化函数，拆分图片,绑定按钮功能
	this.init();
}


/**
 * [prototype 在puzzleGame对象中添加方法，用json格式表示]
 * @type {Object}
 */
puzzleGame.prototype = {
	/**
	 * [init 初始化特效设置]
	 * @return [无]
	 */
	init:function(){
		this.imgSplit();
		this.levelSelect();
		this.gameState();
		this.showNum();
		this.resizeCell();

       
	},

	resizeCell:function(){
		var self = this;
		$(window).resize(function(){
			if ($(window).width()<1000) {
			self.imgWrap.css({"width":"900px","height":"900px",})
				//图片整体的宽高

			}else{
			self.imgWrap.css({"width":"530px","height":"530px",})
			}
			
			self.imgWidth = parseInt(self.imgArea.css('width'));
			self.imgHeight = parseInt(self.imgArea.css('height'));
			
			//拆分为碎片后，每一块碎片的宽高
			self.cellWidth = self.imgWidth/self.levelArr[self.levelNow][1];
			self.cellHeight = self.imgHeight/self.levelArr[self.levelNow][0];

			for (var i = 0; i < self.levelArr[self.levelNow][1]; i++) {
				for (var j = 0; j < self.levelArr[self.levelNow][0]; j++) {
				self.imgCells.eq(self.xyOrigArr[i][j]).css({
				'left': self.xyRandArr[i][j]%self.levelArr[self.levelNow][1]*self.cellWidth + 'px',
				'top': Math.floor(self.xyRandArr[i][j]/self.levelArr[self.levelNow][0])*self.cellHeight + 'px',
				'width':self.cellWidth +'px',
				'height':self.cellHeight +'px',
				"background-size": self.imgWidth  +"px " + self.imgHeight + "px",
				'backgroundPosition':(-j)*self.cellWidth + 'px ' + (-i)*self.cellHeight + 'px'
			    });
				};
			};
		})
	},	

	timer:function(startTime){

		countDown = setInterval(function(){
		
			startTime++;/* 累加时间并格式化显示 */
			
			document.getElementById("curTime").innerHTML=('0'+parseInt(startTime/60)).slice(-2)+':'+('0'+startTime%60).slice(-2);
		},1000);

		return countDown;
	},


	glowOnce:function(ro,co,origArr,randArr){
		
		var self = this;
	
		var ifRow = ifCol = 0;
		for (var i = 0; i < this.levelArr[this.levelNow][1]; i++) {
			//console.log(origArr[row][i],randArr[row][i])
			if (origArr[ro][i] == randArr[ro][i]) {
				
				ifRow++;
				if (ifRow == this.levelArr[this.levelNow][1]) {
					//$('.glow').css({'display':'none'})
					for (var m = 0; m < this.levelArr[this.levelNow][1]; m++) {
						self.imgCells.eq(origArr[ro][m]).addClass('glow')
					};
				//$('.glow').css({"-webkit-animation":"twinkling 0.2s infinite ease-in-out"})
				setTimeout('$(".glow").removeClass("glow")',300)
				
				};
				
			}else{
				if (self.imgCells.eq(origArr[ro][i]).hasClass('glow')) {
					self.imgCells.eq(origArr[ro][i]).removeClass('glow')
				};
				
			}
				
		}

		for (var j = 0; j < this.levelArr[this.levelNow][0]; j++) {
			if (origArr[j][co] == randArr[j][co]) {
				//self.imgCells.eq(origArr[j][co]).addClass('glow')
				ifCol++;
				if (ifCol == this.levelArr[this.levelNow][0]) {
					for (var n = 0; n < this.levelArr[this.levelNow][0]; n++) {
						self.imgCells.eq(origArr[n][co]).addClass('glow')
					};
					setTimeout('$(".glow").removeClass("glow")',300)
					//$('.glow').css({"-webkit-animation":"twinkling 0.2s infinite ease-in-out"})
					
				};
			};
				
		}
	
		if (ifRow == this.levelArr[this.levelNow][1] || ifCol == this.levelArr[this.levelNow][0]) {
				return true;
		}else{
			return false;
		}

	},
	/**
	 * [imgSplit 将图片拆分为碎片]
	 * @param  obj    [图片,路径+名称]
	 * @param  cellW  [碎片宽度]
	 * @param  cellH  [碎片高度]
	 * @return        [记录正确排序的数组]
	 */
	imgSplit:function(){
		if ($(window).width()<1000) {
			this.imgWrap.css({"width":"900px","height":"900px",})
				//图片整体的宽高

			}else{
			this.imgWrap.css({"width":"530px","height":"530px",})
			}
			
			this.imgWidth = parseInt(this.imgArea.css('width'));
			this.imgHeight = parseInt(this.imgArea.css('height'));
			
			//拆分为碎片后，每一块碎片的宽高
			this.cellWidth = this.imgWidth/this.levelArr[this.levelNow][1];
			this.cellHeight = this.imgHeight/this.levelArr[this.levelNow][0];
		this.imgOrigArr = [];//清空正确排序的数组
		this.xyOrigArr = [];
		for (var i = 0; i < this.levelArr[this.levelNow][1]; i++) {
			this.xyOrigArr[i] = [];
		};
		//必须清空图片区域的碎片代码，否则每一次拆分图片是与之前拆分的累积
		//例如第一次拆分3x3,插入了9个div，但没有清空，第二次拆分4x4，此时是在前9个div之后再插入14个div，共9+16个div
		this.imgArea.html("");

		var cell = '';//记录单个图片碎片的变量
		for(var i=0;i<this.levelArr[this.levelNow][0];i++){
			for(var j=0;j<this.levelArr[this.levelNow][1];j++){
				//将碎片所属div的下标存入数组，用于最终校验是否排序完成
				this.imgOrigArr.push(i*this.levelArr[this.levelNow][1]+j);
				this.xyOrigArr[i][j] = i*this.levelArr[this.levelNow][1]+j;
				
				cell = document.createElement("div");
				cell.className = "imgCell";
				$(cell).css({
					'width':(this.cellWidth - 2) + 'px',
					'height':(this.cellHeight - 2) + 'px',
					'left':j * this.cellWidth + 'px',
					'top':i * this.cellHeight + 'px',
					"background":"url('"+this.img+"')",
					"background-size": this.imgWidth  +"px " + this.imgHeight + "px",
					'backgroundPosition':(-j)*this.cellWidth + 'px ' + (-i)*this.cellHeight + 'px'
				});
				this.imgArea.append(cell);
			}
		}
		this.imgCells = $('#wrap #right #imgArea div.imgCell');//碎片节点
	},

	levelSelect:function(){

		var len = this.levelArr.length;
		var self = this;
		this.btnLevel.bind('mousedown',function(){
			$(this).addClass('mouseOn');
		}).bind('mouseup',function(){
			$(this).removeClass('mouseOn');
		}).bind('click',function(){
			//判断是否在游戏中
			if(self.hasStart){
				if(!confirm('Change the blocks?')){
					return false;
				}else{
					self.startStep =0;
					self.hasStart = 0;
					
					clearInterval(self.countDown);
					self.startTime = 0;
					self.hasStart = false;
					self.btnStart.text('Finish Puzzle');
					//clearInterval(countDown);
					
				}
			}
			//内容改变
			self.levelNow ++;
			if(self.levelNow >= len){
				self.levelNow = 0;
			}
			//显示的难度改变
			$(this).text(self.levelArr[self.levelNow][0] * self.levelArr[self.levelNow][1] +' Blocks');
			//图片重新拆分(先重新计算宽高)
			self.cellWidth = self.imgWidth/self.levelArr[self.levelNow][1];
			self.cellHeight = self.imgHeight/self.levelArr[self.levelNow][0];
			self.imgSplit();
			
			
			self.gameState();
		});
	},

	/**
	 * [gameStart 开始/回复 游戏的函数]
	 * @return [无]
	 */
	gameState:function(){
		var countDown;
		var self = this;
		startGame();
		function startGame(){
					self.randomArr();
	
		self.cellOrder(self.imgRandArr);
		self.imgCells.css({
			'cursor':'pointer'
		}).bind('mouseover',function(){
			$(this).addClass('hover');
		}).bind('mouseout',function(){
			$(this).removeClass('hover');
		}).on('touchstart.drag.founder mousedown.drag.founder',function(e){
			var ev = e.type == 'touchstart' ? e.originalEvent.touches[0] : e;
			
			/*此处是图片移动*/
			$(this).css('cursor','move');
				
			//所选图片碎片的下标以及鼠标相对该碎片的位置
			var cellIndex_1 = $(this).index();
			//console.log($(this))
			var cell_mouse_x = ev.pageX - self.imgCells.eq(cellIndex_1).offset().left;
			var cell_mouse_y = ev.pageY - self.imgCells.eq(cellIndex_1).offset().top;
			

			$(document).on('touchmove.drag.founder mousemove.drag.founder',function(e){
			var ev = e.type == 'touchmove' ? e.originalEvent.touches[0] : e;
			
				//var ev2 = e2.type == 'touchmove' ? e2.originalEvent.changedTouches[0] : e2;
				self.imgCells.eq(cellIndex_1).css({
					'z-index':'40',
					'left':(ev.pageX - cell_mouse_x - self.imgArea.offset().left) + 'px',
					'top':(ev.pageY - cell_mouse_y - self.imgArea.offset().top) + 'px'
				});
			});


			$(document).on('touchend.drag.founder mouseup.drag.founder',function(e){
		
			var ev = e.type == 'touchend' ? e.originalEvent.changedTouches[0] : e;
			
			
				//var ev3 = e3.type == 'touchend' ? e3.originalEvent.changedTouches[0] : e3;
				//被交换的碎片下标
				var cellIndex_2 = self.cellChangeIndex((ev.pageX-self.imgArea.offset().left),(ev.pageY-self.imgArea.offset().top),cellIndex_1);
				
				
				//碎片交换
				//console.log(cellIndex_1,cellIndex_2);
				if(cellIndex_1 == cellIndex_2){
					self.cellReturn(cellIndex_1);
				}else{
					if (self.hasStart == 0) {
						self.hasStart = 1;
				
			
/*						clearInterval(self.countDown);
						self.startTime = 0;*/
					
					self.countDown = setInterval(function(){
					
						self.startTime++;/* 累加时间并格式化显示 */
						
						document.getElementById("curTime").innerHTML=('0'+parseInt(self.startTime/60)).slice(-2)+':'+('0'+self.startTime%60).slice(-2);
					},1000);
								}

					
					self.startStep++;
					
					document.getElementById("curStep").innerHTML=(self.startStep);
					
					self.cellExchange(cellIndex_1,cellIndex_2);
					

				}
				$(document).off('.drag.founder');
				//移除绑定
				//$(document).unbind('mousemove touchmove').unbind('mouseup touchend');
			});
				e.preventDefault();
		}).on('touchend mouseup',function(){
			$(this).css('cursor','pointer');
		});
		}

		this.btnStart.bind('mousedown',function(){
			if(self.hasStart == 1){
			if(!confirm('Finish the puzzle?')){
				return false;
			}
	//样式恢复
	           		$(this).text('Start Again');
					self.startStep =0;
					
					
					clearInterval(self.countDown);
					self.startTime = 0;
					self.hasStart = 0;
					//复原图片
					self.cellOrder(self.imgOrigArr);
					//取消事件绑定
					self.imgCells.css('cursor','default').unbind('mouseover').unbind('mouseout').unbind('mousedown');	
		}else if(self.hasStart == 0){
			$(this).text('Finish Puzzle');
			startGame();
		}
	})
		// this.btnStart.bind('mousedown',function(){

		// 	$(this).addClass('mouseOn');
		// }).bind('mouseup',function(){
		// 	$(this).removeClass('mouseOn');
		// }).bind('click',function(){
		// 	if(self.hasStart == 0){//不在游戏中
		// 		//开始游戏后部分值、样式设置
		// 		$(this).text('复原');
		// 		self.hasStart = 1;

		// 		//打乱图片
		// 		self.randomArr();
		// 		self.cellOrder(self.imgRandArr);

		// 		//图片事件
		// 		self.imgCells.css({
		// 			'cursor':'pointer'
		// 		}).bind('mouseover',function(){
		// 			$(this).addClass('hover');
		// 		}).bind('mouseout',function(){
		// 			$(this).removeClass('hover');
		// 		}).bind('mousedown',function(e){
		// 			/*此处是图片移动*/
		// 			$(this).css('cursor','move');
		// 				console.log($(this).eq(0))
		// 			//所选图片碎片的下标以及鼠标相对该碎片的位置
		// 			var cellIndex_1 = $(this).index();
		// 			var cell_mouse_x = e.pageX - self.imgCells.eq(cellIndex_1).offset().left;
		// 			var cell_mouse_y = e.pageY - self.imgCells.eq(cellIndex_1).offset().top;

		// 			$(document).bind('mousemove',function(e2){
		// 				self.imgCells.eq(cellIndex_1).css({
		// 					'z-index':'40',
		// 					'left':(e2.pageX - cell_mouse_x - self.imgArea.offset().left) + 'px',
		// 					'top':(e2.pageY - cell_mouse_y - self.imgArea.offset().top) + 'px'
		// 				});
		// 			}).bind('mouseup',function(e3){
		// 				//被交换的碎片下标
		// 				var cellIndex_2 = self.cellChangeIndex((e3.pageX-self.imgArea.offset().left),(e3.pageY-self.imgArea.offset().top),cellIndex_1);
						
		// 				//碎片交换
		// 				if(cellIndex_1 == cellIndex_2){
		// 					self.cellReturn(cellIndex_1);
		// 				}else{
		// 					self.cellExchange(cellIndex_1,cellIndex_2);

		// 				}

		// 				//移除绑定
		// 				$(document).unbind('mousemove').unbind('mouseup');
		// 			});
		// 		}).bind('mouseup',function(){
		// 			$(this).css('cursor','pointer');
		// 		});
		// 	}else if(self.hasStart == 1){
		// 		if(!confirm('已经在游戏中，确定要回复原图？')){
		// 			return false;
		// 		}
		// 		//样式恢复
		// 		$(this).text('开始');
		// 		self.hasStart = 0;

		// 		//复原图片
		// 		self.cellOrder(self.imgOrigArr);

		// 		//取消事件绑定
		// 		self.imgCells.css('cursor','default').unbind('mouseover').unbind('mouseout').unbind('mousedown');				
		// 	}
		// });		
	},

	showNum:function(){

		var self = this;
		this.btnShow.bind('mousedown',function(){
			$(this).addClass('mouseOn');
		}).bind('mouseup',function(){
			$(this).removeClass('mouseOn');
		}).bind('click',function(){
			//判断是否在游戏中
			//if(self.hasStart == 1){
				
				$('#nums').text(self.checkNum(self.imgOrigArr,self.imgRandArr,self.xyOrigArr,self.xyRandArr))
				
			//}

		});

	},
	/**
	 * [randomArr 生成不重复的随机数组的函数]
	 * @return [无]
	 */
	randomArr:function(){
		//清空数组
		var idx = 0;
		this.imgRandArr = [];
		this.xyRandArr = new Array();
		for (var i = 0; i < this.levelArr[this.levelNow][1]; i++) {
			this.xyRandArr[i] = new Array();
			
		};
		var order;//记录随机数，记录图片放置在什么位置
		for(var i=0,len=this.imgOrigArr.length;i<len;i++){
			order = Math.floor(Math.random()*len);
			if(this.imgRandArr.length > 0){
				while(jQuery.inArray(order,this.imgRandArr) > -1){
					order = Math.floor(Math.random()*len);
				}
			}

			this.imgRandArr.push(order);
		}
		for(var x=0,lenx=this.levelArr[this.levelNow][0];x<lenx;x++){
			for (var y = 0,leny=this.levelArr[this.levelNow][1]; y < leny; y++) {
				//var row = Math.floor(y/this.cellHeight),col = Math.floor(x/this.cellWidth),location=row*this.levelArr[this.levelNow][1]+col;
				
				this.xyRandArr[x][y] = this.imgRandArr[idx];
				
				idx++;
			}
		}
		return ;
	},


	/**
	 * [cellOrder 根据数组给图片排序的函数]
	 * @param  arr [用于排序的数组，可以是正序或乱序]
	 * @return     [无]
	 */
	cellOrder:function(arr){
		for(var i=0,len=arr.length;i<len;i++){
			this.imgCells.eq(i).animate({
				'left': arr[i]%this.levelArr[this.levelNow][1]*this.cellWidth + 'px',
				'top': Math.floor(arr[i]/this.levelArr[this.levelNow][0])*this.cellHeight + 'px'
			},this.moveTime);
		}
	},

	/**
	 * [cellChangeIndex 通过坐标，计算被交换的碎片下标]
	 * @param  x    [鼠标x坐标]
	 * @param  y    [鼠标y坐标]
	 * @param  orig [被拖动的碎片下标，防止不符合碎片交换条件时，原碎片返回]
	 * @return      [被交换节点在节点列表中的下标]
	 */
	cellChangeIndex:function(x,y,orig){
		//鼠标拖动碎片移至大图片外
		if(x<0 || x>this.imgWidth || y<0 || y>this.imgHeight){
			return orig;
		}
		//鼠标拖动碎片在大图范围内移动
		var row = Math.floor(y/this.cellHeight),col = Math.floor(x/this.cellWidth),location=row*this.levelArr[this.levelNow][1]+col;
		
		var i=0,len=this.imgRandArr.length;
		while((i<len) && (this.imgRandArr[i] != location)){
			i++;
		}
		//console.log(row,col,location,i)
		return i;

	},

	/**
	 * [cellExchange 两块图片碎片进行交换]
	 * @param  from [被拖动的碎片]
	 * @param  to   [被交换的碎片]
	 * @return      [交换结果，成功为true,失败为false]
	 */
	cellExchange:function(from,to){
		
		var self = this;
		self.testArr[0] = 22;
		//被拖动图片、被交换图片所在行、列
		var rowFrom = Math.floor(this.imgRandArr[from]/this.levelArr[this.levelNow][1]);
		var colFrom = this.imgRandArr[from]%this.levelArr[this.levelNow][1];
		var rowTo = Math.floor(this.imgRandArr[to]/this.levelArr[this.levelNow][1]);
		var colTo = this.imgRandArr[to]%this.levelArr[this.levelNow][1];
		//var locationF=rowFrom*this.levelArr[this.levelNow][1]+colFrom;
		//var locationT=rowTo*this.levelArr[this.levelNow][1]+colTo;
		var temp = this.imgRandArr[from];//被拖动图片下标，临时存储

		var fromIndex =[], toIndex = []

		//console.log(fromIndex[0],fromIndex[1],this.xyRandArr[fromIndex[0]][fromIndex[1]],from)
		//被拖动图片变换位置
		this.imgCells.eq(from).animate({
			'top':rowTo*this.cellHeight + 'px',
			'left':colTo*this.cellWidth + 'px'
		},this.moveTime,function(){
			$(this).css('z-index','10');
		});
		//表交换图片变换位置
		this.imgCells.eq(to).css('z-index','30').animate({
			'top':rowFrom*this.cellHeight + 'px',
			'left':colFrom*this.cellWidth + 'px'
		},this.moveTime,function(){
			$(this).css('z-index','10');
		
			//两块图片交换存储数据
			//console.log(rowFrom,colFrom,rowTo,colTo)
			//console.log(Math.floor(from/4),from%4,from,self.imgRandArr[from],self.imgRandArr[to])
			
			
			self.xyRandArr[Math.floor(from/self.levelArr[self.levelNow][1])][from%self.levelArr[self.levelNow][1]] = self.imgRandArr[from] = self.imgRandArr[to];
			self.xyRandArr[Math.floor(to/self.levelArr[self.levelNow][0])][to%self.levelArr[self.levelNow][0]] = self.imgRandArr[to] = temp;
			
			//console.log(from,self.imgRandArr[from])
			
			self.glowOnce(rowTo,colTo,self.xyOrigArr,self.xyRandArr);
			
			//判断是否完成全部移动，可以结束游戏
			if(self.checkPass(self.imgOrigArr,self.imgRandArr)){
				self.success();
			}
		});
	},


	
	/**
	 * [cellReturn 被拖动图片返回原位置的函数]
	 * @param  index [被拖动图片的下标]
	 * @return       [无]
	 */
	cellReturn:function(index){
		var row = Math.floor(this.imgRandArr[index]/this.levelArr[this.levelNow][1]);
		var col = this.imgRandArr[index]%this.levelArr[this.levelNow][1];

		this.imgCells.eq(index).animate({
			'top':row*this.cellHeight + 'px',
			'left':col*this.cellWidth + 'px'
		},this.moveTime,function(){
			$(this).css('z-index','10');
		});
	},

	/**
	 * [checkPass 判断游戏是否成功的函数]
	 * @param  rightArr  [正确排序的数组]
	 * @param  puzzleArr [拼图移动的数组]
	 * @return           [是否完成游戏的标记，是返回true，否返回false]
	 */
	checkPass:function(rightArr,puzzleArr){

		if(rightArr.toString() == puzzleArr.toString()){
			return true;
		}
		return false;
	},
	/**
	 * [checkPass 判断游戏是否成功的函数]
	 * @param  rightArr  [正确排序的数组]
	 * @param  puzzleArr [拼图移动的数组]
	 * @return           [是否完成游戏的标记，是返回true，否返回false]
	 */
	checkNum:function(rightArr,puzzleArr,xyOrigArr,xyRandArr){
		var corNum = 0;
		
		for (var i = 0; i < xyOrigArr.length; i++) {
			for (var j = 0; j < this.levelArr[this.levelNow][1]; j++) {
				if (xyOrigArr[i][j] != xyRandArr[i][j]) {
					this.imgCells.eq(xyOrigArr[i][j]).addClass('wrong')
					corNum++;
				}else{
					if (this.imgCells.eq(xyOrigArr[i][j]).hasClass('wrong')) {
						this.imgCells.eq(xyOrigArr[i][j]).removeClass('wrong')
					};
				}
			};
		};

		(function(){
        var div=$(".wrong");
        var borderFlag=false;
        var time = 200;
   
         
           
        blinkBorder();
        function blinkBorder()
        {
        	var startBorder = setInterval(function(){modifyBorder()},time); 
            setTimeout(function(){clearInterval(startBorder)},1000);
        }
        function modifyBorder()
        {
            borderFlag=!borderFlag;
            if(borderFlag)
            {
                div.addClass("wrong");    
            }
            else
            {
                div.removeClass("wrong");
            }
        }
})()
		// for (var i = 0; i < rightArr.length; i++) {
		// 	if (rightArr[i] != puzzleArr[i]) {
		// 		corNum++;
		// 	};
		// };
		return corNum;
	},


	/**
	 * [success 成功完成游戏后的处理函数]
	 * @return [description]
	 */
	success:function(){
		//取消样式和事件绑定
		clearInterval(this.countDown);
		for(var i=0,len=this.imgOrigArr.length;i<len;i++){
			if(this.imgCells.eq(i).has('mouseOn')){
				this.imgCells.eq(i).removeClass('mouseOn');
			}
		}
		this.imgCells.unbind('mousedown').unbind('mouseover').unbind('mouseout');
		this.btnStart.text('Start Game');
		this.hasStart = 0;
		alert('You Win! Time:'+this.startTime +' Moves:' + this.startStep);
	}
}

/* 加入图片，运行代码 */
$(function(){
	$('<img/>').attr('src', 'images/man.jpg').load(function() {

   $(this).remove(); // prevent memory leaks as @benweet suggested
   $(".canvasloader-container").remove();
   var pg = new puzzleGame({'img':'images/man.jpg'})
    // $(".wrapper").remove(); 
});
	
});
















