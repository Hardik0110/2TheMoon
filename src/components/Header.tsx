import { Rocket, Search } from 'lucide-react';

const Header = () => {

  return (
    <header className="bg-black/30 backdrop-blur-sm border-b border-purple-500/20 py-5">
      
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              2TheMoon
            </span>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search coins..."
              className="w-64 px-4 py-2 rounded-full bg-purple-900/30 border border-blue-500/30 focus:outline-none focus:border-blue-400 text-white placeholder-blue-300"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-blue-400" />
          </div>
        </div>
      
    </header>
  );
};

export default Header;