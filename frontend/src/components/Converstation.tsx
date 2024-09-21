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
    { speaker: 'Nakamura', text: 'Hello, traveler!' },
    { speaker: 'npc2', text: 'Welcome to our village.' },
  ]);
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const currentMessageIndex = useRef(0);

  useEffect(() => {
    if (currentMessageIndex.current < conversation.length) {
      animateText(conversation[currentMessageIndex.current].text);
      setCurrentSpeaker(conversation[currentMessageIndex.current].speaker);
    }
  }, [conversation, currentMessageIndex.current]);

  const animateText = (text: string) => {
    setIsAnimating(true);
    let i = 0;
    const animate = () => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        setTimeout(animate, 50);  // Adjust this value to change the speed of text appearance
      } else {
        setIsAnimating(false);
      }
    };
    animate();
  };

  const handlePlayerInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const getSpeakerName = (speaker: string) => {
    switch (speaker) {
      case 'npc1':
      case 'Nakamura':
        return 'Nakamura';
      case 'npc2':
        return 'Bouncer';
      case 'player':
        return 'You';
      default:
        return speaker;
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-1 bg-[#020817] border-2 border-gray-600 text-white rounded-sm">
      <div className="flex w-full mb-4 space-x-4">
        <div className={`character flex-shrink-0 ${currentSpeaker === 'npc1' || currentSpeaker === 'Nakamura' ? 'speaking' : ''}`}>
          <img src="/nouns/hero.png" alt="NPC 1" className="rounded-lg" />
        </div>
        <div 
          onClick={handleDialogueClick}
          className="flex-grow p-1 bg-[#161D2A] rounded flex flex-col justify-center cursor-pointer"
        >
            <div className={`flex flex-col ${currentSpeaker === 'npc2' ? 'items-end' : 'items-start'}`}>
              <span className="text-yellow-400 font-bold mb-1">
                {getSpeakerName(currentSpeaker)}
              </span>
              <div className={`p-3 bg-[#0d1117] rounded ${currentSpeaker === 'npc2' ? 'text-right' : 'text-left'}`}>
                {displayedText}
              </div>
            </div>
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