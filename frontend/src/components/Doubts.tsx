import React, { useState } from 'react';
import axios from 'axios';

interface AskSatoshiButtonProps {
  className?: string;
}

const AskSatoshiButton: React.FC<AskSatoshiButtonProps> = ({ className }) => {
  const [showInput, setShowInput] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [satoshiReply, setSatoshiReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
    const [converstationHistory, setConversationHistory] = useState<string[]>([]);
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/ai/ask-satoshi?query=${[...converstationHistory, userInput]}`);
        setSatoshiReply(response.data.data.message);
        setConversationHistory([...converstationHistory, userInput]);
      } catch (error) {
        console.error('Error getting Satoshi\'s response:', error);
        setSatoshiReply('Sorry, I encountered an error while processing your question.');
      }
      setIsLoading(false);
      setUserInput('');
    }
  };

  return (
    <div className={`${className}`}>
      <button 
        onClick={() => setShowInput(!showInput)}
        className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition-transform transform hover:scale-105"
        aria-label="Ask Satoshi"
      >
        <span className="text-white font-bold">Ask Satoshi</span>
        <div className="w-16 h-16 rounded-full border-4 bg-gray-200 overflow-hidden">
          <img src="/nouns/satoshi.png" alt="Satoshi" className="w-full h-full object-cover" />
        </div>
      </button>
      
      {showInput && (
        <div className="mt-4 w-96 bg-[#020817] border-2 border-gray-600 text-white rounded-sm p-4 z-10 absolute ">
          <form onSubmit={handleSubmitQuestion} className="flex flex-col space-y-2">
            <input
              type="text"
              value={userInput}
              onChange={handleUserInput}
              onKeyDown={(e) => {
                if (e.key === ' ') {
                  e.stopPropagation();
                }
              }}
              className="p-2 bg-[#161D2A] rounded text-white"
              placeholder="Ask Satoshi a question..."
            />
            <button 
              type="submit" 
              className="px-4 py-2 bg-yellow-500 text-black rounded font-bold"
              disabled={isLoading}
            >
              {isLoading ? 'Asking...' : 'Ask'}
            </button>
          </form>
          
          {satoshiReply && (
            <div className="mt-4">
              <h3 className="text-yellow-400 font-bold mb-2">Satoshi's Reply:</h3>
              <p className="bg-[#0d1117] p-3 rounded">{satoshiReply}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AskSatoshiButton;