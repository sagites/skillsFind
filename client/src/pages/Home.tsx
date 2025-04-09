import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md gap-3">
      Home
      <Button>Home Button</Button>

      <Link to="/signin">Sign In</Link>
    
    </div>
  )
}

export default Home