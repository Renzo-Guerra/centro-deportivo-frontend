import { Toaster } from 'react-hot-toast'
import './App.css'

function App() {

  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={
        {
          duration: 3000,
        }
      }
    />
  )
}

export default App
