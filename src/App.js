import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [dbTest, setDbTest] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`http://localhost:4000/test`, {})
        .then((res) => {
          console.log(res.data);
          setDbTest(res.data[0].list_no);
        })
        .catch((error) => console.log(error.response));
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      {dbTest}
    </div>
  );
}

export default App;
