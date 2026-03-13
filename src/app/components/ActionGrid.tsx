'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ElementType } from 'react';

interface Action {
  title: string;
  icon: ElementType;
  route: string;
}

interface ActionGridProps {
  actions: Action[];
}

export default function ActionGrid({ actions }: ActionGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <motion.button
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => router.push(action.route)}
            className="bg-[#2C2C2C] rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-[#3C3C3C] transition-all border border-gray-800"
          >
            <div className="p-2 bg-[#F6A100] bg-opacity-20 rounded-full">
              <IconComponent className="text-[#F6A100]" size={22} />
            </div>
            <span className="text-xs font-medium text-white text-center">
              {action.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}