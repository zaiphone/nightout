import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Form from './pages/Form'
import Results from './pages/Results'
import Saved from './pages/Saved'

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/plan"    element={<Form />} />
        <Route path="/results" element={<Results />} />
        <Route path="/saved"   element={<Saved />} />
      </Routes>
    </>
  )
}
