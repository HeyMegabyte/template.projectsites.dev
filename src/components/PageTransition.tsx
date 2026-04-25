import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState(children);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      setContent(children);
      setVisible(true);
    }, 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    setContent(children);
  }, [children]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition:
          'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {content}
    </div>
  );
}
