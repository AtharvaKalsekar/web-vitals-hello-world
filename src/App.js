import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { history, tableData as TableNetworkData } from "./constants";

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function plotRecord(prices) {
  const xArray = new Array(30).fill().map((_, i) => i + 1);
  // Define Data
  const data = [{ x: xArray, y: prices, mode: "lines" }];

  //Define Layout
  const layout = {
    title: "History of past 30 days",
  };

  window?.Plotly?.newPlot("myPlot", data, layout);
}

function App() {
  const [ selectedId, setSelectedId ] = useState('');
  const [tableData, setTableData] = useState([]);
  const [plotReady, setPlotReady] = useState(false);

  useEffect(() => {
    async function getTableData() {
      // const data = await fetch(
      //   "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en"
      // );
      // const json = await data.json();
      const json = await new Promise((resolve)=>setTimeout(()=>resolve(TableNetworkData),5000))
      setTableData(json)
      setSelectedId(json[0].id);
    }
    getTableData();
  }, []);

  useEffect(()=>{
    async function showPlot() {
      // const data = await fetch(
      //   `https://api.coingecko.com/api/v3/coins/${selectedId}/market_chart?vs_currency=usd&days=30&interval=daily`,
      // );
      // const json = await data.json();

      const json = await new Promise((resolve)=>setTimeout(()=>resolve(history[selectedId]||{}),5000))
      // sleep(5000);
    
      const pr = json.prices?.map((p) => p[1]);
    
      plotRecord(pr);
    }

    if(selectedId!==""){
      showPlot()
    }
    
  },[selectedId])

  return (
    <div className="App">
      <h1>Crypto Prices List</h1>
      {/* <div style={{ height: "100px", width: "700px", display:plotReady?"none":"block" }}></div> */}
      <div id="myPlot" style={{ width: "100%", maxWidth: "700px" }}></div>
      <table id="crypto-table">
        <tr>
          <th>Coin</th>
          <th>Current price</th>
          <th>History</th>
        </tr>
        {tableData.length ? (
          tableData.map(({ id, name, current_price }) => (
            <tr key={id}>
              <td>
                <h3>{name}</h3>
              </td>
              <td>{current_price}</td>
              <td>
                <button disabled={id===selectedId} onClick={()=>setSelectedId(id)}>
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
      </table>
    </div>
  );
}

export default App;
