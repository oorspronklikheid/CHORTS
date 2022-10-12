import asyncio
import websockets
import psutil

async def echo(websocket):
	async for message in websocket:
		await websocket.send('%s' % psutil.cpu_percent(1))

async def main():
	async with websockets.serve(echo, "localhost", 8765):
		await asyncio.Future()
asyncio.run(main())