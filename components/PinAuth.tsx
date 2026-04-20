import React, { useState, useEffect, useRef } from 'react';
import { Lock, Heart, ArrowRight } from 'lucide-react';

interface PinAuthProps {
  children: React.ReactNode;
  correctPin: string;
}

const PinAuth: React.FC<PinAuthProps> = ({ children, correctPin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const authStatus = localStorage.getItem('guest_auth_pin');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    setError(false);
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check PIN if all digits entered
    if (index === 3 && value !== '') {
      checkPin(newPin.join(''));
    } else if (newPin.every(digit => digit !== '')) {
       checkPin(newPin.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && pin[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const checkPin = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      localStorage.setItem('guest_auth_pin', 'true');
      setTimeout(() => setIsAuthenticated(true), 300);
    } else {
      setError(true);
      setTimeout(() => setPin(['', '', '', '']), 500);
      setTimeout(() => inputRefs.current[0]?.focus(), 550);
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen w-full bg-wedding-bg flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-wedding-primary opacity-10 blur-3xl"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-wedding-secondary opacity-10 blur-3xl"></div>
      </div>

      <div className="z-10 bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[40px] shadow-2xl max-w-md w-[90%] flex flex-col items-center border border-white">
        
        <div className="mb-8 relative flex items-center justify-center">
            <div className="absolute animate-ping w-16 h-16 rounded-full bg-wedding-primary/20"></div>
            <div className="w-16 h-16 bg-wedding-primary text-white rounded-full flex items-center justify-center z-10 shadow-lg">
                <Lock size={28} />
            </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-cursive text-wedding-primary mb-2 text-center">শুকরিয়া</h2>
        <p className="text-slate-500 mb-10 text-center text-sm md:text-base px-4">
          অনুগ্রহ করে আমন্ত্রণে থাকা ৪-ডিজিটের পিন কোডটি প্রবেশ করান।
        </p>

        <div className="flex gap-4 sm:gap-6 justify-center mb-8">
          {pin.map((digit, index) => (
             <input
               key={index}
               ref={el => inputRefs.current[index] = el}
               type="text"
               inputMode="numeric"
               maxLength={1}
               value={digit}
               onChange={(e) => handleChange(index, e.target.value)}
               onKeyDown={(e) => handleKeyDown(index, e)}
               className={`w-14 h-16 sm:w-16 sm:h-20 text-center text-3xl font-bold rounded-2xl border-2 transition-all outline-none bg-white
                ${error ? 'border-red-500 text-red-500 animate-shake bg-red-50' : 
                  digit ? 'border-wedding-primary text-wedding-primary bg-wedding-primary/5 shadow-[0_0_15px_rgba(131,24,67,0.1)]' : 
                  'border-slate-200 text-slate-800 hover:border-slate-300 focus:border-wedding-primary focus:ring-4 focus:ring-wedding-primary/20'}`}
             />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm font-medium animate-fade-in absolute bottom-8">
            ভুল পিন কোড! দয়া করে আবার চেষ্টা করুন।
          </p>
        )}
      </div>
      
      <div className="absolute bottom-8 text-center opacity-60 text-sm font-medium text-slate-500">
        <p className="flex items-center justify-center gap-1">Made with <Heart size={14} className="text-wedding-primary fill-wedding-primary" /> for the lovely couple</p>
      </div>
    </div>
  );
};

export default PinAuth;
