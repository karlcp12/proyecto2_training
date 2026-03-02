interface ButtonProps {
  text: string;
  onClick?: () => void;
}

export const Button = ({ text, onClick }: ButtonProps) => (
<button 
    onClick={onClick}
    style={{ backgroundColor: '#44a000', color: 'white', width: '100%', borderRadius: '8px', padding: '12px' }}
>
    {text}
</button>
);