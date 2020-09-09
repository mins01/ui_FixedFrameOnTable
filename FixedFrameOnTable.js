'use strict';

const FixedFrameOnTable = function(ffot){

	this.init(ffot);
}
FixedFrameOnTable.prototype.ffot = null;
FixedFrameOnTable.prototype.scrollbar = null;
FixedFrameOnTable.prototype.containerLeft = null;
FixedFrameOnTable.prototype.containerBody = null;
FixedFrameOnTable.prototype.header00 = null;
FixedFrameOnTable.prototype.header01 = null;
FixedFrameOnTable.prototype.header10 = null;
FixedFrameOnTable.prototype.content = null;
FixedFrameOnTable.prototype.useSyncScrollTop = false;
FixedFrameOnTable.prototype.init = function(ffot){
	this.ffot = ffot
	this.scrollbar = ffot.querySelector('.ffot-scrollbar');
	this.containerLeft = ffot.querySelector('.ffot-container-left');
	this.containerBody = ffot.querySelector('.ffot-container-body');
	this.header00 = ffot.querySelector('.ffot-header-00');
	this.header01 = ffot.querySelector('.ffot-header-01');
	this.header10 = ffot.querySelector('.ffot-header-10');
	this.content = ffot.querySelector('.ffot-content');
	this.useSyncScrollTop = !!ffot.querySelector('.ffot-container-left .ffot-header-10');

	this.initColgroup(this.content);
	this.initColgroup(this.header00);
	this.initColgroup(this.header01);
	this.initColgroup(this.header10);


	this.initEvent();
}
FixedFrameOnTable.prototype.initEvent = function(){
	this.fbcResizeObserver  = new ResizeObserver(function(thisC){
		return function(els){
			for(let i=0,m=els.length;i<m;i++){
				// let el = els[i];
				thisC.syncSizeContent( )
			}
		}
	}(this));
	this.flhResizeObserver  = new ResizeObserver(function(thisC){
		return function(els){
			for(let i=0,m=els.length;i<m;i++){
				// let el = els[i];
				thisC.syncSizeHeader00( )
			}
		}
	}(this));
	this.fbcResizeObserver.observe(this.content);
	if(this.header00) this.flhResizeObserver.observe(this.header00);
	if(this.useSyncScrollTop){
		this.scrollbar.addEventListener('scroll',function(thisC){
			return function(event){
				thisC.syncScrollTop(event.target)
			}
		}(this));
	}

}
FixedFrameOnTable.prototype.initColgroup = function(tbl){ //테이블에 colgroup 이 있는지 체크하고 없으면, 만든다.
	if(!tbl || tbl.nodeName!='TABLE'){ return false;}
	var cols = tbl.querySelectorAll('col');
	if(cols.length>0){return true;}
	let max_count_td = 0;
	let max_tr = null,tds = null;
	tbl.querySelectorAll('tr').forEach((tr, i) => {
		tds = tr.querySelectorAll('td,th')
		if(max_count_td < tds.length){
			max_tr = tr;
		}
		max_count_td = Math.max(max_count_td,tds.length);
	});
	;
	var colgroup = document.createElement('colgroup');
	let i=0,col=null,rect=null;
	let max_tds = max_tr.querySelectorAll('td,th');
	while(i < max_count_td){
		col = document.createElement('col');
		rect = max_tds[i].getBoundingClientRect();
		col.width =rect.width;
		colgroup.append(col);
		i++;
	}
	tbl.append(colgroup)
	return max_count_td;
}
FixedFrameOnTable.prototype.sync = function(){
	this.syncSizeHeader00();
	this.syncSizeContent();
}
FixedFrameOnTable.prototype.syncSizeHeader00 = function(){
	let ffot= this.ffot
	if(!this.header00){return;}
	if(this.header00.nodeName =='TABLE'){
		let cw = 0;
		this.header00.querySelectorAll('col').forEach(function(el){cw+=parseInt(el.width);});
		this.header00.style.width=cw+'px';
		if(this.header10) this.header10.style.width=cw+'px';
	}

	let rect_flh = this.header00.getBoundingClientRect();
	this.header01.style.height = rect_flh.height+"px";
	this.containerBody.style.left = rect_flh.width+"px";

	if(this.header01){
		let height_tds = this.header00.querySelectorAll('tr > *:first-child')
		this.header01.querySelectorAll('tr > *:first-child').forEach((item, i) => {
			let rect = height_tds[i].getBoundingClientRect();
			item.height = rect.height;
		});
	}

	if(this.header10){
		let width_cols = this.header00.querySelectorAll('col')
		this.header10.querySelectorAll('col').forEach((item, i) => {
			if(!width_cols[i]){return}
			// let rect = width_cols[i].getBoundingClientRect();
			item.width = width_cols[i].width;
		});
	}

}
FixedFrameOnTable.prototype.syncSizeContent = function(){
	let ffot= this.ffot

	let rect_fbc = this.content.getBoundingClientRect();

	if(this.content.nodeName =='TABLE'){
		if(this.scrollbar.scrollWidth > this.scrollbar.offsetWidth ){
			this.content.style.width="100%";
			if(this.header01) this.header01.style.width="100%";
		}else{
			let cw = 0;
			this.content.querySelectorAll('col').forEach(function(el){cw+=parseInt(el.width);});
			this.content.style.width=cw+'px';
			if(this.header01) this.header01.style.width=cw+'px';
		}
	}

	if(this.header10){
		this.header10.style.height = rect_fbc.height+"px";
		let height_tds = this.content.querySelectorAll('tr > *:first-child')
		this.header10.querySelectorAll('tr > *:first-child').forEach((item, i) => {
			let rect = height_tds[i].getBoundingClientRect();
			item.height = rect.height;
		});
	}

	if(this.header01){
		let width_cols = this.content.querySelectorAll('col')
		let cols = this.header01.querySelectorAll('col').forEach((item, i) => {
			if(!width_cols[i]){return}
			item.width = width_cols[i].width;
		});
	}

}
FixedFrameOnTable.prototype.syncScrollTop = function(ta){
	// let ta = evt.target;
	let el = this.header10;
	el.style.transform="translateY(-"+ta.scrollTop+"px)";
}
