type CardProps = {
  title: string;
  value: string;
  description?: string;
};

export default function Card({ title, value, description }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 w-72 text-center">
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{title}</h3>
      <p className="text-2xl font-bold mb-2 text-blue-600">{value}</p>
      {description && <p className="text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  );
}