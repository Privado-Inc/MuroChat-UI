import React, { useState } from "react";
import { line, scaleLinear, area } from "d3";
import { MonthlyData } from "components/Onboarding/Overview";
import { Colors } from "uiLibrary/index";


export type LineDataType = {
    label?: string,
    x: number,
    y: number,
}

const LineChart = ({
    data,
    data2 = [],
    width,
    height,
    margin,
    showLabel,
    strokeColor
}: {
    data: MonthlyData[],
    data2?: MonthlyData[],
    width?: number,
    height?: number,
    margin?: { top: number, right: number, bottom: number, left: number, },
    showLabel?: boolean,
    strokeColor?: string,
}) => {
    const layout = {
        width: width || 450,
        height: height || 200,
        margin: margin || {
            top: 26,
            right: 20,
            bottom: 30,
            left: 20
        }
    };

    const graphDetails = {
        xScale: scaleLinear().range([0, layout.width]),
        yScale: scaleLinear().range([layout.height, 0]),
        lineGenerator: line()
    };
    const d3area = (data: MonthlyData[]) => area()
        .x(d => graphDetails.xScale(d["x"]))
        .y0(graphDetails.yScale(0))
        .y1(d => graphDetails.yScale(d["y"]));

    const maxData = data.reduce((a, b) => {
        return b.y && b.y > a ? b.y : a;
    }, 0);

    graphDetails.xScale.domain([0, data.length - 1]);
    graphDetails.yScale.domain([0, maxData + 50]);

    graphDetails.lineGenerator.x((d) => graphDetails.xScale(d["x"]));
    graphDetails.lineGenerator.y((d) => graphDetails.yScale(d["y"]));

    const [lineData, setLineData] = useState(() =>
        graphDetails.lineGenerator(data as any)
    );

    const [areaData, setAreaData] = useState(() =>
        d3area(data)(data as any)
    );

    const [lineData2, setLineData2] = useState(() =>
        data2 ? graphDetails.lineGenerator(data2 as any) : [{ x: 0, y: 0 }]
    );

    const [areaData2, setAreaData2] = useState(() =>
        d3area(data)(data2 as any)
    );

    // Function to generate X-axis labels
    const generateXAxisLabels = () => {
        return data.map((d: any, index: number) => {
            return showLabel ? (
                <text
                    key={index}
                    x={graphDetails.xScale(index)}
                    y={layout.height + layout.margin.bottom - 5}
                    textAnchor="middle"
                    fontSize="10"
                    fill={Colors.extraDarkGrey}
                >
                    {d.label}
                </text>)
                : "";
        });
    };

    return (
        <svg
            className="graph--example"
            width={layout.width + layout.margin.left + layout.margin.right}
            height={layout.height + layout.margin.top + layout.margin.bottom}
        >
            <g transform={`translate(${layout.margin.left},${layout.margin.top})`}>
                {/* X-axis labels */}
                {generateXAxisLabels()}

                {/* X-axis line */}
                {showLabel
                    && <line
                        x1="0"
                        y1={layout.height}
                        x2={layout.width}
                        y2={layout.height}
                        stroke={Colors.lightRed}
                    />}

                {/* Graph lines */}
                <path
                    d={lineData as any}
                    style={{
                        fill: "none",
                        strokeWidth: 3,
                        stroke: strokeColor ? strokeColor : Colors.purple.p30
                    }}
                />
                {/* Gradiant descent */}
                {!showLabel && <path
                    d={areaData as any}
                    style={{
                        fill: strokeColor && strokeColor === Colors.green.p70 ? Colors.green.p10 : Colors.red.p0
                    }}
                />}
                <path
                    d={lineData2 as any}
                    style={{
                        fill: "none",
                        strokeWidth: "3px",
                        stroke: Colors.purple.p60
                    }}
                />
                {/* Gradiant descent */}
                {/* <path
                    d={areaData2 as any}
                    style={{
                        fill: "#a596d6",
                    }}
                /> */}
            </g>
        </svg>
    );
};

export default LineChart;
