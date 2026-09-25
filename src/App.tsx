import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import Prediction from './pages/Prediction'
import Markets from './pages/Markets'
import History from './pages/History'
import Intelligence from './pages/Intelligence'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Prediction />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/history" element={<History />} />
          <Route path="/intelligence" element={<Intelligence />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
