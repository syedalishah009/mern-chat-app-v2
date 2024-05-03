import React from "react";
import Chat from "./pages/Chat";
import  { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
    <Toaster/>
      <Chat />
    </>
  );
};

export default App;
