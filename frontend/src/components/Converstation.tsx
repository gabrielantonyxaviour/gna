import React, { useState, useEffect, useRef } from 'react';

interface Message {
    id: number;
    characterId: number;
    message: string;
}

const characterMap: {[key: number]: {name: string, image: string}} = {
  1: { name: 'Hero', image: '/nouns/hero.png' },
  2: { name: 'Satoshi', image: '/nouns/satoshi.png' },
  3: { name: 'Helper', image: '/nouns/helper.png' },
  4: { name: 'Zombie', image: '/nouns/zombie.png' }
};

interface RetroConversationComponentProps {
    npc2: string;
    mission: number;
}

const RetroConversationComponent: React.FC<RetroConversationComponentProps> = ({ npc2, mission }) => {
  const [currentDialogue, setCurrentDialogue] = useState<Message[]>([]);
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextSpeaker, setNextSpeaker] = useState<string | null>(null);
  const currentMessageIndex = useRef(0);

  const tutorialConvo: Message[] = [
    { id: 1, characterId: 2, message: "Hey Degen, Satoshi here, Welcome to Grand Nouns Auto, connect your Ledger to get started." },
    { id: 2, characterId: 2, message: "All your money lives in your Ledger. Each account has a unique address—kinda like your username, but for sending and receiving crypto. You can create more accounts if you want to organize your money." },
    { id: 3, characterId: 2, message: "Under the Tokens tab, you'll find all the cryptocurrencies you own. If you don't see a token you've bought, you might need to add it manually. But we'll cross that bridge when we get there." },
    { id: 4, characterId: 2, message: "The Activity tab shows all your past transactions. If you ever need to check what you've sent or received, this is where to look." },
    { id: 5, characterId: 2, message: "Now, let's talk about Buy & Send. When you want to get some crypto, hit the Buy button and follow the steps to fund your account. To send crypto to someone else, tap Send—just make sure you copy the recipient's address carefully. One wrong character, and it could end up in the wrong place." },
    { id: 6, characterId: 2, message: "Lastly, there's Swap. If you need to trade one token for another—like switching ETH for a different token—you can do that easily here." },
    { id: 7, characterId: 2, message: "And remember, the most important rule of all: Never, ever share your private key or recovery phrase. Keep them safe, and you'll be good to go. If you ever forget them, there's no recovery—so protect them like your most valuable treasure." },
    { id: 8, characterId: 2, message: "That's it for now! You're all set with Ledger and MetaMask. If you need help along the way about DeFi, just ask, and I'll be here to guide you. Ready to dive into the game?" }
  ];

  const initialConvo: Message[] = [
    { id: 1, characterId: 2, message: "Wake up Degen. We got a city to rule!" },
    { id: 2, characterId: 1, message: "This place has been through hell. It's time someone took charge — me." },
    { id: 3, characterId: 2, message: "Time to rattle a few cages. Take out the Unicorn Inch boss to make a name for yourself." },
    { id: 4, characterId: 3, message: "Who are you, I haven't seen you around here" },
    { id: 5, characterId: 2, message: "I'm here to finish the Unicorn Inch Boss" },
    { id: 6, characterId: 3, message: "Take 5 xDAI in Gnosis chain, Swap it to WETH with 0.1% slippage and show me your Aura." },
    { id: 7, characterId: 3, message: "Take this gun and End him for good." },
    { id: 8, characterId: 2, message: "Congratulations, Degen. This city bows to the real boss now." }
  ];

  const mission2Convo: Message[] = [
    { id: 1, characterId: 2, message: "Bad news, Degen. They've got your girl." },
    { id: 2, characterId: 1, message: "Not her… This city's gonna burn for this. But who's behind it?" },
    { id: 3, characterId: 2, message: "No clue, man. Last we heard, she was seen near the cemetery. Get moving — she's running out of time." },
    { id: 4, characterId: 4, message: "Raaawwwrrrr!" },
    { id: 5, characterId: 1, message: "What the hell is that?!" },
    { id: 6, characterId: 2, message: "Use that scanner, Degen. You'll need it to sweep the area." }
  ];

  const mission3Convo: Message[] = [
    { id: 1, characterId: 2, message: "This is it, kid. Time to settle the score. Go save her." },
    { id: 2, characterId: 4, message: "You're too late! I've rigged a bomb, and she's going down with it, Degen." },
    { id: 3, characterId: 2, message: "Well Well Well You did it, Degen. The city is yours now. Welcome to the throne of the Badlands." }
  ];

  useEffect(() => {
    switch(mission) {
      case 0:
        setCurrentDialogue(tutorialConvo);
        break;
      case 1:
        setCurrentDialogue(initialConvo);
        break;
      case 2:
        setCurrentDialogue(mission2Convo);
        break;
      case 3:
        setCurrentDialogue(mission3Convo);
        break;
      default:
        setCurrentDialogue(tutorialConvo);
    }
    currentMessageIndex.current = 0;
    checkAndDisplayMessage();
  }, [mission, npc2]);

  const animateText = (text: string) => {
    setIsAnimating(true);
    let i = 0;
    const animate = () => {
      if (i < text.length) {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        setTimeout(animate, 20);  // Adjust this value to change the speed of text appearance
      } else {
        setIsAnimating(false);
      }
    };
    animate();
  };

  const checkAndDisplayMessage = () => {
    if (currentMessageIndex.current < currentDialogue.length) {
      const currentMessage = currentDialogue[currentMessageIndex.current];
      const currentCharacter = characterMap[currentMessage.characterId];
      if (currentCharacter.name.toLowerCase() === npc2.toLowerCase() || currentMessage.characterId === 1) {
        animateText(currentMessage.message);
        setNextSpeaker(null);
      } else {
        setDisplayedText('');
        const nextCharacter = characterMap[currentMessage.characterId];
        setNextSpeaker(nextCharacter.name);
      }
    } else {
      setNextSpeaker(null);
    }
  };

  const handleDialogueClick = () => {
    if (!isAnimating) {
      if (currentMessageIndex.current < currentDialogue.length - 1) {
        currentMessageIndex.current++;
        checkAndDisplayMessage();
      }
    } else {
      // If text is animating, show full text immediately
      setIsAnimating(false);
      setDisplayedText(currentDialogue[currentMessageIndex.current].message);
    }
  };

  const getCurrentCharacter = () => {
    if (currentDialogue.length > 0 && currentMessageIndex.current < currentDialogue.length) {
      const characterId = currentDialogue[currentMessageIndex.current].characterId;
      return characterMap[characterId] || characterMap[1]; // Default to Hero if character not found
    }
    return characterMap[1]; // Default to Hero
  };

  const currentCharacter = getCurrentCharacter();

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-1 bg-[#020817] border-2 border-gray-600 text-white rounded-sm">
      <div className="flex w-full mb-4 space-x-4">
        <div className={`character flex-shrink-0 ${currentCharacter.name === 'Hero' ? 'speaking' : ''}`}>
          <img src={characterMap[1].image} alt="Hero" className="rounded-lg" />
        </div>
        <div 
          onClick={handleDialogueClick}
          className="flex-grow p-1 bg-[#161D2A] rounded flex flex-col justify-center cursor-pointer"
        >
            {nextSpeaker ? (
              <div className="text-center text-yellow-400">
                Go find {nextSpeaker} to continue the mission.
              </div>
            ) : (
              <div className={`flex flex-col ${currentCharacter.name !== 'Hero' ? 'items-end' : 'items-start'}`}>
                <span className="text-yellow-400 font-bold mb-1">
                  {currentCharacter.name}
                </span>
                <div className={`p-3 bg-[#0d1117] rounded ${currentCharacter.name !== 'Hero' ? 'text-right' : 'text-left'}`}>
                  {displayedText}
                </div>
              </div>
            )}
        </div>
        <div className={`character flex-shrink-0 ${currentCharacter.name !== 'Hero' ? 'speaking' : ''}`}>
          {currentCharacter.name !== 'Hero' && <img src={currentCharacter.image} alt={currentCharacter.name} className="rounded-lg" />}
        </div>
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