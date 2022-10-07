
let balls = []
let funballs = []

let svgy1 = document.getElementById('svgy')
let groupy = document.getElementById('groupy')
let ngroupy = document.getElementById('ngroupy')
let select = document.getElementById('select')

let buffer = [[]]


let t = 0 
let id =0 

let step = 0 ;

	let margins = {}
	let speedbreak = [] 
	let yrange = {min:0 , max:120}


function setMargins(left , bottom , top , right) {
	margins['left'] = left 
	margins['bottom'] = bottom 
	margins['top'] = top 
	margins['right'] = right 
}


function setStep(newStep)
{
	step = newStep
}

setStep(1000/30)
function addSpeedbreak(newspeedbreak)
{
	speedbreak.push(newspeedbreak)
}

setMargins(25,15,15,0)
addSpeedbreak({duration:5 ,	 pos:85 })
// addSpeedbreak( {duration:15 	, pos:70 })
addSpeedbreak({duration:35 	, pos:55 })
// addSpeedbreak( {duration:75 	, pos:40 })
addSpeedbreak({duration:155 	, pos:25 })
// addSpeedbreak( {duration:600 	, pos:10 })
addSpeedbreak({duration:1200 	, pos:0 })
function loop(svgy ) 
{

	// console.log(svgy.clientWidth)


	let xscale =  (svgy.clientWidth - margins.left)/100
	let yscale =  (svgy.clientHeight - margins.bottom)/(yrange.max - yrange.min) + yrange.min

	for (var i = 0; i < speedbreak.length ; i++) {
		speedbreak[i].clientpos = speedbreak[i].pos * xscale +margins.left
		// console.log(speedbreak[i])
	}

	t ++

	if( buffer[0].length > 0  )
	{
		// console.log(y)
		// yVal = 100
		let yVal = buffer[0].shift()
		let yClient = (yrange.max - yVal)*yscale

		balls.push( {x:(svgy.clientWidth-1)  , yClient:yClient , yVal:yVal , id:id , dy:0 , mode:'normal' , progress:0 ,opacity:255})

		let i = balls.length - 1 
	
		if(i>0)
		{

			ngroupy.innerHTML += '<line id="' + ('ballline' + balls[i-1].id ) + '" x1="' + (balls[i-1].x +5) + '" y1="' + (balls[i-1].yClient +5) + '" x2="' + (balls[i].x +5) + '" y2="' + (balls[i].yClient  +5)+ '" style="stroke:rgb(200,60,50);stroke-width:2" />'
			// let ballelement = document.getElementById('ballline' + balls[i-1].id );
			balls[i-1]['elements']['line'] = document.getElementById('ballline' + balls[i-1].id );
		}

		ngroupy.innerHTML += '<text id="' + ('balltext' + balls[i].id)  +'" x="' + balls[i].x + '" y="' + balls[i].yClient + '"' + ' fill="#000000' + dectohex(balls[i].opacity) + '" >' + Math.round(balls[i].yVal*10)/10.0 + '</text>'

		ngroupy.innerHTML += '<circle id="' + ('ballcircle' + balls[i].id) + '" cx="' + balls[i].x + '" cy="' + balls[i].yClient + '" r="' + 5 + '" stroke="#eeeeeeff" stroke-width="2" fill="#440088' + dectohex(balls[i].opacity) + '" />'

			let ballelementcircle = document.getElementById('ballcircle' + balls[i].id );
			let ballelementtext = document.getElementById('balltext' + balls[i].id );
			balls[i]['elements'] = {}
			balls[i]['elements']['circle'] = ballelementcircle
			balls[i]['elements']['text'] = ballelementtext

		id ++ ;
		// console.log(balls)
	}

	let inner = '' 

	inner += '<rect x="10" y="10" rx="15" ry="15" width=99% height=99% style="fill:#80200010;stroke:#70707000;stroke-width:0.5;opacity:1" />'

	// if(t<10)
	for (var i = 0; i <= 6; i++) 
	{
		let lineelement = document.getElementById('yline' + i );
   		let textelement = document.getElementById('ytext' + i );
   
		if(lineelement == null)
		{
			ngroupy.innerHTML += '<line id="' + ('yline' + i) + '" x1="' + margins.left + '" y1="' + ( (svgy.clientHeight - margins.bottom)*(6-i)/6 )  + '" x2="' + svgy.clientWidth + '" y2="' + ( (svgy.clientHeight - margins.bottom)*(6-i)/6 )  + '" style="stroke:#aaa8;stroke-width:1" />'
		}else
		{
			lineelement.setAttribute('x1', margins.left);
			lineelement.setAttribute('y1', ( (svgy.clientHeight - margins.bottom)*(6-i)/6 ));
			lineelement.setAttribute('x2', svgy.clientWidth);
			lineelement.setAttribute('y2',  ( (svgy.clientHeight - margins.bottom)*(6-i)/6 ));
		}
		if(textelement == null)
		{
			ngroupy.innerHTML += '<text id="' + 'ytext' + i + '" x="' + (margins.left -20  ) + '" y="' + ( (svgy.clientHeight - margins.bottom)*(6-i)/6 + 10)  + '"' + ' fill="#000000ff" >' + (yrange.max*i/6  +yrange.min)  + '</text>'
		}else
		{
			// console.log('found' + i)
			// console.log(textelement)
			textelement.setAttribute('x',  (margins.left -20  ));
			textelement.setAttribute('y', ( (svgy.clientHeight - margins.bottom)*(6-i)/6 + 10))
		}
	}
	
	if(balls.length>0)
	{
		if(balls[0].x < margins.left )
		{
			let ballelement = document.getElementById('ballline' + balls[0].id );
			let ballelementcircle = document.getElementById('ballcircle' + balls[0].id );
			let ballelementtext = document.getElementById('balltext' + balls[0].id );
			balls[0]['elements']['line'].remove()
			balls[0]['elements']['circle'].remove()
			balls[0]['elements']['text'].remove()
			// balls[i-1]['elements']['line'] = ballelement
			// balls[i]['elements']['circle'] = ballelementcircle
			// balls[i]['elements']['text'] = ballelementtext
			ballelement.remove();
			ballelementcircle.remove()
			ballelementtext.remove()
			balls.shift()
		}
	}
	for (var i = 0; i < balls.length; i++) {

		let breaknum = 2
		for (var j = 0; j < speedbreak.length; j++) 
		{
			let offset = breaknum -1

		if(balls[i].x < speedbreak[j].clientpos)
		{
			// console.log(offset + ' , ' + balls[i].id + ' , ' + (breaknum /2))
			if(  ( (balls[i].id  )/(breaknum /2))%2==1 && balls[i].mode != 'delete')
			{
				balls[i-1].dy += (balls[i].yClient + balls[i-1].yClient)/2 - balls[i-1].yClient
				if(i>2  && balls[i-2].mode == 'delete')
					balls[i-2].dy +=  ((balls[i].yClient + balls[i-1].yClient)/2 - balls[i-1].yClient)/2

				balls[i].dy += ((balls[i+1].yClient) + (balls[i-1].yClient+balls[i-1].dy))/2 - balls[i].yClient
				balls[i].mode = 'delete'

			}
		}
			breaknum *= 2

		}
	}

	inner += '<line x1="' + margins.left + '" y1="0" x2="' + margins.left + '" y2="' + 
				svgy.clientHeight + '" style="stroke:#000f;stroke-width:1" />'

	inner += '<line x1="0" y1="' + (svgy.clientHeight-margins.bottom) + '" x2="' + (svgy.clientWidth) + '" y2="' + (svgy.clientHeight-margins.bottom) + '" style="stroke:#000f;stroke-width:1" />'

	for (var i = 0; i < speedbreak.length; i++) {

		let lineelement = document.getElementById('xline' + i );

		if(lineelement == null)
		{
			ngroupy.innerHTML += '<line id="' + ('xline' + i ) + '" x1="' + (speedbreak[i].clientpos)+ '" y1="0" x2="' +  (speedbreak[i].clientpos) + '" y2="' + svgy.clientHeight + '" style="stroke:#aaa8;stroke-width:1" />'
		}else
		{
			lineelement.setAttribute('x1',  (speedbreak[i].clientpos) );
			lineelement.setAttribute('y1',  0 );
			lineelement.setAttribute('x2',  (speedbreak[i].clientpos));
			lineelement.setAttribute('y2',  svgy.clientHeight);
		}

		let textelement = document.getElementById('xtext' + i );

		if(textelement == null)
		{
			ngroupy.innerHTML += '<text id="' + ('xtext' + i ) + '" x="' + (speedbreak[i].clientpos + 10) + '" y="' + (svgy.clientHeight -15) + '"' + ' fill="#000000ff" >' + speedbreak[i].duration +'</text>'
		}else
		{
			textelement.setAttribute('x', (speedbreak[i].clientpos + 10)) ;
			textelement.setAttribute('y', (svgy.clientHeight  -15 )) ;

		}


	}


	for (var i = 0; i < balls.length; i++) {

		for (var j = 0; j < speedbreak.length; j++) {			

			let prevClientpos = 0 
			let prevTime = 0 
			if(j ==0 ) 
			{
				prevClientpos = svgy.clientWidth
			}else{
				prevClientpos = speedbreak[j-1]['clientpos']	
				prevTime  = speedbreak[j-1]['duration']	
			}

			if(balls[i].x >=speedbreak[j]['clientpos'] && balls[i].x < prevClientpos)
			{
				let width = ( prevClientpos - speedbreak[j]['clientpos'])
				let time  = speedbreak[j]['duration'] - prevTime
				let nowstep = step * width / time / 1000
				// console.log(nowstep)
				balls[i].x	-= nowstep 
			} 
		}

		balls[i].opacity = 255
		if(balls[i].mode == 'delete')
		{
			if(balls[i].progress < 100 )
			{
				balls[i].progress += 4; 
				balls[i].opacity = 255 *(100 - balls[i].progress)/100

			}else
			{
				let ballelement = document.getElementById('ballline' + balls[i].id );
				let ballelementcircle = document.getElementById('ballcircle' + balls[i].id );
				let ballelementtext = document.getElementById('balltext' + balls[i].id );
				
				// balls[i]['elements']['line'].parentNode().removeChild(balls[i]['elements']['line'])
				// balls[i]['elements']['circle'].parentNode().removeChild(balls[i]['elements']['circle'])
				// balls[i]['elements']['text'].parentNode().removeChild(balls[i]['elements']['text'])
				// let ballelement = balls[i]['elements']['balltext']
				ballelement.remove();
				ballelementtext.remove()
				ballelementcircle.remove()
				balls.splice(i, 1)
				// funballs.push(balls[i])
			}
		}

		let progstep = 1
		if(balls[i].dy > 25 ||balls[i].dy < -25 )
			progstep = 3 
		if(balls[i].dy > 50 ||balls[i].dy < -50 )
			progstep = 5 
		if(balls[i].dy > 75 ||balls[i].dy < -75 )
			progstep = 7 
		if(balls[i].dy > progstep)
		{
			balls[i].yClient += progstep	
			balls[i].dy-= progstep
		}
		if(balls[i].dy < -progstep)
		{
			balls[i].yClient -= progstep		
			balls[i].dy+= progstep
		}
		if(balls[i].dy != 0 && balls[i].dy  <progstep && balls[i].dy > -progstep )
		{
			balls[i].yClient += balls[i].dy		
			balls[i].dy= 0
		}
		balls[i].yVal = yrange.max - balls[i].yClient/yscale 

	}

   	// let textelement = document.getElementById('ytext' + i );


	for (var i = 1; i < balls.length; i++) {

	  	let ballelement = document.getElementById('ballline' + balls[i-1].id );
	  	if(ballelement != null)
		{
			ballelement.setAttribute('x1', (balls[i-1].x ) ) ;
			ballelement.setAttribute('y1', (balls[i-1].yClient ) ) ;
			ballelement.setAttribute('x2', (balls[i].x ) ) ;
			ballelement.setAttribute('y2', (balls[i].yClient  ) ) ;
		}

	}
	for (var i = 0; i < balls.length; i++) {

		let ballelementtext = document.getElementById('balltext' + balls[i].id );
		if(ballelementtext != null)
		{
				ballelementtext.setAttribute('x', balls[i].x ) ;
				ballelementtext.setAttribute('y', balls[i].yClient ) ;
				ballelementtext.setAttribute('fill', '#000000FF' + dectohex(balls[i].opacity) ) ;
				ballelementtext.innerHTML = Math.round(balls[i].yVal*10)/10.0 
		}
		let ballelementcircle = document.getElementById('ballcircle' + balls[i].id );

		if(ballelementcircle != null)
		{
				ballelementcircle.setAttribute('cx', balls[i].x ) ;
				ballelementcircle.setAttribute('cy', balls[i].yClient) ;
				ballelementcircle.setAttribute('fill', '#440088' + dectohex(balls[i].opacity)  ) ;
		}
	}

	groupy.innerHTML = inner;
}

function dectohex(argument) {
	argument = Math.round(argument)
	let result = argument.toString(16)
	if(result.length < 2)
		result = '0' +  result 
	return result;
}

// setInterval( function(){loop(svgy1)} ,step);

function addData() {
		console.log('pushing?')
		let yVal = Math.random()*5 +50 +Math.sin(t/400)*50 + 0
		if(select.value == 'noise')
			yVal = Math.random()*50 +50 
		buffer[0].push(yVal)
}
// setInterval(addData , 1200)

