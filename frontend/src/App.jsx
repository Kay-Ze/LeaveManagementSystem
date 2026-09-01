import './index.css'
import SideBar from './components/SideBar'

const App = () => {
  return (
    <div id='main_page'>
      <div
      className='flex h-screen'>
        <SideBar/>
        <div
        className='h-full/ w-400 mr-3 my-3 bg-white/90  rounded-4xl'>
        </div>
      </div>
    </div>
  )
}

export default App
