import React, {useRef, useEffect} from 'react'

type VertexType = {
	user: string,
	hashtags: string[],
}

type Node = {
	id: string,
	x: number,
	y: number,
	vx: number,
	vy: number,
}

type GraphProps = {
	vertices: VertexType[],
	width: number,
	height: number,
}

const Graph2: React.FC<GraphProps> = ({vertices, width, height}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

	useEffect(() => {
		if (!canvasRef.current) {
			return
		}

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')

		if (!ctx) {
			return
		}

		ctxRef.current = ctx

		// Parameters for the force-directed algorithm
		const k = Math.sqrt(width * height / vertices.length) // Optimal distance between nodes
		const alpha = 0.1 // Global temperature (simulated annealing)

		// Convert vertices to nodes with initial positions
		const nodes: Node[] = vertices.map((vertex, index) => ({
			id: `node-${index}`,
			x: Math.random() * width,
			y: Math.random() * height,
			vx: 0,
			vy: 0,
		}))

		// Apply forces and draw once
		applyForces()
		draw()

		function applyForces() {
			// Calculate forces (repulsive and attractive)
			nodes.forEach(node => {
				node.vx = 0
				node.vy = 0
				nodes.forEach(other => {
					if (node !== other) {
						const dx = other.x - node.x
						const dy = other.y - node.y
						const distanceSquared = dx * dx + dy * dy
						const force = k * k / distanceSquared
						node.vx -= force * dx / Math.sqrt(distanceSquared)
						node.vy -= force * dy / Math.sqrt(distanceSquared)
					}
				})
			})

			// Attractive forces based on shared hashtags
			nodes.forEach(node => {
				nodes.forEach(other => {
					if (node !== other) {
						const sharedHashtags = countSharedHashtags(node.id, other.id)
						const attractionForce = sharedHashtags * k
						const dx = other.x - node.x
						const dy = other.y - node.y
						const distance = Math.sqrt(dx * dx + dy * dy)
						node.vx += attractionForce * dx / distance
						node.vy += attractionForce * dy / distance
					}
				})
			})

			// Update node positions based on computed forces
			nodes.forEach(node => {
				node.x += node.vx * alpha
				node.y += node.vy * alpha
			})
		}

		function countSharedHashtags(nodeId1: string, nodeId2: string): number {
			const hashtags1 = vertices.find(v => v.user === nodeId1)?.hashtags || []
			const hashtags2 = vertices.find(v => v.user === nodeId2)?.hashtags || []
			return hashtags1.filter(tag => hashtags2.includes(tag)).length
		}

		function draw() {
			const ctx1 = ctxRef.current
			if (!ctx1) {
				return
			}

			// Clear canvas
			ctx1.clearRect(0, 0, width, height)

			// Draw edges
			ctx1.strokeStyle = '#555'
			nodes.forEach((node, index) => {
				nodes.slice(index + 1).forEach(other => {
					ctx1.beginPath()
					ctx1.moveTo(node.x, node.y)
					ctx1.lineTo(other.x, other.y)
					ctx1.stroke()
				})
			})

			// Draw nodes
			ctx1.fillStyle = '#f00'
			nodes.forEach(node => {
				ctx1.beginPath()
				ctx1.arc(node.x, node.y, 10, 0, 2 * Math.PI)
				ctx1.fill()
			})
		}

		// Clean-up
		return () => {
			// Clean-up logic if needed
		}
	}, [vertices, width, height])

	return <canvas ref={canvasRef} width={width} height={height} />
}

export {
	Graph2,
}