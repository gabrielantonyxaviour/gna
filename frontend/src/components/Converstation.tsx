import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
    speaker: string;
    text: string;
}

interface RetroConversationComponentProps {
    npc2: string;
}

const RetroConversationComponent: React.FC<RetroConversationComponentProps> = ({ npc2 }) => {
  const [currentSpeaker, setCurrentSpeaker] = useState('Hero');
  const [playerInput, setPlayerInput] = useState('');
  const [conversation, setConversation] = useState<Message[]>([
    { speaker: 'Hero', text: 'Hello there!' },
  ]);
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const currentMessageIndex = useRef(0);

  const getNpcDialogue = (npcName: string): string => {
    switch (npcName) {
      case 'zombie':
        return "Braaains... I mean, hello there!";
      case 'satoshi':
        return "Welcome to the world of cryptocurrency. How can I assist you?";
      case 'helper':
        return "Greetings! I'm here to help. What do you need?";
      case 'baddie':
        return "Well, well, well... What do we have here?";
      case 'kai cenat':
        return "Yo, what's good? Ready to stream some chaos?";
      case 'bouncer':
        return "Hold it right there. Are you on the list?";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (currentMessageIndex.current < conversation.length) {
      animateText(conversation[currentMessageIndex.current].text);
      setCurrentSpeaker(conversation[currentMessageIndex.current].speaker);
    }
  }, [conversation, currentMessageIndex.current]);

  useEffect(() => {
    if (npc2 && npc2 !== '') {
      const npcDialogue = getNpcDialogue(npc2);
      if (npcDialogue) {
        const newMessage = { speaker: npc2, text: npcDialogue };
        setConversation(prev => [...prev, newMessage]);
        currentMessageIndex.current = conversation.length;
      }
    }
  }, [npc2]);

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
      const newMessage = { speaker: 'Hero', text: playerInput };
      setConversation(prev => [...prev, newMessage]);
      setPlayerInput('');
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
        <div className={`character flex-shrink-0 ${currentSpeaker === 'Hero' ? 'speaking' : ''}`}>
          <img src="/nouns/hero.png" alt="Hero" className="rounded-lg" />
        </div>
        <div 
          onClick={handleDialogueClick}
          className="flex-grow p-1 bg-[#161D2A] rounded flex flex-col justify-center cursor-pointer"
        >
            <div className={`flex flex-col ${currentSpeaker !== 'Hero' ? 'items-end' : 'items-start'}`}>
              <span className="text-yellow-400 font-bold mb-1">
                {currentSpeaker}
              </span>
              <div className={`p-3 bg-[#0d1117] rounded ${currentSpeaker !== 'Hero' ? 'text-right' : 'text-left'}`}>
                {displayedText}
              </div>
            </div>
        </div>
        <div className={`character flex-shrink-0 ${currentSpeaker !== 'Hero' ? 'speaking' : ''}`}>
          {npc2 !== '' && <img src={`/nouns/${npc2}.png`} alt={npc2} className="rounded-lg" />}
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