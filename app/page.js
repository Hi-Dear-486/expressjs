"use client";
import { useEffect, useState } from "react";

const Home = () => {
  const [data, setData] = useState(null);
  const [authentication, setAutentication] = useState(null);
  console.log("🚀 ~ Home ~ authentication:", authentication);

  useEffect(() => {
    const custom = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setData(data);
        alert("successfull data fetch");
      } catch (error) {
        console.log("🚀 ~ custom ~ error:", error.message);
      }
    };
    custom();
  }, []);

  useEffect(() => {
    const userAuth = async () => {
      try {
        const response = await fetch("/");
        const data = await response.json();
        setAutentication(data);
        alert("successfull data fetch");
      } catch (error) {
        console.log("🚀 ~ custom ~ error:", error.message);
      }
    };
    userAuth();
  }, []);
  return (
    <div>
      <h1>Welcome to my Next.js app!</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};

export default Home;
