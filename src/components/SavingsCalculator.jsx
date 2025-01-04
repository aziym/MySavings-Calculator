import React, { useState, useEffect } from 'react';
import { Target, Calendar, CircleDollarSign, Coins, Moon, Sun, TrendingUp } from 'lucide-react';

const SavingsCalculator = () => {
  const [targetAmount, setTargetAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [calculations, setCalculations] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const formatRM = (amount) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateSavings = () => {
    setError('');
    if (!monthlyIncome || !targetAmount || !duration) {
      setCalculations(null);
      return;
    }

    const income = parseFloat(monthlyIncome);
    const target = parseFloat(targetAmount);
    const months = parseFloat(duration);

    const requiredMonthlySavings = target / months;
    const minimumSavingsRate = requiredMonthlySavings / income;
    
    if (minimumSavingsRate > 0.8) {
      setError(`To reach your target of ${formatRM(target)} in ${months} months, you would need to save more than 80% of your income. Consider adjusting your target or timeline.`);
      return;
    }

    const savingsRates = [0.8, 0.5, 0.3, 0.2, 0.1];
    
    const results = savingsRates.map(rate => {
      const monthlySavings = income * rate;
      const monthlyExpense = income - monthlySavings;
      const weeklyExpense = monthlyExpense / 4;
      const dailyExpense = monthlyExpense / 30;
      const totalSavingsAtEnd = monthlySavings * months;
      const percentageOfTarget = (totalSavingsAtEnd / target) * 100;

      return {
        rate: rate * 100,
        monthly: monthlyExpense,
        weekly: weeklyExpense,
        daily: dailyExpense,
        savings: monthlySavings,
        totalSavingsAtEnd,
        percentageOfTarget: Math.min(percentageOfTarget, 100),
        achievesTarget: totalSavingsAtEnd >= target
      };
    });

    setCalculations(results);
  };

  useEffect(() => {
    calculateSavings();
  }, [monthlyIncome, targetAmount, duration]);

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500 dark:bg-green-400';
    if (percentage >= 75) return 'bg-yellow-500 dark:bg-yellow-400';
    return 'bg-red-500 dark:bg-red-400';
  };

  const getCardBorderColor = (percentage) => {
    if (percentage >= 100) return 'border-green-200 dark:border-green-800';
    if (percentage >= 75) return 'border-yellow-200 dark:border-yellow-800';
    return 'border-red-200 dark:border-red-800';
  };

  const getBadgeColor = (achievesTarget) => {
    return achievesTarget 
      ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
      : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200';
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 p-4 md:p-8 transition-all duration-300">
      {/* Dark Mode Toggle */}
      <div className="sticky top-0 z-50 flex justify-end mb-4">
        <button
          className="p-2 hover:rotate-90 transition-transform duration-300 bg-white dark:bg-gray-800 shadow-lg
                    rounded-full w-10 h-10 flex items-center justify-center"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-purple-600" />
          )}
        </button>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 space-y-8 transition-all duration-300
                      hover:shadow-xl transform hover:-translate-y-1 border border-purple-100 dark:border-blue-900">
          {/* Header */}
          <div className="flex items-center justify-center space-x-3">
            <Coins className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent
                          hover:scale-105 transition-transform duration-300">
              Savings Calculator
            </h1>
          </div>

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Target Amount (RM)
              </label>
              <div className="relative group">
                <Target className="absolute left-3 top-2.5 h-5 w-5 text-purple-500 dark:text-purple-400" />
                <input
                  type="number"
                  placeholder="Enter target amount"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-200 dark:border-purple-900 
                           dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                           outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Duration (months)
              </label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-purple-500 dark:text-purple-400" />
                <input
                  type="number"
                  placeholder="Enter duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-200 dark:border-purple-900 
                           dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                           outline-none transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Monthly Income (RM)
              </label>
              <div className="relative group">
                <CircleDollarSign className="absolute left-3 top-2.5 h-5 w-5 text-purple-500 dark:text-purple-400" />
                <input
                  type="number"
                  placeholder="Enter monthly income"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-purple-200 dark:border-purple-900 
                           dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 
                           outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {calculations && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 
                            dark:from-purple-400 dark:to-blue-400 flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Savings Scenarios
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {calculations.map((calc, index) => (
                  <div
                  key={index}
                  className={`relative bg-gray-900/90 dark:bg-gray-800/90 
                            rounded-xl p-6 transform transition-all duration-300 hover:scale-105 shadow-lg
                            hover:shadow-xl border ${getCardBorderColor(calc.percentageOfTarget)}`}
                  onClick={() => setActiveTab(index)}
                >
                  <div className="absolute top-0 left-0 h-1 w-full rounded-t-xl overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(calc.percentageOfTarget)} transition-all duration-500`}
                      style={{ width: `${calc.percentageOfTarget}%` }}
                    />
                  </div>

                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                      {calc.rate}% Savings
                      <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(calc.achievesTarget)}`}>
                        {calc.achievesTarget ? 'Reaches Target' : 'Below Target'}
                      </span>
                    </h4>
                    <p className="text-lg text-purple-400 font-semibold">
                      Monthly Savings: {formatRM(calc.savings)}
                    </p>
                    <p className="text-sm text-gray-300">
                      Total After {duration} months: {formatRM(calc.totalSavingsAtEnd)}
                      <br />
                      ({calc.percentageOfTarget.toFixed(1)}% of target)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Monthly Budget:</span>
                      <span className="font-semibold text-gray-100">{formatRM(calc.monthly)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Weekly Budget:</span>
                      <span className="font-semibold text-gray-100">{formatRM(calc.weekly)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300">Daily Budget:</span>
                      <span className="font-semibold text-gray-100">{formatRM(calc.daily)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
};

export default SavingsCalculator;