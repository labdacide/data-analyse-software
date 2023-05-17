import {
    BarChart,
    AreaChart,
    Bar,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    ReferenceDot,
} from "recharts";

const COLORS = [
    "#6366f1",
    "#A96AE7",
    "#03D6E6",
    "#84cc16",
    "#289BE9",
    "#6069F0",
    "#141B2E",
    "#CE4AF0",
    "#bbf7d0",
    "#c7d2fe",
    "#4ade80",
];

function numFormatter(num: number, digits: number = 0) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item
        ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
        : "0";
}

interface ChartProps {
    data: { date: string; value: number }[];
    dataKey: string;
    references?: any[];
}

export default function Chart({ data, dataKey, references }: ChartProps) {
    const { max, min } = data.reduce(
        (prev, curr) => {
            if (curr.value > prev.max) {
                prev.max = curr.value;
            }
            if (curr.value < prev.min) {
                prev.min = curr.value;
            }
            return prev;
        },
        { max: 0, min: 0 }
    );

    return (
        <div className="h-60 p-4">
            {data && (
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                    className="bg-white"
                >
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                    >
                        <CartesianGrid
                            vertical={false}
                            strokeWidth={0.5}
                            strokeOpacity={0.5}
                            strokeDasharray={"4 4"}
                        />
                        <XAxis
                            dataKey="date"
                            name="date"
                            type="category"
                            tickFormatter={(value) =>
                                new Date(value).toDateString().slice(4, 10)
                            }
                            tickLine={false}
                            axisLine={false}
                            padding={{ left: 10, right: 10 }}
                            tickMargin={10}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            dataKey={dataKey}
                            type="number"
                            name={dataKey}
                            domain={[
                                (dataMin: number) => 0.7 * dataMin,
                                "dataMax",
                            ]}
                            tickFormatter={(value) => numFormatter(value, 2)}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tick={{ fontSize: 12 }}
                            ticks={[0, 1, 2, 3, 4].map(
                                (i) => min + (i * (max - min)) / 4
                            )}
                        />
                        <Area
                            type="linear"
                            dataKey={dataKey}
                            name="value"
                            stroke={COLORS[0]}
                            strokeWidth={2}
                            fill={COLORS[0]}
                            fillOpacity={0.05}
                        />
                        <Tooltip
                            contentStyle={{ fontSize: 12 }}
                            formatter={(value) =>
                                typeof value === "number"
                                    ? value.toFixed(2)
                                    : value
                            }
                        />
                        {references &&
                            references.map((ref, i) => (
                                <ReferenceDot
                                    key={i}
                                    r={3}
                                    fill="gray"
                                    y={0}
                                    x={ref.date.slice(0, 10)}
                                    className="cursor-pointer"
                                    onClick={() =>
                                        window
                                            .open(ref.label, "_blank")
                                            ?.focus()
                                    }
                                />
                            ))}
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
