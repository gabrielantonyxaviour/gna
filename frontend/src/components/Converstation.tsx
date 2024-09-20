import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
interface Message {
    speaker: string;
    text: string;
    }
const RetroConversationComponent = () => {
  const [currentSpeaker, setCurrentSpeaker] = useState('npc1');
  const [playerInput, setPlayerInput] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    { speaker: 'Nakamura', text: 'Hello, traveasdasasler!' },
    { speaker: 'npc2', text: 'Welcome to our village.' },
  ]);
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const currentMessageIndex = useRef(0);

  useEffect(() => {
    if (currentMessageIndex.current < conversation.length) {
      animateText(conversation[currentMessageIndex.current].text);
    }
  }, [conversation, currentMessageIndex.current]);

  const animateText = (text:any) => {
    setIsAnimating(true);
    let i = 0;
    setDisplayedText('');
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 50);  // Adjust this value to change the speed of text appearance
  };

  const handlePlayerInput = (e:any) => {
    setPlayerInput(e.target.value);
  };

  const handleSubmit = () => {
    if (playerInput.trim() && !isAnimating) {
      const newMessage = { speaker: 'player', text: playerInput };
      setConversation(prev => [...prev, newMessage]);
      setPlayerInput('');
      setCurrentSpeaker('npc' + Math.floor(Math.random() * 2 + 1));
      currentMessageIndex.current = conversation.length;
    }
  };

  const handleDialogueClick = () => {
    if (!isAnimating) {
      if (currentMessageIndex.current < conversation.length - 1) {
        currentMessageIndex.current++;
        animateText(conversation[currentMessageIndex.current].text);
        setCurrentSpeaker(conversation[currentMessageIndex.current].speaker);
      }
    } else {
      // If text is animating, show full text immediately
      setIsAnimating(false);
      setDisplayedText(conversation[currentMessageIndex.current].text);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-1 bg-[#020817] border-2 border-gray-600 text-white rounded-sm">
      <div className="flex w-full mb-4 space-x-4">
        <div className={`character flex-shrink-0 ${currentSpeaker === 'npc1' ? 'speaking' : ''}`}>
          <img src="/nouns/helperguy.png" alt="NPC 1" className="rounded-lg" />
        </div>
        <div 
          onClick={handleDialogueClick}
          className="flex-grow p-1 bg-[#161D2A] rounded flex flex-col justify-center cursor-pointer"
        >
            <div className='p-3'>{displayedText}</div>
        </div>
        <div className={`character flex-shrink-0 ${currentSpeaker === 'npc2' ? 'speaking' : ''}`}>
          <img src="/nouns/bouncer.png" alt="NPC 2" className="rounded-lg" />
        </div>
      </div>
      <div className="flex w-full">
        <Input
          type="text"
          value={playerInput}
          onChange={handlePlayerInput}
          placeholder="Type your response..."
          className="flex-grow mr-2"
          disabled={isAnimating}
        />
        <Button onClick={handleSubmit} disabled={isAnimating}>Send</Button>
      </div>
      <style jsx>{`
        .character {
          transition: all 0.3s ease;
          opacity: 0.6;
        }
        .character.speaking {
          opacity: 1;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default RetroConversationComponent;