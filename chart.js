

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
	// add new ball
	if( chartInstance.buffer[0].length > 0  )
	{
		let newVal = chartInstance.buffer[0].shift()
		let yVal = newVal.yVal
		// console.log(yVal)
		let yClient = (chartInstance.yrange.max - yVal)*yscale

		let age = performance.now() - newVal.time 
		// console.log(age )
		chartInstance.balls.push( {x:(chartInstance.svgy.clientWidth-1)  , yClient:yClient , yVal:yVal  , yValues:[yVal], id:chartInstance.id , dy:0 , mode:'normal' , progress:0 ,opacity:255 , weight:1 , age:age , initage:performance.now()})

		let i = chartInstance.balls.length - 1 

		if(i>0)
		{

			chartInstance.svgy.insertAdjacentHTML('beforeend', '<line x1="' + (chartInstance.balls[i-1].x +5) + '" y1="' + (chartInstance.balls[i-1].yClient +5) + '" x2="' + (chartInstance.balls[i].x +5) + '" y2="' + (chartInstance.balls[i].yClient  +5)+ '" style="stroke:rgb(200,60,50);stroke-width:1" />')

			chartInstance.balls[i-1]['elements']['line'] = chartInstance.svgy.lastChild
		}

		chartInstance.balls[i]['elements'] = {}
		
		chartInstance.svgy.insertAdjacentHTML('beforeend', '<text x="' + chartInstance.balls[i].x + '" y="' + chartInstance.balls[i].yClient + '"' + ' fill="#000000' + dectohex(chartInstance.balls[i].opacity) + '" >' + Math.round(chartInstance.balls[i].yVal*10)/10.0 + '</text>')
		chartInstance.balls[i]['elements']['text'] = chartInstance.svgy.lastChild
		
		chartInstance.svgy.insertAdjacentHTML('beforeend', '<circle cx="' + chartInstance.balls[i].x + '" cy="' + chartInstance.balls[i].yClient + '" r="' + 5 + '" stroke="#eeeeeeff" stroke-width="2" fill="#440088' + dectohex(chartInstance.balls[i].opacity) + '" />')
		chartInstance.balls[i]['elements']['circle'] = chartInstance.svgy.lastChild
		

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

		//
		if(chartInstance.balls[0].age/1000 > chartInstance.speedbreak[chartInstance.speedbreak.length-1].duration)
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
			if(  ( (chartInstance.balls[i].id  )/(breaknum /2))%2==1 && chartInstance.balls[i].mode != 'delete')
			{
				chartInstance.balls[i-1].dy += (chartInstance.balls[i].yClient + chartInstance.balls[i-1].yClient)/2 - chartInstance.balls[i-1].yClient
				chartInstance.balls[i-1].weight += chartInstance.balls[i].weight
				chartInstance.balls[i-1].yValues = chartInstance.balls[i-1].yValues.concat(chartInstance.balls[i].yValues)

				if(i>2  && chartInstance.balls[i-2].mode == 'delete')
					chartInstance.balls[i-2].dy +=  ((chartInstance.balls[i].yClient + chartInstance.balls[i-1].yClient)/2 - chartInstance.balls[i-1].yClient)/2

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
			chartInstance.svgy.insertAdjacentHTML('beforeend' , '<text x="' + (chartInstance.speedbreak[i].clientpos + 10) + '" y="' + (chartInstance.svgy.clientHeight -15) + '"' + ' fill="#000000ff" >' + chartInstance.speedbreak[i].duration +'</text>')
			chartInstance.xtexts[i] = chartInstance.svgy.lastChild
		}else
		{
			textelement.setAttribute('x', (chartInstance.speedbreak[i].clientpos + 10)) ;
			textelement.setAttribute('y', (chartInstance.svgy.clientHeight  -15 )) ;

		}


	}


	for (var i = 0; i < chartInstance.balls.length; i++) {

		
		// chartInstance.balls[i].age += chartInstance.step // age in milliseconds
		chartInstance.balls[i].age  = performance.now() - chartInstance.balls[i].initage;
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

			if(chartInstance.balls[i].x >= chartInstance.speedbreak[j]['clientpos'] && chartInstance.balls[i].x < prevClientpos)
			{
				let width = ( prevClientpos - chartInstance.speedbreak[j]['clientpos'])
				let time  = chartInstance.speedbreak[j]['duration'] - prevTime
				let nowstep = chartInstance.step * width / time / 1000
			} 

			if(chartInstance.balls[i].age /1000 >  prevTime && chartInstance.balls[i].age  /1000 <  currtime ) // && chartInstance.balls[i].age > prevTime/1000 )
			{
				// if(i == 0 )
				{
					let ratio = (chartInstance.balls[i].age/1000 - prevTime) / ( currtime - prevTime  )
					
					chartInstance.balls[i].x = ( ratio ) * chartInstance.speedbreak[j].clientpos + (1 - ratio)* prevClientpos  
					
				}


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
				// console.log('chartInstance.balls[i]' )
				 // console.log(chartInstance.balls[i]);
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
				if( i > 0 && i < chartInstance.balls.length -1 )
				{

					if((chartInstance.balls[i].yVal > chartInstance.balls[i-1].yVal &&
					 chartInstance.balls[i].yVal > chartInstance.balls[i+1].yVal) || 
						(chartInstance.balls[i].yVal < chartInstance.balls[i-1].yVal &&
					 chartInstance.balls[i].yVal < chartInstance.balls[i+1].yVal)
					)
					{
						chartInstance.balls[i]['elements']['text'].innerHTML = Math.round(chartInstance.balls[i].yVal*10)/10.0 
					}else
					{
						chartInstance.balls[i]['elements']['text'].innerHTML = chartInstance.balls[i].weight
					}
				}
				// chartInstance.balls[i]['elements']['text'].innerHTML = "(" +  chartInstance.balls[i].weight + ")"
				 // chartInstance.balls[i]['elements']['text'].innerHTML = JSON.stringify(chartInstance.balls[i].yValues)
				 // chartInstance.balls[i]['elements']['text'].innerHTML = JSON.stringify(chartInstance.balls[i].yValues.map(function(each_element){ return Number(each_element.toFixed(2));}));

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
