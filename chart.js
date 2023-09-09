

let chartObj = [{}]

function setMargins( i , left , bottom , top , right) {
	chartObj[i].margins['left'] = left 
	chartObj[i].margins['bottom'] = bottom 
	chartObj[i].margins['top'] = top 
	chartObj[i].margins['right'] = right 

}
function drawAxis(i) 
{
	chartObj[i].svgy.insertAdjacentHTML('beforeend' , '<line x1="' + chartObj[i].margins.left + '" y1="0" x2="' + chartObj[i].margins.left + '" y2="' + 
				chartObj[i].svgy.clientHeight + '" style="stroke:#000f;stroke-width:1" />')

	chartObj[i].svgy.insertAdjacentHTML('beforeend' , '<line x1="0" y1="' + (chartObj[i].svgy.clientHeight-chartObj[i].margins.bottom) + '" x2="' + (chartObj[i].svgy.clientWidth) + '" y2="' + (chartObj[i].svgy.clientHeight-chartObj[i].margins.bottom) + '" style="stroke:#000f;stroke-width:1" />')

}


function setStep( i , newStep)
{
	chartObj[i].step = newStep
}

function addSpeedbreak( i , newspeedbreak)
{
	if(newspeedbreak.label == undefined)
		newspeedbreak.label = newspeedbreak.duration
	chartObj[i].speedbreak.push(newspeedbreak)
}

function setup( i , svgy ) {

	chartObj[i] = {}
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

	setMargins(i , 0 , 0 , 0) //default

	chartObj[i].svgy = svgy
	chartObj[i].svgy.insertAdjacentHTML('beforeend' , '<rect x="10" y="10" rx="15" ry="15" width=99% height=99% style="fill:#80200010;stroke:#70707000;stroke-width:0.5;opacity:1" />')


}


function addDataPoint( chartInstance) 
{



}

