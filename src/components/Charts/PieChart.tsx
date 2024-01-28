import React, { useEffect } from "react";
import * as d3 from "d3";
import { Colors } from "uiLibrary/index";

export const ListOfColors = [
    Colors.purple.p60,
    Colors.purple.p50,
    Colors.purple.p40,
    Colors.purple.p30,
    Colors.purple.p20
]

function PieChart({
    data,
    outerRadius,
    innerRadius,
    showLabel = false,
    singleColorScale = false,
    singleWidth = 0,
    singleHeight = 0
}: {
    data: {
        label: string;
        value: number;
    }[],
    outerRadius: number,
    innerRadius: number,
    showLabel?: boolean,
    singleColorScale?: boolean,
    singleWidth?: number,
    singleHeight?: number,
}) {

    const margin = {
        top: 50, right: 50, bottom: 50, left: 50
    };

    const width = singleWidth !== 0 ? singleWidth : 2 * outerRadius + margin.left + margin.right;
    const height = singleHeight !== 0 ? singleHeight : 250;

    useEffect(() => {
        drawChart();
    }, [data]);

    function drawChart() {
        // Remove the old svg
        d3.select("#pie-container")
            .select("svg")
            .remove();

        // Create new svg
        const svg = d3
            .select("#pie-container")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const arcGenerator = d3
            .arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        const pieGenerator = d3
            .pie()
            .padAngle(0)
            .value((d: any) => d.value);

        const arc = svg
            .selectAll()
            .data(pieGenerator(data as any))
            .enter();

        // Append arcs
        arc.append("path")
            .attr("d", arcGenerator as any)
            .style("fill", (_, i) => { return ListOfColors[i] })
            .style("stroke", Colors.darkRed)
            .style("stroke-width", 0);

        // Append text labels
        if (showLabel) arc.append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .text((d: any) => d.data.label)
            .style("fill", (_, i) => "black")
            .attr("transform", (d: any) => {
                const [x, y] = arcGenerator.centroid(d);
                return `translate(${x}, ${y})`;
            });
    }

    return <div id="pie-container" />;
}

export default PieChart;