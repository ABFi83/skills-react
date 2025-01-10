import "./App.css";
import Header from "./Components/Header/Header";
import Main from "./Components/Main/Main";
import { User } from "./Interfaces/User";
function App() {
  const user: User = { id: "1", username: "Alessio" };

  return (
    <>
      <Header user={user} />
      <Main user={user} />
      {/* Other components or content */}
    </>
  );
}

export default App;
