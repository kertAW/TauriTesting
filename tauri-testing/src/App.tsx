import { createSignal, onMount } from "solid-js";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/core";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "solid-chartjs";
import "./App.css";

// Chart.js requires you to register the components you want to use.
Chart.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

function App() {
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");
  const [chartData, setChartData] = createSignal({
    labels: [] as number[],
    datasets: [
      {
        label: "Random Y Value",
        data: [] as number[],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  const initialChartData = {
    labels: [],
    datasets: [
      {
        label: "Random Y Value",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  onMount(() => {
    const interval = setInterval(async () => {
      // Invoke the command to get [y, x]
      const [y, x]: [number, number] = await invoke("generate_random_numbers");

      // Update the chart data
      setChartData((prevData) => {
        const newLabels = [...prevData.labels, x];
        const newData = [...prevData.datasets[0].data, y];
        
        return {
          labels: newLabels,
          datasets: [
            {
              ...prevData.datasets[0],
              data: newData,
            },
          ],
        };
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  });

  async function greet() {
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  function clearChart() {
    setChartData(initialChartData);
  }

  return (
    <main class="container">
      <h1>Welcome to Tauri + Solid</h1>

      <div class="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={logo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and Solid logos to learn more.</p>

      <form
        class="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg()}</p>
      
      <div class="row" style={{"align-items": "center"}}>
        <h2>Real-time Random Data</h2>
        <button onClick={clearChart} style={{"margin-left": "1rem"}}>Clear Chart</button>
      </div>
      <div style={{ "max-width": "1200px", width: "100%", margin: "0 auto" }}>
        <Line data={chartData()} options={{ responsive: true }} />
      </div>
    </main>
  );
}

export default App;
