import * as d3 from 'd3'
import {useEffect, useRef} from 'react'
import {VertexType} from 'shared/types'
import styles from './Graph.module.css'

type GraphProps = {
	vertices: VertexType[],
	width: number,
	height: number,
}

type NodeData = {
	id: string,
	x: number,
	y: number,
	hashtags: string[],
}

type LinkData = {
	source: string | NodeData,
	target: string | NodeData,
}

const Graph = ({vertices, width, height}: GraphProps) => {
	const svgRef = useRef<SVGSVGElement>(null)
	const simulationRef = useRef<d3.Simulation<NodeData, LinkData> | null>(null)

	useEffect(() => {
		if (!svgRef.current) {
			return
		}

		const svg = d3.select(svgRef.current)
		svg.selectAll('*').remove() // Очистка предыдущих элементов
		const g = svg.append('g')
		const k = Math.sqrt((width * height) / vertices.length)

		const nodes: NodeData[] = vertices.map(vertex => ({
			id: vertex.user,
			x: Math.random() * width,
			y: Math.random() * height,
			hashtags: vertex.hashtags,
		}))

		const links: LinkData[] = []
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

		const simulation = d3
			.forceSimulation<NodeData, LinkData>(nodes)
			.force('charge', d3.forceManyBody().strength(-30))
			.force('link', d3
				.forceLink<NodeData, LinkData>(links)
				.id(d => d.id)
				.distance(d => {
					const sourceNode = nodes.find(node => node.id === d.source)
					const targetNode = nodes.find(node => node.id === d.target)
					if (sourceNode && targetNode) {
						const commonHashtags = sourceNode.hashtags.filter(tag => targetNode.hashtags.includes(tag))
						return k * commonHashtags.length
					}
					return k
				}),
			)
			.force('center', d3.forceCenter(width / 2, height / 2))
			.on('tick', () => {
				g.selectAll<SVGLineElement, LinkData>('line')
					.attr('x1', d => (typeof d.source !== 'string' ? d.source.x : 0))
					.attr('y1', d => (typeof d.source !== 'string' ? d.source.y : 0))
					.attr('x2', d => (typeof d.target !== 'string' ? d.target.x : 0))
					.attr('y2', d => (typeof d.target !== 'string' ? d.target.y : 0))
				g.selectAll<SVGCircleElement, NodeData>('circle')
					.attr('cx', d => d.x)
					.attr('cy', d => d.y)
			})

		// Остановка симуляции и выполнение тиков
		simulation.stop()
		for (let i = 0; i < 25; ++i) {
			simulation.tick()
		}

		// Добавление линий
		g.selectAll<SVGLineElement, LinkData>('line')
			.data(links)
			.enter()
			.append('line')
			.attr('stroke', '#000000')
			.attr('stroke-opacity', 0.3)
			.attr('stroke-width', 1)
			.attr('x1', d => (typeof d.source !== 'string' ? d.source.x : 0))
			.attr('y1', d => (typeof d.source !== 'string' ? d.source.y : 0))
			.attr('x2', d => (typeof d.target !== 'string' ? d.target.x : 0))
			.attr('y2', d => (typeof d.target !== 'string' ? d.target.y : 0))

		// Добавление кругов
		g.selectAll<SVGCircleElement, NodeData>('circle')
			.data(nodes)
			.enter()
			.append('circle')
			.attr('r', 10)
			.attr('fill', '#f00')
			.attr('cx', d => d.x)
			.attr('cy', d => d.y)
			.call(d3
				.drag<SVGCircleElement, NodeData>()
				.on('start', dragStarted)
				.on('drag', dragged)
				.on('end', dragEnded),
			)

		const zoom = d3.zoom<SVGSVGElement, any>().scaleExtent([0.1, 10]).on('zoom', zoomed)
		svg.call(zoom)

		function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, any>) {
			g.attr('transform', event.transform.toString())
		}

		function dragStarted(event: d3.D3DragEvent<SVGCircleElement, NodeData, any>) {
			if (!event.active) {
				simulation.alphaTarget(0.3).restart()
			}
			event.subject.fx = event.subject.x
			event.subject.fy = event.subject.y
		}

		function dragged(event: d3.D3DragEvent<SVGCircleElement, NodeData, any>) {
			event.subject.fx = event.x
			event.subject.fy = event.y
		}

		function dragEnded(event: d3.D3DragEvent<SVGCircleElement, NodeData, any>) {
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
		<div className={styles.graph}>
			<svg ref={svgRef} width={width} height={height}></svg>
		</div>
	)
}

export {Graph}