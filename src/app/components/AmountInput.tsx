interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  onMax?: () => void;
  placeholder?: string;
  label?: string;
  showMax?: boolean;
  type?: 'crypto' | 'fiat';
}

export default function AmountInput({
  value,
  onChange,
  onMax,
  placeholder = '0.00',
  label = 'Amount',
  showMax = true,
  type = 'crypto'
}: AmountInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-gray-400 text-sm block">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#2C2C2C] text-white text-2xl font-bold rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#F6A100]"
        />
        {showMax && onMax && (
          <button 
            onClick={onMax}
            className="absolute right-4 top-4 text-[#F6A100] text-sm font-semibold"
          >
            MAX
          </button>
        )}
      </div>
      {type === 'crypto' && value && (
        <p className="text-gray-400 text-sm">
          ≈ ₦{(parseFloat(value) * 1600).toLocaleString()}
        </p>
      )}
    </div>
  );
}