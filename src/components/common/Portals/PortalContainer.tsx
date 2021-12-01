import { useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Portal from '.';

interface Props {
  onClose: () => void;
  children: any;
}

const PortalContainer = ({ onClose, children }: Props) => {
  const portalRef = useRef<HTMLDivElement>(null);

  const onOutsideClick = useCallback(
    (e) => !portalRef.current?.contains(e.target) && onClose(),
    [onClose]
  );
  const onEscClick = useCallback((e) => e.key === 'Escape' && onClose(), [onClose]);

  useEffect(() => {
    window.addEventListener('click', onOutsideClick);
    window.addEventListener('keydown', onEscClick);

    return () => {
      window.removeEventListener('click', onOutsideClick);
      window.removeEventListener('keydown', onEscClick);
    };
  });

  return (
    <Portal>
      <Background>
        <Overlay>{children}</Overlay>
      </Background>
    </Portal>
  );
};

const Background = styled.div`
  position: fixed;
  z-index: 1000;
  text-align: center;
  background-color: rgba(145, 145, 145, 0.5);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: auto;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
  border-radius: 4px;
`;
export default PortalContainer;
