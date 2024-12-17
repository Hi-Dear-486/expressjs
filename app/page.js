"use client";
import { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState(null);
  console.log("🚀 ~ Home ~ data:", data);

  useEffect(() => {
    fetch("/api/custom")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>Welcome to my Next.js app!</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Home;
