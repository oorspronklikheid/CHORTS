import asyncio
import websockets
import psutil

import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = s.getsockname()[0]
print(ip)
s.close()

async def echo(websocket):
	async for message in websocket:
		await websocket.send('%s' % psutil.cpu_percent(0.5))
		# await websocket.send('50')

async def main():
	async with websockets.serve(echo, ip, 8765):
		await asyncio.Future()
asyncio.run(main())