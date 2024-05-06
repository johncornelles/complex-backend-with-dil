import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import "./App.css";
import { useForm } from "react-hook-form";

const Card = (currentData) => (
  <p>
    I am <span style={{ color: "coral" }}>{currentData.currentData.name}</span>{" "}
    from squad{" "}
    <span style={{ color: "blue" }}>{currentData.currentData.squad}</span> and
    with Id <span style={{ color: "crimson" }}>{currentData.currentData.id}</span>
  </p>
);

const App = () => {
  const [timer, setTimer] = useState(1);
  const [currentInterval, setcurrentInterval] = useState(null);
  const [isStopped, setIsStopped] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [filters, setFilters] = useState(null);
  let intervalId;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const increaseTime = () => {
    setTimer((timer) => timer + 1);
  };

  useEffect(() => {
    const task = async () => {
      Cookies.set("timer", timer);
      const res = await axios.get(
        `http://localhost:3000/api/specific/${timer}`
      );
      console.log(res);
      setCurrentData(res.data);
    };
    task();
  }, [timer]);
  const task2 = async () => {
    const res2 = await axios.get("http://localhost:3000/api/all");
    setData(res2.data);
    const f = Array.from(new Set(res2.data.map((item) => item.squad)));
    setFilters(f);
    console.log(f);
    setFilteredData(res2.data);
  };
  useEffect(() => {
    task2();
  }, []);

  const sub = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/api/add", data);
      console.log(res);

      task2();
    } catch (error) {
      console.log(error.message);
    }
  };

  const clearTimer = () => {
    clearInterval(currentInterval);
  };

  const startTimer = () => {
    console.log("working");
    intervalId = setInterval(() => {
      increaseTime();
    }, 1000);
    setcurrentInterval(intervalId);
  };
  const stopTimer = () => {
    setIsStopped((prev) => !prev);
    clearTimer();
    Cookies.remove("timer");
  };

  const handleFilter = (e) => {
    const newData = data.filter((item) =>
      e.target.value == "All" ? true : item.squad == e.target.value
    );
    setFilteredData(newData);
  };

  return (
    <div className="container">
      <div className="timer">
        {!isStopped ? (
          <div>
            <h1>
              Count :
              <span style={{ color: timer % 2 != 0 ? "green" : "red" }}>
                {timer}
              </span>
            </h1>
            <button onClick={startTimer}>Play</button>
            <button onClick={clearTimer}>Pause</button>
            <button onClick={stopTimer}>Stop</button>
          </div>
        ) : (
          <h1>
            The timer has stopped with final count{" "}
            <span style={{ color: timer % 2 != 0 ? "green" : "red" }}>
              {timer}
            </span>
          </h1>
        )}
        {currentData && <Card currentData={currentData} />}
      </div>
      <div className="datas">
        {filteredData && (
          <div className="data">
            {filteredData.map((item, i) => (
              <Card key={i} currentData={item} />
            ))}
          </div>
        )}
        <select onChange={handleFilter}>
          <option>All</option>
          {filters &&
            filters.map((item, i) => (
              <option value={item} key={i}>
                {item}
              </option>
            ))}
        </select>
      </div>
      <div>
        <form onSubmit={handleSubmit(sub)}>
          <input
            type="text"
            placeholder="name"
            {...register("name", { required: "name is must" })}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
          <input
            type="number"
            placeholder="squad"
            {...register("squad", { required: "squad is must" })}
          />
          {errors.squad && (
            <p style={{ color: "red" }}>{errors.squad.message}</p>
          )}
          <input
            type="number"
            placeholder="id"
            {...register("id", { required: "id is must" })}
          />
          {errors.id && <p style={{ color: "red" }}>{errors.id.message}</p>}
          <button type="submit">post</button>
        </form>
      </div>
    </div>
  );
};

export default App;
