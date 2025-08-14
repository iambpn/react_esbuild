import { useState } from "react";
import { createRoot } from "react-dom/client";

const Greet = () => {
  const [val, setVal] = useState<number>(0);
  return (
    <div>
      <h1>hello world, {val}</h1>
      <button onClick={() => setVal((val) => (val += 1))}>Click Me</button>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<Greet />);
