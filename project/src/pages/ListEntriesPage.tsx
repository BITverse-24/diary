import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, Search, SlidersHorizontal, LogOut } from 'lucide-react';
// import { useDiary } from '../context/DiaryContext';
// import { useAuth } from '../context/AuthContext';
import { useStateManager } from "../../lib/StateContext";
import { get } from "../../lib/dynamodb"

const ListEntriesPage = () => {
  const navigate = useNavigate();
  // const { entries } = useDiary();
  // const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [entries, setEntries] = useState<{ 
    title: string, 
    content: string, 
    createdAt: Date, 
    characters: number
  }[]>([]);
	const { state, dispatch } = useStateManager();
	const { password } = state;
	// if (!password) return <div>Loading...</div>
  const now = new Date();
  const placeholderEntries = [
    {
      title: "One",
      content: "Content of One",
      createdAt: now,
      characters: 10
    },
    {
      title: "Two",
      content: "Content of One",
      createdAt: now,
      characters: 10
    },
    {
      title: "Three",
      content: "Content of One",
      createdAt: now,
      characters: 10
    }
  ];

  useEffect(() => {
		// async function sync() {
		// 	const res = await get(password);
		// 	setEntries(res ?? []);
		// 	dispatch(
		// 		{
		// 			type: "ENTRY",
		// 			payload: res,
		// 		}
		// 	,)
		// }

		// sync();
    setEntries(placeholderEntries);
	}, [])

  const filteredEntries = entries
    .filter(entry => 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const handleLogout = () => {
    // logout();
    dispatch({ type: "PASSWORD", payload: null });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/new')}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-[#1E1E1E] rounded hover:bg-[#FFE55C] transition-colors"
          >
            <Plus size={20} /> New Entry
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]" size={20} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] text-[#FFD700] rounded border border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            />
          </div>
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-[#FFD700] rounded hover:bg-[#3A3A3A] transition-colors"
          >
            <SlidersHorizontal size={20} /> Sort by
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[#2A2A2A] text-[#FFD700] rounded hover:bg-[#3A3A3A] transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry, index) => (
            <div
              key={index}
              onClick={() => navigate(`/entry/${index}`)}
              className="bg-[#2A2A2A] p-4 rounded-lg cursor-pointer hover:bg-[#3A3A3A] transition-colors"
            >
              <h2 className="text-xl text-[#FFD700] mb-2">{entry.title}</h2>
              <p className="text-[#FFD700] opacity-70 mb-4 line-clamp-2">{entry.content}</p>
              <div className="flex justify-between text-sm text-[#FFD700] opacity-50">
                <span>Created: {format(new Date(entry.createdAt), 'MM/dd/yy')}</span>
                <span>Characters: {entry.characters}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListEntriesPage;