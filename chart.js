

let chartObj = [{}]

function setMargins( i , left , bottom , top , right) {
	chartObj[i].margins['left'] = left 
	chartObj[i].margins['bottom'] = bottom 
	chartObj[i].margins['top'] = top 
	chartObj[i].margins['right'] = right 

	svgy1.insertAdjacentHTML('beforeend' , '<line x1="' + chartObj[i].margins.left + '" y1="0" x2="' + chartObj[i].margins.left + '" y2="' + 
				svgy1.clientHeight + '" style="stroke:#000f;stroke-width:1" />')

	svgy1.insertAdjacentHTML('beforeend' , '<line x1="0" y1="' + (svgy1.clientHeight-chartObj[i].margins.bottom) + '" x2="' + (svgy1.clientWidth) + '" y2="' + (svgy1.clientHeight-chartObj[i].margins.bottom) + '" style="stroke:#000f;stroke-width:1" />')
}


function setStep( i , newStep)
{
	chartObj[i].step = newStep
}

function addSpeedbreak( i , newspeedbreak)
{
	chartObj[i].speedbreak.push(newspeedbreak)
}

function setup(svgy , i  ) {

	chartObj[i].balls = []
	chartObj[i].buffer = [[]]
	chartObj[i].lineelements = []
	chartObj[i].textelements = []
	chartObj[i].xlines = []
	chartObj[i].xtexts = [] 
	chartObj[i].t = 0 
	chartObj[i].id =0 
	chartObj[i].step = 0 ;
	chartObj[i].margins = {}
	chartObj[i].speedbreak = [] 
	chartObj[i].yrange = {min:0 , max:120}

	setMargins(0 , 0 , 0 , 0) //default

	svgy1 = svgy
	svgy1.insertAdjacentHTML('beforeend' , '<rect x="10" y="10" rx="15" ry="15" width=99% height=99% style="fill:#80200010;stroke:#70707000;stroke-width:0.5;opacity:1" />')


}


