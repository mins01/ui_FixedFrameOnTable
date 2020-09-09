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

	FixedFrameOnTable.initColgroup(this.content);
	FixedFrameOnTable.initColgroup(this.header00);
	FixedFrameOnTable.initColgroup(this.header01);
	FixedFrameOnTable.initColgroup(this.header10);


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
		if(height_tds.length>0){
			this.header10.querySelectorAll('tr > *:first-child').forEach((item, i) => {
				let rect = height_tds[i].getBoundingClientRect();
				item.height = rect.height;
			});
		}

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

FixedFrameOnTable.prototype.toData = function(){
	var rows = [];
	var row = null,tr=null,cell=null,def_i;
	if(this.header00){
		let header00_json = FixedFrameOnTable.tableToData(this.header00)
		rows = header00_json;
		def_i = rows.length;
	}
	if(this.header01){
		let header01_json =FixedFrameOnTable.tableToData(this.header01)
		if(rows.length>0){
			header01_json.forEach((row, i) => {
				rows[i] = rows[i].concat(row);
			});
		}else{
			rows = header01_json;
			def_i = rows.length;
		}
	}
	if(this.header10){
		let header10_json =FixedFrameOnTable.tableToData(this.header10)
		header10_json.forEach((row, i) => {
			rows.push(row);
		});

	}
	if(this.content){
		let content_json =FixedFrameOnTable.tableToData(this.content)
		if(rows.length>0){
			content_json.forEach((row, i) => {
				rows[i+def_i] = rows[i+def_i].concat(row);
			});
		}
	}
	return rows
}
//--
FixedFrameOnTable.dataToCsv = function(rows){
	var csvRows = [],txt='';
	rows.forEach((row, i) => {
		csvRows.push('"'+row.join('","').replace(/(\r\n|\r|\n)/g," ")+'"');
	});
	return csvRows.join("\n");
}
//--
FixedFrameOnTable.tableToData = function(table){
	var rows = [];
	var row = null,tr=null,cell=null;
	if(table){
		for(var i=0,m=table.rows.length;i<m;i++){
			tr = table.rows[i]
			row = []
			for(var i2=0,m2=tr.cells.length;i2<m2;i2++){
				cell = tr.cells[i2];
				row.push(cell.innerText)
			}
			rows.push(row)
		}
	}
	return rows;
}
//--
FixedFrameOnTable.initColgroup = function(tbl){ //테이블에 colgroup 이 있는지 체크하고 없으면, 만든다.
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
	let max_tds = max_tr?max_tr.querySelectorAll('td,th'):null;
	while(max_tds && i < max_count_td){
		col = document.createElement('col');
		rect = max_tds[i].getBoundingClientRect();
		col.width =rect.width;
		colgroup.append(col);
		i++;
	}
	tbl.append(colgroup)
	return max_count_td;
}
/**
 * [description]
 * @param  {HTML_TABLE} table    원본테이블
 * @param  {int} rowCount fixed row 수
 * @param  {int} colCount fixed column 수
 * @param  {DomNode} ffotNode null 일 경우 자동으로 만들어진다. node가 있을 경우 그 node에 ffot를 적용시킨다.
 * @return {FixedFrameOnTable}          ffot 객체
 */
FixedFrameOnTable.tableToFfot = function(table,rowCount,colCount,ffotNode){
	// let table = tableNode.cloneNode(true)
	if(!ffotNode){
		ffotNode = document.createElement('div');
	}
	FixedFrameOnTable.initColgroup(table);
	// console.log(table);
	ffotNode.classList.add('ffot');
	let scrollbar = document.createElement('div');
	scrollbar.className = 'ffot-scrollbar';
	ffotNode.append(scrollbar)
	let containerLeft = document.createElement('div');
	containerLeft.className = 'ffot-container-left';
	scrollbar.append(containerLeft)
	let containerBody= document.createElement('div');
	containerBody.className = 'ffot-container-body';
	scrollbar.append(containerBody)

	let clonedTable = table.cloneNode(false);
	clonedTable.removeAttribute('id');
	clonedTable.append(document.createElement('colgroup'));

	let header00 = null,header10=null,header01=null;
	if(rowCount>0 && colCount > 0){
		header00 = clonedTable.cloneNode(true);
		header00.createTBody()
		header00.classList.add('ffot-header-00');
		containerLeft.append(header00)
	}
	if(colCount > 0){

		header10 = clonedTable.cloneNode(true);
		header10.createTBody()
		header10.classList.add('ffot-header-10');
		if(rowCount==0){
			containerBody.classList.add('ffot-container-body-dir-row');
			containerBody.append(header10)
		}else{
			containerLeft.append(header10)
		}

	}
	if(rowCount > 0){
		header01 = clonedTable.cloneNode(true);
		header01.createTBody()
		header01.classList.add('ffot-header-01');
		containerBody.append(header01)
	}
	let content= clonedTable.cloneNode(true);
	content.createTBody()
	content.classList.add('ffot-content');
	containerBody.append(content)


	let trs = table.rows;
	if(trs.length<rowCount){
		console.error("테이블에서 가져올 수 있는 rowCount가 넘었습니다.");
		return false;
	}
	let tr = null , cells = null , cell=null, ttr1=null, ttr2=null, idx=0,idxSpan=0;
	for(var i=0,m=rowCount;i<m;i++){ //상단 처리
		tr = trs[i];
		cells = tr.cells
		ttr1 = tr.cloneNode(false)
		ttr2 = tr.cloneNode(false)
		idx = 0;
		idxSpan = 0;
		while(cells[idx]){
			if(idxSpan < colCount){
				ttr1.append(cells[idx].cloneNode(true))
			}else{
				ttr2.append(cells[idx].cloneNode(true))
			}
			idxSpan+=cells[idx].colSpan;
			idx++;
		}
		if(header00){
			header00.tBodies[0].append(ttr1)
		}
		if(header01){
			header01.tBodies[0].append(ttr2);
		}
	}
	for(m=trs.length;i<m;i++){ //하단 처리
		tr = trs[i];
		cells = tr.cells
		ttr1 = tr.cloneNode(false)
		ttr2 = tr.cloneNode(false)
		idx = 0;
		idxSpan = 0;
		while(cells[idx]){
			if(idxSpan < colCount){
				ttr1.append(cells[idx].cloneNode(true))
			}else{
				ttr2.append(cells[idx].cloneNode(true))
			}
			idxSpan+=cells[idx].colSpan;
			idx++;
		}
		if(header10){
			header10.tBodies[0].append(ttr1)
		}
		if(content){
			content.tBodies[0].append(ttr2);
		}
	}
	//-- colgroup 복사
	let cols = table.querySelectorAll('col'),colgroup=null;
	for(var i2=0,m2=colCount;i2<m2;i2++){ //header10
		if(header00) header00.querySelector('colgroup').append(cols[i2].cloneNode(true));
		if(header10) header10.querySelector('colgroup').append(cols[i2].cloneNode(true));
	}
	for(m2=cols.length;i2<m2;i2++){ //content
		if(header01) header01.querySelector('colgroup').append(cols[i2].cloneNode(true));
		if(content) content.querySelector('colgroup').append(cols[i2].cloneNode(true));
	}

	return new FixedFrameOnTable(ffotNode);

}
