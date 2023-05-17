import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#bbf7d0", "#c7d2fe", "#1c1917"];

export default function Chart() {
  const [holders, setHolders] = useState<
    { address: string; dogamiCount: number }[]
  >([]);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/metric/community")
      .then((r) => r.json())
      .then((d) => {
        setHolders(d);
      });
  }, []);

  useEffect(() => {
    const newData = holders.reduce(
      (prev, curr) => {
        if (curr.dogamiCount < 2) {
          prev[0].value += 1;
        } else if (curr.dogamiCount < 10) {
          prev[1].value += 1;
        } else {
          prev[2].value += 1;
        }
        return prev;
      },
      [
        { name: "< 2", value: 0 },
        { name: "< 10", value: 0 },
        { name: "> 10", value: 0 },
      ]
    );

    setData(newData);
  }, [holders]);

  return (
    <div>
      <div className="py-6 h-52">
        {holders.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                data={data}
                cx={80}
                cy={70}
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={1}
                dataKey="value"
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[1]} />
                <Cell fill={COLORS[2]} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex justify-between space-x-4">
        {data.map(({ name }, index) => (
          <div key={name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-xs">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