function loop( chartInstance) 
{

	let xscale =  (chartInstance.svgy.clientWidth - chartInstance.margins.left)/100
	let yscale =  (chartInstance.svgy.clientHeight - chartInstance.margins.bottom)/(chartInstance.yrange.max - chartInstance.yrange.min) + chartInstance.yrange.min

	for (var i = 0; i < chartInstance.speedbreak.length ; i++) {
		chartInstance.speedbreak[i].clientpos = chartInstance.speedbreak[i].pos * xscale +chartInstance.margins.left
	}

	chartInstance.t ++
	if( chartInstance.buffer[0].length > 0  )
	{
		let newVal = chartInstance.buffer[0].shift()
		let yVal = newVal.yVal
		let yClient = (chartInstance.yrange.max - yVal)*yscale

		
		let age = performance.now() - newVal.time 

		chartInstance.balls.push( {x:(chartInstance.svgy.clientWidth-1)  , yClient:yClient , yVal:yVal  , 
																yValues:[yVal], id:chartInstance.id , dy:0 , mode:'normal' , progress:0 ,
																opacity:255 , weight:1 , age:age , initage:performance.now()})
		
		let i = chartInstance.balls.length - 1 

		let curball = chartInstance.balls[i]
		let prevball = -1

		if(i>0)
		{
			prevball = chartInstance.balls[i-1]
			chartInstance.svgy.insertAdjacentHTML('beforeend', `<line x1="${prevball.x +5}" y1="${(prevball.yClient +5)}" x2="${(curball.x +5)}" y2="${(curball.yClient  +5)}" style="stroke:rgb(200,60,50);stroke-width:1" />`)
			prevball['elements']['line'] = chartInstance.svgy.lastChild
		}


		curball['elements'] = {}
		chartInstance.svgy.insertAdjacentHTML('beforeend', `<text x="${curball.x}" y="${curball.yClient}"  fill="#000000' + ${dectohex(curball.opacity)} " >${Math.round(curball.yVal*10)/10.0} </text>`)

		curball['elements']['text'] = chartInstance.svgy.lastChild
		
		chartInstance.svgy.insertAdjacentHTML('beforeend', `<circle cx="${curball.x}" cy="${curball.yClient}" r="5" stroke="#eeeeeeff" stroke-width="2" fill="#440088${dectohex(curball.opacity)}" />`)
		curball['elements']['circle'] = chartInstance.svgy.lastChild

		chartInstance.id ++ ;
	}

	for (var i = 0; i <= 6; i++) 
	{
		if(chartInstance.lineelements[i] == null)
		{
			chartInstance.svgy.insertAdjacentHTML('beforeend' , '<line x1="' + chartInstance.margins.left + '" y1="' + ( (chartInstance.svgy.clientHeight - chartInstance.margins.bottom)*(6-i)/6 )  + '" x2="' + chartInstance.svgy.clientWidth + '" y2="' + ( (chartInstance.svgy.clientHeight - chartInstance.margins.bottom)*(6-i)/6 )  + '" style="stroke:#aaa8;stroke-width:1" />')
			chartInstance.lineelements[i] = chartInstance.svgy.lastChild
		}else
		{
			chartInstance.lineelements[i].setAttribute('x1', chartInstance.margins.left);
			chartInstance.lineelements[i].setAttribute('y1', ( (chartInstance.svgy.clientHeight - chartInstance.margins.bottom)*(6-i)/6 ));
			chartInstance.lineelements[i].setAttribute('x2', chartInstance.svgy.clientWidth);
			chartInstance.lineelements[i].setAttribute('y2',  ( (chartInstance.svgy.clientHeight - chartInstance.margins.bottom)*(6-i)/6 ));
		}
		if(chartInstance.textelements[i] == null)
		{
			chartInstance.svgy.insertAdjacentHTML('beforeend' , '<text x="' + (chartInstance.margins.left -20  ) + '" y="' + ( (chartInstance.svgy.clientHeight - chartInstance.margins.bottom)*(6-i)/6 + 10)  + '"' + ' fill="#000000ff" >' + (chartInstance.yrange.max*i/6  +chartInstance.yrange.min)  + '</text>')
			chartInstance.textelements[i] = chartInstance.svgy.lastChild
		}else
		{
			chartInstance.textelements[i].setAttribute('x',  (chartInstance.margins.left -20  ));
			chartInstance.textelements[i].setAttribute('y', ( (chartInstance.svgy.clientHeight - chartInstance.margins.bottom)*(6-i)/6 + 10))
		}
	}
	
	if(chartInstance.balls.length>0)
	{
		let firstball = chartInstance.balls[0]

		if(firstball.age/1000 > chartInstance.speedbreak[chartInstance.speedbreak.length-1].duration)
		{
			firstball['elements']['line'].remove()
			firstball['elements']['circle'].remove()
			firstball['elements']['text'].remove()
			chartInstance.balls.shift()
		}
	}

	for (var i = 0; i < chartInstance.balls.length; i++) {

		let breaknum = 2
		for (var j = 0; j < chartInstance.speedbreak.length; j++) 
		{
			let offset = breaknum -1
			let curball = chartInstance.balls[i]
			let prevball = chartInstance.balls[i-1]
			let prevprevball = chartInstance.balls[i-2]
			let nextball = chartInstance.balls[i+1]

		if(curball.x < chartInstance.speedbreak[j].clientpos)
		{
			if(  ( (curball.id  )/(breaknum /2))%2==1 && curball.mode != 'delete')
			{
				prevball.dy += (curball.yVal + prevball.yVal)/2 - prevball.yVal
				prevball.weight += curball.weight
				prevball.yValues = prevball.yValues.concat(curball.yValues)

				if(i>2  && prevprevball.mode == 'delete')
					prevprevball.dy +=  ((curball.yVal + prevball.yVal)/2 - prevball.yVal)/2

				curball.dy += ((nextball.yVal) + (prevball.yVal + prevball.dy))/2 - curball.yVal
				curball.mode = 'delete'

			}
		}
			breaknum *= 2

		}///////////////////////////////////
	}

	for (var i = 0; i < chartInstance.speedbreak.length; i++) {

		let lineelement = chartInstance.xlines[i]
		let textelement = chartInstance.xtexts[i]

		if(lineelement == null)
		{
			chartInstance.svgy.insertAdjacentHTML('beforeend' , '<line x1="' + (chartInstance.speedbreak[i].clientpos)+ '" y1="0" x2="' +  (chartInstance.speedbreak[i].clientpos) + '" y2="' + chartInstance.svgy.clientHeight + '" style="stroke:#aaa8;stroke-width:1" />')
			chartInstance.xlines[i] = chartInstance.svgy.lastChild
		}else
		{
			lineelement.setAttribute('x1',  (chartInstance.speedbreak[i].clientpos) );
			lineelement.setAttribute('y1',  0 );
			lineelement.setAttribute('x2',  (chartInstance.speedbreak[i].clientpos));
			lineelement.setAttribute('y2',  chartInstance.svgy.clientHeight);
		}


		if(textelement == null)
		{

			chartInstance.svgy.insertAdjacentHTML('beforeend' , '<text x="' + (chartInstance.speedbreak[i].clientpos + 6) + '" y="' + (chartInstance.svgy.clientHeight ) + '"' + ' fill="#000000ff" >' + chartInstance.speedbreak[i].label +'</text>')
			chartInstance.xtexts[i] = chartInstance.svgy.lastChild
		}else
		{
			textelement.setAttribute('x', (chartInstance.speedbreak[i].clientpos + 6 )) ;
			textelement.setAttribute('y', (chartInstance.svgy.clientHeight    )) ;
		}

	}

	for (var i = 0; i < chartInstance.balls.length; i++) {

		
		let curball = chartInstance.balls[i]
		// let prevball = -1
			
		// curball.age += chartInstance.step // age in milliseconds
		curball.age  = performance.now() - curball.initage;
		for (var j = 0; j < chartInstance.speedbreak.length; j++) {			

			let prevClientpos = 0 
			let prevTime = 0 
			let currtime = 0
			if(j ==0 ) 
			{
				prevClientpos = chartInstance.svgy.clientWidth
			}else{
				prevClientpos = chartInstance.speedbreak[j-1]['clientpos']	
				prevTime  = chartInstance.speedbreak[j-1]['duration']	
			}
				currtime = chartInstance.speedbreak[j]['duration']

			if(curball.x >= chartInstance.speedbreak[j]['clientpos'] && curball.x < prevClientpos)
			{
				let width = ( prevClientpos - chartInstance.speedbreak[j]['clientpos'])
				let time  = chartInstance.speedbreak[j]['duration'] - prevTime
				let nowstep = chartInstance.step * width / time / 1000
			} 

			if(curball.age /1000 >  prevTime && curball.age  /1000 <  currtime ) // && curball.age > prevTime/1000 )
			{
				// if(i == 0 )
				{
					let ratio = (curball.age/1000 - prevTime) / ( currtime - prevTime  )
					
					curball.x = ( ratio ) * chartInstance.speedbreak[j].clientpos + (1 - ratio)* prevClientpos  
					
				}
			}
		}

		curball.opacity = 255
		if(curball.mode == 'delete')
		{
			if(curball.progress < 100 )
			{
				curball.progress += 4; 
				curball.opacity  = 255 *(100 - curball.progress)/100

			}else
			{
				curball['elements']['line'].remove()
				curball['elements']['circle'].remove()
				curball['elements']['text'].remove()

				chartInstance.balls.splice(i, 1)

			}
		}

		let progstep = 0.5
		if(curball.dy > 5 || curball.dy < -5 )
			progstep = 1 
		if(curball.dy > 50 || curball.dy < -50 )
			progstep = 3 
		if(curball.dy > 75 || curball.dy < -75 )
			progstep = 5 

		if(curball.dy > progstep)
		{
			curball.yVal += progstep	
			curball.dy   -= progstep
		}
		if(curball.dy < -progstep)
		{
			curball.yVal -= progstep		
			curball.dy   += progstep
		}
		if(curball.dy != 0 && curball.dy  <progstep && curball.dy > -progstep )
		{
			curball.yVal += curball.dy		
			curball.dy   = 0
		}
		curball.yClient = chartInstance.yrange.max*yscale - 1*curball.yVal*yscale
	}
		
	for (var i = 0; i < chartInstance.balls.length; i++) {			
		let curball = chartInstance.balls[i]
		let nextball = chartInstance.balls[i+1]
			if(curball['elements']['line'] != undefined)
			{
				curball['elements']['line'].setAttribute('x1', (curball.x ) ) ;
				curball['elements']['line'].setAttribute('y1', (curball.yClient ) ) ;
				curball['elements']['line'].setAttribute('x2', (nextball.x ) ) ;
				curball['elements']['line'].setAttribute('y2', (nextball.yClient  ) ) ;
			}
	}
	for (var i = 0; i < chartInstance.balls.length; i++) {

				let curball = chartInstance.balls[i]
				curball['elements']['text'].setAttribute('x', curball.x ) ;
				curball['elements']['text'].setAttribute('y', curball.yClient ) ;
				curball['elements']['text'].setAttribute('fill', '#000000FF' + dectohex(curball.opacity) ) ;
				if( i > 0 && i < chartInstance.balls.length -1 )
				{
					curball['elements']['text'].innerHTML = Math.round(curball.yVal*10)/10.0 
				}

				curball['elements']['circle'].setAttribute('cx', curball.x ) ;
				curball['elements']['circle'].setAttribute('cy', curball.yClient) ;
				curball['elements']['circle'].setAttribute('fill', '#440088' + dectohex(curball.opacity)  ) ;
	}

}

function dectohex(argument) {
	argument = Math.round(argument)
	let result = argument.toString(16)
	if(result.length < 2)
		result = '0' +  result 
	return result;
}
