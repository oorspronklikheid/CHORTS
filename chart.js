

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


function setupSeries(chart , series ,  settings)
{
			
		chartObj[chart].balls[series] = []
	 	chartObj[chart].buffer[series] = [[]]
	 	chartObj[chart].id[series] = [0]

	 	// console.log(chart,series , settings)
	 	chartObj[chart]['seriessettings'][series] = {}
	 	chartObj[chart]['seriessettings'][series]['linecolour'] = 'rgb(200,60,50)'
		chartObj[chart]['seriessettings'][series]['ballcolour'] = '#aa0088'
		chartObj[chart]['seriessettings'][series]['textcolour'] = '#000000FF'
		chartObj[chart]['seriessettings'][series]['mode'] = 'avg'
		chartObj[chart]['seriessettings'][series]['showval'] = 'interesting'

		if(settings == undefined)
			return

	 	if(settings.name != undefined)
	 	{
			chartObj[chart]['seriessettings'][series]['name'] = settings.name
	 	}
	 	if(settings.linecolour != undefined)
	 	{
			chartObj[chart]['seriessettings'][series]['linecolour'] = settings.linecolour
	 	}
	 	if(settings.showval != undefined)
	 	{
			chartObj[chart]['seriessettings'][series]['showval'] = settings.showval
	 	}
		
	 	if(settings.mode != undefined)
	 	{
			chartObj[chart]['seriessettings'][series]['mode'] = settings.mode
	 	}
		
		if(settings.ballcolour != undefined)
			chartObj[chart]['seriessettings'][series]['ballcolour'] = settings.ballcolour

		if(settings.textcolour != undefined)
			chartObj[chart]['seriessettings'][series]['textcolour'] = settings.textcolour
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
	chartObj[i].id =[0]
	chartObj[i].step = 0 ;
	chartObj[i].margins = {}
	chartObj[i].speedbreak = [] 
	chartObj[i].yrange = {min:0 , max:120}
	chartObj[i]['seriessettings'] = []

	// for (var j = 0; j < n; j++) {
	// 	chartObj[i].balls[j] = []
	//  	chartObj[i].buffer[j] = [[]]
	//  	chartObj[i].id[j] = [0]
	// }

	setMargins(i , 0 , 0 , 0) //default

	chartObj[i].svgy = svgy
	chartObj[i].svgy.insertAdjacentHTML('beforeend' , '<rect x="10" y="10" rx="15" ry="15" width=99% height=99% style="fill:#80200010;stroke:#70707000;stroke-width:0.5;opacity:1" />')

	svgy.addEventListener("click" ,  (event  )  => onclickSVG(event,i) )
	svgy.addEventListener("mousemove" ,  onmousemoveSVG )
}


function addDataPoint( chartInstance) 
{


}


function assignClickBack( i , func) 
{
		chartObj[i].clickback = func

}

function	onclickSVG( event , index) 
{
	console.log('received click' , event, index  )

	let mindistance = 10000 
	let minball = -1 

	let chartInstance = chartObj[index]
	for (var k = 0; k < chartInstance.buffer.length; k++) 
	// let k = 1 
	{
		for (var i = 0; i < chartInstance.balls[k].length; i++) 
		{
			// let i =  0 ]
			let curball = chartInstance.balls[k][i]

			if( Math.abs( event.clientX - curball.x  ) < mindistance)
			{
				mindistance  = Math.abs( event.clientX - curball.x  )
				minball = i 
			}

			
		}
	}
		if(minball > -1 )
		{
			console.log( mindistance , minball , chartInstance.balls[0][minball].yValues )
			chartObj[index].clickback(chartInstance.balls[0][minball].yValues)
		}
}


function	onmousemoveSVG(ref  ) 
{
	// console.log('receivedmove' , ref  )
}