function loop( chartInstance) 
{

	let xscale =  (svgy1.clientWidth - chartInstance.margins.left)/100
	let yscale =  (svgy1.clientHeight - chartInstance.margins.bottom)/(chartInstance.yrange.max - chartInstance.yrange.min) + chartInstance.yrange.min

	for (var i = 0; i < chartInstance.speedbreak.length ; i++) {
		chartInstance.speedbreak[i].clientpos = chartInstance.speedbreak[i].pos * xscale +chartInstance.margins.left
	}

	chartInstance.t ++

	if( chartInstance.buffer[0].length > 0  )
	{
		let yVal = chartInstance.buffer[0].shift()
		let yClient = (chartInstance.yrange.max - yVal)*yscale

		chartInstance.balls.push( {x:(svgy1.clientWidth-1)  , yClient:yClient , yVal:yVal , id:chartInstance.id , dy:0 , mode:'normal' , progress:0 ,opacity:255})

		let i = chartInstance.balls.length - 1 

		if(i>0)
		{

			svgy1.insertAdjacentHTML('beforeend', '<line id="' + ('ballline' + chartInstance.balls[i-1].id ) + '" x1="' + (chartInstance.balls[i-1].x +5) + '" y1="' + (chartInstance.balls[i-1].yClient +5) + '" x2="' + (chartInstance.balls[i].x +5) + '" y2="' + (chartInstance.balls[i].yClient  +5)+ '" style="stroke:rgb(200,60,50);stroke-width:2" />')

			chartInstance.balls[i-1]['elements']['line'] = svgy1.lastChild
		}

		chartInstance.balls[i]['elements'] = {}
		
		svgy1.insertAdjacentHTML('beforeend', '<text id="' + ('balltext' + chartInstance.balls[i].id)  +'" x="' + chartInstance.balls[i].x + '" y="' + chartInstance.balls[i].yClient + '"' + ' fill="#000000' + dectohex(chartInstance.balls[i].opacity) + '" >' + Math.round(chartInstance.balls[i].yVal*10)/10.0 + '</text>')
		chartInstance.balls[i]['elements']['text'] = svgy1.lastChild
		
		svgy1.insertAdjacentHTML('beforeend', '<circle id="' + ('ballcircle' + chartInstance.balls[i].id) + '" cx="' + chartInstance.balls[i].x + '" cy="' + chartInstance.balls[i].yClient + '" r="' + 5 + '" stroke="#eeeeeeff" stroke-width="2" fill="#440088' + dectohex(chartInstance.balls[i].opacity) + '" />')
		chartInstance.balls[i]['elements']['circle'] = svgy1.lastChild
		

		chartInstance.id ++ ;
	}

	for (var i = 0; i <= 6; i++) 
	{
   
		if(chartInstance.lineelements[i] == null)
		{
			svgy1.insertAdjacentHTML('beforeend' , '<line id="' + ('yline' + i) + '" x1="' + chartInstance.margins.left + '" y1="' + ( (svgy1.clientHeight - chartInstance.margins.bottom)*(6-i)/6 )  + '" x2="' + svgy1.clientWidth + '" y2="' + ( (svgy1.clientHeight - chartInstance.margins.bottom)*(6-i)/6 )  + '" style="stroke:#aaa8;stroke-width:1" />')
			chartInstance.lineelements[i] = svgy1.lastChild
		}else
		{
			chartInstance.lineelements[i].setAttribute('x1', chartInstance.margins.left);
			chartInstance.lineelements[i].setAttribute('y1', ( (svgy1.clientHeight - chartInstance.margins.bottom)*(6-i)/6 ));
			chartInstance.lineelements[i].setAttribute('x2', svgy1.clientWidth);
			chartInstance.lineelements[i].setAttribute('y2',  ( (svgy1.clientHeight - chartInstance.margins.bottom)*(6-i)/6 ));
		}
		if(chartInstance.textelements[i] == null)
		{
			svgy1.insertAdjacentHTML('beforeend' , '<text id="' + 'ytext' + i + '" x="' + (chartInstance.margins.left -20  ) + '" y="' + ( (svgy1.clientHeight - chartInstance.margins.bottom)*(6-i)/6 + 10)  + '"' + ' fill="#000000ff" >' + (chartInstance.yrange.max*i/6  +chartInstance.yrange.min)  + '</text>')
			chartInstance.textelements[i] = svgy1.lastChild
		}else
		{
			chartInstance.textelements[i].setAttribute('x',  (chartInstance.margins.left -20  ));
			chartInstance.textelements[i].setAttribute('y', ( (svgy1.clientHeight - chartInstance.margins.bottom)*(6-i)/6 + 10))
		}
	}
	
	if(chartInstance.balls.length>0)
	{
		if(chartInstance.balls[0].x < chartInstance.margins.left )
		{
			chartInstance.balls[0]['elements']['line'].remove()
			chartInstance.balls[0]['elements']['circle'].remove()
			chartInstance.balls[0]['elements']['text'].remove()
			chartInstance.balls.shift()
		}
	}
	for (var i = 0; i < chartInstance.balls.length; i++) {

		let breaknum = 2
		for (var j = 0; j < chartInstance.speedbreak.length; j++) 
		{
			let offset = breaknum -1

		if(chartInstance.balls[i].x < chartInstance.speedbreak[j].clientpos)
		{
			// console.log(offset + ' , ' + chartInstance.balls[i].id + ' , ' + (breaknum /2))
			if(  ( (chartInstance.balls[i].id  )/(breaknum /2))%2==1 && chartInstance.balls[i].mode != 'delete')
			{
				chartInstance.balls[i-1].dy += (chartInstance.balls[i].yClient + chartInstance.balls[i-1].yClient)/2 - chartInstance.balls[i-1].yClient
				if(i>2  && chartInstance.balls[i-2].mode == 'delete')
					chartInstance.ball[i-2].dy +=  ((chartInstance.balls[i].yClient + chartInstance.balls[i-1].yClient)/2 - chartInstance.balls[i-1].yClient)/2

				chartInstance.balls[i].dy += ((chartInstance.balls[i+1].yClient) + (chartInstance.balls[i-1].yClient+chartInstance.balls[i-1].dy))/2 - chartInstance.balls[i].yClient
				chartInstance.balls[i].mode = 'delete'

			}
		}
			breaknum *= 2

		}
	}

	for (var i = 0; i < chartInstance.speedbreak.length; i++) {

		let lineelement = chartInstance.xlines[i]
		let textelement = chartInstance.xtexts[i]

		if(lineelement == null)
		{
			svgy1.insertAdjacentHTML('beforeend' , '<line id="' + ('xline' + i ) + '" x1="' + (chartInstance.speedbreak[i].clientpos)+ '" y1="0" x2="' +  (chartInstance.speedbreak[i].clientpos) + '" y2="' + svgy1.clientHeight + '" style="stroke:#aaa8;stroke-width:1" />')
			chartInstance.xlines[i] = svgy1.lastChild
		}else
		{
			lineelement.setAttribute('x1',  (chartInstance.speedbreak[i].clientpos) );
			lineelement.setAttribute('y1',  0 );
			lineelement.setAttribute('x2',  (chartInstance.speedbreak[i].clientpos));
			lineelement.setAttribute('y2',  svgy1.clientHeight);
		}


		if(textelement == null)
		{
			svgy1.insertAdjacentHTML('beforeend' , '<text id="' + ('xtext' + i ) + '" x="' + (chartInstance.speedbreak[i].clientpos + 10) + '" y="' + (svgy1.clientHeight -15) + '"' + ' fill="#000000ff" >' + chartInstance.speedbreak[i].duration +'</text>')
			chartInstance.xtexts[i] = svgy1.lastChild
		}else
		{
			textelement.setAttribute('x', (chartInstance.speedbreak[i].clientpos + 10)) ;
			textelement.setAttribute('y', (svgy1.clientHeight  -15 )) ;

		}


	}


	for (var i = 0; i < chartInstance.balls.length; i++) {

		for (var j = 0; j < chartInstance.speedbreak.length; j++) {			

			let prevClientpos = 0 
			let prevTime = 0 
			if(j ==0 ) 
			{
				prevClientpos = svgy1.clientWidth
			}else{
				prevClientpos = chartInstance.speedbreak[j-1]['clientpos']	
				prevTime  = chartInstance.speedbreak[j-1]['duration']	
			}

			if(chartInstance.balls[i].x >= chartInstance.speedbreak[j]['clientpos'] && chartInstance.balls[i].x < prevClientpos)
			{
				let width = ( prevClientpos - chartInstance.speedbreak[j]['clientpos'])
				let time  = chartInstance.speedbreak[j]['duration'] - prevTime
				let nowstep = chartInstance.step * width / time / 1000
				// console.log(nowstep)
				chartInstance.balls[i].x	-= nowstep 
			} 
		}

		chartInstance.balls[i].opacity = 255
		if(chartInstance.balls[i].mode == 'delete')
		{
			if(chartInstance.balls[i].progress < 100 )
			{
				chartInstance.balls[i].progress += 4; 
				chartInstance.balls[i].opacity = 255 *(100 - chartInstance.balls[i].progress)/100

			}else
			{
				chartInstance.balls[i]['elements']['line'].remove()
				chartInstance.balls[i]['elements']['circle'].remove()
				chartInstance.balls[i]['elements']['text'].remove()

				chartInstance.balls.splice(i, 1)

			}
		}

		let progstep = 1
		if(chartInstance.balls[i].dy > 25 || chartInstance.balls[i].dy < -25 )
			progstep = 3 
		if(chartInstance.balls[i].dy > 50 || chartInstance.balls[i].dy < -50 )
			progstep = 5 
		if(chartInstance.balls[i].dy > 75 || chartInstance.balls[i].dy < -75 )
			progstep = 7 
		if(chartInstance.balls[i].dy > progstep)
		{
			chartInstance.balls[i].yClient += progstep	
			chartInstance.balls[i].dy-= progstep
		}
		if(chartInstance.balls[i].dy < -progstep)
		{
			chartInstance.balls[i].yClient -= progstep		
			chartInstance.balls[i].dy+= progstep
		}
		if(chartInstance.balls[i].dy != 0 && chartInstance.balls[i].dy  <progstep && chartInstance.balls[i].dy > -progstep )
		{
			chartInstance.balls[i].yClient += chartInstance.balls[i].dy		
			chartInstance.balls[i].dy= 0
		}
		chartInstance.balls[i].yVal = chartInstance.yrange.max - chartInstance.balls[i].yClient/yscale 

	}


		

	for (var i = 0; i < chartInstance.balls.length; i++) {

			// console.log(type(chartInstance.balls[i]['elements']['line'])
			if(chartInstance.balls[i]['elements']['line'] != undefined)
			{

			chartInstance.balls[i]['elements']['line'].setAttribute('x1', (chartInstance.balls[i].x ) ) ;
			chartInstance.balls[i]['elements']['line'].setAttribute('y1', (chartInstance.balls[i].yClient ) ) ;
			chartInstance.balls[i]['elements']['line'].setAttribute('x2', (chartInstance.balls[i+1].x ) ) ;
			chartInstance.balls[i]['elements']['line'].setAttribute('y2', (chartInstance.balls[i+1].yClient  ) ) ;
			}


	}
	for (var i = 0; i < chartInstance.balls.length; i++) {

				chartInstance.balls[i]['elements']['text'].setAttribute('x', chartInstance.balls[i].x ) ;
				chartInstance.balls[i]['elements']['text'].setAttribute('y', chartInstance.balls[i].yClient ) ;
				chartInstance.balls[i]['elements']['text'].setAttribute('fill', '#000000FF' + dectohex(chartInstance.balls[i].opacity) ) ;
				chartInstance.balls[i]['elements']['text'].innerHTML = Math.round(chartInstance.balls[i].yVal*10)/10.0 

				chartInstance.balls[i]['elements']['circle'].setAttribute('cx', chartInstance.balls[i].x ) ;
				chartInstance.balls[i]['elements']['circle'].setAttribute('cy', chartInstance.balls[i].yClient) ;
				chartInstance.balls[i]['elements']['circle'].setAttribute('fill', '#440088' + dectohex(chartInstance.balls[i].opacity)  ) ;
	}

}

function dectohex(argument) {
	argument = Math.round(argument)
	let result = argument.toString(16)
	if(result.length < 2)
		result = '0' +  result 
	return result;
}
