import { useState } from "react";

interface UseSwipeInteractionProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  threshold?: number;
}

export const useSwipeInteraction = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: UseSwipeInteractionProps) => {
  const [isSwipeStarted, setIsSwipeStarted] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handleSwipeStart = (clientX: number) => {
    setIsSwipeStarted(true);
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleSwipeMove = (clientX: number) => {
    if (!isSwipeStarted) return;
    setCurrentX(clientX);
  };

  const handleSwipeEnd = () => {
    if (!isSwipeStarted) return;

    const diffX = currentX - startX;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }

    setIsSwipeStarted(false);
    setStartX(0);
    setCurrentX(0);
  };

  const mouseHandlers = {
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault();
      handleSwipeStart(e.clientX);
    },
    onMouseMove: (e: React.MouseEvent) => {
      e.preventDefault();
      handleSwipeMove(e.clientX);
    },
    onMouseUp: (e: React.MouseEvent) => {
      e.preventDefault();
      handleSwipeEnd();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      e.preventDefault();
      handleSwipeEnd();
    },
  };

  const touchHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      handleSwipeStart(e.touches[0].clientX);
    },
    onTouchMove: (e: React.TouchEvent) => {
      handleSwipeMove(e.touches[0].clientX);
    },
    onTouchEnd: () => {
      handleSwipeEnd();
    },
  };

  return {
    isSwipeStarted,
    swipeHandlers: {
      ...mouseHandlers,
      ...touchHandlers,
    },
  };
};