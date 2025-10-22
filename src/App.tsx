import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import PerYear from './pages/PerYear'
import PerStatus from './pages/PerStatus'
import PerDepartment from './pages/PerDepartment'
import PerWard from './pages/PerWard'
import WardDetails from './pages/WardDetails'  
import ProjectDetails from './pages/ProjectDetails'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
     
      <Navbar />

      
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/per-year" element={<PerYear />} />
          <Route path="/per-status" element={<PerStatus />} />
          <Route path="/per-department" element={<PerDepartment />} />

        
          <Route path="/per-ward" element={<PerWard />} />
          <Route path="/per-ward/:wardId" element={<WardDetails />} />

         
          <Route path="/project/:id" element={<ProjectDetails />} />

         
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

     
      <Footer />
    </div>
  )
}

export default App
