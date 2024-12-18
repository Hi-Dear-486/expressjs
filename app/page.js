"use client";
import { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const custom = async () => {
      try {
        const response = await  fetch("/api/custom");
        const data = await response.json();
        setData(data);
        alert("successfull data fetch");
      } catch (error) {
        console.log("🚀 ~ custom ~ error:", error.message);
      }
    };
    custom();
  }, []);
  return (
    <div>
      <h1>Welcome to my Next.js app!</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Home;
