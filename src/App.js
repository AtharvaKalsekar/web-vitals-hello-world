import "./App.css";
import { useEffect, useState } from "react";
import { history, tableData as TableNetworkData } from "./constants";
import Plot from "react-plotly.js";
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function App() {
  const [selectedId, setSelectedId] = useState("");
  const [tableData, setTableData] = useState([]);
  const [plotData, setPlotData] = useState([]);

  useEffect(() => {
    async function getTableData() {
      // const data = await fetch(
      //   "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en"
      // );
      // const json = await data.json();
      const json = await new Promise((resolve) =>
        setTimeout(() => resolve(TableNetworkData), 1000)
      );
      setTableData(json);
      setSelectedId(json[0].id);
    }
    getTableData();
  }, []);

  useEffect(() => {
    async function showPlot() {
      // const data = await fetch(
      //   `https://api.coingecko.com/api/v3/coins/${selectedId}/market_chart?vs_currency=usd&days=30&interval=daily`,
      // );
      // const json = await data.json();

      const json = await new Promise((resolve) =>
        setTimeout(() => {
          resolve(history[selectedId] || {})
          sleep(3000);
        }, 500)
      );

      const pr = json.prices?.map((p) => p[1]);

      const xArray = new Array(30).fill().map((_, i) => i + 1);
      const plotDataArray = [{ x: xArray, y: pr, mode: "lines" }];

      setPlotData(plotDataArray);
    }

    if (selectedId !== "") {
      showPlot();
    }
  }, [selectedId]);

  return (
    <div className="App">
      {plotData.length > 0 ? (
        <Plot
          data={plotData}
          layout={{ width: 700, height: 450, title: "History of past 30 days" }}
        />
      ) : (
        <></>
      )}
      <table id="crypto-table">
        <tbody>
          <tr>
            <th>Coin</th>
            <th>Price</th>
            <th>Trend</th>
          </tr>
          {tableData.length ? (
            tableData.slice(0, 5).map(({ id, name, current_price }) => (
              <tr key={id}>
                <td>
                  <h3>{name}</h3>
                </td>
                <td>{current_price}</td>
                <td>
                  <button
                    disabled={id === selectedId}
                    onClick={() => setSelectedId(id)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