function loop( chartInstance) 
{

	let xscale =  (chartInstance.svgy.clientWidth - chartInstance.margins.left)/100
	let yscale =  (chartInstance.svgy.clientHeight - chartInstance.margins.bottom)/(chartInstance.yrange.max - chartInstance.yrange.min) + chartInstance.yrange.min

	for (var i = 0; i < chartInstance.speedbreak.length ; i++) {
		chartInstance.speedbreak[i].clientpos = chartInstance.speedbreak[i].pos * xscale +chartInstance.margins.left
	}

	chartInstance.t ++


	
	for (var k = 0; k < chartInstance.buffer.length; k++) {
		
		if( chartInstance.buffer[k][0].length > 0  )
		{
			let newVal = chartInstance.buffer[k][0].shift()
			let yVal = newVal.yVal
			let yClient = (chartInstance.yrange.max - yVal)*yscale

			
			let age = performance.now() - newVal.time 

			chartInstance.balls[k].push( {x:(chartInstance.svgy.clientWidth-1)  , yClient:yClient , yVal:yVal  , 
																	yValues:[yVal], id:chartInstance.id[k] , dy:0 , mode:'normal' , progress:0 ,
																	opacity:255 , weight:1 , age:age , initage:performance.now()})
			
			let i = chartInstance.balls[k].length - 1 

			let curball = chartInstance.balls[k][i]
			let prevball = -1

			if(i>0)
			{
				prevball = chartInstance.balls[k][i-1]
				chartInstance.svgy.insertAdjacentHTML('beforeend', `<line x1="${prevball.x +5}" y1="${(prevball.yClient +5)}" x2="${(curball.x +5)}" y2="${(curball.yClient  +5)}" style="stroke:${ chartInstance['seriessettings'][k]['linecolour']};stroke-width:1"  />`)
				prevball['elements']['line'] = chartInstance.svgy.lastChild
			}


			curball['elements'] = {}
			chartInstance.svgy.insertAdjacentHTML('beforeend', `<text x="${curball.x}" y="${curball.yClient}"  fill="#000000' + ${dectohex(curball.opacity)} " >${Math.round(curball.yVal*10)/10.0} </text>`)

			curball['elements']['text'] = chartInstance.svgy.lastChild
			
			chartInstance.svgy.insertAdjacentHTML('beforeend', `<circle cx="${curball.x}" cy="${curball.yClient}" r="5" stroke="#eeeeeeff" stroke-width="2" fill="#440088${dectohex(curball.opacity)}"  ) />`)
			curball['elements']['circle'] = chartInstance.svgy.lastChild

			chartInstance.id[k] ++ ;
			// console.log(chartInstance.id[k])
		}
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
	
	for (var k = 0; k < chartInstance.buffer.length; k++) 
	{
		if(chartInstance.balls[k].length>0)
		{
			let firstball = chartInstance.balls[k][0]

			if(firstball.age/1000 > chartInstance.speedbreak[chartInstance.speedbreak.length-1].duration)
			{
				firstball['elements']['line'].remove()
				firstball['elements']['circle'].remove()
				firstball['elements']['text'].remove()
				chartInstance.balls[k].shift()
			}
		}
	}

	for (var k = 0; k < chartInstance.buffer.length; k++) 
	{
		// k = 0 
		for (var i = 0; i < chartInstance.balls[k].length; i++) {

			let breaknum = 2
			for (var j = 0; j < chartInstance.speedbreak.length; j++) 
			{
				let offset 				= breaknum -1
				let curball 			= chartInstance.balls[k][i]
				let prevball 			= chartInstance.balls[k][i-1]
				let prevprevball 	= chartInstance.balls[k][i-2]
				let nextball 			= chartInstance.balls[k][i+1]

			if(curball.x < chartInstance.speedbreak[j].clientpos)
			{
				if(prevball != undefined)
				if(  ( (curball.id  )/(breaknum /2))%2==1 && curball.mode != 'delete' )
				{
					
					prevball.weight += curball.weight
					prevball.yValues = prevball.yValues.concat(curball.yValues)
					// console.log(chartInstance['seriessettings'][k] )

					let prevval = prevball.yValues.reduce( (a,c) => { if(a>c) return a ; return c } );
					let curval  =  curball.yValues.reduce( (a,c) => { if(a>c) return a ; return c } );

					if(chartInstance['seriessettings'][k]['mode'] == "min" )
					{
						prevval = prevball.yValues.reduce( (a,c) => { if(a<c) return a ; return c } );
					  curval  =  curball.yValues.reduce( (a,c) => { if(a<c) return a ; return c } );

					}

					if(chartInstance['seriessettings'][k]['mode'] == "avg" )
					{
						prevball.dy += (curball.yVal + prevball.yVal)/2 - prevball.yVal
						// console.log(prevball.dy )
					}
					if(chartInstance['seriessettings'][k]['mode'] == "max" || 
						 chartInstance['seriessettings'][k]['mode'] == "min"  )
					{
						prevball.dy = (prevval - prevball.yVal ) 
						// console.log(prevball.dy ,curval , prevval , prevball.yVal )
					}
					
					// prevball.weight += curball.weight
					// prevball.yValues = prevball.yValues.concat(curball.yValues)

					if(i>2  && prevprevball.mode == 'delete')
					{
						prevprevball.dy +=  ((curball.yVal + prevball.yVal)/2 - prevball.yVal)/2
						// console.log('prevprevball.dy' , prevprevball.dy)
					}

					curball.dy += ((nextball.yVal) + (prevball.yVal + prevball.dy))/2 - curball.yVal
					curball.mode = 'delete'
				}
			}
				breaknum *= 2
			}
		}
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


	for (var k = 0; k < chartInstance.buffer.length; k++) 
	{
		for (var i = 0; i < chartInstance.balls[k].length; i++) {

			
			let curball = chartInstance.balls[k][i]
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

					chartInstance.balls[k].splice(i, 1)

				}
			}

			let progstep = 0.1 // i dont know why but if this value is 0.5 it causes an error of 0.5 if its 0.1 it causes no error

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

			if(curball.dy != 0 && 
				curball.dy < progstep && 
				curball.dy > -progstep )
			{
				curball.yVal += curball.dy		
				curball.dy   = 0
			}
			curball.yClient = chartInstance.yrange.max*yscale - 1*curball.yVal*yscale
		}
	}
		

	for (var k = 0; k < chartInstance.buffer.length; k++) 
	{
		for (var i = 0; i < chartInstance.balls[k].length; i++) {			

			let curball = chartInstance.balls[k][i]
			let nextball = chartInstance.balls[k][i+1]
				if(curball['elements']['line'] != undefined)
				{
					curball['elements']['line'].setAttribute('x1', (curball.x  ) ) ;
					curball['elements']['line'].setAttribute('y1', (curball.yClient ) ) ;
					curball['elements']['line'].setAttribute('x2', (nextball.x ) ) ;
					curball['elements']['line'].setAttribute('y2', (nextball.yClient  ) ) ;
				}
		}
	}
	for (var k = 0; k < chartInstance.buffer.length; k++) 
	{
		for (var i = 0; i < chartInstance.balls[k].length; i++) {

					let curball = chartInstance.balls[k][i]

					let prevball = -1 
					let nextball = -1 
					if(i>0 )
						prevball= chartInstance.balls[k][i - 1]
					if(i< chartInstance.balls[k].length - 1  )
						nextball= chartInstance.balls[k][i + 1]


					curball['elements']['text'].setAttribute('x', curball.x - 12  ) ;
					curball['elements']['text'].setAttribute('y', curball.yClient - 6  ) ;
					curball['elements']['text'].setAttribute('fill', chartInstance['seriessettings'][k]['textcolour'] + dectohex(curball.opacity) ) ;

					curball['elements']['text'].innerHTML = ''
					if(chartInstance['seriessettings'][k]['showval'] =='yes')
						curball['elements']['text'].innerHTML = Math.round(curball.yVal*10)/10.0 

					if(chartInstance['seriessettings'][k]['showval'] =='interesting')
					{

						if(i == 0 )
							curball['elements']['text'].innerHTML = Math.round(curball.yVal*10)/10.0 

						// console.log(prevball , nextball)
						if(i > 0 && prevball != -1 && nextball != -1)
						{
							// console.log(chartInstance['seriessettings'][k]['showval'])
							if( curball.yVal > prevball.yVal && 
								 curball.yVal > nextball.yVal ||
								 curball.yVal < prevball.yVal && 
								 curball.yVal < nextball.yVal 
								)
							{
								curball['elements']['text'].innerHTML = Math.round(curball.yVal*10)/10.0 
							}


						}
					}

					curball['elements']['circle'].setAttribute('cx', curball.x ) ;
					curball['elements']['circle'].setAttribute('cy', curball.yClient)  ;
					curball['elements']['circle'].setAttribute('fill', chartInstance['seriessettings'][k]['ballcolour'] + dectohex(curball.opacity)  ) ;
		}
	}
}

function dectohex(argument) {
	argument = Math.round(argument)
	let result = argument.toString(16)
	if(result.length < 2)
		result = '0' +  result 
	return result;
}