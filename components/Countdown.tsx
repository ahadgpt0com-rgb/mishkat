import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDateStr: string;
}

const Countdown: React.FC<CountdownProps> = ({ targetDateStr }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(targetDateStr).getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateStr]);

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center mx-2 md:mx-6">
      <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 shadow-lg">
        <span className="text-2xl md:text-4xl font-bold text-white">
          {value < 10 ? `0${value}` : value}
        </span>
      </div>
      <span className="mt-2 text-sm md:text-base text-white uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );

  return (
    <section className="py-16 bg-wedding-primary">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-cursive text-white mb-8">বিয়ের আর বাকি মাত্র</h2>
        <div className="flex flex-wrap justify-center">
          <TimeBox value={timeLeft.days} label="দিন" />
          <TimeBox value={timeLeft.hours} label="ঘণ্টা" />
          <TimeBox value={timeLeft.minutes} label="মিনিট" />
          <TimeBox value={timeLeft.seconds} label="সেকেন্ড" />
        </div>
      </div>
    </section>
  );
};

export default Countdown;