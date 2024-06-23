import * as d3 from 'd3'
import * as React from 'react'
import {useEffect} from 'react'

type VertexType = {
	user: string,
	hashtags: string[],
}

type GraphProps = {
	vertices: VertexType[],
	width: number,
	height: number,
}

type NodeDatum = {
	id: string,
	x: number,
	y: number,
	hashtags: string[],
}

type LinkDatum = {
	source: string,
	target: string,
}

const Graph: React.FC<GraphProps> = ({vertices, width, height}) => {
	const svgRef = React.useRef<SVGSVGElement>(null)
	const simulationRef = React.useRef<d3.Simulation<NodeDatum, undefined> | null>(null)

	useEffect(() => {
		if (!svgRef.current) {
			return
		}

		const svg = d3.select(svgRef.current)
		const g = svg.append('g')

		// Calculate optimal distance between nodes based on width, height, and number of vertices
		const k = Math.sqrt((width * height) / vertices.length)

		// Convert vertices to nodes with initial positions and computed radius
		const nodes: NodeDatum[] = vertices.map((vertex, index) => ({
			id: vertex.user,
			x: Math.random() * width,
			y: Math.random() * height,
			hashtags: vertex.hashtags,
		}))

		// Create links based on similarities in hashtags
		const links: LinkDatum[] = []
		// Nested loop to create links based on common hashtags
		nodes.forEach(node1 => {
			nodes.forEach(node2 => {
				if (node1 !== node2) {
					const common = node1.hashtags.filter(tag => node2.hashtags.includes(tag))
					if (common.length > 0) {
						links.push({source: node1.id, target: node2.id})
					}
				}
			})
		})

		console.log({links})

		// Create force simulation
		const simulation = d3
			.forceSimulation<NodeDatum>(nodes)
			.force('charge', d3.forceManyBody().strength(-30))
			.force('link', d3.forceLink<NodeDatum, LinkDatum>(links).id(d => d.id).distance(d => {
				const sourceNode = nodes.find(node => node.id === d.source)
				const targetNode = nodes.find(node => node.id === d.target)
				if (sourceNode && targetNode) {
					const commonHashtags = sourceNode.hashtags.filter(tag => targetNode.hashtags.includes(tag))
					return k * commonHashtags.length
				}
				return k
			}))
			.force('center', d3.forceCenter(width / 2, height / 2))

		// Run simulation for a fixed number of iterations
		simulation.stop()
		for (let i = 0; i < 300; ++i) {
			simulation.tick()
		}

		g.selectAll<SVGLineElement, LinkDatum>('line')
			.data(links)
			.enter()
			.append('line')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 0.6)
			.attr('stroke-width', 1)
			.attr('x1', d => nodes.find(node => node.id === d.source)?.x ?? 0)
			.attr('y1', d => nodes.find(node => node.id === d.source)?.y ?? 0)
			.attr('x2', d => nodes.find(node => node.id === d.target)?.x ?? 0)
			.attr('y2', d => nodes.find(node => node.id === d.target)?.y ?? 0)

		g.selectAll<SVGCircleElement, NodeDatum>('circle')
			.data(nodes)
			.enter()
			.append('circle')
			.attr('r', 10)
			.attr('fill', '#f00')
			.attr('cx', d => d.x)
			.attr('cy', d => d.y)
			.call(
				d3
					.drag<SVGCircleElement, NodeDatum>()
					.on('start', dragstarted)
					.on('drag', dragged)
					.on('end', dragended),
			)

		// Zoom behavior
		const zoom = d3.zoom<SVGSVGElement, any>().scaleExtent([0.1, 10]).on('zoom', zoomed)

		svg.call(zoom)

		function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, any>) {
			g.attr('transform', event.transform.toString())
		}

		function dragstarted(event: d3.D3DragEvent<SVGCircleElement, NodeDatum, any>) {
			if (!event.active) {
				simulation.alphaTarget(0.3).restart()
			}
			event.subject.fx = event.subject.x
			event.subject.fy = event.subject.y
		}

		function dragged(event: d3.D3DragEvent<SVGCircleElement, NodeDatum, any>) {
			event.subject.fx = event.x
			event.subject.fy = event.y
		}

		function dragended(event: d3.D3DragEvent<SVGCircleElement, NodeDatum, any>) {
			if (!event.active) {
				simulation.alphaTarget(0)
			}
			event.subject.fx = null
			event.subject.fy = null
		}

		simulationRef.current = simulation
		return () => {
			if (simulationRef.current) {
				simulationRef.current.stop()
			}
		}
	}, [vertices, width, height])

	return (
		<svg
			ref={svgRef}
			width={width}
			height={height}
		></svg>
	)
}

export {
	Graph,
}