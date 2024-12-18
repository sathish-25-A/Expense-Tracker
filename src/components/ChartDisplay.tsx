import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Entry = {
  id: number;
  date: string;
  type: 'Income' | 'Expense'; // Ensure type is 'Income' or 'Expense'
  amount: number;
};

const ChartDisplay = ({
  entries,
  incomeColor = '#4CAF50', // Default green color for Income
  expenseColor = '#e74c3c', // Default red color for Expense
}: {
  entries: Entry[];
  incomeColor?: string;
  expenseColor?: string;
}) => {
  // Aggregate data for the chart (group by date)
  const data = entries.reduce(
    (acc: Record<string, { Income: number; Expense: number }>, { date, type, amount }) => {
      // Initialize the date object if it doesn't exist
      if (!acc[date]) acc[date] = { Income: 0, Expense: 0 };
      // Safely increment either Income or Expense based on the type
      acc[date][type] += amount;
      return acc;
    },
    {}
  );

  // Sort dates in chronological order
  const sortedDates = Object.keys(data).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Prepare chart data structure
  const chartData = {
    labels: sortedDates.map((date) => new Date(date).toLocaleDateString()), // Format dates
    datasets: [
      {
        label: 'Income',
        data: sortedDates.map((date) => data[date].Income),
        backgroundColor: incomeColor, // Customizable income color
        stack: 'stack1', // Separate stack for Income
      },
      {
        label: 'Expense',
        data: sortedDates.map((date) => data[date].Expense),
        backgroundColor: expenseColor, // Customizable expense color
        stack: 'stack2', // Separate stack for Expense
      },
    ],
  };

  // Define the options type explicitly
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false, // Ensure responsiveness
    plugins: {
      title: {
        display: true,
        text: 'Income vs Expense Chart', // Chart title
      },
      tooltip: {
        callbacks: {
          // Format tooltip labels
          label: function (context) {
            return `${context.dataset.label}: ₹${context.raw?.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false, // Disable stacking for x-axis to ensure bars are side by side
        title: {
          display: true,
          text: 'Dates', // Label for the x-axis
        },
      },
      y: {
        stacked: false, // Disable stacking for y-axis to ensure clear value separation
        title: {
          display: true,
          text: 'Amount (₹)', // Label for the y-axis
        },
        ticks: {
          callback: (value) => `₹${value}`, // Format y-axis ticks
        },
      },
    },
  };

  // Handle case where there are no entries
  if (entries.length === 0) {
    return <p>No data available to display.</p>;
  }

  return (
    <div className="chart-container" style={{ position: 'relative', height: '400px', width: '100%' }}>
      <h2>Income vs Expense Chart</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartDisplay;
